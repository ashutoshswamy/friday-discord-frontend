import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, RefreshCw, Search, ChevronRight, Zap, Users, Coins } from 'lucide-react';
import './Leaderboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';
const DISCORD_CDN = 'https://cdn.discordapp.com';

function guildIconUrl(id, icon) {
  if (!icon) return null;
  return `${DISCORD_CDN}/icons/${id}/${icon}.webp?size=64`;
}

function userAvatarUrl(userId, avatar) {
  if (avatar) return `${DISCORD_CDN}/avatars/${userId}/${avatar}.webp?size=64`;
  const index = Number(BigInt(userId) % 6n);
  return `${DISCORD_CDN}/embed/avatars/${index}.png`;
}

function UserAvatar({ userId, avatar, displayName, size = 40, fontSize = 16, ringStyle, color }) {
  const src = userAvatarUrl(userId, avatar);
  const initial = (displayName || '?').slice(0, 1).toUpperCase();
  const [failed, setFailed] = React.useState(false);

  return failed ? (
    <div style={{ width: size, height: size, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize, color: color || 'var(--primary)', background: 'rgba(59,157,255,0.1)', flexShrink: 0, ...ringStyle }}>
      {initial}
    </div>
  ) : (
    <img
      src={src}
      alt={displayName}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, display: 'block', ...ringStyle }}
      onError={() => setFailed(true)}
    />
  );
}

function xpForNextLevel(level) {
  return level * 150 + 100;
}

function GuildIcon({ id, icon, name, className, fallbackClass }) {
  const src = guildIconUrl(id, icon);
  const initials = (name || '?').replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || '?';
  if (src) {
    return (
      <>
        <img
          src={src}
          alt={name}
          className={className}
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
          }}
        />
        <div className={fallbackClass} style={{ display: 'none' }}>{initials}</div>
      </>
    );
  }
  return <div className={fallbackClass}>{initials}</div>;
}

const podiumColors = [
  { glow: '#f59e0b', ring: 'linear-gradient(135deg,#f59e0b,#fcd34d)', badge: '#f59e0b', label: 'GOLD',   num: '1' },
  { glow: '#94a3b8', ring: 'linear-gradient(135deg,#94a3b8,#cbd5e1)', badge: '#94a3b8', label: 'SILVER', num: '2' },
  { glow: '#b45309', ring: 'linear-gradient(135deg,#b45309,#d97706)', badge: '#b45309', label: 'BRONZE', num: '3' },
];

function PodiumCard({ entry, rank, accent }) {
  const isXp = accent === 'xp';
  const pc = podiumColors[rank];
  const needed = xpForNextLevel(entry.level || 0);
  const pct = Math.min(100, Math.floor(((entry.xp || 0) / needed) * 100));
  const displayName = entry.nickname || entry.username;
  const avatarSize = rank === 0 ? 72 : 58;

  return (
    <div style={{ position: 'relative', flex: rank === 0 ? '0 0 38%' : '0 0 29%', padding: '20px 16px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: `1px solid ${pc.glow}30`, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', boxShadow: `0 0 28px ${pc.glow}18, inset 0 1px 0 ${pc.glow}20`, order: rank === 0 ? 0 : rank === 1 ? -1 : 1 }}>
      <div style={{ position: 'absolute', top: '-12px', right: '8px', fontSize: rank === 0 ? '110px' : '88px', fontWeight: 900, fontFamily: 'var(--font-display)', color: `${pc.glow}10`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{pc.num}</div>
      <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '9px', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '1.5px', color: pc.badge, background: `${pc.glow}18`, padding: '2px 7px', borderRadius: '20px', border: `1px solid ${pc.glow}40` }}>{pc.label}</div>
      <div style={{ position: 'relative', marginTop: '8px' }}>
        <div style={{ width: avatarSize, height: avatarSize, borderRadius: '50%', padding: '2px', background: pc.ring, flexShrink: 0 }}>
          <UserAvatar
            userId={entry.userId}
            avatar={entry.avatar}
            displayName={displayName}
            size={avatarSize - 4}
            fontSize={rank === 0 ? 24 : 20}
            color={pc.badge}
            ringStyle={{ border: 'none' }}
          />
        </div>
        <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', background: pc.ring, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, color: '#000', fontFamily: 'var(--font-display)' }}>{pc.num}</div>
      </div>
      <div style={{ fontWeight: 700, fontSize: rank === 0 ? '15px' : '13px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>{displayName}</div>
      {isXp ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: rank === 0 ? '22px' : '18px', fontWeight: 900, color: '#8b5cf6', letterSpacing: '-0.5px' }}>LVL {entry.level || 0}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{(entry.xp || 0).toLocaleString()} XP</div>
          <div style={{ width: '100%', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginTop: '2px' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#8b5cf6,#a78bfa)', borderRadius: '2px' }} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-display)', fontSize: rank === 0 ? '22px' : '18px', fontWeight: 900, color: '#00c853', letterSpacing: '-0.5px' }}>
          <Coins size={rank === 0 ? 18 : 14} />
          {(entry.coins || 0).toLocaleString()}
        </div>
      )}
    </div>
  );
}

function RankRow({ entry, rank, accent }) {
  const isXp = accent === 'xp';
  const needed = xpForNextLevel(entry.level || 0);
  const pct = Math.min(100, Math.floor(((entry.xp || 0) / needed) * 100));
  const displayName = entry.nickname || entry.username;

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '6px', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ width: '26px', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right', flexShrink: 0, letterSpacing: '0.5px' }}>#{rank + 1}</div>
      <UserAvatar
        userId={entry.userId}
        avatar={entry.avatar}
        displayName={displayName}
        size={28}
        fontSize={12}
        ringStyle={{ border: '1.5px solid var(--border)' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '12.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
        {isXp && (
          <div style={{ width: '80px', height: '2px', borderRadius: '1px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: '3px' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#8b5cf6,#a78bfa)' }} />
          </div>
        )}
      </div>
      {isXp ? (
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: '#8b5cf6' }}>LVL {entry.level || 0}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>{(entry.xp || 0).toLocaleString()} xp</div>
        </div>
      ) : (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: '#00c853' }}>
          <Coins size={11} />{(entry.coins || 0).toLocaleString()}
        </div>
      )}
    </div>
  );
}

function BoardPanel({ entries, accent }) {
  const isXp = accent === 'xp';
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        {isXp ? <Zap size={16} color="#8b5cf6" /> : <Coins size={16} color="#00c853" />}
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', color: isXp ? '#8b5cf6' : '#00c853' }}>
          {isXp ? 'XP Rankings' : 'Economy Rankings'}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
          <Users size={11} />{entries.length}
        </div>
      </div>

      {top3.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', justifyContent: 'center', minHeight: '160px' }}>
          {top3.map((entry, i) => <PodiumCard key={entry.userId} entry={entry} rank={i} accent={accent} />)}
        </div>
      )}

      {rest.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '1.5px', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 12px 6px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
            Ranked 4–{entries.length}
          </div>
          {rest.map((entry, i) => <RankRow key={entry.userId} entry={entry} rank={i + 3} accent={accent} />)}
        </div>
      )}

      {entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '13px' }}>No data yet.</div>
      )}
    </div>
  );
}

export default function Leaderboard({ token, user, onLogin }) {
  const [servers, setServers]               = useState([]);
  const [serversLoading, setServersLoading] = useState(false);
  const [selectedGuild, setSelectedGuild]   = useState(null);
  const [lbData, setLbData]                 = useState(null);
  const [lbLoading, setLbLoading]           = useState(false);
  const [lbError, setLbError]               = useState(null);
  const [search, setSearch]                 = useState('');

  useEffect(() => {
    if (!token) return;
    setServersLoading(true);
    fetch(`${API_BASE}/leaderboard/servers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setServers(Array.isArray(data) ? data : []); setServersLoading(false); })
      .catch(() => setServersLoading(false));
  }, [token]);

  const fetchLeaderboard = (guildId) => {
    setLbLoading(true);
    setLbError(null);
    fetch(`${API_BASE}/leaderboard/${guildId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) { setLbError(data.error); setLbLoading(false); return; }
        setLbData(data);
        setLbLoading(false);
      })
      .catch(() => { setLbError('Failed to load leaderboard.'); setLbLoading(false); });
  };

  const selectGuild = (guild) => {
    setSelectedGuild(guild);
    setLbData(null);
    fetchLeaderboard(guild.id);
  };

  const handleLogin = () => {
    sessionStorage.setItem('oauth_redirect', '/leaderboard');
    onLogin();
  };

  const filteredServers = servers.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const discordIcon = (
    <svg width="16" height="12" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
      <path d="M20.317 1.492a19.825 19.825 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.294 18.294 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.093-.32 10.555.099 14.961a.08.08 0 0 0 .031.055 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.278c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );

  return (
    <div className="lb-root">
      <nav className="lb-nav">
        <div className="lb-nav-inner">
          <Link to="/" className="lb-nav-brand">
            <img src="/logo.png" alt="Friday" className="lb-nav-logo" />
            <span className="lb-nav-name">FRIDAY</span>
          </Link>
          {user ? (
            <div className="lb-nav-user">
              {user.avatar ? (
                <img
                  src={`${DISCORD_CDN}/avatars/${user.id}/${user.avatar}.webp?size=32`}
                  alt={user.username}
                  className="lb-nav-avatar"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ) : null}
              <span className="lb-nav-username">{user.username}</span>
            </div>
          ) : (
            <button className="lb-nav-login-btn" onClick={handleLogin}>
              {discordIcon}
              Login
            </button>
          )}
        </div>
      </nav>

      <main className={`lb-main${selectedGuild ? ' lb-main--wide' : ''}`}>
        <div className="lb-hero">
          <div className="lb-hero-pill">
            <Trophy size={11} />
            Leaderboard
          </div>
          <h1 className="lb-hero-title">
            Server <span>Rankings</span>
          </h1>
          <p className="lb-hero-sub">
            View XP and Economy leaderboards for your Discord servers
          </p>
        </div>

        {!token && (
          <div className="glass-panel lb-login-card">
            <div className="lb-login-icon">
              <Trophy size={30} />
            </div>
            <h2 className="lb-login-title">Login to view leaderboards</h2>
            <p className="lb-login-desc">
              Connect your Discord account to see rankings for servers you're in.
            </p>
            <button className="lb-discord-btn" onClick={handleLogin}>
              {discordIcon}
              Continue with Discord
            </button>
          </div>
        )}

        {token && !selectedGuild && (
          <div>
            <div className="lb-picker-header">
              <div className="lb-search-wrap">
                <Search size={14} className="lb-search-icon" />
                <input
                  type="text"
                  className="lb-search-input"
                  placeholder="Search your servers..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            {serversLoading ? (
              <div className="lb-state">
                <div className="lb-spinner" />
                Loading your servers...
              </div>
            ) : filteredServers.length === 0 ? (
              <div className="glass-panel lb-empty">
                {search
                  ? 'No servers match your search.'
                  : 'No mutual servers found. Make sure Friday is added to your server.'}
              </div>
            ) : (
              <div className="lb-server-list">
                {filteredServers.map(guild => (
                  <button key={guild.id} className="lb-server-btn" onClick={() => selectGuild(guild)}>
                    <GuildIcon
                      id={guild.id}
                      icon={guild.icon}
                      name={guild.name}
                      className="lb-server-icon"
                      fallbackClass="lb-server-icon-fallback"
                    />
                    <div className="lb-server-info">
                      <div className="lb-server-name">{guild.name}</div>
                      <div className="lb-server-meta">
                        {guild.memberCount?.toLocaleString()} members
                      </div>
                    </div>
                    <ChevronRight size={15} className="lb-server-chevron" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {token && selectedGuild && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="lb-view-header">
              <button className="lb-back-btn" onClick={() => { setSelectedGuild(null); setLbData(null); }}>
                <ArrowLeft size={13} />
                Back
              </button>
              <GuildIcon
                id={selectedGuild.id}
                icon={selectedGuild.icon}
                name={selectedGuild.name}
                className="lb-guild-icon"
                fallbackClass="lb-guild-icon-fallback"
              />
              <div className="lb-guild-info">
                <div className="lb-guild-name">{selectedGuild.name}</div>
                {lbData && (
                  <div className="lb-guild-meta">
                    {lbData.guild?.memberCount?.toLocaleString()} members
                  </div>
                )}
              </div>
              <button
                className="lb-refresh-btn"
                onClick={() => fetchLeaderboard(selectedGuild.id)}
                disabled={lbLoading}
              >
                <RefreshCw size={12} className={lbLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {lbLoading && (
              <div className="lb-state">
                <div className="lb-spinner" />
                Loading leaderboard...
              </div>
            )}

            {lbError && !lbLoading && (
              <div className="lb-error-card">{lbError}</div>
            )}

            {lbData && !lbLoading && (() => {
              const xpEntries   = lbData.xp      || [];
              const coinEntries = lbData.economy  || [];

              const totalXp    = xpEntries.reduce((s, e) => s + (e.xp || 0), 0);
              const totalCoins = coinEntries.reduce((s, e) => s + (e.coins || 0), 0);
              const maxLevel   = xpEntries.length > 0 ? Math.max(...xpEntries.map(e => e.level || 0)) : 0;
              const active     = xpEntries.filter(e => (e.xp || 0) > 0).length;

              return (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    {[
                      { label: 'Total XP',          value: totalXp.toLocaleString(),    Icon: Zap,    color: '#8b5cf6' },
                      { label: 'Coins Circulation',  value: totalCoins.toLocaleString(), Icon: Coins,  color: '#00c853' },
                      { label: 'Peak Level',         value: `Lv. ${maxLevel}`,           Icon: Trophy, color: '#f59e0b' },
                      { label: 'Active Members',     value: active.toString(),           Icon: Users,  color: '#3b9dff' },
                    ].map(({ label, value, Icon: I, color }) => (
                      <div key={label} style={{ background: 'var(--bg-card)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <I size={15} color={color} />
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px' }}>{label}</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color, letterSpacing: '-0.5px' }}>{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <BoardPanel entries={xpEntries}   accent="xp"    />
                    <BoardPanel entries={coinEntries} accent="coins" />
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </main>

      <footer className="lb-footer">
        <p className="lb-footer-text">
          <Link to="/">Friday</Link> · <Link to="/commands">Commands</Link> · <Link to="/privacy">Privacy</Link>
        </p>
      </footer>
    </div>
  );
}
