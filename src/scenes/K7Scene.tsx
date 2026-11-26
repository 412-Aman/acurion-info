import { Bar, Collapse, Count, Stage, Window, type Act } from '../kit'
import { Icon } from './Icon'
import { BrandMark } from './BrandMark'
import './scenes.css'

// Platform, Acurion K7: the header pill opens into K7's live panel, a reviewer starts it,
// the counts roll as payments are checked and the newest alerts arrive with their reasons.

type S = { open: boolean; running: boolean; progress: number; checked: number; raised: number; look: number; a1: boolean; a2: boolean }
const initial: S = { open: false, running: false, progress: 0, checked: 0, raised: 0, look: 0, a1: false, a2: false }
const POSTER: S = { open: true, running: true, progress: 64, checked: 48212, raised: 31, look: 7, a1: true, a2: true }
const REST = { wide: { x: 470, y: 400 }, compact: { x: 300, y: 420 } }

async function script(a: Act<S>) {
  await a.wait(700)
  await a.move('pill')
  await a.wait(240)
  await a.click()
  await a.set({ open: true })
  await a.wait(900)
  await a.move('start')
  await a.wait(220)
  await a.click()
  await a.set({ running: true, progress: 18, checked: 12480, raised: 6, look: 1 })
  a.move('rest')
  await a.wait(1100)
  await a.set({ progress: 37, checked: 27904, raised: 17, look: 4, a1: true })
  await a.wait(1200)
  await a.set({ progress: 64, checked: 48212, raised: 31, look: 7, a2: true })
  await a.wait(1600)
}

export function K7Scene() {
  return (
    <Stage width={600} height={470} compact={{ below: 540, width: 358, height: 520 }} initial={initial} poster={POSTER} script={script} play="once" cursor={{ at: REST }} greys="cool" className="sc-k7">
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        return (
          <>
            <Window url="acurion.vercel.app" urlShape="pill" className="sc-window" style={compact ? { left: 16, top: 16, width: 420, height: 560 } : { left: 28, top: 28, width: 640, height: 520 }}>
              <div className="ac ac-app">
                <div className="ac-top">
                  <BrandMark size={20} />
                  <span className="ac-crumb"><b>Overview</b></span>
                  <div className="sc-k7-slot">
                    <div className="sc-k7-island" data-open={s.open || undefined}>
                      <div className="sc-island-pill sc-k7-pill" data-target="pill" data-cursor="pointer">
                        <span className="ac-pill-dot" data-state={s.running ? 'running' : 'ready'} />
                        <span>K7</span>
                        <span className="ac-pill-state">{s.running ? 'Running' : 'Ready'}</span>
                      </div>
                      <div className="sc-k7-panel">
                        <div className="sc-k7-head">
                          <div><span className="ac-up-kicker">Acurion K7</span><strong>Live payment monitoring</strong></div>
                          <span className="sc-k7-state" data-running={s.running || undefined}>{s.running ? 'Running' : 'Ready'}</span>
                        </div>
                        <p className="sc-k7-desc">{s.running ? 'Checking payments as they arrive.' : 'Ready. Press Start to check payments as they arrive.'}</p>
                        <div className="k7-track"><i style={{ width: `${s.progress}%`, transition: 'width 1100ms cubic-bezier(.45,0,.1,1)' }} /></div>
                        <div className="k7-stats">
                          <div><small>Payments checked</small><b className="ac-mono"><Count value={s.checked} /></b></div>
                          <div><small>Alerts raised</small><b className="ac-mono k7-alert"><Count value={s.raised} /></b></div>
                          <div><small>Worth a look</small><b className="ac-mono"><Count value={s.look} /></b></div>
                        </div>
                        <Collapse open={s.a2}>
                          <div className="k7-alert-row"><div><b className="ac-mono">al_77b0e2</b><small>First payment to this receiver</small></div><span className="ac-mono">0.911</span></div>
                        </Collapse>
                        <Collapse open={s.a1}>
                          <div className="k7-alert-row"><div><b className="ac-mono">al_9f21c4</b><small>Passed on within 72 hours</small></div><span className="ac-mono">0.962</span></div>
                        </Collapse>
                        <div className="sc-k7-actions">
                          <span className="ac-up-btn is-primary" data-target="start" data-cursor="pointer">{s.running ? <><Icon name="pulse" size={13} />Running</> : <><Icon name="play" size={12} />Start K7</>}</span>
                          <span className="sc-k7-note">Reviewers and admins only</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="ac-avatar">GP</span>
                </div>
                <div className="sc-page">
                  <div className="sc-page-head"><strong>Overview</strong><span>What needs your attention today</span></div>
                  <div className="sc-k7-banner"><Bar w={120} h={8} style={{ background: 'rgb(255 255 255 / .16)' }} /><Bar w={200} h={14} style={{ background: 'rgb(255 255 255 / .22)' }} /></div>
                  <div className="sc-k7-cards">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="ac-card sc-k7-card"><Bar w={[60, 74, 52][i]} h={6} tone={2} /><Bar w={[32, 26, 40][i]} h={16} tone={3} /></div>
                    ))}
                  </div>
                  <div className="ac-card sc-k7-list">
                    <div className="ac-card-head"><strong>Top alerts</strong></div>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="ac-row sc-k7-row" data-sev={i === 0 ? 'high' : undefined}><Bar w={[96, 84, 108][i]} h={6} tone={3} /><span className="ac-meter"><span className="ac-meter-track"><i style={{ width: `${[72, 44, 30][i]}%` }} /></span></span></div>
                    ))}
                  </div>
                </div>
              </div>
            </Window>
            <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
          </>
        )
      }}
    </Stage>
  )
}
