import { useEffect, useRef } from 'react'
import {
  BufferGeometry,
  DodecahedronGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { prefersReducedMotion } from '../lib/webgl'
import {
  aerialScrew,
  armillary,
  chart,
  compassRose,
  cross,
  fragment,
  gear,
  globe,
  glyph,
  graph,
  padlock,
  rand,
  ring,
  sextant,
  sketch,
  solid,
  syntaxTree,
  type Segs,
} from '../lib/sketch'

/**
 * Pen sketches in the margins of the page, drawn on one fixed canvas in three
 * "sheets", each clipped to its own sections:
 *
 * - Hero and About: the night sheet, in pale ink on navy. A globe pinned on
 *   Gandhinagar, a node graph, a syntax tree and a padlock (the research:
 *   systems, compilers, security), orbit rings behind the name and a scatter
 *   of chart stars.
 * - Experience: the chart room, in sepia on the parchment map. A compass
 *   rose, a sextant and an island chart with a dashed route to an X.
 * - Projects and Contact: an inventor's notebook. Meshing gears, the aerial
 *   screw, skeletal polyhedra, an armillary and a swirl of tiny sketches.
 *
 * Every stroke is drawn twice with a slight wobble. Drawings drift past at a
 * slower parallax than the page and turn as you scroll.
 */

interface Piece {
  obj: Group
  /** x in -1..1 of the half-width; y in viewport heights from the sheet's top. */
  x: number
  y: number
  spin: Vector3
}

interface Frame {
  /** Scroll through the sheet, in viewport heights (eased). */
  p: number
  t: number
  halfW: number
  halfH: number
  small: boolean
}

interface Sheet {
  sections: string[]
  /** Pixels kept clear at the top and bottom, e.g. for torn paper edges. */
  inset: [number, number]
  scene: Scene
  pieces: Piece[]
  mats: [LineBasicMaterial, number][]
  /** Extra per-frame motion beyond the default drift and turn. */
  tick?: (f: Frame) => void
}

function makeSheet(sections: string[], ink: number, inkOpacity: number, faintOpacity: number, inset: [number, number] = [0, 0]) {
  const scene = new Scene()
  const ink_ = new LineBasicMaterial({ color: ink, transparent: true, opacity: inkOpacity, depthWrite: false })
  const faint = new LineBasicMaterial({ color: ink, transparent: true, opacity: faintOpacity, depthWrite: false })
  // Barely there: for construction lines that run behind text.
  const ghost = new LineBasicMaterial({ color: ink, transparent: true, opacity: faintOpacity * 0.45, depthWrite: false })
  const geos: BufferGeometry[] = []
  const make = (segs: Segs, scale = 1, mat = ink_, wobble = 0.025) => {
    const g = sketch(segs, wobble)
    geos.push(g)
    const grp = new Group()
    grp.add(new LineSegments(g, mat))
    grp.scale.setScalar(scale)
    scene.add(grp)
    return grp
  }
  const sheet: Sheet = {
    sections,
    inset,
    scene,
    pieces: [],
    mats: [
      [ink_, inkOpacity],
      [faint, faintOpacity],
      [ghost, faintOpacity * 0.45],
    ],
  }
  const dispose = () => {
    geos.forEach((g) => g.dispose())
    ink_.dispose()
    faint.dispose()
    ghost.dispose()
  }
  return { sheet, make, ink: ink_, faint, ghost, dispose }
}

/** Places a piece in the margin: drifting at 0.65x the page, turning with scroll. */
function place(piece: Piece, f: Frame) {
  const unitsPerVh = f.halfH * 2
  piece.obj.position.set(piece.x * f.halfW * (f.small ? 1.05 : 1), f.halfH - (piece.y - f.p * 0.65) * unitsPerVh, 0)
  const turn = f.p * 2 + f.t * 0.08
  piece.obj.rotation.set(piece.spin.x * turn, piece.spin.y * turn, piece.spin.z * turn)
}

function nightSheet() {
  const s = makeSheet(['top', 'profile'], 0xe8d6ad, 0.42, 0.18)
  const { sheet, make, faint, ghost } = s
  sheet.pieces = [
    { obj: make(globe(), 1.05), x: -0.8, y: 0.66, spin: new Vector3(0.12, 0.9, 0) },
    { obj: make(graph(), 1.1), x: 0.8, y: 0.36, spin: new Vector3(0.1, 0.35, 0) },
    { obj: make(syntaxTree(), 0.9), x: 0.84, y: 1.3, spin: new Vector3(0.05, 0.18, 0) },
    { obj: make(fragment(), 1, faint, 0.015), x: -0.84, y: 1.25, spin: new Vector3(0, 0, 0.2) },
    { obj: make(padlock(), 0.9), x: -0.84, y: 1.75, spin: new Vector3(0.15, 0.7, 0) },
    { obj: make(fragment(), 1, faint, 0.015), x: 0.84, y: 1.9, spin: new Vector3(0, 0, -0.15) },
  ]
  // Orbit rings behind the name, tilted so they read as ellipses.
  const orbits = make([...ring(3.6, 140), ...ring(2.9, 120)], 1, ghost, 0.03)
  // Chart stars: small crosses scattered behind everything.
  const stars = Array.from({ length: 34 }, () => {
    const obj = make(cross(0.07), 0.8 + rand() * 0.8, faint, 0.01)
    return { obj, x: rand() * 2 - 1, y: rand() * 2.2 }
  })
  sheet.tick = (f) => {
    orbits.position.set(0, f.halfH - (0.48 - f.p * 0.5) * f.halfH * 2, -4)
    orbits.rotation.set(Math.PI / 2.3, 0, f.p * 0.5 + f.t * 0.02)
    for (const st of stars) {
      st.obj.position.set(st.x * f.halfW * 1.1, f.halfH - (st.y - f.p * 0.4) * f.halfH * 2, -3)
      st.obj.rotation.z = f.t * 0.05 + st.x
    }
  }
  return s
}

function mapSheet() {
  // The torn edges of the map are kept clear.
  const s = makeSheet(['timeline'], 0x4a3826, 0.42, 0.22, [110, 170])
  const { sheet, make, faint } = s
  const rose = make(compassRose(), 1)
  sheet.pieces = [
    { obj: make(fragment(), 1, faint, 0.015), x: -0.84, y: 0.4, spin: new Vector3(0, 0, -0.2) },
    { obj: rose, x: 0.8, y: 0.45, spin: new Vector3(0, 0, 0) },
    { obj: make(chart(), 0.8), x: -0.76, y: 0.8, spin: new Vector3(0, 0, 0.05) },
    { obj: make(sextant(), 1), x: 0.8, y: 0.98, spin: new Vector3(0, 0, 0.08) },
  ]
  sheet.tick = (f) => {
    // The rose lies a little back, like a card on the table, and its
    // needle-points swing as you scroll.
    rose.rotation.set(-0.5, 0.3, -f.p * 1.2 + Math.sin(f.t * 0.6) * 0.04)
  }
  return s
}

function notebookSheet() {
  const s = makeSheet(['work', 'contact'], 0x4a3826, 0.5, 0.28)
  const { sheet, make, ink, faint, dispose } = s
  // Gears that mesh: the second turns the opposite way at the ratio of their teeth.
  const gearA = make(gear(18, 1))
  const gearB = make(gear(12, 0.66))
  const gears = new Group()
  gears.add(gearA, gearB)
  gearB.position.set(1.72, -0.2, 0)
  sheet.scene.add(gears)

  sheet.pieces = [
    { obj: gears, x: -0.86, y: 0.35, spin: new Vector3(0.25, 0.4, 0) },
    { obj: make(aerialScrew(), 0.72), x: 0.8, y: 0.8, spin: new Vector3(0.15, 1.2, 0) },
    { obj: make(solid(new IcosahedronGeometry(1, 0)), 0.9), x: -0.84, y: 1.45, spin: new Vector3(0.6, 0.9, 0) },
    { obj: make(fragment(), 1, faint, 0.015), x: 0.82, y: 1.7, spin: new Vector3(0, 0, 0.2) },
    { obj: make(armillary(), 1), x: 0.86, y: 2.3, spin: new Vector3(0.4, 0.9, 0) },
    { obj: make(fragment(), 1, faint, 0.015), x: -0.84, y: 2.55, spin: new Vector3(0, 0, -0.2) },
    { obj: make(solid(new DodecahedronGeometry(1, 0)), 0.8), x: -0.84, y: 3.15, spin: new Vector3(0.5, 0.7, 0) },
    { obj: make(fragment(), 1.1, faint, 0.015), x: 0.84, y: 3.35, spin: new Vector3(0, 0, 0.15) },
  ]

  // The swirl: tiny sketches orbiting loosely, opening out as you scroll.
  const swirl = new Group()
  sheet.scene.add(swirl)
  const swirlGeos: BufferGeometry[] = []
  const motes = Array.from({ length: 48 }, (_, i) => {
    const g = sketch(glyph(i), 0.02)
    swirlGeos.push(g)
    const obj = new Group()
    obj.add(new LineSegments(g, i % 3 === 0 ? ink : faint))
    obj.scale.setScalar(0.14 + rand() * 0.22)
    swirl.add(obj)
    // Denser toward the middle, trailing out along a spiral arm.
    const r = 0.25 + Math.pow(rand(), 0.7) * 2.6
    return { obj, r, a: r * 1.9 + rand() * 1.2, h: (rand() - 0.5) * 0.9, speed: 0.6 + rand() * 0.8, spin: (rand() - 0.5) * 2 }
  })

  // Construction circles behind everything, very faint.
  const circles = make([...ring(3.2, 120), ...ring(2.2, 100)], 1, faint, 0.03)

  sheet.tick = (f) => {
    const unitsPerVh = f.halfH * 2
    // Swirl: right of the Projects heading; turns and opens with scroll.
    const open = 1 + Math.max(f.p, 0) * 0.5
    swirl.position.set(f.halfW * (f.small ? 0.55 : 0.5), f.halfH - (0.28 - f.p * 0.65) * unitsPerVh, -1)
    swirl.scale.setScalar(f.small ? 0.6 : 1)
    for (const m of motes) {
      const ang = m.a + f.p * 1.6 * m.speed + f.t * 0.05 * m.speed
      m.obj.position.set(Math.cos(ang) * m.r * open, Math.sin(ang) * m.r * 0.55 * open + m.h, Math.sin(ang * 2) * 0.4)
      m.obj.rotation.set(ang * 0.5 * m.spin, ang * m.spin, ang * 0.3)
    }
    gearA.rotation.z = -f.p * 3
    gearB.rotation.z = f.p * 3 * (18 / 12) + Math.PI / 12
    circles.position.set(f.halfW * 0.55, f.halfH - (1.0 - f.p * 0.4) * unitsPerVh, -6)
    circles.rotation.set(Math.PI / 2, 0, f.p * 0.6)
  }
  return {
    ...s,
    dispose: () => {
      dispose()
      swirlGeos.forEach((g) => g.dispose())
    },
  }
}

export default function SketchWorld() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true })
    } catch {
      return
    }
    const reduced = prefersReducedMotion()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.autoClear = false
    Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%' })
    wrap.appendChild(renderer.domElement)

    const built = [nightSheet(), mapSheet(), notebookSheet()]
    const sheets = built.map((b) => ({ ...b.sheet, eased: 0 }))

    const camera = new PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 14)

    const frameState: Frame = { p: 0, t: 0, halfW: 1, halfH: 1, small: false }
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      frameState.halfH = Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      frameState.halfW = frameState.halfH * camera.aspect
      frameState.small = w < 900
      // Calmer on small screens, where drawings sit under the text.
      for (const sh of sheets) for (const [m, o] of sh.mats) m.opacity = frameState.small ? o * 0.45 : o
    }
    resize()
    window.addEventListener('resize', resize)

    const pointer = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const rectOf = (ids: string[]) => {
      const first = document.getElementById(ids[0])
      const last = document.getElementById(ids[ids.length - 1])
      if (!first || !last) return null
      return { top: first.getBoundingClientRect().top, bottom: last.getBoundingClientRect().bottom }
    }

    let raf = 0
    const start = performance.now()
    const frame = () => {
      raf = 0
      const vw = window.innerWidth
      const vh = window.innerHeight
      const t = reduced ? 0 : (performance.now() - start) / 1000
      eased.x += (pointer.x - eased.x) * 0.05
      eased.y += (pointer.y - eased.y) * 0.05
      camera.position.set(eased.x * 0.25, -eased.y * 0.15, 14)

      renderer.setScissorTest(false)
      renderer.clear()
      renderer.setScissorTest(true)
      let any = false
      let settling = false
      for (const sh of sheets) {
        const r = rectOf(sh.sections)
        if (!r) continue
        const top = Math.max(0, r.top + sh.inset[0])
        const bottom = Math.min(vh, r.bottom - sh.inset[1])
        if (bottom <= top) continue
        any = true
        // Scroll through the sheet in viewport heights.
        const p = -r.top / vh
        sh.eased = reduced ? p : sh.eased + (p - sh.eased) * 0.12
        if (Math.abs(p - sh.eased) > 0.001) settling = true
        Object.assign(frameState, { p: sh.eased, t })
        for (const piece of sh.pieces) place(piece, frameState)
        sh.tick?.(frameState)
        // Only the part of the screen this sheet's sections cover.
        renderer.setScissor(0, vh - bottom, vw, bottom - top)
        renderer.render(sh.scene, camera)
      }
      wrap.style.visibility = any ? 'visible' : 'hidden'
      if (any && (!reduced || settling)) raf = requestAnimationFrame(frame)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    window.addEventListener('scroll', kick, { passive: true })
    const onVisibility = () => !document.hidden && kick()
    document.addEventListener('visibilitychange', onVisibility)
    kick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      built.forEach((b) => b.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={wrapRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2]" style={{ visibility: 'hidden' }} />
}
