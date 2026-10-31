import { PROFILE_SCRIPT } from './profile-client.js';
import { escape as e } from './security.js';
import { SETTINGS, SECRETS, PROVIDERS } from './config.js';
import * as lucide from 'lucide';

const iconMap = {
  overview: 'LayoutDashboard',
  mail: 'Mail',
  providers: 'Server',
  identities: 'Users',
  security: 'ShieldCheck',
  settings: 'Settings',
  setup: 'BookOpen',
  arrow: 'ArrowRight',
  clients: 'Key',
  users: 'UserPlus',
  domains: 'Globe',
  docs: 'FileText',
  copy: 'Copy',
  trash: 'Trash2',
  edit: 'Pencil',
  menu: 'Menu',
  close: 'X',
  chevron: 'ChevronDown',
  filter: 'Filter',
  search: 'Search',
  check: 'Check',
  external: 'ExternalLink',
  refresh: 'RotateCw',
  plus: 'Plus',
  pause: 'Pause',
  play: 'Play',
  star: 'Star',
  user: 'User',
};

function initial(name) {
  if (!name || typeof name !== 'string') return 'S';
  const trimmed = name.trim();
  return trimmed ? Array.from(trimmed)[0].toUpperCase() : 'S';
}

function icon(name) {
  const data = lucide[iconMap[name] || 'Mail'];
  if (!Array.isArray(data)) return '';
  const inner = data.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k,v]) => `${k}="${String(v).replace(/"/g,'&quot;')}"`).join(' ')}/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

const css = `
:root {
  color-scheme: light;
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-hover: #f1f5f9;
  --surface-active: #e2e8f0;
  --text: #0f172a;
  --text-secondary: #334155;
  --muted: #64748b;
  --line: #e2e8f0;
  --line-strong: #cbd5e1;
  --accent: #087d54;
  --accent-hover: #066b47;
  --accent-active: #044e33;
  --tint: #ecfdf5;
  --tint-strong: #d1fae5;
  --tint-text: #065f46;
  --danger: #dc2626;
  --danger-bg: #fef2f2;
  --danger-line: #fecaca;
  --warn: #d97706;
  --warn-bg: #fffbeb;
  --warn-line: #fde68a;
  --info: #0284c7;
  --info-bg: #f0f9ff;
  --info-line: #bae6fd;
  --shadow-xs: 0 1px 2px 0 rgb(15 23 42 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(15 23 42 / 0.08), 0 1px 2px -1px rgb(15 23 42 / 0.08);
  --shadow-md: 0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.08);
  --shadow-lg: 0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1);
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
  --font: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-family: var(--font);
  font-size: 14px;
}

* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); line-height: 1.5; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button, a, input, select, textarea { outline-offset: 3px; }
button { cursor: pointer; }
button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid var(--accent); }
svg { width: 18px; height: 18px; flex-shrink: 0; }

/* Customizable select API & custom dropdown styling */
select.custom-select,
select.custom-select::picker(select) {
  appearance: base-select;
}

select {
  appearance: none;
  -webkit-appearance: none;
  background-color: var(--surface);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px 14px;
  padding-right: 36px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  box-shadow: var(--shadow-xs);
}

select:hover {
  border-color: var(--line-strong);
  background-color: #fafbfc;
}

select:focus,
select:focus-visible {
  border-color: var(--accent);
  outline: none;
  box-shadow: 0 0 0 3px rgba(8, 125, 84, 0.15);
}

select::picker(select) {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 6px;
  margin-top: 6px;
}

select::picker-icon {
  color: var(--muted);
}

select option {
  padding: 8px 12px;
  border-radius: var(--radius-xs);
  color: var(--text);
  font-size: 13px;
}

select option:hover,
select option:focus {
  background-color: var(--tint);
  color: var(--accent);
}

select option::checkmark {
  color: var(--accent);
}

/* Floating custom dropdown menu */
.custom-dropdown {
  position: relative;
  display: inline-block;
}

.custom-dropdown summary {
  list-style: none;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-dropdown summary::-webkit-details-marker {
  display: none;
}

.custom-dropdown[open] summary .dropdown-chevron {
  transform: rotate(180deg);
}

.dropdown-chevron {
  display: inline-flex;
  align-items: center;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--muted);
}

.dropdown-chevron svg {
  width: 14px;
  height: 14px;
}

.custom-dropdown .dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 250px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 6px;
  z-index: 60;
  animation: dropMenuIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dropMenuIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.dropdown-header {
  padding: 10px 12px 6px;
  font-size: 12px;
}

.dropdown-header strong {
  display: block;
  font-size: 13px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-header .muted {
  font-size: 11px;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  transition: background-color 0.12s ease;
  width: 100%;
  text-align: left;
  border: 0;
  background: none;
  cursor: pointer;
}

.dropdown-item:hover,
.dropdown-item:focus-visible {
  background: var(--surface-hover);
  color: var(--accent);
}

.dropdown-item svg {
  width: 16px;
  height: 16px;
  color: var(--muted);
}

.dropdown-item:hover svg {
  color: var(--accent);
}

.dropdown-item.text-danger {
  color: var(--danger);
}

.dropdown-item.text-danger:hover {
  background: var(--danger-bg);
  color: var(--danger);
}

.dropdown-item.text-danger svg {
  color: var(--danger);
}

.dropdown-divider {
  height: 1px;
  background: var(--line);
  margin: 6px 0;
}

/* App layout & sidebar */
.app {
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  border-right: 1px solid var(--line);
  background: var(--surface);
  padding: 24px 14px;
  display: flex;
  flex-direction: column;
  z-index: 40;
}

.sidehead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 750;
  font-size: 20px;
  letter-spacing: -0.6px;
  color: var(--text);
}

.brandmark {
  background: linear-gradient(135deg, var(--accent) 0%, #065f46 100%);
  color: white;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  box-shadow: 0 2px 4px rgba(8, 125, 84, 0.25);
}

.brandmark svg {
  width: 20px;
  height: 20px;
}

.brand span span {
  color: var(--accent);
}

.eyebrow {
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: var(--muted);
  margin: 12px 10px 8px;
}

nav {
  display: grid;
  gap: 3px;
}

.navlink {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  color: var(--muted);
  border-radius: var(--radius-sm);
  font-weight: 550;
  font-size: 13px;
  transition: all 0.12s ease;
}

.navlink:hover {
  background: var(--surface-hover);
  color: var(--text);
}

.navlink.active {
  background: var(--tint);
  color: var(--accent);
  font-weight: 600;
}

.navlink svg {
  width: 17px;
  height: 17px;
}

.sidefoot {
  margin-top: auto;
  padding: 16px 8px 0;
  border-top: 1px solid var(--line);
}

.sidefoot small {
  display: block;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.4;
  margin: 8px 0 12px;
}

.sys-health-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  background: var(--tint);
  color: var(--tint-text);
  font-size: 11px;
  font-weight: 600;
}

.live-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 2px rgba(8, 125, 84, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(8, 125, 84, 0.4); }
  70% { box-shadow: 0 0 0 5px rgba(8, 125, 84, 0); }
  100% { box-shadow: 0 0 0 0 rgba(8, 125, 84, 0); }
}

.textbutton {
  border: 0;
  background: none;
  color: var(--muted);
  padding: 4px 0;
  font-size: 12px;
  font-weight: 550;
  cursor: pointer;
  transition: color 0.12s ease;
}

.textbutton:hover {
  color: var(--danger);
}

/* Workspace main content & topbar */
.workspace {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 68px;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 30;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.crumb {
  color: var(--muted);
  font-size: 12px;
}

.crumb strong {
  color: var(--text);
  font-weight: 600;
}

.topright {
  display: flex;
  align-items: center;
  gap: 14px;
}

.compose-quickbtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--line);
  background: var(--surface);
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
}

.compose-quickbtn:hover {
  background: var(--tint);
  border-color: rgba(8, 125, 84, 0.35);
  color: var(--accent);
  box-shadow: 0 2px 6px rgba(8, 125, 84, 0.15);
  transform: translateY(-1px);
}

.compose-quickbtn:active {
  transform: translateY(0);
}

.compose-quickbtn svg {
  width: 14px;
  height: 14px;
  stroke-width: 2.2;
  color: var(--accent);
}

.profilelink {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 4px 12px 4px 5px;
  border-radius: var(--radius-full);
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  user-select: none;
}

.profilelink:hover {
  background: var(--surface-hover);
  border-color: var(--line-strong);
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.08);
}

.custom-dropdown[open] .profilelink {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(8, 125, 84, 0.12);
  background: var(--surface);
}

.profilemeta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.profilename {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}

.roletag {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  border: 1px solid var(--line);
  color: var(--muted);
  background: var(--surface-hover);
  line-height: 1.3;
}

.roletag.superadmin {
  background: var(--tint);
  border-color: var(--tint-strong);
  color: var(--tint-text);
}

.avatar {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  background: var(--tint);
  border-radius: 50%;
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  border: 1px solid var(--line);
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

main {
  width: 100%;
  max-width: 1600px;
  margin: 0;
  padding: 24px 32px 48px;
  box-sizing: border-box;
}

.pagehead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

h1 {
  font-size: 26px;
  letter-spacing: -0.8px;
  margin: 0 0 4px;
  font-weight: 700;
  color: var(--text);
}

h2 {
  font-size: 15px;
  letter-spacing: -0.2px;
  margin: 0;
  font-weight: 650;
  color: var(--text);
}

h3 {
  font-size: 13px;
  margin: 0;
  font-weight: 600;
}

p {
  margin: 6px 0;
  color: var(--muted);
}

.sub {
  font-size: 13px;
  color: var(--muted);
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: linear-gradient(180deg, #0a8f60 0%, #087d54 100%);
  border: 1px solid #066d48;
  border-radius: var(--radius-sm);
  color: #ffffff;
  padding: 8px 15px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px rgba(8, 125, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  text-decoration: none;
}

.button:hover {
  background: linear-gradient(180deg, #0b9e6a 0%, #07744d 100%);
  border-color: #055e3e;
  box-shadow: 0 3px 8px rgba(8, 125, 84, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(8, 125, 84, 0.2);
}

.button.secondary {
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-xs);
}

.button.secondary:hover {
  background: var(--surface-hover);
  border-color: var(--line-strong);
  color: var(--text);
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.06);
  transform: translateY(-1px);
}

.button.secondary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-xs);
}

.button.danger {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  box-shadow: 0 1px 2px rgba(220, 38, 38, 0.05);
}

.button.danger:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #b91c1c;
  box-shadow: 0 2px 6px rgba(220, 38, 38, 0.12);
  transform: translateY(-1px);
}

.button.danger:active {
  transform: translateY(0);
  background: #fecaca;
}

.button.small {
  padding: 5px 10px;
  font-size: 11px;
  border-radius: var(--radius-xs);
}

.button svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Stats Cards */
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.stat {
  padding: 20px 22px;
  border-right: 1px solid var(--line);
  transition: background-color 0.12s ease;
}

.stat:last-child {
  border-right: 0;
}

.stat:hover {
  background: #fbfcfd;
}

.statlabel {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--muted);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statlabel svg {
  width: 16px;
  height: 16px;
  color: var(--muted);
}

.statvalue {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.2;
  margin: 12px 0 6px;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}

.statnote {
  color: var(--muted);
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Panels, cards & tables */
.panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.panelhead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--line);
  background: var(--surface);
}

.panelhead p {
  font-size: 12px;
  margin: 3px 0 0;
}

.panelbody {
  padding: 22px;
}

.tablewrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--line-strong) transparent;
}

table {
  border-collapse: collapse;
  width: 100%;
  text-align: left;
  white-space: nowrap;
}

th {
  background: #fbfcfb;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 650;
  color: var(--muted);
  padding: 12px 20px;
  border-bottom: 1px solid var(--line);
}

td {
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f3;
  font-size: 12px;
  color: var(--text);
}

tr:last-child td {
  border-bottom: 0;
}

tr:hover td {
  background: #fafcfa;
}

td .muted {
  display: block;
  font-size: 11px;
  margin-top: 3px;
}

.muted {
  color: var(--muted);
}

.subject {
  font-weight: 600;
  color: var(--text);
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Status tags & badges */
.tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  background: var(--surface-hover);
  color: var(--muted);
  border-radius: var(--radius-xs);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.tag.good,
.tag.Sent,
.tag.Delivered,
.tag.Configured,
.tag.Verified,
.tag.Active {
  background: #dcfce7;
  color: #15803d;
}

.tag.warn,
.tag.Paused,
.tag.Queued,
.tag.default {
  background: #fef3c7;
  color: #b45309;
}

.tag.Failed,
.tag.Bounced,
.tag.danger {
  background: #fee2e2;
  color: #b91c1c;
}

/* Advanced filter bar */
.filters {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 22px;
  border-bottom: 1px solid var(--line);
  background: #fafbfc;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 140px;
}

.filter-search {
  flex: 2;
  min-width: 220px;
}

.field-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: var(--muted);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 10px;
  color: var(--muted);
  pointer-events: none;
  display: grid;
  place-items: center;
}

.input-icon svg {
  width: 14px;
  height: 14px;
}

.input-with-icon input {
  padding-left: 32px !important;
  margin-top: 0 !important;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters label {
  flex: 1;
  min-width: 120px;
}

.filters input,
.filters select {
  margin-top: 0;
  padding: 8px 10px;
  font-size: 12px;
}

.filters .search {
  flex: 2;
  min-width: 200px;
}

/* Form fields & inputs */
.field {
  display: block;
  margin: 0 0 18px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
}

.field small {
  display: block;
  font-weight: 400;
  color: var(--muted);
  margin-top: 5px;
  font-size: 11px;
}

input, select, textarea {
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  width: 100%;
  padding: 9px 11px;
  margin-top: 6px;
  font-size: 13px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-shadow: var(--shadow-xs);
}

input:focus, select:focus, textarea:focus {
  border-color: var(--accent);
  outline: none;
  box-shadow: 0 0 0 3px rgba(8, 125, 84, 0.15);
}

textarea {
  resize: vertical;
  min-height: 110px;
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.5;
}

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.settingsgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 20px;
}

.empty {
  padding: 48px 20px;
  text-align: center;
}

.empty svg {
  width: 32px;
  height: 32px;
  color: var(--muted);
  margin-bottom: 8px;
}

.empty strong {
  display: block;
  font-size: 14px;
  color: var(--text);
}

.empty p {
  max-width: 380px;
  margin: 6px auto;
  font-size: 12px;
}

.notice {
  background: var(--tint);
  border: 1px solid var(--tint-strong);
  color: var(--tint-text);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  margin-bottom: 20px;
  font-size: 12px;
  line-height: 1.5;
}

.notice.warn {
  background: var(--warn-bg);
  border-color: var(--warn-line);
  color: #92400e;
}

.notice.error {
  background: var(--danger-bg);
  border-color: var(--danger-line);
  color: var(--danger);
}

/* Provider list */
.provider {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
  transition: background-color 0.12s ease;
}

.provider:last-child {
  border-bottom: 0;
}

.provider:hover {
  background: #fafbfc;
}

.providerleft {
  display: flex;
  align-items: center;
  gap: 12px;
}

.providerlogo {
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
  background: var(--surface-hover);
  color: var(--accent);
}

.provider strong {
  text-transform: capitalize;
  font-size: 13px;
  font-weight: 650;
}

.provider p {
  margin: 1px 0;
  font-size: 11px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-top: 1px solid var(--line);
  font-size: 11px;
  color: var(--muted);
  background: #fafbfc;
}

.split {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr);
  gap: 24px;
}

.list {
  padding: 0;
  list-style: none;
  margin: 0;
}

.list li {
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.list li:last-child {
  border: 0;
}

.list p {
  font-size: 12px;
}

.step {
  display: flex;
  gap: 12px;
}

.stepnum {
  font-size: 11px;
  font-weight: 700;
  background: var(--tint);
  color: var(--accent);
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
}

code, pre {
  font-family: var(--mono);
  font-size: 11px;
}

pre {
  background: var(--bg);
  border: 1px solid var(--line);
  padding: 14px;
  overflow-x: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  border-radius: var(--radius-sm);
  line-height: 1.7;
}

details {
  border-top: 1px solid var(--line);
  padding: 14px 20px;
}

summary {
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
}

details form {
  margin-top: 16px;
}

dl {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 8px;
  font-size: 12px;
}

dt {
  color: var(--muted);
  font-weight: 550;
}

dd {
  margin: 0;
  overflow-wrap: anywhere;
}

iframe {
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  width: 100%;
  height: 480px;
  background: white;
}

/* Authentication Layout */
.login {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
}

.loginart {
  background: #064e3b;
  background: linear-gradient(145deg, #064e3b 0%, #022c22 100%);
  color: #e2f5ec;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 56px;
}

.loginart .brand {
  padding: 0;
  color: white;
}

.loginart h1 {
  font-size: 44px;
  line-height: 1.15;
  max-width: 460px;
  letter-spacing: -1.5px;
  color: white;
}

.loginart p {
  color: #a7f3d0;
  max-width: 360px;
  margin-top: 20px;
  font-size: 14px;
}

.loginform {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36px;
  background: var(--surface);
}

.logininner {
  width: 100%;
  max-width: 360px;
}

.logininner h1 {
  font-size: 24px;
  margin: 18px 0 8px;
}

.logininner form {
  margin-top: 24px;
}

.logininner .button {
  width: 100%;
  padding: 10px;
  font-size: 13px;
  margin-top: 8px;
}

.orb {
  width: 200px;
  height: 140px;
  margin: 48px 0;
  position: relative;
}

.orb div {
  border: 1px solid rgba(167, 243, 208, 0.25);
  border-radius: 50%;
  width: 200px;
  height: 110px;
  position: absolute;
  transform: rotate(-25deg);
}

.orb div:nth-child(2) { transform: rotate(25deg); }
.orb div:nth-child(3) { transform: rotate(75deg); }

.footnote {
  font-size: 11px;
  color: var(--muted);
  margin-top: 20px;
}

.checkrow {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
}

.checkrow:last-child {
  border: 0;
}

input[type=checkbox] {
  width: auto;
  margin: 0 7px 0 0;
}

.checkbox {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.identityform {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.identityform .field {
  flex: 1;
  margin: 0;
}

.identityform .button {
  margin-bottom: 0;
}

.trace {
  white-space: pre-wrap;
  max-height: 250px;
}

.dnsfield {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;
  width: 100%;
}

.dnstype {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--muted);
  width: 44px;
  flex-shrink: 0;
}

.dnsfield code {
  flex: 1;
  min-width: 0;
  background: var(--bg);
  border: 1px solid var(--line);
  padding: 6px 9px;
  border-radius: var(--radius-xs);
  word-break: break-all;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.dnsfield .button {
  flex-shrink: 0;
}

.iconb {
  padding: 6px 8px !important;
}

.iconb svg {
  width: 15px;
  height: 15px;
}

.iconb.copied {
  background: var(--tint);
  border-color: var(--accent);
  color: var(--accent);
}

.profileeditor {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 22px;
}

.profileeditor .avatar {
  width: 64px;
  height: 64px;
  font-size: 20px;
}

/* Sender identities specific styling */
.identity-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.identity-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--tint);
  border: 1px solid var(--tint-strong);
  color: var(--accent);
  font-weight: 700;
  font-size: 13px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.identity-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.identity-title {
  font-weight: 600;
  font-size: 13px;
  color: var(--text);
}

.rename-popover {
  position: relative;
  display: inline-block;
  border: 0;
  padding: 0;
}

.rename-popover summary {
  list-style: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 550;
  color: var(--muted);
  cursor: pointer;
  padding: 2px 7px;
  border-radius: var(--radius-xs);
  border: 1px solid transparent;
  transition: all 0.12s ease;
}

.rename-popover summary::-webkit-details-marker {
  display: none;
}

.rename-popover summary:hover {
  color: var(--accent);
  background: var(--tint);
  border-color: var(--tint-strong);
}

.rename-popover summary svg {
  width: 12px;
  height: 12px;
}

.popover-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 12px;
  min-width: 250px;
  z-index: 50;
  animation: dropMenuIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.popover-dropdown .field {
  margin-bottom: 10px;
}

.popover-dropdown .field span {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.popover-dropdown input {
  margin-top: 0;
  padding: 6px 9px;
  font-size: 12px;
}

.email-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #f1f5f9;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-secondary);
}

.status-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tag.Active::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
}

.tag.Paused::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d97706;
}

.identity-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.identityform-grid .form-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr auto;
  gap: 16px;
  align-items: start;
}

.identityform-grid .field {
  margin: 0;
}

.field-title {
  display: block;
  font-size: 11px;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--muted);
  margin-bottom: 2px;
}

.input-suffix-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-suffix-wrap input {
  padding-right: 28px;
}

.input-suffix-wrap .suffix-at {
  position: absolute;
  right: 10px;
  color: var(--muted);
  font-weight: 600;
  font-size: 13px;
  pointer-events: none;
}

.form-btn-col {
  padding-top: 20px;
}

@media (max-width: 900px) {
  .identityform-grid .form-row-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .form-btn-col {
    padding-top: 0;
  }
  .form-btn-col .button {
    width: 100%;
  }
}

/* Mobile responsive drawer navigation */
.drawer-toggle-input {
  display: none;
}

.drawer-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--text);
  cursor: pointer;
  transition: background-color 0.12s ease;
}

.drawer-btn:hover {
  background: var(--surface-hover);
}

.drawer-btn svg {
  width: 18px;
  height: 18px;
}

.drawer-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 80;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-close {
  display: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--surface-hover);
  border: 1px solid var(--line);
  color: var(--muted);
  cursor: pointer;
}

.drawer-close svg {
  width: 16px;
  height: 16px;
}

/* Responsive Media Queries */
@media (min-width: 1600px) {
  main { max-width: 1720px; padding: 28px 36px 56px; margin: 0; }
}

@media (max-width: 1100px) {
  .split, .grid2 { grid-template-columns: 1fr; }
  .stats { grid-template-columns: 1fr 1fr; }
  .stat:nth-child(2) { border-right: 0; }
  .stat:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
  .app { grid-template-columns: 220px minmax(0, 1fr); }
  main { padding: 22px 24px; margin: 0; }
  .topbar { padding: 0 24px; }
}

@media (max-width: 1023px) {
  .app { display: block; }
  .drawer-btn { display: inline-flex; }
  .drawer-close { display: inline-flex; }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    height: 100vh;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: var(--shadow-lg);
  }
  .drawer-toggle-input:checked ~ .app .sidebar,
  .drawer-toggle-input:checked ~ .sidebar,
  body:has(.drawer-toggle-input:checked) .sidebar {
    transform: translateX(0);
  }
  .drawer-toggle-input:checked ~ .drawer-backdrop,
  body:has(.drawer-toggle-input:checked) .drawer-backdrop {
    display: block;
    opacity: 1;
    pointer-events: auto;
  }
  .topbar {
    height: 60px;
    padding: 0 16px;
  }
  main { padding: 20px 16px; margin: 0; }
}

@media (max-width: 640px) {
  .stats { grid-template-columns: 1fr; }
  .stat { border-right: 0; border-bottom: 1px solid var(--line); }
  .stat:last-child { border-bottom: 0; }
  .pagehead {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }
  .pagehead .actions {
    width: 100%;
  }
  .pagehead .actions .button {
    flex: 1;
  }
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-group,
  .filter-search {
    width: 100%;
    min-width: 100%;
  }
  .filter-actions {
    width: 100%;
  }
  .filter-actions .button {
    flex: 1;
  }
  .crumb { display: none; }
  .profilemeta .profilename { display: none; }
  .settingsgrid { grid-template-columns: 1fr; }
  .identityform { display: block; }
  .identityform .field { margin-bottom: 14px; }
  .login { grid-template-columns: 1fr; }
  .loginart { display: none; }
  .loginform { padding: 32px 20px; }
}
`;

function document(title, content) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${e(title)} · NeoMail</title><style>${css}</style></head><body>${content}</body></html>`;
}

const navAll = [
  ['overview', 'Overview'],
  ['mail', 'Mail activity'],
  ['providers', 'Providers'],
  ['identities', 'Sender identities'],
  ['clients', 'API clients'],
  ['users', 'Admin users'],
  ['domains', 'Domains'],
  ['docs', 'Documentation'],
  ['security', 'Security events'],
  ['settings', 'Settings'],
  ['setup', 'Integration guide'],
];

const navFor = role => role === 'superadmin' ? navAll : navAll.filter(([id]) => ['overview', 'mail', 'identities', 'clients', 'domains', 'settings'].includes(id));

export function hidden(csrf) {
  return `<input type="hidden" name="csrf" value="${e(csrf)}">`;
}

export function badge(status) {
  const s = String(status || '');
  const isGood = s === 'Active' || s === 'Sent' || s === 'Delivered' || s === 'Configured' || s === 'Verified' || s === 'Ready';
  const isWarn = s === 'Paused' || s === 'Failed' || s === 'Bounced' || s.startsWith('Pending') || s === 'Cooling down';
  const cls = isGood ? 'good' : (isWarn ? 'warn' : '');
  return `<span class="tag ${cls} ${e(s)}">${e(s)}</span>`;
}

export function page(view, title, subtitle, content, sess, notice = '') {
  const base = sess?.role === 'superadmin' ? '/admin' : '/dashboard';
  return document(title, `
    <input type="checkbox" id="drawer-toggle" class="drawer-toggle-input" aria-hidden="true">
    <label for="drawer-toggle" class="drawer-backdrop" aria-label="Close navigation"></label>
    <div class="app">
      <aside class="sidebar">
        <div class="sidehead">
          <a class="brand" href="${base}">
            <span class="brandmark">${icon('mail')}</span>
            <span>neo<span>mail</span></span>
          </a>
          <label for="drawer-toggle" class="drawer-close" aria-label="Close navigation">${icon('close')}</label>
        </div>
        <div class="eyebrow">Workspace</div>
        <nav>${navFor(sess?.role).map(([id, label]) => `<a class="navlink ${id === view ? 'active' : ''}" ${id === view ? 'aria-current="page"' : ''} href="${base}?view=${id}">${icon(id)}<span>${label}</span></a>`).join('')}</nav>
        <div class="sidefoot">
          <div class="sys-health-pill">
            <span class="live-pulse"></span>
            <span>System active</span>
          </div>
          <small>Private mail infrastructure<br>Access-protected workspace</small>
          <form method="post" action="/admin/logout">
            ${hidden(sess.csrf_token)}
            <button class="textbutton">Sign out</button>
          </form>
        </div>
      </aside>
      <div class="workspace">
        <header class="topbar">
          <div class="topbar-left">
            <label for="drawer-toggle" class="drawer-btn" aria-label="Open menu">${icon('menu')}</label>
            <div class="crumb">Workspace &nbsp; / &nbsp; <strong>${e(title)}</strong></div>
          </div>
          <div class="topright">
            <a class="button small secondary compose-quickbtn" href="${base}?view=compose">${icon('plus')}<span>Send test</span></a>
            <details class="custom-dropdown profile-dropdown">
              <summary class="profilelink" aria-label="User menu">
                ${profileAvatar(sess.profile)}
                <span class="profilemeta">
                  <span class="profilename">${e(sess.profile?.display_name || sess.access_subject || 'Administrator')}</span>
                  <span class="roletag ${sess.role === 'superadmin' ? 'superadmin' : ''}">${sess.role === 'superadmin' ? 'Superadmin' : 'Admin'}</span>
                </span>
                <span class="dropdown-chevron">${icon('chevron')}</span>
              </summary>
              <div class="dropdown-menu">
                <div class="dropdown-header">
                  <strong>${e(sess.profile?.display_name || 'Administrator')}</strong>
                  <span class="muted">${e(sess.access_subject || '')}</span>
                </div>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="${base}?view=settings#profile">${icon('edit')} Your profile</a>
                <a class="dropdown-item" href="${base}?view=settings">${icon('settings')} Workspace settings</a>
                <a class="dropdown-item" href="${base}?view=security">${icon('security')} Security events</a>
                <a class="dropdown-item" href="${base}?view=compose">${icon('mail')} Send test email</a>
                <div class="dropdown-divider"></div>
                <form method="post" action="/admin/logout">
                  ${hidden(sess.csrf_token)}
                  <button class="dropdown-item text-danger" type="submit">${icon('arrow')} Sign out</button>
                </form>
              </div>
            </details>
          </div>
        </header>
        <main>
          <div class="pagehead">
            <div>
              <h1>${e(title)}</h1>
              <p class="sub">${e(subtitle)}</p>
            </div>
            <div class="actions">
              <a class="button secondary" href="${base}?view=${view}">${icon('refresh')} Refresh</a>
              <a class="button" href="${base}?view=compose">${icon('mail')} Send a test</a>
            </div>
          </div>
          ${notice ? `<div class="notice" role="status">${e(notice)}</div>` : ''}
          ${content}
          <p class="footnote">NeoMail · Private transactional email workspace · All times shown in UTC</p>
        </main>
      </div>
    </div>
  `);
}

export function login(error = '') {
  return document('Sign in', `<div class="login"><div class="loginart"><a class="brand" href="/"><span class="brandmark">${icon('mail')}</span>neomail</a><div><div class="orb"><div></div><div></div><div></div></div><h1>Your mail.<br>A clearer view.</h1><p>Send, inspect, and manage your transactional email from one private workspace.</p></div><small>Built for your team. Powered by Cloudflare.</small></div><div class="loginform"><div class="logininner"><span class="tag good">${icon('security')} Private workspace</span><h1>Welcome to NeoMail</h1><p class="sub">Local development sign-in. Production uses email OTP or passkey through Cloudflare Access.</p>${error ? `<div class="notice error" role="alert">${e(error)}</div>` : ''}<form method="post" action="/login"><label class="field">Administrator token<input type="password" name="admin_token" required minlength="43" maxlength="128" autocomplete="current-password" placeholder="Enter your secure access token"></label><button class="button">Sign in to workspace ${icon('arrow')}</button></form><p class="footnote">Production sign-in also requires Cloudflare Access. Ask your workspace owner if you need access.</p></div></div></div>`);
}

function empty(message = 'Your mail activity will appear here', help = 'Configure a provider and sender identity, then send your first test email.') {
  return `<div class="empty">${icon('mail')}<strong>${e(message)}</strong><p>${e(help)}</p></div>`;
}

export function mailTable(logs) {
  if (!logs.length) return empty();
  return `<div class="tablewrap"><table><thead><tr><th>Message</th><th>Direction</th><th>Status</th><th>Provider</th><th>Time (UTC)</th><th>Details</th></tr></thead><tbody>${logs.map(m => `<tr><td><div class="subject">${e(m.subject)}</div><span class="muted">${e(m.recipient_address)}</span></td><td>${e(m.direction)}</td><td>${badge(m.transmission_status)}</td><td>${e(m.provider_used)}</td><td>${e(new Date(m.unix_timestamp * 1000).toISOString().slice(0, 16).replace('T', ' '))}</td><td><a class="button secondary small" href="/admin/view-mail?id=${e(m.id)}">Inspect ${icon('arrow')}</a></td></tr>`).join('')}</tbody></table></div>`;
}

export function providerList(rows, cfg, csrf) {
  return PROVIDERS.map(p => {
    const row = rows.find(r => r.provider_name === p);
    let configured = false;
    if (p === 'smtp') {
      configured = !!(cfg.SMTP_HOST && cfg.SMTP_USER && cfg.SMTP_PASS);
    } else {
      configured = !!cfg[p.toUpperCase() + '_API_KEY'];
    }
    return `<div class="provider"><div class="providerleft"><div class="providerlogo">${e(p[0].toUpperCase())}</div><div><strong>${e(p)}</strong><p>${configured ? 'Credential configured' : 'Add a credential in Settings'}${row?.consecutive_failures ? ' · ' + e(row.consecutive_failures) + ' recent failures' : ''}</p></div></div><div class="actions">${badge(!configured ? 'Not configured' : row?.is_active === 0 ? 'Paused' : row?.consecutive_failures >= 5 ? 'Cooling down' : 'Ready')}<a class="button secondary small" href="/admin?view=settings" aria-label="Configure">${icon('settings')}</a>${csrf ? `<form method="post" action="/admin/providers/toggle">${hidden(csrf)}<input type="hidden" name="provider" value="${p}"><button class="button secondary small">${row?.is_active === 0 ? 'Enable' : 'Pause'}</button></form>` : ''}</div></div>`;
  }).join('');
}

export function overview(stats, logs, health, cfg) {
  return `<div class="stats">${[['Total messages', stats.total, 'Inbound and outbound'], ['Accepted / delivered', stats.accepted, 'Provider acceptance is not inbox placement'], ['Delivery issues', stats.issues, 'Failed or bounced'], ['Pending', stats.pending, 'Queued or awaiting reconciliation']].map(([label, value, note]) => `<div class="stat"><div class="statlabel"><span>${e(label)}</span>${icon('mail')}</div><div class="statvalue">${e(Number(value || 0).toLocaleString())}</div><div class="statnote">${e(note)}</div></div>`).join('')}</div><div class="split"><div><section class="panel"><div class="panelhead"><div><h2>Recent mail</h2><p>Your latest messages, in one place.</p></div><a class="button secondary small" href="/admin?view=mail">View all</a></div>${mailTable(logs)}</section><div class="notice">Message bodies are ${cfg.STORE_MESSAGE_BODIES === 'true' ? 'stored for inspection. Avoid sending secrets in email.' : 'not retained. Metadata remains available for delivery tracking.'}</div></div><div><section class="panel"><div class="panelhead"><div><h2>Delivery providers</h2><p>Availability based on configuration and recent attempts.</p></div></div>${providerList(health, cfg)}</section><section class="panel"><div class="panelbody"><h2>Connect your platform</h2><p class="sub">Send transactional mail from the neopathshala backend using a dedicated API credential.</p><a class="button secondary" href="/admin?view=setup">Integration guide ${icon('arrow')}</a></div></section></div></div>`;
}

export function mailView(logs, filters, currentPage, hasNext) {
  const query = new URLSearchParams({ view: 'mail', ...filters });
  return `<section class="panel"><div class="panelhead"><div><h2>Mail activity</h2><p>Search and inspect inbound and outbound messages.</p></div></div><form class="filters" method="get" action="/admin"><input type="hidden" name="view" value="mail"><div class="filter-group filter-search"><span class="field-label">Search</span><div class="input-with-icon"><span class="input-icon">${icon('search')}</span><input name="search" maxlength="100" placeholder="Subject or recipient" value="${e(filters.search)}"></div></div><div class="filter-group"><label class="field-label">Direction</label><select name="direction" class="custom-select"><option value="">All directions</option>${['outbound', 'inbound'].map(v => `<option value="${v}" ${filters.direction === v ? 'selected' : ''}>${v === 'outbound' ? 'Outbound ↗' : 'Inbound ↙'}</option>`).join('')}</select></div><div class="filter-group"><label class="field-label">Status</label><select name="status" class="custom-select"><option value="">All statuses</option>${['Queued', 'Sent', 'Delivered', 'Bounced', 'Failed'].map(v => `<option value="${v}" ${filters.status === v ? 'selected' : ''}>${v}</option>`).join('')}</select></div><div class="filter-actions"><button class="button secondary">${icon('filter')} Apply filters</button>${(filters.search || filters.direction || filters.status) ? `<a href="/admin?view=mail" class="button secondary small" title="Reset filters">${icon('close')} Clear</a>` : ''}</div></form>${mailTable(logs)}<div class="pagination"><span>Page ${currentPage} · Up to 25 messages per page</span><div class="actions">${currentPage > 1 ? `<a class="button secondary small" href="/admin?${e(query)}&page=${currentPage - 1}">Previous</a>` : ''}${hasNext ? `<a class="button secondary small" href="/admin?${e(query)}&page=${currentPage + 1}">Next</a>` : ''}</div></div></section>`;
}

function accountProviderCredentials(accountKeys = [], sess) {
  const map = new Map(accountKeys.map(k => [k.provider_name, k]));
  const providerMeta = {
    resend: { label: 'Resend', desc: 'Transactional email API (starts with re_)', placeholder: 're_1234567890abcdef' },
    brevo: { label: 'Brevo (Sendinblue)', desc: 'SMTP & transactional API (starts with xkeysib-)', placeholder: 'xkeysib-...' },
    mailgun: { label: 'Mailgun', desc: 'Mailgun sending API key with custom domain', placeholder: 'key-...' },
    mailtrap: { label: 'Mailtrap', desc: 'Mailtrap transactional API token', placeholder: 'api_token' },
    mailersend: { label: 'MailerSend', desc: 'MailerSend API token', placeholder: 'mlsn.token...' },
    smtp: { label: 'Custom SMTP', desc: 'Direct outbound SMTP credentials with TLS', placeholder: 'SMTP Password' }
  };

  return `<section class="panel" id="provider-keys">
    <div class="panelhead">
      <div>
        <h2>Workspace Provider Keys (Encrypted in SQLite)</h2>
        <p>Zero-Trust account isolation: Dispatches from this workspace use your encrypted credentials.</p>
      </div>
    </div>
    <div class="panelbody">
      <div class="notice">
        <strong>🔒 Write-Only Zero-Trust Protection:</strong> Your API keys are encrypted at rest with AES-256-GCM in Cloudflare D1 (SQLite).
        To protect your credentials from accidental disclosure or extraction, <strong>stored keys are strictly write-only and can never be viewed again by anyone</strong>.
        To update or rotate an integration, enter a new key below.
      </div>
      <div style="display:grid;gap:16px">
        ${PROVIDERS.map(p => {
          const item = map.get(p);
          const meta = providerMeta[p] || { label: p, desc: '', placeholder: 'API Key' };
          let extra = {};
          if (item?.extra_config) {
            try { extra = JSON.parse(item.extra_config); } catch {}
          }
          return `<div class="provider" style="padding:16px;background:var(--bg);border-radius:8px;border:1px solid var(--line);display:block">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <div>
                <strong>${e(meta.label)}</strong>
                <p class="sub">${e(meta.desc)}</p>
              </div>
              <div class="actions">
                ${badge(item ? 'Encrypted (AES-256-GCM)' : 'Not configured')}
                ${item ? badge(item.is_active ? 'Active' : 'Paused') : ''}
                ${item ? `<form method="post" action="/admin/account-keys/toggle">${hidden(sess.csrf_token)}<input type="hidden" name="provider" value="${p}"><button class="button secondary small">${item.is_active ? 'Pause' : 'Enable'}</button></form>` : ''}
                ${item ? `<form method="post" action="/admin/account-keys/delete" onsubmit="return confirm('Remove this provider key?')">${hidden(sess.csrf_token)}<input type="hidden" name="provider" value="${p}"><button class="button danger small">Remove</button></form>` : ''}
              </div>
            </div>
            ${item ? `<div style="font-size:12px;margin-bottom:12px;color:var(--muted)">Key Hint: <code style="background:var(--surface);border:1px solid var(--line);padding:2px 6px;border-radius:4px;color:var(--text)">${e(item.key_hint)}</code>${p === 'mailgun' && extra.domain ? ` &nbsp; Domain: <code>${e(extra.domain)}</code>` : ''}${p === 'smtp' && extra.smtp_host ? ` &nbsp; Host: <code>${e(extra.smtp_host)}</code> (User: <code>${e(extra.smtp_user)}</code>)` : ''}</div>` : ''}
            <details style="border-top:1px solid var(--line);padding-top:10px">
              <summary style="font-size:12px;color:var(--accent);cursor:pointer;font-weight:600">${item ? 'Rotate / Replace Key' : '+ Configure ' + e(meta.label) + ' Key'}</summary>
              <form method="post" action="/admin/account-keys/save" style="margin-top:10px">
                ${hidden(sess.csrf_token)}
                <input type="hidden" name="provider" value="${p}">
                <div class="settingsgrid">
                  <label class="field">${p === 'smtp' ? 'SMTP Password' : 'API Key'}
                    <input type="password" name="api_key" autocomplete="new-password" required minlength="${p === 'smtp' ? 4 : 8}" maxlength="4096" placeholder="${e(meta.placeholder)}">
                  </label>
                  ${p === 'mailgun' ? `<label class="field">Mailgun Domain (e.g. mg.yourdomain.com)<input name="mailgun_domain" maxlength="255" value="${e(extra.domain || '')}" placeholder="mg.yourdomain.com"></label>` : ''}
                  ${p === 'smtp' ? `
                    <label class="field">SMTP Host<input name="smtp_host" maxlength="255" value="${e(extra.smtp_host || '')}" placeholder="smtp.gmail.com" required></label>
                    <label class="field">SMTP Port<select name="smtp_port" class="custom-select" required><option value="465" ${(extra.smtp_port || '465') === '465' ? 'selected' : ''}>465 · Implicit TLS</option><option value="587" ${extra.smtp_port === '587' ? 'selected' : ''}>587 · Mandatory STARTTLS</option></select></label>
                    <label class="field">SMTP Username<input name="smtp_user" maxlength="255" value="${e(extra.smtp_user || '')}" placeholder="user@gmail.com" required></label>
                  ` : ''}
                </div>
                <button class="button small" style="margin-top:8px">${item ? 'Encrypt & Update Key' : 'Encrypt & Save Key'}</button>
              </form>
            </details>
          </div>`;
        }).join('')}
      </div>
    </div>
  </section>`;
}

export function settings(cfg, sess, canEditGlobal = true, accountKeys = []) {
  const accountCredentialsSection = accountProviderCredentials(accountKeys, sess);
  if (!canEditGlobal) return `${profileSettings(sess)}${accountCredentialsSection}`;
  return `${profileSettings(sess)}${accountCredentialsSection}${bimiSettings(cfg)}<div class="notice">Global settings apply to new requests without account-specific overrides. Global credentials are encrypted with your Worker’s encryption key.</div><div class="grid2"><section class="panel"><div class="panelhead"><div><h2>Global Workspace settings</h2><p>Mail routing, limits, and retention.</p></div></div><div class="panelbody"><form method="post" action="/admin/settings">${hidden(sess.csrf_token)}<div class="settingsgrid">${Object.entries(SETTINGS).map(([name, spec]) => `<label class="field">${e(spec[0])}${spec[1] === 'boolean' ? `<select name="${name}" class="custom-select"><option value="false" ${cfg[name] === 'false' ? 'selected' : ''}>False</option><option value="true" ${cfg[name] === 'true' ? 'selected' : ''}>True</option></select>` : `<input name="${name}" value="${e(cfg[name])}" type="${spec[1] === 'number' ? 'number' : spec[1] === 'email' ? 'email' : 'text'}" ${spec[1] === 'number' ? `min="${spec[3]}" max="${spec[4]}"` : ''} ${['https-url', 'optional-domain', 'sandbox-domain'].includes(spec[1]) ? '' : 'required'} maxlength="255">`}</label>`).join('')}</div><button class="button">Save settings</button></form></div></section><div><section class="panel"><div class="panelhead"><div><h2>Global Fallback Credentials</h2><p>Blank values keep your current credential. Values are never displayed.</p></div></div>${SECRETS.map(name => `<details><summary>${e(name)} &nbsp; ${badge(cfg[name] ? 'Configured' : 'Not set')}</summary><form method="post" action="/admin/credentials">${hidden(sess.csrf_token)}<input type="hidden" name="name" value="${name}"><label class="field">New credential<input type="password" name="value" autocomplete="new-password" required minlength="${name === 'API_SECRET_KEY' ? 43 : 16}" maxlength="4096" placeholder="Paste a new credential"></label>${sess.local_dev ? '<label class="field">Confirm local administrator token<input type="password" name="admin_token" autocomplete="current-password" required minlength="43" maxlength="128"></label>' : '<p class="footnote">Credential changes require a Cloudflare Access token issued within the last five minutes. Sign out of Access and sign in again if requested. This checks token age; identity-provider policy controls fresh user verification.</p>'}<button class="button">Save credential</button></form></details>`).join('')}</section><div class="notice warn">Access policy, local development token, encryption key, database binding, and domain routes stay in Cloudflare. They cannot be changed through this panel. Rotate credentials by replacing their values here.</div></div></div>`;
}

export function identities(rows, sess, domains = []) {
  const countBadge = rows.length ? `<span class="tag good">${rows.length} ${rows.length === 1 ? 'identity' : 'identities'}</span>` : '';
  const rowsHtml = rows.map(r => `<tr>
    <td>
      <div class="identity-name-cell">
        <span class="identity-avatar">${e(initial(r.display_name))}</span>
        <div class="identity-info">
          <span class="identity-title">${e(r.display_name)}</span>
          <details class="rename-popover">
            <summary class="rename-trigger" title="Rename display name">${icon('edit')}<span>Rename</span></summary>
            <div class="popover-dropdown">
              <form method="post" action="/admin/identities/update">
                ${hidden(sess.csrf_token)}
                <input type="hidden" name="email_address" value="${e(r.email_address)}">
                <input type="hidden" name="action" value="rename">
                <label class="field">
                  <span>Sender display name</span>
                  <input name="display_name" value="${e(r.display_name)}" required maxlength="100" autocomplete="off">
                </label>
                <button class="button small">Save name</button>
              </form>
            </div>
          </details>
        </div>
      </div>
    </td>
    <td>
      <div class="email-cell">
        <code class="email-pill">${e(r.email_address)}</code>
      </div>
    </td>
    <td>
      <div class="status-cell">
        ${badge(r.is_active ? 'Active' : 'Paused')}
        ${r.is_default ? '<span class="tag default">★ Default</span>' : ''}
      </div>
    </td>
    <td>
      <form method="post" action="/admin/identities/update" class="identity-actions">
        ${hidden(sess.csrf_token)}
        <input type="hidden" name="email_address" value="${e(r.email_address)}">
        <button class="button secondary small" name="action" value="toggle" title="${r.is_active ? 'Pause identity' : 'Enable identity'}">
          ${icon(r.is_active ? 'pause' : 'play')}
          <span>${r.is_active ? 'Pause' : 'Enable'}</span>
        </button>
        ${r.is_active && !r.is_default ? `<button class="button secondary small" name="action" value="default" title="Set as default sender">${icon('star')}<span>Set default</span></button>` : ''}
        <button class="button danger small iconb" name="action" value="delete" title="Delete sender identity" aria-label="Delete sender identity">
          ${icon('trash')}
        </button>
      </form>
    </td>
  </tr>`).join('');

  return `<div class="notice warn">Creating an identity here does not verify its domain. Verify every sending domain with each active provider before sending.</div>
<section class="panel">
  <div class="panelhead">
    <div>
      <h2>Sender identities</h2>
      <p>Outbound 'From' addresses authorized to send transactional email.</p>
    </div>
    ${countBadge}
  </div>
  ${!rows.length ? empty('No sender identities configured', 'Add a sender identity below matching one of your verified domains.') : `
  <div class="tablewrap">
    <table>
      <thead>
        <tr>
          <th>Sender</th>
          <th>Address</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  </div>`}
</section>
<section class="panel">
  <div class="panelhead">
    <div>
      <h2>Add sender identity</h2>
      <p>Create a verified sender address on one of your active sending domains.</p>
    </div>
  </div>
  <div class="panelbody">
    <form class="identityform-grid" method="post" action="/admin/identities/create">
      ${hidden(sess.csrf_token)}
      <div class="form-row-grid">
        <label class="field">
          <span class="field-title">Display name</span>
          <input name="display_name" maxlength="100" required placeholder="neoPathshala Support" autocomplete="name">
          <small>Human-friendly sender name</small>
        </label>
        <label class="field">
          <span class="field-title">Local part</span>
          <div class="input-suffix-wrap">
            <input name="local_part" maxlength="64" required autocomplete="off" spellcheck="false" placeholder="support">
            <span class="suffix-at">@</span>
          </div>
          <small>Username before domain</small>
        </label>
        <label class="field">
          <span class="field-title">Verified domain</span>
          <select name="domain" required class="custom-select">
            ${domains.map(d => `<option value="${e(d)}">${e(d)}</option>`).join('') || '<option value="" disabled>No verified domains</option>'}
          </select>
          <small>Active sending domain</small>
        </label>
        <div class="form-btn-col">
          <button class="button submit-btn">${icon('plus')}<span>Add identity</span></button>
        </div>
      </div>
    </form>
  </div>
</section>`;
}

export function compose(rows, sess) {
  return `<div class="grid2"><section class="panel"><div class="panelhead"><div><h2>Send a test email</h2><p>This sends a real message through your configured providers.</p></div></div><div class="panelbody"><form method="post" action="/admin/send-test">${hidden(sess.csrf_token)}<input type="hidden" name="idempotency_key" value="${crypto.randomUUID()}"><label class="field">Delivery mode<select name="delivery_mode" class="custom-select"><option value="normal">Configured providers</option>${sess.role === 'superadmin' ? '<option value="mailgun-sandbox">Mailgun sandbox only</option>' : ''}</select><small>Sandbox uses postmaster@your-sandbox domain and only sends through Mailgun. The sender selection below is ignored in sandbox mode. Authorize the recipient in Mailgun first.</small></label><label class="field">Sender<select name="from" required class="custom-select">${rows.filter(r => r.is_active).map(r => `<option value="${e(r.email_address)}" ${r.is_default ? 'selected' : ''}>${e(r.display_name)} · ${e(r.email_address)}</option>`).join('')}</select></label><label class="field">Recipient<input type="email" name="to" maxlength="254" required autocomplete="off" spellcheck="false" placeholder="you@example.com"></label><label class="field">Subject<input name="subject" maxlength="255" required value="Your NeoMail connection is ready"></label><label class="field">Plain text message<textarea name="text" maxlength="50000" required>Hello! This is a test message from your NeoMail workspace.</textarea></label><button class="button">Send test email ${icon('arrow')}</button></form></div></section><section class="panel"><div class="panelbody"><h2>Before you send</h2><ul class="list"><li>Verify the sender domain with your delivery provider.</li><li>Configure a provider credential in Settings.</li><li>Use an inbox you control for your first test.</li><li>Inspect the result in Mail activity. “Sent” means accepted by the provider.</li><li>If the result is uncertain, reconcile with the provider before sending again.</li></ul></div></section></div>`;
}

export function security(rows, env) {
  return `<section class="panel"><div class="panelhead"><h2>Protection status</h2></div><div class="panelbody">${[['Cloudflare Access', env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD ? 'Configured; JWT checked per admin request' : 'Requires production configuration'], ['Local development bypass', env.LOCAL_DEV === 'true' ? 'Enabled only for loopback HTTP' : 'Disabled'], ['Admin sessions', 'Revocable · 1 hour maximum · Secure / HttpOnly'], ['Request protection', 'Same-origin forms · Session CSRF tokens · Size limits'], ['Credentials', env.CONFIG_ENCRYPTION_KEY ? 'Encryption key configured' : 'Encryption key required for panel credentials'], ['API access', 'Separate bearer credential · Idempotency required']].map(([k, v]) => `<div class="checkrow"><strong>${e(k)}</strong><span class="muted">${e(v)}</span></div>`).join('')}</div></section><section class="panel"><div class="panelhead"><h2>Recent security events</h2><form method="post" action="/admin/sessions/revoke">${hidden(env.csrf)}<button class="button secondary small">Sign out all sessions</button></form></div>${!rows.length ? empty('No security events yet', 'Sign-ins and configuration changes will be recorded here.') : `<div class="tablewrap"><table><thead><tr><th>Event</th><th>IP address</th><th>Details</th><th>Time (UTC)</th></tr></thead><tbody>${rows.map(r => `<tr><td>${e(r.event_type)}</td><td>${e(r.ip_address)}</td><td>${e(r.details)}</td><td>${e(new Date(r.unix_timestamp * 1000).toISOString().slice(0, 16))}</td></tr>`).join('')}</tbody></table></div>`}</section>`;
}

export function inspector(mail) {
  let attempts;
  try {
    attempts = JSON.stringify(JSON.parse(mail.attempt_history || '[]'), null, 2);
  } catch {
    attempts = 'No trace available';
  }
  return `<section class="panel"><div class="panelhead"><div><h2>${e(mail.subject)}</h2><p>${e(mail.id)}</p></div>${badge(mail.transmission_status)}</div><div class="panelbody"><dl>${[['From', mail.sender_address], ['To', mail.recipient_address], ['Provider', mail.provider_used], ['Provider ID', mail.provider_message_id || 'Not available'], ['Content hash', mail.html_hash], ['Delivery note', mail.error_message || 'No delivery error recorded']].map(([k, v]) => `<dt>${e(k)}</dt><dd>${e(v)}</dd>`).join('')}</dl><h3>Message preview</h3>${mail.html_body ? `<iframe title="Isolated email preview" sandbox="" referrerpolicy="no-referrer" src="/admin/preview?id=${e(mail.id)}"></iframe>` : empty('HTML content was not retained', 'Enable body retention only if required. Existing content cannot be recovered.')}<details><summary>Plain text / raw inbound message</summary><pre>${e(mail.text_body || 'Message body was not retained.')}</pre></details><details><summary>Provider attempts</summary><pre class="trace">${e(attempts)}</pre></details></div></section>`;
}

export function setup(origin, cfg) {
  const snippet = `// Server-side only. Never expose the API token in browser code.\nconst response = await fetch('${origin}/api/v1/send', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer ' + process.env.NEOMAIL_API_KEY,\n    'Content-Type': 'application/json',\n    'Idempotency-Key': 'welcome:' + user.id + ':v1'\n  },\n  body: JSON.stringify({\n    from: '${cfg.DEFAULT_SENDER}',\n    to: user.email,\n    subject: 'Welcome to neopathshala',\n    text: 'Your account is ready.'\n  })\n});\nconst result = await response.json();\nif (!response.ok) throw new Error('Mail request failed');`;
  return `<div class="grid2"><section class="panel"><div class="panelhead"><h2>Connect nepathshala.com</h2></div><div class="panelbody"><ol class="list">${[['Deploy the Worker', 'Create D1, apply the schema and migration, configure secrets, and bind your chosen custom domain.'], ['Protect the console', 'Create a Cloudflare Access application for /admin and /admin/* with an explicit administrator allowlist and MFA. Configure team domain and audience in the Worker.'], ['Verify your sending domain', 'Copy provider-generated DNS records exactly. Enable one provider first, then verify fallback providers.'], ['Configure the workspace', 'Add a sender identity matching your verified domain, then save provider credentials and your separate API token in Settings.'], ['Connect your backend', 'Store NEOMAIL_URL and NEOMAIL_API_KEY in the neopathshala server environment. Send from authenticated backend flows only.'], ['Test and operate', 'Test acceptance, delivery webhooks, duplicate requests, invalid credentials, backups, and retention before launch.']].map(([title, desc], i) => `<li class="step"><span class="stepnum">${i + 1}</span><div><h3>${e(title)}</h3><p>${e(desc)}</p></div></li>`).join('')}</ol></div></section><section class="panel"><div class="panelhead"><h2>Backend request example</h2></div><div class="panelbody"><pre>${e(snippet)}</pre><div class="notice warn">Confirmed sender: your-sender@your-verified-domain.com. Verify this sending domain with each active provider before deployment.</div><p class="sub">Full deployment, security, API, recovery, and DNS instructions are included in the project’s docs directory.</p></div></section></div>`;
}

export function apiClients(clients, sess, createdKey = '') {
  const keyNotice = createdKey ? `<div class="notice">New API key (shown once): <code>${e(createdKey)}</code>. Store it securely; it will not be displayed again.</div>` : '';
  return `${keyNotice}<section class="panel"><div class="panelhead"><h2>API clients</h2><p>Issue separate bearer tokens for each application. Keys are stored only as hashes.</p></div><div class="tablewrap"><table><thead><tr><th>Name</th><th>Sender</th><th>Status</th><th>Created</th><th>Last used</th><th>Action</th></tr></thead><tbody>${clients.map(c => `<tr><td>${e(c.name)}</td><td>${e(c.sender_address || 'Any active identity')}</td><td>${badge(c.is_active ? 'Active' : 'Revoked')}</td><td>${e(new Date(c.created_at * 1000).toISOString().slice(0, 16).replace('T', ' '))}</td><td>${c.last_used_at ? e(new Date(c.last_used_at * 1000).toISOString().slice(0, 16).replace('T', ' ')) : 'Never'}</td><td>${c.is_active ? `<form method="post" action="/admin/api-clients/revoke">${hidden(sess.csrf_token)}<input type="hidden" name="id" value="${e(c.id)}"><button class="button secondary small">Revoke</button></form>` : ''}</td></tr>`).join('') || `<tr><td colspan="6">No API clients yet.</td></tr>`}</tbody></table></div></section><section class="panel"><div class="panelhead"><h2>Create API client</h2></div><div class="panelbody"><form method="post" action="/admin/api-clients/create">${hidden(sess.csrf_token)}<div class="settingsgrid"><label class="field">Client name<input name="name" required maxlength="80" placeholder="neoPathshala backend"></label><label class="field">Restricted sender (optional)<input type="email" name="sender_address" maxlength="254" autocomplete="off" spellcheck="false" placeholder="your-sender@your-verified-domain.com"></label></div><button class="button">Create client key</button></form><p class="footnote">Leave sender blank to allow any active sender identity. A restricted client can only send from its assigned sender.</p></div></section>`;
}

export function users(rows, sess, isSuperadmin = false) {
  const addForm = isSuperadmin ? `<section class="panel"><div class="panelhead"><h2>Add administrator</h2></div><div class="panelbody"><form method="post" action="/admin/users/add">${hidden(sess.csrf_token)}<div class="settingsgrid"><label class="field">Access subject (email)<input type="email" name="subject" required maxlength="254" autocomplete="off" spellcheck="false" placeholder="you@example.com"></label><label class="field">Role<select name="role" class="custom-select"><option value="admin">Admin</option></select></label></div><button class="button">Add user</button></form><p class="footnote">Admins receive a fully isolated workspace of their own. They never gain superadmin powers.</p></div></section>` : '';
  return `<section class="panel"><div class="panelhead"><h2>Administrator accounts</h2><p>Cloudflare Access identities authorized to use this console.</p></div><div class="tablewrap"><table><thead><tr><th>Subject</th><th>Role</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>${rows.map(r => `<tr><td>${e(r.subject)}</td><td>${e(r.role)}</td><td>${badge(r.is_active ? 'Active' : 'Revoked')}</td><td>${e(new Date(r.created_at * 1000).toISOString().slice(0, 16).replace('T', ' '))}</td><td>${isSuperadmin && r.role !== 'superadmin' && r.subject !== sess.subject ? `<details><summary>Edit</summary><form method="post" action="/admin/users/update">${hidden(sess.csrf_token)}<input type="hidden" name="old_subject" value="${e(r.subject)}"><label class="field">Subject<input name="new_subject" value="${e(r.subject)}" required maxlength="254"></label><label class="field">Role<select name="role" class="custom-select"><option value="admin" ${r.role === 'admin' ? 'selected' : ''}>Admin</option></select></label><button class="button secondary small">Save</button></form></details><form method="post" action="/admin/users/revoke">${hidden(sess.csrf_token)}<input type="hidden" name="subject" value="${e(r.subject)}"><button class="button secondary small">Revoke</button></form>` : ''}</td></tr>`).join('') || '<tr><td colspan="5">No users.</td></tr>'}</tbody></table></div></section>${addForm}`;
}

export function otpRequest(error = '') {
  return document('Sign in', `<div class="login"><div class="loginart"><a class="brand" href="/"><span class="brandmark">${icon('mail')}</span>neomail</a><div><div class="orb"><div></div><div></div><div></div></div><h1>Your mail.<br>A clearer view.</h1><p>Send, inspect, and manage your transactional email from one private workspace.</p></div><small>Built for your team. Powered by Cloudflare.</small></div><div class="loginform"><div class="logininner"><span class="tag good">${icon('security')} Private workspace</span><h1>Welcome to NeoMail</h1><p class="sub">Request a one-time code sent to your administrator email.</p>${error ? `<div class="notice error" role="alert">${e(error)}</div>` : ''}<form method="post" action="/login"><input type="hidden" name="step" value="request"><label class="field">Administrator email<input type="email" name="email" required maxlength="254" autocomplete="username" placeholder="you@example.com"></label><button class="button">Send login code ${icon('arrow')}</button></form></div></div></div>`);
}

export function otpVerify(email, error = '') {
  return document('Sign in', `<div class="login"><div class="loginart"><a class="brand" href="/"><span class="brandmark">${icon('mail')}</span>neomail</a><div><div class="orb"><div></div><div></div><div></div></div><h1>Your mail.<br>A clearer view.</h1><p>Send, inspect, and manage your transactional email from one private workspace.</p></div><small>Built for your team. Powered by Cloudflare.</small></div><div class="loginform"><div class="logininner"><span class="tag good">${icon('security')} Private workspace</span><h1>Enter your code</h1><p class="sub">A one-time code was sent to ${e(email)}.</p>${error ? `<div class="notice error" role="alert">${e(error)}</div>` : ''}<form method="post" action="/login"><input type="hidden" name="step" value="verify"><input type="hidden" name="email" value="${e(email)}"><label class="field">One-time code<input name="code" required pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" placeholder="123456"></label><button class="button">Sign in ${icon('arrow')}</button></form><p class="footnote"><a href="/login">Use a different email</a></p></div></div></div>`);
}

export function domains(rows, sess) {
  const copyScript = sess.script_nonce ? `<script nonce="${e(sess.script_nonce)}">const copyIcon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';document.addEventListener('click',async ev=>{const b=ev.target.closest('button[data-copy]');if(!b||b.disabled)return;ev.preventDefault();const value=b.getAttribute('data-copy');try{await navigator.clipboard.writeText(value);}catch{const ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}finally{ta.remove();}}const check='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';b.classList.add('copied');b.innerHTML=check;b.disabled=true;setTimeout(()=>{b.classList.remove('copied');b.innerHTML=copyIcon;b.disabled=false;},1600);});</script>` : '';
  const dnsField = (label, value, title) => `<div class="dnsfield"><span class="dnstype">${label}</span><code title="${e(title)}">${e(value)}</code><button type="button" class="button secondary small iconb" data-copy="${e(value)}" aria-label="Copy ${label}" title="Copy">${icon('copy')}</button></div>`;
  const record = r => r.verification_token ? `${dnsField('Name', '_neomail-verification.' + r.domain, 'TXT record host — paste this into the Host/Name field of your DNS provider')}${dnsField('Value', r.verification_token, 'TXT record content — paste this into the Value/Content field of your DNS provider')}` : '<p class="sub">Verification token missing — remove and re-add the domain.</p>';
  return `<div class="notice">Add a <strong>TXT record</strong> at your DNS provider (Cloudflare, GoDaddy, Namecheap…), then come back and click <strong>Verify</strong>. Copy the Name and Value below — each fits its own field in your DNS panel. Sending is only possible from verified domains, and the record is re-checked daily: if you delete it, sending stops automatically.</div><div class="notice warn">In your DNS panel: choose <code>TXT</code> as the record type, paste <strong>Name</strong> in the host/name box and <strong>Value</strong> in the content box, save, wait a few minutes for propagation, then verify below.</div><section class="panel"><div class="panelhead"><h2>Client domains</h2><p>Track domains clients will send from. Add the verification TXT record, then verify.</p></div><div class="tablewrap"><table><thead><tr><th>Domain</th><th>Status</th><th>Verification TXT record</th><th>Action</th></tr></thead><tbody>${rows.map(r => `<tr><td><div class="subject">${e(r.domain)}</div><span class="muted">${e(r.display_name)}</span></td><td>${badge(r.is_verified ? 'Verified' : 'Pending DNS')}</td><td>${record(r)}</td><td><form method="post" action="/admin/domains/verify">${hidden(sess.csrf_token)}<input type="hidden" name="domain" value="${e(r.domain)}"><button class="button secondary small">${r.is_verified ? 'Re-check' : 'Verify'}</button></form></td></tr>`).join('') || '<tr><td colspan="4">No domains yet.</td></tr>'}</tbody></table></div></section><section class="panel"><div class="panelhead"><h2>Add domain</h2></div><div class="panelbody"><form method="post" action="/admin/domains/create">${hidden(sess.csrf_token)}<div class="settingsgrid"><label class="field">Domain<input name="domain" required maxlength="253" pattern="[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?" title="Letters, digits, dots and hyphens only (e.g. client.example.com)" autocomplete="off" spellcheck="false" placeholder="client.example.com"></label><label class="field">Display name<input name="display_name" required maxlength="100" placeholder="Client name"></label></div><button class="button">Add domain</button></form></div></section>${copyScript}`;
}

export function errorPage(message, status) {
  return document('Request could not complete', `<div class="login" style="grid-template-columns:1fr;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px"><div class="panel" style="max-width:540px;width:100%;margin:0"><div class="panelhead" style="background:#fee2e2;border-color:#fecaca"><div style="display:flex;align-items:center;gap:10px"><span class="tag danger" style="font-size:12px;padding:4px 8px">${status}</span><h2 style="color:#b91c1c">Request could not complete</h2></div></div><div class="panelbody"><p style="font-size:14px;color:var(--text);margin-bottom:20px">${e(message)}</p><a class="button" href="/admin">Return to workspace</a></div></div></div>`);
}

export function accessLogin() {
  return document('Secure sign-in', `<div class="loginform" style="min-height:100vh"><div class="logininner"><span class="tag good">${icon('security')} Verified by Cloudflare Access</span><h1>Welcome to NeoMail</h1><p>Your identity has been verified through your configured email OTP or passkey sign-in provider.</p><form method="post" action="/login"><button class="button">Continue to workspace</button></form><p class="footnote">Sign-in options and approved administrator emails are managed in Cloudflare Access.</p></div></div>`);
}

function profileAvatar(profile) {
  const name = profile?.display_name || 'Administrator';
  const initials = Array.from(name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join('')).join('').toUpperCase();
  return `<span class="avatar">${profile?.avatar_mime ? `<img src="/admin/profile-image?v=${e(profile.updated_at)}" alt="${e(name)} profile image">` : e(initials)}</span>`;
}

function profileSettings(sess) {
  return `<section class="panel" id="profile"><div class="panelhead"><div><h2>Your profile</h2><p>Edit your name and upload a photo or company logo for your NeoMail profile.</p></div></div><div class="panelbody"><div class="profileeditor">${profileAvatar(sess.profile)}<div><strong>${e(sess.profile?.display_name || 'Administrator')}</strong><p class="sub">${e(sess.access_subject || '')}</p></div></div><form method="post" action="/admin/profile" enctype="multipart/form-data">${hidden(sess.csrf_token)}<div class="settingsgrid"><label class="field">Administrator email<input type="email" value="${e(sess.access_subject || '')}" readonly disabled aria-readonly="true"></label><label class="field">Profile name<input name="display_name" value="${e(sess.profile?.display_name || 'Administrator')}" required maxlength="80" autocomplete="name"></label><label class="field">Profile photo or logo<input type="file" name="avatar" accept="image/png,image/jpeg,image/webp"><small>PNG, JPEG or WebP · up to 8 MiB / 16 megapixels. Automatically resized to 512px and compressed to WebP before upload.</small></label></div>${sess.profile?.avatar_mime ? '<label class="checkbox"><input type="checkbox" name="remove_avatar" value="yes">Remove current image</label><br>' : ''}<p class="footnote" id="profile-upload-status" role="status" aria-live="polite"></p><noscript><p>Automatic compression requires JavaScript. Upload an already optimized PNG, JPEG or WebP under 128 KiB.</p></noscript><button class="button" type="submit">Save profile</button></form></div></section>${sess.script_nonce ? `<script nonce="${e(sess.script_nonce)}">${PROFILE_SCRIPT}</script>` : ''}`;
}

function bimiSettings(cfg) {
  const ready = !!cfg.BIMI_LOGO_URL && !!cfg.BIMI_CERTIFICATE_URL;
  const record = ready ? `v=BIMI1; l=${cfg.BIMI_LOGO_URL}; a=${cfg.BIMI_CERTIFICATE_URL};` : '';
  return `<section class="panel"><div class="panelhead"><div><h2>Inbox sender logo · BIMI</h2><p>For your-sender@your-verified-domain.com and other senders on the same domain.</p></div>${badge(ready ? 'URLs configured · Unverified' : 'Setup required')}</div><div class="panelbody"><p>Add your public SVG Tiny-PS logo URL and certificate URL in Workspace settings below. These URLs are public, not secret.</p><dl><dt>DNS type</dt><dd>TXT</dd><dt>Cloudflare DNS name</dt><dd><code>default._bimi.mail</code></dd><dt>Full DNS hostname</dt><dd><code>default._bimi.your-worker-domain.com</code></dd></dl>${record ? `<label class="field">DNS record value<textarea readonly rows="3">${e(record)}</textarea></label>` : '<div class="notice warn">No publishable record yet. Supply a real logo URL and a CA-issued VMC/CMC certificate URL first.</div>'}<p class="sub">Requires passing domain authentication and enforced DMARC. Gmail requires a VMC or CMC. A configured URL does not verify the certificate, DNS, logo compliance, or guarantee inbox display. Your private profile upload is not the public BIMI logo.</p></div></section>`;
}
