import { dakar, ownerNotes, sources, specRows } from '../data/sheet'
import { allWork, lab } from '../data/lab'
import { referencePhotos } from '../data/strip'

export function SpecSheet() {
  return (
    <section className="block" aria-labelledby="sheet-title">
      <div className="sheet" data-pin>
        <span className="tape tape-left" aria-hidden="true" />
        <span className="tape tape-right" aria-hidden="true" />
        <header className="sheet-head">
          <h2 id="sheet-title" className="stencil-heading">
            Spec sheet
          </h2>
          <p className="sheet-sub">XRV750 Africa Twin, RD07 · 1993–2003. Where Japanese and European figures differ, the note says which is which.</p>
        </header>
        <dl className="spec-table">
          {specRows.map((r) => (
            <div key={r.label} className="spec-row">
              <dt>{r.label}</dt>
              <dd>
                <span className="spec-value">{r.value}</span>
                {r.note && <span className="spec-note">{r.note}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function Rally() {
  return (
    <section className="block rally" aria-labelledby="rally-title">
      <div className="rally-copy">
        <h2 id="rally-title" className="stencil-heading">
          Born on the Dakar
        </h2>
        <p>
          In 1984 Honda asked its racing arm, HRC, to build a Paris–Dakar winner. The NXR750 twin won four years running. The road bike borrowed its look:
          the twin headlights in a big fairing, the large tank, the aluminium bash plate and HRC’s white, red and blue.
        </p>
        <p>
          The engine is not the rally one. The XRV750’s twin grew out of the Transalp’s, which is part of why it is so easy to live with.
        </p>
      </div>
      <div className="dakar" data-pin>
        <ol className="dakar-strip" aria-label="Paris–Dakar wins for the NXR750">
          {dakar.map((d) => (
            <li key={d.year} className="dakar-cell">
              <span className="dakar-year">{d.year}</span>
              <span className="dakar-rider">{d.rider}</span>
              {d.note && <span className="dakar-note">{d.note}</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Owners() {
  return (
    <section className="block owners" aria-labelledby="owners-title">
      <h2 id="owners-title" className="stencil-heading">
        What owners check
      </h2>
      <p className="owners-lead">Built through the 1990s, and plenty are still ridden. The things owners and buyer’s guides mention most:</p>
      <ul className="tags">
        {ownerNotes.map((n) => (
          <li key={n.title} className="tag" data-pin style={{ "--pin-delay": `${ownerNotes.indexOf(n) * 70}ms` } as React.CSSProperties}>
            <span className="tag-hole" aria-hidden="true" />
            <h3>{n.title}</h3>
            <p>{n.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="footer-title">XRV750 Africa Twin: take it apart</p>
          <p>
            An unofficial showcase by{' '}
            <a href="https://mihaelturkalj.com" className="ink-link">
              Mihael Turkalj
            </a>
            . Not affiliated with or endorsed by Honda. Honda and Africa Twin are trademarks of Honda Motor Co., Ltd., used here only to name the motorcycle.
          </p>
          <p>
            The paper model and every strip-down image are AI-generated (Nano Banana Pro via kie.ai), using the photographs below as reference. Mechanical
            details in the pictures are approximate; the text is checked against the sources.
          </p>
        </div>
        <div>
          <h2 className="footer-label">Reference photographs</h2>
          <ul className="footer-list">
            {referencePhotos.map((p) => (
              <li key={p.source}>
                <a href={p.source} target="_blank" rel="noopener noreferrer" className="ink-link">
                  {p.file}
                </a>{' '}
                by {p.author},{' '}
                <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer" className="ink-link">
                  {p.license}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-label">Sources</h2>
          <ul className="footer-list">
            {sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="ink-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* the rest of the lab, so one visit leads to the next */}
      <nav className="footer-lab" aria-labelledby="lab-title">
        <h2 id="lab-title" className="footer-label">
          More from the lab
        </h2>
        <ul className="footer-lab-list">
          {lab
            .filter((l) => l.id !== 'africa-twin')
            .map((l) => (
              <li key={l.id}>
                <a href={l.href} className="ink-link">
                  {l.title}
                </a>
                <span>{l.what}</span>
              </li>
            ))}
        </ul>
        <a href={allWork} className="ink-link footer-lab-all">
          All work by Mihael Turkalj →
        </a>
      </nav>
    </footer>
  )
}
