import { Bar, Count, Stage, Window, type Act } from '../kit'
import { Icon } from './Icon'
import { BrandMark } from './BrandMark'
import './scenes.css'

// Platform, dataset analysis: a bank file with its own column names arrives in the upload panel, Acurion
// matches the columns and asks about the one it is unsure of, the uploader answers, the core model scans it.

type Step = 'columns' | 'scan' | 'results'
type S = { step: Step; rows: number; order: '' | 'day'; alerts: number; networks: number }
const initial: S = { step: 'columns', rows: 0, order: '', alerts: 0, networks: 0 }
const POSTER: S = { step: 'results', rows: 5, order: 'day', alerts: 99, networks: 15 }
const REST = { wide: { x: 520, y: 300 }, compact: { x: 320, y: 300 } }

async function script(a: Act<S>) {
  await a.wait(500)
  await a.stagger([1, 2, 3, 4, 5], (n) => a.set({ rows: n }), 160)
  await a.wait(1100)
  await a.move('day-first')
  await a.wait(220)
  await a.click()
  await a.set({ order: 'day' })
  await a.wait(700)
  await a.move('scan')
  await a.wait(220)
  await a.click()
  await a.set({ step: 'scan' })
  a.move('rest')
  await a.wait(2300)
  await a.set({ step: 'results' })
  await a.wait(300)
  await a.set({ alerts: 99, networks: 15 })
  await a.wait(2000)
}

const MAPS = [
  { field: 'Sender', hint: 'The account the money leaves', column: 'Acct Holder', sample: 'ACC-10293, ACC-55812' },
  { field: 'Receiver', hint: 'The account the money reaches', column: 'Counterparty Acct', sample: 'ACC-90001, ACC-10293' },
  { field: 'Amount', hint: 'The amount sent', column: 'Amt GBP', sample: '1250.00, 80.50' },
]

export function UploadScene() {
  return (
    <Stage width={600} height={520} compact={{ below: 540, width: 358, height: 540 }} initial={initial} poster={POSTER} script={script} play="once" cursor={{ at: REST }} greys="cool" className="sc-upload">
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        const stepIndex = { columns: 1, scan: 2, results: 3 }[s.step]
        const state = (i: number) => (i < stepIndex ? 'done' : i === stepIndex ? 'current' : undefined)
        return (
          <>
            <Window url="acurion.vercel.app/transactions" urlShape="pill" className="sc-window" receded style={compact ? { left: 16, top: 16, width: 420, height: 560 } : { left: 28, top: 28, width: 640, height: 560 }}>
              <div className="ac ac-app">
                <div className="ac-top"><BrandMark size={20} /><span className="ac-crumb"><b>Transactions</b></span></div>
                <div className="sc-page">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="sc-upload-row"><Bar w={[110, 86, 120, 94, 102, 80][i]} h={6} tone={3} /><Bar w={70} h={6} tone={2} /><Bar w={48} h={6} tone={2} /></div>
                  ))}
                </div>
              </div>
            </Window>
            <div className="sc-scrim" />
            <div className="ac ac-navy sc-up" style={compact ? { left: 16, top: 34, width: 326 } : { left: 110, top: 40, width: 380 }}>
              <div className="ac-up">
                <span className="ac-up-kicker">bank_export.csv</span>
                <div className="ac-up-title">{s.step === 'columns' ? 'Check the columns' : s.step === 'scan' ? 'Scanning for patterns' : 'Scan complete'}</div>
                <div className="ac-steps">
                  <span className="ac-step" data-state="done"><b><Icon name="check" size={10} /></b>{!compact && 'File'}</span>
                  <span className="ac-step" data-state={state(1)}><b>{stepIndex > 1 ? <Icon name="check" size={10} /> : 2}</b>Columns</span>
                  <span className="ac-step" data-state={state(2)}><b>{stepIndex > 2 ? <Icon name="check" size={10} /> : 3}</b>Scan</span>
                  <span className="ac-step" data-state={state(3)}><b>4</b>Results</span>
                </div>
                <div className="sc-up-body">
                  <div className="sc-up-view" data-show={s.step === 'columns' || undefined}>
                    <div className="ac-maps">
                      {MAPS.map((m, i) => (
                        <div key={m.field} className="ac-map sc-map" data-in={s.rows > i || undefined}>
                          <div className="ac-map-field"><strong>{m.field}</strong><small>{m.hint}</small></div>
                          <div className="ac-map-pick"><span><strong>{m.column}</strong><small>{m.sample}</small></span><span className="ac-map-status"><Icon name="check" size={11} /></span></div>
                        </div>
                      ))}
                      <div className="ac-map sc-map" data-in={s.rows > 3 || undefined} data-tone={s.order ? undefined : 'check'}>
                        <div className="ac-map-field"><strong>Date and time</strong><small>When the payment happened</small></div>
                        <div className="ac-map-pick"><span><strong>Booked</strong><small>03/09/2026 10:15</small></span><span className="ac-map-status" data-tone={s.order ? undefined : 'check'}>{s.order ? <Icon name="check" size={11} /> : '?'}</span></div>
                      </div>
                      <div className="ac-order sc-map" data-in={s.rows > 4 || undefined}>
                        <span>Dates like <b>03/09</b> mean</span>
                        <span className="ac-seg"><span data-target="day-first" data-cursor="pointer" data-on={s.order === 'day' || undefined}>3 September</span><span>9 March</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="sc-up-view sc-up-center" data-show={s.step === 'scan' || undefined}>
                    <div className="sc-scan" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ animationDelay: `${i * 120}ms` }} />)}</div>
                    <strong>Scoring every payment</strong>
                    <p>The core model scores each payment, flags high-risk accounts and groups linked transfers into networks.</p>
                  </div>
                  <div className="sc-up-view" data-show={s.step === 'results' || undefined}>
                    <div className="ac-result-hero"><strong><Count value={s.alerts} duration={900} /></strong><span>new alerts in the queue</span></div>
                    <div className="ac-result-tiles">
                      <div><small>Networks</small><b><Count value={s.networks} /></b></div>
                      <div><small>Scored by</small><b className="sc-small-b">Core model</b></div>
                      <div><small>Shared with</small><b className="sc-small-b">Your team</b></div>
                    </div>
                    <div className="ac-patterns"><span>Pass-through</span><span>Fan-in</span><span>Fan-out</span><span>Round trip</span></div>
                    <div className="sc-up-top">
                      <span className="ac-up-kicker">Highest risk in this file</span>
                      <div className="k7-alert-row"><div><b className="ac-mono">UP-a7c2-014</b><small>ACC-10293 · part of a pass-through network</small></div><span className="ac-mono">0.874</span></div>
                      <div className="k7-alert-row"><div><b className="ac-mono">UP-a7c2-031</b><small>ACC-55812 · fan-in from four accounts</small></div><span className="ac-mono">0.851</span></div>
                    </div>
                  </div>
                </div>
                <div className="ac-up-foot">
                  {s.step === 'results'
                    ? <><span className="ac-up-btn"><Icon name="graph" size={13} />Networks</span><span className="ac-up-btn is-primary"><Icon name="alerts" size={13} />See the alerts</span></>
                    : <><span className="ac-up-btn">Cancel upload</span><span className="ac-up-btn is-primary" data-target="scan" data-cursor="pointer">Looks right, scan it</span></>}
                </div>
              </div>
            </div>
            <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
          </>
        )
      }}
    </Stage>
  )
}
