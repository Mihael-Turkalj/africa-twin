import { useEffect, useRef, useState } from 'react'
import crankBox from '../../assets/plates/crank-box.png'
import kickLever from '../../assets/plates/kick-lever.png'
import { assemblies, pad } from '../data/assemblies'
import { MAX_POINTERS, pointers, type Pointer } from '../data/pointers'
import { MAX_LAYERS, STEPS, backUrl, layers, occluderUrl, occluders, partUrl, pins, stageUrl, tagAnchors, type Layer } from '../data/strip'
import { clamp01, gsap, usePrefersReducedMotion } from '../motion'

/*
 * The strip-down, driven by a kickstart. Scrolling only moves the page; the bike comes apart when the
 * visitor yanks the lever down past its catch (or presses Enter on it). Each kick:
 *   the bike jolts -> the resting piece flies off along its path -> the next stage takes its place with
 *   the next piece sitting on it -> that piece lifts on its strut -> threads draw out to its labels.
 * In step k the base image is stage k and step k's pieces float, lifted, until the next kick. Two banks
 * of piece layers alternate so the leaving piece and the arriving one can move at the same time.
 * Everything that moves is written by one ticker from a small state object the timelines tween.
 */

// the bike box in plate pixels; the strut and thread overlays share this coordinate space
const PW = 2360
const PH = 1630
// phones have little wall around the bike, so pieces travel a shorter way (and less sideways)
const PHONE = '(max-width: 899px)'
const PHONE_LIFT_X = 0.45
const PHONE_LIFT_Y = 0.6
// the kickstart lever, in degrees clockwise from pointing right: it rests a little raised and kicks
// down through a catch; letting go before the catch just lets it spring back
const LEVER_REST = -15
const LEVER_CATCH = 56
const LEVER_MAX = 74
const STRIP_FRAME = 0.065 // seconds per stage when the bike flips through several steps at once

const baseOf = (s: number) => Math.min(STEPS - 1, s)
// before step s lifts, the bike looks like the stage before it
const preLiftOf = (s: number) => (layers[s] ? baseOf(s - 1) : baseOf(s))
const nextOf = (s: number) => (s >= STEPS ? 0 : s + 1)

type Bank = { k: number; l: number; x: number }
type Pose = { dx: number; dy: number; rot: number; ox: number; oy: number }
type Thread = { p: Pointer; layer: number } // layer -1: pinned to the still frame

/** Where a point on a piece (plate px) ends up under a pose. */
function place(px: number, py: number, q: Pose) {
  const cx = (q.ox / 100) * PW
  const cy = (q.oy / 100) * PH
  const a = (q.rot * Math.PI) / 180
  return {
    x: cx + (px - cx) * Math.cos(a) - (py - cy) * Math.sin(a) + (q.dx / 100) * PW,
    y: cy + (px - cx) * Math.sin(a) + (py - cy) * Math.cos(a) + (q.dy / 100) * PH,
  }
}

/** A tab from the wall pushed through a slit in the card and folded flat. */
function SlotTab({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 64 34" aria-hidden="true">
      <path d="M12 22 V8 Q12 3 17 3 H47 Q52 3 52 8 V22 Z" fill="#b28b6c" />
      <path d="M12 22 V8 Q12 3 17 3 H47 Q52 3 52 8 V22" fill="none" stroke="#7d5a43" strokeOpacity="0.45" strokeWidth="1.2" />
      <path d="M15 8.5 H49" stroke="#fff3e4" strokeOpacity="0.35" strokeWidth="1.4" />
      <rect x="6" y="21" width="52" height="5" rx="2.5" fill="#3b190d" fillOpacity="0.72" />
      <rect x="8" y="26" width="48" height="2" rx="1" fill="#fff3e4" fillOpacity="0.35" />
    </svg>
  )
}

function Screw({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#c9a882" stroke="#8b6b52" strokeWidth="1.2" />
      <path d="M6.5 13.5 17.5 10.5" stroke="#6a4c3a" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/** The lever's sweep, drawn as a crimson thread with an arrowhead, in the lever box's own units (380 x 165). */
function KickArc() {
  const r = 262 // just outside the foot peg
  const cx = 64.6
  const cy = 82.5
  const at = (deg: number) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)]
  const [x0, y0] = at(LEVER_REST + 4)
  const [x1, y1] = at(LEVER_CATCH)
  return (
    <svg className="kick-arc" viewBox="0 0 380 165" aria-hidden="true">
      <path d={`M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`} className="kick-arc-path" />
      <path d="M0 0 L-22 -11 L-16 0 L-22 11 Z" className="kick-arc-head" transform={`translate(${x1.toFixed(1)} ${y1.toFixed(1)}) rotate(${LEVER_CATCH + 90})`} />
    </svg>
  )
}

export default function Hero() {
  const frameRef = useRef<HTMLElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLImageElement>(null)
  const tagRef = useRef<HTMLParagraphElement>(null)
  const kickRef = useRef<HTMLDivElement>(null)
  const leverRef = useRef<HTMLButtonElement>(null)
  const boxRef = useRef<HTMLImageElement>(null)
  const tabsRef = useRef<HTMLOListElement>(null)
  const goRef = useRef<(to: number) => void>(() => {})
  const [step, setStep] = useState(0)
  const [kicked, setKicked] = useState(false)
  const reduced = usePrefersReducedMotion()

  // On phones the tabs are a scrolling strip: keep the current one in view without moving the page.
  useEffect(() => {
    const list = tabsRef.current
    const cur = list?.querySelector<HTMLElement>('[aria-current="step"]')
    if (!list || !cur || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: cur.offsetLeft - 16, behavior: 'smooth' })
  }, [step])

  // Stages and pieces load after the first paint (stage 0 is preloaded in index.html) and are decoded
  // ahead, so a kick never waits on an image.
  useEffect(() => {
    const keep: HTMLImageElement[] = []
    const load = (src: string) => {
      const img = new Image()
      img.src = src
      img.decode().catch(() => {})
      keep.push(img)
    }
    const t = window.setTimeout(() => {
      for (let k = 1; k <= STEPS; k++) {
        if (k < STEPS) load(stageUrl(k))
        for (const layer of layers[k] ?? []) {
          load(partUrl(layer.id))
          load(backUrl(layer.id))
        }
        if (occluders[k]) load(occluderUrl(occluders[k]))
      }
    }, 400)
    return () => {
      window.clearTimeout(t)
      keep.length = 0
    }
  }, [])

  useEffect(() => {
    const frame = frameRef.current!
    const stack = stackRef.current!
    const stage = stageRef.current!
    const tag = tagRef.current!
    const lever = leverRef.current!
    const kick = kickRef.current!
    const box = boxRef.current!
    const phone = window.matchMedia(PHONE)
    const d = (s: number) => (reduced ? 0 : s)
    setStep(0)
    stage.src = stageUrl(0)

    const bankEls = [...stack.querySelectorAll<HTMLElement>('.bank')].map((b) => [...b.querySelectorAll<HTMLElement>('.lift')])
    const strutEls = [...stack.querySelectorAll<SVGGElement>('.strut-bank')].map((b) => [...b.querySelectorAll<SVGGElement>('.strut')])
    const occ = stack.querySelector<HTMLImageElement>('.occluder')!
    const threadEls = [...stack.querySelectorAll<SVGGElement>('.thread')]
    const labelEls = [...stack.querySelectorAll<HTMLElement>('.pointer-label')]

    // everything the ticker draws
    const S = { step: 0, front: 0, settle: 0, pointersIn: 0, tagIn: 0 }
    const banks: Bank[] = [
      { k: -1, l: 0, x: 0 },
      { k: -1, l: 0, x: 0 },
    ]
    let threads: Thread[] = []
    // labels are kept inside the window (phones have no wall to spare): the box and label widths are
    // measured when the labels change or the window resizes, never per frame
    const fit = { left: 0, width: 1, view: 1, labels: [] as number[] }
    const measure = () => {
      const r = stack.getBoundingClientRect()
      fit.left = r.left
      fit.width = r.width || 1
      fit.view = document.documentElement.clientWidth
      fit.labels = labelEls.map((el) => el.offsetWidth)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(stack)

    const assign = (b: number, k: number) => {
      const bank = banks[b]
      bank.k = k
      bank.l = 0
      bank.x = 0
      ;(layers[k] ?? []).forEach((layer, i) => {
        const slot = bankEls[b][i]
        const ox = layer.ox ?? 50
        const oy = layer.oy ?? 60
        const pin = layer.axle ? { x: ox, y: oy } : pins[layer.id]
        ;(slot.children[0] as HTMLImageElement).src = backUrl(layer.id)
        ;(slot.children[1] as HTMLImageElement).src = partUrl(layer.id)
        slot.style.transformOrigin = `${ox}% ${oy}%`
        const brad = slot.children[2] as HTMLElement
        brad.style.left = `${pin.x}%`
        brad.style.top = `${pin.y}%`
      })
      if (occluders[k]) occ.src = occluderUrl(occluders[k])
    }

    const setThreads = (k: number) => {
      threads = []
      if (k === STEPS) threads = pointers.frame.map((p) => ({ p, layer: -1 }))
      else (layers[k] ?? []).forEach((layer, i) => (pointers[layer.id] ?? []).forEach((p) => threads.push({ p, layer: i })))
      threads = threads.slice(0, MAX_POINTERS)
      labelEls.forEach((el, i) => {
        const t = threads[i]
        el.textContent = t ? t.p.text : ''
        el.dataset.side = t && t.p.lx < 0 ? 'left' : 'right'
      })
      measure()
    }

    const poseOf = (layer: Layer, bank: Bank, bob: { y: number; r: number }, sx: number, sy: number): Pose => {
      // leaving carries the piece further along its own path
      const reach = bank.l * (1 + 1.5 * bank.x)
      return {
        dx: layer.dx * sx * reach,
        dy: layer.dy * sy * reach + bob.y,
        rot: layer.rot * sx * reach + bob.r,
        ox: layer.ox ?? 50,
        oy: layer.oy ?? 60,
      }
    }

    const render = () => {
      const sx = phone.matches ? PHONE_LIFT_X : 1
      const sy = phone.matches ? PHONE_LIFT_Y : 1
      const now = performance.now() / 1000
      const poses: Pose[][] = [[], []]
      banks.forEach((bank, b) => {
        const pieces = bank.k >= 0 ? (layers[bank.k] ?? []) : []
        // a lifted piece sways a little on its strut while it waits for the next kick
        const sway = b === S.front && !reduced ? S.settle : 0
        pieces.forEach((layer, i) => {
          const bob = { y: Math.sin(now * 1.9 + i * 1.3) * 0.45 * sway, r: Math.sin(now * 1.4 + i) * 0.5 * sway }
          poses[b][i] = poseOf(layer, bank, bob, sx, sy)
        })
        bankEls[b].forEach((slot, i) => {
          const layer = pieces[i]
          const strut = strutEls[b][i]
          if (!layer) {
            slot.style.opacity = strut.style.opacity = '0'
            return
          }
          const q = poses[b][i]
          slot.style.transform = `translate(${q.dx.toFixed(2)}%, ${q.dy.toFixed(2)}%) rotate(${q.rot.toFixed(2)}deg)`
          slot.style.opacity = String(1 - bank.x)
          slot.dataset.lifted = String(bank.l > 0.02)
          const back = slot.children[0] as HTMLElement
          // the crimson card the piece is cut from shows at its edge as it comes off the wall
          back.style.opacity = String(clamp01(bank.l / 0.15))
          back.style.transform = `translate(${(0.45 * bank.l).toFixed(2)}%, ${(0.7 * bank.l).toFixed(2)}%)`
          // the strut runs from where the piece was fastened to the same point on the lifted piece
          if (layer.axle) {
            strut.style.opacity = '0'
            return
          }
          const pin = pins[layer.id]
          const px = (pin.x / 100) * PW
          const py = (pin.y / 100) * PH
          const e = place(px, py, q)
          for (const line of strut.querySelectorAll('line')) {
            line.setAttribute('x1', px.toFixed(1))
            line.setAttribute('y1', py.toFixed(1))
            line.setAttribute('x2', e.x.toFixed(1))
            line.setAttribute('y2', e.y.toFixed(1))
          }
          strut.querySelector('.strut-foot')!.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)})`)
          strut.style.opacity = String((1 - bank.x) * clamp01((bank.l - 0.04) / 0.12))
        })
      })
      const occBank = banks.find((bank) => bank.k >= 0 && occluders[bank.k])
      occ.style.opacity = occBank ? String(1 - occBank.x) : '0'

      // threads from the front bank's pieces (or the still frame) out to their labels
      threadEls.forEach((g, i) => {
        const t = threads[i]
        const label = labelEls[i]
        const draw = t ? clamp01(S.pointersIn * 1.6 - i * 0.2) : 0
        if (!t || draw <= 0) {
          g.style.opacity = '0'
          label.style.opacity = '0'
          return
        }
        let a = { x: (t.p.x / 100) * PW, y: (t.p.y / 100) * PH }
        if (t.layer >= 0) {
          const q = poses[S.front][t.layer]
          if (q) a = place(a.x, a.y, q)
        }
        let lx = a.x + (t.p.lx / 100) * PW
        const ly = a.y + (t.p.ly / 100) * PH
        // slide the label (and the thread's end with it) back inside the window
        const w = (fit.labels[i] / fit.width) * PW
        const lo = ((8 - fit.left) / fit.width) * PW + (t.p.lx < 0 ? w : 0)
        const hi = ((fit.view - 8 - fit.left) / fit.width) * PW - (t.p.lx < 0 ? 0 : w)
        lx = Math.min(hi, Math.max(lo, lx))
        const line = g.querySelector('line')!
        line.setAttribute('x1', a.x.toFixed(1))
        line.setAttribute('y1', a.y.toFixed(1))
        line.setAttribute('x2', lx.toFixed(1))
        line.setAttribute('y2', ly.toFixed(1))
        line.style.strokeDashoffset = String(1 - clamp01(draw / 0.7))
        g.querySelector('circle')!.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)})`)
        g.style.opacity = '1'
        label.style.left = `${((lx / PW) * 100).toFixed(2)}%`
        label.style.top = `${((ly / PH) * 100).toFixed(2)}%`
        label.style.opacity = String(clamp01((draw - 0.55) / 0.35))
      })
      tag.style.opacity = String(S.tagIn)
    }

    // draw every frame while the bike is on screen (the sway is continuous), never while it is not
    let ticking = false
    const setTicking = (on: boolean) => {
      if (on === ticking) return
      ticking = on
      if (on) gsap.ticker.add(render)
      else gsap.ticker.remove(render)
    }
    const io = new IntersectionObserver(([e]) => setTicking(e.isIntersecting))
    io.observe(frame)

    // ---------- the kickstart lever ----------
    const lv = { a: LEVER_REST }
    const setLever = (a: number) => {
      lv.a = a
      lever.style.transform = `rotate(${a.toFixed(2)}deg)`
    }
    setLever(LEVER_REST)
    let spring: gsap.core.Tween | null = null
    const springBack = (fast: boolean) => {
      spring?.kill()
      spring = gsap.to(lv, {
        a: LEVER_REST,
        duration: d(fast ? 0.55 : 0.4),
        ease: fast ? 'back.out(2.4)' : 'back.out(1.6)',
        onUpdate: () => setLever(lv.a),
      })
    }
    // until the first kick the lever dips now and then, to show it moves
    let hinting = !reduced
    const hint = gsap.timeline({ repeat: -1, repeatDelay: 2.4, delay: 1.4, paused: reduced })
    const stopHint = () => {
      hinting = false
      hint.kill()
    }
    hint
      .to(lv, { a: LEVER_REST + 16, duration: 0.32, ease: 'power2.out', onUpdate: () => setLever(lv.a) })
      .to(lv, { a: LEVER_REST, duration: 0.5, ease: 'back.out(2)', onUpdate: () => setLever(lv.a) })

    let tl: gsap.core.Timeline | null = null
    const go = (to: number) => {
      if (to === S.step) return
      stopHint()
      tl?.progress(1).kill()
      const from = S.step
      S.step = to
      setStep(to)
      const old = S.front
      const nb = 1 - old
      tl = gsap.timeline()
      // the kick lands: the bike and the box jolt
      if (!reduced) {
        tl.fromTo(
          stack,
          { yPercent: 0, rotation: 0 },
          {
            keyframes: [
              { yPercent: 1.4, rotation: 0.6, duration: 0.07, ease: 'power2.out' },
              { yPercent: -0.7, rotation: -0.35, duration: 0.1, ease: 'power1.inOut' },
              { yPercent: 0, rotation: 0, duration: 0.2, ease: 'power2.out' },
            ],
          },
          0,
        )
        tl.fromTo(box, { x: 0 }, { keyframes: [{ x: -3, duration: 0.05 }, { x: 2, duration: 0.07 }, { x: 0, duration: 0.12 }] }, 0)
      }
      // the resting piece, its threads and its name leave; the piece flies on along its path
      tl.to(S, { pointersIn: 0, tagIn: 0, duration: d(0.14), ease: 'power1.in' }, 0)
      tl.to(S, { settle: 0, duration: d(0.2) }, 0)
      tl.to(banks[old], { x: 1, duration: d(0.36), ease: 'power2.in' }, 0)
      // several steps at once: the bike flips through the stages in between
      const flips: number[] = []
      for (let cur = baseOf(from), target = preLiftOf(to); cur !== target; ) {
        cur += Math.sign(target - cur)
        flips.push(cur)
      }
      flips.forEach((idx, n) => tl!.call(() => void (stage.src = stageUrl(idx)), [], d(STRIP_FRAME) * (n + 1)))
      const at = flips.length ? d(STRIP_FRAME) * (flips.length + 1) : d(0.04)
      // the next stage takes its place with the next pieces sitting on it, exactly where they were
      tl.call(
        () => {
          assign(nb, layers[to] ? to : -1)
          stage.src = stageUrl(baseOf(to))
          S.front = nb
          setThreads(to)
          // the name strip moves to its new place only once the old one has gone
          if (layers[to]) {
            const anchor = tagAnchors[to]
            tag.textContent = assemblies[to - 1].label
            tag.dataset.side = anchor.side
            tag.style.left = `${anchor.x}%`
            tag.style.top = `${anchor.y}%`
          }
          render()
        },
        [],
        at,
      )
      if (layers[to]) {
        // lifted off the wall on the strut: a confident rise with a small settle, as a sprung strut would
        tl.to(banks[nb], { l: 1, duration: d(0.8), ease: 'back.out(1.25)' }, at + d(0.06))
        tl.to(S, { tagIn: 1, duration: d(0.3), ease: 'power2.out' }, at + d(0.5))
        tl.to(S, { settle: 1, duration: d(0.8), ease: 'power1.inOut' }, at + d(0.8))
      }
      tl.to(S, { pointersIn: 1, duration: d(0.9), ease: 'none' }, at + d(layers[to] ? 0.55 : 0.1))
      tl.call(() => void (S.front !== old && (banks[old].k = -1)), [], Math.max(d(0.38), at))
      if (!ticking) tl.eventCallback('onUpdate', render)
    }
    goRef.current = go

    const pivot = () => {
      const r = kick.getBoundingClientRect()
      return { x: r.left + r.width * 0.17, y: r.top + r.height * 0.5 }
    }
    const angleAt = (e: PointerEvent) => {
      const p = pivot()
      return (Math.atan2(e.clientY - p.y, e.clientX - p.x) * 180) / Math.PI
    }
    let drag: { id: number; grab: number; caught: boolean; moved: number } | null = null
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || drag) return
      e.preventDefault()
      lever.setPointerCapture(e.pointerId)
      hint.pause()
      spring?.kill()
      drag = { id: e.pointerId, grab: angleAt(e) - lv.a, caught: false, moved: 0 }
      lever.dataset.dragging = 'true'
    }
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      let a = angleAt(e) - drag.grab
      // past the catch the spring stiffens
      if (a > LEVER_CATCH) a = LEVER_CATCH + (a - LEVER_CATCH) * 0.45
      a = Math.min(LEVER_MAX, Math.max(LEVER_REST, a))
      drag.moved = Math.max(drag.moved, a - LEVER_REST)
      setLever(a)
      const caught = a >= LEVER_CATCH
      if (caught !== drag.caught) {
        drag.caught = caught
        lever.dataset.caught = String(caught)
      }
    }
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const { caught, moved } = drag
      drag = null
      lever.dataset.dragging = 'false'
      lever.dataset.caught = 'false'
      springBack(caught)
      if (caught) {
        setKicked(true)
        go(nextOf(S.step))
        return
      }
      if (hinting) hint.restart(true)
      if (moved > 6 && !reduced) {
        // a half-hearted kick: the engine does not catch, the box just rattles
        gsap.fromTo(box, { x: 0 }, { keyframes: [{ x: 2, duration: 0.04 }, { x: -2, duration: 0.05 }, { x: 1, duration: 0.05 }, { x: 0, duration: 0.06 }] })
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'ArrowDown') return
      e.preventDefault()
      if (e.repeat) return
      setKicked(true)
      spring?.kill()
      spring = gsap.to(lv, {
        a: LEVER_MAX - 4,
        duration: d(0.14),
        ease: 'power3.in',
        onUpdate: () => setLever(lv.a),
        onComplete: () => springBack(true),
      })
      go(nextOf(S.step))
    }
    lever.addEventListener('pointerdown', onDown)
    lever.addEventListener('pointermove', onMove)
    lever.addEventListener('pointerup', onUp)
    lever.addEventListener('pointercancel', onUp)
    lever.addEventListener('keydown', onKey)

    render()
    return () => {
      io.disconnect()
      ro.disconnect()
      setTicking(false)
      tl?.kill()
      hint.kill()
      spring?.kill()
      lever.removeEventListener('pointerdown', onDown)
      lever.removeEventListener('pointermove', onMove)
      lever.removeEventListener('pointerup', onUp)
      lever.removeEventListener('pointercancel', onUp)
      lever.removeEventListener('keydown', onKey)
      gsap.set([stack, box], { clearProps: 'transform' })
      goRef.current = () => {}
    }
  }, [reduced])

  const a = step > 0 ? assemblies[step - 1] : null

  return (
    <section ref={frameRef} className="comp-frame hero" aria-labelledby="hero-title" data-step={step} data-kicked={kicked}>
      <div className="r-headline-card card" aria-hidden="true">
        <SlotTab className="slot-tab slot-tab-left" />
        <SlotTab className="slot-tab slot-tab-right" />
      </div>
      <div className="card-intro" aria-hidden={step > 0}>
        <h1 id="hero-title" className="r-headline headline">
          <span>XRV750</span>
          <span>Africa</span>
          <span>Twin</span>
        </h1>
        <div className="r-rule-top rule" aria-hidden="true" />
        <p className="r-subline subline">Kick it over and it comes apart, one assembly at a time.</p>
      </div>
      <div className="r-rule-bottom rule" aria-hidden="true" />
      <p className="r-note note">Unofficial showcase · RD07 · 1993-2003</p>

      <article className="caption" aria-live="polite" hidden={!a}>
        {a && (
          <div key={a.id} className="caption-inner">
            <p className="caption-count">
              <span className="caption-now">{pad(step)}</span> / {STEPS}
            </p>
            <h2 className="caption-title">{a.title}</h2>
            <ul className="caption-facts">
              {a.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <div className="r-plinth-shadow plinth-shadow" aria-hidden="true" />
      <div className="r-plinth plinth" aria-hidden="true" />
      <img ref={boxRef} className="r-crank-box plate" src={crankBox} alt="" />
      <div ref={kickRef} className="r-crank-arm kick">
        <KickArc />
        <p className="kick-label" aria-hidden="true">
          {step === STEPS ? 'Kick to rebuild' : 'Kick'}
        </p>
        <button
          ref={leverRef}
          type="button"
          className="lever"
          aria-label={
            step === STEPS
              ? 'Kickstart lever. Drag it down hard, or press Enter, to put the bike back together.'
              : 'Kickstart lever. Drag it down hard, or press Enter, to take off the next assembly.'
          }
        >
          <img className="plate lever-arm" src={kickLever} alt="" draggable={false} />
        </button>
      </div>

      <div ref={stackRef} className="r-bike bike-stack" data-step={step}>
        <img
          ref={stageRef}
          className="stage"
          src={stageUrl(0)}
          alt={
            step === 0
              ? 'Paper model of a 1990s XRV750 Africa Twin in white, red and blue, seen from the side'
              : step === STEPS
                ? 'The bare steel frame of the paper model'
                : `The paper model with its ${assemblies[step - 1].label.toLowerCase()} lifted away`
          }
        />
        <svg className="struts" viewBox={`0 0 ${PW} ${PH}`} aria-hidden="true">
          {[0, 1].map((b) => (
            <g key={b} className="strut-bank">
              {Array.from({ length: MAX_LAYERS }, (_, i) => (
                <g key={i} className="strut" style={{ opacity: 0 }}>
                  <line className="strut-edge" />
                  <line className="strut-face" />
                  <line className="strut-crease" />
                  <g className="strut-foot">
                    <circle r="22" className="brad" />
                    <path d="M-12 4 12 -4" className="brad-slot" />
                  </g>
                </g>
              ))}
            </g>
          ))}
        </svg>
        {[0, 1].map((b) => (
          <div key={b} className="bank">
            {Array.from({ length: MAX_LAYERS }, (_, i) => (
              <div key={i} className="lift" data-lifted="false" style={{ opacity: 0 }}>
                <img className="back" src={backUrl(layers[1][0].id)} alt="" />
                <img className="part" src={partUrl(layers[1][0].id)} alt="" />
                <span className="brad-pin" />
              </div>
            ))}
          </div>
        ))}
        <img className="occluder" src={occluderUrl(occluders[4])} alt="" style={{ opacity: 0 }} />
        <svg className="threads" viewBox={`0 0 ${PW} ${PH}`} aria-hidden="true">
          {Array.from({ length: MAX_POINTERS }, (_, i) => (
            <g key={i} className="thread" data-index={i} style={{ opacity: 0 }}>
              <line pathLength={1} className="thread-line" />
              <circle r="11" className="thread-pin" />
            </g>
          ))}
        </svg>
        {Array.from({ length: MAX_POINTERS }, (_, i) => (
          <span key={i} className="pointer-label" data-index={i} style={{ opacity: 0 }} aria-hidden="true" />
        ))}
        {/* text and place are set with each kick, in step with the pieces */}
        <p ref={tagRef} className="lift-tag" data-side="right" style={{ opacity: 0 }} aria-hidden="true" />
      </div>

      <ul className="specs" aria-label="Key figures">
        <li className="r-spec-1 spec">
          <span className="spec-chip">742 cc V-twin</span>
        </li>
        <li className="r-spec-2 spec">
          <span className="spec-chip">23 L tank</span>
        </li>
        <li className="r-spec-3 spec">
          <span className="spec-chip">21 / 17 in wheels</span>
        </li>
      </ul>

      <nav className="rail-nav" aria-labelledby="rail-title">
        <div className="r-rail rail" aria-hidden="true">
          <Screw className="screw screw-top" />
          <Screw className="screw screw-bottom" />
        </div>
        <h2 id="rail-title" className="r-rail-label rail-label">
          How it comes apart
        </h2>
        <ol ref={tabsRef} className="tabs">
          {assemblies.map((as, k) => (
            <li key={as.id} className={`r-tab-${pad(k + 1)}`}>
              <button
                type="button"
                className="tab"
                aria-current={(step === 0 ? k === 0 : step === k + 1) ? 'step' : undefined}
                data-done={step > k + 1}
                onClick={() => {
                  setKicked(true)
                  goRef.current(k + 1)
                }}
              >
                <span className="tab-num">{pad(k + 1)}</span> {as.label}
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  )
}
