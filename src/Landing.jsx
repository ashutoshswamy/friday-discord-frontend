import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Shield, Zap, Coins, Gift, LifeBuoy, UserPlus,
  ChevronRight, ArrowRight, Star, Check,
  Menu, X, Link, Bell, Terminal, Mic, BrainCircuit,
  Wrench, FileText, TrendingUp
} from 'lucide-react';
import './Landing.css';
import Footer from './Footer';

const makeInviteUrl = (clientId) =>
  `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;

const ORBIT_ICONS = [
  { Icon: Shield,   label: 'AutoMod',    color: '#3b9dff', angle: 0   },
  { Icon: Zap,      label: 'Leveling',   color: '#8b5cf6', angle: 60  },
  { Icon: Coins,    label: 'Economy',    color: '#00c853', angle: 120 },
  { Icon: Gift,     label: 'Giveaways',  color: '#ff9100', angle: 180 },
  { Icon: LifeBuoy, label: 'Tickets',    color: '#ff4569', angle: 240 },
  { Icon: Bell,     label: 'Alerts',     color: '#38bdf8', angle: 300 },
];

const FEATURES = [
  {
    Icon: Shield,
    title: 'AutoMod & Moderation',
    desc: 'Full moderation suite — automated spam, caps, and link filtering with warn, timeout, kick, ban, lockdown, purge, slowmode, and escalation rules.',
    color: '#3b9dff',
    num: '01',
    pos: { gridColumn: '1 / 3', gridRow: '1 / 2' },
  },
  {
    Icon: Zap,
    title: 'XP Leveling & Voice',
    desc: 'Members earn XP for chat and voice activity. Set multipliers, milestone role rewards, and track voice leaderboards.',
    color: '#8b5cf6',
    num: '02',
    pos: { gridColumn: '3 / 4', gridRow: '1 / 2' },
  },
  {
    Icon: Coins,
    title: 'Economy, Jobs & Games',
    desc: 'Virtual economy with a tiered job system (24 careers, 4 tiers) that scales /work pay from 50 to 20,000 coins. Daily rewards, hunting, fishing, digging — plus a real-time stock market with 5× leveraged trading. Blackjack, roulette, slots, and more.',
    color: '#00c853',
    num: '03',
    pos: { gridColumn: '1 / 2', gridRow: '2 / 3' },
  },
  {
    Icon: LifeBuoy,
    title: 'Tickets & Helpdesk',
    desc: 'Deploy a persistent helpdesk panel. Members open private tickets, add collaborators, and get full transcripts on close.',
    color: '#ff9100',
    num: '04',
    pos: { gridColumn: '2 / 3', gridRow: '2 / 3' },
  },
  {
    Icon: Gift,
    title: 'Giveaways & Events',
    desc: 'Launch timed giveaways with button entries, draw multiple winners, and reroll. Create RSVP event cards with live attendance tracking.',
    color: '#ff4569',
    num: '05',
    pos: { gridColumn: '3 / 4', gridRow: '2 / 3' },
  },
  {
    Icon: UserPlus,
    title: 'Smart Onboarding',
    desc: 'Welcome new members with custom messages, auto-assign roles on join, and deploy button-based reaction role menus — all dashboard-configurable.',
    color: '#38bdf8',
    num: '06',
    pos: { gridColumn: '1 / 2', gridRow: '3 / 4' },
  },
  {
    Icon: Bell,
    title: 'Alerts & Notifications',
    desc: 'Subscribe to YouTube channel uploads and Twitch live streams. Friday pings your chosen channel the moment new content drops.',
    color: '#f59e0b',
    num: '07',
    pos: { gridColumn: '2 / 3', gridRow: '3 / 4' },
  },
  {
    Icon: Terminal,
    title: 'Custom Commands',
    desc: 'Create server-specific trigger commands with plain-text or rich embed responses. Build a custom command library unique to your community.',
    color: '#10b981',
    num: '08',
    pos: { gridColumn: '3 / 4', gridRow: '3 / 4' },
  },
  {
    Icon: FileText,
    title: 'Auditing & Logs',
    desc: 'Track deleted and edited messages, voice join/leave activity, and moderator action stats. Full audit trail accessible from the dashboard.',
    color: '#f43f5e',
    num: '09',
    pos: { gridColumn: '1 / 2', gridRow: '4 / 5' },
  },
  {
    Icon: Wrench,
    title: 'Utility Tools',
    desc: 'Avatar lookup, user/server/role/channel info, polls, reminders, Urban Dictionary, weather, and custom embed builder — all in one bot.',
    color: '#94a3b8',
    num: '10',
    pos: { gridColumn: '2 / 4', gridRow: '4 / 5' },
  },
];

const AI_COMMANDS = [
  {
    cmd: '/friday ask',
    args: '[query]',
    color: '#8b5cf6',
    desc: 'Direct AI query answered in Friday\'s system persona — sharp, contextual, direct.',
  },
  {
    cmd: '/friday imagine',
    args: '[prompt]',
    color: '#ec4899',
    desc: 'Generate a synthetic image from any text description. Costs 50 coins per generation.',
  },
  {
    cmd: '/friday rewrite',
    args: '[style] [text]',
    color: '#10b981',
    desc: 'Transform text into Professional, Cyberpunk, Sarcastic, Pirate, or Shakespeare style.',
  },
  {
    cmd: '/friday summarize',
    args: '',
    color: '#38bdf8',
    desc: 'Reads last 50 channel messages and outputs a structured briefing of key topics and vibe.',
  },
];

const STEPS = [
  {
    Icon: Link,
    number: '01',
    title: 'Invite Friday',
    desc: 'Add Friday to your Discord server with a single click. No complex permissions setup needed — Friday handles everything.',
  },
  {
    Icon: Shield,
    number: '02',
    title: 'Configure',
    desc: 'Log into the dashboard, select your server, and configure AutoMod filters, leveling rewards, and economy in minutes.',
  },
  {
    Icon: Star,
    number: '03',
    title: 'Sit Back',
    desc: 'Friday runs 24/7, handling moderation and community management automatically so you can focus on growing your server.',
  },
];

export default function Landing({ onLogin, clientId, isLoggedIn }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleDashboard = isLoggedIn ? () => navigate('/dashboard') : onLogin;

  useEffect(() => {
    document.title = 'Friday Bot — Smart Discord Community Management';
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const inviteUrl = makeInviteUrl(clientId);
  const ORBIT_RADIUS = 155;
  const ORBIT_CENTER = 190;
  const ICON_HALF = 22;

  return (
    <div className="lp-root">

      {/* ── NAV ── */}
      <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <div className="lp-nav-brand">
            <img src="/logo.png" alt="Friday" className="lp-nav-logo" />
            <span className="lp-nav-name">FRIDAY</span>
          </div>

          <nav className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#ai">AI</a>
            <a href="#how">How it works</a>
            <RouterLink to="/commands">Commands</RouterLink>
            <RouterLink to="/updates">Updates</RouterLink>
            <RouterLink to="/status" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00e676', display: 'inline-block', boxShadow: '0 0 6px #00e676' }} />
              Status
            </RouterLink>
          </nav>

          <div className="lp-nav-ctas">
            <a href={inviteUrl} target="_blank" rel="noreferrer" className="lp-btn lp-btn-discord" style={{ padding: '8px 16px', fontSize: '13px' }}>
              <svg width="14" height="11" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
                <path d="M20.317 1.492a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.168-.32 10.702.099 15.179a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.452c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Add to Discord
            </a>
            <button className="lp-btn lp-btn-primary" onClick={handleDashboard}>
              {isLoggedIn ? 'Go to Dashboard' : 'Dashboard'}
            </button>
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
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#ai" onClick={() => setMobileMenuOpen(false)}>AI</a>
            <a href="#how" onClick={() => setMobileMenuOpen(false)}>How it works</a>
            <RouterLink to="/commands" onClick={() => setMobileMenuOpen(false)}>Commands</RouterLink>
            <RouterLink to="/updates" onClick={() => setMobileMenuOpen(false)}>Updates</RouterLink>
            <RouterLink to="/status" onClick={() => setMobileMenuOpen(false)}>Status</RouterLink>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="lp-btn lp-btn-discord"
              style={{ textAlign: 'center', justifyContent: 'center' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Add to Discord
            </a>
            <button
              className="lp-btn lp-btn-primary"
              style={{ textAlign: 'center', justifyContent: 'center' }}
              onClick={() => { setMobileMenuOpen(false); handleDashboard(); }}
            >
              Dashboard
            </button>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-bg-glow" />
        <div className="lp-hero-bg-glow-2" />

        <div className="lp-container lp-hero-grid">

          {/* Left: Content */}
          <div className="lp-hero-content">

            <div className="lp-discord-badge">
              <svg width="15" height="12" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
                <path d="M20.317 1.492a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.168-.32 10.702.099 15.179a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.452c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord Bot — Free Forever
            </div>

            <h1 className="lp-hero-title">
              The <span className="lp-hero-title-accent">Discord Bot</span><br />
              Your Server's Been<br />
              Waiting For.
            </h1>

            <p className="lp-hero-desc">
              Add Friday to your Discord server in seconds. Moderation, leveling, economy, AI, giveaways and more — one bot, every feature.
            </p>

            <div className="lp-hero-actions">
              <a href={inviteUrl} target="_blank" rel="noreferrer" className="lp-btn lp-btn-discord lp-btn-lg">
                <svg width="18" height="14" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
                  <path d="M20.317 1.492a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.168-.32 10.702.099 15.179a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.452c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Add to Discord
              </a>
              <button className="lp-btn lp-btn-ghost lp-btn-lg" onClick={handleDashboard}>
                Open Dashboard <ArrowRight size={16} />
              </button>
            </div>

            <div className="lp-hero-stats">
              <div className="lp-stat">
                <span className="lp-stat-num">77+</span>
                <span className="lp-stat-label">Slash Commands</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-num">10</span>
                <span className="lp-stat-label">Feature Systems</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-num">Free</span>
                <span className="lp-stat-label">No Premium Paywalls</span>
              </div>
            </div>
          </div>

          {/* Right: Orbit visual */}
          <div className="lp-hero-visual">
            <div className="lp-orbit-container">
              <div className="lp-orbit-ring lp-orbit-ring-3" />
              <div className="lp-orbit-ring lp-orbit-ring-1" />
              <div className="lp-orbit-ring lp-orbit-ring-2" />

              <div className="lp-bot-logo-wrapper">
                <div className="lp-bot-glow" />
                <img src="/logo.png" alt="Friday Bot" className="lp-bot-logo" />
              </div>

              {ORBIT_ICONS.map(({ Icon, label, color, angle }) => {
                const rad = (angle * Math.PI) / 180;
                const x = ORBIT_CENTER + ORBIT_RADIUS * Math.sin(rad) - ICON_HALF;
                const y = ORBIT_CENTER - ORBIT_RADIUS * Math.cos(rad) - ICON_HALF;
                return (
                  <div
                    key={label}
                    className="lp-orbit-icon"
                    style={{ left: `${x}px`, top: `${y}px` }}
                    title={label}
                  >
                    <Icon size={18} color={color} />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-features" id="features">
        <div className="lp-container">
          <div className="lp-section-eyebrow">
            <span className="lp-section-eyebrow-line" />
            <span className="lp-section-label">FEATURES</span>
          </div>
          <h2 className="lp-section-title">Everything Your Server Needs</h2>
          <p className="lp-section-desc">
            Ten powerful systems — plus built-in AI — working in harmony to create a safer, more engaging community.
          </p>

          <div className="lp-features-grid">
            {FEATURES.map(({ Icon, title, desc, color, num, pos }) => (
              <div
                className="lp-feature-card"
                key={title}
                style={{ ...pos, '--feat-color': color, '--feat-color-dim': color + '18', '--feat-color-border': color + '30' }}
              >
                <span className="lp-feat-watermark">{num}</span>
                <div className="lp-feat-inner">
                  <div className="lp-feat-icon-wrap" style={{ background: color + '14', border: `1px solid ${color}28` }}>
                    <Icon size={20} color={color} />
                  </div>
                  <h3 className="lp-feat-title">{title}</h3>
                  <p className="lp-feat-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI FEATURES ── */}
      <section className="lp-ai" id="ai">
        <div className="lp-container">
          <div className="lp-ai-layout">
            <div className="lp-ai-header">
              <div className="lp-section-eyebrow">
                <span className="lp-section-eyebrow-line" />
                <span className="lp-section-label">AI POWERED</span>
              </div>
              <h2 className="lp-section-title">Friday Thinks.<br />Friday Creates.</h2>
              <p className="lp-section-desc" style={{ marginBottom: 0 }}>
                Four built-in AI commands powered by Gemini — zero config, available to every member from day one.
              </p>
            </div>

            <div className="lp-ai-terminal">
              <div className="lp-ai-term-bar">
                <div className="lp-ai-term-dots">
                  <span className="lp-dot lp-dot-r" />
                  <span className="lp-dot lp-dot-y" />
                  <span className="lp-dot lp-dot-g" />
                </div>
                <span className="lp-ai-term-label">friday@ai-engine — gemini</span>
                <span className="lp-ai-term-badge">GEMINI FLASH</span>
              </div>
              <div className="lp-ai-term-body">
                {AI_COMMANDS.map(({ cmd, args, color, desc }) => (
                  <div key={cmd} className="lp-ai-row">
                    <span className="lp-ai-prompt" style={{ color }}>▸</span>
                    <div className="lp-ai-row-content">
                      <div className="lp-ai-row-top">
                        <code className="lp-ai-cmd-text" style={{ color }}>{cmd}</code>
                        {args && <code className="lp-ai-args-text">{args}</code>}
                      </div>
                      <p className="lp-ai-row-desc">{desc}</p>
                    </div>
                  </div>
                ))}
                <div className="lp-ai-cursor-row">
                  <span className="lp-ai-prompt" style={{ color: '#3b9dff' }}>▸</span>
                  <span className="lp-ai-blink">█</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-how" id="how">
        <div className="lp-container">
          <div className="lp-section-eyebrow">
            <span className="lp-section-eyebrow-line" />
            <span className="lp-section-label">HOW IT WORKS</span>
          </div>
          <h2 className="lp-section-title">Up and Running in Minutes</h2>
          <p className="lp-section-desc">
            No complicated setup. No technical knowledge required. Just invite, configure, and watch Friday work.
          </p>

          <div className="lp-timeline">
            {STEPS.map(({ Icon, number, title, desc }, i) => (
              <div key={number} className="lp-tl-step">
                <div className="lp-tl-left">
                  <div className="lp-tl-num-wrap">
                    <span className="lp-tl-num">{number}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="lp-tl-connector">
                      <div className="lp-tl-line" />
                    </div>
                  )}
                </div>
                <div className="lp-tl-content">
                  <div className="lp-tl-icon-wrap">
                    <Icon size={17} color="var(--lp-primary)" />
                  </div>
                  <div className="lp-tl-body">
                    <h3 className="lp-tl-title">{title}</h3>
                    <p className="lp-tl-desc">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta-glow" />
        <div className="lp-container">
          <img src="/logo.png" alt="Friday Bot" className="lp-cta-logo" />
          <h2 className="lp-cta-title">
            Ready to elevate<br />your server?
          </h2>
          <p className="lp-cta-desc">
            Join Discord communities using Friday to build better, safer, and more engaging servers — completely free.
          </p>

          <div className="lp-cta-actions">
            <a href={inviteUrl} target="_blank" rel="noreferrer" className="lp-btn lp-btn-discord lp-btn-lg">
              <svg width="18" height="14" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
                <path d="M20.317 1.492a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.168-.32 10.702.099 15.179a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.452c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Add to Discord — Free
            </a>
            <button className="lp-btn lp-btn-outline lp-btn-lg" onClick={handleDashboard}>
              View Dashboard
            </button>
          </div>

          <div className="lp-cta-checks">
            {['Free to use', 'No credit card', 'Setup in 2 minutes'].map(t => (
              <div key={t} className="lp-cta-check">
                <Check size={14} color="var(--lp-primary)" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onDashboard={handleDashboard} />

    </div>
  );
}
