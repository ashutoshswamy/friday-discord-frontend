import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Shield, Zap, Gift, LifeBuoy, UserPlus,
  ChevronRight, ArrowRight, Star, Check,
  Menu, X, Link, Bell, Terminal, Mic, BrainCircuit,
  Wrench, FileText, TrendingUp, Trophy,
  Crown, Palette, Gamepad2, Monitor, Music, Megaphone, Lock, PartyPopper
} from 'lucide-react';

const Coins = ({ size = 16, className = '', style = {} }) => (
  <img 
    src="/emojis/fridaycoin.png"
    alt="🪙" 
    className={className} 
    style={{ 
      width: `${size}px`, 
      height: `${size}px`, 
      objectFit: 'contain', 
      verticalAlign: 'middle', 
      display: 'inline-block', 
      position: 'relative', 
      top: '-0.5px', 
      ...style 
    }} 
  />
);

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

const PREVIEW_ITEMS = [
  {
    id: 'automod', label: 'AutoMod', Icon: Shield, color: '#3b9dff', eyebrow: 'AUTOMOD',
    title: 'Full AutoMod Control',
    desc: 'Toggle spam, caps, link, and invite filters with a single click. Build custom blocklists with plain words or regex patterns. Whitelist trusted channels and roles so they never get caught in the net.',
    bullets: ['Spam, caps, link & invite filters', 'Custom word & regex blocklist', 'Channel & role whitelisting', 'Auto-escalation punishment rules'],
  },
  {
    id: 'leaderboard', label: 'Leaderboard', Icon: Trophy, color: '#8b5cf6', eyebrow: 'LEADERBOARD',
    title: 'Track Your Community',
    desc: 'Real-time XP and economy leaderboards show exactly who\'s most active. Set multipliers for XP events, assign milestone role rewards, and watch engagement climb.',
    bullets: ['XP & economy leaderboards', 'Configurable XP multipliers', 'Level-up role rewards', 'Milestone role rewards'],
  },
  {
    id: 'economy', label: 'Economy', Icon: Coins, color: '#00c853', eyebrow: 'ECONOMY',
    title: 'A Full Virtual Economy',
    desc: 'Build a thriving server economy with a custom shop, tiered job system, hunting and fishing minigames, player-to-player trading, and a real-time stock market with 5× leveraged positions.',
    bullets: ['Custom server shop with role rewards', '24 careers across 4 pay tiers', 'Hunt, fish, dig & player market', 'Real-time stocks with leveraged trading'],
  },
  {
    id: 'giveaways', label: 'Giveaways', Icon: Gift, color: '#ff4569', eyebrow: 'GIVEAWAYS',
    title: 'Run Giveaways Effortlessly',
    desc: 'Launch timed giveaways with button-based entry in seconds. End them early, draw multiple winners at once, or reroll from the existing entry pool — all without touching a command.',
    bullets: ['Button-based entry system', 'Multiple winners & early end', 'One-click winner reroll', 'RSVP event cards with attendance'],
  },
  {
    id: 'tickets', label: 'Tickets', Icon: LifeBuoy, color: '#ff9100', eyebrow: 'TICKETS',
    title: 'Effortless Support System',
    desc: 'Deploy a persistent helpdesk panel in any channel. Members open private ticket threads, add collaborators, and receive a full HTML transcript when the ticket closes.',
    bullets: ['One-click ticket creation panel', 'Private per-member threads', 'Add or remove collaborators', 'Full HTML transcript on close'],
  },
  {
    id: 'onboarding', label: 'Onboarding', Icon: UserPlus, color: '#38bdf8', eyebrow: 'ONBOARDING',
    title: 'Smart Member Onboarding',
    desc: 'Greet every new member with a personalised welcome message using dynamic placeholders. Auto-assign roles on join and deploy button-based reaction role menus so members self-organise from day one.',
    bullets: ['Custom welcome messages with placeholders', 'Auto-assign roles on member join', 'Button-based reaction role menus', 'Up to 5 self-assignable roles per panel'],
  },
  {
    id: 'alerts', label: 'Alerts', Icon: Bell, color: '#f59e0b', eyebrow: 'ALERTS',
    title: 'Never Miss a Drop',
    desc: 'Subscribe to YouTube channels and Twitch streamers. Friday pings your chosen Discord channel the moment a new video uploads or a streamer goes live — no delays, no polling.',
    bullets: ['YouTube upload notifications', 'Twitch live stream alerts', 'Route alerts to any channel', 'Manage all subscriptions from dashboard'],
  },
  {
    id: 'customcmds', label: 'Custom Commands', Icon: Terminal, color: '#10b981', eyebrow: 'CUSTOM COMMANDS',
    title: 'Your Server, Your Commands',
    desc: 'Build a library of server-specific trigger commands. Create plain-text responses for quick info or rich embed cards for fully styled announcements — no coding needed.',
    bullets: ['Plain-text trigger commands', 'Rich embed responses via modal builder', 'Unlimited custom commands per server', 'Add, edit & remove from the dashboard'],
  },
  {
    id: 'auditing', label: 'Auditing', Icon: FileText, color: '#f43f5e', eyebrow: 'AUDITING',
    title: 'Full Server Audit Trail',
    desc: 'Keep a complete record of everything that happens in your server. Track deleted and edited messages, voice join/leave activity, and per-moderator action counts — all accessible from the dashboard.',
    bullets: ['Deleted & edited message logs', 'Voice channel join/leave history', 'Per-moderator action stats', 'Live telemetry charts on dashboard'],
  },
  {
    id: 'stocks', label: 'Stocks', Icon: TrendingUp, color: '#a78bfa', eyebrow: 'STOCKS',
    title: 'Live Stock Market',
    desc: 'A real-time stock market with 5 tradeable assets and up to 5× leveraged positions. Buy, sell, and hold — prices shift every hour. Admins can inspect any member\'s portfolio from the dashboard.',
    bullets: ['5 live tradeable stocks', 'Up to 5× leveraged positions', 'Hourly price movements', 'Per-member portfolio viewer'],
  },
];

export default function Landing({ onLogin, clientId, isLoggedIn }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreview, setActivePreview] = useState('automod');
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

  const renderCard = (id) => {
    switch (id) {
      case 'automod': return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar"><div className="lp-automod-dots"><span className="lp-dot lp-dot-r"/><span className="lp-dot lp-dot-y"/><span className="lp-dot lp-dot-g"/></div><span className="lp-dash-titlebar-label">Friday Dashboard — AutoMod</span></div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title" style={{borderBottom:'1px solid rgba(59,157,255,0.09)',paddingBottom:'10px',marginBottom:'0'}}>AutoMod Filters</div>
              {[{label:'Spam Regulation',desc:'Deletes messages sent in rapid succession.',on:true},{label:'Mass Caps Filtering',desc:'Filters messages with excessive capital letters.',on:true},{label:'Link Blockers',desc:'Blocks URLs posted by non-whitelisted members.',on:true},{label:'Discord Invite Filter',desc:'Blocks Discord invite links posted by members.',on:true}].map(({label,desc,on})=>(
                <div key={label} className="lp-am-toggle-row"><div className="lp-am-toggle-info"><div className="lp-am-toggle-h4">{label}</div><div className="lp-am-toggle-p">{desc}</div></div><div className="lp-am-switch"><div className={`lp-am-slider ${on?'lp-am-slider--on':''}`}><div className="lp-am-knob"/></div></div></div>
              ))}
            </div>
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title">Blocked Words &amp; Patterns</div>
              <div className="lp-am-bw-input-row"><div className="lp-am-bw-input">Word or regex pattern...</div><button className="lp-am-bw-add-btn">+ Add</button></div>
              <div className="lp-am-bw-chips">{['badword','scam*','/free.nitro/i','offensive'].map(w=>(<div key={w} className="lp-am-bw-chip"><span>{w}</span><X size={11}/></div>))}</div>
            </div>
          </div>
        </div>
      );
      case 'leaderboard': return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar"><div className="lp-automod-dots"><span className="lp-dot lp-dot-r"/><span className="lp-dot lp-dot-y"/><span className="lp-dot lp-dot-g"/></div><span className="lp-dash-titlebar-label">Friday Dashboard — Leaderboard</span></div>
          <div className="lp-dash-body">
            <div className="lp-lb-tabs-mock">
              <span className="lp-lb-tab-mock active"><Star size={11}/>XP Ranking</span>
              <span className="lp-lb-tab-mock">Economy</span>
            </div>
            <div className="lp-lb-list">
              {[
                {rank:1,medal:'🥇',name:'nova_knight',level:42,xp:9400,pct:88},
                {rank:2,medal:'🥈',name:'crystal_void',level:38,xp:7800,pct:72},
                {rank:3,medal:'🥉',name:'blazex99',level:35,xp:6600,pct:61},
                {rank:4,medal:null,name:'lunaris',level:31,xp:5100,pct:47},
                {rank:5,medal:null,name:'axion_drift',level:28,xp:4200,pct:38},
                {rank:6,medal:null,name:'dusk_angel',level:24,xp:3500,pct:29},
              ].map(({rank,medal,name,level,xp,pct})=>(
                <div key={rank} className={`lp-lb-list-row${rank<=3?' top':''}`}>
                  <span className="lp-lb-list-rank">{medal || `#${rank}`}</span>
                  <div className="lp-lb-list-info">
                    <div className="lp-lb-list-name">{name}</div>
                    <div className="lp-lb-list-bar-track"><div className="lp-lb-list-bar-fill" style={{width:`${pct}%`}}/></div>
                  </div>
                  <div className="lp-lb-list-stat">
                    <div className="lp-lb-list-level">Lv. {level}</div>
                    <div className="lp-lb-list-xp">{xp.toLocaleString()} XP</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lp-lb-list-footer">312 members ranked</div>
          </div>
        </div>
      );
      case 'economy': return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar"><div className="lp-automod-dots"><span className="lp-dot lp-dot-r"/><span className="lp-dot lp-dot-y"/><span className="lp-dot lp-dot-g"/></div><span className="lp-dash-titlebar-label">Friday Dashboard — Economy</span></div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-shop-stats-row">{[{label:'Coins in Circulation',value:'4.2M',color:'#00c853'},{label:'Shop Items',value:'12',color:'#f59e0b'},{label:'Transactions Today',value:'847',color:'#3b9dff'}].map(({label,value,color})=>(<div key={label} className="lp-shop-stat-cell"><div className="lp-shop-stat-value" style={{color}}>{value}</div><div className="lp-shop-stat-label">{label}</div></div>))}</div>
            </div>
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>Server Shop<button className="lp-shop-add-btn"><Coins size={11}/> Add Item</button></div>
              <div className="lp-shop-items">{[{name:'VIP Role',price:5000,icon:<Crown size={16}/>,desc:'Exclusive VIP member role'},{name:'Custom Colour',price:2500,icon:<Palette size={16}/>,desc:'Pick your own role colour'},{name:'XP Booster',price:1000,icon:<Zap size={16}/>,desc:'+50 XP on use · consumable'},{name:'Coin Multiplier',price:3000,icon:<Coins size={16}/>,desc:'2× /work pay for 24h'}].map(({name,price,icon,desc})=>(<div key={name} className="lp-shop-item-row"><div className="lp-shop-item-icon">{icon}</div><div className="lp-shop-item-info"><div className="lp-shop-item-name">{name}</div><div className="lp-shop-item-desc">{desc}</div></div><div className="lp-shop-item-price"><Coins size={10} color="#f59e0b"/> {price.toLocaleString()}</div></div>))}</div>
            </div>
          </div>
        </div>
      );
      case 'giveaways': return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar"><div className="lp-automod-dots"><span className="lp-dot lp-dot-r"/><span className="lp-dot lp-dot-y"/><span className="lp-dot lp-dot-g"/></div><span className="lp-dash-titlebar-label">Friday Dashboard — Giveaways</span></div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>Active Giveaways<span className="lp-gw-refresh-btn"><Star size={11}/></span></div>
              {[{prize:'Discord Nitro Classic',winners:1,ends:'Dec 25, 2025, 8:00 PM'},{prize:'$50 Steam Gift Card',winners:2,ends:'Dec 28, 2025, 5:00 PM'}].map(({prize,winners,ends})=>(<div key={prize} className="lp-gw-item"><div className="lp-gw-item-top"><div><div className="lp-gw-item-prize"><Gift size={13} color="#ff9100" style={{flexShrink:0}}/> {prize}</div><div className="lp-gw-item-meta">{winners.toLocaleString()} winner{winners!==1?'s':''} · ends {ends}</div></div></div><div className="lp-gw-item-btns"><button className="lp-gw-btn lp-gw-btn-end">End Now</button><button className="lp-gw-btn">Reroll</button></div></div>))}
            </div>
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title"><Gift size={13} style={{display:'inline',marginRight:'7px',color:'#ff9100'}}/>Launch Giveaway</div>
              <div className="lp-gw-form"><div className="lp-gw-form-group"><label className="lp-gw-label">Prize</label><div className="lp-gw-input-mock">e.g. Discord Nitro</div></div><div className="lp-gw-form-row"><div className="lp-gw-form-group"><label className="lp-gw-label">Duration</label><div className="lp-gw-select-mock">30 Minutes ▾</div></div><div className="lp-gw-form-group"><label className="lp-gw-label">Winners</label><div className="lp-gw-select-mock">1 ▾</div></div></div><div className="lp-gw-form-group"><label className="lp-gw-label">Channel</label><div className="lp-gw-select-mock"># giveaways ▾</div></div><button className="lp-gw-launch-btn"><Gift size={13}/> Launch Giveaway</button></div>
            </div>
          </div>
        </div>
      );
      case 'tickets': return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar"><div className="lp-automod-dots"><span className="lp-dot lp-dot-r"/><span className="lp-dot lp-dot-y"/><span className="lp-dot lp-dot-g"/></div><span className="lp-dash-titlebar-label">Friday Dashboard — Tickets</span></div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel"><div className="lp-tkt-stats-row">{[{label:'Open',value:'4',color:'#3b9dff'},{label:'Resolved',value:'31',color:'#00c853'},{label:'Avg. Close',value:'18m',color:'#f59e0b'}].map(({label,value,color})=>(<div key={label} className="lp-tkt-stat-cell"><div className="lp-tkt-stat-value" style={{color}}>{value}</div><div className="lp-tkt-stat-label">{label}</div></div>))}</div></div>
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title">Open Tickets</div>
              <div className="lp-tkt-list">{[{id:'ticket-0041',user:'nova_knight',topic:'Appeal ban from last week',time:'2m ago'},{id:'ticket-0040',user:'crystal_void',topic:'Cannot access VIP channels',time:'14m ago'},{id:'ticket-0039',user:'blazex99',topic:'Missing coins after trade',time:'1h ago'},{id:'ticket-0038',user:'lunaris',topic:'Wrong role assigned on join',time:'2h ago'}].map(({id,user,topic,time})=>(<div key={id} className="lp-tkt-row"><div className="lp-tkt-row-left"><div className="lp-tkt-avatar">{user[0].toUpperCase()}</div><div className="lp-tkt-info"><div className="lp-tkt-topic">{topic}</div><div className="lp-tkt-meta">{user} · {time}</div></div></div><div className="lp-tkt-id-col"><span className="lp-tkt-id">{id}</span><span className="lp-tkt-status">open</span></div></div>))}</div>
            </div>
          </div>
        </div>
      );
      case 'onboarding': return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar"><div className="lp-automod-dots"><span className="lp-dot lp-dot-r"/><span className="lp-dot lp-dot-y"/><span className="lp-dot lp-dot-g"/></div><span className="lp-dash-titlebar-label">Friday Dashboard — Onboarding</span></div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title">Welcome Message</div>
              <div className="lp-ob-welcome-preview">Welcome to <strong>Nexus Gaming</strong>, <span style={{color:'#38bdf8'}}>@nova_knight</span>! <PartyPopper size={14} style={{display:'inline',verticalAlign:'middle'}}/> You're member <strong>#312</strong>. Head to <span style={{color:'#38bdf8'}}>#get-roles</span> to get started.</div>
              <div className="lp-ob-placeholders">{['{user}','{username}','{server}','{memberCount}'].map(p=>(<span key={p} className="lp-ob-placeholder">{p}</span>))}</div>
            </div>
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>Reaction Roles<span style={{fontSize:'9px',color:'#38bdf8',background:'rgba(56,189,248,0.1)',border:'1px solid rgba(56,189,248,0.2)',borderRadius:'4px',padding:'2px 7px',fontWeight:600}}>5 ROLES</span></div>
              <div className="lp-ob-roles">{[{icon:<Gamepad2 size={13}/>,label:'Gamer',color:'#8b5cf6'},{icon:<Palette size={13}/>,label:'Artist',color:'#ec4899'},{icon:<Monitor size={13}/>,label:'Dev',color:'#3b9dff'},{icon:<Music size={13}/>,label:'Music',color:'#10b981'},{icon:<Megaphone size={13}/>,label:'Announcements',color:'#f59e0b'}].map(({icon,label,color})=>(<div key={label} className="lp-ob-role-chip" style={{borderColor:color+'33',color}}><span>{icon}</span><span>{label}</span></div>))}</div>
            </div>
          </div>
        </div>
      );
      case 'alerts': return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar"><div className="lp-automod-dots"><span className="lp-dot lp-dot-r"/><span className="lp-dot lp-dot-y"/><span className="lp-dot lp-dot-g"/></div><span className="lp-dash-titlebar-label">Friday Dashboard — Alerts</span></div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title" style={{display:'flex',alignItems:'center',gap:'7px'}}><img src="/youtube_logo.png" alt="YouTube" style={{width:15,height:15,objectFit:'contain'}}/> YouTube Alerts</div>
              <div className="lp-alerts-list">{[{name:'Linus Tech Tips',channel:'#tech-alerts',status:'live'},{name:'Fireship',channel:'#dev-alerts',status:'live'},{name:'MKBHD',channel:'#tech-alerts',status:'idle'}].map(({name,channel,status})=>(<div key={name} className="lp-alert-row"><div className="lp-alert-dot" style={{background:status==='live'?'#00c853':'#555'}}/><div className="lp-alert-info"><div className="lp-alert-name">{name}</div><div className="lp-alert-channel">{channel}</div></div><span className="lp-alert-badge" style={{color:status==='live'?'#00c853':'#555',borderColor:status==='live'?'rgba(0,200,83,0.25)':'rgba(85,85,85,0.25)',background:status==='live'?'rgba(0,200,83,0.08)':'rgba(85,85,85,0.08)'}}>{status==='live'?'NEW VIDEO':'WATCHING'}</span></div>))}</div>
            </div>
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title" style={{display:'flex',alignItems:'center',gap:'7px'}}><img src="/twitch_logo.png" alt="Twitch" style={{width:15,height:15,objectFit:'contain'}}/> Twitch Alerts</div>
              <div className="lp-alerts-list">{[{name:'shroud',channel:'#gaming-alerts',status:'live'},{name:'pokimane',channel:'#gaming-alerts',status:'idle'},{name:'HasanAbi',channel:'#stream-alerts',status:'live'}].map(({name,channel,status})=>(<div key={name} className="lp-alert-row"><div className="lp-alert-dot" style={{background:status==='live'?'#9147ff':'#555'}}/><div className="lp-alert-info"><div className="lp-alert-name">{name}</div><div className="lp-alert-channel">{channel}</div></div><span className="lp-alert-badge" style={{color:status==='live'?'#9147ff':'#555',borderColor:status==='live'?'rgba(145,71,255,0.25)':'rgba(85,85,85,0.25)',background:status==='live'?'rgba(145,71,255,0.08)':'rgba(85,85,85,0.08)'}}>{status==='live'?'LIVE NOW':'OFFLINE'}</span></div>))}</div>
            </div>
          </div>
        </div>
      );
      case 'customcmds': return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar"><div className="lp-automod-dots"><span className="lp-dot lp-dot-r"/><span className="lp-dot lp-dot-y"/><span className="lp-dot lp-dot-g"/></div><span className="lp-dash-titlebar-label">Friday Dashboard — Custom Commands</span></div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>Custom Commands<span style={{fontSize:'9px',color:'#10b981',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'4px',padding:'2px 7px',fontWeight:600}}>6 ACTIVE</span></div>
              <div className="lp-cc-list">{[{trigger:'!rules',type:'text',preview:'Please follow our server rules...'},{trigger:'!socials',type:'embed',preview:'Embed · Social Links Card'},{trigger:'!staff',type:'embed',preview:'Embed · Staff Team Card'},{trigger:'!faq',type:'text',preview:'Frequently asked questions...'},{trigger:'!discord',type:'text',preview:'Join our community at discord.gg/...'},{trigger:'!apply',type:'embed',preview:'Embed · Staff Application Form'}].map(({trigger,type,preview})=>(<div key={trigger} className="lp-cc-row"><code className="lp-cc-trigger">{trigger}</code><span className="lp-cc-type" style={{color:type==='embed'?'#8b5cf6':'#10b981',borderColor:type==='embed'?'rgba(139,92,246,0.25)':'rgba(16,185,129,0.25)',background:type==='embed'?'rgba(139,92,246,0.08)':'rgba(16,185,129,0.08)'}}>{type}</span><span className="lp-cc-preview">{preview}</span></div>))}</div>
            </div>
          </div>
        </div>
      );
      case 'auditing': return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar"><div className="lp-automod-dots"><span className="lp-dot lp-dot-r"/><span className="lp-dot lp-dot-y"/><span className="lp-dot lp-dot-g"/></div><span className="lp-dash-titlebar-label">Friday Dashboard — Audit Logs</span></div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title">Recent Message Events</div>
              <div className="lp-audit-list">{[{type:'deleted',user:'blazex99',content:'free nitro @ discord.gg/scam',time:'1m ago',color:'#f43f5e'},{type:'edited',user:'lunaris',content:'hey guys → hey everyone!',time:'4m ago',color:'#f59e0b'},{type:'deleted',user:'axion_drift',content:'FOLLOW ME ON TWITCH !!!!!!',time:'9m ago',color:'#f43f5e'},{type:'edited',user:'dusk_angel',content:'tomrrow → tomorrow at 8pm',time:'12m ago',color:'#f59e0b'}].map(({type,user,content,time,color})=>(<div key={user+time} className="lp-audit-row"><span className="lp-audit-badge" style={{color,borderColor:color+'33',background:color+'10'}}>{type}</span><div className="lp-audit-info"><span className="lp-audit-user">{user}</span><span className="lp-audit-content">{content}</span></div><span className="lp-audit-time">{time}</span></div>))}</div>
            </div>
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title">Mod Stats — This Week</div>
              <div className="lp-modstats-row">{[{label:'Warns',value:14,color:'#f59e0b'},{label:'Timeouts',value:6,color:'#3b9dff'},{label:'Kicks',value:2,color:'#ff9100'},{label:'Bans',value:1,color:'#f43f5e'}].map(({label,value,color})=>(<div key={label} className="lp-modstat-cell"><div className="lp-modstat-value" style={{color}}>{value.toLocaleString()}</div><div className="lp-modstat-label">{label}</div></div>))}</div>
            </div>
          </div>
        </div>
      );
      case 'stocks': return (
        <div className="lp-dash-card">
          <div className="lp-dash-titlebar"><div className="lp-automod-dots"><span className="lp-dot lp-dot-r"/><span className="lp-dot lp-dot-y"/><span className="lp-dot lp-dot-g"/></div><span className="lp-dash-titlebar-label">Friday Dashboard — Stocks & Portfolio</span></div>
          <div className="lp-dash-body">
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>Market Overview<span style={{fontSize:'9px',color:'#a78bfa',background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:'4px',padding:'2px 7px',fontWeight:600}}>LIVE</span></div>
              <div style={{display:'flex',flexDirection:'column',gap:'6px',marginTop:'8px'}}>{[{sym:'TECH',price:1240,change:+4.2,up:true},{sym:'GAME',price:870,change:-1.8,up:false},{sym:'FOOD',price:530,change:+2.1,up:true},{sym:'MEME',price:310,change:+11.4,up:true},{sym:'BANK',price:990,change:-0.6,up:false}].map(({sym,price,change,up})=>(<div key={sym} style={{display:'flex',alignItems:'center',gap:'8px',padding:'5px 8px',borderRadius:'6px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)'}}><code style={{fontSize:'10px',fontWeight:700,color:'#a78bfa',minWidth:'36px'}}>{sym}</code><span style={{fontSize:'11px',color:'#e2e8f0',flex:1}}>{price.toLocaleString()} <span style={{fontSize:'9px',color:'#64748b'}}>coins</span></span><span style={{fontSize:'10px',fontWeight:600,color:up?'#00c853':'#f43f5e'}}>{up?'▲':'▼'} {Math.abs(change)}%</span></div>))}</div>
            </div>
            <div className="lp-dash-chart-panel">
              <div className="lp-dash-chart-title">nova_knight's Portfolio</div>
              <div style={{display:'flex',flexDirection:'column',gap:'5px',marginTop:'8px'}}>{[{sym:'TECH',shares:3,value:3720,pnl:+18.2},{sym:'MEME',shares:10,value:3100,pnl:+42.6},{sym:'BANK',shares:2,value:1980,pnl:-3.1}].map(({sym,shares,value,pnl})=>(<div key={sym} style={{display:'flex',alignItems:'center',gap:'8px',padding:'5px 8px',borderRadius:'6px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)'}}><code style={{fontSize:'10px',fontWeight:700,color:'#a78bfa',minWidth:'36px'}}>{sym}</code><span style={{fontSize:'10px',color:'#94a3b8',flex:1}}>{shares} shares · {value.toLocaleString()} coins</span><span style={{fontSize:'10px',fontWeight:600,color:pnl>0?'#00c853':'#f43f5e'}}>{pnl>0?'+':''}{pnl}%</span></div>))}</div>
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

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
            <RouterLink to="/leaderboard">Leaderboard</RouterLink>
            <RouterLink to="/guide">Guide</RouterLink>
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
            <RouterLink to="/leaderboard" onClick={() => setMobileMenuOpen(false)}>Leaderboard</RouterLink>
            <RouterLink to="/guide" onClick={() => setMobileMenuOpen(false)}>Guide</RouterLink>
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
                <span className="lp-stat-num">100+</span>
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
                Three built-in AI commands powered by Gemini — zero config, available to every member from day one.
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

          {/* ── Header ── */}
          <div className="lp-how-header">
            <div className="lp-section-eyebrow">
              <span className="lp-section-eyebrow-line" />
              <span className="lp-section-label">HOW IT WORKS</span>
            </div>
            <h2 className="lp-section-title">Up and Running in Minutes</h2>
            <p className="lp-section-desc">
              No complicated setup. No technical knowledge required. Just invite, configure, and watch Friday work.
            </p>
          </div>

          {/* ── Steps ── */}
          <div className="lp-how-steps">
            {STEPS.map(({ Icon, number, title, desc }, i) => (
              <div key={number} className="lp-how-step-card">
                <div className="lp-how-step-num">{number}</div>
                <div className="lp-how-step-icon-wrap">
                  <Icon size={20} color="var(--lp-primary)" />
                </div>
                <h3 className="lp-how-step-title">{title}</h3>
                <p className="lp-how-step-desc">{desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="lp-how-step-arrow"><ArrowRight size={16} color="rgba(59,157,255,0.35)" /></div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="lp-preview" id="preview">
        <div className="lp-container">
          <div className="lp-how-header">
            <div className="lp-section-eyebrow">
              <span className="lp-section-eyebrow-line" />
              <span className="lp-section-label">DASHBOARD PREVIEW</span>
            </div>
            <h2 className="lp-section-title">See Friday in Action</h2>
            <p className="lp-section-desc">
              A live look at the Friday dashboard — click any feature to see it in action.
            </p>
          </div>

          <div className="lp-preview-split">
            {/* Left — sticky feature list */}
            <div className="lp-preview-list">
              {PREVIEW_ITEMS.map(({ id, label, Icon, color }) => (
                <button
                  key={id}
                  className={`lp-preview-list-btn ${activePreview === id ? 'active' : ''}`}
                  onClick={() => setActivePreview(id)}
                  style={activePreview === id ? { color, borderColor: color + '44', background: color + '0d' } : {}}
                >
                  <div className="lp-preview-list-icon" style={activePreview === id ? { background: color + '18', color } : {}}>
                    <Icon size={15} />
                  </div>
                  <span>{label}</span>
                  {activePreview === id && <ChevronRight size={13} className="lp-preview-list-arrow" />}
                </button>
              ))}
            </div>

            {/* Right — active preview */}
            <div className="lp-preview-active">
              <div className="lp-preview-active-card">
                {renderCard(activePreview)}
              </div>
              <div className="lp-preview-active-text">
                {(() => {
                  const p = PREVIEW_ITEMS.find(x => x.id === activePreview);
                  if (!p) return null;
                  return (
                    <>
                      <div className="lp-section-eyebrow" style={{ marginBottom: '16px' }}>
                        <span className="lp-section-eyebrow-line" />
                        <span className="lp-section-label" style={{ color: p.color }}>{p.eyebrow}</span>
                      </div>
                      <h3 className="lp-preview-text-title">{p.title}</h3>
                      <p className="lp-preview-text-desc">{p.desc}</p>
                      <ul className="lp-preview-bullets">
                        {p.bullets.map((b, i) => (
                          <li key={i}><Check size={14} color={p.color} /><span>{b}</span></li>
                        ))}
                      </ul>
                    </>
                  );
                })()}
              </div>
            </div>
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
