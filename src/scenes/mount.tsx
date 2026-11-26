import { createRoot } from 'react-dom/client'
import { useState, type ComponentType } from 'react'
import '../styles/product.css'
import { Icon } from './Icon'

// Each scene loads only on the page that shows it, when its slot is near the viewport.
const scenes: Record<string, () => Promise<ComponentType>> = {
  investigate: () => import('./InvestigateScene').then((m) => m.InvestigateScene),
  k7: () => import('./K7Scene').then((m) => m.K7Scene),
  upload: () => import('./UploadScene').then((m) => m.UploadScene),
}

function Replayable({ Scene }: { Scene: ComponentType }) {
  const [run, setRun] = useState(0)
  return (
    <>
      <Scene key={run} />
      <button className="scene-replay" type="button" onClick={() => setRun((n) => n + 1)}>
        <Icon name="replay" size={14} />Replay
      </button>
    </>
  )
}

export function mountScenes() {
  const slots = document.querySelectorAll<HTMLElement>('[data-scene]')
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        io.unobserve(entry.target)
        const el = entry.target as HTMLElement
        const load = scenes[el.dataset.scene || '']
        if (!load) continue
        load().then((Scene) => {
          el.classList.add('is-mounted')
          createRoot(el).render(<Replayable Scene={Scene} />)
        })
      }
    },
    { rootMargin: '300px 0px' },
  )
  slots.forEach((el) => io.observe(el))
}
