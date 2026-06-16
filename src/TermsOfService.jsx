import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Landing.css';
import './Legal.css';
import Footer from './Footer';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || '1508180727953359008';
const makeInviteUrl = (id) =>
  `https://discord.com/oauth2/authorize?client_id=${id}&permissions=5085252284837110&integration_type=0&scope=bot+applications.commands`;

const TOC = [
  { id: 'agreement',    label: 'Agreement' },
  { id: 'eligibility',  label: 'Eligibility' },
  { id: 'bot-use',      label: 'Use of the Bot' },
  { id: 'prohibited',   label: 'Prohibited Use' },
  { id: 'dashboard',    label: 'Dashboard Access' },
  { id: 'economy',      label: 'Virtual Economy' },
  { id: 'ai',           label: 'AI Features' },
  { id: 'termination',  label: 'Termination' },
  { id: 'disclaimers',  label: 'Disclaimers' },
  { id: 'liability',    label: 'Liability' },
  { id: 'changes',      label: 'Changes' },
  { id: 'contact',      label: 'Contact' },
];

export default function TermsOfService() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const inviteUrl = makeInviteUrl(CLIENT_ID);

  useEffect(() => {
    document.title = 'Terms of Service — Friday Bot';
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="lp-root">

      {/* ── NAV ── */}
      <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <RouterLink to="/" className="lp-nav-brand" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="Friday" className="lp-nav-logo" />
            <span className="lp-nav-name">FRIDAY</span>
          </RouterLink>

          <nav className="lp-nav-links">
            <RouterLink to="/#features">Features</RouterLink>
            <RouterLink to="/#ai">AI</RouterLink>
            <RouterLink to="/#how">How it works</RouterLink>
            <RouterLink to="/commands">Commands</RouterLink>
            <RouterLink to="/updates">Updates</RouterLink>
          </nav>

          <div className="lp-nav-ctas">
            <a href={inviteUrl} target="_blank" rel="noreferrer" className="lp-btn lp-btn-outline">
              Invite Bot
            </a>
            <RouterLink to="/dashboard" className="lp-btn lp-btn-primary">
              Dashboard
            </RouterLink>
          </div>

          <button
            className="lp-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lp-mobile-menu">
            <RouterLink to="/#features" onClick={() => setMobileMenuOpen(false)}>Features</RouterLink>
            <RouterLink to="/#ai" onClick={() => setMobileMenuOpen(false)}>AI</RouterLink>
            <RouterLink to="/#how" onClick={() => setMobileMenuOpen(false)}>How it works</RouterLink>
            <RouterLink to="/commands" onClick={() => setMobileMenuOpen(false)}>Commands</RouterLink>
            <RouterLink to="/updates" onClick={() => setMobileMenuOpen(false)}>Updates</RouterLink>
            <a href={inviteUrl} target="_blank" rel="noreferrer" className="lp-btn lp-btn-outline" style={{ textAlign: 'center' }} onClick={() => setMobileMenuOpen(false)}>
              Invite Bot
            </a>
            <RouterLink to="/dashboard" className="lp-btn lp-btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </RouterLink>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="legal-hero">
        <div className="lp-container legal-hero-inner">
          <div className="legal-eyebrow">
            <span className="legal-eyebrow-line" />
            <span className="legal-eyebrow-label">Legal</span>
          </div>
          <h1 className="legal-hero-title">
            Terms of <span>Service</span>
          </h1>
          <div className="legal-hero-meta">
            <span className="legal-hero-meta-item">Friday Bot</span>
            <span className="legal-hero-meta-dot" />
            <span className="legal-hero-meta-item">Effective: May 26, 2026</span>
            <span className="legal-hero-meta-dot" />
            <span className="legal-hero-meta-item">Last updated: May 26, 2026</span>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="lp-container">
        <div className="legal-body">

          {/* Sidebar TOC */}
          <aside className="legal-toc">
            <p className="legal-toc-label">Contents</p>
            <ul className="legal-toc-list">
              {TOC.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main content */}
          <main className="legal-content">

            <div className="legal-section" id="agreement">
              <p className="legal-section-num">01</p>
              <h2 className="legal-section-title">Agreement to Terms</h2>
              <div className="legal-section-body">
                <p>
                  These Terms of Service ("Terms") govern your access to and use of Friday Bot ("Friday", "the Bot", "we", "us") — including the Discord bot, the web dashboard, and any associated services. By adding Friday to a Discord server, using any of its commands, or accessing the dashboard, you agree to be bound by these Terms.
                </p>
                <p>
                  If you are adding Friday on behalf of a Discord server, you represent that you have the authority to bind that server and its administrators to these Terms.
                </p>
                <div className="legal-highlight">
                  <p>
                    <strong>Short version:</strong> Use Friday in good faith, don't abuse it or other users, and respect Discord's own rules. We reserve the right to remove access for misuse.
                  </p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="eligibility">
              <p className="legal-section-num">02</p>
              <h2 className="legal-section-title">Eligibility</h2>
              <div className="legal-section-body">
                <p>To use Friday, you must:</p>
                <ul className="legal-ul">
                  <li>Meet Discord's minimum age requirement (13 years old, or higher in your jurisdiction).</li>
                  <li>Comply with Discord's <a href="https://discord.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> and <a href="https://discord.com/guidelines" target="_blank" rel="noreferrer">Community Guidelines</a>.</li>
                  <li>Have administrator permissions in a Discord server to add Friday or configure it via the dashboard.</li>
                </ul>
                <p>
                  Access may be suspended or terminated for users or servers that violate these requirements.
                </p>
              </div>
            </div>

            <div className="legal-section" id="bot-use">
              <p className="legal-section-num">03</p>
              <h2 className="legal-section-title">Use of the Bot</h2>
              <div className="legal-section-body">
                <p>
                  Friday is provided as-is as a community management tool for Discord servers. You are permitted to:
                </p>
                <ul className="legal-ul">
                  <li>Add Friday to Discord servers where you have administrator permissions.</li>
                  <li>Configure Friday's features through the web dashboard.</li>
                  <li>Use all commands and features as described in the documentation.</li>
                  <li>Adjust economy balances, XP, and moderation records for your own server members.</li>
                </ul>
                <p>
                  Friday is provided free of charge. We reserve the right to introduce premium features, usage limits, or paid tiers in the future, with reasonable notice to existing users.
                </p>
              </div>
            </div>

            <div className="legal-section" id="prohibited">
              <p className="legal-section-num">04</p>
              <h2 className="legal-section-title">Prohibited Use</h2>
              <div className="legal-section-body">
                <p>You agree not to use Friday to:</p>
                <ol className="legal-ol">
                  <li>Harass, target, or harm specific individuals — including through misuse of moderation commands (banning/kicking/timing out users without valid reason).</li>
                  <li>Violate Discord's Terms of Service or Community Guidelines.</li>
                  <li>Attempt to exploit bugs or vulnerabilities in Friday to gain unauthorized access, manipulate economy data, or affect other servers.</li>
                  <li>Use Friday's AI features to generate harmful, illegal, or offensive content.</li>
                  <li>Automate interactions with Friday in ways that circumvent rate limits or generate abnormal load.</li>
                  <li>Reverse engineer, copy, or attempt to replicate Friday's codebase, infrastructure, or intellectual property without written permission.</li>
                  <li>Use Friday in servers that promote illegal activity, hate speech, or content that violates Discord's policies.</li>
                </ol>
                <div className="legal-warning">
                  <p>
                    Violations may result in immediate and permanent removal of Friday from your server, with no obligation to provide advance notice or a refund for any paid services.
                  </p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="dashboard">
              <p className="legal-section-num">05</p>
              <h2 className="legal-section-title">Dashboard Access</h2>
              <div className="legal-section-body">
                <p>
                  The Friday web dashboard allows server administrators to configure features, manage members, and view analytics. Dashboard access is authenticated via Discord OAuth2.
                </p>
                <ul className="legal-ul">
                  <li>You are responsible for maintaining the confidentiality of your Discord account credentials.</li>
                  <li>Dashboard sessions are tied to your Discord account. Do not share session tokens with others.</li>
                  <li>Actions taken through the dashboard (bans, economy adjustments, config changes) are logged and associated with your account.</li>
                  <li>We reserve the right to revoke dashboard access for any account engaging in abuse or policy violations.</li>
                </ul>
              </div>
            </div>

            <div className="legal-section" id="economy">
              <p className="legal-section-num">06</p>
              <h2 className="legal-section-title">Virtual Economy</h2>
              <div className="legal-section-body">
                <p>
                  Friday operates a virtual economy system within Discord servers. All virtual currency ("coins"), items, XP, and other economy assets are:
                </p>
                <ul className="legal-ul">
                  <li><strong>Entirely virtual</strong> — they have no real-world monetary value and cannot be exchanged for real money.</li>
                  <li><strong>Server-scoped</strong> — economy data is separate per server and not transferable between servers.</li>
                  <li><strong>Non-refundable</strong> — we do not provide compensation for lost virtual items resulting from bugs, exploits, or service interruptions.</li>
                </ul>
                <p>
                  Server administrators can modify economy data for their members at any time via the dashboard. By using Friday's economy features, all participants acknowledge these limitations.
                </p>
              </div>
            </div>

            <div className="legal-section" id="ai">
              <p className="legal-section-num">07</p>
              <h2 className="legal-section-title">AI Features</h2>
              <div className="legal-section-body">
                <p>
                  Friday includes AI-powered commands backed by Google Gemini. By using these features:
                </p>
                <ul className="legal-ul">
                  <li>You acknowledge that AI-generated content may be inaccurate, incomplete, or inappropriate.</li>
                  <li>You must not use AI features to generate illegal content, content that harasses specific individuals, or content that violates Discord's guidelines.</li>
                  <li>Message content passed to <code style={{ background: 'rgba(59,157,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: 'var(--lp-primary)' }}>/friday summarize</code> is subject to Google's own usage policies.</li>
                  <li>AI image generation costs virtual coins and is subject to rate limits.</li>
                </ul>
                <p>
                  Friday is not responsible for actions taken based on AI-generated responses. These features are provided as-is with no guarantees of accuracy.
                </p>
              </div>
            </div>

            <div className="legal-section" id="termination">
              <p className="legal-section-num">08</p>
              <h2 className="legal-section-title">Termination</h2>
              <div className="legal-section-body">
                <p>
                  Either party may terminate the relationship at any time:
                </p>
                <ul className="legal-ul">
                  <li><strong>You</strong> can remove Friday from your server at any time via Discord's server settings. Your data will be retained for 90 days per our Privacy Policy, then permanently deleted.</li>
                  <li><strong>We</strong> may remove Friday from a server, suspend dashboard access, or shut down the service entirely, with or without prior notice, for reasons including but not limited to: ToS violations, abuse, legal requirements, or discontinuation of the service.</li>
                </ul>
                <p>
                  Upon termination, your license to use Friday ends immediately. These Terms survive termination where their nature requires it (Disclaimers, Liability, etc.).
                </p>
              </div>
            </div>

            <div className="legal-section" id="disclaimers">
              <p className="legal-section-num">09</p>
              <h2 className="legal-section-title">Disclaimers</h2>
              <div className="legal-section-body">
                <p>
                  Friday is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind, either express or implied. We specifically disclaim:
                </p>
                <ul className="legal-ul">
                  <li>Any warranty of merchantability, fitness for a particular purpose, or non-infringement.</li>
                  <li>Guarantees of uptime, availability, or uninterrupted service. Discord API outages, server maintenance, or unforeseen issues may cause downtime.</li>
                  <li>Accuracy or reliability of AI-generated content.</li>
                  <li>Responsibility for actions taken by server administrators using Friday's moderation features.</li>
                </ul>
                <p>
                  Friday is not affiliated with, endorsed by, or in any way officially connected with Discord Inc.
                </p>
              </div>
            </div>

            <div className="legal-section" id="liability">
              <p className="legal-section-num">10</p>
              <h2 className="legal-section-title">Limitation of Liability</h2>
              <div className="legal-section-body">
                <p>
                  To the maximum extent permitted by applicable law, Friday and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to:
                </p>
                <ul className="legal-ul">
                  <li>Loss of data, virtual currency, or progress in Friday's economy or leveling systems.</li>
                  <li>Harm resulting from moderation actions (bans, kicks, timeouts) carried out by server administrators via Friday.</li>
                  <li>Disruptions caused by Discord API changes, outages, or policy changes by Discord Inc.</li>
                  <li>Consequences of acting on AI-generated output from Friday's AI commands.</li>
                </ul>
                <p>
                  Our total liability for any claim arising from your use of Friday shall not exceed the amount you have paid us in the past 12 months (which, for free users, is zero).
                </p>
              </div>
            </div>

            <div className="legal-section" id="changes">
              <p className="legal-section-num">11</p>
              <h2 className="legal-section-title">Changes to Terms</h2>
              <div className="legal-section-body">
                <p>
                  We reserve the right to modify these Terms at any time. When we make significant changes, we will:
                </p>
                <ul className="legal-ul">
                  <li>Update the "Last updated" date at the top of this page.</li>
                  <li>Announce major changes through the Friday support server or website.</li>
                </ul>
                <p>
                  Continued use of Friday after changes are posted constitutes acceptance of the updated Terms. If you do not agree to the revised Terms, you should remove Friday from your server.
                </p>
              </div>
            </div>

            <div className="legal-section" id="contact">
              <p className="legal-section-num">12</p>
              <h2 className="legal-section-title">Contact</h2>
              <div className="legal-section-body">
                <p>
                  Questions about these Terms, requests for clarification, or reports of ToS violations can be directed to:
                </p>
                <div className="legal-contact-box">
                  <div className="legal-contact-info">
                    <strong>Friday Bot Support</strong>
                    For ToS questions, abuse reports, or legal inquiries.
                  </div>
                  <a
                    href="mailto:ashutoshswamy397@gmail.com"
                    className="lp-btn lp-btn-outline"
                    style={{ flexShrink: 0 }}
                  >
                    Contact Us
                  </a>
                </div>
                <p style={{ marginTop: '16px' }}>
                  These Terms are governed by applicable law. Any disputes shall be resolved through good-faith negotiation before any formal legal proceedings.
                </p>
              </div>
            </div>

          </main>
        </div>
      </div>

      <Footer />

    </div>
  );
}
