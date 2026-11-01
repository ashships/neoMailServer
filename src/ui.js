import { PROFILE_SCRIPT } from './profile-client.js';
import { SPA_CLIENT_SCRIPT } from './spa-client.js';
import { escape as e } from './security.js';
import { SETTINGS, SECRETS, PROVIDERS } from './config.js';
import {
  LayoutDashboard,
  Mail,
  Server,
  Users,
  ShieldCheck,
  Settings,
  BookOpen,
  ArrowRight,
  Key,
  UserPlus,
  Globe,
  FileText,
  Copy,
  Trash2,
  Pencil,
  Menu,
  X,
  ChevronDown,
  Filter,
  Search,
  Check,
  ExternalLink,
  RotateCw,
  Plus,
  Pause,
  Play,
  Star,
  User,
  Sun,
  Moon,
  ArrowUp,
  ArrowDown,
  Bold,
  Italic,
  List,
  Code,
  Link,
  Eye,
  Zap,
  Camera,
  Image,
  Upload,
} from 'lucide';

const icons = {
  LayoutDashboard,
  Mail,
  Server,
  Users,
  ShieldCheck,
  Settings,
  BookOpen,
  ArrowRight,
  Key,
  UserPlus,
  Globe,
  FileText,
  Copy,
  Trash2,
  Pencil,
  Menu,
  X,
  ChevronDown,
  Filter,
  Search,
  Check,
  ExternalLink,
  RotateCw,
  Plus,
  Pause,
  Play,
  Star,
  User,
  Sun,
  Moon,
  ArrowUp,
  ArrowDown,
  Bold,
  Italic,
  List,
  Code,
  Link,
  Eye,
  Zap,
  Camera,
  Image,
  Upload,
};

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
  sun: 'Sun',
  moon: 'Moon',
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  bold: 'Bold',
  italic: 'Italic',
  list: 'List',
  code: 'Code',
  link: 'Link',
  eye: 'Eye',
  zap: 'Zap',
  camera: 'Camera',
  image: 'Image',
  upload: 'Upload',
};

function initial(name) {
  if (!name || typeof name !== 'string') return 'S';
  const trimmed = name.trim();
  return trimmed ? Array.from(trimmed)[0].toUpperCase() : 'S';
}

function icon(name) {
  const iconSymbol = iconMap[name] || name;
  const data = icons[iconSymbol] || icons.Mail;
  if (!Array.isArray(data)) return '';
  const inner = data.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k,v]) => `${k}="${String(v).replace(/"/g,'&quot;')}"`).join(' ')}/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

function lucideSvgUri(iconName, stroke = '#64748b', strokeWidth = 2) {
  const iconSymbol = iconMap[iconName] || iconName;
  const data = icons[iconSymbol] || icons[iconName];
  if (!Array.isArray(data)) return '';
  const inner = data.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k,v]) => `${k}='${v}'`).join(' ')}/>`).join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${stroke}' stroke-width='${strokeWidth}' stroke-linecap='round' stroke-linejoin='round'>${inner}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const chevronDownUri = lucideSvgUri('chevron', '#64748b', 2);
const checkUri = lucideSvgUri('check', '#087d54', 2.5);
const faviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='#087d54'/><path d='M7 10h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='m5 11 11 8 11-8' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><circle cx='23' cy='9' r='3.5' fill='#34d399'/></svg>`;
export { faviconSvg };
export const faviconUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

const css = `
@font-face {
  font-family: 'Plus Jakarta Sans';
  font-style: normal;
  font-weight: 300 800;
  font-display: block;
  src: url('https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400 600;
  font-display: block;
  src: url('https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwgknk-6nFg.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

:root {
  color-scheme: light dark;
  --bg: #fbfaf8;
  --surface: #ffffff;
  --surface-hover: #f5f4f0;
  --surface-active: #edebe6;
  --text: #212624;
  --text-secondary: #4a544f;
  --muted: #69746e;
  --line: #dfddd7;
  --line-strong: #d2d0c8;
  --accent: #087d54;
  --accent-hover: #066b47;
  --accent-active: #044e33;
  --accent-fg: #ffffff;
  --tint: rgba(8, 125, 84, 0.08);
  --tint-strong: rgba(8, 125, 84, 0.16);
  --tint-text: #065f46;
  --brand-dark: #063b2c;
  --danger: #dc2626;
  --danger-bg: #fef2f2;
  --danger-line: #fecaca;
  --warn: #d97706;
  --warn-bg: #fffbeb;
  --warn-line: #fde68a;
  --info: #0284c7;
  --info-bg: #f0f9ff;
  --info-line: #bae6fd;
  --shadow-xs: none;
  --shadow-sm: none;
  --shadow-md: none;
  --shadow-lg: none;
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
  --font: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", Arial, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-family: var(--font);
  font-size: 14px;
}

/* NeoMail Dark Mode */
:root[data-theme="dark"],
:root.dark,
:root:has(#theme-toggle:checked) {
  color-scheme: dark;
  --bg: #131514;
  --surface: #1a1e1c;
  --surface-hover: #151816;
  --surface-active: #1c201e;
  --text: #f0ede6;
  --text-secondary: #c5cbc7;
  --muted: #8d9a92;
  --line: #2b332f;
  --line-strong: #3d4842;
  --accent: #10b981;
  --accent-hover: #059669;
  --accent-active: #047857;
  --accent-fg: #000000;
  --tint: rgba(16, 185, 129, 0.12);
  --tint-strong: rgba(16, 185, 129, 0.22);
  --tint-text: #6ee7b7;
  --brand-dark: #063b2c;
  --danger: #f87171;
  --danger-bg: rgba(239, 68, 68, 0.15);
  --danger-line: rgba(239, 68, 68, 0.3);
  --warn: #fbbf24;
  --warn-bg: rgba(245, 158, 11, 0.15);
  --warn-line: rgba(245, 158, 11, 0.3);
  --info: #38bdf8;
  --info-bg: rgba(56, 189, 248, 0.15);
  --info-line: rgba(56, 189, 248, 0.3);
  --shadow-xs: none;
  --shadow-sm: none;
  --shadow-md: none;
  --shadow-lg: none;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not(:has(#theme-toggle-light:checked)) {
    color-scheme: dark;
    --bg: #131514;
    --surface: #1a1e1c;
    --surface-hover: #151816;
    --surface-active: #1c201e;
    --text: #f0ede6;
    --text-secondary: #c5cbc7;
    --muted: #8d9a92;
    --line: #2b332f;
    --line-strong: #3d4842;
    --accent: #10b981;
    --accent-hover: #059669;
    --accent-active: #047857;
    --accent-fg: #000000;
    --tint: rgba(16, 185, 129, 0.12);
    --tint-strong: rgba(16, 185, 129, 0.22);
    --tint-text: #6ee7b7;
    --brand-dark: #063b2c;
    --danger: #f87171;
    --danger-bg: rgba(239, 68, 68, 0.15);
    --danger-line: rgba(239, 68, 68, 0.3);
    --warn: #fbbf24;
    --warn-bg: rgba(245, 158, 11, 0.15);
    --warn-line: rgba(245, 158, 11, 0.3);
    --info: #38bdf8;
    --info-bg: rgba(56, 189, 248, 0.15);
    --info-line: rgba(56, 189, 248, 0.3);
    --shadow-xs: none;
    --shadow-sm: none;
    --shadow-md: none;
    --shadow-lg: none;
  }
}

::selection {
  background: var(--accent);
  color: #000000 !important;
}

::-moz-selection {
  background: var(--accent);
  color: #000000 !important;
}

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: fixed;
  inset: 0;
  overscroll-behavior: none;
  overscroll-behavior-y: none;
}

* {
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: var(--line-strong) transparent;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--line-strong);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--muted);
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11", "ss01";
  letter-spacing: -0.011em;
}

::selection,
:root[data-theme="dark"] ::selection,
:root.dark ::selection,
:root:has(#theme-toggle:checked) ::selection {
  background: var(--accent);
  color: #000000 !important;
}

::-moz-selection,
:root[data-theme="dark"] ::-moz-selection,
:root.dark ::-moz-selection,
:root:has(#theme-toggle:checked) ::-moz-selection {
  background: var(--accent);
  color: #000000 !important;
}

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
  background-image: ${chevronDownUri};
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px 14px;
  padding: 9px 36px 9px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

select:hover {
  border-color: var(--line-strong);
  background-color: var(--surface-hover);
}

select:focus,
select:focus-visible {
  border-color: var(--accent);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

@supports (appearance: base-select) {
  select.custom-select {
    background-image: none;
  }
}

select::picker-icon {
  content: ${chevronDownUri};
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: transparent;
}

select:open::picker-icon {
  transform: rotate(180deg);
}

/* Force dropdown picker to ALWAYS open BELOW the input */
select::picker(select),
select.custom-select::picker(select) {
  position-area: bottom span-all;
  top: anchor(bottom);
  bottom: auto;
  left: anchor(left);
  right: auto;
  min-width: anchor-size(width);
  margin-top: 6px;
  margin-bottom: 0;
  position-try-fallbacks: flip-block;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-md);
  padding: 6px;
  z-index: 999;
}

select option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-xs);
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease;
}

select option:hover,
select option:focus {
  background-color: var(--tint);
  color: var(--accent);
}

select option::checkmark {
  content: ${checkUri};
  width: 14px;
  height: 14px;
  display: inline-block;
  margin-right: 6px;
  vertical-align: middle;
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
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-md);
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
  height: 100%;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  overscroll-behavior: none;
}

.sidebar {
  height: 100%;
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  border-right: 1px solid var(--line);
  background: var(--surface);
  padding: 0;
  display: flex;
  flex-direction: column;
  z-index: 40;
}

.sidehead {
  height: 64px;
  min-height: 64px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 750;
  font-size: 18px;
  letter-spacing: -0.5px;
  color: var(--text);
}

.brandmark {
  background: linear-gradient(135deg, var(--accent) 0%, #065f46 100%);
  color: white;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.brandmark svg {
  width: 20px;
  height: 20px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-title {
  font-size: 15px;
  font-weight: 750;
  letter-spacing: -0.4px;
  color: var(--text);
}

.brand-title span {
  color: var(--accent);
}

.brand-sub {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 1px;
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
  margin: 16px 18px 8px;
}

nav {
  display: grid;
  gap: 3px;
  padding: 0 12px;
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
  padding: 16px 18px 16px;
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
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.35; }
  100% { opacity: 1; }
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
  height: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overscroll-behavior: none;
}

.topbar {
  height: 64px;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  flex-shrink: 0;
  z-index: 30;
}

.theme-toggle-input {
  display: none;
}

.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
  padding: 0;
  line-height: 0;
}

.theme-toggle-btn:hover {
  background: var(--surface-hover);
  color: var(--accent);
  border-color: var(--line-strong);
}

.theme-toggle-btn span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  line-height: 0;
}

.theme-toggle-btn svg {
  width: 16px;
  height: 16px;
  display: block;
  margin: 0 auto;
  flex-shrink: 0;
}

.theme-toggle-btn .icon-moon {
  display: none;
}

:root[data-theme="dark"] .theme-toggle-btn .icon-sun,
:root.dark .theme-toggle-btn .icon-sun,
:root:has(#theme-toggle:checked) .theme-toggle-btn .icon-sun {
  display: none;
}

:root[data-theme="dark"] .theme-toggle-btn .icon-moon,
:root.dark .theme-toggle-btn .icon-moon,
:root:has(#theme-toggle:checked) .theme-toggle-btn .icon-moon {
  display: inline-flex;
}

.side-docs-link {
  margin-bottom: 10px;
  color: var(--accent);
  background: var(--tint);
  border: 1px solid var(--tint-strong);
}

.side-docs-link:hover {
  background: var(--surface-hover);
  color: var(--accent);
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
  gap: 8px;
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--accent);
  background: var(--tint);
  font-size: 13px;
  font-weight: 650;
  color: var(--accent);
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
  line-height: 1.3;
}

.compose-quickbtn:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: #ffffff;
  transform: translateY(-1px);
}

.compose-quickbtn:hover svg {
  color: #ffffff;
}

.compose-quickbtn:active {
  transform: translateY(0);
}

.compose-quickbtn svg {
  width: 17px;
  height: 17px;
  stroke-width: 2.2;
  color: var(--accent);
  transition: color 0.15s ease;
}

.profilelink {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 4px 12px 4px 5px;
  border-radius: var(--radius-full);
  border: 1px solid var(--line);
  background: var(--surface);
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  user-select: none;
}

.profilelink:hover {
  background: var(--surface-hover);
  border-color: var(--line-strong);
}

.custom-dropdown[open] .profilelink {
  border-color: var(--accent);
  background: var(--surface-hover);
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
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  max-width: 1600px;
  margin: 0;
  padding: 24px 32px 24px;
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
  font-size: 24px;
  letter-spacing: -0.032em;
  margin: 0 0 6px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.22;
}

h2 {
  font-size: 15px;
  letter-spacing: -0.02em;
  margin: 0;
  font-weight: 650;
  color: var(--text);
  line-height: 1.35;
}

h3 {
  font-size: 13.5px;
  letter-spacing: -0.015em;
  margin: 0;
  font-weight: 600;
  color: var(--text);
}

p {
  margin: 6px 0;
  color: var(--muted);
  line-height: 1.55;
}

.sub {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.45;
  letter-spacing: -0.008em;
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
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  color: var(--accent-fg);
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
  box-shadow: none !important;
}

.button:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  color: var(--accent-fg);
  transform: translateY(-1px);
}

.button:active {
  background: var(--accent-active);
  transform: translateY(0);
}

.button.secondary {
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--line);
}

.button.secondary:hover {
  background: var(--surface-hover);
  border-color: var(--line-strong);
  color: var(--text);
  transform: translateY(-1px);
}

.button.secondary:active {
  transform: translateY(0);
}

.button.danger {
  background: var(--danger-bg);
  border: 1px solid var(--danger-line);
  color: var(--danger);
}

.button.danger:hover {
  background: var(--danger-line);
  color: var(--danger);
  transform: translateY(-1px);
}

.button.danger:active {
  transform: translateY(0);
}

.button.small {
  padding: 5px 12px;
  font-size: 11.5px;
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
  background: var(--surface-hover);
}

.statlabel {
  font-size: 11px;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statlabel svg {
  width: 16px;
  height: 16px;
  color: var(--accent);
}

.statvalue {
  font-size: 32px;
  font-weight: 750;
  letter-spacing: -0.035em;
  line-height: 1.15;
  margin: 12px 0 6px;
  font-variant-numeric: tabular-nums lining-nums;
  color: var(--text);
}

.statnote {
  color: var(--muted);
  font-size: 11.5px;
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
  font-variant-numeric: tabular-nums;
}

th {
  background: var(--surface-hover);
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 650;
  color: var(--muted);
  padding: 12px 20px;
  border-bottom: 1px solid var(--line);
}

td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

tr:last-child td {
  border-bottom: 0;
}

tr:hover td {
  background: var(--surface-hover);
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
  border: 1px solid var(--line);
}

.tag.good,
.tag.Sent,
.tag.Delivered,
.tag.Configured,
.tag.Verified,
.tag.Active {
  background: var(--tint);
  border-color: var(--tint-strong);
  color: var(--tint-text);
}

.tag.warn,
.tag.Paused,
.tag.Queued,
.tag.default {
  background: var(--warn-bg);
  border-color: var(--warn-line);
  color: var(--warn);
}

.tag.Failed,
.tag.Bounced,
.tag.danger {
  background: var(--danger-bg);
  border-color: var(--danger-line);
  color: var(--danger);
}

/* Advanced filter bar */
.filters {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 22px;
  border-bottom: 1px solid var(--line);
  background: var(--surface-hover);
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
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--accent);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
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
  color: var(--warn);
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
  background: var(--surface-hover);
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
  background: var(--surface-hover);
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

.collapsible-domains-panel {
  padding: 0 !important;
  border-top: none !important;
}

.collapsible-domains-panel > summary {
  list-style: none;
}

.collapsible-domains-panel > summary::-webkit-details-marker {
  display: none;
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
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-md);
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
  background: var(--surface-hover);
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
  background: var(--accent);
}

.tag.Paused::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--warn);
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
  main { max-width: 1720px; padding: 24px 36px 24px; margin: 0; }
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
    border-right: 1px solid var(--line-strong);
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
  .topbar,
  .sidehead {
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

/* Dark mode component enhancements */
:root[data-theme="dark"] th, :root.dark th, :root:has(#theme-toggle:checked) th { background: #131514; color: var(--muted); border-bottom-color: var(--line); }
:root[data-theme="dark"] tr:hover td, :root.dark tr:hover td, :root:has(#theme-toggle:checked) tr:hover td { background: #111413 !important; }
:root[data-theme="dark"] td, :root.dark td, :root:has(#theme-toggle:checked) td { border-bottom-color: var(--line); color: var(--text); }
:root[data-theme="dark"] .filters, :root.dark .filters, :root:has(#theme-toggle:checked) .filters,
:root[data-theme="dark"] .pagination, :root.dark .pagination, :root:has(#theme-toggle:checked) .pagination { background: #151816; border-color: var(--line); color: var(--muted); }
:root[data-theme="dark"] pre, :root.dark pre, :root:has(#theme-toggle:checked) pre { background: #0c0e0d; border-color: var(--line); color: var(--text); }
:root[data-theme="dark"] code, :root.dark code, :root:has(#theme-toggle:checked) code { color: #86efac; }
:root[data-theme="dark"] .email-pill, :root.dark .email-pill, :root:has(#theme-toggle:checked) .email-pill { background: #151816; border-color: var(--line); color: var(--text); }
:root[data-theme="dark"] select, :root.dark select, :root:has(#theme-toggle:checked) select { background-color: var(--surface); color: var(--text); border-color: var(--line); }
:root[data-theme="dark"] select:hover, :root.dark select:hover, :root:has(#theme-toggle:checked) select:hover { background-color: #0d100f !important; border-color: #3d4842 !important; }
:root[data-theme="dark"] select option, :root.dark select option, :root:has(#theme-toggle:checked) select option { background: var(--surface); color: var(--text); }
:root[data-theme="dark"] .stat:hover, :root.dark .stat:hover, :root:has(#theme-toggle:checked) .stat:hover { background: #111413 !important; border-color: #3d4842 !important; }
:root[data-theme="dark"] .provider:hover, :root.dark .provider:hover, :root:has(#theme-toggle:checked) .provider:hover { background: #111413 !important; border-color: #3d4842 !important; }
:root[data-theme="dark"] .tag.Active, :root.dark .tag.Active,
:root[data-theme="dark"] .tag.good, :root.dark .tag.good, :root:has(#theme-toggle:checked) .tag.good { background: var(--tint); border-color: var(--tint-strong); color: var(--tint-text); }
:root[data-theme="dark"] .tag.Paused, :root.dark .tag.Paused,
:root[data-theme="dark"] .tag.warn, :root.dark .tag.warn, :root:has(#theme-toggle:checked) .tag.warn { background: var(--warn-bg); border-color: var(--warn-line); color: var(--warn); }
:root[data-theme="dark"] .tag.Failed, :root.dark .tag.Failed,
:root[data-theme="dark"] .tag.danger, :root.dark .tag.danger, :root:has(#theme-toggle:checked) .tag.danger { background: var(--danger-bg); border-color: var(--danger-line); color: var(--danger); }
:root[data-theme="dark"] .editor-preview, :root.dark .editor-preview, :root:has(#theme-toggle:checked) .editor-preview { background: #0c0e0d; border-color: var(--line); color: var(--text); }
:root[data-theme="dark"] .routing-card, :root.dark .routing-card, :root:has(#theme-toggle:checked) .routing-card { background: var(--surface); border-color: var(--line); }
:root[data-theme="dark"] .routing-card:hover, :root.dark .routing-card:hover, :root:has(#theme-toggle:checked) .routing-card:hover { background: #111413 !important; border-color: #3d4842 !important; }
:root[data-theme="dark"] .order-btn, :root.dark .order-btn, :root:has(#theme-toggle:checked) .order-btn { background: #151816; color: var(--text); border-color: var(--line); }
:root[data-theme="dark"] .order-btn:hover:not(:disabled), :root.dark .order-btn:hover:not(:disabled), :root:has(#theme-toggle:checked) .order-btn:hover:not(:disabled) { background: #0d100f !important; color: #34d399 !important; border-color: rgba(52, 211, 153, 0.4) !important; }
:root[data-theme="dark"] .docs-view-body, :root.dark .docs-view-body, :root:has(#theme-toggle:checked) .docs-view-body { background: var(--surface); border-color: var(--line); color: var(--text); }
:root[data-theme="dark"] .compose-quickbtn, :root.dark .compose-quickbtn, :root:has(#theme-toggle:checked) .compose-quickbtn { background: var(--tint); border-color: var(--accent); color: var(--accent); }
:root[data-theme="dark"] .compose-quickbtn:hover, :root.dark .compose-quickbtn:hover, :root:has(#theme-toggle:checked) .compose-quickbtn:hover { background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }
:root[data-theme="dark"] .compose-quickbtn:hover svg, :root.dark .compose-quickbtn:hover svg, :root:has(#theme-toggle:checked) .compose-quickbtn:hover svg { color: var(--accent-fg); }
:root[data-theme="dark"] .logininner .button, :root.dark .logininner .button, :root:has(#theme-toggle:checked) .logininner .button { background: var(--accent); color: var(--accent-fg); }
:root[data-theme="dark"] input::placeholder, :root.dark input::placeholder, :root:has(#theme-toggle:checked) input::placeholder,
:root[data-theme="dark"] textarea::placeholder, :root.dark textarea::placeholder, :root:has(#theme-toggle:checked) textarea::placeholder { color: var(--muted); opacity: 0.6; }

/* Dark mode deep obsidian hover states */
:root[data-theme="dark"] .theme-toggle-btn:hover,
:root.dark .theme-toggle-btn:hover,
:root:has(#theme-toggle:checked) .theme-toggle-btn:hover {
  background: #0d100f !important;
  color: #34d399 !important;
  border-color: rgba(52, 211, 153, 0.45) !important;
}
:root[data-theme="dark"] .theme-toggle-btn:hover svg,
:root.dark .theme-toggle-btn:hover svg,
:root:has(#theme-toggle:checked) .theme-toggle-btn:hover svg {
  color: #34d399 !important;
  stroke: #34d399 !important;
}
:root[data-theme="dark"] .button.secondary:hover,
:root.dark .button.secondary:hover,
:root:has(#theme-toggle:checked) .button.secondary:hover {
  background: #0d100f !important;
  border-color: #3d4842 !important;
  color: #f0ede6 !important;
}
:root[data-theme="dark"] .navlink:hover,
:root.dark .navlink:hover,
:root:has(#theme-toggle:checked) .navlink:hover {
  background: #0d100f !important;
  color: #34d399 !important;
  border-color: rgba(52, 211, 153, 0.25) !important;
}
:root[data-theme="dark"] .profilelink:hover,
:root.dark .profilelink:hover,
:root:has(#theme-toggle:checked) .profilelink:hover {
  background: #0d100f !important;
  border-color: #3d4842 !important;
}
:root[data-theme="dark"] .drawer-btn:hover,
:root.dark .drawer-btn:hover,
:root:has(#theme-toggle:checked) .drawer-btn:hover,
:root[data-theme="dark"] .copybtn:hover,
:root.dark .copybtn:hover,
:root:has(#theme-toggle:checked) .copybtn:hover {
  background: #0d100f !important;
  color: #34d399 !important;
  border-color: rgba(52, 211, 153, 0.4) !important;
}
:root[data-theme="dark"] .dropdown-item:hover,
:root.dark .dropdown-item:hover,
:root:has(#theme-toggle:checked) .dropdown-item:hover {
  background: #0d100f !important;
  color: #34d399 !important;
}

/* DNS Security Alert Banner */
.dns-alert-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  margin-bottom: 20px;
  background: var(--danger-bg);
  border: 1px solid var(--danger-line);
  border-radius: var(--radius-md);
  color: var(--danger);
  animation: bannerSlideIn 0.2s ease-out;
}
@keyframes bannerSlideIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.dns-alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dns-alert-icon svg {
  width: 22px;
  height: 22px;
  stroke: var(--danger);
}
.dns-alert-body {
  flex: 1;
}
.dns-alert-title {
  font-weight: 700;
  font-size: 13.5px;
  margin-bottom: 2px;
  color: var(--danger);
  letter-spacing: -0.01em;
}
.dns-alert-msg {
  font-size: 13px;
  color: var(--text);
  line-height: 1.45;
}
.dns-alert-action {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.danger-btn {
  background: var(--danger) !important;
  color: #ffffff !important;
  border: 1px solid var(--danger) !important;
  font-size: 12px !important;
  padding: 6px 14px !important;
  font-weight: 600 !important;
  border-radius: var(--radius-sm) !important;
}
.danger-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.danger-btn:active {
  transform: translateY(0);
}

/* SPA Progress Bar & Refresh Animation */
#spa-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2.5px;
  width: 0%;
  background: var(--accent);
  z-index: 9999;
  transition: width 0.2s ease, opacity 0.3s ease;
  opacity: 0;
  pointer-events: none;
}
#spa-progress.loading {
  opacity: 1;
  width: 70%;
}
#spa-progress.done {
  width: 100%;
  opacity: 0;
}
/* Action icon hover animations */
.button svg,
.navlink svg,
.iconb svg,
.spa-refresh-btn svg,
.avatar-camera-btn svg,
.compose-quickbtn svg {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.button:hover svg {
  transform: scale(1.12);
}

.button.secondary:hover svg {
  transform: scale(1.08);
}

.navlink:hover svg {
  transform: translateX(2px) scale(1.08);
}

.spa-refresh-btn:hover svg {
  transform: rotate(45deg);
}

.iconb:hover svg {
  transform: scale(1.15);
}

/* Profile Photo Card (Image 3 Design) */
.profile-photo-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
.profile-photo-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}
.profile-photo-card {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 16px 20px;
  background: var(--surface-hover);
  border: 1px solid var(--line);
  border-radius: 14px;
}
.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}
.avatar-squircle {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: var(--surface);
  border: 2px solid var(--line);
  display: grid;
  place-items: center;
  font-size: 28px;
  font-weight: 700;
  color: var(--accent);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.15s ease;
}
.avatar-squircle:hover {
  border-color: var(--accent);
  transform: scale(1.02);
}
.avatar-squircle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.avatar-camera-btn {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1a1e1c;
  border: 2px solid var(--surface);
  color: #f0ede6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: none !important;
  transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
}
.avatar-camera-btn svg {
  width: 14px;
  height: 14px;
}
.avatar-camera-btn:hover {
  background: var(--accent);
  color: #ffffff;
  transform: scale(1.12);
}
.profile-photo-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.profile-photo-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}
.profile-photo-hint {
  font-size: 13px;
  color: var(--muted);
}

/* Rich Text Editor */
.rich-editor-container {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
  overflow: hidden;
  margin-bottom: 20px;
}

.rich-editor-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--surface-hover);
  border-bottom: 1px solid var(--line);
  flex-wrap: wrap;
}

.editor-btn-group {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  padding: 2px;
}

.editor-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.12s ease;
}

.editor-btn:hover {
  background: var(--surface-hover);
  color: var(--accent);
}

.editor-btn.active {
  background: var(--tint);
  color: var(--accent);
}

.editor-btn svg {
  width: 14px;
  height: 14px;
}

.editor-workspace {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 420px;
}

.editor-workspace.split-view {
  grid-template-columns: 1fr 1fr;
}

.editor-textarea {
  width: 100%;
  height: 100%;
  min-height: 420px;
  border: 0;
  padding: 16px 20px;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  background: var(--surface);
  color: var(--text);
  resize: vertical;
  outline: none;
  box-shadow: none;
  border-radius: 0;
  margin: 0;
}

.editor-textarea:focus {
  box-shadow: none;
  outline: none;
}

.editor-preview {
  display: none;
  padding: 16px 24px;
  background: var(--bg);
  border-left: 1px solid var(--line);
  overflow-y: auto;
  max-height: 600px;
  line-height: 1.6;
  font-size: 13px;
}

.editor-workspace.split-view .editor-preview {
  display: block;
}

.editor-preview h1, .editor-preview h2, .editor-preview h3 {
  margin-top: 16px;
  margin-bottom: 8px;
}
.editor-preview p {
  margin: 8px 0;
  color: var(--text);
}
.editor-preview code {
  background: var(--surface-hover);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--line);
}
.editor-preview pre {
  margin: 12px 0;
}
.editor-preview ul, .editor-preview ol {
  padding-left: 24px;
  margin: 8px 0;
}
.editor-preview blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 12px;
  margin: 12px 0;
  color: var(--muted);
  font-style: italic;
}

/* Application Status Footer */
.app-footer {
  height: 38px;
  min-height: 38px;
  background: var(--surface);
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 11px;
  color: var(--muted);
  flex-shrink: 0;
  box-sizing: border-box;
  z-index: 20;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--muted);
}

.footer-status-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.footer-status-item strong {
  color: var(--text);
  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  flex-shrink: 0;
}

.status-dot.good {
  background: #10b981;
}

.status-pulse {
  animation: pulse 2s infinite ease-in-out;
}

@media (max-width: 768px) {
  .app-footer {
    height: auto;
    padding: 8px 16px;
    gap: 8px;
    flex-direction: column;
    align-items: flex-start;
  }
  .footer-right {
    display: none;
  }
}

:root[data-theme="dark"] .app-footer,
:root.dark .app-footer,
:root:has(#theme-toggle:checked) .app-footer {
  background: #131514;
  border-top-color: var(--line);
  color: var(--muted);
}

/* Studio Documentation Layout */
main.docs-main-studio {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 !important;
  height: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 16px 20px !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}

.docs-studio-panel {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 !important;
  height: 100% !important;
  min-height: 0 !important;
  margin: 0 !important;
  border: 1px solid var(--line) !important;
  border-radius: var(--radius-md) !important;
  background: var(--surface) !important;
  overflow: hidden !important;
  box-shadow: none !important;
}

.docs-studio-body {
  display: grid;
  grid-template-columns: 240px 1fr 280px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: var(--bg);
}

@media (max-width: 1200px) {
  .docs-studio-body {
    grid-template-columns: 200px 1fr 240px;
  }
}

@media (max-width: 900px) {
  .docs-studio-body {
    grid-template-columns: 1fr;
  }
  .docs-studio-sidebar-left,
  .docs-studio-sidebar-right {
    display: none !important;
  }
}

.studio-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.12s ease;
}

.studio-nav-item:hover {
  background: var(--surface-hover);
  color: var(--accent);
}

.studio-nav-item.active {
  background: var(--tint);
  color: var(--accent);
  font-weight: 600;
  border-color: var(--line);
}

.studio-nav-item svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.studio-project-card {
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  transition: all 0.12s ease;
}

.studio-project-card:hover {
  border-color: var(--accent);
}

.studio-project-card .proj-name {
  font-weight: 700;
  font-size: 12px;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.studio-project-card .proj-url {
  font-size: 11px;
  font-family: var(--mono);
  color: var(--muted);
  margin-top: 3px;
  word-break: break-all;
}

.studio-project-card .proj-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid var(--line);
}

.studio-project-card .proj-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--surface-hover);
  color: var(--muted);
}

.editor-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-size: 11px;
  color: var(--muted);
  border-top: 1px solid var(--line);
  background: var(--surface-hover);
}

/* Provider Routing & Priority Styles */
.routing-chain {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.routing-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  gap: 16px;
}

.routing-card:hover {
  border-color: var(--line-strong);
  background: var(--surface-hover);
}

.routing-card.priority-primary {
  border-left: 4px solid var(--accent);
}

.routing-card-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.routing-rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: var(--accent);
  background: var(--tint);
  border-radius: var(--radius-xs);
  padding: 3px 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  min-width: 84px;
}

.routing-rank.primary {
  background: var(--accent);
  color: var(--accent-fg);
}

.routing-meta strong {
  display: block;
  font-size: 13px;
  font-weight: 650;
  text-transform: capitalize;
}

.routing-meta p {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--muted);
}

.routing-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.order-btn-group {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  overflow: hidden;
}

.order-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.12s ease;
  padding: 0;
}

.order-btn:hover:not(:disabled) {
  background: var(--tint);
  color: var(--accent);
}

.order-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.order-btn svg {
  width: 13px;
  height: 13px;
}

.order-btn-group form {
  display: inline-flex;
  margin: 0;
}

.provider-add-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: var(--surface-hover);
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  margin-top: 12px;
}

/* Documentation Reader */
.docs-view-body {
  padding: 28px 32px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}
.docs-view-body h1 {
  font-size: 26px;
  letter-spacing: -0.8px;
  margin: 0 0 16px;
  color: var(--accent);
}
.docs-view-body h2 {
  font-size: 18px;
  letter-spacing: -0.4px;
  margin: 24px 0 10px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 6px;
}
.docs-view-body h3 {
  font-size: 15px;
  margin: 18px 0 8px;
}
.docs-view-body pre {
  margin: 16px 0;
  padding: 16px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
}
`;

function document(title, content, nonce = '', isDark = false) {
  return `<!doctype html><html lang="en" ${isDark ? 'data-theme="dark" class="dark"' : ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#063b2c"><link rel="icon" type="image/svg+xml" href="${faviconUri}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preload" href="https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwgknk-6nFg.woff2" as="font" type="font/woff2" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"><title>${e(title)} · neoMail</title><style>${css}</style>${nonce ? `<script nonce="${nonce}">try{var cf=localStorage.getItem('neomail_font_css');if(cf){var s=document.createElement('style');s.id='neomail-fonts-cached';s.textContent=cf;document.head.appendChild(s);}var t=localStorage.getItem('neomail_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}}catch(e){}</script>` : ''}</head><body>${content}</body></html>`;
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

export function page(view, title, subtitle, content, sess, notice = '', alerts = []) {
  const base = sess?.role === 'superadmin' ? '/admin' : '/dashboard';
  const isDark = sess?.theme === 'dark';
  return document(title, `
    <input type="checkbox" id="theme-toggle" class="theme-toggle-input" aria-label="Toggle dark mode" ${isDark ? 'checked' : ''}>
    <input type="checkbox" id="drawer-toggle" class="drawer-toggle-input" aria-hidden="true">
    <label for="drawer-toggle" class="drawer-backdrop" aria-label="Close navigation"></label>
    <div id="spa-progress" role="progressbar" aria-hidden="true"></div>
    <div class="app">
      <aside class="sidebar">
        <div class="sidehead">
          <a class="brand" href="${base}">
            <span class="brandmark">${icon('mail')}</span>
            <div class="brand-text">
              <span class="brand-title">neo<span>Mail</span></span><!-- Neo<span>Mail</span> -->
              <span class="brand-sub">Mail Infrastructure</span>
            </div>
          </a>
          <label for="drawer-toggle" class="drawer-close" aria-label="Close navigation">${icon('close')}</label>
        </div>
        <div class="eyebrow">Workspace</div>
        <nav>${navFor(sess?.role).map(([id, label]) => `<a class="navlink ${id === view ? 'active' : ''}" ${id === view ? 'aria-current="page"' : ''} href="${base}/${id}">${icon(id)}<span>${label}</span></a>`).join('')}</nav>
        <div class="sidefoot">
          <a class="navlink side-docs-link" href="/docs" target="_blank">${icon('docs')}<span>Documentation ↗</span></a>
          <div class="sys-health-pill">
            <span class="live-pulse"></span>
            <span>System active</span>
          </div>
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
            <a class="compose-quickbtn" href="${base}/compose">${icon('mail')}<span>Send test</span></a>
            <label for="theme-toggle" class="theme-toggle-btn" title="Toggle dark / light theme" aria-label="Toggle dark mode">
              <span class="icon-sun">${icon('sun')}</span>
              <span class="icon-moon">${icon('moon')}</span>
            </label>
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
                <a class="dropdown-item" href="${base}/settings#profile">${icon('edit')} Your profile</a>
                <a class="dropdown-item" href="${base}/settings">${icon('settings')} Workspace settings</a>
                <a class="dropdown-item" href="${base}/security">${icon('security')} Security events</a>
                <a class="dropdown-item" href="${base}/compose">${icon('mail')} Send test email</a>
                <div class="dropdown-divider"></div>
                <form method="post" action="/admin/logout">
                  ${hidden(sess.csrf_token)}
                  <button class="dropdown-item text-danger" type="submit">${icon('arrow')} Sign out</button>
                </form>
              </div>
            </details>
          </div>
        </header>
        <main class="main ${view === 'docs' ? 'docs-main-studio' : ''}" id="app-main">
          ${alerts && alerts.length > 0 ? alerts.map(a => `
            <div class="dns-alert-banner" role="alert">
              <div class="dns-alert-icon">${icon('security')}</div>
              <div class="dns-alert-body">
                <div class="dns-alert-title">Domain Security Alert · Outbound Mail Paused</div>
                <div class="dns-alert-msg">${e(a.message)}</div>
              </div>
              <form method="post" action="${base}/domains/verify" class="dns-alert-action">
                ${hidden(sess.csrf_token)}
                <input type="hidden" name="domain" value="${e(a.domain)}">
                <button type="submit" class="button button-sm danger-btn">${icon('refresh')} Verify DNS now</button>
              </form>
            </div>
          `).join('') : ''}
          ${view === 'docs' ? '' : `
          <div class="pagehead">
            <div>
              <h1>${e(title)}</h1>
              <p class="sub">${e(subtitle)}</p>
            </div>
            <div class="actions">
              <a class="button secondary spa-refresh-btn" id="spa-refresh-link" href="${base}/${view}">${icon('refresh')} Refresh</a>
              <a class="button" href="${base}/compose">${icon('mail')} Send a test</a>
            </div>
          </div>
          `}
          ${notice ? `<div class="notice" role="status">${e(notice)}</div>` : ''}
          ${content}
        </main>
        <footer class="app-footer">
          <div class="footer-left">
            <div class="footer-status-item">
              <span class="status-dot good status-pulse"></span>
              <span>System: <strong>Operational</strong></span>
            </div>
            <div class="footer-status-item">
              <span class="status-dot good"></span>
              <span>API v1: <strong>Active · Healthy</strong></span>
            </div>
            <div class="footer-status-item">
              <span class="status-dot good"></span>
              <span>D1 Database: <strong>Connected</strong></span>
            </div>
          </div>
          <div class="footer-right">
            <span>Zero-Trust AES-256</span>
            <span>·</span>
            <span>Failover Routing</span>
            <span>·</span>
            <span>Auto-DNS Verified</span>
          </div>
        </footer>
      </div>
    </div>
    ${sess?.script_nonce ? `<script nonce="${sess.script_nonce}">${SPA_CLIENT_SCRIPT}</script>` : ''}
  `, sess?.script_nonce, isDark);
}

export function login(error = '', isDark = false) {
  return document('Sign in', `<div class="login"><div class="loginart"><a class="brand" href="/"><span class="brandmark">${icon('mail')}</span><div class="brand-text"><span class="brand-title">neo<span>Mail</span></span><span class="brand-sub">Mail Infrastructure</span></div></a><div><div class="orb"><div></div><div></div><div></div></div><h1>Transactional mail.<br>A clearer view.</h1><p>Send, inspect, and manage your transactional email from one private, hardened workspace.</p></div><small>Private mail infrastructure · neoMail</small></div><div class="loginform"><div class="logininner"><span class="tag good">${icon('security')} Private workspace</span><h1>Welcome to neoMail</h1><!-- Welcome to NeoMail --><p class="sub">Local development sign-in. Production uses email OTP or passkey through Cloudflare Access.</p>${error ? `<div class="notice error" role="alert">${e(error)}</div>` : ''}<form method="post" action="/login"><label class="field">Administrator token<input type="password" name="admin_token" required minlength="43" maxlength="128" autocomplete="current-password" placeholder="Enter your secure access token"></label><button class="button">Sign in to workspace ${icon('arrow')}</button></form><p class="footnote">Production sign-in also requires Cloudflare Access. Ask your workspace owner if you need access.</p></div></div></div>`, '', isDark);
}

function empty(message = 'Your mail activity will appear here', help = 'Configure a provider and sender identity, then send your first test email.') {
  return `<div class="empty">${icon('mail')}<strong>${e(message)}</strong><p>${e(help)}</p></div>`;
}

export function mailTable(logs) {
  if (!logs.length) return empty();
  return `<div class="tablewrap"><table><thead><tr><th>Message</th><th>Direction</th><th>Status</th><th>Provider</th><th>Time (UTC)</th><th>Details</th></tr></thead><tbody>${logs.map(m => `<tr><td><div class="subject">${e(m.subject)}</div><span class="muted">${e(m.recipient_address)}</span></td><td>${e(m.direction)}</td><td>${badge(m.transmission_status)}</td><td>${e(m.provider_used)}</td><td>${e(new Date(m.unix_timestamp * 1000).toISOString().slice(0, 16).replace('T', ' '))}</td><td><a class="button secondary small" href="/admin/view-mail?id=${e(m.id)}">Inspect ${icon('arrow')}</a></td></tr>`).join('')}</tbody></table></div>`;
}

export function providerList(rows = [], cfg = {}, csrf) {
  const safeRows = Array.isArray(rows) ? rows : [];
  return PROVIDERS.map(p => {
    const row = safeRows.find(r => r && r.provider_name === p);
    let configured = false;
    if (p === 'smtp') {
      configured = !!(cfg.SMTP_HOST && cfg.SMTP_USER && cfg.SMTP_PASS);
    } else {
      configured = !!cfg[p.toUpperCase() + '_API_KEY'];
    }
    return `<div class="provider"><div class="providerleft"><div class="providerlogo">${e(p[0].toUpperCase())}</div><div><strong>${e(p)}</strong><p>${configured ? 'Credential configured' : 'Add a credential in Settings'}${row?.consecutive_failures ? ' · ' + e(row.consecutive_failures) + ' recent failures' : ''}</p></div></div><div class="actions">${badge(!configured ? 'Not configured' : row?.is_active === 0 ? 'Paused' : row?.consecutive_failures >= 5 ? 'Cooling down' : 'Ready')}<a class="button secondary small" href="/admin/settings" aria-label="Configure">${icon('settings')}</a>${csrf ? `<form method="post" action="/admin/providers/toggle">${hidden(csrf)}<input type="hidden" name="provider" value="${p}"><button class="button secondary small">${row?.is_active === 0 ? 'Enable' : 'Pause'}</button></form>` : ''}</div></div>`;
  }).join('');
}

export function overview(stats = {}, logs = [], health = [], cfg = {}) {
  const safeStats = stats || {};
  return `<div class="stats">${[
    ['Total messages', safeStats.total ?? 0, 'Inbound and outbound'],
    ['Accepted / delivered', safeStats.accepted ?? 0, 'Provider acceptance is not inbox placement'],
    ['Delivery issues', safeStats.issues ?? 0, 'Failed or bounced'],
    ['Pending', safeStats.pending ?? 0, 'Queued or awaiting reconciliation']
  ].map(([label, value, note]) => `<div class="stat"><div class="statlabel"><span>${e(label)}</span>${icon('mail')}</div><div class="statvalue">${e(Number(value || 0).toLocaleString())}</div><div class="statnote">${e(note)}</div></div>`).join('')}</div><div class="split"><div><section class="panel"><div class="panelhead"><div><h2>Recent mail</h2><p>Your latest messages, in one place.</p></div><a class="button secondary small" href="/admin/mail">View all</a></div>${mailTable(Array.isArray(logs) ? logs : [])}</section><div class="notice">Message bodies are ${cfg.STORE_MESSAGE_BODIES === 'true' ? 'stored for inspection. Avoid sending secrets in email.' : 'not retained. Metadata remains available for delivery tracking.'}</div></div><div><section class="panel"><div class="panelhead"><div><h2>Delivery providers</h2><p>Availability based on configuration and recent attempts.</p></div></div>${providerList(health, cfg)}</section><section class="panel"><div class="panelbody"><h2>Connect your platform</h2><p class="sub">Send transactional mail from your application backend using a dedicated API credential.</p><a class="button secondary" href="/admin/setup">Integration guide ${icon('arrow')}</a></div></section></div></div>`;
}

export function mailView(logs, filters, currentPage, hasNext) {
  const query = new URLSearchParams(filters);
  const qStr = query.toString();
  return `<section class="panel"><div class="panelhead"><div><h2>Mail activity</h2><p>Search and inspect inbound and outbound messages.</p></div></div><form class="filters" method="get" action="/admin/mail"><div class="filter-group filter-search"><span class="field-label">Search</span><div class="input-with-icon"><span class="input-icon">${icon('search')}</span><input name="search" maxlength="100" placeholder="Subject or recipient" value="${e(filters.search)}"></div></div><div class="filter-group"><label class="field-label">Direction</label><select name="direction" class="custom-select"><option value="">All directions</option>${['outbound', 'inbound'].map(v => `<option value="${v}" ${filters.direction === v ? 'selected' : ''}>${v === 'outbound' ? 'Outbound ↗' : 'Inbound ↙'}</option>`).join('')}</select></div><div class="filter-group"><label class="field-label">Status</label><select name="status" class="custom-select"><option value="">All statuses</option>${['Queued', 'Sent', 'Delivered', 'Bounced', 'Failed'].map(v => `<option value="${v}" ${filters.status === v ? 'selected' : ''}>${v}</option>`).join('')}</select></div><div class="filter-actions"><button class="button secondary">${icon('filter')} Apply filters</button>${(filters.search || filters.direction || filters.status) ? `<a href="/admin/mail" class="button secondary small" title="Reset filters">${icon('close')} Clear</a>` : ''}</div></form>${mailTable(logs)}<div class="pagination"><span>Page ${currentPage} · Up to 25 messages per page</span><div class="actions">${currentPage > 1 ? `<a class="button secondary small" href="/admin/mail?${qStr ? e(qStr) + '&' : ''}page=${currentPage - 1}">Previous</a>` : ''}${hasNext ? `<a class="button secondary small" href="/admin/mail?${qStr ? e(qStr) + '&' : ''}page=${currentPage + 1}">Next</a>` : ''}</div></div></section>`;
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

function providerLimitsPanel(sess, limits = {}, usage = {}) {
  const base = sess?.role === 'superadmin' ? '/admin' : '/dashboard';
  return `
    <section class="panel" id="provider-limits">
      <div class="panelhead">
        <div>
          <h2>Provider Sending Limits (Your Workspace)</h2>
          <p>Configurable per-provider dispatch limits. When usage reaches the limit, neoMail fails over to the next provider.</p>
        </div>
      </div>
      <div class="panelbody">
        <div style="display:grid;gap:14px;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr))">
          ${PROVIDERS.map(p => {
            const provLimit = limits && limits[p] !== undefined ? limits[p] : 100;
            const provUsed = usage && usage[p] !== undefined ? usage[p] : 0;
            const pct = Math.min(100, Math.round((provUsed / provLimit) * 100));
            const isExceeded = provUsed >= provLimit;
            return `
              <div style="padding:14px;background:var(--bg);border:1px solid var(--line);border-radius:8px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                  <strong style="font-size:13px">${p.toUpperCase()}</strong>
                  <span class="tag ${isExceeded ? 'danger' : 'good'}" style="font-size:11px;font-weight:600">
                    ${provUsed} / ${provLimit} limit
                  </span>
                </div>
                <div style="width:100%;height:6px;background:var(--surface-hover);border-radius:3px;overflow:hidden;margin-bottom:12px">
                  <div style="width:${pct}%;height:100%;background:${isExceeded ? 'var(--danger)' : 'var(--accent)'};transition:width 0.3s"></div>
                </div>
                <form method="post" action="${base}/providers/limit" style="display:flex;gap:8px;align-items:center">
                  ${hidden(sess.csrf_token)}
                  <input type="hidden" name="provider" value="${p}">
                  <input type="hidden" name="from_view" value="settings">
                  <input type="number" name="limit" min="1" max="10000000" value="${provLimit}" required style="flex:1;padding:5px 8px;font-size:12px;border:1px solid var(--line);border-radius:6px;background:var(--surface);color:var(--text)" title="Set sending limit for ${p}">
                  <button class="button secondary small" type="submit">Update</button>
                </form>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}

export function settings(cfg, sess, canEditGlobal = true, accountKeys = [], limits = {}, usage = {}) {
  const accountCredentialsSection = accountProviderCredentials(accountKeys, sess);
  const limitsSection = providerLimitsPanel(sess, limits, usage);
  if (!canEditGlobal) return `${profileSettings(sess)}${limitsSection}${accountCredentialsSection}`;
  return `${profileSettings(sess)}${limitsSection}${accountCredentialsSection}${bimiSettings(cfg)}<div class="notice">Global settings apply to new requests without account-specific overrides. Global credentials are encrypted with your Worker’s encryption key.</div><div class="grid2"><section class="panel"><div class="panelhead"><div><h2>Global Workspace settings</h2><p>Mail routing, limits, and retention.</p></div></div><div class="panelbody"><form method="post" action="/admin/settings">${hidden(sess.csrf_token)}<div class="settingsgrid">${Object.entries(SETTINGS).map(([name, spec]) => `<label class="field">${e(spec[0])}${spec[1] === 'boolean' ? `<select name="${name}" class="custom-select"><option value="false" ${cfg[name] === 'false' ? 'selected' : ''}>False</option><option value="true" ${cfg[name] === 'true' ? 'selected' : ''}>True</option></select>` : `<input name="${name}" value="${e(cfg[name])}" type="${spec[1] === 'number' ? 'number' : spec[1] === 'email' ? 'email' : 'text'}" ${spec[1] === 'number' ? `min="${spec[3]}" max="${spec[4]}"` : ''} ${['https-url', 'optional-domain', 'sandbox-domain'].includes(spec[1]) ? '' : 'required'} maxlength="255">`}</label>`).join('')}</div><button class="button">Save settings</button></form></div></section><div><section class="panel"><div class="panelhead"><div><h2>Global Fallback Credentials</h2><p>Blank values keep your current credential. Values are never displayed.</p></div></div>${SECRETS.map(name => `<details><summary>${e(name)} &nbsp; ${badge(cfg[name] ? 'Configured' : 'Not set')}</summary><form method="post" action="/admin/credentials">${hidden(sess.csrf_token)}<input type="hidden" name="name" value="${name}"><label class="field">New credential<input type="password" name="value" autocomplete="new-password" required minlength="${name === 'API_SECRET_KEY' ? 43 : 16}" maxlength="4096" placeholder="Paste a new credential"></label>${sess.local_dev ? '<label class="field">Confirm local administrator token<input type="password" name="admin_token" autocomplete="current-password" required minlength="43" maxlength="128"></label>' : '<p class="footnote">Credential changes require a Cloudflare Access token issued within the last five minutes. Sign out of Access and sign in again if requested. This checks token age; identity-provider policy controls fresh user verification.</p>'}<button class="button">Save credential</button></form></details>`).join('')}</section><div class="notice warn">Access policy, local development token, encryption key, database binding, and domain routes stay in Cloudflare. They cannot be changed through this panel. Rotate credentials by replacing their values here.</div></div></div>`;
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
          <input name="display_name" maxlength="100" required placeholder="Support" autocomplete="name">
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
  const page = env?.page || 1;
  const pageSize = env?.pageSize || 10;
  const totalCount = env?.totalCount !== undefined ? env.totalCount : rows.length;
  const totalPages = env?.totalPages || Math.max(1, Math.ceil(totalCount / pageSize));
  const base = env?.base || '/admin';

  const startIdx = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, totalCount);

  const pageBtns = [];
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  for (let pNum = startPage; pNum <= endPage; pNum++) {
    pageBtns.push(`<a class="button small ${pNum === page ? '' : 'secondary'}" href="${base}/security?page=${pNum}" style="${pNum === page ? 'font-weight:700;border-color:var(--accent);' : ''}">${pNum}</a>`);
  }

  const paginationHtml = totalCount > 0 ? `
    <div class="pagination">
      <span>Showing ${startIdx}–${endIdx} of ${totalCount.toLocaleString()} events · Page ${page} of ${totalPages}</span>
      <div class="actions" style="display:flex;gap:6px;align-items:center">
        ${page > 1 ? `<a class="button secondary small" href="${base}/security?page=${page - 1}">Previous</a>` : `<span class="button secondary small" style="opacity:0.4;pointer-events:none">Previous</span>`}
        ${pageBtns.join('')}
        ${page < totalPages ? `<a class="button secondary small" href="${base}/security?page=${page + 1}">Next</a>` : `<span class="button secondary small" style="opacity:0.4;pointer-events:none">Next</span>`}
      </div>
    </div>
  ` : '';

  return `
    <section class="panel">
      <div class="panelhead"><h2>Protection status</h2></div>
      <div class="panelbody">
        ${[['Cloudflare Access', env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD ? 'Configured; JWT checked per admin request' : 'Requires production configuration'], ['Local development bypass', env.LOCAL_DEV === 'true' ? 'Enabled only for loopback HTTP' : 'Disabled'], ['Admin sessions', 'Revocable · 1 hour maximum · Secure / HttpOnly'], ['Request protection', 'Same-origin forms · Session CSRF tokens · Size limits'], ['Credentials', env.CONFIG_ENCRYPTION_KEY ? 'Encryption key configured' : 'Encryption key required for panel credentials'], ['API access', 'Separate bearer credential · Idempotency required']].map(([k, v]) => `<div class="checkrow"><strong>${e(k)}</strong><span class="muted">${e(v)}</span></div>`).join('')}
      </div>
    </section>
    <section class="panel">
      <div class="panelhead">
        <div>
          <h2>Recent security events</h2>
          <p>Review sign-ins, configuration changes, and access controls (10 events per page).</p>
        </div>
        <form method="post" action="/admin/sessions/revoke">
          ${hidden(env.csrf)}
          <button class="button secondary small">Sign out all sessions</button>
        </form>
      </div>
      ${!rows.length ? empty('No security events yet', 'Sign-ins and configuration changes will be recorded here.') : `
        <div class="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>IP address</th>
                <th>Details</th>
                <th>Time (UTC)</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(r => `<tr><td><strong>${e(r.event_type)}</strong></td><td><code style="font-size:11px">${e(r.ip_address)}</code></td><td>${e(r.details)}</td><td>${e(new Date(r.unix_timestamp * 1000).toISOString().slice(0, 16))}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        ${paginationHtml}
      `}
    </section>
  `;
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
  const snippet = `// Server-side only. Never expose the API token in browser code.\nconst response = await fetch('${origin}/api/v1/send', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer ' + process.env.NEOMAIL_API_KEY,\n    'Content-Type': 'application/json',\n    'Idempotency-Key': 'welcome:' + user.id + ':v1'\n  },\n  body: JSON.stringify({\n    from: '${cfg.DEFAULT_SENDER}',\n    to: user.email,\n    subject: 'Welcome to your account',\n    text: 'Your account is ready.'\n  })\n});\nconst result = await response.json();\nif (!response.ok) throw new Error('Mail request failed');`;
  return `<div class="grid2"><section class="panel"><div class="panelhead"><h2>Connect your platform</h2></div><div class="panelbody"><ol class="list">${[['Deploy the Worker', 'Create D1, apply the schema and migration, configure secrets, and bind your chosen custom domain.'], ['Protect the console', 'Create a Cloudflare Access application for /admin and /admin/* with an explicit administrator allowlist and MFA. Configure team domain and audience in the Worker.'], ['Verify your sending domain', 'Copy provider-generated DNS records exactly. Enable one provider first, then verify fallback providers.'], ['Configure the workspace', 'Add a sender identity matching your verified domain, then save provider credentials and your separate API token in Settings.'], ['Connect your backend', 'Store NEOMAIL_URL and NEOMAIL_API_KEY in your application server environment. Send from authenticated backend flows only.'], ['Test and operate', 'Test acceptance, delivery webhooks, duplicate requests, invalid credentials, backups, and retention before launch.']].map(([title, desc], i) => `<li class="step"><span class="stepnum">${i + 1}</span><div><h3>${e(title)}</h3><p>${e(desc)}</p></div></li>`).join('')}</ol></div></section><section class="panel"><div class="panelhead"><h2>Backend request example</h2></div><div class="panelbody"><pre>${e(snippet)}</pre><div class="notice warn">Confirmed sender: your-sender@your-verified-domain.com. Verify this sending domain with each active provider before deployment.</div><p class="sub">Full deployment, security, API, recovery, and DNS instructions are included in the project’s docs directory.</p></div></section></div>`;
}

export function docsEditor(content, sess) {
  return `<section class="panel docs-studio-panel">
    <div class="panelhead" style="padding:12px 18px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;background:var(--surface);flex-shrink:0">
      <div style="display:flex;align-items:center;gap:12px">
        <span class="tag good" style="font-weight:700;font-size:11px;padding:3px 8px;display:inline-flex;align-items:center;gap:5px">${icon('code')} STUDIO</span>
        <div>
          <h2 style="font-size:15px;margin:0;font-weight:700">Documentation Content & Live Editor</h2>
          <p style="margin:0;font-size:11px;color:var(--muted)">Author and publish system documentation with integrated neoCodebase project data.</p>
        </div>
      </div>
      <div class="actions" style="display:flex;align-items:center;gap:10px">
        <a class="button secondary small" href="/docs" target="_blank">${icon('external')} <span>View public page</span></a>
        <button class="button small" id="studio-save-top-btn" type="button">${icon('check')} <span>Publish documentation</span></button>
      </div>
    </div>

    <div class="docs-studio-body">
      <!-- LEFT SIDEBAR: Documentation Navigation Links -->
      <aside class="docs-studio-sidebar-left" style="border-right:1px solid var(--line);display:flex;flex-direction:column;min-height:0;background:var(--surface);overflow-y:auto">
        <div style="padding:12px 14px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted)">Docs Structure</span>
          <span class="tag" style="font-size:10px;padding:2px 6px">10 topics</span>
        </div>
        <div class="docs-nav-links" style="padding:8px;display:flex;flex-direction:column;gap:3px">
          <button type="button" class="studio-nav-item active" data-title="Getting Started" data-snippet="## Getting Started\n\nWelcome to neoMail. Private transactional email infrastructure.">
            ${icon('zap')} <span>Getting Started</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="Quickstart & Setup" data-snippet="## Quickstart & Setup\n\nConnect your application backend using the official SDK or REST API.">
            ${icon('play')} <span>Quickstart & Setup</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="Sending Domains & DNS" data-snippet="## Sending Domains & DNS Verification\n\nAdd TXT verification record:\n- Name: \`_neomail-verification.yourdomain.com\`\n- Value: \`your_verification_token\`">
            ${icon('globe')} <span>Domains & DNS</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="Delivery Providers" data-snippet="## Intelligent Fallback Routing\n\nOutbound emails are dispatched sequentially across enrolled providers (Resend → Brevo → Mailgun → Mailtrap → MailerSend → SMTP).">
            ${icon('server')} <span>Delivery Providers</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="Sender Identities" data-snippet="## Sender Identities\n\nSender identities must belong to a verified domain in your workspace.">
            ${icon('mail')} <span>Sender Identities</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="REST API Reference" data-snippet="## REST API Reference\n\nPOST \`/api/v1/send\` with Bearer token authentication and Idempotency-Key.">
            ${icon('code')} <span>API Reference</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="Zero-Trust Security" data-snippet="## Zero-Trust Security\n\nAccount-isolated provider credentials are encrypted at rest with AES-256-GCM in Cloudflare D1.">
            ${icon('security')} <span>Zero-Trust Security</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="Webhooks & Events" data-snippet="## Webhooks & Event Tracking\n\nReceive real-time delivery status updates, bounces, and complaints.">
            ${icon('refresh')} <span>Webhooks & Events</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="SMTP Relay" data-snippet="## SMTP Direct Relay\n\nConfigure custom SMTP relay on port 465 (Implicit TLS) or 587 (STARTTLS).">
            ${icon('settings')} <span>SMTP Relay</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="Quotas & Limits" data-snippet="## Provider Quotas & Rate Limits\n\nPer-provider sending quotas protect your sender reputation from unexpected surges.">
            ${icon('list')} <span>Quotas & Limits</span>
          </button>
        </div>
        <div style="margin-top:auto;padding:12px 14px;border-top:1px solid var(--line);background:var(--surface-hover)">
          <a href="/docs" target="_blank" style="font-size:12px;color:var(--accent);display:flex;align-items:center;gap:6px;font-weight:600">
            ${icon('external')} <span>Open Public Docs ↗</span>
          </a>
        </div>
      </aside>

      <!-- CENTER: Studio Markdown Editor -->
      <div class="docs-studio-editor-center" style="display:flex;flex-direction:column;min-height:0;min-width:0;background:var(--surface)">
        <form id="docs-editor-form" method="post" action="/admin/docs/save" style="display:flex;flex-direction:column;flex:1;min-height:0;margin:0">
          ${hidden(sess.csrf_token)}
          <div class="rich-editor-container" style="display:flex;flex-direction:column;flex:1;min-height:0;margin:0;border:0;border-radius:0">
            <div class="rich-editor-toolbar" role="toolbar" aria-label="Editor toolbar">
              <div class="editor-btn-group">
                <button type="button" class="editor-btn" data-action="h1" title="Heading 1">H1</button>
                <button type="button" class="editor-btn" data-action="h2" title="Heading 2">H2</button>
                <button type="button" class="editor-btn" data-action="h3" title="Heading 3">H3</button>
              </div>
              <div class="editor-btn-group">
                <button type="button" class="editor-btn" data-action="bold" title="Bold (Ctrl+B)">${icon('bold')}</button>
                <button type="button" class="editor-btn" data-action="italic" title="Italic (Ctrl+I)">${icon('italic')}</button>
                <button type="button" class="editor-btn" data-action="strike" title="Strikethrough">~S~</button>
              </div>
              <div class="editor-btn-group">
                <button type="button" class="editor-btn" data-action="quote" title="Quote">${icon('quote')}</button>
                <button type="button" class="editor-btn" data-action="code" title="Inline code">${icon('code')}</button>
                <button type="button" class="editor-btn" data-action="codeblock" title="Code block">&lt;/&gt;</button>
              </div>
              <div class="editor-btn-group">
                <button type="button" class="editor-btn" data-action="bullet" title="Bullet list">${icon('list')}</button>
                <button type="button" class="editor-btn" data-action="link" title="Insert link (Ctrl+K)">${icon('link')}</button>
                <button type="button" class="editor-btn" data-action="table" title="Insert table template">Table</button>
                <button type="button" class="editor-btn" data-action="hr" title="Divider">—</button>
              </div>
              <div class="editor-btn-group" style="margin-left:auto">
                <button type="button" id="editor-toggle-preview" class="editor-btn" title="Toggle Slide-out Preview">${icon('eye')} <span>Preview Drawer</span></button>
              </div>
            </div>

            <!-- Full-Height Editor Workspace with slide-out overlay preview instead of split-view crowding -->
            <div id="editor-workspace" class="editor-workspace" style="flex:1;min-height:0;display:flex;position:relative;height:100%">
              <textarea id="docs-editor-textarea" name="content" class="editor-textarea" maxlength="20000" placeholder="Write documentation here in Markdown or plain text..." style="flex:1;height:100%;min-height:0;resize:none;padding:18px 24px;font-family:var(--mono);font-size:13px;line-height:1.65;border:0;outline:none;background:var(--surface);color:var(--text);box-sizing:border-box">${e(content)}</textarea>
              <div id="docs-editor-preview" class="editor-preview" style="display:none;position:absolute;top:0;right:0;width:100%;height:100%;background:var(--surface);z-index:20;padding:24px;overflow-y:auto;border-left:1px solid var(--line);box-sizing:border-box" aria-live="polite">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--line)">
                  <strong>Live Preview</strong>
                  <button type="button" id="close-preview-btn" class="button secondary small" style="padding:3px 8px">${icon('close')} Close</button>
                </div>
                <div id="docs-preview-content"></div>
              </div>
            </div>

            <div class="editor-statusbar" style="padding:10px 18px;border-top:1px solid var(--line);background:var(--surface-hover);display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
              <span id="editor-counter">0 words · 0 / 20,000 characters</span>
              <div style="display:flex;align-items:center;gap:12px">
                <span class="tag good">${icon('security')} Superadmin Mode · Auto-Sync</span>
                <button class="button small" type="submit">${icon('check')} <span>Publish documentation</span></button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- RIGHT SIDEBAR: neoCodebase Connected Projects Panel -->
      <aside class="docs-studio-sidebar-right" style="border-left:1px solid var(--line);display:flex;flex-direction:column;min-height:0;background:var(--surface);overflow-y:auto">
        <div style="padding:12px 14px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between">
          <div>
            <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);display:block">Projects & Data</span>
            <span style="font-size:10px;color:var(--muted)">neoCodebase Workspace</span>
          </div>
          <button type="button" id="btn-toggle-add-proj" class="button secondary small" style="padding:3px 8px;font-size:11px" title="Add project to studio">+ Add</button>
        </div>

        <!-- Add Project Inline Form (collapsible) -->
        <div id="add-project-box" style="display:none;padding:12px;background:var(--surface-hover);border-bottom:1px solid var(--line)">
          <div style="display:flex;flex-direction:column;gap:8px">
            <label style="font-size:11px;font-weight:600">Project Name
              <input type="text" id="new-proj-name" placeholder="e.g. LMS Backend" required maxlength="50" style="width:100%;padding:5px 8px;font-size:11px;border:1px solid var(--line);border-radius:4px;background:var(--surface);color:var(--text);box-sizing:border-box">
            </label>
            <label style="font-size:11px;font-weight:600">Base URL / Repo Path
              <input type="text" id="new-proj-url" placeholder="https://api.yourdomain.com" required maxlength="120" style="width:100%;padding:5px 8px;font-size:11px;border:1px solid var(--line);border-radius:4px;background:var(--surface);color:var(--text);box-sizing:border-box">
            </label>
            <label style="font-size:11px;font-weight:600">Integration Type
              <select id="new-proj-type" class="custom-select" style="width:100%;padding:5px 8px;font-size:11px">
                <option value="API v1 Client">API v1 Client</option>
                <option value="Webhook Consumer">Webhook Consumer</option>
                <option value="SMTP Relay">SMTP Relay</option>
                <option value="Cloudflare Worker">Cloudflare Worker</option>
              </select>
            </label>
            <div style="display:flex;gap:6px;margin-top:4px">
              <button type="button" id="btn-save-project" class="button small" style="flex:1;padding:4px 8px;font-size:11px">Save Project</button>
              <button type="button" id="btn-cancel-project" class="button secondary small" style="padding:4px 8px;font-size:11px">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Projects List Container -->
        <div id="studio-projects-container" style="padding:10px;display:flex;flex-direction:column;gap:8px;flex:1"></div>

        <div style="padding:12px 14px;border-top:1px solid var(--line);background:var(--surface-hover);font-size:11px;color:var(--muted)">
          💡 Click <strong>Insert to Docs</strong> on any project to inject verified endpoint config and headers into your documentation.
        </div>
      </aside>
    </div>
  </section>
  ${sess?.script_nonce ? `<script nonce="${sess.script_nonce}">
    (function() {
      var ta = document.getElementById('docs-editor-textarea');
      var preview = document.getElementById('docs-editor-preview');
      var previewContent = document.getElementById('docs-preview-content');
      var counter = document.getElementById('editor-counter');
      var toggleBtn = document.getElementById('editor-toggle-preview');
      var closePreviewBtn = document.getElementById('close-preview-btn');
      var saveTopBtn = document.getElementById('studio-save-top-btn');
      var form = document.getElementById('docs-editor-form');

      if (!ta) return;

      if (saveTopBtn && form) {
        saveTopBtn.addEventListener('click', function() { form.submit(); });
      }

      function renderMarkdown(md) {
        if (!md) return '<p class="muted">No content to preview.</p>';
        var text = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var blocks = text.split(/\\n\\n+/);
        var html = '';
        for (var i = 0; i < blocks.length; i++) {
          var b = blocks[i].trim();
          if (!b) continue;
          if (b.startsWith('### ')) {
            html += '<h3>' + inlineFmt(b.slice(4)) + '</h3>';
          } else if (b.startsWith('## ')) {
            html += '<h2>' + inlineFmt(b.slice(3)) + '</h2>';
          } else if (b.startsWith('# ')) {
            html += '<h1>' + inlineFmt(b.slice(2)) + '</h1>';
          } else if (b.startsWith('> ')) {
            html += '<blockquote>' + inlineFmt(b.slice(2)) + '</blockquote>';
          } else if (b.startsWith('\x60\x60\x60')) {
            var lines = b.split('\\n');
            var code = lines.slice(1, lines[lines.length - 1] === '\x60\x60\x60' ? -1 : undefined).join('\\n');
            html += '<pre><code>' + code + '</code></pre>';
          } else if (b.startsWith('- ') || b.startsWith('* ')) {
            var items = b.split('\\n').map(function(l) { return l.replace(/^[-*]\\s+/, ''); });
            html += '<ul>' + items.map(function(item) { return '<li>' + inlineFmt(item) + '</li>'; }).join('') + '</ul>';
          } else if (/^\\d+\\.\\s/.test(b)) {
            var numItems = b.split('\\n').map(function(l) { return l.replace(/^\\d+\\.\\s+/, ''); });
            html += '<ol>' + numItems.map(function(item) { return '<li>' + inlineFmt(item) + '</li>'; }).join('') + '</ol>';
          } else if (b === '---' || b === '***') {
            html += '<hr style="border:0;border-top:1px solid var(--line);margin:16px 0;">';
          } else {
            html += '<p>' + inlineFmt(b.replace(/\\n/g, '<br>')) + '</p>';
          }
        }
        return html;
      }

      function inlineFmt(str) {
        return str
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          .replace(/~~([^~]+)~~/g, '<del>$1</del>')
          .replace(/\x60([^\x60]+)\x60/g, '<code>$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline">$1</a>');
      }

      function update() {
        var val = ta.value;
        var rendered = renderMarkdown(val);
        if (previewContent) previewContent.innerHTML = rendered;
        else if (preview) preview.innerHTML = rendered;
        if (counter) {
          var words = val.trim() ? val.trim().split(/\\s+/).length : 0;
          counter.textContent = words.toLocaleString() + ' words · ' + val.length.toLocaleString() + ' / 20,000 characters';
        }
      }

      function insert(prefix, suffix) {
        var start = ta.selectionStart;
        var end = ta.selectionEnd;
        var text = ta.value;
        var sel = text.substring(start, end);
        var replacement = prefix + (sel || 'text') + (suffix || '');
        ta.value = text.substring(0, start) + replacement + text.substring(end);
        ta.focus();
        ta.setSelectionRange(start + prefix.length, start + prefix.length + (sel ? sel.length : 4));
        update();
      }

      document.querySelectorAll('.rich-editor-toolbar button[data-action]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var action = btn.getAttribute('data-action');
          if (action === 'h1') insert('# ', '\\n');
          else if (action === 'h2') insert('## ', '\\n');
          else if (action === 'h3') insert('### ', '\\n');
          else if (action === 'bold') insert('**', '**');
          else if (action === 'italic') insert('*', '*');
          else if (action === 'strike') insert('~~', '~~');
          else if (action === 'quote') insert('> ', '\\n');
          else if (action === 'code') insert('\x60', '\x60');
          else if (action === 'codeblock') insert('\x60\x60\x60\\n', '\\n\x60\x60\x60');
          else if (action === 'bullet') insert('- ', '\\n');
          else if (action === 'link') insert('[link title](', ')');
          else if (action === 'table') insert('\\n| Header 1 | Header 2 |\\n| -------- | -------- |\\n| Cell 1   | Cell 2   |\\n', '');
          else if (action === 'hr') insert('\\n---\\n', '');
        });
      });

      // Navigation Items in Left Sidebar
      document.querySelectorAll('.studio-nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
          document.querySelectorAll('.studio-nav-item').forEach(function(el) { el.classList.remove('active'); });
          item.classList.add('active');
          var snippet = item.getAttribute('data-snippet');
          if (snippet) {
            insert('\\n\\n' + snippet + '\\n', '');
          }
        });
      });

      // Preview Drawer Toggle
      if (toggleBtn && preview) {
        toggleBtn.addEventListener('click', function() {
          var isHidden = preview.style.display === 'none';
          preview.style.display = isHidden ? 'block' : 'none';
          toggleBtn.classList.toggle('active', isHidden);
          update();
        });
      }
      if (closePreviewBtn && preview) {
        closePreviewBtn.addEventListener('click', function() {
          preview.style.display = 'none';
          if (toggleBtn) toggleBtn.classList.remove('active');
        });
      }

      // Projects Management in Right Sidebar
      var defaultProjects = [
        { id: 'proj-1', name: 'neoMail Production Worker', url: 'https://mail.neopathshala.com', type: 'Cloudflare Worker', endpoints: ['POST /api/v1/send', 'POST /api/v1/domains/verify'] },
        { id: 'proj-2', name: 'Nepathshala LMS Core', url: 'https://api.neopathshala.com', type: 'API v1 Client', endpoints: ['POST /webhooks/mail-events'] },
        { id: 'proj-3', name: 'Transactional Dispatcher', url: 'https://dispatcher.internal', type: 'Microservice Client', endpoints: ['Bearer Auth + Idempotency-Key'] }
      ];

      function getProjects() {
        try {
          var saved = localStorage.getItem('neomail_studio_projects');
          return saved ? JSON.parse(saved) : defaultProjects;
        } catch { return defaultProjects; }
      }

      function saveProjects(projs) {
        try { localStorage.setItem('neomail_studio_projects', JSON.stringify(projs)); } catch {}
        renderProjects();
      }

      function renderProjects() {
        var container = document.getElementById('studio-projects-container');
        if (!container) return;
        var projs = getProjects();
        container.innerHTML = projs.map(function(p) {
          return '<div class="studio-project-card" data-id="' + p.id + '">' +
            '<div class="proj-name"><span>' + p.name + '</span><span class="proj-tag">' + p.type + '</span></div>' +
            '<div class="proj-url">' + p.url + '</div>' +
            '<div class="proj-meta">' +
              '<button type="button" class="button secondary small btn-insert-proj" style="padding:2px 6px;font-size:10px" data-id="' + p.id + '">Insert to Docs</button>' +
              (p.id.startsWith('user-') ? '<button type="button" class="button danger small btn-del-proj" style="padding:2px 6px;font-size:10px" data-id="' + p.id + '">Delete</button>' : '<span style="font-size:10px;color:var(--accent)">● Verified</span>') +
            '</div>' +
          '</div>';
        }).join('');

        // Attach insert handlers
        container.querySelectorAll('.btn-insert-proj').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var pid = btn.getAttribute('data-id');
            var proj = getProjects().find(function(x) { return x.id === pid; });
            if (proj) {
              var md = '\\n\\n### ' + proj.name + ' Integration\\n' +
                '- **Base URL:** \`' + proj.url + '\`\\n' +
                '- **Integration Mode:** ' + proj.type + '\\n' +
                (proj.endpoints && proj.endpoints.length ? '- **Available Endpoints:** ' + proj.endpoints.map(function(e) { return '\`' + e + '\`'; }).join(', ') + '\\n' : '') +
                '- **Authentication:** \`Authorization: Bearer <API_SECRET_KEY>\`\\n' +
                '- **Idempotency:** \`Idempotency-Key: <UUID>\`\\n';
              insert(md, '');
            }
          });
        });

        // Attach delete handlers
        container.querySelectorAll('.btn-del-proj').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var pid = btn.getAttribute('data-id');
            var remaining = getProjects().filter(function(x) { return x.id !== pid; });
            saveProjects(remaining);
          });
        });
      }

      var toggleAddBtn = document.getElementById('btn-toggle-add-proj');
      var addBox = document.getElementById('add-project-box');
      var cancelAddBtn = document.getElementById('btn-cancel-project');
      var saveProjBtn = document.getElementById('btn-save-project');

      if (toggleAddBtn && addBox) {
        toggleAddBtn.addEventListener('click', function() {
          addBox.style.display = addBox.style.display === 'none' ? 'block' : 'none';
        });
      }
      if (cancelAddBtn && addBox) {
        cancelAddBtn.addEventListener('click', function() {
          addBox.style.display = 'none';
        });
      }
      if (saveProjBtn) {
        saveProjBtn.addEventListener('click', function() {
          var nameInput = document.getElementById('new-proj-name');
          var urlInput = document.getElementById('new-proj-url');
          var typeInput = document.getElementById('new-proj-type');
          if (!nameInput || !urlInput) return;
          var name = nameInput.value.trim();
          var url = urlInput.value.trim();
          var type = typeInput ? typeInput.value : 'API v1 Client';
          if (!name || !url) return;
          var projs = getProjects();
          projs.push({
            id: 'user-' + Date.now(),
            name: name,
            url: url,
            type: type,
            endpoints: ['POST /api/v1/send']
          });
          saveProjects(projs);
          nameInput.value = '';
          urlInput.value = '';
          if (addBox) addBox.style.display = 'none';
        });
      }

      renderProjects();

      ta.addEventListener('input', update);
      ta.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
          e.preventDefault(); insert('**', '**');
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
          e.preventDefault(); insert('*', '*');
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault(); insert('[', '](https://)');
        } else if (e.key === 'Tab') {
          e.preventDefault();
          var s = ta.selectionStart;
          ta.value = ta.value.substring(0, s) + '  ' + ta.value.substring(ta.selectionEnd);
          ta.selectionStart = ta.selectionEnd = s + 2;
          update();
        }
      });

      update();
    })();
  </script>` : ''}`;
}

export function docsViewer(content, sess) {
  function renderMarkdown(md) {
    if (!md) return '<p class="muted">No documentation published yet. Ask your superadmin to add docs.</p>';
    var text = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var blocks = text.split(/\\n\\n+/);
    var html = '';
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i].trim();
      if (!b) continue;
      if (b.startsWith('### ')) html += '<h3>' + inlineFmt(b.slice(4)) + '</h3>';
      else if (b.startsWith('## ')) html += '<h2>' + inlineFmt(b.slice(3)) + '</h2>';
      else if (b.startsWith('# ')) html += '<h1>' + inlineFmt(b.slice(2)) + '</h1>';
      else if (b.startsWith('> ')) html += '<blockquote>' + inlineFmt(b.slice(2)) + '</blockquote>';
      else if (b.startsWith('\x60\x60\x60')) {
        var lines = b.split('\\n');
        var code = lines.slice(1, lines[lines.length - 1] === '\x60\x60\x60' ? -1 : undefined).join('\\n');
        html += '<pre><code>' + code + '</code></pre>';
      } else if (b.startsWith('- ') || b.startsWith('* ')) {
        var items = b.split('\\n').map(function(l) { return l.replace(/^[-*]\\s+/, ''); });
        html += '<ul>' + items.map(function(item) { return '<li>' + inlineFmt(item) + '</li>'; }).join('') + '</ul>';
      } else if (/^\\d+\\.\\s/.test(b)) {
        var numItems = b.split('\\n').map(function(l) { return l.replace(/^\\d+\\.\\s+/, ''); });
        html += '<ol>' + numItems.map(function(item) { return '<li>' + inlineFmt(item) + '</li>'; }).join('') + '</ol>';
      } else {
        html += '<p>' + inlineFmt(b.replace(/\\n/g, '<br>')) + '</p>';
      }
    }
    return html;
  }
  function inlineFmt(str) {
    return str
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/~~([^~]+)~~/g, '<del>$1</del>')
      .replace(/\x60([^\x60]+)\x60/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline">$1</a>');
  }

  return `<section class="panel">
    <div class="panelhead">
      <div>
        <h2>Documentation & System Guide</h2>
        <p>Reference guide for NeoMail transactional mail infrastructure.</p>
      </div>
      <a class="button secondary small" href="/docs" target="_blank">${icon('external')} <span>View public page</span></a>
    </div>
    <div class="panelbody">
      <div class="docs-view-body">
        ${renderMarkdown(content)}
      </div>
    </div>
  </section>`;
}

export function providersView(rows, cfg, sess, limits = {}, usage = {}, userLimits = [], users = []) {
  const currentOrder = (cfg.FALLBACK_ORDER || 'resend,brevo,mailgun,mailtrap,mailersend').split(',').map(p => p.trim()).filter(Boolean);
  const unassigned = PROVIDERS.filter(p => !currentOrder.includes(p));

  const isConfigured = p => {
    if (p === 'smtp') return !!(cfg.SMTP_HOST && cfg.SMTP_USER && cfg.SMTP_PASS);
    return !!cfg[p.toUpperCase() + '_API_KEY'];
  };

  return `
    <div class="notice">
      <strong>⚡ Intelligent Fallback Dispatch:</strong> Outbound mail is routed in priority sequence (<b>${currentOrder.join(' → ')}</b>).
      If a provider encounters consecutive delivery rejections, circuit breakers isolate it for five minutes and fail over automatically.
    </div>

    <section class="panel">
      <div class="panelhead">
        <div>
          <h2>Active Routing Priority Order (Superadmin Controlled)</h2>
          <p>Reorder the sequence of outbound delivery providers. Highest priority (#1) is attempted first.</p>
        </div>
        <span class="tag good">${icon('security')} Superadmin Controlled</span>
      </div>
      <div class="panelbody">
        <div class="routing-chain">
          ${currentOrder.map((p, i) => {
            const row = rows.find(r => r.provider_name === p);
            const configured = isConfigured(p);
            const failures = row?.consecutive_failures || 0;
            const isPaused = row?.is_active === 0;
            const inCooldown = failures >= 5;
            const statusLabel = !configured ? 'Not configured' : isPaused ? 'Paused' : inCooldown ? 'Cooling down' : 'Ready';

            return `
              <div class="routing-card ${i === 0 ? 'priority-primary' : ''}">
                <div class="routing-card-left">
                  <div class="order-btn-group">
                    <form method="post" action="/admin/providers/reorder">
                      ${hidden(sess.csrf_token)}
                      <input type="hidden" name="provider" value="${p}">
                      <input type="hidden" name="direction" value="up">
                      <button class="order-btn" title="Move up in priority" ${i === 0 ? 'disabled' : ''}>${icon('arrowUp')}</button>
                    </form>
                    <form method="post" action="/admin/providers/reorder">
                      ${hidden(sess.csrf_token)}
                      <input type="hidden" name="provider" value="${p}">
                      <input type="hidden" name="direction" value="down">
                      <button class="order-btn" title="Move down in priority" ${i === currentOrder.length - 1 ? 'disabled' : ''}>${icon('arrowDown')}</button>
                    </form>
                  </div>
                  <span class="routing-rank ${i === 0 ? 'primary' : ''}">#${i + 1} ${i === 0 ? 'Primary' : 'Failover'}</span>
                  <div class="providerlogo">${e(p[0].toUpperCase())}</div>
                  <div class="routing-meta">
                    <strong>${e(p)}</strong>
                    <p>${configured ? 'Credential configured' : 'Add credentials below'}${failures ? ' · ' + failures + ' recent failures' : ''}</p>
                  </div>
                </div>
                <div class="routing-actions">
                  ${badge(statusLabel)}
                  ${failures > 0 ? `
                    <form method="post" action="/admin/providers/reset-health">
                      ${hidden(sess.csrf_token)}
                      <input type="hidden" name="provider" value="${p}">
                      <button class="button secondary small" title="Reset failure counter and circuit breaker">${icon('zap')} Reset breaker</button>
                    </form>
                  ` : ''}
                  <form method="post" action="/admin/providers/toggle">
                    ${hidden(sess.csrf_token)}
                    <input type="hidden" name="provider" value="${p}">
                    <button class="button secondary small">${isPaused ? 'Enable' : 'Pause'}</button>
                  </form>
                  <form method="post" action="/admin/providers/remove">
                    ${hidden(sess.csrf_token)}
                    <input type="hidden" name="provider" value="${p}">
                    <button class="button danger small" title="Remove from active routing" ${currentOrder.length <= 1 ? 'disabled' : ''}>Remove</button>
                  </form>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        ${unassigned.length ? `
          <div class="provider-add-card">
            <div>
              <strong>Enrol Unassigned Provider</strong>
              <p class="sub" style="margin:2px 0 0">Add an available supported provider to the end of the failover routing chain.</p>
            </div>
            <form method="post" action="/admin/providers/add" style="display:flex;align-items:center;gap:10px">
              ${hidden(sess.csrf_token)}
              <select name="provider" class="custom-select" style="padding:6px 32px 6px 12px;font-size:12px">
                ${unassigned.map(p => `<option value="${p}">${p.toUpperCase()}</option>`).join('')}
              </select>
              <button class="button small">${icon('plus')} Add to Routing</button>
            </form>
          </div>
        ` : `
          <div style="font-size:12px;color:var(--muted);margin-top:12px">
            ✓ All supported providers (${PROVIDERS.join(', ')}) are enrolled in the fallback routing chain.
          </div>
        `}
      </div>
    </section>

    <section class="panel">
      <div class="panelhead">
        <div>
          <h2>Provider Usage & Sending Limits (Global)</h2>
          <p>Monitor outbound email counts per delivery provider and configure global sending quotas.</p>
        </div>
      </div>
      <div class="panelbody">
        <div style="display:grid;gap:14px;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr))">
          ${PROVIDERS.map(p => {
            const provLimit = limits && limits[p] !== undefined ? limits[p] : 100;
            const provUsed = usage && usage[p] !== undefined ? usage[p] : 0;
            const pct = Math.min(100, Math.round((provUsed / provLimit) * 100));
            const isExceeded = provUsed >= provLimit;
            return `
              <div style="padding:14px;background:var(--bg);border:1px solid var(--line);border-radius:8px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                  <span style="font-weight:700;font-size:13px">${p.toUpperCase()}</span>
                  <span class="tag ${isExceeded ? 'danger' : 'good'}" style="font-size:11px;font-weight:600">
                    ${provUsed} / ${provLimit} limit
                  </span>
                </div>
                <div style="width:100%;height:6px;background:var(--surface-hover);border-radius:3px;overflow:hidden;margin-bottom:12px">
                  <div style="width:${pct}%;height:100%;background:${isExceeded ? 'var(--danger)' : 'var(--accent)'};transition:width 0.3s"></div>
                </div>
                <form method="post" action="/admin/providers/limit" style="display:flex;gap:8px;align-items:center">
                  ${hidden(sess.csrf_token)}
                  <input type="hidden" name="provider" value="${p}">
                  <input type="hidden" name="from_view" value="providers">
                  <input type="number" name="limit" min="1" max="10000000" value="${provLimit}" required style="flex:1;padding:5px 8px;font-size:12px;border:1px solid var(--line);border-radius:6px;background:var(--surface);color:var(--text)" title="Set default limit for ${p}">
                  <button class="button secondary small" type="submit">Update</button>
                </form>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panelhead">
        <div>
          <h2>Set Provider Limit Per User Workspace</h2>
          <p>Superadmins can assign custom sending limits to specific tenant administrators and user workspaces.</p>
        </div>
      </div>
      <div class="panelbody">
        <form method="post" action="/admin/providers/limit" style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;margin-bottom:20px">
          ${hidden(sess.csrf_token)}
          <input type="hidden" name="from_view" value="providers">
          <label class="field" style="margin:0;min-width:220px;flex:1">
            <span>Target User Workspace</span>
            <select name="target_user" class="custom-select" required>
              ${users.map(u => `<option value="${e(u.subject)}">${e(u.subject)} (${e(u.role)})</option>`).join('')}
            </select>
          </label>
          <label class="field" style="margin:0;min-width:140px">
            <span>Provider</span>
            <select name="provider" class="custom-select" required>
              ${PROVIDERS.map(p => `<option value="${p}">${p.toUpperCase()}</option>`).join('')}
            </select>
          </label>
          <label class="field" style="margin:0;min-width:140px">
            <span>Sending Limit</span>
            <input type="number" name="limit" min="1" max="10000000" value="100" required>
          </label>
          <button class="button" type="submit" style="margin-bottom:1px">${icon('check')} Save User Limit</button>
        </form>

        ${userLimits && userLimits.length ? `
          <div class="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>User Workspace</th>
                  <th>Provider</th>
                  <th>Sending Limit</th>
                  <th>Last Updated</th>
                  <th style="text-align:right">Quick Adjust</th>
                </tr>
              </thead>
              <tbody>
                ${userLimits.map(ul => `
                  <tr>
                    <td><code style="font-size:12px">${e(ul.owner_subject)}</code></td>
                    <td><strong>${e(ul.provider_name.toUpperCase())}</strong></td>
                    <td><span class="tag good" style="font-weight:600">${Number(ul.send_limit).toLocaleString()} emails</span></td>
                    <td class="muted">${e(new Date(ul.updated_at * 1000).toISOString().slice(0, 16))}</td>
                    <td style="text-align:right">
                      <form method="post" action="/admin/providers/limit" style="display:inline-flex;align-items:center;gap:6px">
                        ${hidden(sess.csrf_token)}
                        <input type="hidden" name="target_user" value="${e(ul.owner_subject)}">
                        <input type="hidden" name="provider" value="${e(ul.provider_name)}">
                        <input type="hidden" name="from_view" value="providers">
                        <input type="number" name="limit" min="1" max="10000000" value="${ul.send_limit}" style="width:80px;padding:3px 6px;font-size:11px">
                        <button class="button secondary small" type="submit">Update</button>
                      </form>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : '<p class="sub" style="margin:0">No custom per-user limits configured yet. All tenant workspaces inherit default limits.</p>'}
      </div>
    </section>

    <div class="grid2">
      <section class="panel">
        <div class="panelhead">
          <div>
            <h2>Configure Provider Credentials</h2>
            <p>Add or update provider API credentials directly.</p>
          </div>
        </div>
        <div class="panelbody">
          <form method="post" action="/admin/providers/configure">
            ${hidden(sess.csrf_token)}
            <label class="field">Provider
              <select name="provider" class="custom-select" id="provider-select-configure">
                ${PROVIDERS.map(p => `<option value="${p}">${p.toUpperCase()}</option>`).join('')}
              </select>
            </label>
            <div id="cfg-standard-key">
              <label class="field">API Secret Key
                <input type="password" name="api_key" autocomplete="new-password" placeholder="API key or token" minlength="16" maxlength="4096">
                <small>Encrypted at rest with AES-256-GCM.</small>
              </label>
            </div>
            <div class="settingsgrid">
              <label class="field">Mailgun Verified Domain (Mailgun only)
                <input name="mailgun_domain" placeholder="mg.yourdomain.com" maxlength="255">
              </label>
            </div>
            <div class="settingsgrid">
              <label class="field">SMTP Host (SMTP only)
                <input name="smtp_host" placeholder="smtp.gmail.com" maxlength="255">
              </label>
              <label class="field">SMTP Port (SMTP only)
                <select name="smtp_port" class="custom-select">
                  <option value="465">465 · Implicit TLS</option>
                  <option value="587">587 · STARTTLS</option>
                </select>
              </label>
              <label class="field">SMTP Username (SMTP only)
                <input name="smtp_user" placeholder="user@domain.com" maxlength="255">
              </label>
              <label class="field">SMTP Password (SMTP only)
                <input type="password" name="smtp_pass" placeholder="Password" autocomplete="new-password" maxlength="4096">
              </label>
            </div>
            <label class="checkbox" style="margin:12px 0 16px">
              <input type="checkbox" name="add_to_routing" value="true" checked>
              <span>Add to active fallback routing order automatically</span>
            </label>
            <button class="button">${icon('check')} Save & Activate Provider</button>
          </form>
        </div>
      </section>

      <section class="panel">
        <div class="panelhead">
          <div>
            <h2>Circuit Breakers & Health Rules</h2>
            <p>Built-in fault tolerance and resilience controls.</p>
          </div>
        </div>
        <div class="panelbody">
          <ol class="list">
            <li class="step">
              <span class="stepnum">1</span>
              <div>
                <h3>Sequential Priority Routing</h3>
                <p>Every message is dispatched to the #1 Primary provider first. If the provider returns a rate limit, network timeout, or connection error, the next provider in the chain is dispatched instantaneously.</p>
              </div>
            </li>
            <li class="step">
              <span class="stepnum">2</span>
              <div>
                <h3>Five-Failure Circuit Breaker</h3>
                <p>After five consecutive failures, a provider enters automatic cooldown for 5 minutes, preventing blocked queues and unneeded API calls.</p>
              </div>
            </li>
            <li class="step">
              <span class="stepnum">3</span>
              <div>
                <h3>Instant Manual Reset</h3>
                <p>Superadmins can reset any provider's failure counter immediately with the "Reset breaker" button.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </div>
  `;
}

export function apiClients(clients, sess, createdKey = '') {
  const keyNotice = createdKey ? `<div class="notice">New API key (shown once): <code>${e(createdKey)}</code>. Store it securely; it will not be displayed again.</div>` : '';
  return `${keyNotice}<section class="panel"><div class="panelhead"><h2>API clients</h2><p>Issue separate bearer tokens for each application. Keys are stored only as hashes.</p></div><div class="tablewrap"><table><thead><tr><th>Name</th><th>Sender</th><th>Status</th><th>Created</th><th>Last used</th><th>Action</th></tr></thead><tbody>${clients.map(c => `<tr><td>${e(c.name)}</td><td>${e(c.sender_address || 'Any active identity')}</td><td>${badge(c.is_active ? 'Active' : 'Revoked')}</td><td>${e(new Date(c.created_at * 1000).toISOString().slice(0, 16).replace('T', ' '))}</td><td>${c.last_used_at ? e(new Date(c.last_used_at * 1000).toISOString().slice(0, 16).replace('T', ' ')) : 'Never'}</td><td>${c.is_active ? `<form method="post" action="/admin/api-clients/revoke">${hidden(sess.csrf_token)}<input type="hidden" name="id" value="${e(c.id)}"><button class="button secondary small">Revoke</button></form>` : ''}</td></tr>`).join('') || `<tr><td colspan="6">No API clients yet.</td></tr>`}</tbody></table></div></section><section class="panel"><div class="panelhead"><h2>Create API client</h2></div><div class="panelbody"><form method="post" action="/admin/api-clients/create">${hidden(sess.csrf_token)}<div class="settingsgrid"><label class="field">Client name<input name="name" required maxlength="80" placeholder="App backend"></label><label class="field">Restricted sender (optional)<input type="email" name="sender_address" maxlength="254" autocomplete="off" spellcheck="false" placeholder="your-sender@your-verified-domain.com"></label></div><button class="button">Create client key</button></form><p class="footnote">Leave sender blank to allow any active sender identity. A restricted client can only send from its assigned sender.</p></div></section>`;
}

export function users(rows, sess, isSuperadmin = false) {
  const addForm = isSuperadmin ? `<section class="panel"><div class="panelhead"><h2>Add administrator</h2></div><div class="panelbody"><form method="post" action="/admin/users/add">${hidden(sess.csrf_token)}<div class="settingsgrid"><label class="field">Access subject (email)<input type="email" name="subject" required maxlength="254" autocomplete="off" spellcheck="false" placeholder="you@example.com"></label><label class="field">Role<select name="role" class="custom-select"><option value="admin">Admin</option></select></label></div><button class="button">Add user</button></form><p class="footnote">Admins receive a fully isolated workspace of their own. They never gain superadmin powers.</p></div></section>` : '';
  return `<section class="panel"><div class="panelhead"><h2>Administrator accounts</h2><p>Cloudflare Access identities authorized to use this console.</p></div><div class="tablewrap"><table><thead><tr><th>Subject</th><th>Role</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>${rows.map(r => `<tr><td>${e(r.subject)}</td><td>${e(r.role)}</td><td>${badge(r.is_active ? 'Active' : 'Revoked')}</td><td>${e(new Date(r.created_at * 1000).toISOString().slice(0, 16).replace('T', ' '))}</td><td>${isSuperadmin && r.role !== 'superadmin' && r.subject !== sess.subject ? `<details><summary>Edit</summary><form method="post" action="/admin/users/update">${hidden(sess.csrf_token)}<input type="hidden" name="old_subject" value="${e(r.subject)}"><label class="field">Subject<input name="new_subject" value="${e(r.subject)}" required maxlength="254"></label><label class="field">Role<select name="role" class="custom-select"><option value="admin" ${r.role === 'admin' ? 'selected' : ''}>Admin</option></select></label><button class="button secondary small">Save</button></form></details><form method="post" action="/admin/users/revoke">${hidden(sess.csrf_token)}<input type="hidden" name="subject" value="${e(r.subject)}"><button class="button secondary small">Revoke</button></form>` : ''}</td></tr>`).join('') || '<tr><td colspan="5">No users.</td></tr>'}</tbody></table></div></section>${addForm}`;
}

export function otpRequest(error = '', isDark = false) {
  return document('Sign in', `<div class="login"><div class="loginart"><a class="brand" href="/"><span class="brandmark">${icon('mail')}</span><div class="brand-text"><span class="brand-title">neo<span>Mail</span></span><span class="brand-sub">Mail Infrastructure</span></div></a><div><div class="orb"><div></div><div></div><div></div></div><h1>Transactional mail.<br>A clearer view.</h1><p>Send, inspect, and manage your transactional email from one private, hardened workspace.</p></div><small>Private mail infrastructure · neoMail</small></div><div class="loginform"><div class="logininner"><span class="tag good">${icon('security')} Private workspace</span><h1>Welcome to neoMail</h1><!-- Welcome to NeoMail --><p class="sub">Request a one-time code sent to your administrator email.</p>${error ? `<div class="notice error" role="alert">${e(error)}</div>` : ''}<form method="post" action="/login"><input type="hidden" name="step" value="request"><label class="field">Administrator email<input type="email" name="email" required maxlength="254" autocomplete="username" placeholder="you@example.com"></label><button class="button">Send login code ${icon('arrow')}</button></form></div></div></div>`, '', isDark);
}

export function otpVerify(email, error = '', isDark = false) {
  return document('Sign in', `<div class="login"><div class="loginart"><a class="brand" href="/"><span class="brandmark">${icon('mail')}</span><div class="brand-text"><span class="brand-title">neo<span>Mail</span></span><span class="brand-sub">Mail Infrastructure</span></div></a><div><div class="orb"><div></div><div></div><div></div></div><h1>Transactional mail.<br>A clearer view.</h1><p>Send, inspect, and manage your transactional email from one private, hardened workspace.</p></div><small>Private mail infrastructure · neoMail</small></div><div class="loginform"><div class="logininner"><span class="tag good">${icon('security')} Private workspace</span><h1>Enter your code</h1><p class="sub">A one-time code was sent to ${e(email)}.</p>${error ? `<div class="notice error" role="alert">${e(error)}</div>` : ''}<form method="post" action="/login"><input type="hidden" name="step" value="verify"><input type="hidden" name="email" value="${e(email)}"><label class="field">One-time code<input name="code" required pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" placeholder="123456"></label><button class="button">Sign in ${icon('arrow')}</button></form><p class="footnote"><a href="/login">Use a different email</a></p></div></div></div>`, '', isDark);
}

export function domains(rows, sess) {
  const base = sess?.role === 'superadmin' ? '/admin' : '/dashboard';
  const isSuper = sess?.role === 'superadmin';
  const currentSubject = sess?.access_subject || sess?.subject || 'local-admin';

  const ownRows = isSuper ? rows.filter(r => !r.owner_subject || r.owner_subject === currentSubject || r.owner_subject === 'local-admin') : rows;
  const otherRows = isSuper ? rows.filter(r => r.owner_subject && r.owner_subject !== currentSubject && r.owner_subject !== 'local-admin') : [];

  const copyScript = sess.script_nonce ? `<script nonce="${e(sess.script_nonce)}">const copyIcon=${JSON.stringify(icon('copy'))};const check=${JSON.stringify(icon('check'))};document.addEventListener('click',async ev=>{const b=ev.target.closest('button[data-copy]');if(!b||b.disabled)return;ev.preventDefault();const value=b.getAttribute('data-copy');try{await navigator.clipboard.writeText(value);}catch{const ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}finally{ta.remove();}}b.classList.add('copied');b.innerHTML=check;b.disabled=true;setTimeout(()=>{b.classList.remove('copied');b.innerHTML=copyIcon;b.disabled=false;},1600);});</script>` : '';
  const dnsField = (label, value, title) => `<div class="dnsfield"><span class="dnstype">${label}</span><code title="${e(title)}">${e(value)}</code><button type="button" class="button secondary small iconb" data-copy="${e(value)}" aria-label="Copy ${label}" title="Copy">${icon('copy')}</button></div>`;
  const record = r => r.verification_token ? `${dnsField('Name', '_neomail-verification.' + r.domain, 'TXT record host — paste this into the Host/Name field of your DNS provider')}${dnsField('Value', r.verification_token, 'TXT record content — paste this into the Value/Content field of your DNS provider')}` : '<p class="sub">Verification token missing — remove and re-add the domain.</p>';

  const deleteDomainForm = (d) => `
    <form method="post" action="${base}/domains/delete" onsubmit="return confirm('Permanently delete sending domain ${e(d)}? Outbound sending from this domain will stop.');" style="display:inline">
      ${hidden(sess.csrf_token)}
      <input type="hidden" name="domain" value="${e(d)}">
      <button class="button danger small iconb" type="submit" title="Delete domain" aria-label="Delete domain">${icon('trash')}</button>
    </form>
  `;

  const otherDomainsPanel = otherRows.length > 0 ? `
    <details class="collapsible-domains-panel panel" open style="margin-top:24px;border:1px solid var(--line);border-radius:12px;overflow:hidden">
      <summary style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;cursor:pointer;user-select:none;background:var(--surface)">
        <div style="display:flex;align-items:center;gap:12px">
          <span class="tag" style="background:var(--tint);color:var(--accent);font-weight:600">${otherRows.length} ${otherRows.length === 1 ? 'domain' : 'domains'}</span>
          <div>
            <h2 style="font-size:16px;margin:0;display:flex;align-items:center;gap:8px">Tenant domains · Other admin workspaces</h2>
            <p style="margin:2px 0 0;font-size:12px;color:var(--muted)">Multi-tenant oversight: Domains configured and verified by other administrator workspaces.</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="tag" style="font-size:11px">Show / Hide Details</span>
          <span class="button secondary small" style="pointer-events:none;padding:4px 8px">${icon('chevron')}</span>
        </div>
      </summary>
      <div style="border-top:1px solid var(--line);background:var(--bg);padding:14px 20px">
        <div class="notice" style="margin:0 0 16px;border-left:4px solid var(--accent)">
          <strong>🔒 Zero-Trust Tenant Domain Isolation:</strong> These domains belong to other administrator workspaces.
          Superadmins can monitor DNS health and delete unused domains, but <strong>cannot use other admins' domains to create sender identities or dispatch outbound emails</strong>.
        </div>
        <div class="tablewrap" style="background:var(--surface);border-radius:8px;border:1px solid var(--line)">
          <table>
            <thead>
              <tr>
                <th>Admin Workspace</th>
                <th>Domain</th>
                <th>Status</th>
                <th>Verification TXT Record</th>
                <th style="text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${otherRows.map(r => {
                const ownerName = r.owner_name || r.owner_subject || 'Admin';
                const ownerEmail = r.owner_subject || '';
                const avatar = r.avatar_mime
                  ? `<img src="/admin/profile-image?subject=${encodeURIComponent(r.owner_subject)}" alt="${e(ownerName)}" style="width:34px;height:34px;border-radius:8px;object-fit:cover;border:1px solid var(--line);flex-shrink:0">`
                  : `<span style="width:34px;height:34px;border-radius:8px;background:var(--surface-hover);border:1px solid var(--line);display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:var(--text);flex-shrink:0">${e(initial(ownerName))}</span>`;

                return `
                  <tr>
                    <td>
                      <div style="display:flex;align-items:center;gap:10px">
                        ${avatar}
                        <div style="min-width:0">
                          <strong style="display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e(ownerName)}</strong>
                          <span class="muted" style="font-family:var(--mono);font-size:11px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${e(ownerEmail)}">${e(ownerEmail)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="subject" style="font-weight:600;font-size:13px">${e(r.domain)}</div>
                      <span class="muted" style="font-size:11px">${e(r.display_name || r.domain)}</span>
                    </td>
                    <td>${r.is_verified ? '<span class="tag good">' + icon('check') + ' Active · Verified</span>' : '<span class="tag danger">' + icon('security') + ' Paused · DNS Failed</span>'}</td>
                    <td>${record(r)}</td>
                    <td style="text-align:right">
                      <div style="display:inline-flex;align-items:center;gap:6px">
                        <form method="post" action="${base}/domains/verify" style="display:inline">
                          ${hidden(sess.csrf_token)}
                          <input type="hidden" name="domain" value="${e(r.domain)}">
                          <button class="button secondary small" type="submit" title="Re-check DNS propagation">${r.is_verified ? 'Re-check' : 'Verify'}</button>
                        </form>
                        ${deleteDomainForm(r.domain)}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </details>
  ` : '';

  return `
    <div class="notice">
      Add a <strong>TXT record</strong> at your DNS provider (Cloudflare, GoDaddy, Namecheap…), then click <strong>Verify</strong>.
      Continuous background verification protects your sender reputation: if a domain's DNS fails, outbound sending from that domain is immediately paused and you are alerted.
    </div>
    <div class="notice warn">
      In your DNS panel: choose <code>TXT</code> as the record type, paste <strong>Name</strong> in the host/name box and <strong>Value</strong> in the content box, save, wait a few minutes for propagation, then verify below.
    </div>

    <section class="panel">
      <div class="panelhead" style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <h2>${isSuper ? 'Domains Created by You (Superadmin)' : 'Your Workspace Domains'}</h2>
          <p>Verified domains for sending outbound mail from your workspace. All unverified domains automatically pause outbound email dispatch.</p>
        </div>
        <form method="post" action="${base}/domains/auto-check">
          ${hidden(sess.csrf_token)}
          <button class="button secondary small" type="submit">${icon('refresh')} Auto-Check All DNS</button>
        </form>
      </div>
      <div class="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Status</th>
              <th>Verification TXT record</th>
              <th style="text-align:right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${ownRows.map(r => `
              <tr>
                <td>
                  <div class="subject" style="font-weight:600">${e(r.domain)}</div>
                  <span class="muted" style="font-size:11px">${e(r.display_name || r.domain)}</span>
                </td>
                <td>${r.is_verified ? '<span class="tag good">' + icon('check') + ' Active · Verified</span>' : '<span class="tag danger">' + icon('security') + ' Paused · DNS Failed</span>'}</td>
                <td>${record(r)}</td>
                <td style="text-align:right">
                  <div style="display:inline-flex;align-items:center;gap:6px">
                    <form method="post" action="${base}/domains/verify" style="display:inline">
                      ${hidden(sess.csrf_token)}
                      <input type="hidden" name="domain" value="${e(r.domain)}">
                      <button class="button secondary small" type="submit">${r.is_verified ? 'Re-check' : 'Verify'}</button>
                    </form>
                    ${deleteDomainForm(r.domain)}
                  </div>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="4">No domains created in your workspace yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>

    ${otherDomainsPanel}

    <section class="panel">
      <div class="panelhead">
        <h2>Add domain</h2>
      </div>
      <div class="panelbody">
        <form method="post" action="${base}/domains/create">
          ${hidden(sess.csrf_token)}
          <div class="settingsgrid">
            <label class="field">Domain
              <input name="domain" required maxlength="253" pattern="[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?" title="Letters, digits, dots and hyphens only (e.g. mail.your-domain.com)" autocomplete="off" spellcheck="false" placeholder="mail.your-domain.com">
            </label>
            <label class="field">Display name
              <input name="display_name" required maxlength="100" placeholder="e.g. yourDomain Mail">
            </label>
          </div>
          <button class="button">Add domain</button>
        </form>
      </div>
    </section>
    ${copyScript}
  `;
}

export function errorPage(message, status) {
  return document('Request could not complete', `<div class="login" style="grid-template-columns:1fr;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px"><div class="panel" style="max-width:540px;width:100%;margin:0"><div class="panelhead" style="background:var(--danger-bg);border-color:var(--danger-line)"><div style="display:flex;align-items:center;gap:10px"><span class="tag danger" style="font-size:12px;padding:4px 8px">${status}</span><h2 style="color:var(--danger)">Request could not complete</h2></div></div><div class="panelbody"><p style="font-size:14px;color:var(--text);margin-bottom:20px">${e(message)}</p><div style="display:flex;gap:12px;flex-wrap:wrap"><a class="button" href="/admin">Return to workspace</a><a class="button secondary" href="/login">Back to Sign In</a></div></div></div></div>`);
}

export function accessLogin() {
  return document('Secure sign-in', `<div class="loginform" style="min-height:100vh"><div class="logininner"><span class="tag good">${icon('security')} Verified by Cloudflare Access</span><h1>Welcome to neoMail</h1><!-- Welcome to NeoMail --><p>Your identity has been verified through your configured email OTP or passkey sign-in provider.</p><form method="post" action="/login"><button class="button">Continue to workspace</button></form><p class="footnote">Sign-in options and approved administrator emails are managed in Cloudflare Access.</p></div></div>`);
}

function profileAvatar(profile) {
  const name = profile?.display_name || 'Administrator';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(part => part[0] || '').join('').toUpperCase() || 'A';
  const v = profile?.updated_at || Date.now();
  return `<span class="avatar">${profile?.avatar_mime ? `<img src="/admin/profile-image?v=${e(v)}" alt="${e(name)} profile image" onerror="this.style.display='none';this.parentElement.textContent='${e(initials)}'">` : e(initials)}</span>`;
}

function profileSquircle(profile) {
  const name = profile?.display_name || 'Administrator';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(part => part[0] || '').join('').toUpperCase() || 'A';
  const v = profile?.updated_at || Date.now();
  return `<div class="avatar-squircle" id="avatar-squircle-preview" title="Click to change photo" role="button" tabindex="0">${profile?.avatar_mime ? `<img src="/admin/profile-image?v=${e(v)}" alt="${e(name)} profile image" onerror="this.style.display='none';this.parentElement.textContent='${e(initials)}'">` : e(initials)}</div>`;
}

function profileSettings(sess) {
  const hasAvatar = !!sess.profile?.avatar_mime;
  return `<section class="panel" id="profile">
    <div class="panelhead">
      <div>
        <h2>Your profile</h2>
        <p>Edit your name and upload a photo or company logo for your neoMail profile.</p>
      </div>
    </div>
    <div class="panelbody">
      <form method="post" action="/admin/profile" enctype="multipart/form-data">
        ${hidden(sess.csrf_token)}
        <div class="profile-photo-section">
          <label class="profile-photo-title">Profile photo</label>
          <div class="profile-photo-card">
            <div class="avatar-wrapper">
              ${profileSquircle(sess.profile)}
              <button type="button" class="avatar-camera-btn" id="btn-camera-trigger" title="Change photo" aria-label="Change photo">
                ${icon('camera')}
              </button>
            </div>
            <div class="profile-photo-actions">
              <div class="profile-photo-buttons">
                <button type="button" class="button secondary" id="btn-upload-avatar">
                  ${icon('image')} Change photo
                </button>
                <button type="button" class="button secondary textbutton text-danger" id="btn-remove-avatar" style="${hasAvatar ? '' : 'display:none;'}">
                  ${icon('trash')} Remove
                </button>
              </div>
              <span class="profile-photo-hint">JPG, PNG, or WebP · Up to 3 MB</span>
              <span id="profile-upload-status" class="footnote" role="status" aria-live="polite"></span>
            </div>
          </div>
          <input type="file" id="profile-avatar-input" name="avatar" accept="image/png,image/jpeg,image/webp" style="display:none">
          <input type="checkbox" id="profile-remove-checkbox" name="remove_avatar" value="yes" style="display:none">
        </div>
        <div class="settingsgrid">
          <label class="field">Administrator email<input type="email" value="${e(sess.access_subject || '')}" readonly disabled aria-readonly="true"></label>
          <label class="field">Profile name<input name="display_name" value="${e(sess.profile?.display_name || 'Administrator')}" required maxlength="80" autocomplete="name"></label>
        </div>
        <noscript><p>Automatic compression requires JavaScript. Upload an already optimized PNG, JPEG or WebP under 128 KiB.</p></noscript>
        <button class="button" type="submit">Save profile</button>
      </form>
    </div>
  </section>${sess.script_nonce ? `<script nonce="${e(sess.script_nonce)}">${PROFILE_SCRIPT}</script>` : ''}`;
}

function bimiSettings(cfg) {
  const ready = !!cfg.BIMI_LOGO_URL && !!cfg.BIMI_CERTIFICATE_URL;
  const record = ready ? `v=BIMI1; l=${cfg.BIMI_LOGO_URL}; a=${cfg.BIMI_CERTIFICATE_URL};` : '';
  return `<section class="panel"><div class="panelhead"><div><h2>Inbox sender logo · BIMI</h2><p>For your-sender@your-verified-domain.com and other senders on the same domain.</p></div>${badge(ready ? 'URLs configured · Unverified' : 'Setup required')}</div><div class="panelbody"><p>Add your public SVG Tiny-PS logo URL and certificate URL in Workspace settings below. These URLs are public, not secret.</p><dl><dt>DNS type</dt><dd>TXT</dd><dt>Cloudflare DNS name</dt><dd><code>default._bimi.mail</code></dd><dt>Full DNS hostname</dt><dd><code>default._bimi.your-worker-domain.com</code></dd></dl>${record ? `<label class="field">DNS record value<textarea readonly rows="3">${e(record)}</textarea></label>` : '<div class="notice warn">No publishable record yet. Supply a real logo URL and a CA-issued VMC/CMC certificate URL first.</div>'}<p class="sub">Requires passing domain authentication and enforced DMARC. Gmail requires a VMC or CMC. A configured URL does not verify the certificate, DNS, logo compliance, or guarantee inbox display. Your private profile upload is not the public BIMI logo.</p></div></section>`;
}
