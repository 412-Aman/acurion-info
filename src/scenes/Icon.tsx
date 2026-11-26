import { ICONS } from '../icons'

/** The site's icon set (the Acurion app's own icons) inside the React scenes. */
export function Icon({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <svg className="ic" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />
  )
}
