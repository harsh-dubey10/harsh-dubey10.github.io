import { useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three'
import { prefersReducedMotion } from '../lib/webgl'

/**
 * Sections the particle field reacts to, in scroll order. Each one maps to a
 * formation index: 0 = drifting dust (About), 1 = agent network (Projects),
 * 2 = globe with orbit (Contact). The Experience map is opaque, so the
 * dust → network morph happens unseen behind it.
 */
const SECTION_FORMATIONS: [id: string, formation: number][] = [
  ['profile', 0],
  ['work', 1],
  ['contact', 2],
]

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uPixelRatio;
  attribute vec3 aNetwork;
  attribute vec3 aGlobe;
  attribute float aRand;
  attribute float aSize;
  varying float vRand;
  varying float vMorph;

  void main() {
    // Stagger each particle's transition a little so formations dissolve
    // and reassemble instead of moving in lockstep.
    float m = clamp(uMorph + (aRand - 0.5) * 0.45, 0.0, 2.0);
    vec3 p = m < 1.0
      ? mix(position, aNetwork, smoothstep(0.0, 1.0, m))
      : mix(aNetwork, aGlobe, smoothstep(1.0, 2.0, m));

    // Idle breathing so nothing is ever perfectly still.
    float t = uTime * 0.5 + aRand * 40.0;
    p += vec3(sin(t), cos(t * 0.8), sin(t * 0.6)) * 0.05;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (34.0 / -mv.z);
    vRand = aRand;
    vMorph = m;
  }
`

const FRAG = /* glsl */ `
  uniform float uFade;
  uniform float uTime;
  varying float vRand;
  varying float vMorph;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.0, d);
    vec3 brass = vec3(0.85, 0.65, 0.29);
    vec3 moon = vec3(0.78, 0.83, 0.95);
    vec3 col = mix(brass, moon, step(0.72, vRand));
    float twinkle = 0.65 + 0.35 * sin(uTime * (0.8 + vRand) + vRand * 50.0);
    gl_FragColor = vec4(col, disc * disc * twinkle * uFade * 0.75);
  }
`

/* ------------------------------------------------------------------ */
/* Formation builders                                                  */
/* ------------------------------------------------------------------ */

function randomInSphere(r: number) {
  const u = Math.random()
  const v = Math.random()
  const theta = u * Math.PI * 2
  const phi = Math.acos(2 * v - 1)
  const rad = r * Math.cbrt(Math.random())
  return new Vector3(
    rad * Math.sin(phi) * Math.cos(theta),
    rad * Math.sin(phi) * Math.sin(theta),
    rad * Math.cos(phi),
  )
}

function gaussian() {
  return Math.sqrt(-2 * Math.log(Math.random() + 1e-9)) * Math.cos(2 * Math.PI * Math.random())
}

/** Nodes and edges of a loose 3D graph — the "multi-agent" network. */
function buildNetwork(nodeCount: number) {
  const nodes: Vector3[] = []
  while (nodes.length < nodeCount) {
    const p = randomInSphere(5.2).multiply(new Vector3(1.55, 0.95, 0.9))
    if (nodes.every((n) => n.distanceTo(p) > 1.7)) nodes.push(p)
  }
  const edges: [number, number][] = []
  const seen = new Set<string>()
  nodes.forEach((n, i) => {
    nodes
      .map((m, j) => ({ j, d: n.distanceTo(m) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([i, j])
        }
      })
  })
  return { nodes, edges }
}

/**
 * Site-wide WebGL backdrop: a single particle field fixed behind the page
 * that morphs between formations as each section scrolls in. Hidden over
 * the hero (which has its own scene), paused in hidden tabs, and redrawn
 * only on scroll under prefers-reduced-motion.
 */
export default function SiteScene() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      return
    }

    const reduced = prefersReducedMotion()
    const isSmall = window.innerWidth < 640
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
    renderer.setPixelRatio(pixelRatio)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    wrap.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 0, 13)
    const group = new Group()
    scene.add(group)

    /* Particles ------------------------------------------------------ */
    const count = isSmall ? 2400 : 5200
    const dust = new Float32Array(count * 3)
    const network = new Float32Array(count * 3)
    const globe = new Float32Array(count * 3)
    const rand = new Float32Array(count)
    const size = new Float32Array(count)

    const { nodes, edges } = buildNetwork(isSmall ? 14 : 20)
    const golden = Math.PI * (3 - Math.sqrt(5))
    const globeCount = Math.floor(count * 0.72)
    const tmp = new Vector3()

    for (let i = 0; i < count; i++) {
      // Dust: a wide, shallow cloud that fills the viewport.
      dust[i * 3] = (Math.random() - 0.5) * 30
      dust[i * 3 + 1] = (Math.random() - 0.5) * 18
      dust[i * 3 + 2] = -10 + Math.random() * 12

      // Network: a third of the particles cluster on nodes, the rest trace edges.
      if (i % 3 === 0) {
        const n = nodes[i % nodes.length]
        tmp.set(n.x + gaussian() * 0.16, n.y + gaussian() * 0.16, n.z + gaussian() * 0.16)
      } else {
        const [a, b] = edges[i % edges.length]
        tmp.lerpVectors(nodes[a], nodes[b], Math.random())
        tmp.x += gaussian() * 0.025
        tmp.y += gaussian() * 0.025
      }
      tmp.toArray(network, i * 3)

      // Globe: Fibonacci sphere plus a tilted orbit ring.
      if (i < globeCount) {
        const y = 1 - (i / (globeCount - 1)) * 2
        const r = Math.sqrt(1 - y * y)
        const th = golden * i
        tmp.set(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(4.1)
      } else {
        const a = Math.random() * Math.PI * 2
        const r = 6.2 + gaussian() * 0.08
        tmp.set(Math.cos(a) * r, gaussian() * 0.05, Math.sin(a) * r)
        tmp.applyAxisAngle(new Vector3(1, 0, 0.35).normalize(), 1.15)
      }
      tmp.toArray(globe, i * 3)

      rand[i] = Math.random()
      size[i] = (i % 3 === 0 ? 1.5 : 1.0) * (0.7 + Math.random() * 0.8)
    }

    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(dust, 3))
    geo.setAttribute('aNetwork', new BufferAttribute(network, 3))
    geo.setAttribute('aGlobe', new BufferAttribute(globe, 3))
    geo.setAttribute('aRand', new BufferAttribute(rand, 1))
    geo.setAttribute('aSize', new BufferAttribute(size, 1))

    const uniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uFade: { value: 0 },
      uPixelRatio: { value: pixelRatio },
    }
    const mat = new ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const points = new Points(geo, mat)
    points.frustumCulled = false
    group.add(points)

    /* Network edges — fade in only while the network formation holds. */
    const edgePos = new Float32Array(edges.length * 6)
    edges.forEach(([a, b], i) => {
      nodes[a].toArray(edgePos, i * 6)
      nodes[b].toArray(edgePos, i * 6 + 3)
    })
    const edgeGeo = new BufferGeometry()
    edgeGeo.setAttribute('position', new BufferAttribute(edgePos, 3))
    const edgeMat = new LineBasicMaterial({
      color: 0xd9a54a,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    group.add(new LineSegments(edgeGeo, edgeMat))

    /* Layout + scroll state ------------------------------------------ */
    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = w / h
      // Pull back on portrait screens so formations stay in frame.
      camera.position.z = w < h ? 19 : 13
      camera.updateProjectionMatrix()
    }

    function scrollTargets() {
      const vh = window.innerHeight
      const hero = document.getElementById('top')
      const heroH = hero?.offsetHeight || vh
      const fade = Math.min(Math.max((window.scrollY / heroH - 0.35) / 0.55, 0), 1)
      let morph = 0
      for (const [id, formation] of SECTION_FORMATIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < vh * 0.6) morph = formation
      }
      return { fade, morph }
    }

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
    let rotation = 0

    function render() {
      const fm = uniforms.uMorph.value
      // Edges peak while the network is fully assembled.
      edgeMat.opacity = Math.max(0, 1 - Math.abs(fm - 1) * 2.5) * 0.11 * uniforms.uFade.value
      renderer.render(scene, camera)
    }

    function frame() {
      const dt = Math.min(clock.getDelta(), 0.05)
      const k = 1 - Math.pow(0.12, dt)
      const { fade, morph } = scrollTargets()
      uniforms.uTime.value += dt
      uniforms.uFade.value += (fade - uniforms.uFade.value) * Math.min(1, k * 3)
      uniforms.uMorph.value += (morph - uniforms.uMorph.value) * k
      eased.x += (pointer.x - eased.x) * k
      eased.y += (pointer.y - eased.y) * k
      rotation += dt * 0.04
      group.rotation.y = rotation + eased.x * 0.25
      group.rotation.x = eased.y * 0.12
      // Nothing visible over the hero: skip the draw call entirely.
      if (uniforms.uFade.value > 0.002) render()
      else renderer.clear()
      raf = requestAnimationFrame(frame)
    }

    function start() {
      if (reduced || raf || document.hidden) return
      clock.getDelta()
      raf = requestAnimationFrame(frame)
    }
    function stop() {
      cancelAnimationFrame(raf)
      raf = 0
    }

    /** Reduced motion: jump straight to each formation and redraw on scroll. */
    let pending = false
    const onScrollReduced = () => {
      if (pending) return
      pending = true
      requestAnimationFrame(() => {
        pending = false
        const { fade, morph } = scrollTargets()
        uniforms.uFade.value = fade
        uniforms.uMorph.value = morph
        render()
      })
    }

    resize()
    if (reduced) {
      window.addEventListener('scroll', onScrollReduced, { passive: true })
      onScrollReduced()
    } else {
      start()
    }

    const onResize = () => {
      resize()
      if (reduced) onScrollReduced()
    }
    window.addEventListener('resize', onResize)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScrollReduced)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      geo.dispose()
      mat.dispose()
      edgeGeo.dispose()
      edgeMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={wrapRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
}
