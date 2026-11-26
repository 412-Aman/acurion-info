import { Bar, Collapse, Stage, Window, type Act } from '../kit'
import { Icon } from './Icon'
import { BrandMark } from './BrandMark'
import './scenes.css'

// Home hero: K7 flags a payment, the alert pops out of the header pill and lands at the top of the list,
// the investigator opens it, reads why it was flagged and escalates it; the pill confirms the case.

type Island = 'pill' | 'alert' | 'case'
type S = { island: Island; row: boolean; active: boolean; detail: boolean; decision: '' | 'escalate'; escalated: boolean }

const initial: S = { island: 'pill', row: false, active: false, detail: false, decision: '', escalated: false }
const POSTER: S = { island: 'case', row: true, active: true, detail: true, decision: 'escalate', escalated: true }
const REST = { wide: { x: 236, y: 470 }, compact: { x: 300, y: 150 } }

async function script(a: Act<S>) {
  await a.wait(900)
  await a.set({ island: 'alert' })
  await a.wait(420)
  await a.set({ row: true })
  await a.wait(1700)
  await a.set({ island: 'pill' })
  await a.wait(350)
  await a.move('new-row')
  await a.wait(260)
  await a.click()
  await a.set({ active: true, detail: true })
  await a.wait(2100)
  await a.move('escalate')
  await a.wait(220)
  await a.click()
  await a.set({ decision: 'escalate' })
  await a.wait(520)
  await a.move('save')
  await a.wait(200)
  await a.click()
  await a.set({ island: 'case', escalated: true })
  await a.move('rest')
  await a.wait(1200)
}

const WHY = [
  { label: 'Passed on within 72 hours', value: '+1.42', w: 1 },
  { label: 'First payment to this receiver', value: '+0.88', w: 0.62 },
  { label: 'Far above usual payments', value: '+0.61', w: 0.43 },
]

export function InvestigateScene() {
  return (
    <Stage width={640} height={532} compact={{ below: 560, width: 358, height: 578 }} initial={initial} poster={POSTER} script={script} play="once" cursor={{ at: REST }} greys="cool" className="sc-investigate">
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        return (
          <>
            <Window url="acurion.vercel.app/alerts" urlShape="pill" className="sc-window" style={compact ? { left: 16, top: 16, width: 430, height: 640 } : { left: 28, top: 28, width: 700, height: 600 }}>
              <div className="ac ac-app">
                <div className="ac-top">
                  <BrandMark size={20} />
                  <span className="ac-crumb">{compact ? <b>Alerts</b> : <>Investigate <i /> <b>Alerts</b></>}</span>
                  <div className="sc-island-slot">
                    <div className="sc-island" data-open={s.island !== 'pill' || undefined} data-tone={s.island}>
                      <div className="sc-island-pill">
                        <span className="ac-pill-dot" data-state="running" />
                        <span>K7</span>
                        <span className="ac-pill-meter"><i style={{ width: '62%' }} /></span>
                      </div>
                      <div className="sc-island-body" data-show={s.island === 'alert' || undefined}>
                        <span className="ac-notice-mark" />
                        <div><strong>K7 flagged a payment</strong><small><span className="ac-mono">al_9f21c4</span> · score 0.962</small></div>
                      </div>
                      <div className="sc-island-body" data-tone="ok" data-show={s.island === 'case' || undefined}>
                        <span className="ac-notice-mark" />
                        <div><strong>Case opened</strong><small><span className="ac-mono">CASE-0142</span> · audit trail updated</small></div>
                      </div>
                    </div>
                  </div>
                  <span className="ac-avatar">AR</span>
                </div>
                <div className="sc-page">
                  <div className="sc-page-head"><strong>Alerts</strong><span>Highest risk first</span></div>
                  <div className="ac-card sc-list">
                    <div className="ac-th sc-grid"><span>Alert</span>{!compact && <span>Account</span>}<span>Risk</span>{!compact && <span>Stage</span>}</div>
                    <Collapse open={s.row}>
                      <div className="ac-row sc-grid" data-sev="critical" data-target="new-row" data-cursor="pointer" data-active={s.active || undefined}>
                        <span><span className="ac-id">al_9f21c4<span className="ac-new">New</span></span><span className="ac-sub"><span className="ac-src"><Icon name="pulse" size={11} />K7 live</span></span></span>
                        {!compact && <span className="ac-mono sc-acct">16975:80634E1E</span>}
                        <span className="ac-meter" data-tone="critical"><span className="ac-meter-track"><i style={{ width: '96%' }} /></span><b>0.962</b></span>
                        {!compact && <span className="ac-stage" data-stage={s.escalated ? 'escalated' : 'open'}>{s.escalated ? 'Escalated' : 'Open'}</span>}
                      </div>
                    </Collapse>
                    <div className="ac-row sc-grid" data-sev="high">
                      <span><span className="ac-id">UP-a7c2-014</span><span className="ac-sub">bank_export.csv</span></span>
                      {!compact && <span className="ac-mono sc-acct">ACC-10293</span>}
                      <span className="ac-meter" data-tone="high"><span className="ac-meter-track"><i style={{ width: '87%' }} /></span><b>0.874</b></span>
                      {!compact && <span className="ac-stage" data-stage="review">Under review</span>}
                    </div>
                    <div className="ac-row sc-grid" data-sev="medium">
                      <span><span className="ac-id">RULE-CW-1003</span><span className="ac-sub">Rules</span></span>
                      {!compact && <span className="ac-mono sc-acct">CUST-1001</span>}
                      <span className="ac-meter" data-tone="medium"><span className="ac-meter-track"><i style={{ width: '58%' }} /></span><b>58</b></span>
                      {!compact && <span className="ac-stage" data-stage="open">Open</span>}
                    </div>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="ac-row sc-grid">
                        <span className="sc-filler"><Bar w={[92, 78, 104][i]} h={6} tone={3} /><Bar w={[54, 66, 48][i]} h={5} tone={2} /></span>
                        {!compact && <span><Bar w={[70, 82, 64][i]} h={6} tone={2} /></span>}
                        <span className="ac-meter"><span className="ac-meter-track"><i style={{ width: `${[34, 22, 16][i]}%` }} /></span><Bar w={18} h={6} tone={2} /></span>
                        {!compact && <span><Bar w={[52, 44, 60][i]} h={6} tone={2} /></span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Window>

            <div className="ac ac-card sc-detail" data-show={s.detail || undefined} style={compact ? { left: 16, top: 186, width: 326 } : { left: 284, top: 146, width: 340 }}>
              <div className="ac-detail">
                <span className="ac-kicker">Alert</span>
                <div className="ac-detail-title">al_9f21c4</div>
                <div className="ac-detail-badges">
                  <span className="ac-badge" data-tone="critical">Critical</span>
                  <span className="ac-stage" data-stage={s.escalated ? 'escalated' : 'open'}>{s.escalated ? 'Escalated' : 'Open'}</span>
                </div>
                <div className="ac-gauge">
                  <div className="ac-gauge-top"><span>K7 score</span><strong>0.962</strong></div>
                  <div className="ac-gauge-track"><i className="sc-grow" style={{ width: '96%' }} /></div>
                </div>
                <div className="ac-why">
                  <div className="ac-why-title">Why it was flagged</div>
                  {WHY.map((r, i) => (
                    <div key={r.label} className="ac-why-row">
                      <span>{r.label}</span>
                      <span className="ac-why-bar"><i className="sc-grow" style={{ width: `${r.w * 100}%`, transitionDelay: `${220 + i * 90}ms` }} /></span>
                      <b>{r.value}</b>
                    </div>
                  ))}
                </div>
                <div className="ac-decisions">
                  <div className="ac-decision"><span className="ac-decision-icon"><Icon name="eye" size={14} /></span><strong>Reviewing</strong><small>Keep it open</small></div>
                  <div className="ac-decision" data-target="escalate" data-cursor="pointer" data-on={s.decision === 'escalate' || undefined}><span className="ac-decision-icon"><Icon name="cases" size={14} /></span><strong>Escalate</strong><small>Open a case</small></div>
                  <div className="ac-decision"><span className="ac-decision-icon"><Icon name="checkCircle" size={14} /></span><strong>Close</strong><small>Nothing found</small></div>
                </div>
                <div className="ac-save"><span className="ac-btn" data-target="save" data-cursor="pointer">{s.escalated ? <><Icon name="check" size={13} />Saved</> : 'Save decision'}</span></div>
              </div>
            </div>
            <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
          </>
        )
      }}
    </Stage>
  )
}
