import './styles/site.css'
import './styles/product.css'
import './styles/pages.css'

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Header: a hairline appears once the page has scrolled under it.
const header = document.querySelector<HTMLElement>('.site-header')
const onScroll = () => header?.toggleAttribute('data-scrolled', window.scrollY > 8)
onScroll()
window.addEventListener('scroll', onScroll, { passive: true })

// Mobile menu: a full-screen sheet with the pages.
const menu = document.querySelector<HTMLDialogElement>('#mobile-menu')
const menuButton = document.querySelector<HTMLButtonElement>('.menu-button')
menuButton?.addEventListener('click', () => {
  menu?.showModal()
  menuButton.setAttribute('aria-expanded', 'true')
})
menu?.addEventListener('close', () => menuButton?.setAttribute('aria-expanded', 'false'))
menu?.querySelector('.menu-close')?.addEventListener('click', () => menu.close())
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.close()))
window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => e.matches && menu?.open && menu.close())

// Reveal: content rises in once as it reaches the viewport.
const reveal = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-in')
      reveal.unobserve(entry.target)
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
)
document.querySelectorAll('[data-rise], [data-draw]').forEach((el) => reveal.observe(el))

// Numbers count up once when they come into view, landing on the exact figure written in the page.
const counters = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      counters.unobserve(entry.target)
      const el = entry.target as HTMLElement
      const target = el.dataset.count || el.textContent || ''
      const value = Number(target)
      if (reduced || !Number.isFinite(value)) continue
      const decimals = (target.split('.')[1] || '').length
      const start = performance.now()
      const duration = 1400
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 4)
        el.textContent = (value * eased).toFixed(decimals)
        if (t < 1) requestAnimationFrame(tick)
        else el.textContent = target
      }
      requestAnimationFrame(tick)
    }
  },
  { threshold: 0.6 },
)
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => counters.observe(el))

// How it works: the sticky picture follows the step being read. On phones each step carries its own copy.
document.querySelectorAll<HTMLElement>('[data-steps]').forEach((root) => {
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'))
  const views = Array.from(root.querySelectorAll<HTMLElement>('[data-view]'))
  const dots = Array.from(root.querySelectorAll<HTMLElement>('[data-step-dot]'))
  views.forEach((view) => {
    const slot = root.querySelector<HTMLElement>(`[data-mobile-for="${view.dataset.view}"]`)
    if (!slot) return
    const copy = view.cloneNode(true) as HTMLElement
    copy.removeAttribute('data-view')
    copy.setAttribute('aria-hidden', 'true')
    slot.append(copy)
  })
  const show = (name: string) => {
    steps.forEach((s) => s.toggleAttribute('data-active', s.dataset.step === name))
    views.forEach((v) => v.toggleAttribute('data-active', v.dataset.view === name))
    dots.forEach((d) => d.toggleAttribute('data-active', d.dataset.stepDot === name))
  }
  const watch = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) show((entry.target as HTMLElement).dataset.step || '')
    },
    { rootMargin: '-45% 0px -45% 0px' },
  )
  steps.forEach((s) => watch.observe(s))
  if (steps[0]) show(steps[0].dataset.step || '')
})

// Animated product scenes load only on pages that have them.
if (document.querySelector('[data-scene]')) import('./scenes/mount').then((m) => m.mountScenes())
