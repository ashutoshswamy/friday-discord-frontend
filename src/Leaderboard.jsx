import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, ArrowLeft, RefreshCw, Search, ChevronRight } from 'lucide-react';
import './Leaderboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';
const DISCORD_CDN = 'https://cdn.discordapp.com';

function guildIconUrl(id, icon) {
  if (!icon) return null;
  return `${DISCORD_CDN}/icons/${id}/${icon}.webp?size=64`;
}

function xpForNextLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
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

function UserAvatar({ username, fallbackClass }) {
  const initial = (username || '?').slice(0, 1).toUpperCase();
  return <div className={fallbackClass}>{initial}</div>;
}

const RANK_CLASS = ['', 'gold', 'silver', 'bronze'];

export default function Leaderboard({ token, user, onLogin }) {
  const [servers, setServers]           = useState([]);
  const [serversLoading, setServersLoading] = useState(false);
  const [selectedGuild, setSelectedGuild]   = useState(null);
  const [lbData, setLbData]             = useState(null);
  const [lbLoading, setLbLoading]       = useState(false);
  const [lbError, setLbError]           = useState(null);
  const [tab, setTab]                   = useState('xp');
  const [search, setSearch]             = useState('');

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
    setTab('xp');
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
      {/* Nav */}
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

      {/* Main */}
      <main className="lb-main">
        {/* Hero */}
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

        {/* Not logged in */}
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

        {/* Server picker */}
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

        {/* Leaderboard view */}
        {token && selectedGuild && (
          <div>
            {/* View header */}
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
                    {lbData.guild.memberCount?.toLocaleString()} members
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

            {/* Tabs */}
            <div className="lb-tabs">
              <button
                className={`lb-tab${tab === 'xp' ? ' active' : ''}`}
                onClick={() => setTab('xp')}
              >
                <Star size={13} />
                XP Ranking
              </button>
              <button
                className={`lb-tab${tab === 'economy' ? ' active' : ''}`}
                onClick={() => setTab('economy')}
              >
                <img src="/fridaycoin.png" alt="coin" style={{ width: 14, height: 14, objectFit: 'contain' }} />
                Economy
              </button>
            </div>

            {/* Loading */}
            {lbLoading && (
              <div className="lb-state">
                <div className="lb-spinner" />
                Loading leaderboard...
              </div>
            )}

            {/* Error */}
            {lbError && !lbLoading && (
              <div className="lb-error-card">{lbError}</div>
            )}

            {/* Entries */}
            {lbData && !lbLoading && (() => {
              const entries = tab === 'xp' ? (lbData.xp || []) : (lbData.economy || []);

              if (!entries.length) {
                return (
                  <div className="glass-panel lb-state">
                    {tab === 'xp'
                      ? 'No XP data yet. Members need to chat to start earning XP!'
                      : 'No economy data yet. Use the economy commands to get started!'}
                  </div>
                );
              }

              return (
                <div className="lb-entries">
                  {entries.map((entry, i) => {
                    const rank = entry.rank || i + 1;
                    const rankClass = RANK_CLASS[rank] || '';
                    const xpPct = tab === 'xp'
                      ? Math.min(1, (entry.xp || 0) / (xpForNextLevel(entry.level) || 1))
                      : 0;

                    return (
                      <div key={entry.userId} className={`lb-entry${rankClass ? ` top-${rank}` : ''}`}>
                        <div className={`lb-rank${rankClass ? ` ${rankClass}` : ''}`}>
                          #{rank}
                        </div>

                        <UserAvatar
                          username={entry.username}
                          fallbackClass="lb-avatar-fallback"
                        />

                        <div className="lb-user-info">
                          <div className="lb-username">
                            {entry.nickname || entry.username}
                          </div>
                          {entry.nickname && (
                            <div className="lb-user-tag">@{entry.username}</div>
                          )}
                        </div>

                        <div className="lb-stat">
                          {tab === 'xp' ? (
                            <>
                              <div className="lb-stat-main">Lv. {entry.level}</div>
                              <div className="lb-stat-sub">{(entry.xp || 0).toLocaleString()} XP</div>
                              <div className="lb-xp-bar-track">
                                <div
                                  className="lb-xp-bar-fill"
                                  style={{ width: `${xpPct * 100}%` }}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="lb-stat-main" style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                                {(entry.coins || 0).toLocaleString()}
                                <img src="/fridaycoin.png" alt="coin" style={{ width: 14, height: 14, objectFit: 'contain' }} />
                              </div>
                              <div className="lb-stat-sub">coins</div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="lb-footer">
        <p className="lb-footer-text">
          <Link to="/">Friday</Link> · <Link to="/commands">Commands</Link> · <Link to="/privacy">Privacy</Link>
        </p>
      </footer>
    </div>
  );
}
