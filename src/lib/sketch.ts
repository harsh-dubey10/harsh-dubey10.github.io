import {
  BufferGeometry,
  CatmullRomCurve3,
  DodecahedronGeometry,
  EdgesGeometry,
  Euler,
  Float32BufferAttribute,
  IcosahedronGeometry,
  Vector3,
} from 'three'

/**
 * Line drawings for the pen-sketch scenes. Each shape is a list of segments;
 * `sketch` turns one into a double-stroked, slightly wobbly line geometry,
 * like a quick pen sketch.
 */

export type Segs = [Vector3, Vector3][]

export const rand = (() => {
  let a = 1337
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
})()

const V = (x: number, y: number, z = 0) => new Vector3(x, y, z)

/** Turns a list of segments into a sketchy double-stroked line geometry. */
export function sketch(segs: Segs, wobble = 0.02, passes = 2) {
  const pts: number[] = []
  const j = () => (rand() - 0.5) * wobble
  for (const [a, b] of segs) {
    for (let p = 0; p < passes; p++) {
      // Slight overshoot at the ends, as a pen does.
      const d = b.clone().sub(a).multiplyScalar(0.02 + rand() * 0.03)
      pts.push(a.x - d.x + j(), a.y - d.y + j(), a.z - d.z + j(), b.x + d.x + j(), b.y + d.y + j(), b.z + d.z + j())
    }
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(pts, 3))
  return g
}

/** Joins points into segments, optionally closing the loop. */
const path = (pts: Vector3[], closed = false): Segs => {
  const segs: Segs = []
  for (let i = 0; i < pts.length - (closed ? 0 : 1); i++) segs.push([pts[i], pts[(i + 1) % pts.length]])
  return segs
}

/** A horizontal ring (XZ plane) at height y. */
export const ring = (r: number, n = 64, y = 0): Segs =>
  path(
    Array.from({ length: n }, (_, i) => V(Math.cos((i / n) * Math.PI * 2) * r, y, Math.sin((i / n) * Math.PI * 2) * r)),
    true,
  )

/** A circle in the XY plane. */
const circle = (r: number, n = 32, cx = 0, cy = 0): Segs =>
  path(
    Array.from({ length: n }, (_, i) => V(cx + Math.cos((i / n) * Math.PI * 2) * r, cy + Math.sin((i / n) * Math.PI * 2) * r)),
    true,
  )

const rotate = (segs: Segs, e: Euler): Segs => segs.map(([a, b]) => [a.clone().applyEuler(e), b.clone().applyEuler(e)])

/** A spur gear outline (in the XY plane) with hub and spokes. */
export function gear(teeth: number, r: number): Segs {
  const outer = r * 1.12
  const pts: Vector3[] = []
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2
    const w = (Math.PI * 2) / teeth
    for (const [f, rr] of [
      [0, r],
      [0.18, outer],
      [0.5, outer],
      [0.68, r],
    ] as const)
      pts.push(V(Math.cos(a0 + w * f) * rr, Math.sin(a0 + w * f) * rr))
  }
  const segs = [...path(pts, true), ...circle(r * 0.82, 48), ...circle(r * 0.22, 48)]
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    segs.push([V(Math.cos(a) * r * 0.22, Math.sin(a) * r * 0.22), V(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82)])
  }
  return segs
}

/** Leonardo's aerial screw: a helical sail on a mast, with a base platform. */
export function aerialScrew(): Segs {
  const segs: Segs = []
  const turns = 1.15
  const steps = 90
  const R = 1.3
  let prevOuter: Vector3 | null = null
  let prevInner: Vector3 | null = null
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = t * turns * Math.PI * 2
    const y = 0.2 + t * 1.6
    const outer = V(Math.cos(a) * R, y, Math.sin(a) * R)
    const inner = V(Math.cos(a) * 0.08, y, Math.sin(a) * 0.08)
    if (prevOuter && prevInner) segs.push([prevOuter, outer], [prevInner, inner])
    if (i % 9 === 0) segs.push([inner, outer]) // ribs
    prevOuter = outer
    prevInner = inner
  }
  segs.push([V(0, -0.9), V(0, 2.1)]) // mast
  segs.push(...ring(0.9, 40, -0.9), ...ring(0.95, 40, -0.75))
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    segs.push([V(0, -0.8), V(Math.cos(a) * 0.9, -0.9, Math.sin(a) * 0.9)]) // struts
  }
  return segs
}

/** Edges of a solid as segments. */
export function solid(geo: BufferGeometry): Segs {
  const e = new EdgesGeometry(geo)
  const p = e.getAttribute('position')
  const segs: Segs = []
  for (let i = 0; i < p.count; i += 2) segs.push([new Vector3().fromBufferAttribute(p, i), new Vector3().fromBufferAttribute(p, i + 1)])
  e.dispose()
  geo.dispose()
  return segs
}

/** Three nested rings and an axis. */
export function armillary(): Segs {
  const segs: Segs = []
  ;[1, 0.86, 0.72].forEach((r, k) => segs.push(...rotate(ring(r, 72), new Euler(k * 0.9, 0, k * 0.4))))
  segs.push([V(0, -1.3), V(0, 1.3)])
  return segs
}

/** A loose cluster of hatching and notes, like margin scribbles. */
export function fragment(): Segs {
  const segs: Segs = []
  const n = 10 + Math.floor(rand() * 8)
  const ang = rand() * Math.PI
  for (let i = 0; i < n; i++) {
    const o = V((rand() - 0.5) * 0.8, (rand() - 0.5) * 0.8)
    const l = 0.15 + rand() * 0.35
    const d = V(Math.cos(ang), Math.sin(ang)).multiplyScalar(l)
    segs.push([o.clone().sub(d), o.clone().add(d)])
  }
  // A short "text" line underneath.
  for (let k = 0; k < 3; k++) {
    const y = -0.6 - k * 0.12
    segs.push([V(-0.5, y), V(-0.5 + 0.4 + rand() * 0.6, y)])
  }
  return segs
}

/** Tiny notebook glyphs for the Projects swirl: each is a miniature sketch. */
export function glyph(kind: number): Segs {
  switch (kind % 6) {
    case 0:
      return gear(8, 0.5)
    case 1:
      return solid(new IcosahedronGeometry(0.6, 0))
    case 2:
      // Compass mark: a circle with a cross.
      return [...circle(0.5, 24), [V(-0.65, 0), V(0.65, 0)], [V(0, -0.65), V(0, 0.65)]]
    case 3:
      return fragment()
    case 4:
      // Lever and pulley.
      return [...circle(0.22, 16), [V(-0.7, -0.15), V(0.7, 0.2)], [V(0.6, 0.18), V(0.6, -0.5)]]
    default:
      return solid(new DodecahedronGeometry(0.5, 0))
  }
}

/** A wire globe with a pin on Gandhinagar and a tilted orbit around it. */
export function globe(): Segs {
  const segs: Segs = []
  for (let k = 0; k < 6; k++) {
    const m = (k / 6) * Math.PI
    segs.push(
      ...path(
        Array.from({ length: 64 }, (_, i) => {
          const a = (i / 64) * Math.PI * 2
          return V(Math.cos(a) * Math.cos(m), Math.sin(a), Math.cos(a) * Math.sin(m))
        }),
        true,
      ),
    )
  }
  for (const lat of [-60, -30, 0, 30, 60]) {
    const r = (lat * Math.PI) / 180
    segs.push(...ring(Math.cos(r), 56, Math.sin(r)))
  }
  const lat = (23.2 * Math.PI) / 180
  const lon = (-72.6 * Math.PI) / 180
  const p = V(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon))
  const tip = p.clone().multiplyScalar(1.4)
  segs.push([p, tip])
  segs.push(...circle(0.07, 12).map(([a, b]) => [a.add(tip), b.add(tip)] as [Vector3, Vector3]))
  segs.push(...rotate(ring(1.55, 90), new Euler(0.45, 0, 0.3)))
  return segs
}

/** A small cluster of nodes and links: a distributed system on paper. */
export function graph(): Segs {
  const nodes: Vector3[] = []
  while (nodes.length < 10) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * 1.15
    const p = V(Math.cos(a) * r, Math.sin(a) * r * 0.8, (rand() - 0.5) * 0.6)
    if (nodes.every((n) => n.distanceTo(p) > 0.45)) nodes.push(p)
  }
  const segs: Segs = []
  const seen = new Set<string>()
  nodes.forEach((n, i) => {
    segs.push(...circle(i % 4 === 0 ? 0.1 : 0.06, 14).map(([a, b]) => [a.add(n), b.add(n)] as [Vector3, Vector3]))
    if (i % 4 === 0) segs.push(...circle(0.17, 18).map(([a, b]) => [a.add(n), b.add(n)] as [Vector3, Vector3]))
    nodes
      .map((m, j) => ({ j, d: n.distanceTo(m) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (seen.has(key)) return
        seen.add(key)
        // Stop short of the node circles.
        const dir = nodes[j].clone().sub(n).normalize()
        segs.push([n.clone().addScaledVector(dir, 0.1), nodes[j].clone().addScaledVector(dir, -0.1)])
      })
  })
  return segs
}

/** A syntax tree, as a compiler draws it. */
export function syntaxTree(): Segs {
  const box = (c: Vector3, s = 0.09): Segs =>
    path([V(c.x - s, c.y - s), V(c.x + s, c.y - s), V(c.x + s, c.y + s), V(c.x - s, c.y + s)], true)
  const levels = [
    [V(0, 1)],
    [V(-0.6, 0.35), V(0.6, 0.35)],
    [V(-0.9, -0.3), V(-0.3, -0.3), V(0.3, -0.3), V(0.9, -0.3)],
    [V(-0.45, -0.95), V(-0.15, -0.95), V(0.9, -0.95)],
  ]
  const parent = [[], [0, 0], [0, 0, 1, 1], [1, 1, 3]]
  const segs: Segs = []
  levels.forEach((row, l) =>
    row.forEach((c, i) => {
      segs.push(...box(c))
      if (l) {
        const p = levels[l - 1][parent[l][i]]
        segs.push([V(p.x, p.y - 0.09), V(c.x, c.y + 0.09)])
      }
    }),
  )
  return segs
}

/** A padlock, drawn with a little depth. */
export function padlock(): Segs {
  const segs: Segs = []
  for (const z of [-0.12, 0.12]) {
    segs.push(...path([V(-0.5, -0.7, z), V(0.5, -0.7, z), V(0.5, 0.1, z), V(-0.5, 0.1, z)], true))
  }
  for (const [x, y] of [
    [-0.5, -0.7],
    [0.5, -0.7],
    [0.5, 0.1],
    [-0.5, 0.1],
  ])
    segs.push([V(x, y, -0.12), V(x, y, 0.12)])
  for (const r of [0.32, 0.22]) {
    const arc = Array.from({ length: 25 }, (_, i) => V(Math.cos((i / 24) * Math.PI) * r, 0.45 + Math.sin((i / 24) * Math.PI) * r))
    segs.push(...path(arc), [V(r, 0.1), V(r, 0.45)], [V(-r, 0.1), V(-r, 0.45)])
  }
  segs.push(...circle(0.08, 14, 0, -0.22), [V(0, -0.3), V(0, -0.48)])
  return segs
}

/** A compass rose: rings, ticks, eight points and a north mark. */
export function compassRose(): Segs {
  const segs: Segs = [...circle(1, 72), ...circle(0.9, 72), ...circle(0.3, 32)]
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2
    const r0 = i % 4 === 0 ? 0.8 : 0.9
    segs.push([V(Math.cos(a) * r0, Math.sin(a) * r0), V(Math.cos(a), Math.sin(a))])
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 2
    const long = i % 2 === 0
    const len = long ? 1.3 : 0.72
    const w = long ? 0.16 : 0.1
    const tip = V(Math.cos(a) * len, Math.sin(a) * len)
    const l = V(Math.cos(a + Math.PI / 2) * w, Math.sin(a + Math.PI / 2) * w)
    const r = l.clone().negate()
    segs.push([l, tip], [tip, r], [V(0, 0), tip])
  }
  segs.push(...path([V(-0.08, 1.42), V(-0.08, 1.62), V(0.08, 1.42), V(0.08, 1.62)]))
  return segs
}

/** A sextant: the arc with its scale, frame, index arm and telescope. */
export function sextant(): Segs {
  const at = (deg: number, r: number) => V(Math.cos((deg * Math.PI) / 180) * r, 0.7 + Math.sin((deg * Math.PI) / 180) * r)
  const arc = Array.from({ length: 31 }, (_, i) => at(-120 + i * 2, 1.4))
  const segs: Segs = [...path(arc), ...path(Array.from({ length: 31 }, (_, i) => at(-120 + i * 2, 1.25)))]
  for (let i = 0; i <= 12; i++) segs.push([at(-120 + i * 5, 1.25), at(-120 + i * 5, i % 3 ? 1.33 : 1.4)])
  segs.push([at(-120, 0), at(-120, 1.4)], [at(-60, 0), at(-60, 1.4)], [at(-120, 0.7), at(-60, 0.7)])
  segs.push([at(0, 0), at(-96, 1.45)]) // index arm
  segs.push(...path([V(-0.45, 0.35), V(0.25, 0.35), V(0.25, 0.47), V(-0.45, 0.47)], true)) // telescope
  segs.push(...circle(0.06, 12, -0.45, 0.41))
  segs.push(...path([V(-0.08, 0.6), V(0.08, 0.6), V(0.08, 0.82), V(-0.08, 0.82)], true)) // mirror
  return segs
}

/** An island in contour lines, with a dashed route ending at an X. */
export function chart(): Segs {
  const segs: Segs = []
  for (let k = 0; k < 4; k++) {
    const r = 1 - k * 0.22
    const pts = Array.from({ length: 72 }, (_, i) => {
      const a = (i / 72) * Math.PI * 2
      const rr = r * (1 + 0.16 * Math.sin(3 * a + 1.3) + 0.09 * Math.sin(5 * a + k * 0.5 + 2) + 0.05 * Math.sin(7 * a))
      return V(Math.cos(a) * rr * 1.3 + k * 0.05, Math.sin(a) * rr * 0.85 + k * 0.03)
    })
    segs.push(...path(pts, true))
  }
  const route = new CatmullRomCurve3([V(-2.1, -1.1), V(-1.5, -0.4), V(-0.8, -0.75), V(-0.2, -0.1), V(0.25, 0.12)])
  const pts = route.getPoints(48)
  for (let i = 0; i < pts.length - 1; i += 2) segs.push([pts[i], pts[i + 1]])
  const x = pts[pts.length - 1]
  segs.push([V(x.x - 0.11, x.y - 0.11), V(x.x + 0.11, x.y + 0.11)], [V(x.x - 0.11, x.y + 0.11), V(x.x + 0.11, x.y - 0.11)])
  segs.push(...circle(0.06, 12, -2.1, -1.1))
  return segs
}

/** A small "+" mark, like a star on a chart. */
export const cross = (s = 0.08): Segs => [
  [V(-s, 0), V(s, 0)],
  [V(0, -s), V(0, s)],
]
