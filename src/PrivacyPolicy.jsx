import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Landing.css';
import './Legal.css';
import Footer from './Footer';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || '1508180727953359008';
const makeInviteUrl = (id) =>
  `https://discord.com/oauth2/authorize?client_id=${id}&permissions=8&scope=bot%20applications.commands`;

const TOC = [
  { id: 'overview',     label: 'Overview' },
  { id: 'data',         label: 'Data We Collect' },
  { id: 'how-we-use',  label: 'How We Use Data' },
  { id: 'retention',   label: 'Data Retention' },
  { id: 'sharing',     label: 'Data Sharing' },
  { id: 'security',    label: 'Security' },
  { id: 'rights',      label: 'Your Rights' },
  { id: 'children',    label: 'Children' },
  { id: 'changes',     label: 'Policy Changes' },
  { id: 'contact',     label: 'Contact' },
];

export default function PrivacyPolicy() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const inviteUrl = makeInviteUrl(CLIENT_ID);

  useEffect(() => {
    document.title = 'Privacy Policy — Friday Bot';
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
            Privacy <span>Policy</span>
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

            <div className="legal-section" id="overview">
              <p className="legal-section-num">01</p>
              <h2 className="legal-section-title">Overview</h2>
              <div className="legal-section-body">
                <p>
                  Friday Bot ("Friday", "we", "us", or "our") is a Discord bot that provides moderation, leveling, economy, and community management services to Discord servers. This Privacy Policy explains what information we collect when you use Friday, how we use it, and your choices regarding that information.
                </p>
                <p>
                  By adding Friday to your Discord server or using our web dashboard, you agree to the collection and use of information as described in this policy.
                </p>
                <div className="legal-highlight">
                  <p>
                    <strong>Short version:</strong> We collect only what's necessary to run the bot's features — Discord IDs, server configuration, and activity data for leveling and economy. We don't sell your data, and we don't collect message content unless you explicitly use a feature that requires it (like AI summarization).
                  </p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="data">
              <p className="legal-section-num">02</p>
              <h2 className="legal-section-title">Data We Collect</h2>
              <div className="legal-section-body">
                <p>We collect the minimum data required to operate Friday's features. This includes:</p>

                <div className="legal-data-grid">
                  {[
                    { label: 'Discord User IDs', desc: 'Numeric identifiers for users who interact with Friday' },
                    { label: 'Guild (Server) IDs', desc: 'Identifier of the Discord server Friday is operating in' },
                    { label: 'Channel IDs', desc: 'Used for feature configuration like welcome channels and alert destinations' },
                    { label: 'Role IDs', desc: 'Used for auto-role, level rewards, and reaction role features' },
                    { label: 'XP & Level Data', desc: 'Message and voice activity counts used to calculate leveling progression' },
                    { label: 'Economy Balances', desc: 'Virtual coin balances, inventory items, and transaction history' },
                    { label: 'Moderation Records', desc: 'Warn counts, timeout history, kicks and bans with reasons' },
                    { label: 'Server Configuration', desc: 'AutoMod rules, blocked word patterns, and dashboard settings you configure' },
                  ].map(({ label, desc }) => (
                    <div key={label} className="legal-data-card">
                      <span className="legal-data-dot" />
                      <div>
                        <p className="legal-data-label">{label}</p>
                        <p className="legal-data-desc">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p style={{ marginTop: '24px' }}>
                  <strong>Dashboard authentication:</strong> When you log in to the Friday dashboard via Discord OAuth2, we receive your Discord username, avatar, and the list of servers where you have administrator permissions. We store a signed JWT to maintain your session — no passwords are stored.
                </p>
                <p>
                  <strong>AI features:</strong> If you use <code style={{ background: 'rgba(59,157,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: 'var(--lp-primary)' }}>/friday summarize</code>, the last 50 messages in the channel are sent to Google Gemini for processing. These messages are not stored by Friday after the response is generated.
                </p>
              </div>
            </div>

            <div className="legal-section" id="how-we-use">
              <p className="legal-section-num">03</p>
              <h2 className="legal-section-title">How We Use Data</h2>
              <div className="legal-section-body">
                <p>All data collected is used solely to provide Friday's functionality. Specifically:</p>
                <ul className="legal-ul">
                  <li>XP and economy data is used to calculate leaderboards, level-up events, and shop transactions within your server.</li>
                  <li>Moderation records are used to enforce escalation rules you configure (e.g., auto-timeout at 3 warnings).</li>
                  <li>Server configuration data is used to apply AutoMod filters, welcome messages, and role automations.</li>
                  <li>Dashboard OAuth data is used to authenticate you and display only the servers you administrate.</li>
                  <li>Alert configurations (YouTube channels, Twitch usernames) are used to poll for new content and post notifications.</li>
                </ul>
                <p>
                  We do not use your data for advertising, profiling, or any purpose beyond operating the features you've configured.
                </p>
              </div>
            </div>

            <div className="legal-section" id="retention">
              <p className="legal-section-num">04</p>
              <h2 className="legal-section-title">Data Retention</h2>
              <div className="legal-section-body">
                <p>
                  Data is retained for as long as Friday is active in your server and for a reasonable period after removal to allow for re-addition without data loss.
                </p>
                <ul className="legal-ul">
                  <li><strong>Active servers:</strong> All configuration, leveling, economy, and moderation data is kept for as long as the bot remains in the server.</li>
                  <li><strong>After removal:</strong> Server data is retained for up to 90 days after Friday is removed, in case you re-add the bot. After 90 days, data is permanently deleted.</li>
                  <li><strong>Dashboard sessions:</strong> JWT tokens expire after 7 days and are not persisted on our servers.</li>
                  <li><strong>AI requests:</strong> Message content passed to AI features is not stored by Friday — only the response is returned to Discord.</li>
                </ul>
                <p>
                  Server administrators can request immediate deletion of all server data by contacting us (see Contact section below).
                </p>
              </div>
            </div>

            <div className="legal-section" id="sharing">
              <p className="legal-section-num">05</p>
              <h2 className="legal-section-title">Data Sharing</h2>
              <div className="legal-section-body">
                <p><strong>We do not sell, rent, or trade your data.</strong> The only circumstances under which data is shared with third parties are:</p>
                <ul className="legal-ul">
                  <li><strong>Google Gemini API:</strong> Message content is sent to Google Gemini when you use AI features. Google's privacy policy governs that data.</li>
                  <li><strong>Discord API:</strong> All bot interactions go through Discord's infrastructure. Discord's Terms of Service and Privacy Policy apply.</li>
                  <li><strong>Legal requirements:</strong> We may disclose data if required by law or to protect the rights, property, or safety of users.</li>
                </ul>
                <div className="legal-highlight">
                  <p>No analytics companies, ad networks, or data brokers receive any information from Friday.</p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="security">
              <p className="legal-section-num">06</p>
              <h2 className="legal-section-title">Security</h2>
              <div className="legal-section-body">
                <p>
                  We take reasonable precautions to protect data stored by Friday. This includes:
                </p>
                <ul className="legal-ul">
                  <li>All API communication is encrypted over HTTPS/TLS.</li>
                  <li>Dashboard authentication uses signed JWTs — your Discord password is never seen by Friday.</li>
                  <li>Database access is restricted to application-level credentials with least-privilege access.</li>
                </ul>
                <p>
                  No system is perfectly secure. If you discover a security vulnerability, please report it to us immediately rather than disclosing it publicly.
                </p>
              </div>
            </div>

            <div className="legal-section" id="rights">
              <p className="legal-section-num">07</p>
              <h2 className="legal-section-title">Your Rights</h2>
              <div className="legal-section-body">
                <p>You have the following rights regarding your data:</p>
                <ol className="legal-ol">
                  <li><strong>Access:</strong> You can request a summary of data Friday has stored about your Discord account or server.</li>
                  <li><strong>Deletion:</strong> You can request deletion of all data associated with your Discord account or your server.</li>
                  <li><strong>Correction:</strong> Server administrators can modify or reset economy balances, XP, and moderation records directly from the dashboard.</li>
                  <li><strong>Portability:</strong> Upon request, we can provide your server's data in a machine-readable format.</li>
                </ol>
                <p>
                  To exercise any of these rights, contact us using the information in the Contact section. We will respond within 30 days.
                </p>
              </div>
            </div>

            <div className="legal-section" id="children">
              <p className="legal-section-num">08</p>
              <h2 className="legal-section-title">Children's Privacy</h2>
              <div className="legal-section-body">
                <p>
                  Friday is not directed at children under the age of 13, consistent with Discord's own minimum age requirement. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently received data from a user under 13, we will delete that information promptly.
                </p>
                <div className="legal-warning">
                  <p>
                    Discord requires all users to be at least 13 years old. By using Friday, you confirm you meet Discord's minimum age requirement.
                  </p>
                </div>
              </div>
            </div>

            <div className="legal-section" id="changes">
              <p className="legal-section-num">09</p>
              <h2 className="legal-section-title">Policy Changes</h2>
              <div className="legal-section-body">
                <p>
                  We may update this Privacy Policy from time to time. When we do, we'll update the "Last updated" date at the top of this page. For significant changes, we may provide additional notice such as a message in the Friday support server or an announcement on this website.
                </p>
                <p>
                  Continued use of Friday after changes are posted constitutes your acceptance of the revised policy.
                </p>
              </div>
            </div>

            <div className="legal-section" id="contact">
              <p className="legal-section-num">10</p>
              <h2 className="legal-section-title">Contact</h2>
              <div className="legal-section-body">
                <p>
                  If you have questions about this Privacy Policy, want to exercise your data rights, or need to report a security issue, reach out to us:
                </p>
                <div className="legal-contact-box">
                  <div className="legal-contact-info">
                    <strong>Friday Bot Support</strong>
                    For privacy requests, data deletion, or security reports.
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
                  You may also reach us through the Friday support Discord server. Links are available on the main website.
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
