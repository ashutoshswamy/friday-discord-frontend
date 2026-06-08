import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { GitCommit, GitBranch, ExternalLink, RefreshCw, Bot, LayoutDashboard, Menu, X } from 'lucide-react';
import './Updates.css';

const REPOS = {
  bot:       { owner: 'ashutoshswamy', repo: 'friday-discord-backend',  label: 'Bot',       color: '#3b9dff', Icon: Bot },
  dashboard: { owner: 'ashutoshswamy', repo: 'friday-discord-frontend', label: 'Dashboard', color: '#8b5cf6', Icon: LayoutDashboard },
};

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function CommitCard({ commit }) {
  const { sha, commit: c, html_url, author } = commit;
  const msg   = c.message.split('\n')[0];
  const date  = c.author?.date || c.committer?.date;
  const login = author?.login;
  const avatar = author?.avatar_url;

  return (
    <div className="upd-commit-card">
      <div className="upd-commit-icon">
        <GitCommit size={14} />
      </div>
      <div className="upd-commit-body">
        <p className="upd-commit-msg">{msg}</p>
        <div className="upd-commit-meta">
          {avatar && <img src={avatar} alt={login} className="upd-commit-avatar" />}
          {login && <span className="upd-commit-author">{login}</span>}
          <span className="upd-commit-sha">{sha.slice(0, 7)}</span>
          {date && <span className="upd-commit-time">{timeAgo(date)}</span>}
          <a href={html_url} target="_blank" rel="noreferrer" className="upd-commit-link">
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}

function RepoSection({ repoKey }) {
  const { owner, repo, label, color, Icon } = REPOS[repoKey];
  const [commits,  setCommits]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [page,     setPage]     = useState(1);
  const [hasMore,  setHasMore]  = useState(true);
  const PER_PAGE = 15;

  const fetchCommits = async (p = 1, append = false, signal = undefined) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${PER_PAGE}&page=${p}`,
        { signal }
      );
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const data = await res.json();
      setCommits(prev => append ? [...prev, ...data] : data);
      setHasMore(data.length === PER_PAGE);
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchCommits(1, false, ac.signal);
    return () => ac.abort();
  }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchCommits(next, true);
  };

  return (
    <div className="upd-section" style={{ '--sec-color': color }}>
      <div className="upd-section-header">
        <div className="upd-section-title">
          <div className="upd-section-icon">
            <Icon size={18} color={color} />
          </div>
          <div>
            <h2 className="upd-section-name">{label}</h2>
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noreferrer"
              className="upd-section-repo"
            >
              <GitBranch size={11} />
              {owner}/{repo}
            </a>
          </div>
        </div>
        <button
          className="upd-refresh-btn"
          onClick={() => { setPage(1); fetchCommits(1); }}
          disabled={loading}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="upd-commits-list">
        {commits.map(c => <CommitCard key={c.sha} commit={c} />)}

        {loading && (
          <div className="upd-loading">
            <RefreshCw size={16} className="spin" />
            <span>Loading commits…</span>
          </div>
        )}

        {error && !loading && (
          <div className="upd-error">
            <span>Failed to load: {error}</span>
            <button onClick={() => fetchCommits(page)}>Retry</button>
          </div>
        )}

        {!loading && !error && commits.length === 0 && (
          <p className="upd-empty">No commits found.</p>
        )}

        {!loading && !error && hasMore && commits.length > 0 && (
          <button className="upd-load-more" onClick={loadMore}>
            Load more
          </button>
        )}
      </div>
    </div>
  );
}

export default function Updates() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = 'Updates — Friday Bot';
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="upd-root">
      <div className="upd-bg-grid" />
      <div className="upd-bg-glow-1" />
      <div className="upd-bg-glow-2" />

      {/* Nav */}
      <header className={`upd-nav ${scrolled ? 'upd-nav--scrolled' : ''}`}>
        <div className="upd-nav-inner">
          <RouterLink to="/" className="upd-nav-brand">
            <img src="/logo.png" alt="Friday" className="upd-nav-logo" />
            <span className="upd-nav-name">FRIDAY</span>
          </RouterLink>

          <nav className="upd-nav-links">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/commands">Commands</RouterLink>
            <RouterLink to="/updates" className="active">Updates</RouterLink>
          </nav>

          <button
            className="upd-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="upd-mobile-menu">
            <RouterLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</RouterLink>
            <RouterLink to="/commands" onClick={() => setMobileMenuOpen(false)}>Commands</RouterLink>
            <RouterLink to="/updates" onClick={() => setMobileMenuOpen(false)}>Updates</RouterLink>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="upd-hero">
        <div className="upd-section-eyebrow">
          <span className="upd-eyebrow-line" />
          <span className="upd-eyebrow-label">CHANGELOG</span>
        </div>
        <h1 className="upd-hero-title">Updates</h1>
        <p className="upd-hero-desc">
          Live GitHub commits across Friday's bot and dashboard — always up to date.
        </p>
      </section>

      {/* Two-column sections */}
      <main className="upd-main">
        <div className="upd-grid">
          <RepoSection repoKey="bot" />
          <RepoSection repoKey="dashboard" />
        </div>
      </main>

      {/* Footer */}
      <footer className="upd-footer">
        <div className="upd-footer-inner">
          <div className="upd-nav-brand" style={{ gap: '8px' }}>
            <img src="/logo.png" alt="Friday" className="upd-nav-logo" />
            <span className="upd-nav-name" style={{ fontSize: '14px' }}>FRIDAY</span>
          </div>
          <p className="upd-footer-copy">© 2025 Friday Bot. Built for Discord communities.</p>
        </div>
      </footer>
    </div>
  );
}
