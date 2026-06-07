import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Shield, Zap, Gift,
  LifeBuoy, UserPlus, Bell, Terminal, Mic,
  Wrench, FileText, Star, Layers, X
} from 'lucide-react';

const Coins = ({ size = 16, className = '', style = {} }) => (
  <img 
    src="/fridaycoin.png" 
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

import './Commands.css';

const CATEGORIES = [
  { id: 'all',        label: 'All Commands',  Icon: Layers         },
  { id: 'moderation', label: 'Moderation',    Icon: Shield         },
  { id: 'economy',    label: 'Economy',       Icon: Coins          },
  { id: 'leveling',   label: 'Leveling',      Icon: Zap            },
  { id: 'giveaways',  label: 'Giveaways',     Icon: Gift           },
  { id: 'tickets',    label: 'Tickets',       Icon: LifeBuoy       },
  { id: 'onboarding', label: 'Onboarding',    Icon: UserPlus       },
  { id: 'alerts',     label: 'Alerts',        Icon: Bell           },
  { id: 'customcmds', label: 'Custom Cmds',   Icon: Terminal       },
  { id: 'voice',      label: 'Voice',         Icon: Mic            },
  { id: 'utility',    label: 'Utility',       Icon: Wrench         },
  { id: 'auditing',   label: 'Auditing',      Icon: FileText       },
  { id: 'core',       label: 'Core',          Icon: Star           },
];

const COMMANDS = [
  // ── MODERATION ──
  {
    name: 'warn',
    category: 'moderation',
    desc: 'Issues a formal warning to a member and logs the infraction. Triggers punishment escalation rules if threshold is hit.',
    usage: '/warn [user] [reason]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'Member to warn' },
      { name: 'reason', type: 'String', required: true, desc: 'Reason for the warning' },
    ],
    admin: false,
    dashboard: true,
  },
  {
    name: 'warnings',
    category: 'moderation',
    desc: 'Displays the full warning history for a server member.',
    usage: '/warnings [user]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'Member to inspect' },
    ],
    admin: false,
    dashboard: true,
  },
  {
    name: 'clearwarn',
    category: 'moderation',
    desc: 'Deletes a specific warning by ID or clears all warnings for a member.',
    usage: '/clearwarn [user] [id?] [all?]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'Target member' },
      { name: 'id', type: 'String', required: false, desc: 'Specific warning ID to delete (e.g. warn_1A2B3C)' },
      { name: 'all', type: 'Boolean', required: false, desc: 'Set true to wipe all warnings' },
    ],
    admin: false,
    dashboard: true,
  },
  {
    name: 'timeout',
    category: 'moderation',
    desc: 'Applies a native Discord timeout (mute) to a member for a set duration.',
    usage: '/timeout [user] [duration] [reason]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'Member to timeout' },
      { name: 'duration', type: 'Choice', required: true, desc: '60 Seconds · 5 Minutes · 10 Minutes · 1 Hour · 1 Day' },
      { name: 'reason', type: 'String', required: false, desc: 'Reason for timeout' },
    ],
    admin: false,
    dashboard: true,
  },
  {
    name: 'untimeout',
    category: 'moderation',
    desc: 'Removes an active timeout from a member before it expires.',
    usage: '/untimeout [user] [reason?]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'Member to un-timeout' },
      { name: 'reason', type: 'String', required: false, desc: 'Reason for removal' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'kick',
    category: 'moderation',
    desc: 'Removes a member from the server. They can rejoin with a new invite.',
    usage: '/kick [user] [reason?]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'Member to kick' },
      { name: 'reason', type: 'String', required: false, desc: 'Reason for kick' },
    ],
    admin: false,
    dashboard: true,
  },
  {
    name: 'ban',
    category: 'moderation',
    desc: 'Permanently bans a user and optionally deletes their recent message history.',
    usage: '/ban [user] [reason?] [days?]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'User to ban' },
      { name: 'reason', type: 'String', required: false, desc: 'Reason for the ban' },
      { name: 'days', type: 'Integer', required: false, desc: 'Days of message history to purge (0–7)' },
    ],
    admin: false,
    dashboard: true,
  },
  {
    name: 'unban',
    category: 'moderation',
    desc: 'Revokes an active ban by Discord user ID.',
    usage: '/unban [user_id] [reason?]',
    options: [
      { name: 'user_id', type: 'String', required: true, desc: 'Discord ID of the banned user' },
      { name: 'reason', type: 'String', required: false, desc: 'Reason for unban' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'lockdown',
    category: 'moderation',
    desc: 'Locks a channel, preventing standard members from sending messages. Set unlock to reopen.',
    usage: '/lockdown [channel?] [unlock?]',
    options: [
      { name: 'channel', type: 'Channel', required: false, desc: 'Channel to lock (defaults to current)' },
      { name: 'unlock', type: 'Boolean', required: false, desc: 'Set true to unlock the channel' },
    ],
    admin: true,
    dashboard: false,
  },
  {
    name: 'purge',
    category: 'moderation',
    desc: 'Bulk deletes up to 100 messages from the current channel, with optional content filter.',
    usage: '/purge [amount] [filter?]',
    options: [
      { name: 'amount', type: 'Integer', required: true, desc: 'Number of messages to delete (1–100)' },
      { name: 'filter', type: 'Choice', required: false, desc: 'bots · links · attachments · embeds' },
    ],
    admin: true,
    dashboard: false,
  },
  {
    name: 'slowmode',
    category: 'moderation',
    desc: 'Sets the slowmode cooldown for the current channel. Use 0 to disable.',
    usage: '/slowmode [seconds]',
    options: [
      { name: 'seconds', type: 'Integer', required: true, desc: 'Delay in seconds (0 to disable, max 21600)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'automod toggle',
    category: 'moderation',
    desc: 'Enables or disables a specific AutoMod filter module (spam, caps, links).',
    usage: '/automod toggle [module] [enable]',
    options: [
      { name: 'module', type: 'Choice', required: true, desc: 'spam · links · caps' },
      { name: 'enable', type: 'Boolean', required: true, desc: 'true to enable, false to disable' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'automod blocklist',
    category: 'moderation',
    desc: 'Add, remove, or list custom blocked words and regex patterns for AutoMod scanning.',
    usage: '/automod blocklist [action] [pattern?]',
    options: [
      { name: 'action', type: 'Choice', required: true, desc: 'add · remove · list' },
      { name: 'pattern', type: 'String', required: false, desc: 'Word or regex (e.g. /badword.*/)' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'automod whitelist',
    category: 'moderation',
    desc: 'Whitelist channels or roles that bypass all AutoMod scanning entirely.',
    usage: '/automod whitelist [action] [channel?] [role?]',
    options: [
      { name: 'action', type: 'Choice', required: true, desc: 'add · remove · list' },
      { name: 'channel', type: 'Channel', required: false, desc: 'Channel to exempt' },
      { name: 'role', type: 'Role', required: false, desc: 'Role to exempt' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'automod punishments',
    category: 'moderation',
    desc: 'Configure automated punishment escalation rules triggered at specific warning thresholds.',
    usage: '/automod punishments [action] [threshold?] [punishment?] [duration?]',
    options: [
      { name: 'action', type: 'Choice', required: true, desc: 'add · remove · list' },
      { name: 'threshold', type: 'Integer', required: false, desc: 'Warning count that triggers this rule' },
      { name: 'punishment', type: 'Choice', required: false, desc: 'TIMEOUT · KICK · BAN' },
      { name: 'duration', type: 'Integer', required: false, desc: 'Timeout duration in minutes' },
    ],
    admin: true,
    dashboard: true,
  },

  // ── ECONOMY ──
  {
    name: 'balance',
    category: 'economy',
    desc: 'Displays your full financial breakdown — wallet, bank vault, stock portfolio, and inventory asset value. Net worth includes all four sources.',
    usage: '/balance [user?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Member to check (defaults to you)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'daily',
    category: 'economy',
    desc: 'Claims your daily reward of 200 server coins. Resets every 24 hours.',
    usage: '/daily',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'weekly',
    category: 'economy',
    desc: 'Claims a random weekly reward of 1,000–3,500 server coins. Resets every 7 days.',
    usage: '/weekly',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'monthly',
    category: 'economy',
    desc: 'Claims a random monthly reward of 5,000–15,000 server coins. Resets every 30 days.',
    usage: '/monthly',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'work',
    category: 'economy',
    desc: 'Works a shift for coins. Pay scales with your active job tier — from 50 coins (no job) up to 20,000 coins (Elite tier). 1-hour cooldown.',
    usage: '/work',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'job list',
    category: 'economy',
    desc: 'Browse all 24 available careers across 4 tiers (Starter → Elite) with pay ranges, level requirements, and XP bonuses per shift.',
    usage: '/job list',
    options: [],
    admin: false,
    dashboard: true,
  },
  {
    name: 'job apply',
    category: 'economy',
    desc: 'Apply for a career. Must meet the level requirement. Unlocks tier-scaled pay on /work. Job switch cooldown: 1 hour.',
    usage: '/job apply [job]',
    options: [
      { name: 'job', type: 'Choice', required: true, desc: 'One of 24 available careers across 4 tiers' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'job quit',
    category: 'economy',
    desc: 'Resigns from your current job. /work reverts to generic base pay (50–150 coins) until you re-apply.',
    usage: '/job quit',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'job profile',
    category: 'economy',
    desc: 'Displays a career summary card for yourself or another member — job title, tier, pay range, XP bonus, and time employed.',
    usage: '/job profile [user?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Member to view (defaults to you)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'beg',
    category: 'economy',
    desc: 'Begs for spare change and may receive coins or junk items from passersby.',
    usage: '/beg',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'hunt',
    category: 'economy',
    desc: 'Hunt in the woods with your Hunting Rifle. 9 drops from common Rabbit up to legendary Dragon Scale. 60-second cooldown.',
    usage: '/hunt',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'fish',
    category: 'economy',
    desc: 'Fish in the lake with your Fishing Pole. 12 drops from Clam up to legendary Ancient Pearl and Mythical Whale. 45-second cooldown.',
    usage: '/fish',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'dig',
    category: 'economy',
    desc: 'Dig for buried treasure with your Shovel. 9 drops from Common Worm up to legendary Diamond and Buried Gold Chest. 45-second cooldown.',
    usage: '/dig',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'mine',
    category: 'economy',
    desc: 'Descend into the mine shaft and excavate rare ores. Requires a Pickaxe from the shop. 9 ore tiers from Coal up to legendary Mythril Core. 60-second cooldown.',
    usage: '/mine',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'search',
    category: 'economy',
    desc: 'Search 3 random locations for coins or items. 60-second cooldown.',
    usage: '/search',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'pay',
    category: 'economy',
    desc: 'Transfers coins from your wallet to another member\'s.',
    usage: '/pay [user] [amount]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'Recipient member' },
      { name: 'amount', type: 'Integer', required: true, desc: 'Coins to transfer' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'rob',
    category: 'economy',
    desc: 'Attempts to steal coins from another member\'s wallet. Risky — you may lose coins if caught.',
    usage: '/rob [target]',
    options: [
      { name: 'target', type: 'User', required: true, desc: 'Member to rob' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'bankrob',
    category: 'economy',
    desc: 'Initiates a cooperative bank heist against a target member\'s vault for large payouts.',
    usage: '/bankrob [target]',
    options: [
      { name: 'target', type: 'User', required: true, desc: 'Member to heist' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'deposit',
    category: 'economy',
    desc: 'Deposits coins from your wallet into your bank vault for safekeeping.',
    usage: '/deposit [amount]',
    options: [
      { name: 'amount', type: 'String', required: true, desc: 'Coins to deposit or "all"' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'withdraw',
    category: 'economy',
    desc: 'Withdraws coins from your bank vault back into your wallet.',
    usage: '/withdraw [amount]',
    options: [
      { name: 'amount', type: 'String', required: true, desc: 'Coins to withdraw or "all"' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'gift coins',
    category: 'economy',
    desc: 'Gifts a coin amount from your wallet to another member as a gift.',
    usage: '/gift coins [user] [amount]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'Recipient member' },
      { name: 'amount', type: 'Integer', required: true, desc: 'Coins to gift' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'gift item',
    category: 'economy',
    desc: 'Sends an inventory item from your collection to another member as a gift.',
    usage: '/gift item [user] [name]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'Recipient member' },
      { name: 'name', type: 'String', required: true, desc: 'Item name to gift' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'shop view',
    category: 'economy',
    desc: 'View the server shop catalog with all available purchasable items and their prices.',
    usage: '/shop view',
    options: [],
    admin: false,
    dashboard: true,
  },
  {
    name: 'shop add',
    category: 'economy',
    desc: 'Admin: Add a new purchasable item to the server shop with optional role reward or consumable effect.',
    usage: '/shop add [name] [cost] [description?] [role?] [action_type?] [action_value?]',
    options: [
      { name: 'name', type: 'String', required: true, desc: 'Item name' },
      { name: 'cost', type: 'Integer', required: true, desc: 'Coin price' },
      { name: 'description', type: 'String', required: false, desc: 'Item description' },
      { name: 'role', type: 'Role', required: false, desc: 'Role to award on purchase' },
      { name: 'action_type', type: 'Choice', required: false, desc: 'Consumable effect when used via /use — XP · COINS' },
      { name: 'action_value', type: 'Integer', required: false, desc: 'Amount of XP or coins to grant when item is used' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'shop remove',
    category: 'economy',
    desc: 'Admin: Permanently removes an item from the server shop catalog.',
    usage: '/shop remove [name]',
    options: [
      { name: 'name', type: 'String', required: true, desc: 'Exact item name to remove' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'shop catalog',
    category: 'economy',
    desc: 'Browse all built-in items (tools, consumables, collectibles, gems) with suggested prices for admins to add to the server shop.',
    usage: '/shop catalog',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'buy',
    category: 'economy',
    desc: 'Purchases an item from the server shop using your coins.',
    usage: '/buy [item]',
    options: [
      { name: 'item', type: 'String', required: true, desc: 'Exact name of the shop item' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'sell',
    category: 'economy',
    desc: 'Sell 30+ grinding loot items (fish, animals, fossils, gems, pelts) back to the merchant for fixed coin prices.',
    usage: '/sell [item] [amount?]',
    options: [
      { name: 'item', type: 'String', required: true, desc: 'Item name to sell' },
      { name: 'amount', type: 'Integer', required: false, desc: 'Quantity to sell (defaults to 1)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'use',
    category: 'economy',
    desc: 'Activates a consumable from inventory: Pizza (150 XP), XP Potion (300 XP), Energy Drink (300 coins), Work Gloves (500 coins), Coin Bomb (800–4,000 coins), Lootbox, Mystery Crate (gem drops).',
    usage: '/use [item?]',
    options: [
      { name: 'item', type: 'String', required: false, desc: 'Item name to use (leave blank for picker)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'inventory',
    category: 'economy',
    desc: 'Displays all items owned by you or another member.',
    usage: '/inventory [user?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Member to check (defaults to you)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'market view',
    category: 'economy',
    desc: 'Browse all active player-to-player market listings.',
    usage: '/market view',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'market list',
    category: 'economy',
    desc: 'Post one of your items on the player market at a custom price.',
    usage: '/market list [item] [price]',
    options: [
      { name: 'item', type: 'String', required: true, desc: 'Item name to list' },
      { name: 'price', type: 'Integer', required: true, desc: 'Asking price in coins' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'market buy',
    category: 'economy',
    desc: 'Purchase an item from the player market by its listing ID.',
    usage: '/market buy [id]',
    options: [
      { name: 'id', type: 'String', required: true, desc: 'Market listing ID' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'market cancel',
    category: 'economy',
    desc: 'Cancel and remove one of your own market listings.',
    usage: '/market cancel [id]',
    options: [
      { name: 'id', type: 'String', required: true, desc: 'Your listing ID to cancel' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'trade',
    category: 'economy',
    desc: 'Opens an interactive bilateral trade session with another member. Both parties can add coins and up to 5 items each to their offer. Trade executes atomically only when both confirm.',
    usage: '/trade [@user]',
    options: [
      { name: 'user', type: 'User', required: true, desc: 'The member to initiate a trade with' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'pet view',
    category: 'economy',
    desc: 'View your pet\'s current stats, hunger, energy, and battle attributes.',
    usage: '/pet view',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'pet adopt',
    category: 'economy',
    desc: 'Adopt a new pet for 200 coins. Choose from Dog, Cat, Hamster, or Lizard.',
    usage: '/pet adopt [name] [type]',
    options: [
      { name: 'name', type: 'String', required: true, desc: 'Your pet\'s name' },
      { name: 'type', type: 'Choice', required: true, desc: 'Dog · Cat · Hamster · Lizard' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'pet feed',
    category: 'economy',
    desc: 'Feed your pet using coins or a worm to restore its hunger.',
    usage: '/pet feed [method]',
    options: [
      { name: 'method', type: 'Choice', required: true, desc: 'coins · worm' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'pet train',
    category: 'economy',
    desc: 'Train your pet\'s attack or defense attribute. Costs 25 energy.',
    usage: '/pet train [attribute]',
    options: [
      { name: 'attribute', type: 'Choice', required: true, desc: 'attack · defense' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'blackjack',
    category: 'economy',
    desc: 'Play high-stakes blackjack against Friday (dealer). Hit or Stand to beat 21.',
    usage: '/blackjack [bet]',
    options: [
      { name: 'bet', type: 'Integer', required: true, desc: 'Coins to wager' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'highlow',
    category: 'economy',
    desc: 'Draw a card and guess if the next is higher or lower. Chain correct guesses to climb multipliers: 1.4× → 1.8× → 2.4× → 3.2× → 4.5×. Cash out anytime.',
    usage: '/highlow [bet]',
    options: [
      { name: 'bet', type: 'Integer', required: true, desc: 'Coins to wager' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'dice',
    category: 'economy',
    desc: 'Roll two dice against Friday. Highest total wins 2× your bet. Tie returns your bet.',
    usage: '/dice [bet]',
    options: [
      { name: 'bet', type: 'Integer', required: true, desc: 'Coins to wager' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'horse',
    category: 'economy',
    desc: 'Bet on one of 5 horses in a narrated race. Favourite pays 1.8×, Dark Horse pays 6×. Higher odds = lower win chance.',
    usage: '/horse [horse] [bet]',
    options: [
      { name: 'horse', type: 'Integer', required: true, desc: '1 Thunderbolt · 2 Silver Arrow · 3 Dark Phantom · 4 Lucky Charm · 5 Iron Hoof' },
      { name: 'bet', type: 'Integer', required: true, desc: 'Coins to wager' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'roulette',
    category: 'economy',
    desc: 'Spin the roulette wheel. Bet on a number (0–36), red, black, or green.',
    usage: '/roulette [bet] [space]',
    options: [
      { name: 'bet', type: 'Integer', required: true, desc: 'Coins to wager' },
      { name: 'space', type: 'String', required: true, desc: 'red · black · green · 0–36' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'slots',
    category: 'economy',
    desc: 'Spin the slot machine for big coin multipliers on matching symbols.',
    usage: '/slots [bet]',
    options: [
      { name: 'bet', type: 'Integer', required: true, desc: 'Coins to wager' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'cockfight',
    category: 'economy',
    desc: 'Bet on a simulated cockfight arena match for high-risk, high-reward winnings.',
    usage: '/cockfight [bet]',
    options: [
      { name: 'bet', type: 'Integer', required: true, desc: 'Coins to wager' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'economy',
    category: 'economy',
    desc: 'Admin-only command to manually award or deduct coins from a member\'s balance.',
    usage: '/economy [action] [user] [amount]',
    options: [
      { name: 'action', type: 'Choice', required: true, desc: 'add · remove' },
      { name: 'user', type: 'User', required: true, desc: 'Target member' },
      { name: 'amount', type: 'Integer', required: true, desc: 'Coin amount' },
    ],
    admin: true,
    dashboard: true,
  },

  // ── STOCKS ──
  {
    name: 'stock list',
    category: 'economy',
    desc: 'Browse all available stocks across global markets (NASDAQ, NSE, LSE, CRYPTO, TYO, ASX) with real-time prices.',
    usage: '/stock list [market?]',
    options: [
      { name: 'market', type: 'Choice', required: false, desc: 'NASDAQ · NSE · LSE · CRYPTO · TYO · ASX' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'stock quote',
    category: 'economy',
    desc: 'Fetches a detailed real-time price quote for a specific stock symbol.',
    usage: '/stock quote [symbol]',
    options: [
      { name: 'symbol', type: 'String', required: true, desc: 'Stock symbol (e.g. AAPL, RELIANCE, BTC)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'stock buy',
    category: 'economy',
    desc: 'Purchase long-term investment shares of a stock using your coin wallet.',
    usage: '/stock buy [symbol] [shares]',
    options: [
      { name: 'symbol', type: 'String', required: true, desc: 'Stock symbol to purchase' },
      { name: 'shares', type: 'Number', required: true, desc: 'Number of shares (supports decimals, min 0.001)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'stock sell',
    category: 'economy',
    desc: 'Sell your long-term investment shares of a stock back to the market.',
    usage: '/stock sell [symbol] [shares]',
    options: [
      { name: 'symbol', type: 'String', required: true, desc: 'Stock symbol to sell' },
      { name: 'shares', type: 'Number', required: true, desc: 'Number of shares to sell (supports decimals)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'portfolio view',
    category: 'economy',
    desc: 'Displays your active long-term stock holdings and open leveraged intraday positions with live PnL.',
    usage: '/portfolio view [user?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Member to view (defaults to you)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'portfolio open',
    category: 'economy',
    desc: 'Opens a leveraged 5× intraday LONG or SHORT position on a stock symbol using coins as margin collateral.',
    usage: '/portfolio open [type] [symbol] [margin]',
    options: [
      { name: 'type', type: 'Choice', required: true, desc: 'LONG (bullish) · SHORT (bearish)' },
      { name: 'symbol', type: 'String', required: true, desc: 'Stock symbol to trade' },
      { name: 'margin', type: 'Integer', required: true, desc: 'Coins to collateralize as margin (min 10)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'portfolio close',
    category: 'economy',
    desc: 'Closes an active leveraged intraday position and settles profit or loss to your wallet.',
    usage: '/portfolio close [symbol]',
    options: [
      { name: 'symbol', type: 'String', required: true, desc: 'Stock symbol of the position to close' },
    ],
    admin: false,
    dashboard: false,
  },

  {
    name: 'coinflip',
    category: 'economy',
    desc: 'Flip a coin and optionally bet coins on the outcome. Guess heads or tails — win double your bet or lose it all.',
    usage: '/coinflip [guess?] [bet?]',
    options: [
      { name: 'guess', type: 'String', required: false, desc: 'Your guess: heads or tails' },
      { name: 'bet', type: 'Integer', required: false, desc: 'Coins to wager on the flip' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'rps',
    category: 'economy',
    desc: 'Play Rock, Paper, Scissors against Friday. Optionally bet coins — win double on a win, lose your bet on a loss.',
    usage: '/rps [choice] [bet?]',
    options: [
      { name: 'choice', type: 'String', required: true, desc: 'Your move: rock, paper, or scissors' },
      { name: 'bet', type: 'Integer', required: false, desc: 'Coins to wager on the match' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'scramble',
    category: 'economy',
    desc: 'Start a word scramble in the channel — first to unscramble wins coins and XP. Reward scales with word length (word.length × 35 coins base) plus a speed bonus for answering in under 15s or 30s.',
    usage: '/scramble [answer?]',
    options: [
      { name: 'answer', type: 'String', required: false, desc: 'Your guess for the active scramble in this channel' },
    ],
    admin: false,
    dashboard: false,
  },

  // ── LEVELING ──
  {
    name: 'rank',
    category: 'leveling',
    desc: 'Displays a styled rank card showing a member\'s level, XP, and server standing.',
    usage: '/rank [user?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Member to view (defaults to you)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'leaderboard',
    category: 'leveling',
    desc: 'Shows the top 10 members by XP/Level or by coin wealth.',
    usage: '/leaderboard xp  ·  /leaderboard economy',
    options: [
      { name: 'subcommand', type: 'Choice', required: true, desc: 'xp · economy' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'xp',
    category: 'leveling',
    desc: 'Admin command to manually add, remove, or set a member\'s XP.',
    usage: '/xp [action] [user] [amount]',
    options: [
      { name: 'action', type: 'Choice', required: true, desc: 'add · remove · set' },
      { name: 'user', type: 'User', required: true, desc: 'Target member' },
      { name: 'amount', type: 'Integer', required: true, desc: 'XP amount' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'level-config',
    category: 'leveling',
    desc: 'Configure the server-wide XP gain multiplier (e.g. 2.0 for Double XP events).',
    usage: '/level-config [multiplier]',
    options: [
      { name: 'multiplier', type: 'Number', required: true, desc: 'e.g. 0.5, 1.0, 1.5, 2.0' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'level-rewards',
    category: 'leveling',
    desc: 'Assign or remove roles that are automatically awarded when members reach a level.',
    usage: '/level-rewards [action] [level] [role]',
    options: [
      { name: 'action', type: 'Choice', required: true, desc: 'add · remove · list' },
      { name: 'level', type: 'Integer', required: false, desc: 'Level boundary (min 2)' },
      { name: 'role', type: 'Role', required: false, desc: 'Role to award at this level' },
    ],
    admin: true,
    dashboard: true,
  },

  // ── GIVEAWAYS ──
  {
    name: 'giveaway start',
    category: 'giveaways',
    desc: 'Launches a new interactive giveaway with button-based entries. Draws winners automatically.',
    usage: '/giveaway start [duration] [winners] [prize]',
    options: [
      { name: 'duration', type: 'String', required: true, desc: 'Duration e.g. 30s, 5m, 2h, 1d' },
      { name: 'winners', type: 'Integer', required: true, desc: 'Number of winners to draw' },
      { name: 'prize', type: 'String', required: true, desc: 'The prize being offered' },
    ],
    admin: true,
    dashboard: false,
  },
  {
    name: 'giveaway end',
    category: 'giveaways',
    desc: 'Ends an active giveaway early and draws winners immediately.',
    usage: '/giveaway end [message_id]',
    options: [
      { name: 'message_id', type: 'String', required: true, desc: 'Message ID of the giveaway embed' },
    ],
    admin: true,
    dashboard: false,
  },
  {
    name: 'giveaway reroll',
    category: 'giveaways',
    desc: 'Picks new winners from an already-ended giveaway entry pool.',
    usage: '/giveaway reroll [message_id]',
    options: [
      { name: 'message_id', type: 'String', required: true, desc: 'Message ID of the ended giveaway' },
    ],
    admin: true,
    dashboard: false,
  },
  {
    name: 'event create',
    category: 'giveaways',
    desc: 'Deploys an RSVP event card with live attendance tracking via button reactions.',
    usage: '/event create [title] [description] [date] [location]',
    options: [
      { name: 'title', type: 'String', required: true, desc: 'Event title or heading' },
      { name: 'description', type: 'String', required: true, desc: 'Context and details' },
      { name: 'date', type: 'String', required: true, desc: 'e.g. Tomorrow at 8 PM EST' },
      { name: 'location', type: 'String', required: true, desc: 'Voice channel or physical venue' },
    ],
    admin: true,
    dashboard: false,
  },

  // ── TICKETS ──
  {
    name: 'ticket setup',
    category: 'tickets',
    desc: 'Deploys the persistent "Create Ticket" helpdesk panel in the current channel.',
    usage: '/ticket setup',
    options: [],
    admin: true,
    dashboard: true,
  },
  {
    name: 'ticket close',
    category: 'tickets',
    desc: 'Generates a full HTML conversation transcript and closes the support ticket channel.',
    usage: '/ticket close',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'ticket add',
    category: 'tickets',
    desc: 'Grants a user or role view and reply access to the current ticket channel. Provide at least one of user or role.',
    usage: '/ticket add [user?] [role?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Member to add to the ticket' },
      { name: 'role', type: 'Role', required: false, desc: 'Role to add to the ticket' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'ticket remove',
    category: 'tickets',
    desc: 'Revokes a user\'s or role\'s access to the current ticket channel. Provide at least one of user or role.',
    usage: '/ticket remove [user?] [role?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Member to remove from the ticket' },
      { name: 'role', type: 'Role', required: false, desc: 'Role to remove from the ticket' },
    ],
    admin: false,
    dashboard: false,
  },

  // ── ONBOARDING ──
  {
    name: 'welcome',
    category: 'onboarding',
    desc: 'Configures automated welcome messages for new members with custom text and placeholders.',
    usage: '/welcome [channel] [message]',
    options: [
      { name: 'channel', type: 'Channel', required: true, desc: 'Channel to post welcome messages in' },
      { name: 'message', type: 'String', required: true, desc: 'Custom text — use {user}, {username}, {server}, {memberCount}' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'autorole',
    category: 'onboarding',
    desc: 'Assigns a role automatically to every member who joins the server.',
    usage: '/autorole [action] [role?]',
    options: [
      { name: 'action', type: 'Choice', required: true, desc: 'set · remove' },
      { name: 'role', type: 'Role', required: false, desc: 'Role to auto-assign on join' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'reactionrole',
    category: 'onboarding',
    desc: 'Creates a button-based reaction role menu. Members click buttons to self-assign up to 5 roles.',
    usage: '/reactionrole [title] [description] [role1] ... [role5?]',
    options: [
      { name: 'title', type: 'String', required: true, desc: 'Embed card title' },
      { name: 'description', type: 'String', required: true, desc: 'Embed body text' },
      { name: 'role1–5', type: 'Role', required: false, desc: 'Up to 5 selectable roles' },
    ],
    admin: true,
    dashboard: false,
  },

  // ── ALERTS ──
  {
    name: 'alerts youtube',
    category: 'alerts',
    desc: 'Subscribe to YouTube channel upload notifications. Bot pings a Discord channel when new videos drop.',
    usage: '/alerts youtube [action] [url?] [channel?]',
    options: [
      { name: 'action', type: 'Choice', required: true, desc: 'add · remove · list' },
      { name: 'url', type: 'String', required: false, desc: 'YouTube channel URL' },
      { name: 'channel', type: 'Channel', required: false, desc: 'Discord channel to post alerts in' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'alerts twitch',
    category: 'alerts',
    desc: 'Subscribe to Twitch live stream alerts. Bot pings a Discord channel when streamer goes live.',
    usage: '/alerts twitch [action] [username?] [channel?]',
    options: [
      { name: 'action', type: 'Choice', required: true, desc: 'add · remove · list' },
      { name: 'username', type: 'String', required: false, desc: 'Twitch username (lowercase)' },
      { name: 'channel', type: 'Channel', required: false, desc: 'Discord channel to post alerts in' },
    ],
    admin: true,
    dashboard: true,
  },

  // ── CUSTOM COMMANDS ──
  {
    name: 'customcmd add',
    category: 'customcmds',
    desc: 'Creates a custom text trigger command (e.g. !rules) with a plain-text response.',
    usage: '/customcmd add [name] [text]',
    options: [
      { name: 'name', type: 'String', required: true, desc: 'Trigger keyword (no spaces)' },
      { name: 'text', type: 'String', required: true, desc: 'Response text when triggered' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'customcmd embed',
    category: 'customcmds',
    desc: 'Creates a custom trigger command that responds with a rich embed card (built via modal).',
    usage: '/customcmd embed [name]',
    options: [
      { name: 'name', type: 'String', required: true, desc: 'Trigger keyword for the embed command' },
    ],
    admin: true,
    dashboard: false,
  },
  {
    name: 'customcmd remove',
    category: 'customcmds',
    desc: 'Permanently deletes a custom trigger command from this server.',
    usage: '/customcmd remove [name]',
    options: [
      { name: 'name', type: 'String', required: true, desc: 'Trigger keyword to delete' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'customcmd list',
    category: 'customcmds',
    desc: 'Lists all custom trigger commands registered in this server.',
    usage: '/customcmd list',
    options: [],
    admin: false,
    dashboard: true,
  },

  // ── VOICE ──
  {
    name: 'vc lock',
    category: 'voice',
    desc: 'Locks your active temporary voice channel so no new members can join.',
    usage: '/vc lock',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'vc unlock',
    category: 'voice',
    desc: 'Unlocks your temporary voice channel, allowing anyone to join again.',
    usage: '/vc unlock',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'vc claim',
    category: 'voice',
    desc: 'Claims ownership of your active voice channel when the original owner has left.',
    usage: '/vc claim',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'vclevel',
    category: 'voice',
    desc: 'Displays voice engagement rankings and total voice minute metrics for this server.',
    usage: '/vclevel',
    options: [],
    admin: false,
    dashboard: false,
  },

  // ── UTILITY ──
  {
    name: 'ping',
    category: 'utility',
    desc: 'Checks bot responsiveness and displays API latency and WebSocket heartbeat.',
    usage: '/ping',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'avatar',
    category: 'utility',
    desc: 'Fetches and displays the high-resolution avatar of any server member.',
    usage: '/avatar [user?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Member to view (defaults to you)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'userinfo',
    category: 'utility',
    desc: 'Displays comprehensive profile details for a server member — roles, join date, status.',
    usage: '/userinfo [user?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Member to inspect (defaults to you)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'serverinfo',
    category: 'utility',
    desc: 'Displays detailed statistics and metadata about the current server.',
    usage: '/serverinfo',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'servericon',
    category: 'utility',
    desc: 'Fetches and displays the high-resolution server branding icon.',
    usage: '/servericon',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'channelinfo',
    category: 'utility',
    desc: 'Displays detailed metadata and settings for a server channel.',
    usage: '/channelinfo [channel]',
    options: [
      { name: 'channel', type: 'Channel', required: true, desc: 'Channel to inspect' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'roleinfo',
    category: 'utility',
    desc: 'Displays permissions, color, and metadata for a server role.',
    usage: '/roleinfo [role]',
    options: [
      { name: 'role', type: 'Role', required: true, desc: 'Role to inspect' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'embed create',
    category: 'utility',
    desc: 'Opens an interactive Modal wizard to build and post a custom rich embed card.',
    usage: '/embed create',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'poll create',
    category: 'utility',
    desc: 'Posts a reaction poll in the current channel with up to 10 options and optional custom emojis.',
    usage: '/poll create [question] [options] [emojis?]',
    options: [
      { name: 'question', type: 'String', required: true, desc: 'The poll question' },
      { name: 'options', type: 'String', required: true, desc: 'Comma-separated options (2–10)' },
      { name: 'emojis', type: 'String', required: false, desc: 'Comma-separated emojis matching each option (e.g. ✅,❌,🤔)' },
    ],
    admin: false,
    dashboard: true,
  },
  {
    name: 'poll close',
    category: 'utility',
    desc: 'Closes an active poll by message ID, posts final results with vote counts, and removes reactions.',
    usage: '/poll close [id]',
    options: [
      { name: 'id', type: 'String', required: true, desc: 'The message ID of the poll to close' },
    ],
    admin: true,
    dashboard: false,
  },
  {
    name: 'remind',
    category: 'utility',
    desc: 'Schedules a DM reminder to be sent after a specified duration.',
    usage: '/remind [time] [message]',
    options: [
      { name: 'time', type: 'String', required: true, desc: 'e.g. 10s, 5m, 2h, 1d' },
      { name: 'message', type: 'String', required: true, desc: 'Reminder content' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'urban',
    category: 'utility',
    desc: 'Looks up a word or phrase on Urban Dictionary and returns the top definition.',
    usage: '/urban [term]',
    options: [
      { name: 'term', type: 'String', required: true, desc: 'Word or phrase to look up' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'weather',
    category: 'utility',
    desc: 'Fetches real-time atmospheric conditions for any city or region.',
    usage: '/weather [location]',
    options: [
      { name: 'location', type: 'String', required: true, desc: 'City or region name' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'meme',
    category: 'utility',
    desc: 'Fetches a random meme from Reddit. Optionally target a specific subreddit.',
    usage: '/meme [subreddit?]',
    options: [
      { name: 'subreddit', type: 'String', required: false, desc: 'Subreddit to fetch from (e.g. programmerhumor)' },
    ],
    admin: false,
    dashboard: false,
  },

  // ── AUDITING ──
  {
    name: 'logs message',
    category: 'auditing',
    desc: 'Retrieves recent deleted and edited message logs with optional user filter.',
    usage: '/logs message [user?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Filter logs for a specific member' },
    ],
    admin: true,
    dashboard: true,
  },
  {
    name: 'logs voice',
    category: 'auditing',
    desc: 'Retrieves recent voice channel join/leave activity logs with optional user filter.',
    usage: '/logs voice [user?]',
    options: [
      { name: 'user', type: 'User', required: false, desc: 'Filter voice logs for a specific member' },
    ],
    admin: true,
    dashboard: false,
  },
  {
    name: 'modstats',
    category: 'auditing',
    desc: 'Displays moderation action counts (warns, timeouts, kicks, bans) for a staff member.',
    usage: '/modstats [moderator?]',
    options: [
      { name: 'moderator', type: 'User', required: false, desc: 'Staff member to inspect (defaults to you)' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'serveractivity',
    category: 'auditing',
    desc: 'Displays a link to the live telemetry charts and server metrics on the web dashboard.',
    usage: '/serveractivity',
    options: [],
    admin: false,
    dashboard: true,
  },

  // ── CORE ──
  {
    name: 'friday quote',
    category: 'core',
    desc: 'Pulls a randomized Friday system narrative quote.',
    usage: '/friday quote',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'friday status',
    category: 'core',
    desc: 'Displays Friday\'s current system status, uptime, runtime memory, and WebSocket latency.',
    usage: '/friday status',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'friday ask',
    category: 'core',
    desc: 'Sends a direct AI query to Friday\'s Gemini-powered conversational core. Responds in Friday\'s system persona.',
    usage: '/friday ask [query]',
    options: [
      { name: 'query', type: 'String', required: true, desc: 'Your question or prompt for Friday' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'friday rewrite',
    category: 'core',
    desc: 'Translates any text into a distinct style persona using AI. Choose from Professional, Cyberpunk, Sarcastic, Pirate, or Shakespeare.',
    usage: '/friday rewrite [style] [text]',
    options: [
      { name: 'style', type: 'Choice', required: true, desc: 'Professional · Cyberpunk · Sarcastic · Pirate · Shakespeare' },
      { name: 'text', type: 'String', required: true, desc: 'The text to transform' },
    ],
    admin: false,
    dashboard: false,
  },
  {
    name: 'friday summarize',
    category: 'core',
    desc: 'Reads the last 50 messages in the channel and generates a structured AI summary of key topics, decisions, and conversation vibe.',
    usage: '/friday summarize',
    options: [],
    admin: false,
    dashboard: false,
  },
  {
    name: 'help',
    category: 'core',
    desc: 'Displays an interactive help manual listing all Friday bot commands, grouped by category with descriptions.',
    usage: '/help',
    options: [],
    admin: false,
    dashboard: false,
  },
];

const CAT_COLORS = {
  moderation: '#ff4569',
  economy:    '#00c853',
  leveling:   '#8b5cf6',
  giveaways:  '#ff9100',
  tickets:    '#ff9100',
  onboarding: '#38bdf8',
  alerts:     '#f59e0b',
  customcmds: '#10b981',
  voice:      '#a78bfa',
  utility:    '#3b9dff',
  auditing:   '#f43f5e',
  core:       '#6366f1',
};

const TYPE_COLORS = {
  User: '#3b9dff',
  String: '#10b981',
  Integer: '#f59e0b',
  Number: '#f59e0b',
  Boolean: '#a78bfa',
  Channel: '#38bdf8',
  Role: '#ff9100',
  Choice: '#ff4569',
};

export default function Commands() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCmd, setSelectedCmd] = useState(null);

  useEffect(() => {
    document.title = 'Commands — Friday Bot';
    return () => { document.title = 'Friday Bot — Smart Discord Community Management'; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedCmd(null); };
    if (selectedCmd) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCmd]);

  const filtered = useMemo(() => {
    let list = COMMANDS;
    if (activeCategory !== 'all') list = list.filter(c => c.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.category.includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  const totalByCategory = useMemo(() => {
    const counts = {};
    COMMANDS.forEach(c => { counts[c.category] = (counts[c.category] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="cmd-root">
      {/* Background */}
      <div className="cmd-bg-grid" />
      <div className="cmd-bg-glow-1" />
      <div className="cmd-bg-glow-2" />

      {/* Modal */}
      {selectedCmd && (
        <div className="cmd-modal-overlay" onClick={() => setSelectedCmd(null)}>
          <div className="cmd-modal" style={{ '--modal-color': CAT_COLORS[selectedCmd.category] }} onClick={e => e.stopPropagation()}>
            {/* Titlebar */}
            <div className="cmd-modal-titlebar">
              <div className="cmd-modal-dots">
                <span className="cmd-dot cmd-dot-r" onClick={() => setSelectedCmd(null)} title="Close" />
                <span className="cmd-dot cmd-dot-y" />
                <span className="cmd-dot cmd-dot-g" />
              </div>
              <span className="cmd-modal-titlebar-label">Friday Dashboard — /{selectedCmd.name}</span>
              <button className="cmd-modal-close" onClick={() => setSelectedCmd(null)}><X size={13} /></button>
            </div>

            {/* Body */}
            <div className="cmd-modal-body">
              {/* Command info panel */}
              <div className="cmd-modal-panel">
                <div className="cmd-modal-panel-title">
                  <code className="cmd-modal-cmd-name" style={{ color: CAT_COLORS[selectedCmd.category] }}>/{selectedCmd.name}</code>
                  <div className="cmd-modal-badges">
                    {selectedCmd.admin && <span className="cmd-badge cmd-badge-admin">ADMIN</span>}
                    {selectedCmd.dashboard && <span className="cmd-badge cmd-badge-dashboard">DASHBOARD</span>}
                    <span className="cmd-badge cmd-badge-cat" style={{ background: CAT_COLORS[selectedCmd.category] + '1a', color: CAT_COLORS[selectedCmd.category], borderColor: CAT_COLORS[selectedCmd.category] + '33' }}>
                      {selectedCmd.category}
                    </span>
                  </div>
                </div>
                <p className="cmd-modal-desc">{selectedCmd.desc}</p>
              </div>

              {/* Usage panel */}
              <div className="cmd-modal-panel">
                <div className="cmd-modal-section-label">USAGE</div>
                <code className="cmd-modal-usage-block">{selectedCmd.usage}</code>
              </div>

              {/* Options panel */}
              {selectedCmd.options.length > 0 && (
                <div className="cmd-modal-panel">
                  <div className="cmd-modal-section-label">OPTIONS</div>
                  <div className="cmd-modal-options">
                    {selectedCmd.options.map(opt => (
                      <div key={opt.name} className="cmd-modal-option-row">
                        <div className="cmd-modal-option-meta">
                          <code className="cmd-modal-option-name">{opt.name}</code>
                          <span className="cmd-option-type" style={{ color: TYPE_COLORS[opt.type] || '#888', borderColor: (TYPE_COLORS[opt.type] || '#888') + '33', background: (TYPE_COLORS[opt.type] || '#888') + '12' }}>
                            {opt.type}
                          </span>
                          {!opt.required && <span className="cmd-option-optional">optional</span>}
                        </div>
                        <p className="cmd-modal-option-desc">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <header className="cmd-nav">
        <Link to="/" className="cmd-nav-brand">
          <img src="/logo.png" alt="Friday" className="cmd-nav-logo" />
          <span className="cmd-nav-name">FRIDAY</span>
        </Link>
        <div className="cmd-nav-right">
          <span className="cmd-nav-count">{COMMANDS.length} commands</span>
          <Link to="/" className="cmd-nav-link">← Back to Home</Link>
        </div>
      </header>

      {/* Hero */}
      <div className="cmd-hero">
        <div className="cmd-hero-eyebrow">COMMAND REFERENCE</div>
        <h1 className="cmd-hero-title">
          Every command.<br />
          <span className="cmd-hero-accent">All in one place.</span>
        </h1>
        <p className="cmd-hero-desc">
          Complete reference for all {COMMANDS.length} Friday slash commands — usage, options, and permissions.
        </p>

        {/* Search */}
        <div className="cmd-search-wrap">
          <span className="cmd-search-icon">⌕</span>
          <input
            className="cmd-search"
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="cmd-search-clear" onClick={() => setSearch('')}><X size={13} /></button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="cmd-body">

        {/* Sidebar */}
        <aside className="cmd-sidebar">
          <div className="cmd-sidebar-label">CATEGORIES</div>
          {CATEGORIES.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`cmd-cat-btn ${activeCategory === id ? 'active' : ''}`}
              onClick={() => setActiveCategory(id)}
              style={activeCategory === id && id !== 'all' ? {
                borderColor: CAT_COLORS[id] + '55',
                color: CAT_COLORS[id],
                background: CAT_COLORS[id] + '0f',
              } : {}}
            >
              <Icon size={14} className="cmd-cat-icon" />
              <span className="cmd-cat-label">{label}</span>
              <span className="cmd-cat-count">
                {id === 'all' ? COMMANDS.length : (totalByCategory[id] || 0)}
              </span>
            </button>
          ))}

          <div className="cmd-legend">
            <div className="cmd-legend-title">LEGEND</div>
            <div className="cmd-legend-item">
              <span className="cmd-badge cmd-badge-admin">ADMIN</span>
              <span>Requires Administrator</span>
            </div>
            <div className="cmd-legend-item">
              <span className="cmd-badge cmd-badge-dashboard">DASHBOARD</span>
              <span>Also in dashboard</span>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <main className="cmd-main">
          {filtered.length === 0 ? (
            <div className="cmd-empty">
              <div className="cmd-empty-icon">⌕</div>
              <p>No commands match <strong>"{search}"</strong></p>
            </div>
          ) : (
            <div className="cmd-grid">
              {filtered.map(cmd => (
                <div
                  key={cmd.name}
                  className="cmd-card"
                  style={{ '--cat-color': CAT_COLORS[cmd.category], cursor: 'pointer' }}
                  onClick={() => setSelectedCmd(cmd)}
                >
                  <div className="cmd-card-accent-line" />

                  {/* Header */}
                  <div className="cmd-card-header">
                    <code className="cmd-card-name">/{cmd.name}</code>
                    <div className="cmd-card-badges">
                      {cmd.admin && <span className="cmd-badge cmd-badge-admin">ADMIN</span>}
                      {cmd.dashboard && <span className="cmd-badge cmd-badge-dashboard">DASHBOARD</span>}
                      <span
                        className="cmd-badge cmd-badge-cat"
                        style={{ background: CAT_COLORS[cmd.category] + '1a', color: CAT_COLORS[cmd.category], borderColor: CAT_COLORS[cmd.category] + '33' }}
                      >
                        {cmd.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="cmd-card-desc">{cmd.desc}</p>

                  {/* Usage */}
                  <div className="cmd-card-usage">
                    <span className="cmd-usage-label">USAGE</span>
                    <code className="cmd-usage-block">{cmd.usage}</code>
                  </div>

                  {/* Options */}
                  {cmd.options.length > 0 && (
                    <div className="cmd-card-options">
                      <span className="cmd-usage-label">OPTIONS</span>
                      <div className="cmd-options-list">
                        {cmd.options.map(opt => (
                          <div key={opt.name} className="cmd-option-row">
                            <div className="cmd-option-meta">
                              <code className="cmd-option-name">{opt.name}</code>
                              <span
                                className="cmd-option-type"
                                style={{ color: TYPE_COLORS[opt.type] || '#888', borderColor: (TYPE_COLORS[opt.type] || '#888') + '33', background: (TYPE_COLORS[opt.type] || '#888') + '12' }}
                              >
                                {opt.type}
                              </span>
                              {!opt.required && <span className="cmd-option-optional">optional</span>}
                            </div>
                            <p className="cmd-option-desc">{opt.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="cmd-results-count">
              Showing {filtered.length} of {COMMANDS.length} commands
              {activeCategory !== 'all' && ` in ${activeCategory}`}
              {search && ` matching "${search}"`}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
