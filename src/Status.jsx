import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Activity, Server, Users, Zap, Terminal, RefreshCw,
  CheckCircle2, XCircle, Clock, Hash, ArrowLeft,
} from 'lucide-react';
import Footer from './Footer';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

function formatUptime(ms) {
  if (!ms || ms <= 0) return '—';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (parts.length === 0) parts.push(`${s % 60}s`);
  return parts.join(' ');
}

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

export default function Status() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [countdown, setCountdown] = useState(30);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/status`);
      const json = await res.json();
      setData(json);
      setLastFetched(new Date());
      setCountdown(30);
    } catch {
      setData({ online: false, error: 'Cannot reach API' });
      setCountdown(30);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  useEffect(() => {
    const interval = setInterval(fetch_, 30_000);
    return () => clearInterval(interval);
  }, [fetch_]);

  useEffect(() => {
    const tick = setInterval(() => setCountdown(c => (c <= 1 ? 30 : c - 1)), 1000);
    return () => clearInterval(tick);
  }, [lastFetched]);

  const online = data?.online ?? false;
  const stats = data?.stats ?? {};
  const bot = data?.bot ?? null;

  const latencyColor = stats.latencyMs < 0 ? '#546b87'
    : stats.latencyMs < 80 ? '#00e676'
    : stats.latencyMs < 200 ? '#ff9100'
    : '#ff1744';

  const statCards = [
    { icon: <Server size={22} />, label: 'Servers', value: stats.guildCount != null ? formatNumber(stats.guildCount) : '—', accent: '#3b9dff' },
    { icon: <Users size={22} />, label: 'Members', value: stats.memberCount != null ? formatNumber(stats.memberCount) : '—', accent: '#8b5cf6' },
    { icon: <Hash size={22} />, label: 'Commands', value: stats.commandCount != null ? String(stats.commandCount) : '—', accent: '#00c853' },
    { icon: <Clock size={22} />, label: 'Uptime', value: formatUptime(stats.uptimeMs), accent: '#ff9100' },
    { icon: <Zap size={22} />, label: 'Latency', value: stats.latencyMs >= 0 ? `${stats.latencyMs}ms` : '—', accent: latencyColor },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-display)' }}>
      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(4,7,18,0.88)', backdropFilter: 'blur(18px)', borderBottom: '1px solid var(--border)' }}>
        <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>
          <ArrowLeft size={15} /> Home
        </RouterLink>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
          <Activity size={16} color="#3b9dff" /> Status
        </div>
        <button
          onClick={fetch_}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(59,157,255,0.07)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Checking…' : `Refresh (${countdown}s)`}
        </button>
      </header>

      <main style={{ flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: '60px 24px' }}>
        {/* Hero status banner */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          {bot?.avatar && (
            <img
              src={bot.avatar}
              alt={bot.username}
              style={{ width: '80px', height: '80px', borderRadius: '50%', border: `3px solid ${online ? 'var(--success)' : '#ff1744'}`, marginBottom: '20px', boxShadow: `0 0 24px ${online ? 'rgba(0,230,118,0.3)' : 'rgba(255,23,68,0.3)'}` }}
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
            {online
              ? <CheckCircle2 size={28} color="#00e676" />
              : <XCircle size={28} color="#ff1744" />}
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {online ? 'All Systems Operational' : 'Bot Offline'}
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {bot ? `${bot.username} is ${online ? 'online and running' : 'currently offline'}.` : 'Friday Bot status dashboard.'}
          </p>
          {lastFetched && (
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>
              Last checked: {lastFetched.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Status indicator bar */}
        <div style={{ marginBottom: '40px', padding: '18px 24px', borderRadius: '14px', border: `1px solid ${online ? 'rgba(0,230,118,0.2)' : 'rgba(255,23,68,0.2)'}`, background: online ? 'rgba(0,230,118,0.05)' : 'rgba(255,23,68,0.05)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: online ? '#00e676' : '#ff1744', flexShrink: 0, boxShadow: `0 0 8px ${online ? '#00e676' : '#ff1744'}`, animation: online ? 'pulse 2s infinite' : 'none' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: online ? '#00e676' : '#ff1744' }}>
              {online ? 'Operational' : 'Offline'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Discord Bot — {online ? 'Connected to Discord Gateway' : 'Not connected'}
            </div>
          </div>
          {online && stats.latencyMs >= 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WS Ping</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: latencyColor }}>{stats.latencyMs}ms</div>
            </div>
          )}
        </div>

        {/* Stat cards */}
        {loading && !data ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <RefreshCw size={32} color="#3b9dff" className="animate-spin" />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '14px', marginBottom: '48px' }}>
            {statCards.map(({ icon, label, value, accent }) => (
              <div
                key={label}
                style={{ padding: '20px 18px', borderRadius: '14px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${accent}18`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services table */}
        <div style={{ borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden', background: 'rgba(255,255,255,0.015)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={15} color="#3b9dff" />
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Services</span>
          </div>
          {[
            { name: 'Discord Gateway', desc: 'WebSocket connection to Discord', ok: online },
            { name: 'Command Handler', desc: 'Slash command processing', ok: online && (stats.commandCount || 0) > 0 },
            { name: 'Economy Engine', desc: 'Coins, inventory, pets, market', ok: online },
            { name: 'AutoMod', desc: 'Spam, caps, link detection', ok: online },
            { name: 'Leveling System', desc: 'XP tracking and rank cards', ok: online },
            { name: 'Dashboard API', desc: 'REST API for this dashboard', ok: !!data && !data.error },
          ].map((svc, i, arr) => (
            <div
              key={svc.name}
              style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: svc.ok ? '#00e676' : '#ff1744', flexShrink: 0, boxShadow: `0 0 6px ${svc.ok ? '#00e676' : '#ff1744'}` }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>{svc.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{svc.desc}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: svc.ok ? '#00e676' : '#ff1744', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {svc.ok ? 'Operational' : 'Down'}
              </span>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
