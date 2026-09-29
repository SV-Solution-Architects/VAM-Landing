import { START_BRIEF_URL, TERMS_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="foot-grid">
        <div className="foot-brand">
          <svg viewBox="0 0 2106 504" role="img" aria-label="Scale Virtually">
            <use href="#svlogo" />
          </svg>
          <p>
            VA Marketplace is a Scale Virtually product. Profiles shown are examples. Client stories feature Scale Virtually clients, filmed before
            VA Marketplace launched.
          </p>
        </div>
        <nav className="foot-nav" aria-label="Footer">
          <a href="#how">How it works</a>
          <a href="#stories">Client stories</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href={START_BRIEF_URL} target="_blank" rel="noopener">
            Start your hiring brief
          </a>
          <a href={TERMS_URL} target="_blank" rel="noopener">
            Marketplace terms
          </a>
        </nav>
      </div>
      <div className="foot-base">
        <span>© {new Date().getFullYear()} Scale Virtually</span>
        <a href="https://scalevirtually.com" target="_blank" rel="noopener">
          scalevirtually.com
        </a>
      </div>
    </footer>
  );
}
