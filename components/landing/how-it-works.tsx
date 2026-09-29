import { START_BRIEF_URL } from "@/lib/site";
import { ACCESS_FEE, INTERVIEW_CAP, INTERVIEW_CONFIRM_BUSINESS_DAYS, MAX_SHORTLIST, PLACEMENT_FEE, REPLACEMENT_DAYS, usd } from "@/lib/terms";
import { Arrow, Check } from "./brand-symbols";
import { LiveFrame } from "./live-frame";

// The journey the app actually runs, from the Brief mock: a four-step rail, then one row
// per step with an example window beside the copy. Every figure is a constant from
// lib/terms.ts, which mirrors the marketplace agreement.

const CHECK = (
  <svg className="i-check" aria-hidden="true">
    <use href="#ic-check" />
  </svg>
);
const PLUS = (
  <svg className="i-plus" aria-hidden="true">
    <use href="#i-plus" />
  </svg>
);
const Dots = () => (
  <span className="dots">
    <i />
    <i />
    <i />
  </span>
);

function Chip({ label, on = false, target = false }: { label: string; on?: boolean; target?: boolean }) {
  return (
    <span className={`chip${on ? " on" : ""}`} {...(target ? { "data-chip-target": "" } : {})}>
      {PLUS}
      {CHECK}
      {label}
    </span>
  );
}

const BENCH = [
  { av: "a", initials: "MS", name: "Maria S.", meta: "Executive tier · 7 yrs", cert: "Google Workspace", on: true },
  { av: "b", initials: "JR", name: "Joel R.", meta: "Standard tier · 5 yrs", cert: "Asana Pro" },
  { av: "c", initials: "AT", name: "Aileen T.", meta: "Executive tier · 9 yrs", cert: "MS Office Specialist", target: true },
  { av: "a", initials: "DP", name: "Dana P.", meta: "Standard tier · 6 yrs", cert: "HubSpot CRM" },
  { av: "b", initials: "KL", name: "Kris L.", meta: "Executive tier · 8 yrs", cert: "Google Workspace" },
];

export function HowItWorks() {
  const days = INTERVIEW_CONFIRM_BUSINESS_DAYS;
  return (
    <section className="hw-sec" aria-labelledby="how-title">
      <div className="wrap">
        <div className="hw" id="how">
          <div className="sec-head">
            <p className="eyebrow">How it works</p>
            <h2 className="h2" id="how-title">
              From a four-question brief to a signed hire.
            </h2>
            <p className="sub">
              You don&apos;t need to know what the job is called. Pick the tasks, and the app works out the role and shows you who&apos;s ready
              for it.
            </p>
          </div>
          <ol className="rail">
            <li>
              <a href="#step-brief">
                <span className="mono muted">Step 1</span>
                <b>Hiring brief</b>
                <span>Create an account and answer four questions. The role comes from the tasks you pick.</span>
              </a>
            </li>
            <li>
              <a href="#step-bench">
                <span className="mono muted">Step 2</span>
                <b>Open the bench</b>
                <span>
                  {usd(ACCESS_FEE)} per role opens every vetted profile, credited toward your placement fee.
                </span>
              </a>
            </li>
            <li>
              <a href="#step-shortlist">
                <span className="mono muted">Step 3</span>
                <b>Shortlist and interview</b>
                <span>
                  Up to {MAX_SHORTLIST} at a time. Each interview confirmed within {days} business days.
                </span>
              </a>
            </li>
            <li>
              <a href="#step-hire">
                <span className="mono muted">Step 4</span>
                <b>Hire</b>
                <span>Pay a one-time placement fee and sign the agreement online.</span>
              </a>
            </li>
          </ol>

          <div className="split" id="step-brief">
            <div className="split-copy">
              <p className="eyebrow">Step 1 · Hiring brief</p>
              <h3>Four questions. The app works out the role.</h3>
              <p>
                Tell us what keeps landing on your plate and how many hours a week it takes. You don&apos;t need a job title. The app matches the
                tasks you pick to a role and shows you the bench for it.
              </p>
              <ul className="ticks">
                <li>
                  <Check />
                  Create an account and answer four questions
                </li>
                <li>
                  <Check />
                  Pick tasks, not a job title
                </li>
                <li>
                  <Check />
                  See the suggested role before you open the bench
                </li>
              </ul>
              <a className="link-arrow" href={START_BRIEF_URL} target="_blank" rel="noopener">
                Start your hiring brief
                <Arrow />
              </a>
            </div>
            <LiveFrame kind="brief" note="Example brief · Updates as you pick tasks in the app">
              <div className="win" data-parallax="22" role="img" aria-label="Example hiring brief: two tasks picked, 20 hours a week, suggested role Executive Assistant.">
                <div className="win-bar">
                  <Dots />
                  <span className="grow mono">Hiring brief</span>
                  <span className="count mono">
                    Question <b>1</b>/4
                  </span>
                </div>
                <div className="bf">
                  <p className="bf-q">What keeps landing on your plate?</p>
                  <div className="chips">
                    <Chip label="Inbox and calendar" on />
                    <Chip label="Lead follow-up" on />
                    <Chip label="Social media" target />
                    <Chip label="Bookkeeping support" />
                    <Chip label="Customer support" />
                    <Chip label="Listing coordination" />
                  </div>
                  <div className="hours">
                    <span className="mono muted">Hours a week</span>
                    <span className="seg">
                      <span>10h</span>
                      <span className="on">20h</span>
                      <span>30h</span>
                      <span>40h</span>
                    </span>
                  </div>
                </div>
                <div className="bf-result">
                  <span className="mono muted">Suggested role</span>
                  <span className="bf-role">
                    <span>Executive Assistant</span>
                  </span>
                  <span className="bf-why">Worked out from 2 tasks, about 20 hours a week.</span>
                </div>
              </div>
            </LiveFrame>
          </div>

          <div className="split flip" id="step-bench">
            <div className="split-copy">
              <p className="eyebrow">Step 2 · Open the bench</p>
              <h3>Every vetted profile for your role, the same day</h3>
              <p>
                Opening the bench costs {usd(ACCESS_FEE)} per role. You see every vetted profile for that role, with years of experience and
                role-specific certifications. The {usd(ACCESS_FEE)} is credited toward your placement fee when you hire.
              </p>
              <ul className="ticks">
                <li>
                  <Check />
                  Browse the same day you sign up and open it
                </li>
                <li>
                  <Check />
                  Every VA is vetted before listing
                </li>
                <li>
                  <Check />
                  Credited toward the placement fee if you hire
                </li>
              </ul>
            </div>
            <LiveFrame kind="bench" note="Example profiles · Vetted before listing">
              <div className="win" data-parallax="22" role="img" aria-label="Example bench for an Executive Assistant role: five vetted profiles, each with a Shortlist button.">
                <div className="win-bar">
                  <Dots />
                  <span className="grow mono">Bench · Executive Assistant</span>
                  <span className="count mono">
                    Shortlist <b className="bench-count">1</b>/{MAX_SHORTLIST}
                  </span>
                </div>
                <div className="filters">
                  <span className="fchip">
                    {CHECK}
                    Executive Assistant
                  </span>
                  <span className="fchip">
                    {CHECK}
                    5+ years
                  </span>
                  <span className="fchip">
                    {CHECK}
                    Certified
                  </span>
                  <span className="fchip">All tiers</span>
                </div>
                <div className="rows">
                  {BENCH.map((p, i) => (
                    <div className="row" key={p.name} style={{ "--i": i } as React.CSSProperties}>
                      <span className={`av av-${p.av}`}>{p.initials}</span>
                      <span className="mmain">
                        <b>{p.name}</b>
                        <span>{p.meta}</span>
                      </span>
                      <span className="certs">
                        <span>{p.cert}</span>
                      </span>
                      <span className={`sl${p.on ? " on" : ""}`} {...(p.target ? { "data-sl-target": "" } : {})}>
                        {PLUS}
                        {CHECK}
                        <span>{p.on ? "Shortlisted" : "Shortlist"}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </LiveFrame>
          </div>

          <div className="split" id="step-shortlist">
            <div className="split-copy">
              <p className="eyebrow">Step 3 · Shortlist and interview</p>
              <h3>Shortlist three. Get each interview confirmed within {days} business days.</h3>
              <p>
                Add up to {MAX_SHORTLIST} VAs to your shortlist at a time and request interviews. The placements team confirms each request
                within {days} business days, and every role comes with up to {INTERVIEW_CAP} interview requests.
              </p>
              <ul className="ticks">
                <li>
                  <Check />
                  Up to {MAX_SHORTLIST} on your shortlist at a time
                </li>
                <li>
                  <Check />
                  Each request confirmed within {days} business days
                </li>
                <li>
                  <Check />
                  Up to {INTERVIEW_CAP} interview requests per role
                </li>
              </ul>
            </div>
            <LiveFrame kind="shortlist" note="Example shortlist">
              <div className="toast" aria-hidden="true">
                <i>
                  <svg>
                    <use href="#ic-check" />
                  </svg>
                </i>
                Interview confirmed · Maria S.
              </div>
              <div
                className="win"
                data-parallax="22"
                role="img"
                aria-label={`Example shortlist of three VAs with an interview request marked confirmed, and 3 of ${INTERVIEW_CAP} interview requests used.`}
              >
                <div className="win-bar">
                  <Dots />
                  <span className="grow mono">Your shortlist · Executive Assistant</span>
                  <span className="count mono">
                    <b>3</b>/{MAX_SHORTLIST}
                  </span>
                </div>
                <div className="sl-grid">
                  <div className="sl-card">
                    <span className="av av-a">MS</span>
                    <b>Maria S.</b>
                    <span>7 yrs · Executive</span>
                    <span className="tag tag-green mono">Confirmed</span>
                  </div>
                  <div className="sl-card">
                    <span className="av av-c">AT</span>
                    <b>Aileen T.</b>
                    <span>9 yrs · Executive</span>
                    <span className="tag tag-amber mono">Requested</span>
                  </div>
                  <div className="sl-card">
                    <span className="av av-b">JR</span>
                    <b>Joel R.</b>
                    <span>5 yrs · Standard</span>
                    <span className="tag mono">Shortlisted</span>
                  </div>
                </div>
                <div className="req" data-state="confirmed">
                  <div className="req-top">
                    <span className="mono muted">Interview request · Maria S.</span>
                    <span className="pill">
                      <svg aria-hidden="true">
                        <use href="#ic-check" />
                      </svg>
                      <span className="req-pill">Confirmed</span>
                    </span>
                  </div>
                  <div className="tl">
                    <span className="tl-dot" />
                    <span className="tl-bar">
                      <i />
                    </span>
                    <span className="tl-dot b" />
                  </div>
                  <div className="tl-labels">
                    <span>Requested</span>
                    <span>Confirmed within {days} business days</span>
                  </div>
                </div>
                <div className="quota">
                  <div className="quota-top">
                    <span className="mono muted">Interview requests for this role</span>
                    <b>3 of {INTERVIEW_CAP}</b>
                  </div>
                  <div className="cells" aria-hidden="true">
                    {Array.from({ length: INTERVIEW_CAP }, (_, i) => (
                      <i key={i} className={i < 3 ? "on" : undefined} style={i < 3 ? ({ "--i": i } as React.CSSProperties) : undefined} />
                    ))}
                  </div>
                </div>
              </div>
            </LiveFrame>
          </div>

          <div className="split flip" id="step-hire">
            <div className="split-copy">
              <p className="eyebrow">Step 4 · Hire</p>
              <h3>Pay one placement fee and sign online</h3>
              <p>
                When you&apos;ve found the right VA, pay a one-time placement fee and sign the placement agreement online. Your {usd(ACCESS_FEE)}{" "}
                access credit comes off at checkout, so a Standard hire is {usd(PLACEMENT_FEE.Standard - ACCESS_FEE)}.
              </p>
              <ul className="ticks">
                <li>
                  <Check />
                  Standard {usd(PLACEMENT_FEE.Standard)}, Executive {usd(PLACEMENT_FEE.Executive)}, Specialist {usd(PLACEMENT_FEE.Specialist)}
                </li>
                <li>
                  <Check />
                  The agreement is signed online
                </li>
                <li>
                  <Check />
                  Your VA&apos;s monthly pay goes to them directly, with no margin
                </li>
              </ul>
              <a className="link-arrow" href="#pricing">
                See what it costs
                <Arrow />
              </a>
            </div>
            <LiveFrame kind="sign" note="Example agreement">
              <div
                className="win doc"
                data-parallax="22"
                role="img"
                aria-label={`Example placement agreement for an Executive hire: ${usd(PLACEMENT_FEE.Executive)} placement fee, minus the ${usd(ACCESS_FEE)} access credit, ${usd(PLACEMENT_FEE.Executive - ACCESS_FEE)} due at checkout, signed online.`}
              >
                <div className="doc-head">
                  <svg viewBox="0 0 494 506" aria-hidden="true">
                    <use href="#svmark" />
                  </svg>
                  <div>
                    <b>Placement agreement</b>
                    <span className="mono muted">VA Marketplace · Scale Virtually</span>
                  </div>
                  <span className="pill signed">
                    <svg aria-hidden="true">
                      <use href="#ic-check" />
                    </svg>
                    Signed online
                  </span>
                </div>
                <dl className="doc-grid">
                  <div>
                    <dt className="mono">Role</dt>
                    <dd>Executive Assistant</dd>
                  </div>
                  <div>
                    <dt className="mono">VA</dt>
                    <dd>Maria S.</dd>
                  </div>
                  <div>
                    <dt className="mono">Tier</dt>
                    <dd>Executive</dd>
                  </div>
                  <div>
                    <dt className="mono">Guarantee</dt>
                    <dd>{REPLACEMENT_DAYS}-day replacement</dd>
                  </div>
                </dl>
                <div className="skel" aria-hidden="true">
                  <i style={{ width: "100%" }} />
                  <i style={{ width: "94%" }} />
                  <i style={{ width: "97%" }} />
                  <i style={{ width: "62%" }} />
                </div>
                <table className="fee">
                  <tbody>
                    <tr>
                      <td>Placement fee, Executive</td>
                      <td>{usd(PLACEMENT_FEE.Executive)}</td>
                    </tr>
                    <tr className="credit">
                      <td>Access credit applied</td>
                      <td>−{usd(ACCESS_FEE)}</td>
                    </tr>
                    <tr className="due">
                      <td>Due at checkout</td>
                      <td>{usd(PLACEMENT_FEE.Executive - ACCESS_FEE)}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="sig">
                  <div className="sig-box">
                    <svg viewBox="0 0 170 54" aria-hidden="true">
                      <path
                        className="sig-path"
                        d="M6 40c8-14 14-30 22-30 6 0-2 30 2 30 5 0 10-20 16-20 4 0 0 16 5 16 6 0 9-14 15-14 4 0 1 12 6 12 7 0 11-18 18-18 5 0 2 14 8 14 8 0 14-10 20-10M40 46c30-3 70-5 116-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="sig-line" />
                    <p className="mono">Client signature</p>
                  </div>
                </div>
              </div>
            </LiveFrame>
          </div>

          <div className="split" id="step-guarantee">
            <div className="split-copy">
              <p className="eyebrow">After you hire · {REPLACEMENT_DAYS}-day guarantee</p>
              <h3>If it isn&apos;t the right fit, we find a replacement</h3>
              <p>
                For {REPLACEMENT_DAYS} days from your VA&apos;s first working day, Scale Virtually finds a replacement at no extra placement fee if
                the VA isn&apos;t the right fit. The one exception is mistreatment. It&apos;s a guarantee, not a minimum term.
              </p>
              <ul className="ticks">
                <li>
                  <Check />
                  Starts on your VA&apos;s first working day
                </li>
                <li>
                  <Check />
                  Replacement at no extra placement fee
                </li>
                <li>
                  <Check />
                  No minimum term
                </li>
              </ul>
            </div>
            <LiveFrame kind="guarantee" note="Example timeline">
              <div
                className="win g"
                data-parallax="22"
                role="img"
                aria-label={`Example ${REPLACEMENT_DAYS}-day guarantee timeline from the first working day to day ${REPLACEMENT_DAYS}, with a replacement request partway through at no extra placement fee.`}
              >
                <div className="g-head">
                  <div>
                    <span className="mono muted">Your placement</span>
                    <b>{REPLACEMENT_DAYS}-day replacement guarantee</b>
                  </div>
                  <span className="g-num">
                    {REPLACEMENT_DAYS}
                    <small>days</small>
                  </span>
                </div>
                <div className="track" style={{ "--p": 0.38 } as React.CSSProperties}>
                  <div className="track-fill" />
                  <span className="marker">
                    <span>Replacement requested</span>
                  </span>
                </div>
                <div className="ticks-row mono">
                  <span>First working day</span>
                  <span>Day {REPLACEMENT_DAYS}</span>
                </div>
                <dl className="g-list">
                  <div>
                    <dt>Not the right fit</dt>
                    <dd>We find a replacement</dd>
                  </div>
                  <div>
                    <dt>Extra placement fee</dt>
                    <dd className="ok">None</dd>
                  </div>
                  <div>
                    <dt>The one exception</dt>
                    <dd>Mistreatment</dd>
                  </div>
                </dl>
              </div>
            </LiveFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
