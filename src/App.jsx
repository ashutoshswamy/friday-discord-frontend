import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  Shield, Users, Coins, LogOut, ChevronDown,
  AlertTriangle, Search, Plus, Trash2, VolumeX, UserMinus, Ban,
  Award, ShoppingBag, Server, FileText, LayoutDashboard, RefreshCw, X, ChevronRight, Link,
  Gift, LifeBuoy, UserPlus, Terminal, Bell, Mic, Trophy, Zap,
  Calendar, CheckCircle2, Sparkles,
  Fish, Package, Target, Flame, Heart, PawPrint, Swords, UtensilsCrossed, Pickaxe, Dog, Cat, Rabbit, Pizza as PizzaIcon,
  Wrench, Activity, Hash, Headphones, FolderOpen, Cpu, TrendingUp,
  Home, BookOpen, Menu, Landmark, Briefcase
} from 'lucide-react';
import Landing from './Landing';
import Commands from './Commands';
import Updates from './Updates';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import Status from './Status';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || '1508180727953359008';

function App() {
  const navigate = useNavigate();

  const [token, setToken]           = useState(localStorage.getItem('friday_jwt') || null);
  const [user, setUser]             = useState(JSON.parse(localStorage.getItem('friday_user') || 'null'));
  const [guilds, setGuilds]         = useState([]);
  const [activeGuildId, setActiveGuildId] = useState(localStorage.getItem('friday_active_guild') || null);
  const [activeTab, setActiveTab]   = useState('overview');
  const [telemetry, setTelemetry]   = useState(null);
  const [members, setMembers]       = useState([]);

  const [loading, setLoading]             = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [authError, setAuthError]         = useState(null);
  const [errorMsg, setErrorMsg]           = useState(null);
  const [successMsg, setSuccessMsg]       = useState(null);

  const [memberSearch, setMemberSearch] = useState('');
  const [logFilter, setLogFilter]       = useState('ALL');

  const [selectedMember, setSelectedMember]   = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showGuildDropdown, setShowGuildDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [warnReason, setWarnReason]           = useState('');
  const [timeoutDuration, setTimeoutDuration] = useState('3600000');
  const [timeoutReason, setTimeoutReason]     = useState('');
  const [kickReason, setKickReason]           = useState('');
  const [banReason, setBanReason]             = useState('');
  const [banDeleteDays, setBanDeleteDays]     = useState('0');
  const [unbanUserId, setUnbanUserId]         = useState('');
  const [coinChangeAmount, setCoinChangeAmount] = useState('');
  const [coinChangeAction, setCoinChangeAction] = useState('ADD');
  const [xpChangeAmount, setXpChangeAmount]   = useState('');
  const [xpChangeAction, setXpChangeAction]   = useState('ADD');
  const [lockdownChannelId, setLockdownChannelId] = useState('');
  const [slowmodeChannelId, setSlowmodeChannelId] = useState('');
  const [slowmodeSeconds, setSlowmodeSeconds] = useState('0');

  const [newBlockedWord, setNewBlockedWord]           = useState('');
  const [newExemptionType, setNewExemptionType]       = useState('CHANNEL');
  const [newExemptionTargetId, setNewExemptionTargetId] = useState('');
  const [newShopItem, setNewShopItem] = useState({ name: '', cost: '', description: '', roleRewardId: '' });
  const [newRule, setNewRule] = useState({ threshold: '', type: 'TIMEOUT', duration: '3600000' });
  const [newMilestone, setNewMilestone] = useState({ level: '', roleId: '' });

  // Onboarding state
  const [welcomeChannelId, setWelcomeChannelId] = useState('');
  const [welcomeMessage, setWelcomeMessage]     = useState('');
  const [autoRoleId, setAutoRoleId]             = useState('');

  // Rank card state
  const [rankCardTheme, setRankCardTheme]   = useState('cyber');
  const [rankCardAccent, setRankCardAccent] = useState('');
  const [rankCardLoaded, setRankCardLoaded] = useState(false);

  // Leaderboard card state
  const [lbTheme, setLbTheme]   = useState('cyber');
  const [lbAccent, setLbAccent] = useState('');
  const [lbCardLoaded, setLbCardLoaded] = useState(false);

  // Welcome card state
  const [welcomeCardTheme, setWelcomeCardTheme]     = useState('cyber');
  const [welcomeCardAccent, setWelcomeCardAccent]   = useState('');
  const [welcomeCardEnabled, setWelcomeCardEnabled] = useState(false);
  const [welcomeCardLoaded, setWelcomeCardLoaded]   = useState(false);

  // Custom commands state
  const [customCmds, setCustomCmds]         = useState([]);
  const [customCmdsLoaded, setCustomCmdsLoaded] = useState(false);
  const [newCustomCmd, setNewCustomCmd]     = useState({ name: '', text: '' });

  // Giveaways state
  const [giveawaysList, setGiveawaysList]   = useState([]);
  const [giveawaysLoaded, setGiveawaysLoaded] = useState(false);
  const [newGiveaway, setNewGiveaway]       = useState({ duration: '30m', winners: '1', prize: '', channelId: '' });
  const [newEvent, setNewEvent]             = useState({ title: '', description: '', date: '', location: '', channelId: '' });
  const [newReactionRole, setNewReactionRole] = useState({ title: '', description: '', channelId: '', roleIds: ['', '', '', '', ''] });

  // Alerts state
  const [alertsList, setAlertsList]         = useState([]);
  const [alertsLoaded, setAlertsLoaded]     = useState(false);
  const [newYTAlert, setNewYTAlert]         = useState({ url: '', channelId: '' });
  const [newTwitchAlert, setNewTwitchAlert] = useState({ username: '', channelId: '' });

  // Economy panel state — Inventory, Pets, Market
  const [inventoryList, setInventoryList]   = useState([]);
  const [inventoryLoaded, setInventoryLoaded] = useState(false);
  const [inventoryCategory, setInventoryCategory] = useState('all');
  const [inventorySelectedUser, setInventorySelectedUser] = useState(null);
  const [inventoryGrantModal, setInventoryGrantModal] = useState(false);
  const [inventoryGrantForm, setInventoryGrantForm] = useState({ itemName: '', count: '1' });
  const [petsList, setPetsList]             = useState([]);
  const [petsLoaded, setPetsLoaded]         = useState(false);
  const [petEditModal, setPetEditModal]     = useState(null); // pet object being edited
  const [petEditForm, setPetEditForm]       = useState({ hunger: 0, energy: 0, affection: 0, level: 1 });
  const [marketList, setMarketList]         = useState([]);
  const [marketLoaded, setMarketLoaded]     = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [marketSearch, setMarketSearch]     = useState('');
  const [ticketsList, setTicketsList]       = useState([]);
  const [ticketsLoaded, setTicketsLoaded]   = useState(false);

  const [jobsList, setJobsList]             = useState([]);
  const [jobsLoaded, setJobsLoaded]         = useState(false);
  const [jobsAssignModal, setJobsAssignModal] = useState(null); // { userId, username, avatar }
  const [jobsAssignKey, setJobsAssignKey]   = useState('');

  const [purgeChannelId, setPurgeChannelId] = useState('');
  const [purgeAmount, setPurgeAmount]       = useState('10');
  const [purgeFilter, setPurgeFilter]       = useState('');

  const [embedForm, setEmbedForm] = useState({ channelId: '', title: '', description: '', color: '#00FFCC', image: '', thumbnail: '' });

  const [modstatsList, setModstatsList]     = useState([]);
  const [modstatsLoaded, setModstatsLoaded] = useState(false);

  // Stocks state
  const [stockCatalog, setStockCatalog]         = useState([]);
  const [stockCatalogLoaded, setStockCatalogLoaded] = useState(false);
  const [stockChartData, setStockChartData]     = useState(null);
  const [stockChartSymbol, setStockChartSymbol] = useState(null);
  const [stockChartLoading, setStockChartLoading] = useState(false);
  const [stockMarketFilter, setStockMarketFilter] = useState('ALL');
  const [stockSearch, setStockSearch]           = useState('');
  const [portfolioUserId, setPortfolioUserId]   = useState('');
  const [portfolioSymbol, setPortfolioSymbol]   = useState('');
  const [portfolioShares, setPortfolioShares]   = useState('');
  const [portfolioAction, setPortfolioAction]   = useState('GRANT');

  // Auto-refresh state
  const [autoRefreshSecs, setAutoRefreshSecs] = useState(30);

  const REDIRECT_URI = window.location.origin + '/';

  // ── Detect OAuth code on mount (lands on /)
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) handleOAuthCallback(code);
  }, []);

  // ── When token is present: fetch guilds (no forced redirect — user can browse freely)
  useEffect(() => {
    if (token) fetchGuilds();
  }, [token]);

  useEffect(() => {
    if (activeGuildId && token) fetchTelemetry();
  }, [activeGuildId, token]);

  useEffect(() => {
    if (!activeGuildId || !token) return;
    if (activeTab === 'customcmds' && !customCmdsLoaded) fetchCustomCmds();
    if (activeTab === 'giveaways' && !giveawaysLoaded) { fetchGiveaways(); }
    if (activeTab === 'alerts' && !alertsLoaded) fetchAlerts();
    if (activeTab === 'milestones' && !rankCardLoaded) fetchRankCard();
    if (activeTab === 'leaderboard' && !lbCardLoaded) fetchLbCard();
    if (activeTab === 'onboarding' && !welcomeCardLoaded) fetchWelcomeCard();
    if (activeTab === 'inventory' && !inventoryLoaded) fetchInventory();
    if (activeTab === 'pets' && !petsLoaded) fetchPets();
    if (activeTab === 'market' && !marketLoaded) fetchMarket();
    if (activeTab === 'tickets' && !ticketsLoaded) fetchTickets();
    if (activeTab === 'logs' && !modstatsLoaded) fetchModstats();
    if (activeTab === 'stocks' && !stockCatalogLoaded) fetchStockCatalog();
    if (activeTab === 'jobs' && !jobsLoaded) fetchJobs();
  }, [activeTab, activeGuildId]);

  // ── Auto-refresh: refresh telemetry + active economy panel every 30s
  useEffect(() => {
    if (!activeGuildId || !token) return;
    setAutoRefreshSecs(30);

    const countdown = setInterval(() => {
      setAutoRefreshSecs(s => {
        if (s <= 1) return 30;
        return s - 1;
      });
    }, 1000);

    const refresh = setInterval(() => {
      fetchTelemetry();
      if (activeTab === 'inventory') { setInventoryLoaded(false); fetchInventory(); }
      if (activeTab === 'pets')      { setPetsLoaded(false);      fetchPets(); }
      if (activeTab === 'market')    { setMarketLoaded(false);    fetchMarket(); }
    }, 30000);

    return () => { clearInterval(countdown); clearInterval(refresh); };
  }, [activeGuildId, token, activeTab]);

  useEffect(() => {
    if (telemetry?.config) {
      setWelcomeChannelId(telemetry.config.welcomeChannelId || '');
      setWelcomeMessage(telemetry.config.welcomeMessage || '');
      setAutoRoleId(telemetry.config.autoRoleId || '');
    }
  }, [telemetry]);

  // ── Auth
  const initiateOAuth = () => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
    window.location.href = url;
  };

  const handleOAuthCallback = async (code) => {
    setGlobalLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.error) {
        setAuthError(data.error);
        setGlobalLoading(false);
        window.history.replaceState({}, document.title, '/');
      } else {
        localStorage.setItem('friday_jwt', data.token);
        localStorage.setItem('friday_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        window.history.replaceState({}, document.title, '/');
        navigate('/dashboard');
      }
    } catch {
      setAuthError('Authentication server is unreachable.');
      setGlobalLoading(false);
      window.history.replaceState({}, document.title, '/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('friday_jwt');
    localStorage.removeItem('friday_user');
    localStorage.removeItem('friday_active_guild');
    setToken(null);
    setUser(null);
    setGuilds([]);
    setActiveGuildId(null);
    setTelemetry(null);
    setMembers([]);
    setAuthError(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    navigate('/');
  };

  // ── Data fetching
  const fetchGuilds = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.status === 401) { handleLogout(); return; }
      if (!res.ok) throw new Error(data.error || 'Failed to fetch guilds');
      setGuilds(data);
      if (!activeGuildId && data.length > 0) {
        const first = data.find(g => g.active);
        if (first) { selectGuild(first.id); return; }
      }
      setGlobalLoading(false);
    } catch (err) { showNotification('error', err.message); setGlobalLoading(false); }
  };

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.status === 401) { handleLogout(); return; }
      if (!res.ok) throw new Error(data.error || 'Failed to load telemetry');
      setTelemetry(data);
      fetchMembers();
    } catch (err) { showNotification('error', err.message); }
    finally { setLoading(false); setGlobalLoading(false); }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setMembers(data);
    } catch { /* silent */ }
  };

  const selectGuild = (id) => {
    localStorage.setItem('friday_active_guild', id);
    setActiveGuildId(id);
    setTelemetry(null);
    setMembers([]);
    setShowGuildDropdown(false);
  };

  // ── Notifications
  const showNotification = (type, message) => {
    if (type === 'success') { setSuccessMsg(message); setTimeout(() => setSuccessMsg(null), 4000); }
    else { setErrorMsg(message); setTimeout(() => setErrorMsg(null), 4000); }
  };

  // ── Config actions
  const updateAutoModConfig = async (updates) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...telemetry.config, ...updates }),
      });
      const data = await res.json();
      if (res.ok) { setTelemetry(p => ({ ...p, config: data.config })); showNotification('success', 'AutoMod settings updated!'); }
      else throw new Error(data.error);
    } catch (err) { showNotification('error', err.message); }
  };

  const addBlockedWord = async (e) => {
    e.preventDefault();
    if (!newBlockedWord.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/blocked-words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pattern: newBlockedWord }),
      });
      if (res.ok) {
        setTelemetry(p => ({ ...p, blockedWords: [...p.blockedWords, newBlockedWord.trim()] }));
        setNewBlockedWord('');
        showNotification('success', 'Blocked word pattern added.');
      } else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const removeBlockedWord = async (pattern) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/blocked-words/${encodeURIComponent(pattern)}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTelemetry(p => ({ ...p, blockedWords: p.blockedWords.filter(w => w !== pattern) }));
        showNotification('success', 'Blocked word pattern deleted.');
      }
    } catch (err) { showNotification('error', err.message); }
  };

  const addExemption = async (e) => {
    e.preventDefault();
    if (!newExemptionTargetId) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/exemptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: newExemptionType, targetId: newExemptionTargetId }),
      });
      if (res.ok) {
        setTelemetry(p => ({ ...p, exemptions: [...p.exemptions, { type: newExemptionType, targetId: newExemptionTargetId }] }));
        setNewExemptionTargetId('');
        showNotification('success', 'AutoMod exemption added.');
      } else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const removeExemption = async (type, targetId) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/exemptions/${type}/${targetId}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTelemetry(p => ({ ...p, exemptions: p.exemptions.filter(ex => !(ex.type === type && ex.targetId === targetId)) }));
        showNotification('success', 'AutoMod exemption removed.');
      }
    } catch (err) { showNotification('error', err.message); }
  };

  const addPunishmentRule = async (e) => {
    e.preventDefault();
    if (!newRule.threshold) return;
    const durationMs = newRule.type === 'TIMEOUT' ? Number(newRule.duration) : 0;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ warnThreshold: Number(newRule.threshold), punishmentType: newRule.type, durationMs }),
      });
      const data = await res.json();
      if (res.ok) {
        const entry = { warnThreshold: Number(newRule.threshold), punishmentType: newRule.type, durationMs };
        setTelemetry(p => {
          const filtered = (p.punishmentRules || []).filter(r => r.warnThreshold !== entry.warnThreshold);
          return { ...p, punishmentRules: [...filtered, entry].sort((a, b) => a.warnThreshold - b.warnThreshold) };
        });
        setNewRule({ threshold: '', type: 'TIMEOUT', duration: '3600000' });
        showNotification('success', 'Escalation rule added.');
      } else throw new Error(data.error);
    } catch (err) { showNotification('error', err.message); }
  };

  const removePunishmentRule = async (threshold) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/rules/${threshold}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTelemetry(p => ({ ...p, punishmentRules: (p.punishmentRules || []).filter(r => r.warnThreshold !== threshold) }));
        showNotification('success', 'Escalation rule removed.');
      }
    } catch (err) { showNotification('error', err.message); }
  };

  const addShopItem = async (e) => {
    e.preventDefault();
    if (!newShopItem.name || !newShopItem.cost) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newShopItem.name, cost: Number(newShopItem.cost), description: newShopItem.description, roleRewardId: newShopItem.roleRewardId || null }),
      });
      if (res.ok) {
        setTelemetry(p => ({ ...p, shopItems: [...p.shopItems, { name: newShopItem.name, cost: Number(newShopItem.cost), description: newShopItem.description, roleRewardId: newShopItem.roleRewardId || null }] }));
        setNewShopItem({ name: '', cost: '', description: '', roleRewardId: '' });
        showNotification('success', 'Shop item registered.');
      }
    } catch (err) { showNotification('error', err.message); }
  };

  const removeShopItem = async (name) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/shop/${encodeURIComponent(name)}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { setTelemetry(p => ({ ...p, shopItems: p.shopItems.filter(i => i.name !== name) })); showNotification('success', 'Shop item deleted.'); }
    } catch (err) { showNotification('error', err.message); }
  };

  const addMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestone.level || !newMilestone.roleId) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/rewards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ level: Number(newMilestone.level), roleId: newMilestone.roleId }),
      });
      if (res.ok) {
        setTelemetry(p => ({ ...p, levelRewards: [...p.levelRewards, { level: Number(newMilestone.level), roleId: newMilestone.roleId }].sort((a, b) => a.level - b.level) }));
        setNewMilestone({ level: '', roleId: '' });
        showNotification('success', 'Level reward milestone registered.');
      }
    } catch (err) { showNotification('error', err.message); }
  };

  const removeMilestone = async (level) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/rewards/${level}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { setTelemetry(p => ({ ...p, levelRewards: p.levelRewards.filter(r => r.level !== level) })); showNotification('success', 'Milestone deleted.'); }
    } catch (err) { showNotification('error', err.message); }
  };

  // ── Moderation actions
  const executeWarn = async () => {
    if (!selectedMember) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members/${selectedMember.id}/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: warnReason }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', `Warning issued. Count: ${data.warnCount}.` + (data.escalationTriggered ? ` Escalation: ${data.escalationTriggered}!` : ''));
        setWarnReason(''); fetchTelemetry(); setShowMemberModal(false);
      } else throw new Error(data.error);
    } catch (err) { showNotification('error', err.message); }
  };

  const executeClearWarnings = async () => {
    if (!selectedMember || !window.confirm(`Clear all warnings for ${selectedMember.username}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members/${selectedMember.id}/clear-warnings`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { showNotification('success', `Cleared warnings for ${selectedMember.username}`); fetchTelemetry(); setShowMemberModal(false); }
    } catch (err) { showNotification('error', err.message); }
  };

  const deleteSingleWarning = async (warningId) => {
    if (!window.confirm('Delete this warning record?')) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members/${selectedMember.id}/warnings/${warningId}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { showNotification('success', 'Warning deleted.'); fetchTelemetry(); setShowMemberModal(false); }
    } catch (err) { showNotification('error', err.message); }
  };

  const executeTimeout = async () => {
    if (!selectedMember) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members/${selectedMember.id}/timeout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ durationMs: Number(timeoutDuration), reason: timeoutReason }),
      });
      if (res.ok) { showNotification('success', 'Member timed out.'); setTimeoutReason(''); fetchTelemetry(); setShowMemberModal(false); }
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const executeKick = async () => {
    if (!selectedMember || !window.confirm(`Kick ${selectedMember.username}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members/${selectedMember.id}/kick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: kickReason }),
      });
      if (res.ok) { showNotification('success', `Kicked ${selectedMember.username}`); setKickReason(''); fetchTelemetry(); setShowMemberModal(false); }
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const executeBan = async () => {
    if (!selectedMember || !window.confirm(`Permanently ban ${selectedMember.username}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members/${selectedMember.id}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: banReason, deleteMessageSeconds: Number(banDeleteDays) * 86400 }),
      });
      if (res.ok) { showNotification('success', `Banned ${selectedMember.username}`); setBanReason(''); setBanDeleteDays('0'); fetchTelemetry(); setShowMemberModal(false); }
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const executeCoinAdjustment = async () => {
    if (!selectedMember || !coinChangeAmount) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members/${selectedMember.id}/economy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(coinChangeAmount), action: coinChangeAction }),
      });
      const data = await res.json();
      if (res.ok) { showNotification('success', `Coins adjusted! New balance: ${data.coins}`); setCoinChangeAmount(''); fetchTelemetry(); setShowMemberModal(false); }
    } catch (err) { showNotification('error', err.message); }
  };

  const executeXpAdjustment = async () => {
    if (!selectedMember || !xpChangeAmount) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members/${selectedMember.id}/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(xpChangeAmount), action: xpChangeAction }),
      });
      const data = await res.json();
      if (res.ok) { showNotification('success', `XP updated! Level: ${data.level} (XP: ${data.xp})`); setXpChangeAmount(''); fetchTelemetry(); setShowMemberModal(false); }
    } catch (err) { showNotification('error', err.message); }
  };

  const executeUnban = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/unban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, reason: 'Admin Dashboard Unban' }),
      });
      if (res.ok) { showNotification('success', `User ${userId} unbanned.`); }
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const executeUntimeout = async () => {
    if (!selectedMember) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members/${selectedMember.id}/untimeout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: 'Admin Dashboard: Timeout removed' }),
      });
      if (res.ok) { showNotification('success', `Timeout removed for ${selectedMember.username}.`); }
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const executeLockdown = async (channelId, lock) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/channels/${channelId}/lockdown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lock }),
      });
      if (res.ok) { showNotification('success', lock ? 'Channel locked.' : 'Channel unlocked.'); }
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const executeSlowmode = async (channelId, seconds) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/channels/${channelId}/slowmode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ seconds }),
      });
      if (res.ok) { showNotification('success', seconds === 0 ? 'Slowmode disabled.' : `Slowmode set to ${seconds}s.`); }
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const openMemberDetails = (member) => { setSelectedMember(member); setShowMemberModal(true); };

  // ── Custom Commands
  const fetchCustomCmds = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/customcmds`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { handleLogout(); return; }
      if (res.ok) { setCustomCmds(await res.json()); }
    } catch { /* silent */ }
    finally { setCustomCmdsLoaded(true); }
  };

  const addCustomCmd = async (e) => {
    e.preventDefault();
    if (!newCustomCmd.name.trim() || !newCustomCmd.text.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/customcmds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newCustomCmd.name.trim(), text: newCustomCmd.text.trim() }),
      });
      if (res.ok) {
        setCustomCmds(p => [...p, { name: newCustomCmd.name.trim(), content: newCustomCmd.text.trim(), isEmbed: false }]);
        setNewCustomCmd({ name: '', text: '' });
        showNotification('success', 'Custom command created.');
      } else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const removeCustomCmd = async (name) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/customcmds/${encodeURIComponent(name)}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { setCustomCmds(p => p.filter(c => c.name !== name)); showNotification('success', 'Command deleted.'); }
    } catch (err) { showNotification('error', err.message); }
  };

  // ── Rank Card
  const fetchRankCard = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/rank-card`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setRankCardTheme(data.theme || 'cyber');
        setRankCardAccent(data.accentColor || '');
      }
    } catch { /* silent */ }
    finally { setRankCardLoaded(true); }
  };

  const saveRankCard = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/rank-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ theme: rankCardTheme, accentColor: rankCardAccent || null }),
      });
      if (res.ok) showNotification('success', 'Rank card theme saved!');
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  // ── Leaderboard Card
  const fetchLbCard = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/leaderboard-card`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setLbTheme(data.theme || 'cyber');
        setLbAccent(data.accentColor || '');
      }
    } catch { /* silent */ }
    finally { setLbCardLoaded(true); }
  };

  const saveLbCard = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/leaderboard-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ theme: lbTheme, accentColor: lbAccent || null }),
      });
      if (res.ok) showNotification('success', 'Leaderboard card theme saved!');
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  // ── Welcome Card
  const fetchWelcomeCard = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/welcome-card`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setWelcomeCardTheme(data.theme || 'cyber');
        setWelcomeCardAccent(data.accentColor || '');
        setWelcomeCardEnabled(data.enabled || false);
      }
    } catch { /* silent */ }
    finally { setWelcomeCardLoaded(true); }
  };

  const saveWelcomeCard = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/welcome-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ theme: welcomeCardTheme, accentColor: welcomeCardAccent || null, enabled: welcomeCardEnabled }),
      });
      if (res.ok) showNotification('success', 'Welcome card saved!');
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  // ── Giveaways
  const fetchGiveaways = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/giveaways`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setGiveawaysList(await res.json());
    } catch { /* silent */ }
    finally { setGiveawaysLoaded(true); }
  };

  const createGiveaway = async (e) => {
    e.preventDefault();
    if (!newGiveaway.channelId || !newGiveaway.prize) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/giveaway`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newGiveaway),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', `Giveaway launched! Entries open.`);
        setNewGiveaway({ duration: '30m', winners: '1', prize: '', channelId: '' });
        setGiveawaysLoaded(false);
        fetchGiveaways();
      } else throw new Error(data.error);
    } catch (err) { showNotification('error', err.message); }
  };

  const endGiveaway = async (messageId) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/giveaway/${messageId}/end`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) { showNotification('success', 'Giveaway ended and winners drawn!'); fetchGiveaways(); }
      else throw new Error(data.error);
    } catch (err) { showNotification('error', err.message); }
  };

  const rerollGiveaway = async (messageId) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/giveaway/${messageId}/reroll`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) showNotification('success', 'Giveaway rerolled! New winners picked.');
      else throw new Error(data.error);
    } catch (err) { showNotification('error', err.message); }
  };

  // ── Events
  const createEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.channelId || !newEvent.title) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newEvent),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', 'Event deployed! RSVP card posted.');
        setNewEvent({ title: '', description: '', date: '', location: '', channelId: '' });
      } else throw new Error(data.error);
    } catch (err) { showNotification('error', err.message); }
  };

  // ── Reaction Roles
  const createReactionRole = async (e) => {
    e.preventDefault();
    const roleIds = newReactionRole.roleIds.filter(Boolean);
    if (!newReactionRole.channelId || !newReactionRole.title || !roleIds.length) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/reaction-roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newReactionRole, roleIds }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', 'Reaction role panel deployed!');
        setNewReactionRole({ title: '', description: '', channelId: '', roleIds: ['', '', '', '', ''] });
      } else throw new Error(data.error);
    } catch (err) { showNotification('error', err.message); }
  };

  // ── Alerts
  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/alerts`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { handleLogout(); return; }
      if (res.ok) { setAlertsList(await res.json()); }
    } catch { /* silent */ }
    finally { setAlertsLoaded(true); }
  };

  const addAlert = async (e, platform) => {
    e.preventDefault();
    try {
      const body = platform === 'youtube' ? newYTAlert : newTwitchAlert;
      const endpoint = `${API_BASE}/guilds/${activeGuildId}/alerts/${platform}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        await fetchAlerts();
        if (platform === 'youtube') setNewYTAlert({ url: '', channelId: '' });
        else setNewTwitchAlert({ username: '', channelId: '' });
        showNotification('success', `${platform === 'youtube' ? 'YouTube' : 'Twitch'} alert added.`);
      } else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const removeAlert = async (platform, identifier) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/alerts/${platform}/${encodeURIComponent(identifier)}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAlertsList(p => p.filter(a => platform === 'youtube' ? a.url !== identifier : a.username !== identifier));
        showNotification('success', 'Alert removed.');
      }
    } catch (err) { showNotification('error', err.message); }
  };

  // ── Economy Panel Fetchers
  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/inventory`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setInventoryList(await res.json());
    } catch { /* silent */ }
    finally { setInventoryLoaded(true); }
  };

  const removeInventoryItem = async (userId, itemName) => {
    if (!window.confirm(`Remove all "${itemName}" from this user's inventory?`)) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/inventory`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, itemName }),
      });
      if (res.ok) { setInventoryList(p => p.filter(i => !(i.user_id === userId && i.item_name === itemName))); showNotification('success', 'Item removed.'); }
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const grantInventoryItem = async (userId, itemName, count) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, itemName, count: parseInt(count) || 1 }),
      });
      if (res.ok) {
        const qty = parseInt(count) || 1;
        setInventoryList(p => {
          const key = `${userId}::${itemName}`;
          const existing = p.find(i => i.user_id === userId && i.item_name === itemName);
          if (existing) return p.map(i => i.user_id === userId && i.item_name === itemName ? { ...i, count: i.count + qty } : i);
          const deriveType = n => {
            n = n.toLowerCase();
            if (['fishing pole','shovel','rifle'].some(k => n.includes(k.split(' ')[0]))) return 'tool';
            if (['fish','bass','salmon','goldfish','whale','coral','seaweed','boot'].some(k => n.includes(k))) return 'fish';
            if (['bear','deer','wolf','moose','elk'].some(k => n.includes(k))) return 'hunt';
            if (['worm','fossil','vase','gold chest','gem'].some(k => n.includes(k))) return 'dig';
            if (['pizza','bread','apple','food'].some(k => n.includes(k))) return 'food';
            if (['lootbox','mystery','crate'].some(k => n.includes(k))) return 'loot';
            return 'other';
          };
          return [...p, { id: Date.now(), user_id: userId, item_name: itemName, item_type: deriveType(itemName), count: qty, acquired_at: new Date().toISOString() }];
        });
        showNotification('success', `Granted ${qty}× ${itemName}.`);
      } else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const fetchPets = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/pets`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setPetsList(await res.json());
    } catch { /* silent */ }
    finally { setPetsLoaded(true); }
  };

  const adminDeletePet = async (petId) => {
    if (!window.confirm('Permanently delete this pet? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/pets/${petId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { setPetsList(p => p.filter(pet => pet.id !== petId)); showNotification('success', 'Pet deleted.'); }
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const adminFeedPet = async (petId) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/pets/${petId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ hunger: 100, energy: 100, affection: 100 }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPetsList(p => p.map(pet => pet.id === petId ? { ...pet, ...updated } : pet));
        showNotification('success', 'Pet fully restored.');
      } else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const adminUpdatePet = async (e) => {
    e.preventDefault();
    if (!petEditModal) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/pets/${petEditModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          hunger: Number(petEditForm.hunger),
          energy: Number(petEditForm.energy),
          affection: Number(petEditForm.affection),
          level: Number(petEditForm.level),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPetsList(p => p.map(pet => pet.id === petEditModal.id ? { ...pet, ...updated } : pet));
        setPetEditModal(null);
        showNotification('success', 'Pet updated.');
      } else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const fetchMarket = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/market`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setMarketList(await res.json());
    } catch { /* silent */ }
    finally { setMarketLoaded(true); }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/jobs`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setJobsList(await res.json());
    } catch { /* silent */ }
    finally { setJobsLoaded(true); }
  };

  const adminSetJob = async (userId, jobKey) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/jobs/${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobKey }),
      });
      if (res.ok) {
        setJobsList(prev => {
          const existing = prev.find(j => j.userId === userId);
          if (existing) return prev.map(j => j.userId === userId ? { ...j, jobKey } : j);
          return [...prev, { userId, jobKey, jobAppliedAt: Date.now() }];
        });
        showNotification('success', 'Job assigned.');
      } else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const adminClearJob = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/jobs/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setJobsList(prev => prev.filter(j => j.userId !== userId));
        showNotification('success', 'Job cleared.');
      } else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/tickets`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setTicketsList(await res.json());
    } catch { /* silent */ }
    finally { setTicketsLoaded(true); }
  };

  const fetchModstats = async () => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/modstats`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setModstatsList(await res.json());
    } catch { /* silent */ }
    finally { setModstatsLoaded(true); }
  };

  // ── Stocks
  const fetchStockCatalog = async () => {
    try {
      const res = await fetch(`${API_BASE}/stocks/catalog`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setStockCatalog(await res.json());
    } catch { /* silent */ }
    finally { setStockCatalogLoaded(true); }
  };

  const fetchStockChart = async (symbol) => {
    setStockChartSymbol(symbol);
    setStockChartLoading(true);
    setStockChartData(null);
    try {
      const res = await fetch(`${API_BASE}/stocks/chart/${symbol}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setStockChartData(await res.json());
    } catch { /* silent */ }
    finally { setStockChartLoading(false); }
  };

  const adminPortfolioAdjust = async (e) => {
    e.preventDefault();
    if (!portfolioUserId || !portfolioSymbol || !portfolioShares) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/members/${portfolioUserId}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ symbol: portfolioSymbol, shares: Number(portfolioShares), action: portfolioAction }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('success', `${portfolioAction === 'GRANT' ? 'Granted' : 'Revoked'} ${portfolioShares} shares of ${portfolioSymbol}`);
        setPortfolioShares('');
      } else throw new Error(data.error);
    } catch (err) { showNotification('error', err.message); }
  };

  const executePurge = async () => {
    if (!purgeChannelId || !purgeAmount) return;
    if (!window.confirm(`Delete up to ${purgeAmount} messages in the selected channel?`)) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/channels/${purgeChannelId}/purge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(purgeAmount), filter: purgeFilter || null }),
      });
      const data = await res.json();
      if (res.ok) showNotification('success', `Purged ${data.deleted} message${data.deleted !== 1 ? 's' : ''}.`);
      else throw new Error(data.error);
    } catch (err) { showNotification('error', err.message); }
  };

  const removeMarketListing = async (listingId) => {
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/economy/market/${listingId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { setMarketList(p => p.filter(l => l.id !== listingId)); showNotification('success', 'Listing removed & item returned to seller.'); }
      else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const sendEmbed = async (e) => {
    e.preventDefault();
    if (!embedForm.channelId || !embedForm.description) return;
    try {
      const res = await fetch(`${API_BASE}/guilds/${activeGuildId}/channels/${embedForm.channelId}/send-embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(embedForm),
      });
      if (res.ok) {
        showNotification('success', 'Embed sent successfully!');
        setEmbedForm(p => ({ ...p, title: '', description: '', color: '#00FFCC', image: '', thumbnail: '' }));
      } else throw new Error((await res.json()).error);
    } catch (err) { showNotification('error', err.message); }
  };

  const filteredMembers = members.filter(m =>
    m.username.toLowerCase().includes(memberSearch.toLowerCase()) ||
    (m.nickname && m.nickname.toLowerCase().includes(memberSearch.toLowerCase())) ||
    m.id.includes(memberSearch)
  );

  // ── Derived guild info
  const activeGuild     = guilds.find(g => g.id === activeGuildId);
  const activeGuildName = activeGuild ? activeGuild.name : 'Discord Guild';
  const activeGuildIcon = activeGuild?.icon
    ? `https://cdn.discordapp.com/icons/${activeGuild.id}/${activeGuild.icon}.png`
    : null;

  // ── Toast styles (shared)
  const toastBase = { position: 'fixed', bottom: '24px', right: '24px', padding: '14px 22px', borderRadius: '4px', zIndex: 1000, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)', letterSpacing: '0.5px', backdropFilter: 'blur(12px)' };

  // ════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════
  return (
    <Routes>

      {/* ── / → Landing page (always public) ── */}
      <Route path="/" element={
        globalLoading ? (
          <div className="connect-screen">
            <div className="connect-card">
              <div className="connect-logo-wrap">
                <img src="/logo.png" alt="Friday" className="connect-logo" />
                <div className="connect-spinner-ring" />
              </div>
              <div className="connect-brand">Friday Bot</div>
              <div className="connect-headline">Connecting to<br /><span>Discord</span></div>
              <div className="connect-status">
                <div className="connect-status-dot" />
                Authenticating your session<span className="connect-dots" />
              </div>
              <div className="connect-progress">
                <div className="connect-progress-bar" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {authError && (
              <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,23,68,0.12)', color: '#ff4569', padding: '12px 24px', borderRadius: '6px', zIndex: 200, border: '1px solid rgba(255,23,68,0.25)', backdropFilter: 'blur(12px)', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {authError}
              </div>
            )}
            <Landing onLogin={initiateOAuth} clientId={CLIENT_ID} isLoggedIn={!!token} />
          </>
        )
      } />

      {/* ── /dashboard → Protected dashboard ── */}
      <Route path="/dashboard" element={
        !token ? <Navigate to="/" replace /> : (
          <>
            {/* Toasts */}
            {successMsg && (
              <div style={{ ...toastBase, background: 'rgba(0,230,118,0.12)', color: 'var(--success)', boxShadow: '0 4px 20px rgba(0,230,118,0.2)', border: '1px solid rgba(0,230,118,0.25)' }}>
                <CheckCircle2 size={14} style={{ flexShrink: 0 }} /> {successMsg}
              </div>
            )}
            {errorMsg && (
              <div style={{ ...toastBase, background: 'rgba(255,23,68,0.12)', color: 'var(--danger)', boxShadow: '0 4px 20px rgba(255,23,68,0.2)', border: '1px solid rgba(255,23,68,0.25)' }}>
                <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {errorMsg}
              </div>
            )}

            {/* ── Guild loading ── */}
            {globalLoading ? (
              <div className="connect-screen">
                <div className="connect-card">
                  <div className="connect-logo-wrap">
                    <img src="/logo.png" alt="Friday" className="connect-logo" />
                    <div className="connect-spinner-ring" />
                  </div>
                  <div className="connect-brand">Friday Bot</div>
                  <div className="connect-headline">Loading<br /><span>Workspace</span></div>
                  <div className="connect-status">
                    <div className="connect-status-dot" />
                    Fetching guild data<span className="connect-dots" />
                  </div>
                  <div className="connect-progress">
                    <div className="connect-progress-bar" />
                  </div>
                </div>
              </div>

            ) : (!activeGuildId || guilds.length === 0) ? (
              /* ── Guild selection ── */
              (() => {
                const activeGuilds   = guilds.filter(g => g.active);
                const inactiveGuilds = guilds.filter(g => !g.active);
                return (
                  <div className="selection-container">
                    <div className="selection-header">
                      <h1>Select Server</h1>
                      <p>Choose which Discord server you want to configure or manage</p>
                    </div>
                    {guilds.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No servers with administrative permissions found.</p>
                      </div>
                    )}
                    <div className="guild-grid">
                      {activeGuilds.map(g => (
                        <div key={g.id} className="guild-card glass-panel glow-panel-primary">
                          {g.icon ? <img className="guild-avatar-large" src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} alt={g.name} /> : <div className="guild-avatar-large">{g.name.charAt(0)}</div>}
                          <h3 className="guild-name-large">{g.name}</h3>
                          <span className="guild-status-badge status-active">Active</span>
                          <button className="guild-action-btn btn-manage" onClick={() => selectGuild(g.id)}>Manage Server <ChevronRight size={16} /></button>
                        </div>
                      ))}
                      {inactiveGuilds.map(g => {
                        const invite = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${g.id}&disable_guild_select=true`;
                        return (
                          <div key={g.id} className="guild-card glass-panel">
                            {g.icon ? <img className="guild-avatar-large" src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} alt={g.name} style={{ opacity: 0.5 }} /> : <div className="guild-avatar-large" style={{ opacity: 0.5 }}>{g.name.charAt(0)}</div>}
                            <h3 className="guild-name-large" style={{ color: 'var(--text-secondary)' }}>{g.name}</h3>
                            <span className="guild-status-badge status-inactive">Not Present</span>
                            <a className="guild-action-btn btn-setup" href={invite} target="_blank" rel="noreferrer">Invite Bot <Link size={16} /></a>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                      <button className="btn btn-secondary" onClick={handleLogout}><LogOut size={16} /> Logout</button>
                    </div>
                  </div>
                );
              })()

            ) : (
              /* ── Main dashboard ── */
              <div className="app-container">

                {/* Mobile sidebar backdrop */}
                {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

                {/* SIDEBAR */}
                <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
                  {/* Brand */}
                  <div className="sidebar-header">
                    <img src="/logo.png" alt="Friday" className="sidebar-header-logo" />
                    <div className="sidebar-logo">
                      FRIDAY
                    </div>
                  </div>

                  {/* Server switcher */}
                  <div className="guild-selector-container">
                    <div className="guild-dropdown-btn" onClick={() => setShowGuildDropdown(!showGuildDropdown)}>
                      <div className="guild-info-inline">
                        {activeGuildIcon
                          ? <img className="guild-icon-sm" src={activeGuildIcon} alt={activeGuildName} />
                          : <div className="guild-icon-sm">{activeGuildName.charAt(0)}</div>}
                        <span className="guild-name-sm">{activeGuildName}</span>
                      </div>
                      <ChevronDown size={13} style={{ color: '#3a5570', flexShrink: 0 }} />
                    </div>

                    {showGuildDropdown && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: '12px', right: '12px', zIndex: 50, background: 'rgba(4,8,20,0.98)', border: '1px solid rgba(59,157,255,0.14)', borderRadius: '8px', overflow: 'hidden', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                        {guilds.filter(g => g.active && g.id !== activeGuildId).map(g => (
                          <div key={g.id} className="nav-item" onClick={() => selectGuild(g.id)} style={{ borderRadius: 0, padding: '9px 12px', borderBottom: '1px solid rgba(59,157,255,0.04)' }}>
                            {g.icon ? <img className="guild-icon-sm" src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} alt={g.name} /> : <div className="guild-icon-sm">{g.name.charAt(0)}</div>}
                            <span className="guild-name-sm">{g.name}</span>
                          </div>
                        ))}
                        <div className="nav-item" onClick={() => setActiveGuildId(null)} style={{ borderRadius: 0, padding: '9px 12px', color: 'var(--primary)', justifyContent: 'center', fontSize: '12px' }}>
                          <Server size={13} /> All Servers
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nav */}
                  <nav className="sidebar-nav">
                    {[
                      { id: 'overview',    Icon: LayoutDashboard, label: 'Overview' },
                      { group: 'Moderation' },
                      { id: 'automod',     Icon: Shield,           label: 'AutoMod' },
                      { id: 'members',     Icon: Users,            label: 'Members' },
                      { id: 'logs',        Icon: FileText,         label: 'Audit Logs' },
                      { group: 'Community' },
                      { id: 'leaderboard', Icon: Trophy,           label: 'Leaderboard' },
                      { id: 'giveaways',   Icon: Gift,             label: 'Giveaways' },
                      { id: 'tickets',     Icon: LifeBuoy,         label: 'Tickets' },
                      { group: 'Configuration' },
                      { id: 'onboarding',  Icon: UserPlus,         label: 'Onboarding' },
                      { id: 'shop',        Icon: ShoppingBag,      label: 'Server Shop' },
                      { id: 'milestones',  Icon: Award,            label: 'XP Milestones' },
                      { id: 'customcmds',  Icon: Terminal,         label: 'Custom Cmds' },
                      { id: 'alerts',      Icon: Bell,             label: 'Alerts' },
                      { group: 'Economy' },
                      { id: 'stocks',      Icon: TrendingUp,       label: 'Stocks' },
                      { id: 'jobs',        Icon: Briefcase,        label: 'Jobs' },
                      { id: 'inventory',   Icon: Package,          label: 'Inventory' },
                      { id: 'pets',        Icon: Sparkles,         label: 'Pets' },
                      { id: 'market',      Icon: Zap,              label: 'Market' },
                      { group: 'Utilities' },
                      { id: 'utilities',   Icon: Wrench,           label: 'Embed Builder' },
                    ].map((item) => item.group ? (
                      <div key={item.group} className="sidebar-nav-group">{item.group}</div>
                    ) : (
                      <div key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
                        <item.Icon size={15} /> {item.label}
                      </div>
                    ))}
                  </nav>

                  {/* Footer */}
                  <div className="sidebar-footer">
                    <div className="sf-nav-links">
                      <button className="sf-icon-btn" onClick={() => navigate('/')} title="Home">
                        <Home size={13} /> Home
                      </button>
                      <button className="sf-icon-btn" onClick={() => navigate('/commands')} title="Commands">
                        <BookOpen size={13} /> Commands
                      </button>
                    </div>
                    <div className="sf-user">
                      {user?.avatar
                        ? <img className="user-avatar-sm" src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt={user.username} />
                        : <div className="user-avatar-sm" style={{ background: 'rgba(59,157,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px', color: 'var(--primary)' }}>{user?.username?.charAt(0).toUpperCase()}</div>}
                      <span className="user-username-sm">{user?.username}</span>
                      <button className="logout-btn" onClick={handleLogout} title="Logout"><LogOut size={14} /></button>
                    </div>
                  </div>
                </aside>

                {/* MAIN */}
                <div className="main-wrapper">
                  <header className="main-header">
                    <button className="hamburger-btn" onClick={() => setSidebarOpen(s => !s)} aria-label="Toggle menu">
                      <Menu size={20} />
                    </button>
                    <div className="header-title-container">
                      <div className="header-tab-accent" />
                      <h1>
                        {{ overview: 'Overview', automod: 'AutoMod Rules', members: 'User Directory', logs: 'Audit Logs', shop: 'Server Shop', milestones: 'XP Milestones', onboarding: 'Onboarding', tickets: 'Tickets & Helpdesk', giveaways: 'Giveaways', customcmds: 'Custom Commands', alerts: 'Alerts', leaderboard: 'Leaderboard', stocks: 'Stocks & Portfolio', jobs: 'Job Ecosystem', inventory: 'Inventory', pets: 'Pets', market: 'Player Market', utilities: 'Embed Builder' }[activeTab] || activeTab}
                      </h1>
                    </div>
                    <div className="header-actions">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#1e3a52', fontFamily: 'var(--font-mono)', userSelect: 'none', letterSpacing: '0.3px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px var(--success)', display: 'inline-block', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                        {autoRefreshSecs}s
                      </div>
                      <button className="btn btn-secondary" onClick={() => { fetchTelemetry(); setInventoryLoaded(false); setPetsLoaded(false); setMarketLoaded(false); setInventoryList([]); setPetsList([]); setMarketList([]); setAutoRefreshSecs(30); }} disabled={loading}>
                        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
                      </button>
                    </div>
                  </header>

                  <div className="content-pane">
                    {loading && !telemetry ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60%', flexDirection: 'column', gap: '16px' }}>
                        <RefreshCw className="animate-spin" size={32} color="#3b9dff" />
                        <p style={{ color: 'var(--text-secondary)' }}>Gathering telemetry...</p>
                      </div>
                    ) : telemetry ? (
                      <>
                        {/* ── OVERVIEW ── */}
                        {activeTab === 'overview' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="stats-row" style={{ marginBottom: 0 }}>
                              <div className="stat-card glass-panel">
                                <div className="stat-icon-wrapper stat-icon-primary"><Users size={22} /></div>
                                <div className="stat-info"><h3>Total Members</h3><div className="stat-value">{telemetry.stats.memberCount}</div></div>
                              </div>
                              <div className="stat-card glass-panel">
                                <div className="stat-icon-wrapper stat-icon-warning"><AlertTriangle size={22} /></div>
                                <div className="stat-info"><h3>Active Warnings</h3><div className="stat-value">{telemetry.stats.warningsCount}</div></div>
                              </div>
                              <div className="stat-card glass-panel">
                                <div className="stat-icon-wrapper stat-icon-success"><Coins size={22} /></div>
                                <div className="stat-info"><h3>Coins in Economy</h3><div className="stat-value">{telemetry.stats.totalCoins.toLocaleString()}</div></div>
                              </div>
                              <div className="stat-card glass-panel">
                                <div className="stat-icon-wrapper stat-icon-info"><Award size={22} /></div>
                                <div className="stat-info"><h3>Average Level</h3><div className="stat-value">Lvl {telemetry.stats.avgLevel}</div></div>
                              </div>
                            </div>

                            <div className="charts-grid" style={{ marginBottom: 0 }}>
                              <div className="chart-card glass-panel">
                                <div className="chart-title">Top Members — XP Distribution</div>
                                <div className="chart-body">
                                  {members.slice().sort((a,b) => b.xp - a.xp).slice(0,8).map(m => {
                                    const max = Math.max(...members.map(x => x.xp), 1);
                                    return (
                                      <div key={m.id} className="bar-chart-item">
                                        <div className="bar-fill" style={{ height: `${Math.max(10, (m.xp/max)*100)}%` }} data-val={`${m.xp} XP`} />
                                        <div className="bar-label">{m.username}</div>
                                      </div>
                                    );
                                  })}
                                  {members.length === 0 && <p style={{ position: 'absolute', top: '50%', color: 'var(--text-muted)' }}>No leveling profiles yet.</p>}
                                </div>
                              </div>
                              <div className="chart-card glass-panel">
                                <div className="chart-title">Richest Members — Economy Balance</div>
                                <div className="chart-body">
                                  {members.slice().sort((a,b) => b.coins - a.coins).slice(0,8).map(m => {
                                    const max = Math.max(...members.map(x => x.coins), 1);
                                    return (
                                      <div key={m.id} className="bar-chart-item">
                                        <div className="bar-fill" style={{ height: `${Math.max(10, (m.coins/max)*100)}%`, background: 'linear-gradient(180deg, var(--success) 0%, rgba(0,230,118,0.12) 100%)', boxShadow: '0 0 12px rgba(0,230,118,0.18)' }} data-val={`${m.coins} coins`} />
                                        <div className="bar-label">{m.username}</div>
                                      </div>
                                    );
                                  })}
                                  {members.length === 0 && <p style={{ position: 'absolute', top: '50%', color: 'var(--text-muted)' }}>No economy profiles yet.</p>}
                                </div>
                              </div>
                            </div>

                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ marginBottom: '16px' }}>Recent Infractions</div>
                              <div className="table-container">
                                <table className="dashboard-table">
                                  <thead><tr><th>Type</th><th>User</th><th>Moderator</th><th>Reason</th><th>Date</th></tr></thead>
                                  <tbody>
                                    {telemetry.logs.slice(0,5).map(l => (
                                      <tr key={l.id}>
                                        <td><span className={`badge ${l.type.includes('BAN')||l.type.includes('KICK') ? 'badge-danger' : l.type.includes('WARN') ? 'badge-warning' : 'badge-primary'}`}>{l.type}</span></td>
                                        <td style={{ fontWeight: 600 }}>{members.find(m => m.id === l.userId)?.username || `ID:${l.userId}`}</td>
                                        <td>{members.find(m => m.id === l.moderatorId)?.username || `ID:${l.moderatorId}`}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{l.reason}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(l.timestamp).toLocaleString()}</td>
                                      </tr>
                                    ))}
                                    {telemetry.logs.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No incidents recorded.</td></tr>}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Server Activity — mirrors /serveractivity command */}
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Activity size={15} color="var(--primary)" /> Server Activity
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
                                {[
                                  { icon: <Users size={17} color="var(--primary)" />, label: 'Members', val: telemetry.guild.memberCount?.toLocaleString() ?? '—' },
                                  { icon: <Hash size={17} color="#38bdf8" />, label: 'Text Channels', val: (telemetry.guild.textChannelCount ?? telemetry.guild.channels?.length ?? 0).toString() },
                                  { icon: <Headphones size={17} color="#a78bfa" />, label: 'Voice Channels', val: (telemetry.guild.voiceChannelCount ?? 0).toString() },
                                  { icon: <FolderOpen size={17} color="#fb923c" />, label: 'Categories', val: (telemetry.guild.categoryCount ?? 0).toString() },
                                  { icon: <Shield size={17} color="#f59e0b" />, label: 'Roles', val: (telemetry.guild.roleCount ?? telemetry.guild.roles?.length ?? 0).toString() },
                                  { icon: <Zap size={17} color="#f472b6" />, label: 'Boost Tier', val: `Tier ${telemetry.guild.boostTier ?? 0}` },
                                  { icon: <TrendingUp size={17} color="#34d399" />, label: 'Boosts', val: (telemetry.guild.boostCount ?? 0).toString() },
                                  { icon: <Cpu size={17} color="var(--text-muted)" />, label: 'Server Created', val: telemetry.guild.createdAt ? new Date(telemetry.guild.createdAt).toLocaleDateString() : '—' },
                                ].map(({ icon, label, val }) => (
                                  <div key={label} style={{ padding: '14px 12px', background: 'rgba(0,0,0,0.18)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ flexShrink: 0 }}>{icon}</div>
                                    <div style={{ minWidth: 0 }}>
                                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px' }}>{label}</div>
                                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '16px', lineHeight: 1 }}>{val}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── LEADERBOARD ── */}
                        {activeTab === 'leaderboard' && (() => {
                          const xpRanked   = members.slice().sort((a, b) => b.level !== a.level ? b.level - a.level : b.xp - a.xp);
                          const coinRanked = members.slice().sort((a, b) => b.coins - a.coins);

                          const podiumColors = [
                            { glow: '#f59e0b', ring: 'linear-gradient(135deg,#f59e0b,#fcd34d)', badge: '#f59e0b', label: 'GOLD', num: '1' },
                            { glow: '#94a3b8', ring: 'linear-gradient(135deg,#94a3b8,#cbd5e1)', badge: '#94a3b8', label: 'SILVER', num: '2' },
                            { glow: '#b45309', ring: 'linear-gradient(135deg,#b45309,#d97706)', badge: '#b45309', label: 'BRONZE', num: '3' },
                          ];

                          const PodiumCard = ({ m, rank, accent }) => {
                            const isXp = accent === 'xp';
                            const pc = podiumColors[rank];
                            const needed = m.level * 150 + 100;
                            const pct = Math.min(100, Math.floor((m.xp / needed) * 100));
                            return (
                              <div style={{ position: 'relative', flex: rank === 0 ? '0 0 38%' : '0 0 29%', padding: '20px 16px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: `1px solid ${pc.glow}30`, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', boxShadow: `0 0 28px ${pc.glow}18, inset 0 1px 0 ${pc.glow}20`, order: rank === 0 ? 0 : rank === 1 ? -1 : 1 }}>
                                {/* watermark rank numeral */}
                                <div style={{ position: 'absolute', top: '-12px', right: '8px', fontSize: rank === 0 ? '110px' : '88px', fontWeight: 900, fontFamily: 'var(--font-display)', color: `${pc.glow}10`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{pc.num}</div>
                                {/* badge */}
                                <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '9px', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '1.5px', color: pc.badge, background: `${pc.glow}18`, padding: '2px 7px', borderRadius: '20px', border: `1px solid ${pc.glow}40` }}>{pc.label}</div>
                                {/* avatar */}
                                <div style={{ position: 'relative', marginTop: '8px' }}>
                                  <div style={{ width: rank === 0 ? '72px' : '58px', height: rank === 0 ? '72px' : '58px', borderRadius: '50%', padding: '2px', background: pc.ring }}>
                                    <img src={m.avatar} alt={m.username} style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'block', objectFit: 'cover' }} onError={e => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }} />
                                  </div>
                                  <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', background: pc.ring, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, color: '#000', fontFamily: 'var(--font-display)' }}>{pc.num}</div>
                                </div>
                                {/* name */}
                                <div style={{ fontWeight: 700, fontSize: rank === 0 ? '15px' : '13px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>{m.username}</div>
                                {/* stat */}
                                {isXp ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '100%' }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: rank === 0 ? '22px' : '18px', fontWeight: 900, color: '#8b5cf6', letterSpacing: '-0.5px' }}>LVL {m.level}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.xp.toLocaleString()} XP</div>
                                    <div style={{ width: '100%', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginTop: '2px' }}>
                                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#8b5cf6,#a78bfa)', borderRadius: '2px' }} />
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-display)', fontSize: rank === 0 ? '22px' : '18px', fontWeight: 900, color: '#00c853', letterSpacing: '-0.5px' }}>
                                    <Coins size={rank === 0 ? 18 : 14} />
                                    {m.coins.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            );
                          };

                          const RankRow = ({ m, rank, accent }) => {
                            const isXp = accent === 'xp';
                            const needed = m.level * 150 + 100;
                            const pct = Math.min(100, Math.floor((m.xp / needed) * 100));
                            return (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '6px', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <div style={{ width: '26px', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right', flexShrink: 0, letterSpacing: '0.5px' }}>#{rank + 1}</div>
                                <img src={m.avatar} alt={m.username} style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, border: '1.5px solid var(--border)' }} onError={e => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 600, fontSize: '12.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.username}</div>
                                  {isXp && (
                                    <div style={{ width: '80px', height: '2px', borderRadius: '1px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginTop: '3px' }}>
                                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#8b5cf6,#a78bfa)' }} />
                                    </div>
                                  )}
                                </div>
                                {isXp ? (
                                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: '#8b5cf6' }}>LVL {m.level}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>{m.xp.toLocaleString()} xp</div>
                                  </div>
                                ) : (
                                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: '#00c853' }}>
                                    <Coins size={11} />{m.coins.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            );
                          };

                          const BoardPanel = ({ ranked, accent }) => {
                            const isXp = accent === 'xp';
                            const top3 = ranked.slice(0, 3);
                            const rest = ranked.slice(3);
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* panel header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                                  {isXp ? <Zap size={16} color="#8b5cf6" /> : <Coins size={16} color="#00c853" />}
                                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', color: isXp ? '#8b5cf6' : '#00c853' }}>{isXp ? 'XP Rankings' : 'Economy Rankings'}</span>
                                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
                                    <Users size={11} />{ranked.length}
                                  </div>
                                </div>
                                {/* podium */}
                                {top3.length > 0 && (
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', justifyContent: 'center', minHeight: '160px' }}>
                                    {top3.map((m, i) => <PodiumCard key={m.id} m={m} rank={i} accent={accent} />)}
                                  </div>
                                )}
                                {/* rest of list */}
                                {rest.length > 0 && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '1.5px', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 12px 6px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>Ranked 4–{ranked.length}</div>
                                    {rest.map((m, i) => <RankRow key={m.id} m={m} rank={i + 3} accent={accent} />)}
                                  </div>
                                )}
                                {ranked.length === 0 && (
                                  <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '13px' }}>No data yet.</div>
                                )}
                              </div>
                            );
                          };

                          const totalXp    = members.reduce((s, m) => s + m.xp, 0);
                          const totalCoins = members.reduce((s, m) => s + m.coins, 0);
                          const maxLevel   = members.length > 0 ? Math.max(...members.map(m => m.level)) : 0;
                          const active     = members.filter(m => m.xp > 0).length;

                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                              {/* stats ticker bar */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                {[
                                  { label: 'Total XP', value: totalXp.toLocaleString(), Icon: Zap, color: '#8b5cf6' },
                                  { label: 'Coins Circulation', value: totalCoins.toLocaleString(), Icon: Coins, color: '#00c853' },
                                  { label: 'Peak Level', value: `Lv. ${maxLevel}`, Icon: Trophy, color: '#f59e0b' },
                                  { label: 'Active Members', value: active.toString(), Icon: Users, color: '#3b9dff' },
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

                              {/* two boards side by side */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="glass-panel" style={{ padding: '20px' }}>
                                  <BoardPanel ranked={xpRanked} accent="xp" />
                                </div>
                                <div className="glass-panel" style={{ padding: '20px' }}>
                                  <BoardPanel ranked={coinRanked} accent="coins" />
                                </div>
                              </div>

                              {/* ── Leaderboard Card Customizer ── */}
                              {(() => {
                                const LB_THEMES = {
                                  cyber:    { label: 'Cyber',    bg: 'linear-gradient(135deg,#0F0C20,#06040A)', accent1: '#00F2FE', accent2: '#4FACFE' },
                                  midnight: { label: 'Midnight', bg: 'linear-gradient(135deg,#060912,#040810)', accent1: '#3b9dff', accent2: '#8b5cf6' },
                                  forest:   { label: 'Forest',   bg: 'linear-gradient(135deg,#0a1a0f,#050d04)', accent1: '#00c853', accent2: '#69f0ae' },
                                  sunset:   { label: 'Sunset',   bg: 'linear-gradient(135deg,#1a0a08,#0d0304)', accent1: '#ff4569', accent2: '#ff9100' },
                                  aurora:   { label: 'Aurora',   bg: 'linear-gradient(135deg,#0a0813,#070510)', accent1: '#8b5cf6', accent2: '#ec4899' },
                                  neon:     { label: 'Neon',     bg: 'linear-gradient(135deg,#050515,#020208)', accent1: '#39ff14', accent2: '#ff00ff' },
                                  ocean:    { label: 'Ocean',    bg: 'linear-gradient(135deg,#011020,#010810)', accent1: '#00e5ff', accent2: '#0ea5e9' },
                                  volcano:  { label: 'Volcano',  bg: 'linear-gradient(135deg,#1a0500,#0d0200)', accent1: '#ff6d00', accent2: '#ffab40' },
                                  sakura:   { label: 'Sakura',   bg: 'linear-gradient(135deg,#1a0510,#0d0208)', accent1: '#f472b6', accent2: '#fda4af' },
                                  gold:     { label: 'Gold',     bg: 'linear-gradient(135deg,#1a1200,#0d0900)', accent1: '#fbbf24', accent2: '#f59e0b' },
                                  void:     { label: 'Void',     bg: 'linear-gradient(135deg,#050005,#020002)', accent1: '#7c3aed', accent2: '#c026d3' },
                                };
                                const pt = LB_THEMES[lbTheme] || LB_THEMES.cyber;
                                const pa1 = lbAccent || pt.accent1;
                                const pa2 = lbAccent || pt.accent2;
                                return (
                                  <div className="glass-panel" style={{ padding: '24px' }}>
                                    <div className="chart-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Trophy size={15} style={{ color: 'var(--primary)' }} />
                                      Leaderboard Card Appearance
                                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>Applied to <code>/leaderboard xp</code> and <code>/leaderboard economy</code></span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'start' }}>
                                      <div>
                                        {/* Theme presets */}
                                        <div className="form-group">
                                          <label>Theme</label>
                                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                                            {Object.entries(LB_THEMES).map(([key, th]) => (
                                              <button
                                                key={key}
                                                onClick={() => setLbTheme(key)}
                                                style={{
                                                  background: th.bg,
                                                  border: `2px solid ${lbTheme === key ? th.accent1 : 'rgba(255,255,255,0.08)'}`,
                                                  borderRadius: '8px',
                                                  padding: '10px 18px',
                                                  cursor: 'pointer',
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  alignItems: 'center',
                                                  gap: '6px',
                                                  transition: 'border-color 0.2s',
                                                  minWidth: '90px',
                                                }}
                                              >
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.accent1 }} />
                                                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.accent2 }} />
                                                </div>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: lbTheme === key ? th.accent1 : 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>
                                                  {th.label}
                                                </span>
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Custom accent */}
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                          <label>Custom Accent Color <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(overrides theme accent)</span></label>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                            <input
                                              type="color"
                                              value={lbAccent || pt.accent1}
                                              onChange={e => setLbAccent(e.target.value)}
                                              style={{ width: '48px', height: '38px', padding: '2px', border: '1px solid var(--border-hover)', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}
                                            />
                                            <input
                                              className="form-input"
                                              type="text"
                                              placeholder={pt.accent1}
                                              value={lbAccent}
                                              onChange={e => setLbAccent(e.target.value)}
                                              style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                                            />
                                            {lbAccent && (
                                              <button className="btn btn-secondary" onClick={() => setLbAccent('')} style={{ whiteSpace: 'nowrap' }}>
                                                <X size={13} /> Reset
                                              </button>
                                            )}
                                          </div>
                                        </div>

                                        <button className="btn btn-primary" onClick={saveLbCard} style={{ marginTop: '8px' }}>
                                          <Trophy size={15} /> Save Leaderboard Card
                                        </button>
                                      </div>

                                      {/* Live preview — leaderboard card */}
                                      <div>
                                        <div style={{ fontSize: '10px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '1.5px', marginBottom: '10px', textTransform: 'uppercase' }}>Preview</div>
                                        <div style={{ width: '460px', borderRadius: '12px', background: pt.bg, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, position: 'relative' }}>
                                          {/* Ambient top-right glow */}
                                          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '140px', height: '140px', borderRadius: '50%', background: `radial-gradient(circle, ${pa1}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
                                          {/* Header */}
                                          <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: `linear-gradient(135deg,${pa1},${pa2})`, flexShrink: 0 }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              <div style={{ display: 'inline-block', padding: '1px 8px', borderRadius: '999px', background: '#FFD70018', border: '1px solid #FFD70044', marginBottom: '3px' }}>
                                                <span style={{ fontSize: '8px', fontWeight: 700, color: '#FFD700', letterSpacing: '0.5px', fontFamily: 'var(--font-display)' }}>XP  LEADERBOARD</span>
                                              </div>
                                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Server Name</div>
                                            </div>
                                            <div style={{ padding: '4px 10px', borderRadius: '999px', background: `linear-gradient(90deg,${pa1}22,${pa2}22)`, border: `1.5px solid ${pa1}88`, flexShrink: 0 }}>
                                              <span style={{ fontSize: '9px', fontWeight: 700, color: pa1, fontFamily: 'var(--font-display)' }}>TOP  3</span>
                                            </div>
                                          </div>
                                          {/* Divider */}
                                          <div style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${pa1}44, ${pa2}44, transparent)`, marginBottom: '2px' }} />
                                          {/* Sample rows */}
                                          {[
                                            { rank: 1, name: 'TopUser', lvl: 42, xp: '98,400', color: '#FFD700', bot: '#B8860B', pct: 0.82 },
                                            { rank: 2, name: 'Player2', lvl: 38, xp: '84,100', color: '#E8E8E8', bot: '#A0A0A0', pct: 0.65 },
                                            { rank: 3, name: 'Member3', lvl: 31, xp: '61,200', color: '#F0A060', bot: '#8B4513', pct: 0.47 },
                                          ].map((row, i) => (
                                            <div key={row.rank} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 16px', background: `${row.color}0a` }}>
                                              <div style={{ width: '28px', height: '18px', borderRadius: '4px', background: `linear-gradient(180deg,${row.color}30,${row.bot}30)`, border: `1px solid ${row.color}88`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <span style={{ fontSize: '9px', fontWeight: 800, color: row.color, fontFamily: 'var(--font-display)' }}>#{row.rank}</span>
                                              </div>
                                              <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: `linear-gradient(135deg,${row.color}44,${row.bot}44)`, border: `1px solid ${row.color}55`, flexShrink: 0 }} />
                                              <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', marginBottom: '3px' }}>{row.name}</div>
                                                <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden', width: '110px' }}>
                                                  <div style={{ width: `${row.pct * 100}%`, height: '100%', background: `linear-gradient(90deg,${row.color},${row.bot})` }} />
                                                </div>
                                              </div>
                                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                <div style={{ fontSize: '11px', fontWeight: 700, color: row.color, fontFamily: 'var(--font-display)' }}>Lvl {row.lvl}</div>
                                                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)' }}>{row.xp} XP</div>
                                              </div>
                                            </div>
                                          ))}
                                          {/* Footer */}
                                          <div style={{ padding: '6px 0', background: 'rgba(255,255,255,0.025)', textAlign: 'center', fontSize: '9px', color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-display)' }}>Server Name  ·  Rankings update in real-time</div>
                                          {/* Bottom accent line */}
                                          <div style={{ height: '2px', background: `linear-gradient(90deg, transparent 0%, ${pa1}bb 30%, ${pa2}bb 70%, transparent 100%)` }} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                            </div>
                          );
                        })()}

                        {/* ── AUTOMOD ── */}
                        {activeTab === 'automod' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>AutoMod Filters</div>
                              {[
                                { key: 'automodSpam', label: 'Spam Regulation', desc: 'Deletes messages sent in rapid succession.' },
                                { key: 'automodCaps', label: 'Mass Caps Filtering', desc: 'Filters messages with excessive capital letters.' },
                                { key: 'automodLinks', label: 'Link Blockers', desc: 'Blocks URLs posted by non-whitelisted members.' },
                              ].map(({ key, label, desc }) => (
                                <div key={key} className="toggle-row">
                                  <div className="toggle-info"><h4>{label}</h4><p>{desc}</p></div>
                                  <label className="switch">
                                    <input type="checkbox" checked={telemetry.config[key]} onChange={(e) => updateAutoModConfig({ [key]: e.target.checked })} />
                                    <span className="slider" />
                                  </label>
                                </div>
                              ))}
                            </div>

                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title">Blocked Words & Patterns</div>
                              <form onSubmit={addBlockedWord} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                <input className="form-input" type="text" placeholder="Word or regex pattern..." value={newBlockedWord} onChange={(e) => setNewBlockedWord(e.target.value)} />
                                <button className="btn btn-primary" type="submit"><Plus size={16} /> Add</button>
                              </form>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                                {telemetry.blockedWords.map(word => (
                                  <div key={word} style={{ background: 'rgba(255,23,68,0.1)', color: 'var(--danger)', padding: '5px 10px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,23,68,0.2)' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{word}</span>
                                    <X size={13} style={{ cursor: 'pointer' }} onClick={() => removeBlockedWord(word)} />
                                  </div>
                                ))}
                                {telemetry.blockedWords.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No patterns blocked yet.</p>}
                              </div>
                            </div>

                            <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
                              <div className="chart-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>Punishment Escalation Rules</div>

                              {/* Existing rules table */}
                              <div className="table-container" style={{ marginBottom: '24px' }}>
                                <table className="dashboard-table">
                                  <thead><tr><th>Warning Threshold</th><th>Punishment</th><th>Duration</th><th>Action</th></tr></thead>
                                  <tbody>
                                    {(telemetry.punishmentRules || []).map(r => (
                                      <tr key={r.warnThreshold}>
                                        <td style={{ fontWeight: 700 }}>{r.warnThreshold} warnings</td>
                                        <td><span className={`badge ${r.punishmentType === 'BAN' ? 'badge-danger' : r.punishmentType === 'KICK' ? 'badge-warning' : 'badge-primary'}`}>{r.punishmentType}</span></td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{r.punishmentType === 'TIMEOUT' ? `${Math.round(r.durationMs / 60000)} min` : '—'}</td>
                                        <td><button className="logout-btn" onClick={() => removePunishmentRule(r.warnThreshold)}><Trash2 size={15} /></button></td>
                                      </tr>
                                    ))}
                                    {(!telemetry.punishmentRules || telemetry.punishmentRules.length === 0) && (
                                      <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No escalation rules configured.</td></tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              {/* Add new rule form */}
                              <form onSubmit={addPunishmentRule} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                <div className="form-group" style={{ flex: '0 0 160px', marginBottom: 0 }}>
                                  <label>Warn Threshold</label>
                                  <input className="form-input" type="number" min="1" placeholder="e.g. 3" value={newRule.threshold} onChange={e => setNewRule(p => ({ ...p, threshold: e.target.value }))} required />
                                </div>
                                <div className="form-group" style={{ flex: '0 0 180px', marginBottom: 0 }}>
                                  <label>Punishment</label>
                                  <select className="form-select" value={newRule.type} onChange={e => setNewRule(p => ({ ...p, type: e.target.value }))}>
                                    <option value="TIMEOUT">TIMEOUT (Mute)</option>
                                    <option value="KICK">KICK</option>
                                    <option value="BAN">BAN (Permanent)</option>
                                  </select>
                                </div>
                                {newRule.type === 'TIMEOUT' && (
                                  <div className="form-group" style={{ flex: '0 0 180px', marginBottom: 0 }}>
                                    <label>Duration</label>
                                    <select className="form-select" value={newRule.duration} onChange={e => setNewRule(p => ({ ...p, duration: e.target.value }))}>
                                      <option value="300000">5 Minutes</option>
                                      <option value="3600000">1 Hour</option>
                                      <option value="86400000">1 Day</option>
                                      <option value="604800000">1 Week</option>
                                    </select>
                                  </div>
                                )}
                                <button className="btn btn-primary" type="submit" style={{ marginBottom: 0, height: '40px' }}><Plus size={16} /> Add Rule</button>
                              </form>
                            </div>

                            <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
                              <div className="chart-title">Whitelisted Exemptions</div>
                              <form onSubmit={addExemption} style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
                                  <label>Exemption Type</label>
                                  <select className="form-select" value={newExemptionType} onChange={(e) => { setNewExemptionType(e.target.value); setNewExemptionTargetId(''); }}>
                                    <option value="CHANNEL">CHANNEL</option>
                                    <option value="ROLE">ROLE</option>
                                  </select>
                                </div>
                                <div className="form-group" style={{ flex: 2, minWidth: '250px', marginBottom: 0 }}>
                                  <label>Target</label>
                                  <select className="form-select" value={newExemptionTargetId} onChange={(e) => setNewExemptionTargetId(e.target.value)}>
                                    <option value="">— Choose —</option>
                                    {newExemptionType === 'CHANNEL'
                                      ? telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)
                                      : telemetry.guild.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                  </select>
                                </div>
                                <button className="btn btn-primary" type="submit" disabled={!newExemptionTargetId}><Plus size={16} /> Whitelist</button>
                              </form>
                              <div className="table-container">
                                <table className="dashboard-table">
                                  <thead><tr><th>Type</th><th>Entity</th><th>Action</th></tr></thead>
                                  <tbody>
                                    {telemetry.exemptions.map(ex => {
                                      const name = ex.type === 'CHANNEL'
                                        ? telemetry.guild.channels.find(c => c.id === ex.targetId)?.name || ex.targetId
                                        : telemetry.guild.roles.find(r => r.id === ex.targetId)?.name || ex.targetId;
                                      return (
                                        <tr key={`${ex.type}-${ex.targetId}`}>
                                          <td><span className={`badge ${ex.type === 'CHANNEL' ? 'badge-primary' : 'badge-warning'}`}>{ex.type}</span></td>
                                          <td style={{ fontWeight: 600 }}>{ex.type === 'CHANNEL' ? `# ${name}` : name}</td>
                                          <td><button className="logout-btn" onClick={() => removeExemption(ex.type, ex.targetId)}><Trash2 size={15} /></button></td>
                                        </tr>
                                      );
                                    })}
                                    {telemetry.exemptions.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No exemptions — bot scans entire server.</td></tr>}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Channel Controls */}
                            <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
                              <div className="chart-title" style={{ marginBottom: '20px' }}>Channel Controls</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                {/* Lockdown */}
                                <div>
                                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Lockdown</div>
                                  <div className="form-group">
                                    <label>Channel</label>
                                    <select className="form-select" value={lockdownChannelId} onChange={e => setLockdownChannelId(e.target.value)}>
                                      <option value="">— Select Channel —</option>
                                      {telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                    </select>
                                  </div>
                                  <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn btn-danger" style={{ flex: 1 }} disabled={!lockdownChannelId} onClick={() => executeLockdown(lockdownChannelId, true)}><VolumeX size={14} /> Lock</button>
                                    <button className="btn btn-secondary" style={{ flex: 1 }} disabled={!lockdownChannelId} onClick={() => executeLockdown(lockdownChannelId, false)}>Unlock</button>
                                  </div>
                                </div>
                                {/* Slowmode */}
                                <div>
                                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Slowmode</div>
                                  <div className="form-group">
                                    <label>Channel</label>
                                    <select className="form-select" value={slowmodeChannelId} onChange={e => setSlowmodeChannelId(e.target.value)}>
                                      <option value="">— Select Channel —</option>
                                      {telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                    </select>
                                  </div>
                                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                      <label>Delay</label>
                                      <select className="form-select" value={slowmodeSeconds} onChange={e => setSlowmodeSeconds(e.target.value)}>
                                        <option value="0">Off (0s)</option>
                                        <option value="5">5 seconds</option>
                                        <option value="10">10 seconds</option>
                                        <option value="30">30 seconds</option>
                                        <option value="60">1 minute</option>
                                        <option value="300">5 minutes</option>
                                        <option value="3600">1 hour</option>
                                      </select>
                                    </div>
                                    <button className="btn btn-primary" disabled={!slowmodeChannelId} onClick={() => executeSlowmode(slowmodeChannelId, Number(slowmodeSeconds))}>Apply</button>
                                  </div>
                                </div>
                                {/* Purge */}
                                <div>
                                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Purge Messages</div>
                                  <div className="form-group">
                                    <label>Channel</label>
                                    <select className="form-select" value={purgeChannelId} onChange={e => setPurgeChannelId(e.target.value)}>
                                      <option value="">— Select Channel —</option>
                                      {telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                    </select>
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '10px' }}>
                                    <div className="form-group" style={{ flex: '0 0 80px', marginBottom: 0 }}>
                                      <label>Count</label>
                                      <input className="form-input" type="number" min="1" max="100" value={purgeAmount} onChange={e => setPurgeAmount(e.target.value)} />
                                    </div>
                                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                      <label>Filter</label>
                                      <select className="form-select" value={purgeFilter} onChange={e => setPurgeFilter(e.target.value)}>
                                        <option value="">All Messages</option>
                                        <option value="bots">Bots Only</option>
                                        <option value="links">Links Only</option>
                                        <option value="attachments">Attachments</option>
                                        <option value="embeds">Embeds Only</option>
                                      </select>
                                    </div>
                                  </div>
                                  <button className="btn btn-danger" style={{ width: '100%' }} disabled={!purgeChannelId} onClick={executePurge}><Trash2 size={14} /> Purge</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── MEMBERS ── */}
                        {activeTab === 'members' && (
                          <div className="glass-panel" style={{ padding: '24px' }}>
                            <div className="search-bar-container">
                              <div className="search-input-wrapper">
                                <Search size={18} />
                                <input className="form-input" type="text" placeholder="Search by Username, Nickname, or Discord ID..." value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} />
                              </div>
                            </div>
                            <div className="table-container">
                              <table className="dashboard-table">
                                <thead><tr><th>User</th><th>Coins</th><th>Level & XP</th><th>Warnings</th><th>Actions</th></tr></thead>
                                <tbody>
                                  {filteredMembers.map(m => (
                                    <tr key={m.id}>
                                      <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                          <img className="user-avatar-sm" src={m.avatar} alt={m.username} onError={(e) => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }} />
                                          <div>
                                            <div style={{ fontWeight: 700, fontSize: '14.5px' }}>{m.username} {m.nickname && <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 400 }}>({m.nickname})</span>}</div>
                                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>ID: {m.id} {m.isBot && <span className="badge badge-primary" style={{ padding: '0 4px', fontSize: '10px' }}>BOT</span>}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}><Coins size={14} color="var(--success)" />{m.coins.toLocaleString()}</div></td>
                                      <td><div style={{ fontWeight: 600 }}>Level {m.level}</div><div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.xp.toLocaleString()} XP</div></td>
                                      <td><span className={`badge ${m.warningCount > 0 ? 'badge-danger' : 'badge-primary'}`} style={{ minWidth: '24px', justifyContent: 'center' }}>{m.warningCount}</span></td>
                                      <td><button className="btn btn-secondary" onClick={() => openMemberDetails(m)} disabled={m.isBot}>Control Panel</button></td>
                                    </tr>
                                  ))}
                                  {filteredMembers.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No members match your search.</td></tr>}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* ── SHOP ── */}
                        {activeTab === 'shop' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title">Shop Catalog</div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                {telemetry.shopItems.map(item => {
                                  const roleName = telemetry.guild.roles.find(r => r.id === item.roleRewardId)?.name;
                                  return (
                                    <div key={item.name} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', background: 'rgba(59,157,255,0.02)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{item.name}</h4>
                                        <button className="logout-btn" onClick={() => removeShopItem(item.name)} style={{ padding: '3px' }}><Trash2 size={13} /></button>
                                      </div>
                                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', flex: 1, marginBottom: '10px' }}>{item.description}</p>
                                      {roleName && <div style={{ fontSize: '11px', background: 'rgba(59,157,255,0.1)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '3px', marginBottom: '10px', display: 'inline-block', fontWeight: 600 }}>↳ Role: {roleName}</div>}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--success)' }}><Coins size={13} /> {item.cost} Coins</div>
                                    </div>
                                  );
                                })}
                                {telemetry.shopItems.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Shop is empty.</p>}
                              </div>
                            </div>
                            <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
                              <div className="chart-title">Register Item</div>
                              <form onSubmit={addShopItem}>
                                <div className="form-group"><label>Item Name</label><input className="form-input" type="text" placeholder="e.g. VIP Access" value={newShopItem.name} onChange={(e) => setNewShopItem({ ...newShopItem, name: e.target.value })} required /></div>
                                <div className="form-group"><label>Coin Cost</label><input className="form-input" type="number" placeholder="Cost in coins..." value={newShopItem.cost} onChange={(e) => setNewShopItem({ ...newShopItem, cost: e.target.value })} required /></div>
                                <div className="form-group"><label>Description</label><textarea className="form-textarea" placeholder="Benefits of purchasing..." value={newShopItem.description} onChange={(e) => setNewShopItem({ ...newShopItem, description: e.target.value })} rows="3" /></div>
                                <div className="form-group">
                                  <label>Role Reward (Optional)</label>
                                  <select className="form-select" value={newShopItem.roleRewardId} onChange={(e) => setNewShopItem({ ...newShopItem, roleRewardId: e.target.value })}>
                                    <option value="">— No role —</option>
                                    {telemetry.guild.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                  </select>
                                </div>
                                <button className="btn btn-primary" type="submit" style={{ width: '100%' }}><Plus size={16} /> Publish Item</button>
                              </form>
                            </div>
                          </div>
                        )}

                        {/* ── MILESTONES ── */}
                        {activeTab === 'milestones' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title">Level Milestones</div>
                              <div className="table-container">
                                <table className="dashboard-table">
                                  <thead><tr><th>Level</th><th>Role Reward</th><th>Action</th></tr></thead>
                                  <tbody>
                                    {telemetry.levelRewards.map(r => {
                                      const role = telemetry.guild.roles.find(ro => ro.id === r.roleId);
                                      return (
                                        <tr key={r.level}>
                                          <td style={{ fontWeight: 700, fontSize: '16px' }}>Level {r.level}</td>
                                          <td><span style={{ color: role ? role.color : 'inherit', fontWeight: 600 }}>{role ? role.name : `ID:${r.roleId}`}</span></td>
                                          <td><button className="logout-btn" onClick={() => removeMilestone(r.level)}><Trash2 size={15} /></button></td>
                                        </tr>
                                      );
                                    })}
                                    {telemetry.levelRewards.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No milestones configured.</td></tr>}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
                              <div className="chart-title">Assign Milestone</div>
                              <form onSubmit={addMilestone}>
                                <div className="form-group"><label>Target Level</label><input className="form-input" type="number" placeholder="e.g. 5, 10, 20" value={newMilestone.level} onChange={(e) => setNewMilestone({ ...newMilestone, level: e.target.value })} required /></div>
                                <div className="form-group">
                                  <label>Award Role</label>
                                  <select className="form-select" value={newMilestone.roleId} onChange={(e) => setNewMilestone({ ...newMilestone, roleId: e.target.value })} required>
                                    <option value="">— Choose Role —</option>
                                    {telemetry.guild.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                  </select>
                                </div>
                                <button className="btn btn-primary" type="submit" style={{ width: '100%' }}><Plus size={16} /> Register Milestone</button>
                              </form>
                              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label>XP Generation Multiplier</label>
                                  <select className="form-select" value={telemetry.config.xpMultiplier} onChange={(e) => updateAutoModConfig({ xpMultiplier: parseFloat(e.target.value) })}>
                                    <option value="0.5">0.5× Slow</option>
                                    <option value="1.0">1.0× Standard</option>
                                    <option value="1.5">1.5× Boosted</option>
                                    <option value="2.0">2.0× Double XP</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* ── RANK CARD CUSTOMIZER ── */}
                            {(() => {
                              const RANK_THEMES_UI = {
                                cyber:    { label: 'Cyber',    bg: 'linear-gradient(135deg,#0F0C20,#06040A)', accent1: '#00F2FE', accent2: '#4FACFE', levelColor: '#F5A623' },
                                midnight: { label: 'Midnight', bg: 'linear-gradient(135deg,#060912,#040810)', accent1: '#3b9dff', accent2: '#8b5cf6', levelColor: '#38bdf8' },
                                forest:   { label: 'Forest',   bg: 'linear-gradient(135deg,#0a1a0f,#050d04)', accent1: '#00c853', accent2: '#69f0ae', levelColor: '#b9f6ca' },
                                sunset:   { label: 'Sunset',   bg: 'linear-gradient(135deg,#1a0a08,#0d0304)', accent1: '#ff4569', accent2: '#ff9100', levelColor: '#ffd740' },
                                aurora:   { label: 'Aurora',   bg: 'linear-gradient(135deg,#0a0813,#070510)', accent1: '#8b5cf6', accent2: '#ec4899', levelColor: '#a78bfa' },
                                neon:     { label: 'Neon',     bg: 'linear-gradient(135deg,#050515,#020208)', accent1: '#39ff14', accent2: '#ff00ff', levelColor: '#39ff14' },
                                ocean:    { label: 'Ocean',    bg: 'linear-gradient(135deg,#011020,#010810)', accent1: '#00e5ff', accent2: '#0ea5e9', levelColor: '#38bdf8' },
                                volcano:  { label: 'Volcano',  bg: 'linear-gradient(135deg,#1a0500,#0d0200)', accent1: '#ff6d00', accent2: '#ffab40', levelColor: '#ffd740' },
                                sakura:   { label: 'Sakura',   bg: 'linear-gradient(135deg,#1a0510,#0d0208)', accent1: '#f472b6', accent2: '#fda4af', levelColor: '#fbcfe8' },
                                gold:     { label: 'Gold',     bg: 'linear-gradient(135deg,#1a1200,#0d0900)', accent1: '#fbbf24', accent2: '#f59e0b', levelColor: '#fde68a' },
                                void:     { label: 'Void',     bg: 'linear-gradient(135deg,#050005,#020002)', accent1: '#7c3aed', accent2: '#c026d3', levelColor: '#ddd6fe' },
                              };
                              const previewTheme = RANK_THEMES_UI[rankCardTheme] || RANK_THEMES_UI.cyber;
                              const pa1 = rankCardAccent || previewTheme.accent1;
                              const pa2 = rankCardAccent || previewTheme.accent2;
                              return (
                                <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
                                  <div className="chart-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '24px' }}>
                                    <Award size={15} style={{ display: 'inline', marginRight: '8px', color: 'var(--primary)' }} />
                                    Rank Card Appearance
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'start' }}>
                                    <div>
                                      {/* Theme presets */}
                                      <div className="form-group">
                                        <label>Theme</label>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                                          {Object.entries(RANK_THEMES_UI).map(([key, th]) => (
                                            <button
                                              key={key}
                                              onClick={() => setRankCardTheme(key)}
                                              style={{
                                                background: th.bg,
                                                border: `2px solid ${rankCardTheme === key ? th.accent1 : 'rgba(255,255,255,0.08)'}`,
                                                borderRadius: '8px',
                                                padding: '10px 18px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'border-color 0.2s',
                                                minWidth: '90px',
                                              }}
                                            >
                                              <div style={{ display: 'flex', gap: '4px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.accent1 }} />
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.accent2 }} />
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.levelColor }} />
                                              </div>
                                              <span style={{ fontSize: '11px', fontWeight: 700, color: rankCardTheme === key ? th.accent1 : 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>
                                                {th.label}
                                              </span>
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Custom accent */}
                                      <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Custom Accent Color <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(overrides theme accent)</span></label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                          <input
                                            type="color"
                                            value={rankCardAccent || previewTheme.accent1}
                                            onChange={e => setRankCardAccent(e.target.value)}
                                            style={{ width: '48px', height: '38px', padding: '2px', border: '1px solid var(--border-hover)', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}
                                          />
                                          <input
                                            className="form-input"
                                            type="text"
                                            placeholder={previewTheme.accent1}
                                            value={rankCardAccent}
                                            onChange={e => setRankCardAccent(e.target.value)}
                                            style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                                          />
                                          {rankCardAccent && (
                                            <button className="btn btn-secondary" onClick={() => setRankCardAccent('')} style={{ whiteSpace: 'nowrap' }}>
                                              <X size={13} /> Reset
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      <button className="btn btn-primary" onClick={saveRankCard} style={{ marginTop: '8px' }}>
                                        <Award size={15} /> Save Rank Card
                                      </button>
                                    </div>

                                    {/* Live preview */}
                                    <div>
                                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '1.5px', marginBottom: '10px', textTransform: 'uppercase' }}>Preview</div>
                                      <div style={{ width: '475px', height: '150px', borderRadius: '14px', background: previewTheme.bg, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                                        {/* Ambient glows */}
                                        <div style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', width: '120px', height: '120px', borderRadius: '50%', background: `radial-gradient(circle, ${pa1}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
                                        <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: `radial-gradient(circle, ${pa2}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
                                        {/* Watermark rank */}
                                        <div style={{ position: 'absolute', right: '8px', bottom: '-6px', fontSize: '80px', fontWeight: 900, color: `${pa1}09`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', fontFamily: 'var(--font-display)' }}>#3</div>
                                        {/* Square avatar with gradient border */}
                                        <div style={{ position: 'absolute', left: '20px', top: '20px', width: '110px', height: '110px', borderRadius: '10px', background: `linear-gradient(135deg,${pa1},${pa2})`, padding: '2px' }}>
                                          <div style={{ width: '100%', height: '100%', borderRadius: '8px', background: '#1a1b2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>U</div>
                                        </div>
                                        {/* Content area */}
                                        <div style={{ position: 'absolute', left: '148px', top: '19px', right: '18px' }}>
                                          {/* Username */}
                                          <div style={{ fontSize: '23px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', marginBottom: '5px', paddingRight: '58px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Username</div>
                                          {/* Level pill */}
                                          <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', border: `1px solid ${previewTheme.levelColor}55`, background: `${previewTheme.levelColor}18`, marginBottom: '10px' }}>
                                            <span style={{ fontSize: '9px', fontWeight: 700, color: previewTheme.levelColor, fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>LEVEL  12</span>
                                          </div>
                                          {/* Progress bar */}
                                          <div style={{ position: 'relative', height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.06)', overflow: 'visible', marginBottom: '8px' }}>
                                            <div style={{ width: '62%', height: '100%', background: `linear-gradient(90deg,${pa1},${pa2})`, borderRadius: '5px', position: 'relative', overflow: 'hidden' }}>
                                              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '2px', background: `${pa2}ee`, boxShadow: `0 0 8px 2px ${pa2}88` }} />
                                            </div>
                                          </div>
                                          {/* XP row */}
                                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>1,240  /  2,000 XP</span>
                                            <span style={{ fontSize: '9px', fontWeight: 700, color: pa2 }}>62%</span>
                                          </div>
                                        </div>
                                        {/* Rank pill — top right */}
                                        <div style={{ position: 'absolute', top: '18px', right: '18px', padding: '4px 12px', borderRadius: '999px', background: `linear-gradient(90deg,${pa1}28,${pa2}28)`, border: `1px solid ${pa1}88` }}>
                                          <span style={{ fontSize: '9px', fontWeight: 700, color: pa1, fontFamily: 'var(--font-display)' }}># 3</span>
                                        </div>
                                        {/* Bottom accent line */}
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent 0%, ${pa1}bb 30%, ${pa2}bb 70%, transparent 100%)` }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* ── LOGS ── */}
                        {activeTab === 'logs' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Audit log table */}
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ marginBottom: '16px' }}>Audit Log</div>
                              <div className="search-bar-container">
                                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                  <label>Filter Category</label>
                                  <select className="form-select" value={logFilter} onChange={(e) => setLogFilter(e.target.value)}>
                                    <option value="ALL">All Incidents</option>
                                    <option value="WARN">Warnings</option>
                                    <option value="TIMEOUT">Timeouts</option>
                                    <option value="KICK">Kicks</option>
                                    <option value="BAN">Bans</option>
                                    <option value="ECONOMY">Economy</option>
                                    <option value="XP">Leveling</option>
                                  </select>
                                </div>
                              </div>
                              <div className="table-container">
                                <table className="dashboard-table">
                                  <thead><tr><th>Type</th><th>Member</th><th>Moderator</th><th>Reason</th><th>Date</th></tr></thead>
                                  <tbody>
                                    {telemetry.logs.filter(l => {
                                      if (logFilter === 'ALL') return true;
                                      if (logFilter === 'WARN') return l.type.includes('WARN');
                                      return l.type === logFilter || l.type.includes(logFilter);
                                    }).map(l => (
                                      <tr key={l.id}>
                                        <td><span className={`badge ${l.type.includes('BAN')||l.type.includes('KICK') ? 'badge-danger' : l.type.includes('WARN') ? 'badge-warning' : 'badge-primary'}`}>{l.type}</span></td>
                                        <td style={{ fontWeight: 600 }}>{members.find(m => m.id === l.userId)?.username || `ID:${l.userId}`}</td>
                                        <td>{members.find(m => m.id === l.moderatorId)?.username || `ID:${l.moderatorId}`}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{l.reason}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(l.timestamp).toLocaleString()}</td>
                                      </tr>
                                    ))}
                                    {telemetry.logs.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Audit stream is clean.</td></tr>}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Moderator stats */}
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Shield size={15} color="var(--primary)" /> Moderator Stats
                                <button className="btn btn-secondary" style={{ marginLeft: 'auto', fontSize: '12px', padding: '4px 10px' }} onClick={() => { setModstatsLoaded(false); fetchModstats(); }}><RefreshCw size={12} /></button>
                              </div>
                              {!modstatsLoaded ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}><RefreshCw className="animate-spin" size={20} color="var(--primary)" /></div>
                              ) : modstatsList.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '13px' }}>No moderation activity recorded yet.</div>
                              ) : (
                                <div className="table-container">
                                  <table className="dashboard-table">
                                    <thead><tr><th>Moderator</th><th>Warns</th><th>Timeouts</th><th>Kicks</th><th>Bans</th><th>Total</th></tr></thead>
                                    <tbody>
                                      {modstatsList.map(s => {
                                        const mod = members.find(m => m.id === s.moderatorId);
                                        return (
                                          <tr key={s.moderatorId}>
                                            <td style={{ fontWeight: 600 }}>
                                              {mod ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                  <img className="user-avatar-sm" src={mod.avatar} alt={mod.username} style={{ width: '24px', height: '24px' }} onError={e => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }} />
                                                  {mod.username}
                                                </div>
                                              ) : `ID:${s.moderatorId}`}
                                            </td>
                                            <td><span className="badge badge-warning">{s.WARN}</span></td>
                                            <td><span className="badge badge-primary">{s.TIMEOUT}</span></td>
                                            <td><span className="badge badge-warning">{s.KICK}</span></td>
                                            <td><span className="badge badge-danger">{s.BAN}</span></td>
                                            <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.total}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {/* ── ONBOARDING ── */}
                        {activeTab === 'onboarding' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {/* Welcome Messages */}
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
                                <UserPlus size={16} style={{ display: 'inline', marginRight: '8px', color: '#38bdf8' }} />
                                Welcome Messages
                              </div>
                              <div className="form-group">
                                <label>Welcome Channel</label>
                                <select className="form-select" value={welcomeChannelId} onChange={e => setWelcomeChannelId(e.target.value)}>
                                  <option value="">— Disabled —</option>
                                  {telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                </select>
                              </div>
                              <div className="form-group">
                                <label>Message Template</label>
                                <textarea
                                  className="form-textarea"
                                  rows="4"
                                  placeholder="Welcome {user} to {server}! You are member #{memberCount}."
                                  value={welcomeMessage}
                                  onChange={e => setWelcomeMessage(e.target.value)}
                                />
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                                  Placeholders: <code style={{ color: 'var(--primary)' }}>{'{user}'}</code> · <code style={{ color: 'var(--primary)' }}>{'{username}'}</code> · <code style={{ color: 'var(--primary)' }}>{'{server}'}</code> · <code style={{ color: 'var(--primary)' }}>{'{memberCount}'}</code>
                                </p>
                              </div>
                              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => updateAutoModConfig({ welcomeChannelId, welcomeMessage })}>
                                Save Welcome Config
                              </button>
                            </div>

                            {/* AutoRole */}
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
                                Auto Role
                              </div>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '20px' }}>
                                Automatically assign a role to every member who joins this server.
                              </p>
                              <div className="form-group">
                                <label>Auto-Assign Role</label>
                                <select className="form-select" value={autoRoleId} onChange={e => setAutoRoleId(e.target.value)}>
                                  <option value="">— Disabled —</option>
                                  {telemetry.guild.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                              </div>
                              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => updateAutoModConfig({ autoRoleId: autoRoleId || null })}>
                                Save AutoRole
                              </button>
                            </div>

                            {/* Reaction Roles – functional form */}
                            <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
                              <div className="chart-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '24px' }}>
                                <UserPlus size={15} style={{ display: 'inline', marginRight: '8px', color: '#38bdf8' }} />
                                Deploy Reaction Role Panel
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <form onSubmit={createReactionRole}>
                                  <div className="form-group">
                                    <label>Panel Title</label>
                                    <input className="form-input" type="text" placeholder="e.g. Choose Your Roles" value={newReactionRole.title} onChange={e => setNewReactionRole(p => ({ ...p, title: e.target.value }))} required />
                                  </div>
                                  <div className="form-group">
                                    <label>Description</label>
                                    <textarea className="form-textarea" rows="2" placeholder="Click a button below to toggle your role..." value={newReactionRole.description} onChange={e => setNewReactionRole(p => ({ ...p, description: e.target.value }))} required />
                                  </div>
                                  <div className="form-group">
                                    <label>Post In Channel</label>
                                    <select className="form-select" value={newReactionRole.channelId} onChange={e => setNewReactionRole(p => ({ ...p, channelId: e.target.value }))} required>
                                      <option value="">— Select Channel —</option>
                                      {telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                    </select>
                                  </div>
                                  <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
                                    <Plus size={15} /> Deploy Panel
                                  </button>
                                </form>
                                <div>
                                  <div className="form-group" style={{ marginBottom: '8px' }}>
                                    <label>Roles (up to 5)</label>
                                  </div>
                                  {newReactionRole.roleIds.map((rid, i) => (
                                    <div key={i} className="form-group" style={{ marginBottom: '10px' }}>
                                      <select
                                        className="form-select"
                                        value={rid}
                                        onChange={e => setNewReactionRole(p => {
                                          const next = [...p.roleIds];
                                          next[i] = e.target.value;
                                          return { ...p, roleIds: next };
                                        })}
                                      >
                                        <option value="">— Role {i + 1} (optional) —</option>
                                        {telemetry.guild.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                      </select>
                                    </div>
                                  ))}
                                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    Each selected role gets its own button. Members click to self-assign or remove.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Welcome Card Customizer */}
                            {(() => {
                              const WC_THEMES = {
                                cyber:    { label: 'Cyber',    bg: 'linear-gradient(135deg,#0F0C20,#06040A)', accent1: '#00F2FE', accent2: '#4FACFE' },
                                midnight: { label: 'Midnight', bg: 'linear-gradient(135deg,#060912,#040810)', accent1: '#3b9dff', accent2: '#8b5cf6' },
                                forest:   { label: 'Forest',   bg: 'linear-gradient(135deg,#0a1a0f,#050d04)', accent1: '#00c853', accent2: '#69f0ae' },
                                sunset:   { label: 'Sunset',   bg: 'linear-gradient(135deg,#1a0a08,#0d0304)', accent1: '#ff4569', accent2: '#ff9100' },
                                aurora:   { label: 'Aurora',   bg: 'linear-gradient(135deg,#0a0813,#070510)', accent1: '#8b5cf6', accent2: '#ec4899' },
                                neon:     { label: 'Neon',     bg: 'linear-gradient(135deg,#050515,#020208)', accent1: '#39ff14', accent2: '#ff00ff' },
                                ocean:    { label: 'Ocean',    bg: 'linear-gradient(135deg,#011020,#010810)', accent1: '#00e5ff', accent2: '#0ea5e9' },
                                volcano:  { label: 'Volcano',  bg: 'linear-gradient(135deg,#1a0500,#0d0200)', accent1: '#ff6d00', accent2: '#ffab40' },
                                sakura:   { label: 'Sakura',   bg: 'linear-gradient(135deg,#1a0510,#0d0208)', accent1: '#f472b6', accent2: '#fda4af' },
                                gold:     { label: 'Gold',     bg: 'linear-gradient(135deg,#1a1200,#0d0900)', accent1: '#fbbf24', accent2: '#f59e0b' },
                                void:     { label: 'Void',     bg: 'linear-gradient(135deg,#050005,#020002)', accent1: '#7c3aed', accent2: '#c026d3' },
                              };
                              const wt = WC_THEMES[welcomeCardTheme] || WC_THEMES.cyber;
                              const wa1 = welcomeCardAccent || wt.accent1;
                              const wa2 = welcomeCardAccent || wt.accent2;
                              return (
                                <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
                                  <div className="chart-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>
                                      <UserPlus size={15} style={{ display: 'inline', marginRight: '8px', color: '#38bdf8' }} />
                                      Welcome Card Appearance
                                    </span>
                                    {/* Enable toggle */}
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: welcomeCardEnabled ? wa1 : 'var(--text-muted)' }}>
                                      <span>{welcomeCardEnabled ? 'Card Enabled' : 'Card Disabled'}</span>
                                      <label className="switch" style={{ marginBottom: 0 }}>
                                        <input type="checkbox" checked={welcomeCardEnabled} onChange={e => setWelcomeCardEnabled(e.target.checked)} />
                                        <span className="slider" />
                                      </label>
                                    </label>
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'start' }}>
                                    <div>
                                      <div className="form-group">
                                        <label>Theme</label>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                                          {Object.entries(WC_THEMES).map(([key, th]) => (
                                            <button
                                              key={key}
                                              onClick={() => setWelcomeCardTheme(key)}
                                              style={{
                                                background: th.bg,
                                                border: `2px solid ${welcomeCardTheme === key ? th.accent1 : 'rgba(255,255,255,0.08)'}`,
                                                borderRadius: '8px',
                                                padding: '10px 18px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'border-color 0.2s',
                                                minWidth: '90px',
                                              }}
                                            >
                                              <div style={{ display: 'flex', gap: '4px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.accent1 }} />
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: th.accent2 }} />
                                              </div>
                                              <span style={{ fontSize: '11px', fontWeight: 700, color: welcomeCardTheme === key ? th.accent1 : 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>
                                                {th.label}
                                              </span>
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Custom Accent Color <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(overrides theme accent)</span></label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                          <input
                                            type="color"
                                            value={welcomeCardAccent || wt.accent1}
                                            onChange={e => setWelcomeCardAccent(e.target.value)}
                                            style={{ width: '48px', height: '38px', padding: '2px', border: '1px solid var(--border-hover)', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}
                                          />
                                          <input
                                            className="form-input"
                                            type="text"
                                            placeholder={wt.accent1}
                                            value={welcomeCardAccent}
                                            onChange={e => setWelcomeCardAccent(e.target.value)}
                                            style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                                          />
                                          {welcomeCardAccent && (
                                            <button className="btn btn-secondary" onClick={() => setWelcomeCardAccent('')} style={{ whiteSpace: 'nowrap' }}>
                                              <X size={13} /> Reset
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      <button className="btn btn-primary" onClick={saveWelcomeCard} style={{ marginTop: '8px' }}>
                                        <UserPlus size={15} /> Save Welcome Card
                                      </button>
                                    </div>

                                    {/* Live preview */}
                                    <div>
                                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', letterSpacing: '1.5px', marginBottom: '10px', textTransform: 'uppercase' }}>Preview</div>
                                      <div style={{
                                        width: '380px',
                                        height: '120px',
                                        borderRadius: '10px',
                                        background: wt.bg,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        flexShrink: 0,
                                        opacity: welcomeCardEnabled ? 1 : 0.45,
                                        transition: 'opacity 0.3s',
                                      }}>
                                        {/* Left accent bar */}
                                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: `linear-gradient(180deg,${wa1},${wa2})` }} />
                                        {/* Avatar ring mock */}
                                        <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', width: '60px', height: '60px', borderRadius: '50%', background: `linear-gradient(135deg,${wa1},${wa2})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: wt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>U</div>
                                        </div>
                                        {/* Text */}
                                        <div style={{ position: 'absolute', left: '92px', top: '18px', right: '12px' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>Username</div>
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: wa1, fontFamily: 'var(--font-display)' }}>WELCOME</span>
                                          </div>
                                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px' }}>Welcome to Server! · Member #42</div>
                                          {/* Accent bar */}
                                          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                            <div style={{ width: '15%', height: '100%', background: `linear-gradient(90deg,${wa1},${wa2})`, borderRadius: '3px' }} />
                                          </div>
                                        </div>
                                      </div>
                                      {!welcomeCardEnabled && (
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>
                                          Enable to send card on join
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* ── TICKETS ── */}
                        {activeTab === 'tickets' && (() => {
                          const openTickets = ticketsList.filter(t => t.status === 'open');
                          const closedTickets = ticketsList.filter(t => t.status === 'closed');
                          const TicketRow = ({ t }) => (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 120px', gap: '12px', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                              <div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: t.status === 'open' ? '#ff9100' : 'var(--text-secondary)', marginBottom: '2px' }}>#{t.channelName}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Opener: {t.openerTag || t.openerId}</div>
                              </div>
                              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{new Date(t.openedAt).toLocaleString()}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{t.closedAt ? new Date(t.closedAt).toLocaleString() : '—'}</div>
                              <div>
                                <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: t.status === 'open' ? 'rgba(255,145,0,0.12)' : 'rgba(100,100,120,0.18)', color: t.status === 'open' ? '#ff9100' : 'var(--text-muted)', border: `1px solid ${t.status === 'open' ? 'rgba(255,145,0,0.3)' : 'var(--border)'}` }}>
                                  {t.status === 'open' ? 'Open' : 'Closed'}
                                </span>
                              </div>
                            </div>
                          );
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                              {/* Header info bar */}
                              <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{ width: '48px', height: '48px', flexShrink: 0, borderRadius: 'var(--radius-md)', background: 'rgba(255,145,0,0.08)', border: '1px solid rgba(255,145,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <LifeBuoy size={24} color="#ff9100" />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Helpdesk Ticket System</h3>
                                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
                                    Members open private support channels with one click. Transcripts are sent on close.
                                  </p>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
                                  {[{ label: 'Open', val: openTickets.length, color: '#ff9100' }, { label: 'Closed', val: closedTickets.length, color: 'var(--text-muted)' }, { label: 'Total', val: ticketsList.length, color: 'var(--primary)' }].map(({ label, val, color }) => (
                                    <div key={label} style={{ textAlign: 'center' }}>
                                      <div style={{ fontSize: '22px', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{val}</div>
                                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                                    </div>
                                  ))}
                                  <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px', alignSelf: 'center' }} onClick={() => { setTicketsLoaded(false); fetchTickets(); }}>
                                    <RefreshCw size={13} />
                                  </button>
                                </div>
                              </div>

                              {/* Active tickets */}
                              <div className="glass-panel" style={{ padding: '24px' }}>
                                <div className="chart-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <LifeBuoy size={15} color="#ff9100" /> Active Tickets
                                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{openTickets.length} open</span>
                                </div>
                                {!ticketsLoaded ? (
                                  <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}><RefreshCw className="animate-spin" size={22} color="#ff9100" /></div>
                                ) : openTickets.length === 0 ? (
                                  <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
                                    <LifeBuoy size={36} style={{ marginBottom: '12px', opacity: 0.25 }} />
                                    <p style={{ fontSize: '13px' }}>No open tickets right now.</p>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 120px', gap: '12px', padding: '6px 16px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                      <span>Channel / Opener</span><span>Opened</span><span>Closed</span><span>Status</span>
                                    </div>
                                    {openTickets.map(t => <TicketRow key={t.id} t={t} />)}
                                  </div>
                                )}
                              </div>

                              {/* Closed tickets history */}
                              <div className="glass-panel" style={{ padding: '24px' }}>
                                <div className="chart-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <Award size={15} color="var(--text-muted)" /> Ticket History
                                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{closedTickets.length} closed</span>
                                </div>
                                {!ticketsLoaded ? (
                                  <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}><RefreshCw className="animate-spin" size={22} color="var(--text-muted)" /></div>
                                ) : closedTickets.length === 0 ? (
                                  <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
                                    <Award size={36} style={{ marginBottom: '12px', opacity: 0.2 }} />
                                    <p style={{ fontSize: '13px' }}>No closed tickets on record yet.</p>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 120px', gap: '12px', padding: '6px 16px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                      <span>Channel / Opener</span><span>Opened</span><span>Closed</span><span>Status</span>
                                    </div>
                                    {closedTickets.map(t => <TicketRow key={t.id} t={t} />)}
                                  </div>
                                )}
                              </div>

                              {/* Commands reference */}
                              <div className="glass-panel" style={{ padding: '20px 24px' }}>
                                <div className="chart-title" style={{ marginBottom: '14px' }}>Ticket Commands</div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                  {[
                                    { cmd: '/ticket setup', desc: 'Deploy helpdesk panel in a channel' },
                                    { cmd: '/ticket close', desc: 'Generate transcript and close ticket' },
                                    { cmd: '/ticket add [user]', desc: 'Grant user access to this ticket' },
                                    { cmd: '/ticket remove [user]', desc: 'Revoke access from a user' },
                                  ].map(({ cmd, desc }) => (
                                    <div key={cmd} style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', minWidth: '200px' }}>
                                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginBottom: '3px' }}>{cmd}</div>
                                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* ── GIVEAWAYS ── */}
                        {activeTab === 'giveaways' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }}>
                            {/* Active giveaways list */}
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Active Giveaways
                                <button className="btn btn-secondary" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={fetchGiveaways}><RefreshCw size={12} /></button>
                              </div>
                              {!giveawaysLoaded ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><RefreshCw className="animate-spin" size={24} color="#3b9dff" /></div>
                              ) : giveawaysList.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                                  <Gift size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                  <p>No active giveaways. Launch one using the form.</p>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  {giveawaysList.map(g => (
                                    <div key={g.id} style={{ padding: '16px', background: 'rgba(255,145,0,0.04)', border: '1px solid rgba(255,145,0,0.15)', borderRadius: 'var(--radius-md)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <div>
                                          <div style={{ fontWeight: 700, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}><Gift size={14} color="#ff9100" /> {g.prize}</div>
                                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{g.winnersCount} winner{g.winnersCount !== 1 ? 's' : ''} · ends {new Date(g.endsAt).toLocaleString()}</div>
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary" style={{ fontSize: '12px', borderColor: 'rgba(255,145,0,0.25)', color: '#ff9100' }} onClick={() => endGiveaway(g.id)}>End Now</button>
                                        <button className="btn btn-secondary" style={{ fontSize: '12px' }} onClick={() => rerollGiveaway(g.id)}>Reroll</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Launch giveaway form */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                              <div className="glass-panel" style={{ padding: '24px' }}>
                                <div className="chart-title" style={{ marginBottom: '20px' }}>
                                  <Gift size={14} style={{ display: 'inline', marginRight: '8px', color: '#ff9100' }} />
                                  Launch Giveaway
                                </div>
                                <form onSubmit={createGiveaway}>
                                  <div className="form-group">
                                    <label>Prize</label>
                                    <input className="form-input" type="text" placeholder="e.g. Discord Nitro" value={newGiveaway.prize} onChange={e => setNewGiveaway(p => ({ ...p, prize: e.target.value }))} required />
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                      <label>Duration</label>
                                      <select className="form-select" value={newGiveaway.duration} onChange={e => setNewGiveaway(p => ({ ...p, duration: e.target.value }))}>
                                        <option value="10m">10 Minutes</option>
                                        <option value="30m">30 Minutes</option>
                                        <option value="1h">1 Hour</option>
                                        <option value="6h">6 Hours</option>
                                        <option value="12h">12 Hours</option>
                                        <option value="24h">24 Hours</option>
                                        <option value="3d">3 Days</option>
                                        <option value="7d">7 Days</option>
                                      </select>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                      <label>Winners</label>
                                      <input className="form-input" type="number" min="1" max="20" value={newGiveaway.winners} onChange={e => setNewGiveaway(p => ({ ...p, winners: e.target.value }))} />
                                    </div>
                                  </div>
                                  <div className="form-group" style={{ marginTop: '12px' }}>
                                    <label>Channel</label>
                                    <select className="form-select" value={newGiveaway.channelId} onChange={e => setNewGiveaway(p => ({ ...p, channelId: e.target.value }))} required>
                                      <option value="">— Select Channel —</option>
                                      {telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                    </select>
                                  </div>
                                  <button className="btn btn-primary" type="submit" style={{ width: '100%' }}><Gift size={16} /> Launch Giveaway</button>
                                </form>
                              </div>

                              {/* Event creation form */}
                              <div className="glass-panel" style={{ padding: '24px' }}>
                                <div className="chart-title" style={{ marginBottom: '20px' }}>
                                  <Bell size={14} style={{ display: 'inline', marginRight: '8px', color: '#FFCC00' }} />
                                  Create Event
                                </div>
                                <form onSubmit={createEvent}>
                                  <div className="form-group">
                                    <label>Event Title</label>
                                    <input className="form-input" type="text" placeholder="e.g. Friday Night Gaming" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} required />
                                  </div>
                                  <div className="form-group">
                                    <label>Description</label>
                                    <textarea className="form-textarea" rows="2" placeholder="Event details and context..." value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))} required />
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                      <label>Date / Time</label>
                                      <input className="form-input" type="text" placeholder="Saturday at 8 PM EST" value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} required />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                      <label>Location</label>
                                      <input className="form-input" type="text" placeholder="Voice channel or venue" value={newEvent.location} onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))} required />
                                    </div>
                                  </div>
                                  <div className="form-group" style={{ marginTop: '12px' }}>
                                    <label>Post In</label>
                                    <select className="form-select" value={newEvent.channelId} onChange={e => setNewEvent(p => ({ ...p, channelId: e.target.value }))} required>
                                      <option value="">— Select Channel —</option>
                                      {telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                    </select>
                                  </div>
                                  <button className="btn btn-primary" type="submit" style={{ width: '100%', background: 'rgba(255,204,0,0.15)', borderColor: 'rgba(255,204,0,0.4)', color: '#FFCC00', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}><Calendar size={14} /> Deploy Event Card</button>
                                </form>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── CUSTOM COMMANDS ── */}
                        {activeTab === 'customcmds' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }}>
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ marginBottom: '20px' }}>Active Commands</div>
                              {!customCmdsLoaded ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                                  <RefreshCw className="animate-spin" size={24} color="#3b9dff" />
                                </div>
                              ) : customCmds.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                                  <Terminal size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                  <p>No custom commands yet. Add your first trigger below.</p>
                                </div>
                              ) : (
                                <div className="table-container">
                                  <table className="dashboard-table">
                                    <thead><tr><th>Trigger</th><th>Response</th><th>Action</th></tr></thead>
                                    <tbody>
                                      {customCmds.map(cmd => (
                                        <tr key={cmd.name}>
                                          <td><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>!{cmd.name}</span></td>
                                          <td style={{ color: 'var(--text-secondary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cmd.content}</td>
                                          <td><button className="logout-btn" onClick={() => removeCustomCmd(cmd.name)}><Trash2 size={15} /></button></td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>

                            <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
                              <div className="chart-title" style={{ marginBottom: '20px' }}>New Command</div>
                              <form onSubmit={addCustomCmd}>
                                <div className="form-group">
                                  <label>Trigger Name</label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '16px' }}>!</span>
                                    <input className="form-input" type="text" placeholder="rules" value={newCustomCmd.name} onChange={e => setNewCustomCmd(p => ({ ...p, name: e.target.value.replace(/\s/g, '') }))} required />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label>Response Text</label>
                                  <textarea className="form-textarea" rows="4" placeholder="The response message sent when the trigger is used..." value={newCustomCmd.text} onChange={e => setNewCustomCmd(p => ({ ...p, text: e.target.value }))} required />
                                </div>
                                <button className="btn btn-primary" type="submit" style={{ width: '100%' }}><Plus size={16} /> Create Command</button>
                              </form>
                              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-muted)' }}>
                                Tip: Use <code style={{ color: 'var(--primary)' }}>/customcmd embed</code> in Discord to create rich embed trigger commands.
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── ALERTS ── */}
                        {activeTab === 'alerts' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {/* YouTube */}
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <span style={{ fontSize: '9px', color: 'white', fontWeight: 900 }}>▶</span>
                                </div>
                                YouTube Alerts
                              </div>
                              <form onSubmit={e => addAlert(e, 'youtube')}>
                                <div className="form-group">
                                  <label>Channel URL</label>
                                  <input className="form-input" type="url" placeholder="https://youtube.com/@channel" value={newYTAlert.url} onChange={e => setNewYTAlert(p => ({ ...p, url: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                  <label>Notify In</label>
                                  <select className="form-select" value={newYTAlert.channelId} onChange={e => setNewYTAlert(p => ({ ...p, channelId: e.target.value }))} required>
                                    <option value="">— Select Channel —</option>
                                    {telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                  </select>
                                </div>
                                <button className="btn btn-primary" type="submit" style={{ width: '100%', background: 'rgba(255,0,0,0.8)', border: 'none' }}><Plus size={16} /> Add YouTube Alert</button>
                              </form>
                            </div>

                            {/* Twitch */}
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#9146FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Mic size={10} color="white" />
                                </div>
                                Twitch Alerts
                              </div>
                              <form onSubmit={e => addAlert(e, 'twitch')}>
                                <div className="form-group">
                                  <label>Twitch Username</label>
                                  <input className="form-input" type="text" placeholder="streamer_username" value={newTwitchAlert.username} onChange={e => setNewTwitchAlert(p => ({ ...p, username: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                  <label>Notify In</label>
                                  <select className="form-select" value={newTwitchAlert.channelId} onChange={e => setNewTwitchAlert(p => ({ ...p, channelId: e.target.value }))} required>
                                    <option value="">— Select Channel —</option>
                                    {telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                  </select>
                                </div>
                                <button className="btn btn-primary" type="submit" style={{ width: '100%', background: 'rgba(145,70,255,0.8)', border: 'none' }}><Plus size={16} /> Add Twitch Alert</button>
                              </form>
                            </div>

                            {/* Active subscriptions */}
                            <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
                              <div className="chart-title" style={{ marginBottom: '16px' }}>Active Subscriptions</div>
                              {!alertsLoaded ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                                  <RefreshCw className="animate-spin" size={24} color="#3b9dff" />
                                </div>
                              ) : alertsList.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No alert subscriptions configured. Add one above.</p>
                              ) : (
                                <div className="table-container">
                                  <table className="dashboard-table">
                                    <thead><tr><th>Platform</th><th>Target</th><th>Notify Channel</th><th>Action</th></tr></thead>
                                    <tbody>
                                      {alertsList.map(a => {
                                        const ch = telemetry.guild.channels.find(c => c.id === a.channelId);
                                        const identifier = a.platform === 'youtube' ? a.url : a.username;
                                        const key = `${a.platform}_${identifier}`;
                                        return (
                                          <tr key={key}>
                                            <td><span style={{ padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, background: a.platform === 'youtube' ? 'rgba(255,0,0,0.12)' : 'rgba(145,70,255,0.12)', color: a.platform === 'youtube' ? '#ff4444' : '#9146FF' }}>{a.platform === 'youtube' ? 'YouTube' : 'Twitch'}</span></td>
                                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>{identifier}</td>
                                            <td>{ch ? `# ${ch.name}` : a.channelId}</td>
                                            <td><button className="logout-btn" onClick={() => removeAlert(a.platform, identifier)}><Trash2 size={15} /></button></td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ── INVENTORY PANEL ── */}
                        {activeTab === 'inventory' && (() => {
                          const INV_CATS = {
                            all:   { label: 'All',   color: '#94a3b8' },
                            tool:  { label: 'Tools', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)' },
                            fish:  { label: 'Fish',  color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  border: 'rgba(34,211,238,0.25)' },
                            hunt:  { label: 'Hunt',  color: '#86efac', bg: 'rgba(134,239,172,0.12)', border: 'rgba(134,239,172,0.25)' },
                            dig:   { label: 'Dig',   color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)' },
                            food:  { label: 'Food',  color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.25)' },
                            loot:  { label: 'Loot',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)' },
                            other: { label: 'Other', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)' },
                          };
                          const getItemIcon = (name, size = 18) => {
                            const n = name.toLowerCase();
                            if (n.includes('rifle')) return <Target size={size} />;
                            if (n.includes('pole') || n.includes('fish') || n.includes('bass') || n.includes('salmon') || n.includes('goldfish') || n.includes('whale') || n.includes('coral') || n.includes('seaweed') || n.includes('boot')) return <Fish size={size} />;
                            if (n.includes('bear') || n.includes('deer') || n.includes('wolf') || n.includes('moose') || n.includes('elk')) return <PawPrint size={size} />;
                            if (n.includes('worm') || n.includes('fossil') || n.includes('shovel') || n.includes('vase') || n.includes('chest')) return <Pickaxe size={size} />;
                            if (n.includes('lootbox') || n.includes('crate')) return <Gift size={size} />;
                            if (n.includes('pizza')) return <PizzaIcon size={size} />;
                            return <Package size={size} />;
                          };
                          const uniqueHolders = new Set(inventoryList.map(i => i.user_id)).size;
                          const uniqueItems = new Set(inventoryList.map(i => i.item_name)).size;
                          const totalCount = inventoryList.reduce((s, i) => s + (i.count || 1), 0);
                          const topItem = inventoryList.length ? [...inventoryList].sort((a, b) => (b.count || 1) - (a.count || 1))[0] : null;

                          // Group items by user
                          const userMap = {};
                          for (const item of inventoryList) {
                            if (!userMap[item.user_id]) userMap[item.user_id] = [];
                            userMap[item.user_id].push(item);
                          }
                          const userEntries = Object.entries(userMap).sort((a, b) => {
                            const aTotal = a[1].reduce((s, i) => s + (i.count || 1), 0);
                            const bTotal = b[1].reduce((s, i) => s + (i.count || 1), 0);
                            return bTotal - aTotal;
                          });

                          // Selected user's items (with search + category filter)
                          const selectedUserItems = inventorySelectedUser
                            ? (userMap[inventorySelectedUser] || []).filter(i => {
                                const matchSearch = i.item_name.toLowerCase().includes(inventorySearch.toLowerCase());
                                const matchCat = inventoryCategory === 'all' || (i.item_type || 'other') === inventoryCategory;
                                return matchSearch && matchCat;
                              })
                            : [];
                          const selectedUserMember = inventorySelectedUser ? members.find(m => m.id === inventorySelectedUser) : null;

                          return (
                            <div>
                              {/* Stats row */}
                              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <div className="stat-card glass-panel" style={{ flex: '1', minWidth: '140px' }}>
                                  <div className="stat-icon-wrapper stat-icon-primary"><ShoppingBag size={20} /></div>
                                  <div className="stat-info"><h3>Total Items</h3><div className="stat-value">{totalCount}</div></div>
                                </div>
                                <div className="stat-card glass-panel" style={{ flex: '1', minWidth: '140px' }}>
                                  <div className="stat-icon-wrapper stat-icon-success"><Users size={20} /></div>
                                  <div className="stat-info"><h3>Holders</h3><div className="stat-value">{uniqueHolders}</div></div>
                                </div>
                                <div className="stat-card glass-panel" style={{ flex: '1', minWidth: '140px' }}>
                                  <div className="stat-icon-wrapper stat-icon-warning"><Sparkles size={20} /></div>
                                  <div className="stat-info"><h3>Unique Types</h3><div className="stat-value">{uniqueItems}</div></div>
                                </div>
                                {topItem && (
                                  <div className="stat-card glass-panel" style={{ flex: '1', minWidth: '140px' }}>
                                    <div className="stat-icon-wrapper" style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa' }}><Gift size={20} /></div>
                                    <div className="stat-info"><h3>Most Held</h3><div className="stat-value" style={{ fontSize: '13px', fontWeight: 700 }}>{topItem.item_name}</div></div>
                                  </div>
                                )}
                              </div>

                              {/* ── USER DETAIL VIEW ── */}
                              {inventorySelectedUser ? (
                                <div className="glass-panel" style={{ padding: '24px' }}>
                                  {/* Header */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <button
                                        onClick={() => { setInventorySelectedUser(null); setInventorySearch(''); setInventoryCategory('all'); }}
                                        style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                      >
                                        ← Back
                                      </button>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {selectedUserMember ? (
                                          <>
                                            <img src={selectedUserMember.avatar} alt={selectedUserMember.username} style={{ width: '32px', height: '32px', borderRadius: '50%' }} onError={e => e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'} />
                                            <div>
                                              <div style={{ fontWeight: 700, fontSize: '15px' }}>{selectedUserMember.username}</div>
                                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{inventorySelectedUser}</div>
                                            </div>
                                          </>
                                        ) : (
                                          <div style={{ fontWeight: 700, fontSize: '15px', fontFamily: 'var(--font-mono)' }}>{inventorySelectedUser}</div>
                                        )}
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <input className="form-input" type="text" placeholder="Search items..." value={inventorySearch} onChange={e => setInventorySearch(e.target.value)} style={{ width: '160px' }} />
                                      <button
                                        onClick={() => { setInventoryGrantForm({ itemName: '', count: '1' }); setInventoryGrantModal(true); }}
                                        style={{ padding: '7px 14px', borderRadius: '7px', border: '1px solid rgba(34,197,94,0.35)', background: 'rgba(34,197,94,0.1)', color: '#4ade80', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.2)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}
                                      >
                                        <Plus size={13} /> Grant Item
                                      </button>
                                    </div>
                                  </div>

                                  {/* Category tabs */}
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                    {Object.entries(INV_CATS).map(([key, cat]) => {
                                      const cnt = key === 'all' ? (userMap[inventorySelectedUser] || []).length : (userMap[inventorySelectedUser] || []).filter(i => (i.item_type || 'other') === key).length;
                                      if (key !== 'all' && cnt === 0) return null;
                                      return (
                                        <button key={key} onClick={() => setInventoryCategory(key)} style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: inventoryCategory === key ? cat.bg || 'rgba(59,157,255,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${inventoryCategory === key ? cat.border || 'rgba(59,157,255,0.35)' : 'var(--border)'}`, color: inventoryCategory === key ? cat.color : 'var(--text-muted)' }}>
                                          {cat.label} <span style={{ opacity: 0.6, fontSize: '11px' }}>{cnt}</span>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Items grid */}
                                  {!inventoryLoaded ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><RefreshCw className="animate-spin" size={28} color="#3b9dff" /></div>
                                  ) : selectedUserItems.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No items match your filters.</p>
                                  ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                      {selectedUserItems.map(item => {
                                        const cat = INV_CATS[item.item_type || 'other'] || INV_CATS.other;
                                        return (
                                          <div key={`${item.user_id}-${item.item_name}`} style={{ padding: '14px 16px', borderRadius: '10px', border: `1px solid ${cat.border || 'var(--border)'}`, background: cat.bg || 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
                                            {(item.count || 1) > 1 && (
                                              <div style={{ position: 'absolute', top: '10px', right: '10px', background: cat.bg, border: `1px solid ${cat.border}`, color: cat.color, borderRadius: '10px', padding: '1px 8px', fontSize: '11px', fontWeight: 700 }}>×{item.count}</div>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                              <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: cat.bg, border: `1px solid ${cat.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color, flexShrink: 0 }}>{getItemIcon(item.item_name)}</div>
                                              <div>
                                                <div style={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.2 }}>{item.item_name}</div>
                                                <div style={{ fontSize: '11px', marginTop: '3px', display: 'inline-flex', alignItems: 'center', padding: '1px 7px', borderRadius: '8px', background: cat.bg, border: `1px solid ${cat.border}`, color: cat.color, fontWeight: 600, textTransform: 'capitalize' }}>{cat.label}</div>
                                              </div>
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>{item.acquired_at ? new Date(item.acquired_at).toLocaleDateString() : '—'}</div>
                                            <button onClick={() => removeInventoryItem(item.user_id, item.item_name)} style={{ width: '100%', padding: '6px', borderRadius: '7px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                                              <Trash2 size={12} /> Remove{(item.count || 1) > 1 ? ` all ${item.count}` : ''}
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Grant item modal */}
                                  {inventoryGrantModal && (
                                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setInventoryGrantModal(false)}>
                                      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px', width: '360px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
                                        <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <Plus size={16} style={{ color: '#4ade80' }} /> Grant Item to {selectedUserMember?.username || inventorySelectedUser}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                          <div>
                                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Item Name</label>
                                            <input className="form-input" type="text" placeholder="e.g. Fishing Pole" value={inventoryGrantForm.itemName} onChange={e => setInventoryGrantForm(f => ({ ...f, itemName: e.target.value }))} style={{ width: '100%' }} autoFocus />
                                          </div>
                                          <div>
                                            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Quantity</label>
                                            <input className="form-input" type="number" min="1" max="100" value={inventoryGrantForm.count} onChange={e => setInventoryGrantForm(f => ({ ...f, count: e.target.value }))} style={{ width: '100%' }} />
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setInventoryGrantModal(false)}>Cancel</button>
                                          <button
                                            className="btn btn-primary"
                                            style={{ flex: 1 }}
                                            disabled={!inventoryGrantForm.itemName.trim()}
                                            onClick={async () => {
                                              await grantInventoryItem(inventorySelectedUser, inventoryGrantForm.itemName.trim(), inventoryGrantForm.count);
                                              setInventoryGrantModal(false);
                                            }}
                                          >Grant</button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                /* ── USER LIST VIEW ── */
                                <div className="glass-panel" style={{ padding: '24px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                    <div className="chart-title" style={{ marginBottom: 0 }}>Inventory by User</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <input className="form-input" type="text" placeholder="Search users..." value={inventorySearch} onChange={e => setInventorySearch(e.target.value)} style={{ width: '180px' }} />
                                      <button className="btn btn-secondary" onClick={() => { setInventoryLoaded(false); fetchInventory(); }}><RefreshCw size={14} /></button>
                                    </div>
                                  </div>
                                  {!inventoryLoaded ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><RefreshCw className="animate-spin" size={28} color="#3b9dff" /></div>
                                  ) : userEntries.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No items yet. Players earn items via /fish, /hunt, /dig, or /buy.</p>
                                  ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                                      {userEntries
                                        .filter(([uid]) => {
                                          if (!inventorySearch) return true;
                                          const m = members.find(m => m.id === uid);
                                          return uid.includes(inventorySearch) || (m && m.username.toLowerCase().includes(inventorySearch.toLowerCase()));
                                        })
                                        .map(([uid, items]) => {
                                          const m = members.find(m => m.id === uid);
                                          const total = items.reduce((s, i) => s + (i.count || 1), 0);
                                          const typeBreakdown = {};
                                          for (const item of items) { const t = item.item_type || 'other'; typeBreakdown[t] = (typeBreakdown[t] || 0) + (item.count || 1); }
                                          return (
                                            <div
                                              key={uid}
                                              onClick={() => { setInventorySelectedUser(uid); setInventorySearch(''); setInventoryCategory('all'); }}
                                              style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: '12px' }}
                                              onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(59,157,255,0.4)'; e.currentTarget.style.background = 'rgba(59,157,255,0.05)'; }}
                                              onMouseLeave={e => { e.currentTarget.style.border = '1px solid var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                                            >
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {m ? (
                                                  <img src={m.avatar} alt={m.username} style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} onError={e => e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'} />
                                                ) : (
                                                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59,157,255,0.12)', border: '1px solid rgba(59,157,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Users size={16} color="#3b9dff" /></div>
                                                )}
                                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                                  <div style={{ fontWeight: 700, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m ? m.username : uid}</div>
                                                  {m && <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{uid}</div>}
                                                </div>
                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#3b9dff' }}>{total}</div>
                                                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>items</div>
                                                </div>
                                              </div>
                                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {Object.entries(typeBreakdown).map(([type, cnt]) => {
                                                  const cat = INV_CATS[type] || INV_CATS.other;
                                                  return (
                                                    <span key={type} style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '8px', background: cat.bg, border: `1px solid ${cat.border}`, color: cat.color }}>
                                                      {cat.label} {cnt}
                                                    </span>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* ── PETS PANEL ── */}
                        {activeTab === 'pets' && (
                          <div>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                              <div className="stat-card glass-panel" style={{ flex: '1', minWidth: '160px' }}>
                                <div className="stat-icon-wrapper stat-icon-primary"><Sparkles size={20} /></div>
                                <div className="stat-info"><h3>Total Pets</h3><div className="stat-value">{petsList.length}</div></div>
                              </div>
                              <div className="stat-card glass-panel" style={{ flex: '1', minWidth: '160px' }}>
                                <div className="stat-icon-wrapper stat-icon-warning"><Award size={20} /></div>
                                <div className="stat-info"><h3>Highest Level</h3><div className="stat-value">{petsList.length ? Math.max(...petsList.map(p => p.level)) : 0}</div></div>
                              </div>
                              <div className="stat-card glass-panel" style={{ flex: '1', minWidth: '160px' }}>
                                <div className="stat-icon-wrapper stat-icon-success"><Zap size={20} /></div>
                                <div className="stat-info"><h3>Avg Level</h3><div className="stat-value">{petsList.length ? (petsList.reduce((s, p) => s + p.level, 0) / petsList.length).toFixed(1) : '—'}</div></div>
                              </div>
                            </div>
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div className="chart-title" style={{ marginBottom: 0 }}>All Server Pets</div>
                                <button className="btn btn-secondary" onClick={() => { setPetsLoaded(false); fetchPets(); }}><RefreshCw size={14} /></button>
                              </div>
                              {!petsLoaded ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><RefreshCw className="animate-spin" size={28} color="#3b9dff" /></div>
                              ) : petsList.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No pets adopted yet. Players can use /pet adopt to get started!</p>
                              ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                  {petsList.map(pet => {
                                    const owner = members.find(m => m.id === pet.userId);
                                    const PetIcon = pet.petType === 'Dog' ? Dog : pet.petType === 'Cat' ? Cat : pet.petType === 'Dragon' ? Flame : pet.petType === 'Fox' ? PawPrint : pet.petType === 'Rabbit' ? Rabbit : PawPrint;
                                    const hungerColor = pet.hunger > 60 ? '#00e676' : pet.hunger > 30 ? '#ffb300' : '#ff1744';
                                    const energyColor = pet.energy > 60 ? '#00b0ff' : pet.energy > 30 ? '#ffb300' : '#ff1744';
                                    return (
                                      <div key={pet.id} className="glass-panel" style={{ padding: '18px', border: '1px solid var(--border)', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: '8px', right: '8px', opacity: 0.06 }}><PetIcon size={72} /></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                                          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', flexShrink: 0 }}><PetIcon size={24} /></div>
                                          <div>
                                            <div style={{ fontWeight: 700, fontSize: '15px' }}>{pet.petName}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pet.petType}</div>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '10px', padding: '1px 8px', fontSize: '11px', fontWeight: 700, color: '#a78bfa', fontFamily: 'var(--font-display)' }}>LVL {pet.level}</div>
                                          </div>
                                        </div>
                                        {owner && (
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                                            <img src={owner.avatar} alt={owner.username} style={{ width: '20px', height: '20px', borderRadius: '50%' }} onError={e => e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'} />
                                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{owner.username}</span>
                                          </div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          {[
                                            { label: 'Hunger', Icon: UtensilsCrossed, val: pet.hunger, color: hungerColor },
                                            { label: 'Affection', Icon: Heart, val: pet.affection, color: '#e879f9' },
                                            { label: 'Energy', Icon: Zap, val: pet.energy, color: energyColor },
                                          ].map(stat => (
                                            <div key={stat.label}>
                                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                                                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><stat.Icon size={11} />{stat.label}</span>
                                                <span style={{ fontWeight: 700, color: stat.color }}>{stat.val}/100</span>
                                              </div>
                                              <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                                                <div style={{ width: `${stat.val}%`, height: '100%', background: stat.color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Swords size={11} /> ATK: <strong style={{ color: '#f87171' }}>{pet.attack}</strong></span>
                                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={11} /> DEF: <strong style={{ color: '#60a5fa' }}>{pet.defense}</strong></span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                                          <button className="btn btn-secondary" style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }} onClick={() => adminFeedPet(pet.id)} title="Restore all stats to 100">
                                            <UtensilsCrossed size={11} /> Restore
                                          </button>
                                          <button className="btn btn-secondary" style={{ flex: 1, fontSize: '11px', padding: '6px 8px' }} onClick={() => { setPetEditModal(pet); setPetEditForm({ hunger: pet.hunger, energy: pet.energy, affection: pet.affection, level: pet.level }); }} title="Edit pet stats">
                                            <Swords size={11} /> Edit
                                          </button>
                                          <button className="btn" style={{ flex: 1, fontSize: '11px', padding: '6px 8px', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }} onClick={() => adminDeletePet(pet.id)} title="Delete pet">
                                            <Trash2 size={11} /> Delete
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ── MARKET PANEL ── */}
                        {activeTab === 'market' && (() => {
                          const filteredMarket = marketList.filter(l =>
                            l.itemName.toLowerCase().includes(marketSearch.toLowerCase()) ||
                            l.sellerId.includes(marketSearch)
                          );
                          const totalValue = marketList.reduce((s, l) => s + l.price, 0);
                          return (
                            <div>
                              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <div className="stat-card glass-panel" style={{ flex: '1', minWidth: '160px' }}>
                                  <div className="stat-icon-wrapper stat-icon-primary"><Zap size={20} /></div>
                                  <div className="stat-info"><h3>Active Listings</h3><div className="stat-value">{marketList.length}</div></div>
                                </div>
                                <div className="stat-card glass-panel" style={{ flex: '1', minWidth: '160px' }}>
                                  <div className="stat-icon-wrapper stat-icon-success"><Coins size={20} /></div>
                                  <div className="stat-info"><h3>Total Market Value</h3><div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Coins size={18} />{totalValue.toLocaleString()}</div></div>
                                </div>
                                <div className="stat-card glass-panel" style={{ flex: '1', minWidth: '160px' }}>
                                  <div className="stat-icon-wrapper stat-icon-warning"><Users size={20} /></div>
                                  <div className="stat-info"><h3>Unique Sellers</h3><div className="stat-value">{[...new Set(marketList.map(l => l.sellerId))].length}</div></div>
                                </div>
                              </div>
                              <div className="glass-panel" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                  <div className="chart-title" style={{ marginBottom: 0 }}>Live Market Listings</div>
                                  <div style={{ display: 'flex', gap: '10px' }}>
                                    <input className="form-input" type="text" placeholder="Search item or seller ID..." value={marketSearch} onChange={e => setMarketSearch(e.target.value)} style={{ width: '220px' }} />
                                    <button className="btn btn-secondary" onClick={() => { setMarketLoaded(false); fetchMarket(); }}><RefreshCw size={14} /></button>
                                  </div>
                                </div>
                                {!marketLoaded ? (
                                  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><RefreshCw className="animate-spin" size={28} color="#3b9dff" /></div>
                                ) : filteredMarket.length === 0 ? (
                                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>{marketSearch ? 'No results match your search.' : 'No active market listings. Players can use /market list to sell items.'}</p>
                                ) : (
                                  <div className="table-container">
                                    <table className="dashboard-table">
                                      <thead><tr><th>Item</th><th>Price</th><th>Seller</th><th>Listed</th><th>Admin Action</th></tr></thead>
                                      <tbody>
                                        {filteredMarket.map(listing => {
                                          const seller = members.find(m => m.id === listing.sellerId);
                                          return (
                                            <tr key={listing.id}>
                                              <td>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                                                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                                                    {listing.itemName.includes('Fish') || listing.itemName.includes('fish') || listing.itemName.includes('Pole') ? <Fish size={16} /> :
                                                     listing.itemName.includes('Deer') || listing.itemName.includes('Bear') ? <PawPrint size={16} /> :
                                                     listing.itemName.includes('Lootbox') ? <Gift size={16} /> :
                                                     listing.itemName.includes('Rifle') ? <Target size={16} /> :
                                                     listing.itemName.includes('Shovel') ? <Pickaxe size={16} /> :
                                                     listing.itemName.includes('Pizza') ? <PizzaIcon size={16} /> :
                                                     <Package size={16} />}
                                                  </span>
                                                  <strong>{listing.itemName}</strong>
                                                </span>
                                              </td>
                                              <td>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#00e676' }}>
                                                  <Coins size={13} />{listing.price.toLocaleString()}
                                                </span>
                                              </td>
                                              <td>
                                                {seller ? (
                                                  <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                                    <img src={seller.avatar} alt={seller.username} style={{ width: '22px', height: '22px', borderRadius: '50%' }} onError={e => e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'} />
                                                    {seller.username}
                                                  </span>
                                                ) : <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{listing.sellerId}</span>}
                                              </td>
                                              <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{listing.createdAt ? new Date(listing.createdAt).toLocaleString() : '—'}</td>
                                              <td>
                                                <button className="logout-btn" title="Remove listing & return item to seller" onClick={() => removeMarketListing(listing.id)} style={{ color: 'var(--danger)' }}><Trash2 size={15} /></button>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* ── JOBS ── */}
                        {activeTab === 'jobs' && (() => {
                          const JOBS_DEF = {
                            // Tier 1
                            cashier:     { name: 'Cashier',            emoji: '🛒', tier: 1, levelRequired: 1,  minPay: 60,   maxPay: 130,   xpBonus: 0,  description: 'Scan items and manage the checkout lane at a local store.' },
                            performer:   { name: 'Street Performer',   emoji: '🎸', tier: 1, levelRequired: 1,  minPay: 20,   maxPay: 300,   xpBonus: 5,  description: 'Entertain passersby for tips — volatile but potentially lucrative.' },
                            delivery:    { name: 'Delivery Driver',    emoji: '🚗', tier: 1, levelRequired: 1,  minPay: 80,   maxPay: 180,   xpBonus: 5,  description: 'Deliver packages across the city on a tight schedule.' },
                            janitor:     { name: 'Janitor',            emoji: '🧹', tier: 1, levelRequired: 1,  minPay: 50,   maxPay: 110,   xpBonus: 0,  description: 'Keep facilities spotless — steady, reliable, unglamorous.' },
                            barista:     { name: 'Barista',            emoji: '☕', tier: 1, levelRequired: 1,  minPay: 70,   maxPay: 160,   xpBonus: 0,  description: 'Craft espresso drinks and charm café regulars for tips.' },
                            farmhand:    { name: 'Farmhand',           emoji: '🌾', tier: 1, levelRequired: 1,  minPay: 55,   maxPay: 140,   xpBonus: 8,  description: 'Work the fields from dawn to dusk — honest outdoor labour.' },
                            // Tier 2
                            chef:        { name: 'Chef',               emoji: '👨‍🍳', tier: 2, levelRequired: 5,  minPay: 420,  maxPay: 780,   xpBonus: 12, description: 'Cook gourmet dishes under pressure in a busy restaurant kitchen.' },
                            mechanic:    { name: 'Mechanic',           emoji: '🔧', tier: 2, levelRequired: 5,  minPay: 450,  maxPay: 850,   xpBonus: 10, description: 'Diagnose and repair vehicles and heavy machinery at the garage.' },
                            guard:       { name: 'Security Guard',     emoji: '💂', tier: 2, levelRequired: 5,  minPay: 400,  maxPay: 680,   xpBonus: 0,  description: 'Patrol premises and maintain order at venues and events.' },
                            plumber:     { name: 'Plumber',            emoji: '🪠', tier: 2, levelRequired: 5,  minPay: 480,  maxPay: 900,   xpBonus: 10, description: 'Fix leaks, install pipework, and keep water flowing.' },
                            electrician: { name: 'Electrician',        emoji: '⚡', tier: 2, levelRequired: 5,  minPay: 500,  maxPay: 920,   xpBonus: 12, description: 'Wire buildings, replace fuses, and troubleshoot circuits.' },
                            nurse:       { name: 'Nurse',              emoji: '🏥', tier: 2, levelRequired: 5,  minPay: 440,  maxPay: 820,   xpBonus: 15, description: 'Care for patients, administer medication, and assist surgeons.' },
                            // Tier 3
                            engineer:    { name: 'Software Engineer',  emoji: '💻', tier: 3, levelRequired: 10, minPay: 1400, maxPay: 2800,  xpBonus: 25, description: 'Build and ship software products at a fast-growing tech company.' },
                            doctor:      { name: 'Doctor',             emoji: '🩺', tier: 3, levelRequired: 10, minPay: 1800, maxPay: 3500,  xpBonus: 20, description: 'Treat patients, run diagnostics, and perform clinical procedures.' },
                            lawyer:      { name: 'Lawyer',             emoji: '⚖️', tier: 3, levelRequired: 10, minPay: 1600, maxPay: 3200,  xpBonus: 15, description: 'Argue high-profile cases and draft watertight contracts.' },
                            architect:   { name: 'Architect',          emoji: '🏗️', tier: 3, levelRequired: 10, minPay: 1200, maxPay: 2400,  xpBonus: 20, description: 'Design striking buildings and oversee construction projects.' },
                            pharmacist:  { name: 'Pharmacist',         emoji: '💊', tier: 3, levelRequired: 10, minPay: 1300, maxPay: 2600,  xpBonus: 18, description: 'Dispense medication, counsel patients, and manage drug inventory.' },
                            analyst:     { name: 'Financial Analyst',  emoji: '📊', tier: 3, levelRequired: 10, minPay: 1250, maxPay: 2500,  xpBonus: 15, description: 'Model markets, build forecasts, and advise on financial strategy.' },
                            // Tier 4
                            ceo:         { name: 'CEO',                emoji: '🏢', tier: 4, levelRequired: 20, minPay: 8000, maxPay: 16000, xpBonus: 30, description: 'Lead a corporation, close deals, and drive shareholder value.' },
                            banker:      { name: 'Investment Banker',  emoji: '💰', tier: 4, levelRequired: 20, minPay: 6000, maxPay: 14000, xpBonus: 20, description: 'Execute M&A deals, IPOs, and large-scale financial transactions.' },
                            gamedev:     { name: 'Game Developer',     emoji: '🎮', tier: 4, levelRequired: 20, minPay: 5000, maxPay: 10000, xpBonus: 35, description: 'Design and ship immersive games that top the download charts.' },
                            surgeon:     { name: 'Surgeon',            emoji: '🔬', tier: 4, levelRequired: 20, minPay: 9000, maxPay: 18000, xpBonus: 25, description: 'Perform complex surgical procedures with precision and composure.' },
                            aerospace:   { name: 'Aerospace Engineer', emoji: '🚀', tier: 4, levelRequired: 20, minPay: 5500, maxPay: 11000, xpBonus: 30, description: 'Design spacecraft, propulsion systems, and aerospace hardware.' },
                            hedgefund:   { name: 'Hedge Fund Manager', emoji: '📈', tier: 4, levelRequired: 20, minPay: 5000, maxPay: 20000, xpBonus: 20, description: 'Run a multi-billion fund — extreme volatility, extreme rewards.' },
                          };
                          const TIER_COLORS = { 1: '#9CA3AF', 2: '#60A5FA', 3: '#A78BFA', 4: '#FBBF24' };
                          const TIER_LABELS = { 1: 'Starter', 2: 'Skilled', 3: 'Professional', 4: 'Elite' };

                          const employedMap = {};
                          jobsList.forEach(j => { employedMap[j.userId] = j.jobKey; });

                          const jobCounts = {};
                          jobsList.forEach(j => { jobCounts[j.jobKey] = (jobCounts[j.jobKey] || 0) + 1; });
                          const topJob = Object.entries(jobCounts).sort((a, b) => b[1] - a[1])[0];

                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                              {/* Stats row */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                {[
                                  { label: 'Employed Members', value: jobsList.length },
                                  { label: 'Unemployed Members', value: Math.max(0, members.length - jobsList.length) },
                                  { label: 'Most Popular Job', value: topJob ? `${JOBS_DEF[topJob[0]]?.emoji} ${JOBS_DEF[topJob[0]]?.name}` : '—' },
                                ].map(s => (
                                  <div key={s.label} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>{s.label}</div>
                                    <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{s.value}</div>
                                  </div>
                                ))}
                              </div>

                              {/* Job catalogue */}
                              <div className="glass-panel" style={{ padding: '24px' }}>
                                <div className="chart-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Briefcase size={15} style={{ color: 'var(--primary)' }} />
                                  Job Catalogue
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                                  {[1, 2, 3, 4].map(tier => (
                                    <div key={tier} style={{ display: 'contents' }}>
                                      {Object.entries(JOBS_DEF).filter(([, j]) => j.tier === tier).map(([key, job]) => {
                                        const count = jobCounts[key] || 0;
                                        return (
                                          <div key={key} style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: `1px solid ${TIER_COLORS[tier]}22`, position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: TIER_COLORS[tier] }} />
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                              <span style={{ fontSize: '24px', lineHeight: 1 }}>{job.emoji}</span>
                                              <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                                                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{job.name}</span>
                                                  <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '999px', background: `${TIER_COLORS[tier]}22`, color: TIER_COLORS[tier], fontFamily: 'var(--font-display)', fontWeight: 700 }}>{TIER_LABELS[tier]}</span>
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{job.description}</div>
                                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                                  <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>🪙 {job.minPay}–{job.maxPay}/shift</span>
                                                  {job.xpBonus > 0 && <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 600 }}>+{job.xpBonus} XP/shift</span>}
                                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lv {job.levelRequired}+</span>
                                                  {count > 0 && <span style={{ fontSize: '11px', color: TIER_COLORS[tier], fontWeight: 600 }}>{count} employed</span>}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Employed members */}
                              <div className="glass-panel" style={{ padding: '24px' }}>
                                <div className="chart-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Users size={15} style={{ color: 'var(--primary)' }} />
                                  Member Employment
                                  <button className="btn btn-secondary" style={{ marginLeft: 'auto', fontSize: '12px', padding: '4px 10px' }} onClick={() => { setJobsLoaded(false); fetchJobs(); }}>
                                    <RefreshCw size={12} /> Refresh
                                  </button>
                                </div>
                                {!jobsLoaded ? (
                                  <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}><RefreshCw className="animate-spin" size={20} color="var(--primary)" /></div>
                                ) : (
                                  <div className="table-container">
                                    <table className="dashboard-table">
                                      <thead><tr><th>Member</th><th>Job</th><th>Tier</th><th>Pay Range</th><th>XP Bonus</th><th>Actions</th></tr></thead>
                                      <tbody>
                                        {members.map(m => {
                                          const jobKey = employedMap[m.id];
                                          const job    = jobKey ? JOBS_DEF[jobKey] : null;
                                          return (
                                            <tr key={m.id}>
                                              <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                  <img className="user-avatar-sm" src={m.avatar} alt={m.username} style={{ width: '28px', height: '28px', borderRadius: '6px' }} onError={e => { e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'; }} />
                                                  <span style={{ fontWeight: 600 }}>{m.username}</span>
                                                </div>
                                              </td>
                                              <td>
                                                {job ? (
                                                  <span>{job.emoji} {job.name}</span>
                                                ) : (
                                                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Unemployed</span>
                                                )}
                                              </td>
                                              <td>
                                                {job ? (
                                                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '999px', background: `${TIER_COLORS[job.tier]}22`, color: TIER_COLORS[job.tier], fontWeight: 700 }}>{TIER_LABELS[job.tier]}</span>
                                                ) : '—'}
                                              </td>
                                              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#10B981' }}>
                                                {job ? `🪙 ${job.minPay}–${job.maxPay}` : '🪙 50–150'}
                                              </td>
                                              <td style={{ fontSize: '12px', color: '#8B5CF6' }}>
                                                {job && job.xpBonus > 0 ? `+${job.xpBonus} XP` : '—'}
                                              </td>
                                              <td>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                  <button className="btn btn-secondary" style={{ fontSize: '11px', padding: '3px 10px' }} onClick={() => { setJobsAssignModal(m); setJobsAssignKey(jobKey || ''); }}>
                                                    Assign
                                                  </button>
                                                  {job && (
                                                    <button className="btn btn-danger" style={{ fontSize: '11px', padding: '3px 10px' }} onClick={() => adminClearJob(m.id)}>
                                                      Fire
                                                    </button>
                                                  )}
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                        {members.length === 0 && (
                                          <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No members found.</td></tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>

                              {/* Assign job modal */}
                              {jobsAssignModal && (
                                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                                  <div className="glass-panel" style={{ padding: '28px', minWidth: '360px', maxWidth: '440px', position: 'relative' }}>
                                    <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setJobsAssignModal(null)}><X size={18} /></button>
                                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Assign Job</div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                      Assigning job for <strong>{jobsAssignModal.username}</strong>. Bypasses level requirements.
                                    </div>
                                    <div className="form-group">
                                      <label>Job</label>
                                      <select className="form-select" value={jobsAssignKey} onChange={e => setJobsAssignKey(e.target.value)}>
                                        <option value="">— Select a job —</option>
                                        {[1, 2, 3, 4].map(tier => (
                                          <optgroup key={tier} label={`Tier ${tier} — ${TIER_LABELS[tier]}`}>
                                            {Object.entries(JOBS_DEF).filter(([, j]) => j.tier === tier).map(([key, job]) => (
                                              <option key={key} value={key}>{job.emoji} {job.name}</option>
                                            ))}
                                          </optgroup>
                                        ))}
                                      </select>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                      <button className="btn btn-primary" style={{ flex: 1 }} disabled={!jobsAssignKey} onClick={async () => { await adminSetJob(jobsAssignModal.id, jobsAssignKey); setJobsAssignModal(null); }}>
                                        <Briefcase size={14} /> Assign
                                      </button>
                                      <button className="btn btn-secondary" onClick={() => setJobsAssignModal(null)}>Cancel</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* ── STOCKS & PORTFOLIO ── */}
                        {activeTab === 'stocks' && (() => {
                          const MARKETS = ['ALL', 'NASDAQ', 'NSE', 'LSE', 'CRYPTO', 'TYO', 'ASX'];
                          const filtered = stockCatalog.filter(s =>
                            (stockMarketFilter === 'ALL' || s.market === stockMarketFilter) &&
                            (s.symbol.toLowerCase().includes(stockSearch.toLowerCase()) || s.name.toLowerCase().includes(stockSearch.toLowerCase()))
                          );

                          // SVG Sparkline helper
                          const Sparkline = ({ points, isUp, width = 600, height = 120 }) => {
                            if (!points || points.length < 2) return null;
                            const prices = points.map(p => p.price);
                            const minP = Math.min(...prices);
                            const maxP = Math.max(...prices);
                            const range = maxP - minP || 1;
                            const pad = { top: 10, bottom: 10, left: 4, right: 4 };
                            const w = width - pad.left - pad.right;
                            const h = height - pad.top - pad.bottom;
                            const toX = (i) => pad.left + (i / (points.length - 1)) * w;
                            const toY = (p) => pad.top + h - ((p - minP) / range) * h;
                            const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(p.price).toFixed(1)}`).join(' ');
                            const fillD = `${pathD} L ${toX(points.length - 1).toFixed(1)} ${(pad.top + h).toFixed(1)} L ${pad.left.toFixed(1)} ${(pad.top + h).toFixed(1)} Z`;
                            const color = isUp ? '#00e676' : '#ff1744';
                            return (
                              <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
                                <defs>
                                  <linearGradient id={`sg_${isUp ? 'up' : 'dn'}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                                  </linearGradient>
                                </defs>
                                <path d={fillD} fill={`url(#sg_${isUp ? 'up' : 'dn'})`} />
                                <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" />
                              </svg>
                            );
                          };

                          return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* Disclaimer */}
                            <div style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.25)', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#fbbf24' }}>
                              <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                              <span><strong>Disclaimer:</strong> All prices shown are fictional simulations and do not reflect real market data. This feature is for entertainment only and is not financial advice.</span>
                            </div>

                            {/* Chart panel */}
                            {(stockChartSymbol || stockChartLoading) && (
                              <div className="glass-panel" style={{ padding: '20px' }}>
                                {stockChartLoading ? (
                                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading chart...</div>
                                ) : stockChartData ? (() => {
                                  const quote = stockCatalog.find(s => s.symbol === stockChartData.symbol);
                                  const isUp = (quote?.changePercent ?? 0) >= 0;
                                  const prices = stockChartData.points.map(p => p.price);
                                  const minP = Math.min(...prices);
                                  const maxP = Math.max(...prices);
                                  const openP = prices[0];
                                  const closeP = prices[prices.length - 1];
                                  return (
                                    <div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                                        <div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <h3 style={{ margin: 0 }}>{stockChartData.symbol}</h3>
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{stockChartData.name}</span>
                                            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '2px 7px', color: 'var(--text-secondary)' }}>{stockChartData.market}</span>
                                          </div>
                                          <div style={{ fontSize: '26px', fontWeight: 700, marginTop: '4px', color: isUp ? '#00e676' : '#ff1744' }}>
                                            {stockChartData.currency}{closeP.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                            <span style={{ fontSize: '14px', marginLeft: '10px' }}>{isUp ? '▲' : '▼'} {quote?.changePercent >= 0 ? '+' : ''}{quote?.changePercent ?? '—'}%</span>
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                          {[['Open', openP], ['High', maxP], ['Low', minP]].map(([l, v]) => (
                                            <div key={l} style={{ textAlign: 'center' }}>
                                              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{l}</div>
                                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{stockChartData.currency}{Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div style={{ borderRadius: '6px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)', padding: '8px 0 4px' }}>
                                        <Sparkline points={stockChartData.points} isUp={isUp} width={700} height={130} />
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        <span>24h ago</span><span>Now</span>
                                      </div>
                                    </div>
                                  );
                                })() : null}
                              </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

                              {/* Catalog table */}
                              <div className="glass-panel" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                                  <h3 style={{ margin: 0 }}>Global Stock Catalog</h3>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input className="form-input" placeholder="Search symbol / name..." value={stockSearch} onChange={(e) => setStockSearch(e.target.value)} style={{ width: '180px' }} />
                                    <select className="form-select" value={stockMarketFilter} onChange={(e) => setStockMarketFilter(e.target.value)} style={{ width: '110px' }}>
                                      {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <button className="btn btn-secondary" onClick={fetchStockCatalog} title="Refresh prices"><RefreshCw size={14} /></button>
                                  </div>
                                </div>
                                {!stockCatalogLoaded ? (
                                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>Loading catalog...</div>
                                ) : (
                                  <div style={{ overflowX: 'auto', maxHeight: '520px', overflowY: 'auto' }}>
                                    <table className="data-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                                      <colgroup>
                                        <col style={{ width: '90px' }} />
                                        <col style={{ width: 'auto' }} />
                                        <col style={{ width: '80px' }} />
                                        <col style={{ width: '120px' }} />
                                        <col style={{ width: '90px' }} />
                                        <col style={{ width: '72px' }} />
                                      </colgroup>
                                      <thead>
                                        <tr>
                                          <th style={{ textAlign: 'left' }}>Symbol</th>
                                          <th style={{ textAlign: 'left' }}>Name</th>
                                          <th style={{ textAlign: 'center' }}>Market</th>
                                          <th style={{ textAlign: 'right' }}>Price</th>
                                          <th style={{ textAlign: 'right' }}>24h</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {filtered.map(s => {
                                          const isUp = s.changePercent >= 0;
                                          return (
                                            <tr key={s.symbol} style={{ cursor: 'pointer' }} onClick={() => fetchStockChart(s.symbol)}>
                                              <td style={{ textAlign: 'left' }}><span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '13px' }}>{s.symbol}</span></td>
                                              <td style={{ color: 'var(--text-secondary)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }} title={s.name}>{s.name}</td>
                                              <td style={{ textAlign: 'center' }}><span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', whiteSpace: 'nowrap', display: 'inline-block' }}>{s.market}</span></td>
                                              <td style={{ fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '13px' }}>{s.currency}{s.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                                              <td style={{ color: isUp ? '#00e676' : '#ff1744', fontWeight: 600, fontSize: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{s.changePercent}%
                                              </td>
                                              <td style={{ textAlign: 'center' }}><button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px', whiteSpace: 'nowrap' }} onClick={(e) => { e.stopPropagation(); fetchStockChart(s.symbol); }}>Chart</button></td>
                                            </tr>
                                          );
                                        })}
                                        {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No stocks match the filter.</td></tr>}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>

                              {/* Portfolio admin panel */}
                              <div className="glass-panel" style={{ padding: '20px' }}>
                                <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={16} /> Portfolio Admin</h3>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Grant or revoke stock shares for any member. No coins are deducted or credited — use this to reward or correct portfolios directly.</p>
                                <form onSubmit={adminPortfolioAdjust} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  <div className="form-group">
                                    <label>Member User ID</label>
                                    <input className="form-input" placeholder="Discord user ID..." value={portfolioUserId} onChange={(e) => setPortfolioUserId(e.target.value)} required />
                                    {members.length > 0 && (
                                      <select className="form-select" style={{ marginTop: '6px' }} value={portfolioUserId} onChange={(e) => setPortfolioUserId(e.target.value)}>
                                        <option value="">— Or pick from member list —</option>
                                        {members.filter(m => !m.isBot).map(m => (
                                          <option key={m.id} value={m.id}>{m.username}{m.nickname ? ` (${m.nickname})` : ''}</option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                  <div className="form-group">
                                    <label>Stock Symbol</label>
                                    <select className="form-select" value={portfolioSymbol} onChange={(e) => setPortfolioSymbol(e.target.value)} required>
                                      <option value="">— Select stock —</option>
                                      {['NASDAQ', 'NSE', 'LSE', 'CRYPTO', 'TYO', 'ASX'].map(mkt => (
                                        <optgroup key={mkt} label={mkt}>
                                          {stockCatalog.filter(s => s.market === mkt).map(s => (
                                            <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name} ({s.currency}{s.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</option>
                                          ))}
                                        </optgroup>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="form-group">
                                    <label>Shares</label>
                                    <input className="form-input" type="number" min="0.001" step="0.001" placeholder="e.g. 5.5" value={portfolioShares} onChange={(e) => setPortfolioShares(e.target.value)} required />
                                  </div>
                                  <div className="form-group">
                                    <label>Action</label>
                                    <select className="form-select" value={portfolioAction} onChange={(e) => setPortfolioAction(e.target.value)}>
                                      <option value="GRANT">Grant shares (add to portfolio)</option>
                                      <option value="REVOKE">Revoke shares (remove from portfolio)</option>
                                    </select>
                                  </div>
                                  {portfolioSymbol && portfolioShares > 0 && (() => {
                                    const s = stockCatalog.find(st => st.symbol === portfolioSymbol);
                                    if (!s) return null;
                                    const val = (Number(portfolioShares) * s.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                    return (
                                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '10px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        Market value of {portfolioShares} × {s.symbol}: <strong style={{ color: 'var(--text-primary)' }}>{s.currency}{val}</strong>
                                      </div>
                                    );
                                  })()}
                                  <button className="btn btn-primary" type="submit" style={{ background: portfolioAction === 'GRANT' ? 'var(--success)' : 'var(--danger)', color: portfolioAction === 'GRANT' ? '#060912' : 'white' }}>
                                    {portfolioAction === 'GRANT' ? '+ Grant Shares' : '− Revoke Shares'}
                                  </button>
                                </form>
                              </div>

                            </div>
                          </div>
                          );
                        })()}

                        {/* ── UTILITIES / EMBED BUILDER ── */}
                        {activeTab === 'utilities' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {/* Form */}
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Wrench size={15} color="var(--primary)" /> Embed Builder
                              </div>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px', lineHeight: 1.6 }}>
                                Compose and post a rich embed to any channel — equivalent to running <code style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>/embed create</code> in Discord.
                              </p>
                              <form onSubmit={sendEmbed} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label>Target Channel</label>
                                  <select className="form-select" value={embedForm.channelId} onChange={e => setEmbedForm(p => ({ ...p, channelId: e.target.value }))} required>
                                    <option value="">— Select Channel —</option>
                                    {telemetry.guild.channels.map(c => <option key={c.id} value={c.id}># {c.name}</option>)}
                                  </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label>Title <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                                  <input className="form-input" type="text" placeholder="Bold header text..." value={embedForm.title} onChange={e => setEmbedForm(p => ({ ...p, title: e.target.value }))} maxLength={256} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label>Description</label>
                                  <textarea className="form-textarea" rows="5" placeholder="Main embed body text..." value={embedForm.description} onChange={e => setEmbedForm(p => ({ ...p, description: e.target.value }))} required />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                  <div className="form-group" style={{ marginBottom: 0, flex: '0 0 140px' }}>
                                    <label>Accent Color</label>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                      <input type="color" value={embedForm.color} onChange={e => setEmbedForm(p => ({ ...p, color: e.target.value }))} style={{ width: '40px', height: '36px', padding: '2px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer' }} />
                                      <input className="form-input" type="text" value={embedForm.color} onChange={e => setEmbedForm(p => ({ ...p, color: e.target.value }))} style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '13px' }} maxLength={7} />
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label>Large Image URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                                  <input className="form-input" type="url" placeholder="https://example.com/banner.png" value={embedForm.image} onChange={e => setEmbedForm(p => ({ ...p, image: e.target.value }))} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label>Thumbnail URL <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                                  <input className="form-input" type="url" placeholder="https://example.com/icon.png" value={embedForm.thumbnail} onChange={e => setEmbedForm(p => ({ ...p, thumbnail: e.target.value }))} />
                                </div>
                                <button className="btn btn-primary" type="submit" disabled={!embedForm.channelId || !embedForm.description} style={{ marginTop: '4px' }}>
                                  <Zap size={15} /> Send Embed
                                </button>
                              </form>
                            </div>

                            {/* Live preview */}
                            <div className="glass-panel" style={{ padding: '24px' }}>
                              <div className="chart-title" style={{ marginBottom: '20px' }}>Live Preview</div>
                              <div style={{ borderLeft: `4px solid ${embedForm.color || '#00FFCC'}`, background: 'rgba(0,0,0,0.25)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', padding: '16px', display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  {embedForm.title && (
                                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px', color: '#fff' }}>{embedForm.title}</div>
                                  )}
                                  {embedForm.description ? (
                                    <div style={{ fontSize: '13.5px', color: '#dcddde', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{embedForm.description}</div>
                                  ) : (
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Description will appear here...</div>
                                  )}
                                  {embedForm.image && (
                                    <img src={embedForm.image} alt="embed" style={{ marginTop: '12px', maxWidth: '100%', borderRadius: '4px', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
                                  )}
                                  <div style={{ fontSize: '11px', color: '#72767d', marginTop: '12px' }}>{new Date().toLocaleString()}</div>
                                </div>
                                {embedForm.thumbnail && (
                                  <img src={embedForm.thumbnail} alt="thumbnail" style={{ width: '72px', height: '72px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
                                )}
                              </div>
                              <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                The embed will be posted to the selected channel with a timestamp. This mirrors the <code style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>/embed create</code> Discord command.
                              </p>
                            </div>
                          </div>
                        )}

                      </>
                    ) : null}
                  </div>
                </div>

                {/* MEMBER MODAL */}
                {petEditModal && (
                  <div className="modal-overlay" onClick={() => setPetEditModal(null)}>
                    <div className="modal-content glass-panel glow-panel-primary" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                      <div className="modal-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <PawPrint size={18} color="#a78bfa" />
                          <div>
                            <h2 style={{ margin: 0, fontSize: '16px' }}>Edit Pet — {petEditModal.petName}</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{petEditModal.petType} · LVL {petEditModal.level}</p>
                          </div>
                        </div>
                        <button className="modal-close" onClick={() => setPetEditModal(null)}><X size={20} /></button>
                      </div>
                      <form onSubmit={adminUpdatePet} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                          { label: 'Level', key: 'level', min: 1, max: 100 },
                          { label: 'Hunger', key: 'hunger', min: 0, max: 100 },
                          { label: 'Energy', key: 'energy', min: 0, max: 100 },
                          { label: 'Affection', key: 'affection', min: 0, max: 100 },
                        ].map(({ label, key, min, max }) => (
                          <div key={key}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span>{label}</span><span style={{ color: 'var(--text-muted)' }}>{min}–{max}</span>
                            </label>
                            <input
                              type="number" min={min} max={max}
                              value={petEditForm[key]}
                              onChange={e => setPetEditForm(f => ({ ...f, [key]: e.target.value }))}
                              className="form-input"
                              style={{ width: '100%' }}
                            />
                          </div>
                        ))}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setPetEditModal(null)}>Cancel</button>
                          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {showMemberModal && selectedMember && (() => {
                  const memberWarnings = telemetry?.warnings.filter(w => w.userId === selectedMember.id) || [];
                  const joinedDate = selectedMember.joinedAt ? new Date(selectedMember.joinedAt).toLocaleDateString() : '—';
                  return (
                  <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
                    <div className="modal-content glass-panel glow-panel-primary" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', maxHeight: '92vh', overflowY: 'auto' }}>

                      {/* ── Header ── */}
                      <div className="modal-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img src={selectedMember.avatar} alt={selectedMember.username} style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid var(--primary)' }} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h3 style={{ margin: 0 }}>{selectedMember.username}</h3>
                              {selectedMember.nickname && <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>({selectedMember.nickname})</span>}
                              {selectedMember.isBot && <span style={{ fontSize: '10px', background: 'rgba(88,101,242,0.2)', color: '#7289da', border: '1px solid rgba(88,101,242,0.4)', borderRadius: '3px', padding: '1px 5px', fontWeight: 700 }}>BOT</span>}
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>ID: {selectedMember.id} · Joined {joinedDate}</p>
                          </div>
                        </div>
                        <button className="modal-close" onClick={() => setShowMemberModal(false)}><X size={20} /></button>
                      </div>

                      {/* ── Profile Stats ── */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', padding: '14px 0', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
                        {[
                          { label: 'Level', icon: <Trophy size={14} />, value: (selectedMember.level ?? 1).toLocaleString(), color: 'var(--primary)' },
                          { label: 'XP', icon: <Zap size={14} />, value: (selectedMember.xp ?? 0).toLocaleString(), color: 'var(--info)' },
                          { label: 'Wallet', icon: <Coins size={14} />, value: (selectedMember.coins ?? 0).toLocaleString(), color: 'var(--success)' },
                          { label: 'Bank', icon: <Landmark size={14} />, value: (selectedMember.bank ?? 0).toLocaleString(), color: '#a78bfa' },
                        ].map(s => (
                          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '10px 8px', textAlign: 'center', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                              {s.icon}
                              <span>{s.value}</span>
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* ── Roles ── */}
                      {selectedMember.roles?.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px', fontWeight: 600 }}>Roles</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {selectedMember.roles.slice(0, 12).map(r => (
                              <span key={r.id} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', border: `1px solid ${r.color !== '#000000' ? r.color + '55' : 'var(--border)'}`, color: r.color !== '#000000' ? r.color : 'var(--text-secondary)', background: r.color !== '#000000' ? r.color + '18' : 'rgba(255,255,255,0.04)' }}>
                                {r.name}
                              </span>
                            ))}
                            {selectedMember.roles.length > 12 && <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>+{selectedMember.roles.length - 12} more</span>}
                          </div>
                        </div>
                      )}

                      {/* ── Warnings ── */}
                      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h4 style={{ margin: 0, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={15} /> Warnings
                            {memberWarnings.length > 0 && <span style={{ background: 'var(--warning)', color: '#060912', fontSize: '10px', fontWeight: 800, borderRadius: '10px', padding: '1px 7px' }}>{memberWarnings.length}</span>}
                          </h4>
                          {memberWarnings.length > 0 && (
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }} onClick={executeClearWarnings}>Clear All</button>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: memberWarnings.length > 0 ? '10px' : '0' }}>
                          <input className="form-input" type="text" placeholder="Reason for warning..." value={warnReason} onChange={(e) => setWarnReason(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && executeWarn()} />
                          <button className="btn btn-primary" style={{ background: 'var(--warning)', color: '#060912', whiteSpace: 'nowrap' }} onClick={executeWarn}>Issue Warn</button>
                        </div>
                        {memberWarnings.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '110px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px' }}>
                            {memberWarnings.map(w => (
                              <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '4px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                                <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>"{w.reason}"</span>
                                <X size={12} style={{ cursor: 'pointer', color: 'var(--danger)', flexShrink: 0, marginLeft: '8px' }} onClick={() => deleteSingleWarning(w.id)} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* ── Timeout ── */}
                      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '12px', color: '#fb923c', display: 'flex', alignItems: 'center', gap: '8px' }}><VolumeX size={15} /> Timeout</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', marginBottom: '8px' }}>
                          <select className="form-select" value={timeoutDuration} onChange={(e) => setTimeoutDuration(e.target.value)}>
                            <option value="60000">60 Seconds</option>
                            <option value="300000">5 Minutes</option>
                            <option value="600000">10 Minutes</option>
                            <option value="3600000">1 Hour</option>
                            <option value="86400000">1 Day</option>
                            <option value="604800000">1 Week</option>
                          </select>
                          <input className="form-input" type="text" placeholder="Reason (optional)..." value={timeoutReason} onChange={(e) => setTimeoutReason(e.target.value)} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-danger" style={{ flex: 1 }} onClick={executeTimeout}><VolumeX size={14} /> Apply Timeout</button>
                          <button className="btn btn-secondary" style={{ borderColor: 'rgba(139,92,246,0.3)', color: '#a78bfa' }} onClick={executeUntimeout}>Remove Timeout</button>
                        </div>
                      </div>

                      {/* ── Kick ── */}
                      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '12px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}><UserMinus size={15} /> Kick</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input className="form-input" type="text" placeholder="Reason (optional)..." value={kickReason} onChange={(e) => setKickReason(e.target.value)} />
                          <button className="btn btn-secondary" style={{ borderColor: 'rgba(255,23,68,0.25)', color: '#f87171', whiteSpace: 'nowrap' }} onClick={executeKick}><UserMinus size={14} /> Kick Member</button>
                        </div>
                      </div>

                      {/* ── Ban ── */}
                      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '12px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}><Ban size={15} /> Ban</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px', marginBottom: '8px' }}>
                          <select className="form-select" value={banDeleteDays} onChange={(e) => setBanDeleteDays(e.target.value)}>
                            <option value="0">Keep message history</option>
                            <option value="1">Delete last 1 day</option>
                            <option value="2">Delete last 2 days</option>
                            <option value="3">Delete last 3 days</option>
                            <option value="7">Delete last 7 days</option>
                          </select>
                          <input className="form-input" type="text" placeholder="Reason (optional)..." value={banReason} onChange={(e) => setBanReason(e.target.value)} />
                        </div>
                        <button className="btn btn-danger" style={{ width: '100%' }} onClick={executeBan}><Ban size={14} /> Ban Member</button>
                      </div>

                      {/* ── Economy ── */}
                      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}><Coins size={15} /> Coin Adjustment</h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <select className="form-select" style={{ width: '110px' }} value={coinChangeAction} onChange={(e) => setCoinChangeAction(e.target.value)}>
                            <option value="ADD">Give</option>
                            <option value="REMOVE">Deduct</option>
                            <option value="SET">Set to</option>
                          </select>
                          <input className="form-input" type="number" min="0" placeholder="Amount..." value={coinChangeAmount} onChange={(e) => setCoinChangeAmount(e.target.value)} />
                          <button className="btn btn-primary" style={{ background: 'var(--success)', color: '#060912', whiteSpace: 'nowrap' }} onClick={executeCoinAdjustment}>Apply</button>
                        </div>
                      </div>

                      {/* ── XP / Level ── */}
                      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '12px', color: 'var(--info)', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={15} /> XP Adjustment</h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <select className="form-select" style={{ width: '110px' }} value={xpChangeAction} onChange={(e) => setXpChangeAction(e.target.value)}>
                            <option value="ADD">Add</option>
                            <option value="REMOVE">Remove</option>
                            <option value="SET">Set to</option>
                          </select>
                          <input className="form-input" type="number" min="0" placeholder="XP amount..." value={xpChangeAmount} onChange={(e) => setXpChangeAmount(e.target.value)} />
                          <button className="btn btn-primary" style={{ background: 'var(--info)', color: 'white', whiteSpace: 'nowrap' }} onClick={executeXpAdjustment}>Apply</button>
                        </div>
                      </div>

                      {/* ── Unban by ID ── */}
                      <div>
                        <h4 style={{ marginBottom: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Ban size={15} /> Unban by User ID</h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>For users not in the server — enter their Discord ID to lift a ban.</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input className="form-input" type="text" placeholder="Discord user ID..." value={unbanUserId} onChange={(e) => setUnbanUserId(e.target.value)} />
                          <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }} onClick={() => { executeUnban(unbanUserId); setUnbanUserId(''); }}>Unban</button>
                        </div>
                      </div>

                    </div>
                  </div>
                  );
                })()}
              </div>
            )}
          </>
        )
      } />

      {/* Commands reference */}
      <Route path="/commands" element={<Commands />} />
      <Route path="/updates" element={<Updates />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/status" element={<Status />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
