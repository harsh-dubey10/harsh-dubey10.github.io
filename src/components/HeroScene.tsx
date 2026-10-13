import { useEffect, useRef, type RefObject } from 'react'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Clock, MathUtils, PerspectiveCamera, Points, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer } from 'three'

interface HeroSceneProps {
  /** Element the ember stream rises from (the campfire). */
  emitterRef: RefObject<HTMLElement>
  /** Called if a WebGL context can't be created, so the caller can fall back. */
  onUnsupported?: () => void
}

/* ------------------------------------------------------------------ */
/* Shaders — all particle motion runs on the GPU; the CPU only ticks   */
/* a couple of uniforms per frame.                                     */
/* ------------------------------------------------------------------ */

const STAR_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aPhase;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (38.0 / -mv.z);
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase * 0.25) + aPhase * 6.2831);
  }
`

const STAR_FRAG = /* glsl */ `
  uniform vec2 uResolution;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.0, d);
    // Keep stars in the sky: fade them out toward the hill line.
    float h = gl_FragCoord.y / uResolution.y;
    float sky = smoothstep(0.30, 0.52, h);
    gl_FragColor = vec4(vec3(0.93, 0.94, 1.0), disc * disc * vTwinkle * sky);
  }
`

/** Shooting stars: a short tail of points that crosses the sky every few seconds. */
const METEOR_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute vec4 aMeteor; // x,y: start, z: period, w: offset
  attribute float aTail;   // 0 = head … 1 = end of tail
  varying float vAlpha;
  void main() {
    float t = mod(uTime + aMeteor.w, aMeteor.z) / 1.1; // streak lasts 1.1s
    vec3 dir = normalize(vec3(-1.0, -0.42, 0.0));
    vec3 p = vec3(aMeteor.xy, -30.0) + dir * (t * 34.0 - aTail * 3.2);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.0 - aTail) * 5.0 * uPixelRatio * (30.0 / -mv.z) + 1.0;
    vAlpha = step(t, 1.0) * sin(min(t, 1.0) * 3.1416) * (1.0 - aTail);
  }
`

const METEOR_FRAG = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(1.0, 0.95, 0.85, smoothstep(0.5, 0.0, d) * vAlpha * 0.9);
  }
`

const FIREFLY_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aPhase;
  varying float vPulse;
  void main() {
    vec3 p = position;
    float t = uTime * 0.35 + aPhase * 12.0;
    p.x += sin(t * 0.9) * 0.9 + sin(t * 2.1) * 0.25;
    p.y += cos(t * 0.7) * 0.6 + sin(t * 1.7) * 0.2;
    p.z += sin(t * 0.5) * 0.8;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 34.0 * uPixelRatio * (6.0 / -mv.z);
    vPulse = pow(max(0.0, sin(uTime * (0.8 + aPhase) + aPhase * 9.0)), 2.0);
  }
`

const FIREFLY_FRAG = /* glsl */ `
  varying float vPulse;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.12, 0.0, d);
    float glow = smoothstep(0.5, 0.0, d) * 0.35;
    vec3 col = mix(vec3(0.85, 0.65, 0.29), vec3(1.0, 0.92, 0.7), core);
    gl_FragColor = vec4(col, (core + glow) * (0.15 + 0.85 * vPulse));
  }
`

const EMBER_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uEmitter;
  uniform float uScale;
  attribute vec4 aSeed; // x: birth offset, y: lifetime, z: drift, w: phase
  varying float vLife;
  void main() {
    float age = mod(uTime + aSeed.x * aSeed.y, aSeed.y);
    float t = age / aSeed.y;
    vLife = t;
    vec3 p = uEmitter;
    // Rise, slowing a little as the ember cools, with a lazy side-to-side curl.
    p.y += (1.0 - (1.0 - t) * (1.0 - t)) * 2.1 * uScale;
    p.x += (aSeed.z * t * 1.6 + sin(t * 6.0 + aSeed.w * 6.2831) * 0.3 * t) * uScale;
    p.x += (fract(aSeed.w * 13.7) - 0.5) * 0.35 * uScale; // spawn spread across the fire
    p.z += sin(aSeed.w * 40.0) * 0.4;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = mix(11.0, 2.5, t) * uPixelRatio * (10.0 / -mv.z) * uScale;
  }
`

const EMBER_FRAG = /* glsl */ `
  varying float vLife;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.05, d);
    vec3 hot = vec3(1.0, 0.92, 0.62);
    vec3 warm = vec3(1.0, 0.51, 0.21);
    vec3 cool = vec3(0.75, 0.18, 0.08);
    vec3 col = vLife < 0.35 ? mix(hot, warm, vLife / 0.35) : mix(warm, cool, (vLife - 0.35) / 0.65);
    float alpha = smoothstep(0.0, 0.08, vLife) * (1.0 - smoothstep(0.35, 0.9, vLife));
    gl_FragColor = vec4(col, disc * alpha);
  }
`

/**
 * WebGL night sky for the hero: a deep 3D starfield that drifts with the
 * pointer, fireflies wandering at different depths over the hills, and an
 * ember stream rising from the campfire. Pauses off-screen and in hidden
 * tabs; renders a single still frame under prefers-reduced-motion.
 */
export default function HeroScene({ emitterRef, onUnsupported }: HeroSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' })
    } catch {
      onUnsupported?.()
      return
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isSmall = window.innerWidth < 640
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75)

    renderer.setPixelRatio(pixelRatio)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    wrap.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(55, 1, 0.1, 200)
    camera.position.set(0, 0, 10)

    const shared = {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uResolution: { value: new Vector2(1, 1) },
    }

    /* Stars ---------------------------------------------------------- */
    const starCount = isSmall ? 700 : 1600
    const starPos = new Float32Array(starCount * 3)
    const starSize = new Float32Array(starCount)
    const starPhase = new Float32Array(starCount)
    for (let i = 0; i < starCount; i++) {
      const z = -8 - Math.random() * 70
      const spread = 0.62 * -z + 10 // widen with depth so the frustum stays filled
      starPos[i * 3] = (Math.random() - 0.5) * spread * 2.2
      starPos[i * 3 + 1] = (Math.random() - 0.35) * spread * 1.2
      starPos[i * 3 + 2] = z
      starSize[i] = Math.random() < 0.06 ? 2.6 + Math.random() * 1.6 : 0.8 + Math.random() * 1.3
      starPhase[i] = Math.random()
    }
    const starGeo = new BufferGeometry()
    starGeo.setAttribute('position', new BufferAttribute(starPos, 3))
    starGeo.setAttribute('aSize', new BufferAttribute(starSize, 1))
    starGeo.setAttribute('aPhase', new BufferAttribute(starPhase, 1))
    const starMat = new ShaderMaterial({
      uniforms: shared,
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const stars = new Points(starGeo, starMat)
    scene.add(stars)

    /* Shooting stars ------------------------------------------------- */
    const meteorCount = 3
    const tail = 18
    const meteorAttr = new Float32Array(meteorCount * tail * 4)
    const tailAttr = new Float32Array(meteorCount * tail)
    for (let m = 0; m < meteorCount; m++) {
      // Start high and to the right; long, staggered periods keep them rare.
      const start = [4 + Math.random() * 24, 7 + Math.random() * 10, 11 + m * 5, 3 + Math.random() * 10]
      for (let i = 0; i < tail; i++) {
        meteorAttr.set(start, (m * tail + i) * 4)
        tailAttr[m * tail + i] = i / (tail - 1)
      }
    }
    const meteorGeo = new BufferGeometry()
    meteorGeo.setAttribute('position', new BufferAttribute(new Float32Array(meteorCount * tail * 3), 3))
    meteorGeo.setAttribute('aMeteor', new BufferAttribute(meteorAttr, 4))
    meteorGeo.setAttribute('aTail', new BufferAttribute(tailAttr, 1))
    const meteorMat = new ShaderMaterial({
      uniforms: shared,
      vertexShader: METEOR_VERT,
      fragmentShader: METEOR_FRAG,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const meteors = new Points(meteorGeo, meteorMat)
    meteors.frustumCulled = false
    stars.add(meteors)

    /* Fireflies ------------------------------------------------------ */
    const flyCount = isSmall ? 14 : 28
    const flyPos = new Float32Array(flyCount * 3)
    const flyPhase = new Float32Array(flyCount)
    for (let i = 0; i < flyCount; i++) {
      flyPos[i * 3] = (Math.random() - 0.5) * 22
      flyPos[i * 3 + 1] = -4.2 + Math.random() * 4.2
      flyPos[i * 3 + 2] = -3 + Math.random() * 6
      flyPhase[i] = Math.random()
    }
    const flyGeo = new BufferGeometry()
    flyGeo.setAttribute('position', new BufferAttribute(flyPos, 3))
    flyGeo.setAttribute('aPhase', new BufferAttribute(flyPhase, 1))
    const flyMat = new ShaderMaterial({
      uniforms: shared,
      vertexShader: FIREFLY_VERT,
      fragmentShader: FIREFLY_FRAG,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const fireflies = new Points(flyGeo, flyMat)
    scene.add(fireflies)

    /* Embers --------------------------------------------------------- */
    const emberCount = isSmall ? 40 : 70
    const emberSeed = new Float32Array(emberCount * 4)
    for (let i = 0; i < emberCount; i++) {
      emberSeed[i * 4] = Math.random()
      emberSeed[i * 4 + 1] = 2.4 + Math.random() * 2.4
      emberSeed[i * 4 + 2] = (Math.random() - 0.5) * 1.1 + 0.15 // faint breeze to the right
      emberSeed[i * 4 + 3] = Math.random()
    }
    const emberGeo = new BufferGeometry()
    // Positions are computed in the shader; three still needs a position attribute.
    emberGeo.setAttribute('position', new BufferAttribute(new Float32Array(emberCount * 3), 3))
    emberGeo.setAttribute('aSeed', new BufferAttribute(emberSeed, 4))
    const emberUniforms = {
      ...shared,
      uEmitter: { value: new Vector3(0, -3, 0) },
      uScale: { value: 1 },
    }
    const emberMat = new ShaderMaterial({
      uniforms: emberUniforms,
      vertexShader: EMBER_VERT,
      fragmentShader: EMBER_FRAG,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const embers = new Points(emberGeo, emberMat)
    embers.frustumCulled = false
    scene.add(embers)

    /* Layout --------------------------------------------------------- */
    const ndc = new Vector3()
    const dir = new Vector3()

    /** Places the ember emitter where the campfire's flame sits on screen. */
    function placeEmitter(width: number, height: number) {
      const el = emitterRef.current
      if (!el) return
      const box = wrap!.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      const x = r.left + r.width / 2 - box.left
      const y = r.top + r.height * 0.42 - box.top
      ndc.set((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5).unproject(camera)
      dir.copy(ndc).sub(camera.position).normalize()
      const dist = -camera.position.z / dir.z
      emberUniforms.uEmitter.value.copy(camera.position).addScaledVector(dir, dist)
      // Keep the plume proportional to the fire on narrow screens.
      emberUniforms.uScale.value = MathUtils.clamp(r.width / 176, 0.7, 1.1)
    }

    function resize() {
      const { width, height } = wrap!.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      renderer.domElement.style.width = `${width}px`
      renderer.domElement.style.height = `${height}px`
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      shared.uResolution.value.set(width * pixelRatio, height * pixelRatio)
      placeEmitter(width, height)
    }

    /* Interaction ---------------------------------------------------- */
    const pointer = { x: 0, y: 0 }
    const eased = { x: 0, y: 0, scroll: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    /* Loop ----------------------------------------------------------- */
    const clock = new Clock()
    let raf = 0
    let inView = true

    function frame() {
      const dt = Math.min(clock.getDelta(), 0.05)
      shared.uTime.value += dt
      const k = 1 - Math.pow(0.04, dt) // frame-rate independent easing
      eased.x += (pointer.x - eased.x) * k
      eased.y += (pointer.y - eased.y) * k
      const scrollT = Math.min(window.scrollY / window.innerHeight, 1)
      eased.scroll += (scrollT - eased.scroll) * k

      stars.rotation.y = eased.x * 0.05 + shared.uTime.value * 0.003
      stars.rotation.x = eased.y * 0.03
      stars.position.y = eased.scroll * 2.2
      fireflies.position.x = eased.x * 0.5
      fireflies.position.y = -eased.y * 0.25

      renderer.render(scene, camera)
    }

    function loop() {
      frame()
      raf = requestAnimationFrame(loop)
    }

    function start() {
      if (prefersReduced || raf || !inView || document.hidden) return
      clock.getDelta()
      raf = requestAnimationFrame(loop)
    }

    function stop() {
      cancelAnimationFrame(raf)
      raf = 0
    }

    resize()
    if (prefersReduced) {
      shared.uTime.value = 4
      renderer.render(scene, camera)
    } else {
      start()
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (prefersReduced) renderer.render(scene, camera)
    })
    ro.observe(wrap)
    if (emitterRef.current) ro.observe(emitterRef.current)

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    })
    io.observe(wrap)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      for (const obj of [starGeo, starMat, meteorGeo, meteorMat, flyGeo, flyMat, emberGeo, emberMat]) obj.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [emitterRef, onUnsupported])

  return <div ref={wrapRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
}
