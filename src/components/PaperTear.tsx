import { type RefObject, useEffect, useRef } from 'react'
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector4,
  WebGLRenderer,
} from 'three'
import { prefersReducedMotion } from '../lib/webgl'

/**
 * WebGL torn paper. The canvas renders a "sheet" bounded by torn edges that
 * follow `targetRef`'s position on screen, so the sheet and its tears scroll
 * with the page while the shader adds per-pixel detail: deep ragged bites
 * that keep re-tearing as you scroll, a frayed glowing fibre edge, aged
 * edges, a travelling sheen and twinkling glints.
 *
 * - sheet="paper": the sheet itself is drawn as parchment (used as a
 *   section background, with the section's content layered on top).
 * - sheet="none": the sheet is left transparent so the DOM beneath shows
 *   through, and only the area torn away is painted with `back`.
 */

const VERT = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;      // canvas size, CSS px
  uniform float uDpr;
  uniform float uTime;
  uniform float uTop;     // sheet's top edge, CSS px from canvas top (or far away)
  uniform float uBottom;  // sheet's bottom edge
  uniform float uPTop;    // scroll progress of each edge, 0..1
  uniform float uPBot;
  uniform float uDepth;   // how far tears bite into the sheet, px
  uniform float uSeed;
  uniform float uPaper;   // 1 = draw parchment, 0 = transparent sheet
  uniform vec4 uBack;     // colour of the area torn away
  uniform vec4 uBackBot;  // ...below the bottom tear

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed * 17.13) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    return noise(p) * 0.57 + noise(p * 2.1 + 3.1) * 0.29 + noise(p * 4.3 + 7.7) * 0.14;
  }
  float tanh1(float x) { float e = exp(2.0 * clamp(x, -9.0, 9.0)); return (e - 1.0) / (e + 1.0); }

  // 0..1 depth of the tear at x (0..1 across) for scroll progress p.
  float tear(float x, float p, float salt) {
    float big = fbm(vec2(x * 3.2 + salt, p * 2.4)) - 0.5;
    float bite = fbm(vec2(x * 13.0 + salt * 2.0, p * 3.2 + 7.0)) - 0.5;
    float grain = noise(vec2(x * 70.0 + salt, p * 5.0)) - 0.5;
    float v = 0.5 + big * 2.3 + bite * 1.05 + grain * 0.28;
    v = 0.5 + 0.47 * tanh1((v - 0.5) * 2.2);
    float amp = 0.4 + 0.6 * smoothstep(0.0, 1.0, p);  // a nick that rips open
    return v * amp;
  }

  vec3 parchment(vec2 px, float dEdge) {
    vec2 uv = px / uRes;
    vec3 base = vec3(0.957, 0.894, 0.776);
    // Lighter centre, warmer rim — like the old CSS gradients.
    float r = length((uv - 0.5) * vec2(1.0, 0.6));
    base = mix(base * vec3(1.02, 1.0, 0.96), vec3(0.80, 0.65, 0.45), smoothstep(0.25, 0.85, r) * 0.45);
    // Paper grain: soft mottling plus fine fibres running across the sheet.
    float mottling = fbm(px * 0.012 + 11.0) - 0.5;
    float tooth = noise(px * 0.45) - 0.5;  // fine, even paper tooth
    base *= 1.0 + mottling * 0.09 + tooth * 0.03;
    // Darkened side margins (the old inset vignette).
    float side = min(px.x, uRes.x - px.x);
    base = mix(base, vec3(0.31, 0.22, 0.12), (1.0 - smoothstep(0.0, 170.0, side)) * 0.55);
    // Torn edges toast a little: browner just inside the tear.
    base = mix(base, vec3(0.55, 0.40, 0.24), exp(-dEdge / 16.0) * 0.55);
    return base;
  }

  void main() {
    vec2 px = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;  // CSS px, y down
    float x = px.x / uRes.x;

    // Fine per-pixel jaggedness so the line frays instead of curving smoothly.
    float jag = (noise(vec2(px.x * 0.9, uSeed)) - 0.5) * 3.0;
    // Inset slightly so the fringe and glow never run off the canvas edge.
    const float INSET = 22.0;
    float lineTop = uTop + INSET + uDepth * tear(x, uPTop, 0.0) + jag;
    float lineBot = uBottom - INSET - uDepth * tear(x, uPBot, 41.0) - jag;
    float dTop = px.y - lineTop;   // > 0 inside the sheet
    float dBot = lineBot - px.y;
    float d = min(dTop, dBot);
    bool nearTop = dTop < dBot;
    float pNear = nearTop ? uPTop : uPBot;
    float lineNear = nearTop ? lineTop : lineBot;

    // The same distance without the per-pixel jag, for smooth shading.
    float dSmooth = min(dTop + jag, dBot + jag);

    vec3 col;
    float a;

    if (d >= 0.0) {
      if (uPaper > 0.5) {
        col = parchment(px, max(dSmooth, 0.0));
        a = 1.0;
      } else {
        // Transparent sheet: a soft shadow under the torn lip only.
        col = vec3(0.0);
        a = 0.4 * exp(-d / 6.0);
      }
      // The exposed white core right at the tear.
      float core = exp(-d / 1.4) * 0.9;
      col = mix(col, vec3(1.0, 0.985, 0.95), core);
      a = max(a, core);
    } else {
      vec4 back = nearTop ? uBack : uBackBot;
      // Where the torn-away area is transparent, blend glow from its own colour,
      // not from black, so it never darkens what shows through.
      col = back.a > 0.0 ? back.rgb : vec3(1.0, 0.95, 0.86);
      a = back.a;
      float o = -d;  // distance outside the sheet
      // Frayed fringe: a band of varying width broken into strands.
      float w = 5.0 + 12.0 * pow(noise(vec2(px.x * 0.07, uSeed + 3.0)), 2.0);
      float strands = noise(vec2(px.x * 1.1, o * 0.12 + uTime * 0.04));
      float band = 1.0 - smoothstep(w * 0.55, w, o);
      float frayed = band * smoothstep(0.25, 0.75, strands + (1.0 - o / w) * 0.6);
      // Occasional long fibres reaching further out.
      float longFibre = step(0.86, noise(vec2(px.x * 0.6, uSeed + 9.0))) *
        (1.0 - smoothstep(w, w + 14.0, o)) * smoothstep(0.55, 0.8, noise(vec2(px.x * 2.3, o * 0.05)));
      float fringe = clamp(frayed + longFibre * 0.7, 0.0, 1.0);
      vec3 fibreCol = mix(vec3(0.93, 0.90, 0.84), vec3(1.0, 0.99, 0.96), fringe);
      col = mix(col, fibreCol, fringe);
      a = max(a, fringe);
      // Soft glow of light catching the fibres.
      float halo = exp(-o / 11.0) * 0.38 * (1.0 - fringe);
      col = mix(col, vec3(1.0, 0.95, 0.86), halo);
      a = max(a, halo);
    }

    // Sheen: a band of warm light that travels along the tear.
    float edgeGlow = exp(-abs(d) / 6.0);
    float sheenX = fract(uTime * 0.065 + pNear * 0.7) * 1.5 - 0.25;
    float sheen = exp(-pow((x - sheenX) * 6.5, 2.0)) * edgeGlow;
    col += vec3(1.0, 0.88, 0.62) * sheen * 0.55;
    a = max(a, sheen * 0.8);

    // Glints: four-point stars twinkling on the fringe.
    if (abs(d) < 40.0) {
      float cellW = 34.0;
      float cell = floor(px.x / cellW);
      float hx = hash(vec2(cell, 1.0));
      if (hx > 0.45) {
        float sx = (cell + 0.2 + 0.6 * hash(vec2(cell, 2.0))) * cellW;
        float sy = lineNear + (nearTop ? -1.0 : 1.0) * (2.0 + 8.0 * hash(vec2(cell, 3.0)));
        float tw = pow(max(0.0, sin(uTime * (0.8 + 1.8 * hash(vec2(cell, 4.0))) + 6.283 * hash(vec2(cell, 5.0)))), 10.0);
        vec2 q = abs(px - vec2(sx, sy));
        float size = 0.6 + hash(vec2(cell, 6.0));
        float star = (exp(-q.y * 1.3) * exp(-q.x * 0.22 / size) + exp(-q.x * 1.3) * exp(-q.y * 0.22 / size)) * 0.8;
        star += exp(-length(q) / (2.2 * size)) * 0.9;
        float s = star * tw;
        vec3 sc = hash(vec2(cell, 7.0)) > 0.5 ? vec3(1.0, 0.82, 0.5) : vec3(1.0, 0.98, 0.94);
        col += sc * s;
        a = max(a, clamp(s, 0.0, 1.0));
      }
    }

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), clamp(a, 0.0, 1.0));
  }
`

interface PaperTearProps {
  /** Element whose on-screen box defines the sheet. */
  targetRef: RefObject<HTMLElement>
  top?: boolean
  bottom?: boolean
  sheet: 'paper' | 'none'
  /** RGBA (0–1) painted where the sheet is torn away. */
  back?: [number, number, number, number]
  /** RGBA below the bottom tear; defaults to `back`. */
  backBottom?: [number, number, number, number]
  /** Tear depth in px on desktop; phones get ~65%. */
  depth?: number
  seed?: number
  className?: string
}

export default function PaperTear({
  targetRef,
  top = false,
  bottom = false,
  sheet,
  back = [0, 0, 0, 0],
  backBottom,
  depth = 120,
  seed = 1,
  className = '',
}: PaperTearProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: false })
    } catch {
      return
    }
    const reduced = prefersReducedMotion()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    wrap.appendChild(renderer.domElement)

    const uniforms = {
      uRes: { value: new Vector2(1, 1) },
      uDpr: { value: dpr },
      uTime: { value: 0 },
      uTop: { value: -1e5 },
      uBottom: { value: 1e5 },
      uPTop: { value: 1 },
      uPBot: { value: 1 },
      uDepth: { value: window.innerWidth < 640 ? depth * 0.65 : depth },
      uSeed: { value: seed },
      uPaper: { value: sheet === 'paper' ? 1 : 0 },
      uBack: { value: new Vector4(...back) },
      uBackBot: { value: new Vector4(...(backBottom ?? back)) },
    }
    const material = new ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true })
    const geometry = new PlaneGeometry(2, 2)
    const scene = new Scene()
    scene.add(new Mesh(geometry, material))
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

    let width = 0
    let height = 0
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      width = r.width
      height = r.height
      renderer.setSize(width, height, false)
      uniforms.uRes.value.set(width, height)
      uniforms.uDepth.value = window.innerWidth < 640 ? depth * 0.65 : depth
    }
    resize()

    const update = () => {
      const target = targetRef.current
      if (!target) return
      const vh = window.innerHeight
      const c = wrap.getBoundingClientRect()
      const t = target.getBoundingClientRect()
      const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)
      uniforms.uTop.value = top ? t.top - c.top : -1e5
      uniforms.uBottom.value = bottom ? t.bottom - c.top : 1e5
      // Each edge starts tearing as it enters from the bottom of the screen.
      uniforms.uPTop.value = reduced ? 1 : clamp01((vh - t.top) / vh)
      uniforms.uPBot.value = reduced ? 1 : clamp01((vh - t.bottom) / vh)
    }

    let raf = 0
    let visible = false
    const start = performance.now()
    const frame = () => {
      uniforms.uTime.value = (performance.now() - start) / 1000
      update()
      renderer.render(scene, camera)
      raf = visible && !reduced ? requestAnimationFrame(frame) : 0
    }
    const renderOnce = () => {
      if (!raf) frame()
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(frame)
    })
    io.observe(wrap)
    const ro = new ResizeObserver(() => {
      resize()
      renderOnce()
    })
    ro.observe(wrap)
    // Reduced motion: no loop, but the sheet must still follow scrolling.
    const onScroll = () => reduced && renderOnce()
    window.addEventListener('scroll', onScroll, { passive: true })
    renderOnce()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
    // back is a tuple literal at call sites; its values are what matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRef, top, bottom, sheet, depth, seed, ...back, ...(backBottom ?? [])])

  return <div ref={wrapRef} aria-hidden="true" className={`pointer-events-none ${className}`} />
}
