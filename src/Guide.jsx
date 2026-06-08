import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Zap, Gift, LifeBuoy, UserPlus, Bell, Terminal, Mic,
  Wrench, FileText, Star, Sword, Sprout, Hammer, BarChart2,
  Heart, Users, Gamepad2, Volume2, BookOpen, ChevronRight,
  TrendingUp, Package, ShoppingCart, Search, Swords,
} from 'lucide-react';
import './Guide.css';

const Coins = ({ size = 16 }) => (
  <img src="/fridaycoin.png" alt="coin" style={{ width: size, height: size, objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block', position: 'relative', top: '-1px' }} />
);

const SECTIONS = [
  { id: 'getting-started',  label: 'Getting Started',       Icon: BookOpen,    color: '#3b9dff' },
  { id: 'economy',          label: 'Economy',                Icon: Coins,       color: '#00c853' },
  { id: 'jobs',             label: 'Jobs & Careers',         Icon: Star,        color: '#f59e0b' },
  { id: 'gathering',        label: 'Resource Gathering',     Icon: Sword,       color: '#10b981' },
  { id: 'farming',          label: 'Farming',                Icon: Sprout,      color: '#22c55e' },
  { id: 'crafting',         label: 'Crafting',               Icon: Hammer,      color: '#a78bfa' },
  { id: 'market',           label: 'Market & Trading',       Icon: ShoppingCart, color: '#38bdf8' },
  { id: 'stocks',           label: 'Stocks & Portfolio',     Icon: TrendingUp,  color: '#6366f1' },
  { id: 'pets',             label: 'Pets',                   Icon: Heart,       color: '#ff69b4' },
  { id: 'clans',            label: 'Clans',                  Icon: Users,       color: '#8b5cf6' },
  { id: 'leveling',         label: 'Leveling & XP',          Icon: Zap,         color: '#8b5cf6' },
  { id: 'moderation',       label: 'Moderation & AutoMod',   Icon: Shield,      color: '#ff4569' },
  { id: 'giveaways',        label: 'Giveaways & Events',     Icon: Gift,        color: '#ff9100' },
  { id: 'tickets',          label: 'Tickets',                Icon: LifeBuoy,    color: '#ff9100' },
  { id: 'onboarding',       label: 'Onboarding',             Icon: UserPlus,    color: '#38bdf8' },
  { id: 'alerts',           label: 'Alerts',                 Icon: Bell,        color: '#f59e0b' },
  { id: 'social',           label: 'Social',                 Icon: Heart,       color: '#ff69b4' },
  { id: 'games',            label: 'Games & Gambling',       Icon: Gamepad2,    color: '#f97316' },
  { id: 'voice',            label: 'Voice',                  Icon: Volume2,     color: '#a78bfa' },
  { id: 'customcmds',       label: 'Custom Commands',        Icon: Terminal,    color: '#10b981' },
  { id: 'auditing',         label: 'Auditing & Logs',        Icon: FileText,    color: '#f43f5e' },
  { id: 'utility',          label: 'Utility',                Icon: Wrench,      color: '#3b9dff' },
];

function Tip({ children }) {
  return <div className="guide-tip"><span className="guide-tip-label">TIP</span>{children}</div>;
}

function Warn({ children }) {
  return <div className="guide-warn"><span className="guide-warn-label">NOTE</span>{children}</div>;
}

function CmdRef({ name }) {
  return <code className="guide-cmd-ref">/{name}</code>;
}

function Step({ n, children }) {
  return (
    <div className="guide-step">
      <span className="guide-step-num">{n}</span>
      <span>{children}</span>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="guide-table-wrap">
      <table className="guide-table">
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Guide() {
  const [activeId, setActiveId] = useState('getting-started');
  const observerRef = useRef(null);

  useEffect(() => {
    document.title = 'Guide — Friday Bot';
    return () => { document.title = 'Friday Bot — Smart Discord Community Management'; };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.guide-section[id]');
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    els.forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="guide-root">
      <div className="guide-bg-grid" />
      <div className="guide-bg-glow-1" />
      <div className="guide-bg-glow-2" />

      {/* Nav */}
      <header className="guide-nav">
        <Link to="/" className="guide-nav-brand">
          <img src="/logo.png" alt="Friday" className="guide-nav-logo" />
          <span className="guide-nav-name">FRIDAY</span>
        </Link>
        <div className="guide-nav-right">
          <Link to="/commands" className="guide-nav-link">Commands</Link>
          <Link to="/" className="guide-nav-link">← Home</Link>
        </div>
      </header>

      {/* Hero */}
      <div className="guide-hero">
        <div className="guide-hero-eyebrow">DOCUMENTATION</div>
        <h1 className="guide-hero-title">
          How Friday Works
        </h1>
        <p className="guide-hero-desc">
          A complete guide to every feature, system, and command — from setup to advanced usage.
        </p>
      </div>

      {/* Body */}
      <div className="guide-body">

        {/* Sidebar */}
        <aside className="guide-sidebar">
          <div className="guide-sidebar-label">ON THIS PAGE</div>
          {SECTIONS.map(({ id, label, Icon, color }) => (
            <button
              key={id}
              className={`guide-nav-item ${activeId === id ? 'active' : ''}`}
              onClick={() => scrollTo(id)}
              style={activeId === id ? { color, borderLeftColor: color } : {}}
            >
              <Icon size={13} />
              <span>{label}</span>
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="guide-main">

          {/* ── GETTING STARTED ── */}
          <section id="getting-started" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#3b9dff' }}>
              <BookOpen size={22} />
              <h2>Getting Started</h2>
            </div>
            <p className="guide-section-intro">
              Friday is a full-featured Discord bot covering moderation, economy, leveling, giveaways, tickets, social features, and more. Once invited, most features work out of the box — no setup required.
            </p>
            <h3 className="guide-sub">Quick Setup</h3>
            <Step n={1}>Invite Friday to your server using the invite link on the homepage. Request <strong>Administrator</strong> permission so all features function correctly.</Step>
            <Step n={2}>Friday's core features (economy, leveling, XP gain, social) activate immediately for all members.</Step>
            <Step n={3}>Configure server-specific features using admin commands: set a welcome channel with <CmdRef name="welcome" />, deploy tickets with <CmdRef name="ticket setup" />, enable AutoMod with <CmdRef name="automod toggle" />.</Step>
            <Step n={4}>Use <CmdRef name="help" /> inside Discord for a categorized command list at any time.</Step>
            <Tip>The web dashboard (available after OAuth login) lets you configure most settings without typing commands.</Tip>
          </section>

          {/* ── ECONOMY ── */}
          <section id="economy" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#00c853' }}>
              <Coins size={22} />
              <h2>Economy</h2>
            </div>
            <p className="guide-section-intro">
              Friday has a full virtual economy. Members earn <strong>coins</strong> through work, games, resource gathering, and daily rewards — then spend them in the shop, on trades, stocks, and more.
            </p>
            <h3 className="guide-sub">Earning Coins</h3>
            <Table
              headers={['Source', 'How', 'Cooldown']}
              rows={[
                [<CmdRef name="claim daily" />, '200 coins', '24 hours'],
                [<CmdRef name="claim weekly" />, '1,000–3,500 coins', '7 days'],
                [<CmdRef name="claim monthly" />, '5,000–15,000 coins', '30 days'],
                [<CmdRef name="work" />, 'Scales with job tier (50–20,000)', '1 hour'],
                [<CmdRef name="beg" />, 'Small random coins or junk', '30 seconds'],
                ['Gathering', 'Sell drops from hunt/fish/dig/mine/chop', 'Per command'],
                ['Games', 'Win gambling games (blackjack, slots…)', 'Varies'],
              ]}
            />
            <h3 className="guide-sub">Wallet vs Bank</h3>
            <p>Your coins live in two places: <strong>Wallet</strong> (spendable, robbable) and <strong>Bank vault</strong> (safe from rob). Use <CmdRef name="deposit" /> and <CmdRef name="withdraw" /> to move between them. <CmdRef name="balance" /> shows both plus stock portfolio value and inventory worth.</p>
            <h3 className="guide-sub">Spending Coins</h3>
            <p>Coins can be spent on shop items (<CmdRef name="shop buy" />), pet adoption, clan creation, stock purchases, crafting, and more. Admins can grant or deduct coins with <CmdRef name="economy" />.</p>
            <Tip>Keep coins in the bank vault when not actively spending — it protects them from <CmdRef name="rob" /> and <CmdRef name="bankrob" />.</Tip>
          </section>

          {/* ── JOBS ── */}
          <section id="jobs" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#f59e0b' }}>
              <Star size={22} />
              <h2>Jobs & Careers</h2>
            </div>
            <p className="guide-section-intro">
              Jobs multiply your <CmdRef name="work" /> earnings. There are 24 careers across 4 tiers — each tier requires a minimum level and pays progressively more.
            </p>
            <Table
              headers={['Tier', 'Pay Range', 'Level Required']}
              rows={[
                ['No Job (default)', '50–150 coins', 'Any'],
                ['Starter', '500–2,000 coins', 'Level 5+'],
                ['Mid-tier', '3,000–8,000 coins', 'Level 15+'],
                ['Senior', '8,000–15,000 coins', 'Level 30+'],
                ['Elite', '15,000–20,000 coins', 'Level 50+'],
              ]}
            />
            <Step n={1}>Browse careers with <CmdRef name="job list" /> — pay ranges, level requirements, and XP bonuses are shown.</Step>
            <Step n={2}>Apply with <CmdRef name="job apply" /> once you meet the level requirement.</Step>
            <Step n={3}>Use <CmdRef name="work" /> every hour to collect pay.</Step>
            <Warn>Job switches have a 1-hour cooldown. Quitting with <CmdRef name="job quit" /> reverts pay to the default 50–150 range.</Warn>
          </section>

          {/* ── GATHERING ── */}
          <section id="gathering" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#10b981' }}>
              <Sword size={22} />
              <h2>Resource Gathering</h2>
            </div>
            <p className="guide-section-intro">
              Resource commands drop items you can sell via <CmdRef name="sell" /> or use for crafting. Most require a tool in your inventory.
            </p>
            <Table
              headers={['Command', 'Tool Required', 'Drop Tiers', 'Cooldown']}
              rows={[
                [<CmdRef name="hunt" />, 'Hunting Rifle', '9 tiers: Rabbit → Dragon Scale', '60s'],
                [<CmdRef name="fish" />, 'Fishing Pole', '12 tiers: Clam → Mythical Whale', '45s'],
                [<CmdRef name="dig" />, 'Shovel', '9 tiers: Worm → Buried Gold Chest', '45s'],
                [<CmdRef name="mine" />, 'Pickaxe', '9 tiers: Coal → Mythril Core', '60s'],
                [<CmdRef name="chop" />, 'Axe', '7 tiers: Pine Log → Golden Sap', '45s'],
                [<CmdRef name="hack" />, 'Hacker Laptop', 'Coins + Data files', '10m'],
                [<CmdRef name="search" />, 'None', 'Coins or items from 3 locations', '60s'],
              ]}
            />
            <h3 className="guide-sub">Selling Drops</h3>
            <p>Use <CmdRef name="sell" /> with an item name and quantity to exchange drops for coins at dynamic market prices. Prices fluctuate based on supply — check <CmdRef name="market index" /> to see current rates.</p>
            <Tip>Tools can be bought from the shop or crafted. Use <CmdRef name="craft list" /> to see blueprints.</Tip>
          </section>

          {/* ── FARMING ── */}
          <section id="farming" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#22c55e' }}>
              <Sprout size={22} />
              <h2>Farming</h2>
            </div>
            <p className="guide-section-intro">
              Farming gives you passive income through crop plots. Plant seeds, manage pests, and harvest yields to sell or use.
            </p>
            <Step n={1}><strong>View your farm</strong> — <CmdRef name="farm view" /> shows all plots, growth stages, active fertilizers, and pests.</Step>
            <Step n={2}><strong>Plant</strong> — Use <CmdRef name="farm plant" /> to plant a seed from inventory on an empty plot. Seeds: Wheat, Tomato, Carrot, Golden Apple.</Step>
            <Step n={3}><strong>Water</strong> — <CmdRef name="farm water" /> speeds growth by 25%, but damp soil has a 15% chance to attract pests.</Step>
            <Step n={4}><strong>Fertilize</strong> — Boost crops: Basic (50% speedup), Growth Serum (instant), Yield Booster (double harvest).</Step>
            <Step n={5}><strong>Treat pests</strong> — <CmdRef name="farm treat" /> removes infestations using Pesticide. Infested crops can't be harvested.</Step>
            <Step n={6}><strong>Harvest</strong> — <CmdRef name="farm harvest" /> on a ready crop stores yield in inventory. Higher farming level = better quality (Silver/Gold Star).</Step>
            <Step n={7}><strong>Expand</strong> — Buy more plots with <CmdRef name="farm expand" /> (starts at 3, max 8).</Step>
            <Tip>Craft fertilizers and pesticides instead of buying them — it's cheaper at higher craft levels.</Tip>
          </section>

          {/* ── CRAFTING ── */}
          <section id="crafting" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#a78bfa' }}>
              <Hammer size={22} />
              <h2>Crafting</h2>
            </div>
            <p className="guide-section-intro">
              Crafting turns gathering drops into tools, consumables, and tradeable goods.
            </p>
            <p>Browse all recipes with <CmdRef name="craft list" /> — each recipe shows the required materials and quantities. Once you have the ingredients in your inventory, forge with <CmdRef name="craft item" />.</p>
            <h3 className="guide-sub">Craftable Items</h3>
            <Table
              headers={['Item', 'Use']}
              rows={[
                ['Axe', 'Required for /chop'],
                ['Fishing Pole', 'Required for /fish'],
                ['Shovel', 'Required for /dig'],
                ['Hacker Laptop', 'Required for /hack'],
                ['Lootbox', 'Open for random items'],
                ['Energy Drink', 'Grants 300 coins instantly'],
                ['Basic Fertilizer', 'Farm speedup'],
                ['Growth Serum', 'Instant crop growth'],
                ['Yield Booster', 'Double crop yield'],
                ['Pesticide', 'Cures farm pests'],
                ['Golden Sap', 'High-value sell item'],
              ]}
            />
          </section>

          {/* ── MARKET ── */}
          <section id="market" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#38bdf8' }}>
              <ShoppingCart size={22} />
              <h2>Market & Trading</h2>
            </div>
            <p className="guide-section-intro">
              Two ways to exchange items with other players: the player <strong>Market</strong> (asynchronous listings) and <strong>Trade</strong> (real-time bilateral).
            </p>
            <h3 className="guide-sub">Player Market</h3>
            <Step n={1}>Post a listing: <CmdRef name="market list" /> — specify item name and price.</Step>
            <Step n={2}>Browse active listings: <CmdRef name="market view" />.</Step>
            <Step n={3}>Buy by listing ID: <CmdRef name="market buy" />.</Step>
            <Step n={4}>Cancel your own listing: <CmdRef name="market cancel" />.</Step>
            <h3 className="guide-sub">Live Trade</h3>
            <p>Use <CmdRef name="trade" /> to initiate a direct session with another member. Both sides add coins and up to 5 items, then both confirm. The swap is atomic — no partial trades.</p>
            <h3 className="guide-sub">Market Prices</h3>
            <p><CmdRef name="market index" /> shows dynamic commodity prices affected by server-wide supply and demand. Selling fewer items when supply is high gets you worse rates — time your sells.</p>
          </section>

          {/* ── STOCKS ── */}
          <section id="stocks" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#6366f1' }}>
              <TrendingUp size={22} />
              <h2>Stocks & Portfolio</h2>
            </div>
            <p className="guide-section-intro">
              Friday includes a simulated stock market spanning 6 global exchanges. Buy long-term shares or open leveraged intraday positions.
            </p>
            <Table
              headers={['Exchange', 'Examples']}
              rows={[
                ['NASDAQ', 'AAPL, MSFT, TSLA'],
                ['NSE', 'RELIANCE, TCS, INFY'],
                ['LSE', 'BP, HSBC, SHEL'],
                ['CRYPTO', 'BTC, ETH, SOL'],
                ['TYO', 'Toyota, Sony, Nintendo'],
                ['ASX', 'BHP, CBA, RIO'],
              ]}
            />
            <h3 className="guide-sub">Long-Term Investing</h3>
            <p>Buy shares with <CmdRef name="stock buy" /> and sell with <CmdRef name="stock sell" />. View your portfolio with <CmdRef name="portfolio view" />.</p>
            <h3 className="guide-sub">Leveraged Positions</h3>
            <p>Open a 5× leveraged LONG or SHORT intraday position with <CmdRef name="portfolio open" />. Post margin as collateral — profits and losses are amplified 5×. Close positions with <CmdRef name="portfolio close" />.</p>
            <Warn>Leveraged positions can liquidate if the market moves against you beyond your margin. Only post margin you can afford to lose.</Warn>
          </section>

          {/* ── PETS ── */}
          <section id="pets" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#ff69b4' }}>
              <Heart size={22} />
              <h2>Pets</h2>
            </div>
            <p className="guide-section-intro">
              Adopt a pet companion that levels up, battles other pets, and shows on your profile.
            </p>
            <Step n={1}>Adopt with <CmdRef name="pet adopt" /> for 200 coins. Choose Dog, Cat, Hamster, or Lizard, and give it a name.</Step>
            <Step n={2}>Keep it fed: <CmdRef name="pet feed" /> using coins or a worm item to maintain hunger.</Step>
            <Step n={3}>Train attributes with <CmdRef name="pet train" /> (attack or defense) — each session costs 25 energy.</Step>
            <Step n={4}>Battle other pets: <CmdRef name="pet battle" /> challenges a member's pet based on attack, defense, and level. Winners earn bonus pet XP.</Step>
            <p>Rename your pet any time with <CmdRef name="pet rename" />. View stats with <CmdRef name="pet view" />. <CmdRef name="pet release" /> permanently removes your pet — irreversible.</p>
          </section>

          {/* ── CLANS ── */}
          <section id="clans" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#8b5cf6' }}>
              <Users size={22} />
              <h2>Clans</h2>
            </div>
            <p className="guide-section-intro">
              Clans are permanent groups with a shared treasury, level, and leaderboard ranking. Members contribute coins and earn clan XP through gathering and selling.
            </p>
            <h3 className="guide-sub">Starting a Clan</h3>
            <p>Found a clan with <CmdRef name="clan create" /> for 5,000 coins. Name must be 2–20 characters.</p>
            <h3 className="guide-sub">Membership</h3>
            <p>Owners invite members with <CmdRef name="clan invite" /> — the invite expires in 2 minutes. Invited members join via <CmdRef name="clan join" />. Owners can kick with <CmdRef name="clan kick" />.</p>
            <h3 className="guide-sub">Treasury & Leveling</h3>
            <p>Members deposit coins into the treasury with <CmdRef name="clan deposit" />. Treasury balance contributes to clan level. Renaming costs 2,500 coins from the treasury (<CmdRef name="clan rename" />).</p>
            <p>View your clan or any clan with <CmdRef name="clan info" />. Server rankings by treasury or level: <CmdRef name="clan leaderboard" />.</p>
            <Warn>Owners cannot leave — use <CmdRef name="clan disband" /> to dissolve the clan, which releases all members.</Warn>
          </section>

          {/* ── LEVELING ── */}
          <section id="leveling" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#8b5cf6' }}>
              <Zap size={22} />
              <h2>Leveling & XP</h2>
            </div>
            <p className="guide-section-intro">
              Members earn XP passively through chatting and voice activity. XP accumulates into levels, unlocking level-gated jobs and admin-configured role rewards.
            </p>
            <h3 className="guide-sub">Earning XP</h3>
            <p>XP is awarded automatically for sending messages and spending time in voice channels. Consumables like Pizza (150 XP), XP Potion (300 XP), and trivia wins also award XP.</p>
            <h3 className="guide-sub">Viewing Progress</h3>
            <p><CmdRef name="rank" /> shows a styled rank card with level, XP bar, and server standing. <CmdRef name="leaderboard xp" /> shows the top 10 members by XP.</p>
            <h3 className="guide-sub">Admin Configuration</h3>
            <p>Set a server-wide XP multiplier with <CmdRef name="level-config" /> (e.g. 2.0 for a Double XP event). Configure level-up role rewards with <CmdRef name="level-rewards" />. Manually adjust XP with <CmdRef name="xp" />.</p>
          </section>

          {/* ── MODERATION ── */}
          <section id="moderation" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#ff4569' }}>
              <Shield size={22} />
              <h2>Moderation & AutoMod</h2>
            </div>
            <p className="guide-section-intro">
              Friday provides a full moderation toolkit with manual commands and an automated filter system.
            </p>
            <h3 className="guide-sub">Manual Moderation</h3>
            <Table
              headers={['Command', 'What It Does']}
              rows={[
                [<CmdRef name="warn" />, 'Issue a formal warning. Triggers escalation rules if threshold hit.'],
                [<CmdRef name="warnings" />, 'View full warning history for a member.'],
                [<CmdRef name="clearwarn" />, 'Delete a specific warning by ID or wipe all.'],
                [<CmdRef name="timeout" />, 'Applies Discord timeout (60s up to 1 day).'],
                [<CmdRef name="kick" />, 'Removes member from server (can rejoin).'],
                [<CmdRef name="ban" />, 'Permanent ban, optionally deletes message history.'],
                [<CmdRef name="unban" />, 'Revoke ban by Discord user ID.'],
                [<CmdRef name="lockdown" />, 'Prevent standard members from sending in a channel.'],
                [<CmdRef name="purge" />, 'Bulk delete up to 100 messages, with content filter.'],
                [<CmdRef name="slowmode" />, 'Set channel message cooldown (0 to disable).'],
              ]}
            />
            <h3 className="guide-sub">AutoMod</h3>
            <p>AutoMod automatically scans messages and takes action. Enable/disable modules with <CmdRef name="automod toggle" /> (spam, caps, links). Add blocked words with <CmdRef name="automod blocklist" /> and whitelist safe channels/roles with <CmdRef name="automod whitelist" />.</p>
            <h3 className="guide-sub">Escalation Rules</h3>
            <p>Configure automatic punishments triggered at warning thresholds with <CmdRef name="automod punishments" /> — for example: 3 warnings → timeout, 5 warnings → kick, 7 warnings → ban.</p>
          </section>

          {/* ── GIVEAWAYS ── */}
          <section id="giveaways" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#ff9100' }}>
              <Gift size={22} />
              <h2>Giveaways & Events</h2>
            </div>
            <p className="guide-section-intro">
              Run automated giveaways and RSVP events directly in your server.
            </p>
            <h3 className="guide-sub">Giveaways</h3>
            <Step n={1}>Start: <CmdRef name="giveaway start" /> — set duration (e.g. 30m, 2h), number of winners, and prize.</Step>
            <Step n={2}>Members enter by clicking the button in the giveaway embed.</Step>
            <Step n={3}>Winners are drawn automatically when the timer ends, or immediately with <CmdRef name="giveaway end" />.</Step>
            <Step n={4}>If winners don't respond, re-roll with <CmdRef name="giveaway reroll" />.</Step>
            <h3 className="guide-sub">Events</h3>
            <p>Deploy an RSVP card with <CmdRef name="event create" /> — members RSVP via buttons. Live attendance count is tracked in the embed.</p>
          </section>

          {/* ── TICKETS ── */}
          <section id="tickets" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#ff9100' }}>
              <LifeBuoy size={22} />
              <h2>Tickets</h2>
            </div>
            <p className="guide-section-intro">
              Friday's ticket system creates private support channels on demand, with transcript generation on close.
            </p>
            <Step n={1}><strong>Setup</strong> — Run <CmdRef name="ticket setup" /> in a channel to deploy the "Create Ticket" button panel.</Step>
            <Step n={2}><strong>Open</strong> — Members click the button to open a private channel. Only they and staff can see it.</Step>
            <Step n={3}><strong>Collaborate</strong> — Add other members or roles with <CmdRef name="ticket add" /> and remove with <CmdRef name="ticket remove" />.</Step>
            <Step n={4}><strong>Close</strong> — <CmdRef name="ticket close" /> generates a full HTML conversation transcript and deletes the channel.</Step>
            <Tip>Pin the ticket panel in a dedicated #support channel so it's always visible to members.</Tip>
          </section>

          {/* ── ONBOARDING ── */}
          <section id="onboarding" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#38bdf8' }}>
              <UserPlus size={22} />
              <h2>Onboarding</h2>
            </div>
            <p className="guide-section-intro">
              Automatically welcome new members, assign them roles, and let them self-select roles on join.
            </p>
            <h3 className="guide-sub">Welcome Messages</h3>
            <p>Configure with <CmdRef name="welcome" /> — choose a channel and write a message using placeholders: <code className="guide-inline-code">{'{user}'}</code> (mention), <code className="guide-inline-code">{'{username}'}</code>, <code className="guide-inline-code">{'{server}'}</code>, <code className="guide-inline-code">{'{memberCount}'}</code>.</p>
            <h3 className="guide-sub">Auto-Role</h3>
            <p><CmdRef name="autorole" /> automatically assigns a role to every new member. Great for giving everyone a base role on join.</p>
            <h3 className="guide-sub">Reaction Roles</h3>
            <p><CmdRef name="reactionrole" /> deploys a button-based role picker embed. Members self-assign up to 5 selectable roles by clicking buttons — no moderator intervention needed.</p>
          </section>

          {/* ── ALERTS ── */}
          <section id="alerts" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#f59e0b' }}>
              <Bell size={22} />
              <h2>Alerts</h2>
            </div>
            <p className="guide-section-intro">
              Subscribe to external content notifications so your server gets pinged automatically when something goes live.
            </p>
            <h3 className="guide-sub">YouTube Alerts</h3>
            <p>Use <CmdRef name="alerts youtube" /> with action <code className="guide-inline-code">add</code> to subscribe to a YouTube channel URL. Specify which Discord channel to post new video alerts in.</p>
            <h3 className="guide-sub">Twitch Alerts</h3>
            <p>Use <CmdRef name="alerts twitch" /> with action <code className="guide-inline-code">add</code> to subscribe to a Twitch streamer by username. Friday will post a live notification when they go live.</p>
            <p>Use <code className="guide-inline-code">list</code> to see all subscriptions and <code className="guide-inline-code">remove</code> to unsubscribe.</p>
          </section>

          {/* ── SOCIAL ── */}
          <section id="social" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#ff69b4' }}>
              <Heart size={22} />
              <h2>Social</h2>
            </div>
            <p className="guide-section-intro">
              Social commands let members build identity, reputation, and relationships in the server.
            </p>
            <Table
              headers={['Command', 'Description']}
              rows={[
                [<CmdRef name="profile" />, 'Full profile card: bio, level, coins, job, pet, clan, rep, marriage.'],
                [<CmdRef name="bio" />, 'Set your personal tagline (max 150 chars).'],
                [<CmdRef name="rep" />, 'Give +1 rep to another member (once per 24h).'],
                [<CmdRef name="marry propose" />, 'Send a marriage proposal (60s to accept).'],
                [<CmdRef name="marry divorce" />, 'Dissolve current in-server marriage.'],
                [<CmdRef name="trivia" />, 'Timed multiple-choice question for coins + XP. Easy/Med/Hard scaling rewards.'],
              ]}
            />
          </section>

          {/* ── GAMES ── */}
          <section id="games" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#f97316' }}>
              <Gamepad2 size={22} />
              <h2>Games & Gambling</h2>
            </div>
            <p className="guide-section-intro">
              Risk your coins on interactive games. All use your wallet balance — make sure you have enough before betting.
            </p>
            <Table
              headers={['Game', 'How to Win']}
              rows={[
                [<CmdRef name="blackjack" />, 'Beat the dealer to 21. Hit or Stand.'],
                [<CmdRef name="slots" />, 'Match symbols for multiplied payouts.'],
                [<CmdRef name="dice" />, 'Highest dice total wins 2× bet. Tie = bet returned.'],
                [<CmdRef name="roulette" />, 'Bet on number (0–36), red, black, or green.'],
                [<CmdRef name="coinflip" />, 'Guess heads or tails — win 2×.'],
                [<CmdRef name="rps" />, 'Rock, Paper, Scissors vs Friday.'],
                [<CmdRef name="horse" />, 'Pick a horse; Favourite pays 1.8×, Dark Horse pays 6×.'],
                [<CmdRef name="highlow" />, 'Chain higher/lower guesses: multipliers up to 4.5×.'],
                [<CmdRef name="cockfight" />, 'High-risk arena bet.'],
                [<CmdRef name="lottery buy" />, 'Buy tickets (100c each) for the daily jackpot draw.'],
                [<CmdRef name="scramble" />, 'Unscramble the word first for coins + XP.'],
                [<CmdRef name="crime" />, 'Choice-based heist scenarios: Pickpocket, Carjack, Bank Fraud.'],
              ]}
            />
            <Warn>Gambling games carry real risk of losing your bet. Never bet more than you can afford to lose from your wallet.</Warn>
          </section>

          {/* ── VOICE ── */}
          <section id="voice" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#a78bfa' }}>
              <Volume2 size={22} />
              <h2>Voice</h2>
            </div>
            <p className="guide-section-intro">
              Friday tracks voice activity and gives members control over temporary voice channels.
            </p>
            <h3 className="guide-sub">Temporary Voice Channels</h3>
            <p>When members join a designated "create" voice channel, Friday spawns a private temporary channel for them. Commands to manage it:</p>
            <Table
              headers={['Command', 'Effect']}
              rows={[
                [<CmdRef name="vc lock" />, 'Block new members from joining your channel.'],
                [<CmdRef name="vc unlock" />, 'Re-open your channel to anyone.'],
                [<CmdRef name="vc claim" />, 'Claim ownership when the original owner left.'],
              ]}
            />
            <h3 className="guide-sub">Voice Leaderboard</h3>
            <p><CmdRef name="vclevel" /> shows server voice engagement rankings and total voice minutes per member.</p>
          </section>

          {/* ── CUSTOM COMMANDS ── */}
          <section id="customcmds" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#10b981' }}>
              <Terminal size={22} />
              <h2>Custom Commands</h2>
            </div>
            <p className="guide-section-intro">
              Create server-specific trigger commands that respond with text or embed cards — no coding required.
            </p>
            <h3 className="guide-sub">Text Commands</h3>
            <p>Create a plain-text responder: <CmdRef name="customcmd add" /> with a trigger keyword and response text. Members type the trigger (e.g. <code className="guide-inline-code">!rules</code>) and Friday replies.</p>
            <h3 className="guide-sub">Embed Commands</h3>
            <p><CmdRef name="customcmd embed" /> creates a trigger that responds with a rich embed card. A modal opens so you can fill in title, description, color, and more.</p>
            <p>List all custom commands: <CmdRef name="customcmd list" />. Remove with <CmdRef name="customcmd remove" />.</p>
          </section>

          {/* ── AUDITING ── */}
          <section id="auditing" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#f43f5e' }}>
              <FileText size={22} />
              <h2>Auditing & Logs</h2>
            </div>
            <p className="guide-section-intro">
              Admin-only tools to audit server activity, economy health, and moderation history.
            </p>
            <Table
              headers={['Command', 'What It Shows']}
              rows={[
                [<CmdRef name="analytics overview" />, 'Total members, coins in circulation, XP totals, avg level, top 5 wealthiest.'],
                [<CmdRef name="analytics topspenders" />, 'Top 10 members by combined wallet + bank.'],
                [<CmdRef name="analytics activity" />, 'Economy summary for a single member.'],
                [<CmdRef name="logs message" />, 'Recent deleted and edited message logs, filterable by user.'],
                [<CmdRef name="logs voice" />, 'Recent voice join/leave activity, filterable by user.'],
                [<CmdRef name="modstats" />, 'Moderation action counts for a staff member (warns, kicks, bans).'],
                [<CmdRef name="serveractivity" />, 'Link to live telemetry charts on the web dashboard.'],
              ]}
            />
          </section>

          {/* ── UTILITY ── */}
          <section id="utility" className="guide-section">
            <div className="guide-section-header" style={{ '--sec-color': '#3b9dff' }}>
              <Wrench size={22} />
              <h2>Utility</h2>
            </div>
            <p className="guide-section-intro">
              General-purpose commands that don't fit a specific category but are useful day-to-day.
            </p>
            <Table
              headers={['Command', 'What It Does']}
              rows={[
                [<CmdRef name="ping" />, 'Bot latency and WebSocket heartbeat check.'],
                [<CmdRef name="avatar" />, 'High-resolution avatar for any member.'],
                [<CmdRef name="userinfo" />, 'Full profile details — roles, join date, status.'],
                [<CmdRef name="serverinfo" />, 'Server stats and metadata.'],
                [<CmdRef name="servericon" />, 'High-res server icon.'],
                [<CmdRef name="channelinfo" />, 'Channel settings and metadata.'],
                [<CmdRef name="roleinfo" />, 'Role permissions, color, and metadata.'],
                [<CmdRef name="embed create" />, 'Modal wizard to post a custom embed card.'],
                [<CmdRef name="poll create" />, 'Reaction poll with up to 10 options and custom emojis.'],
                [<CmdRef name="remind" />, 'Schedule a DM reminder (e.g. 10m, 2h, 1d).'],
                [<CmdRef name="weather" />, 'Real-time weather for any city.'],
                [<CmdRef name="urban" />, 'Top Urban Dictionary definition for a term.'],
                [<CmdRef name="meme" />, 'Random Reddit meme, optionally from a specific subreddit.'],
              ]}
            />
          </section>

        </main>
      </div>
    </div>
  );
}
