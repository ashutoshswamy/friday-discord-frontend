import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, Star, Coins as CoinsIcon, ChevronRight, Search, ArrowLeft, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || '1508180727953359008';

const DISCORD_CDN = 'https://cdn.discordapp.com';

function guildIconUrl(guildId, icon) {
  if (!icon) return null;
  return `${DISCORD_CDN}/icons/${guildId}/${icon}.webp?size=64`;
}

function GuildAvatar({ id, icon, name, size = 40 }) {
  const src = guildIconUrl(id, icon);
  const initials = (name || '?').replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || '?';
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 10, background: 'var(--surface2, #1e1f2e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: 'var(--primary, #7c3aed)', flexShrink: 0,
    }}>{initials}</div>
  );
}

function UserAvatar({ avatar, username, size = 36 }) {
  const initials = (username || '?').slice(0, 1).toUpperCase();
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={username}
        width={size}
        height={size}
        style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, background: 'var(--surface2, #1e1f2e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700, color: 'var(--primary, #7c3aed)', flexShrink: 0,
    }}>{initials}</div>
  );
}

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

function RankBadge({ rank }) {
  const color = rank <= 3 ? MEDAL_COLORS[rank - 1] : 'rgba(255,255,255,0.25)';
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: rank <= 3 ? `${color}18` : 'rgba(255,255,255,0.04)',
      border: `1px solid ${rank <= 3 ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
      fontSize: 13, fontWeight: 700, color: rank <= 3 ? color : 'rgba(255,255,255,0.4)',
    }}>
      #{rank}
    </div>
  );
}

export default function Leaderboard({ token, user, onLogin }) {
  const navigate = useNavigate();
  const [servers, setServers] = useState([]);
  const [serversLoading, setServersLoading] = useState(false);
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [lbData, setLbData] = useState(null);
  const [lbLoading, setLbLoading] = useState(false);
  const [lbError, setLbError] = useState(null);
  const [tab, setTab] = useState('xp');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) return;
    setServersLoading(true);
    fetch(`${API_BASE}/leaderboard/servers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setServers(Array.isArray(data) ? data : []);
        setServersLoading(false);
      })
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

  const s = {
    page: {
      minHeight: '100vh',
      background: 'var(--bg, #0f0c1a)',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
    },
    nav: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(15,12,26,0.95)', backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 100,
    },
    navBrand: {
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 18, fontWeight: 800, letterSpacing: '0.05em',
      color: '#fff', textDecoration: 'none',
    },
    container: { maxWidth: 740, margin: '0 auto', padding: '40px 20px' },
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link to="/" style={s.navBrand}>
          <img src="/logo.png" alt="Friday" style={{ width: 28, height: 28, borderRadius: 6 }} />
          FRIDAY
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user && (
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              {user.username}
            </span>
          )}
          {!user && (
            <button
              onClick={handleLogin}
              style={{
                background: '#5865F2', color: '#fff', border: 'none', borderRadius: 8,
                padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Login with Discord
            </button>
          )}
        </div>
      </nav>

      <div style={s.container}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 20, padding: '6px 16px', fontSize: 12, fontWeight: 600,
            color: '#a78bfa', letterSpacing: '0.08em', marginBottom: 16,
          }}>
            <Trophy size={12} />
            LEADERBOARD
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 10px', lineHeight: 1.15 }}>
            Server Rankings
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, margin: 0 }}>
            View XP and Economy leaderboards for your servers
          </p>
        </div>

        {/* Not logged in */}
        {!token && (
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 48, textAlign: 'center',
          }}>
            <Trophy size={48} style={{ color: '#7c3aed', opacity: 0.6, marginBottom: 16 }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Login to view leaderboards</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 24px' }}>
              Connect your Discord account to see rankings for your servers.
            </p>
            <button
              onClick={handleLogin}
              style={{
                background: '#5865F2', color: '#fff', border: 'none', borderRadius: 10,
                padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Login with Discord
            </button>
          </div>
        )}

        {/* Server picker */}
        {token && !selectedGuild && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '10px 14px',
              }}>
                <Search size={15} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search servers..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    background: 'none', border: 'none', outline: 'none', width: '100%',
                    color: '#fff', fontSize: 14,
                  }}
                />
              </div>
            </div>

            {serversLoading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>
                Loading servers...
              </div>
            ) : filteredServers.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: 60,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, color: 'rgba(255,255,255,0.35)',
              }}>
                {search ? 'No servers match your search.' : 'No mutual servers found. Make sure Friday is in your server.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredServers.map(guild => (
                  <button
                    key={guild.id}
                    onClick={() => selectGuild(guild)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                      textAlign: 'left', transition: 'all 0.15s', color: '#fff',
                      width: '100%',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    }}
                  >
                    <GuildAvatar id={guild.id} icon={guild.icon} name={guild.name} size={44} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {guild.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                        {guild.memberCount?.toLocaleString()} members
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Leaderboard view */}
        {token && selectedGuild && (
          <div>
            {/* Back + guild header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <button
                onClick={() => { setSelectedGuild(null); setLbData(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, padding: '8px 12px', color: 'rgba(255,255,255,0.6)',
                  fontSize: 13, cursor: 'pointer', flexShrink: 0,
                }}
              >
                <ArrowLeft size={13} /> Back
              </button>
              <GuildAvatar id={selectedGuild.id} icon={selectedGuild.icon} name={selectedGuild.name} size={36} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedGuild.name}
                </div>
                {lbData && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                    {lbData.guild.memberCount?.toLocaleString()} members
                  </div>
                )}
              </div>
              <button
                onClick={() => fetchLeaderboard(selectedGuild.id)}
                disabled={lbLoading}
                style={{
                  marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, padding: '7px 11px', color: 'rgba(255,255,255,0.4)',
                  fontSize: 12, cursor: 'pointer', flexShrink: 0,
                }}
              >
                <RefreshCw size={12} style={{ animation: lbLoading ? 'spin 1s linear infinite' : 'none' }} />
                Refresh
              </button>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: 4,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: 4, marginBottom: 20,
            }}>
              {[
                { id: 'xp', label: 'XP Ranking', icon: <Star size={13} /> },
                { id: 'economy', label: 'Economy', icon: <span style={{ fontSize: 13 }}>🪙</span> },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: tab === t.id ? 'rgba(124,58,237,0.2)' : 'none',
                    border: tab === t.id ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent',
                    borderRadius: 7, padding: '8px 12px', color: tab === t.id ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Loading / error */}
            {lbLoading && (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>
                Loading leaderboard...
              </div>
            )}
            {lbError && !lbLoading && (
              <div style={{
                textAlign: 'center', padding: 40,
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: 12, color: '#f87171', fontSize: 14,
              }}>
                {lbError}
              </div>
            )}

            {/* Leaderboard entries */}
            {lbData && !lbLoading && (() => {
              const entries = tab === 'xp' ? (lbData.xp || []) : (lbData.economy || []);
              if (!entries.length) {
                return (
                  <div style={{
                    textAlign: 'center', padding: 60,
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16, color: 'rgba(255,255,255,0.3)',
                  }}>
                    No data yet. Members need to chat to earn XP!
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {entries.map((entry, i) => {
                    const rank = entry.rank || i + 1;
                    const isTop3 = rank <= 3;
                    const medalColor = isTop3 ? MEDAL_COLORS[rank - 1] : null;

                    return (
                      <div
                        key={entry.userId}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '12px 16px', borderRadius: 12,
                          background: isTop3
                            ? `linear-gradient(135deg, ${medalColor}08, transparent)`
                            : 'rgba(255,255,255,0.025)',
                          border: `1px solid ${isTop3 ? `${medalColor}20` : 'rgba(255,255,255,0.06)'}`,
                          transition: 'all 0.1s',
                        }}
                      >
                        <RankBadge rank={rank} />
                        <UserAvatar avatar={entry.avatar} username={entry.username} size={36} />
                        <div
                          style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', display: 'none' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontWeight: isTop3 ? 700 : 500,
                            fontSize: 14,
                            color: isTop3 ? '#fff' : 'rgba(255,255,255,0.8)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {entry.nickname || entry.username}
                          </div>
                          {entry.nickname && (
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                              @{entry.username}
                            </div>
                          )}
                        </div>

                        {tab === 'xp' ? (
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{
                              fontSize: 15, fontWeight: 700,
                              color: isTop3 ? medalColor : 'rgba(255,255,255,0.7)',
                            }}>
                              Lv. {entry.level}
                            </div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                              {(entry.xp || 0).toLocaleString()} XP
                            </div>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{
                              fontSize: 15, fontWeight: 700,
                              color: isTop3 ? medalColor : 'rgba(255,255,255,0.7)',
                              display: 'flex', alignItems: 'center', gap: 5,
                            }}>
                              {(entry.coins || 0).toLocaleString()}
                              <span style={{ fontSize: 13 }}>🪙</span>
                            </div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                              coins
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
