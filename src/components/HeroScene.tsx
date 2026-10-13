import { useEffect, useRef, type RefObject } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Group,
  LinearFilter,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
  type IUniform,
} from 'three'
import { prefersReducedMotion } from '../lib/webgl'

interface HeroSceneProps {
  /** Element the ember stream rises from (the campfire). */
  emitterRef: RefObject<HTMLElement>
  /** Box the portrait is fitted into (contain, bottom-aligned). */
  portraitRef: RefObject<HTMLElement>
  portraitSrc: string
  /** Fires once the portrait is on screen, so the <img> fallback can hide. */
  onReady?: () => void
  /** Called if a WebGL context can't be created, so the caller can fall back. */
  onUnsupported?: () => void
}

const CAMERA_Z = 10
const FOV = 50

/* ------------------------------------------------------------------ */
/* Shaders — particle motion runs on the GPU; the CPU ticks uniforms.  */
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
    float h = gl_FragCoord.y / uResolution.y;
    float sky = smoothstep(0.30, 0.52, h); // keep stars above the hill line
    gl_FragColor = vec4(vec3(0.93, 0.94, 1.0), disc * disc * vTwinkle * sky);
  }
`

/** Streaks that cross the sky every few seconds. */
const METEOR_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute vec4 aMeteor; // x,y: start, z: period, w: offset
  attribute float aTail;   // 0 = head … 1 = end of tail
  varying float vAlpha;
  void main() {
    float cycle = mod(uTime + aMeteor.w, aMeteor.z);
    float t = cycle / 1.1; // the visible streak lasts 1.1s of the period
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
    gl_FragColor = vec4(1.0, 0.95, 0.85, smoothstep(0.5, 0.0, d) * vAlpha);
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
    p.y += (1.0 - (1.0 - t) * (1.0 - t)) * 2.1 * uScale;
    p.x += (aSeed.z * t * 1.6 + sin(t * 6.0 + aSeed.w * 6.2831) * 0.3 * t) * uScale;
    p.x += (fract(aSeed.w * 13.7) - 0.5) * 0.35 * uScale;
    p.z += 0.6 + sin(aSeed.w * 40.0) * 0.3; // in front of the portrait
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

/** The cut-out portrait: night grade, campfire light from below, moon rim. */
const PORTRAIT_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const PORTRAIT_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uFlicker;
  uniform vec2 uTexel;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    if (tex.a < 0.06) discard;
    vec3 col = tex.rgb * vec3(0.9, 0.9, 0.97); // cool night grade
    // Warm campfire bounce, strongest low on the body.
    float fire = pow(1.0 - vUv.y, 2.0) * 0.3 * uFlicker;
    col += tex.rgb * vec3(1.0, 0.55, 0.25) * fire;
    // Moonlight rim on the left edge: alpha drops off just outside it.
    float edge = tex.a - texture2D(uMap, vUv + vec2(-uTexel.x * 6.0, uTexel.y * 3.0)).a;
    col += vec3(0.62, 0.72, 1.0) * clamp(edge, 0.0, 1.0) * 0.45;
    // Fade the bottom so the cut edge melts into the hills.
    float fade = smoothstep(0.0, 0.2, vUv.y);
    gl_FragColor = vec4(col, tex.a * fade * uOpacity);
  }
`

/** The portrait assembling from its own pixels on load. */
const ASSEMBLE_VERT = /* glsl */ `
  uniform float uIntro;
  uniform float uPixelRatio;
  uniform float uDot;
  attribute vec3 aStart;
  attribute vec3 aColor;
  attribute float aDelay;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float k = clamp((uIntro - aDelay * 0.45) / 0.55, 0.0, 1.0);
    k = 1.0 - pow(1.0 - k, 3.0);
    vec3 p = mix(aStart, position, k);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uDot * uPixelRatio * (1.0 + (1.0 - k) * 1.5);
    vColor = aColor;
    // Visible while travelling, handing over to the texture once it lands.
    vAlpha = smoothstep(0.0, 0.15, k) * (1.0 - smoothstep(0.9, 1.0, uIntro));
  }
`

const ASSEMBLE_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor * 1.15, vAlpha);
  }
`

/** A tilted ring of light orbiting behind and around the portrait. */
const HALO_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uRadius;
  attribute float aAngle;
  attribute float aJitter;
  varying float vFront;
  void main() {
    float a = aAngle + uTime * 0.18;
    float r = uRadius * (1.0 + aJitter * 0.05);
    vec3 p = vec3(cos(a) * r, aJitter * 0.04, sin(a) * r);
    // Tilt the ring so it reads as an ellipse that passes behind the head.
    float tilt = 1.22;
    p = vec3(p.x, p.y * cos(tilt) - p.z * sin(tilt), p.y * sin(tilt) + p.z * cos(tilt));
    p.xy = vec2(p.x * cos(0.18) - p.y * sin(0.18), p.x * sin(0.18) + p.y * cos(0.18));
    vFront = smoothstep(-0.2, 0.4, p.z / uRadius);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.8 + aJitter * 0.8) * uPixelRatio * (14.0 / -mv.z);
  }
`

const HALO_FRAG = /* glsl */ `
  varying float vFront;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    vec3 col = mix(vec3(0.85, 0.65, 0.29), vec3(1.0, 0.9, 0.7), vFront);
    gl_FragColor = vec4(col, smoothstep(0.5, 0.0, d) * (0.5 + 0.5 * vFront));
  }
`

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * WebGL hero: a 3D starfield with meteors, fireflies, the cut-out portrait
 * rendered as a lit plane that tilts with the pointer and assembles from its
 * own pixels on load, an orbiting halo, and campfire embers in front.
 * Pauses off-screen and in hidden tabs; a single still frame under
 * prefers-reduced-motion.
 */
export default function HeroScene({ emitterRef, portraitRef, portraitSrc, onReady, onUnsupported }: HeroSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      onUnsupported?.()
      return
    }

    let disposed = false
    const reduced = prefersReducedMotion()
    const isSmall = window.innerWidth < 640
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75)

    renderer.setPixelRatio(pixelRatio)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    wrap.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 200)
    camera.position.set(0, 0, CAMERA_Z)

    const shared = {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uResolution: { value: new Vector2(1, 1) },
    }
    const disposables: { dispose: () => void }[] = []
    function points(geo: BufferGeometry, vertexShader: string, fragmentShader: string, uniforms: Record<string, IUniform> = shared) {
      const mat = new ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      })
      disposables.push(geo, mat)
      const p = new Points(geo, mat)
      p.frustumCulled = false
      return p
    }

    /* Stars ---------------------------------------------------------- */
    const starCount = isSmall ? 700 : 1600
    const starPos = new Float32Array(starCount * 3)
    const starSize = new Float32Array(starCount)
    const starPhase = new Float32Array(starCount)
    for (let i = 0; i < starCount; i++) {
      const z = -8 - Math.random() * 70
      const spread = 0.62 * -z + 10
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
    const stars = points(starGeo, STAR_VERT, STAR_FRAG)
    scene.add(stars)

    /* Meteors -------------------------------------------------------- */
    const meteorCount = 3
    const tail = 18
    const meteorAttr = new Float32Array(meteorCount * tail * 4)
    const tailAttr = new Float32Array(meteorCount * tail)
    for (let m = 0; m < meteorCount; m++) {
      const start = [6 + Math.random() * 22, 6 + Math.random() * 12, 9 + m * 4.5, Math.random() * 12]
      for (let i = 0; i < tail; i++) {
        meteorAttr.set(start, (m * tail + i) * 4)
        tailAttr[m * tail + i] = i / (tail - 1)
      }
    }
    const meteorGeo = new BufferGeometry()
    meteorGeo.setAttribute('position', new BufferAttribute(new Float32Array(meteorCount * tail * 3), 3))
    meteorGeo.setAttribute('aMeteor', new BufferAttribute(meteorAttr, 4))
    meteorGeo.setAttribute('aTail', new BufferAttribute(tailAttr, 1))
    stars.add(points(meteorGeo, METEOR_VERT, METEOR_FRAG))

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
    const fireflies = points(flyGeo, FIREFLY_VERT, FIREFLY_FRAG)
    scene.add(fireflies)

    /* Embers --------------------------------------------------------- */
    const emberCount = isSmall ? 40 : 70
    const emberSeed = new Float32Array(emberCount * 4)
    for (let i = 0; i < emberCount; i++) {
      emberSeed[i * 4] = Math.random()
      emberSeed[i * 4 + 1] = 2.4 + Math.random() * 2.4
      emberSeed[i * 4 + 2] = (Math.random() - 0.5) * 1.1 + 0.15
      emberSeed[i * 4 + 3] = Math.random()
    }
    const emberGeo = new BufferGeometry()
    emberGeo.setAttribute('position', new BufferAttribute(new Float32Array(emberCount * 3), 3))
    emberGeo.setAttribute('aSeed', new BufferAttribute(emberSeed, 4))
    const emberUniforms = { ...shared, uEmitter: { value: new Vector3(0, -3, 0) }, uScale: { value: 1 } }
    const embers = points(emberGeo, EMBER_VERT, EMBER_FRAG, emberUniforms)
    embers.renderOrder = 3
    scene.add(embers)

    /* Portrait group: plane + assembling particles + halo ------------- */
    const portrait = new Group()
    scene.add(portrait)
    const portraitUniforms = {
      uMap: { value: null as Texture | null },
      uOpacity: { value: 0 },
      uFlicker: { value: 1 },
      uTexel: { value: new Vector2(1 / 512, 1 / 512) },
    }
    const planeGeo = new PlaneGeometry(1, 1)
    const planeMat = new ShaderMaterial({
      uniforms: portraitUniforms,
      vertexShader: PORTRAIT_VERT,
      fragmentShader: PORTRAIT_FRAG,
      transparent: true,
      depthWrite: true,
    })
    disposables.push(planeGeo, planeMat)
    const plane = new Mesh(planeGeo, planeMat)
    plane.renderOrder = 1
    plane.visible = false
    portrait.add(plane)

    const haloUniforms = { ...shared, uRadius: { value: 1 } }
    const haloCount = isSmall ? 260 : 420
    const haloAngle = new Float32Array(haloCount)
    const haloJitter = new Float32Array(haloCount)
    for (let i = 0; i < haloCount; i++) {
      haloAngle[i] = (i / haloCount) * Math.PI * 2 + Math.random() * 0.02
      haloJitter[i] = Math.random() * 2 - 1
    }
    const haloGeo = new BufferGeometry()
    haloGeo.setAttribute('position', new BufferAttribute(new Float32Array(haloCount * 3), 3))
    haloGeo.setAttribute('aAngle', new BufferAttribute(haloAngle, 1))
    haloGeo.setAttribute('aJitter', new BufferAttribute(haloJitter, 1))
    const halo = points(haloGeo, HALO_VERT, HALO_FRAG, haloUniforms)
    halo.renderOrder = 2
    const haloPivot = new Group()
    haloPivot.add(halo)
    portrait.add(haloPivot)

    const assembleUniforms = { uIntro: { value: reduced ? 1 : 0 }, uPixelRatio: shared.uPixelRatio, uDot: { value: 3 } }
    let assemble: Points | null = null
    let imageAspect = 1
    let intro = reduced ? 1 : 0
    let ready = false

    /* Layout --------------------------------------------------------- */
    const ndc = new Vector3()
    const dir = new Vector3()
    const tmp = new Vector3()

    /** Screen point (relative to the canvas) → world point on the z=0 plane. */
    function toWorld(x: number, y: number, width: number, height: number, out: Vector3) {
      ndc.set((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5).unproject(camera)
      dir.copy(ndc).sub(camera.position).normalize()
      return out.copy(camera.position).addScaledVector(dir, -camera.position.z / dir.z)
    }

    function layout() {
      const box = wrap!.getBoundingClientRect()
      const { width, height } = box
      if (!width || !height) return
      renderer.setSize(width, height, false)
      renderer.domElement.style.width = `${width}px`
      renderer.domElement.style.height = `${height}px`
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      shared.uResolution.value.set(width * pixelRatio, height * pixelRatio)
      const worldPerPx = (2 * CAMERA_Z * Math.tan(MathUtils.degToRad(FOV / 2))) / height

      const fire = emitterRef.current?.getBoundingClientRect()
      if (fire) {
        toWorld(fire.left + fire.width / 2 - box.left, fire.top + fire.height * 0.42 - box.top, width, height, emberUniforms.uEmitter.value)
        emberUniforms.uScale.value = MathUtils.clamp(fire.width / 176, 0.6, 1.1)
      }

      const slot = portraitRef.current?.getBoundingClientRect()
      if (slot) {
        // object-fit: contain, anchored to the bottom of the slot.
        const h = Math.min(slot.height, slot.width / imageAspect)
        const w = h * imageAspect
        toWorld(slot.left + slot.width / 2 - box.left, slot.bottom - h / 2 - box.top, width, height, tmp)
        portrait.position.copy(tmp)
        const ph = h * worldPerPx
        plane.scale.set(w * worldPerPx, ph, 1)
        assemble?.scale.set(w * worldPerPx, ph, 1)
        // Halo circles the head, which sits in the top third of the cut-out.
        haloPivot.position.set(0, ph * 0.2, -0.05)
        haloUniforms.uRadius.value = ph * 0.42
        assembleUniforms.uDot.value = Math.max(2, (h / 150) * 1.25)
      }
    }

    /* Portrait texture + particle sample ----------------------------- */
    loadImage(portraitSrc)
      .then((img) => {
        if (disposed) return
        imageAspect = img.naturalWidth / img.naturalHeight
        const tex = new Texture(img)
        // Sample raw sRGB values: this ShaderMaterial writes them straight out.
        tex.minFilter = LinearFilter
        tex.generateMipmaps = false
        tex.needsUpdate = true
        disposables.push(tex)
        portraitUniforms.uMap.value = tex
        portraitUniforms.uTexel.value.set(1 / img.naturalWidth, 1 / img.naturalHeight)

        // Sample the cut-out into particles for the assembly intro.
        const sw = 150
        const sh = Math.round(sw / imageAspect)
        const c = document.createElement('canvas')
        c.width = sw
        c.height = sh
        const ctx = c.getContext('2d', { willReadFrequently: true })
        if (ctx && !reduced) {
          ctx.drawImage(img, 0, 0, sw, sh)
          const data = ctx.getImageData(0, 0, sw, sh).data
          const target: number[] = []
          const start: number[] = []
          const color: number[] = []
          const delay: number[] = []
          for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
              const i = (y * sw + x) * 4
              if (data[i + 3] < 140) continue
              const u = x / sw - 0.5
              const v = 0.5 - y / sh
              target.push(u, v, 0)
              const a = Math.random() * Math.PI * 2
              const r = 1.2 + Math.random() * 1.8
              start.push(u + Math.cos(a) * r, v + Math.sin(a) * r * 0.7, (Math.random() - 0.5) * 3)
              color.push(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255)
              // Shoulders land first, the face last.
              delay.push((1 - (y / sh) * 0.6 + Math.random() * 0.4) / 1.4)
            }
          }
          const geo = new BufferGeometry()
          geo.setAttribute('position', new BufferAttribute(new Float32Array(target), 3))
          geo.setAttribute('aStart', new BufferAttribute(new Float32Array(start), 3))
          geo.setAttribute('aColor', new BufferAttribute(new Float32Array(color), 3))
          geo.setAttribute('aDelay', new BufferAttribute(new Float32Array(delay), 1))
          const mat = new ShaderMaterial({
            uniforms: assembleUniforms,
            vertexShader: ASSEMBLE_VERT,
            fragmentShader: ASSEMBLE_FRAG,
            transparent: true,
            depthWrite: false,
          })
          disposables.push(geo, mat)
          assemble = new Points(geo, mat)
          assemble.frustumCulled = false
          assemble.renderOrder = 2
          portrait.add(assemble)
        }

        plane.visible = true
        layout()
        ready = true
        onReadyRef.current?.()
        if (reduced) {
          portraitUniforms.uOpacity.value = 1
          renderer.render(scene, camera)
        }
      })
      .catch(() => onUnsupported?.())

    /* Interaction ---------------------------------------------------- */
    const pointer = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
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
      const t = (shared.uTime.value += dt)
      const k = 1 - Math.pow(0.04, dt)
      eased.x += (pointer.x - eased.x) * k
      eased.y += (pointer.y - eased.y) * k

      stars.rotation.y = eased.x * 0.05 + t * 0.003
      stars.rotation.x = eased.y * 0.03
      fireflies.position.x = eased.x * 0.5
      fireflies.position.y = -eased.y * 0.25

      if (ready) {
        intro = Math.min(intro + dt / 2.6, 1)
        assembleUniforms.uIntro.value = intro
        portraitUniforms.uOpacity.value = MathUtils.smoothstep(intro, 0.78, 1)
        if (assemble && intro >= 1) assemble.visible = false
      }
      // Campfire flicker: a few incommensurate sines read as natural.
      portraitUniforms.uFlicker.value = 0.8 + 0.12 * Math.sin(t * 7.3) + 0.08 * Math.sin(t * 13.1 + 1.3)
      // A gentle 3D tilt toward the pointer.
      portrait.rotation.y = eased.x * 0.16
      portrait.rotation.x = eased.y * 0.05

      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }

    function start() {
      if (reduced || raf || !inView || document.hidden) return
      clock.getDelta()
      raf = requestAnimationFrame(frame)
    }
    function stop() {
      cancelAnimationFrame(raf)
      raf = 0
    }

    layout()
    if (reduced) {
      shared.uTime.value = 4
      renderer.render(scene, camera)
    } else {
      start()
    }

    const ro = new ResizeObserver(() => {
      layout()
      if (reduced) renderer.render(scene, camera)
    })
    ro.observe(wrap)
    if (emitterRef.current) ro.observe(emitterRef.current)
    if (portraitRef.current) ro.observe(portraitRef.current)
    // Web fonts can shift the slot without resizing it.
    document.fonts?.ready.then(() => !disposed && layout())

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    })
    io.observe(wrap)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      disposed = true
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      for (const d of disposables) d.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [emitterRef, portraitRef, portraitSrc, onUnsupported])

  return <div ref={wrapRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
}
