import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || '1508180727953359008';
const makeInviteUrl = (id) =>
  `https://discord.com/oauth2/authorize?client_id=${id}&permissions=8&scope=bot%20applications.commands`;

export default function Footer({ onDashboard }) {
  const inviteUrl = makeInviteUrl(CLIENT_ID);

  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-top">
          {/* Brand */}
          <div className="lp-footer-brand">
            <div className="lp-nav-brand" style={{ marginBottom: '12px' }}>
              <img src="/logo.png" alt="Friday" className="lp-nav-logo" />
              <span className="lp-nav-name" style={{ fontSize: '16px', letterSpacing: '1px' }}>FRIDAY</span>
            </div>
            <p className="lp-footer-tagline">Smart Discord community<br />management, around the clock.</p>
            <a href={inviteUrl} target="_blank" rel="noreferrer" className="lp-btn lp-btn-primary" style={{ marginTop: '20px', fontSize: '13px', padding: '9px 18px' }}>
              Invite for Free
            </a>
          </div>

          {/* Link columns */}
          <div className="lp-footer-cols">
            <div className="lp-footer-col">
              <p className="lp-footer-col-heading">Product</p>
              <RouterLink to="/#features">Features</RouterLink>
              <RouterLink to="/#ai">AI Commands</RouterLink>
              <RouterLink to="/#how">How it works</RouterLink>
              <RouterLink to="/commands">Command List</RouterLink>
              <RouterLink to="/updates">Updates</RouterLink>
              <RouterLink to="/status">Status</RouterLink>
            </div>
            <div className="lp-footer-col">
              <p className="lp-footer-col-heading">Access</p>
              <a href={inviteUrl} target="_blank" rel="noreferrer">Invite Bot</a>
              {onDashboard
                ? <button onClick={onDashboard}>Dashboard</button>
                : <RouterLink to="/dashboard">Dashboard</RouterLink>
              }
            </div>
            <div className="lp-footer-col">
              <p className="lp-footer-col-heading">Legal</p>
              <RouterLink to="/privacy">Privacy Policy</RouterLink>
              <RouterLink to="/terms">Terms of Service</RouterLink>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <p className="lp-footer-copy">© 2026 Friday Bot. Built for Discord communities.</p>
          <p className="lp-footer-made-by">
            Made by{' '}
            <a href="https://ashutoshswamy.in" target="_blank" rel="noreferrer">Ashutosh Swamy</a>
            {' '}·{' '}
            <a href="https://github.com/ashutoshswamy" target="_blank" rel="noreferrer">GitHub</a>
            {' '}·{' '}
            <a href="https://linkedin.com/in/ashutoshswamy" target="_blank" rel="noreferrer">LinkedIn</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
