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
  Quote,
  AlertCircle,
  Info,
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
  Quote,
  AlertCircle,
  Info,
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
  quote: 'Quote',
  alert: 'AlertCircle',
  alertCircle: 'AlertCircle',
  info: 'Info',
};

function initial(name) {
  if (!name || typeof name !== 'string') return 'S';
  const trimmed = name.trim();
  return trimmed ? Array.from(trimmed)[0].toUpperCase() : 'S';
}

export function providerLogo(p) {
  const norm = String(p || '').toLowerCase();
  if (norm === 'smtp') {
    return icon('mail');
  }
  if (norm === 'resend') {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M14.679 0c4.648 0 7.413 2.765 7.413 6.434s-2.765 6.434-7.413 6.434H12.33L24 24h-8.245l-8.88-8.44c-.636-.588-.93-1.273-.93-1.86c0-.831.587-1.565 1.713-1.883l4.574-1.224c1.737-.465 2.936-1.81 2.936-3.572c0-2.153-1.761-3.4-3.939-3.4H0V0z"/></svg>`;
  }
  if (norm === 'brevo') {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm0 4.138a7.862 7.862 0 0 1 7.862 7.862A7.862 7.862 0 0 1 12 19.862a7.862 7.862 0 0 1-7.862-7.862A7.862 7.862 0 0 1 12 4.138zm0 3.724a4.138 4.138 0 0 0-4.138 4.138A4.138 4.138 0 0 0 12 16.138a4.138 4.138 0 0 0 4.138-4.138A4.138 4.138 0 0 0 12 7.862z"/></svg>`;
  }
  if (norm === 'mailgun') {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.179 8.019l-4.156 5.867-2.61-3.682-4.155 5.867h13.844z"/></svg>`;
  }
  if (norm === 'mailtrap') {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="m5.371 17.607-2.036 1.208a.32.32 0 0 0 0 .557l7.91 4.432a1.55 1.55 0 0 0 1.51 0l8.014-4.491c.243-.144.203-.436 0-.535l-2.153-1.163c-.182-.12-.587-.08-.73.017l-5.131 2.875a1.55 1.55 0 0 1-1.51 0l-5.176-2.9c-.145-.094-.548-.135-.73-.016zm13.258-6.195-5.132-2.875a1.55 1.55 0 0 0-1.51 0l-5.176 2.9c-.182.119-.587.078-.73-.016L3.335 13.16a.32.32 0 0 1 0-.557l7.91-4.432a1.55 1.55 0 0 1 1.51 0l8.014 4.491c.243.144.203.436 0 .535l-2.153 1.163c-.182.12-.587.08-.73-.016zM12 .988a1.55 1.55 0 0 0-1.51 0L2.476 5.48c-.243.144-.203.436 0 .535l2.153 1.163c.182.12.587.08.73-.017l5.131-2.875a1.55 1.55 0 0 1 1.51 0l5.176 2.9c.145.094.548.135.73.016l2.153-1.163c.243-.1-.203-.391 0-.535L13.51 .988a1.55 1.55 0 0 0-1.51 0z"/></svg>`;
  }
  if (norm === 'mailersend') {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>`;
  }
  return e(norm ? norm[0].toUpperCase() : 'M');
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
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="32" height="32" fill="none"><defs><linearGradient id="nm-top-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0eb958"/><stop offset="35%" stop-color="#087d54"/><stop offset="100%" stop-color="#055239"/></linearGradient><linearGradient id="nm-bot-left-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0eb958"/><stop offset="50%" stop-color="#087d54"/><stop offset="100%" stop-color="#055239"/></linearGradient><linearGradient id="nm-bot-right-grad" x1="0%" y1="40%" x2="100%" y2="70%"><stop offset="0%" stop-color="#033b28"/><stop offset="18%" stop-color="#055f42"/><stop offset="65%" stop-color="#087d54"/><stop offset="100%" stop-color="#0ea868"/></linearGradient><clipPath id="nm-envelope-clip"><rect x="0" y="0" width="450" height="290" rx="45" ry="45"/></clipPath></defs><rect x="16" y="16" width="480" height="480" rx="120" fill="#ffffff" stroke="#cbd5e1" stroke-width="8"/><g transform="translate(76, 150) scale(0.80)"><g clip-path="url(#nm-envelope-clip)"><rect x="0" y="0" width="450" height="290" fill="#ffffff"/><path d="M 45 0 L 405 0 C 429.9 0 448.9 19 449.2 35 C 375 65 295 115 225 145 C 157 116 82 61 12 36 C 18 20 29 9 45 0 Z" fill="url(#nm-top-grad)"/><path d="M 0 45 C 0 20.1 20.1 0 45 0 C 29 9 18 20 12 36 C 82 96 162 156 228 209 C 200 205 180 201 165 199 C 125 214 85 264 45 290 C 20.1 290 0 270 0 245 Z" fill="url(#nm-bot-left-grad)"/><path d="M 228 209 C 298 178 378 88 450 62 L 450 245 C 450 270 429.9 290 405 290 L 300 290 C 255 274 210 209 165 199 C 180 201 200 205 228 209 Z" fill="url(#nm-bot-right-grad)"/><path d="M 12 36 C 82 61 157 116 225 145 C 295 115 375 65 449.2 35 C 449.8 40 450 45 450 48 L 450 62 C 378 88 298 178 228 209 C 162 156 82 96 12 36 Z" fill="#ffffff"/></g></g></svg>`;
export { faviconSvg };
export const faviconUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

export const neomailerLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 290" width="32" height="21" fill="none" aria-hidden="true" style="display:block"><defs><linearGradient id="nml-top-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0eb958"/><stop offset="35%" stop-color="#087d54"/><stop offset="100%" stop-color="#055239"/></linearGradient><linearGradient id="nml-bot-left-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0eb958"/><stop offset="50%" stop-color="#087d54"/><stop offset="100%" stop-color="#055239"/></linearGradient><linearGradient id="nml-bot-right-grad" x1="0%" y1="40%" x2="100%" y2="70%"><stop offset="0%" stop-color="#033b28"/><stop offset="18%" stop-color="#055f42"/><stop offset="65%" stop-color="#087d54"/><stop offset="100%" stop-color="#0ea868"/></linearGradient><clipPath id="nml-envelope-clip"><rect x="0" y="0" width="450" height="290" rx="45" ry="45"/></clipPath></defs><g clip-path="url(#nml-envelope-clip)"><rect x="0" y="0" width="450" height="290" fill="#ffffff"/><path d="M 45 0 L 405 0 C 429.9 0 448.9 19 449.2 35 C 375 65 295 115 225 145 C 157 116 82 61 12 36 C 18 20 29 9 45 0 Z" fill="url(#nml-top-grad)"/><path d="M 0 45 C 0 20.1 20.1 0 45 0 C 29 9 18 20 12 36 C 82 96 162 156 228 209 C 200 205 180 201 165 199 C 125 214 85 264 45 290 C 20.1 290 0 270 0 245 Z" fill="url(#nml-bot-left-grad)"/><path d="M 228 209 C 298 178 378 88 450 62 L 450 245 C 450 270 429.9 290 405 290 L 300 290 C 255 274 210 209 165 199 C 180 201 200 205 228 209 Z" fill="url(#nml-bot-right-grad)"/><path d="M 12 36 C 82 61 157 116 225 145 C 295 115 375 65 449.2 35 C 449.8 40 450 45 450 48 L 450 62 C 378 88 298 178 228 209 C 162 156 82 96 12 36 Z" fill="#ffffff"/></g></svg>`;
export const neomailLogoSvg = neomailerLogoSvg;

export const neomailBrandBadge = `
  <div class="login-brand-header">
    <a class="brand" href="/" style="justify-content:center;text-decoration:none">
      <span class="brandmark">${neomailLogoSvg}</span>
      <div class="brand-text" style="text-align:left">
        <span class="brand-title">neo<span>Mailer</span></span>
        <span class="brand-sub">Mail Infrastructure</span>
      </div>
    </a>
  </div>
`;

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
  --illus-chair: #1e3a32;
  --illus-chair-shadow: #142822;
  --illus-chair-highlight: #2a5247;
  --illus-mascot: #8ba59e;
  --illus-mascot-dark: #6e8a83;
  --illus-arms: #182620;
  --illus-glasses: #142822;
  --illus-plant-dark: #064e3b;
  --illus-plant-light: #10b981;
  --illus-pot: #e5e7eb;
  --illus-wood: #c25e00;
  --illus-wood-dark: #8c4200;
  --illus-table: #d97706;
  --illus-blob: rgba(8, 125, 84, 0.09);
  --illus-clock-rim: #374151;
  --illus-server: #131514;
  --illus-frame-border: #131514;
  --illus-chair-legs: #131514;
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

/* neoMailer Dark Mode */
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
  --illus-chair: #162f28;
  --illus-chair-shadow: #0d1e19;
  --illus-chair-highlight: #23483e;
  --illus-mascot: #7c9891;
  --illus-mascot-dark: #5e7972;
  --illus-arms: #0d1b15;
  --illus-glasses: #0a1612;
  --illus-plant-dark: #065f46;
  --illus-plant-light: #34d399;
  --illus-pot: #374151;
  --illus-wood: #b45309;
  --illus-wood-dark: #78350f;
  --illus-table: #b45309;
  --illus-blob: rgba(16, 185, 129, 0.09);
  --illus-clock-rim: #9ca3af;
  --illus-server: #131514;
  --illus-frame-border: #cbd5e1;
  --illus-chair-legs: #131514;
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
    --illus-chair: #162f28;
    --illus-chair-shadow: #0d1e19;
    --illus-chair-highlight: #23483e;
    --illus-mascot: #7c9891;
    --illus-mascot-dark: #5e7972;
    --illus-arms: #0d1b15;
    --illus-glasses: #0a1612;
    --illus-plant-dark: #065f46;
    --illus-plant-light: #34d399;
    --illus-pot: #374151;
    --illus-wood: #b45309;
    --illus-wood-dark: #78350f;
    --illus-table: #b45309;
    --illus-blob: rgba(16, 185, 129, 0.09);
    --illus-clock-rim: #9ca3af;
    --illus-server: #131514;
    --illus-frame-border: #cbd5e1;
    --illus-chair-legs: #131514;
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
button, a { outline-offset: 3px; }
button { cursor: pointer; }
button:focus-visible, a:focus-visible { outline: 2px solid var(--accent); }
input:focus-visible, select:focus-visible, textarea:focus-visible { outline: none; }
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
  outline: none;
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
select.custom-select::picker(select),
select:open::picker(select),
select.custom-select:open::picker(select) {
  position-area: block-end span-all !important;
  position-area: bottom span-all !important;
  inset-block-start: anchor(bottom) !important;
  inset-block-end: auto !important;
  top: anchor(bottom) !important;
  bottom: auto !important;
  left: anchor(left) !important;
  right: auto !important;
  min-width: anchor-size(width);
  margin-block-start: 6px !important;
  margin-block-end: 0 !important;
  margin-top: 6px !important;
  margin-bottom: 0 !important;
  position-try-fallbacks: none !important;
  position-try: none !important;
  position-try-order: normal !important;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-md);
  padding: 6px;
  z-index: 9999;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.brandmark svg {
  width: 44px;
  height: 30px;
  max-width: 44px;
  max-height: 32px;
  display: block;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-title {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--text);
}

.brand-title span {
  color: var(--accent);
}

.brand-sub {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 2px;
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

.side-docs-box {
  margin-top: auto;
  padding: 12px 14px 10px;
}

.side-docs-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-md);
  color: var(--accent);
  background: var(--tint);
  border: 1px solid var(--tint-strong);
  text-decoration: none;
  transition: all 0.15s ease;
  margin-bottom: 0;
  width: 100%;
  box-sizing: border-box;
}

.side-docs-link:hover {
  background: var(--surface-hover);
  border-color: var(--accent);
  color: var(--accent);
}

.sidefoot {
  height: 38px;
  min-height: 38px;
  max-height: 38px;
  box-sizing: border-box;
  padding: 0 14px;
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidefoot-credit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: var(--muted);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.1px;
  text-align: center;
  margin: 0;
  width: 100%;
}

.sidefoot-credit strong {
  color: var(--text);
  font-weight: 600;
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
  height: 28px;
  box-sizing: border-box;
  padding: 0 10px;
  font-size: 11.5px;
  border-radius: var(--radius-xs);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  vertical-align: middle;
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
  outline: none;
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

.notice:has(svg) {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.notice svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
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
  flex-shrink: 0;
}

.providerlogo svg {
  width: 18px;
  height: 18px;
  display: block;
}

.info-help-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: var(--muted);
  cursor: help;
  position: relative;
  transition: all 0.15s ease;
  vertical-align: middle;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
}

.info-help-btn:hover,
.info-help-btn:focus-visible {
  color: var(--accent);
  background: var(--tint);
  outline: none;
}

.info-help-btn svg {
  width: 15px;
  height: 15px;
  display: block;
}

.info-help-btn .info-tooltip-box {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 280px;
  padding: 10px 12px;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1.45;
  z-index: 100;
  box-shadow: none !important;
  text-align: left;
  pointer-events: none;
}

.info-help-btn:hover .info-tooltip-box,
.info-help-btn:focus-visible .info-tooltip-box {
  display: block;
  animation: dropMenuIn 0.15s ease;
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

table details {
  border-top: none !important;
  padding: 0 !important;
}

table details > summary {
  list-style: none;
}

table details > summary::-webkit-details-marker {
  display: none;
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
  border: 1px solid var(--line) !important;
  border-radius: 12px !important;
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

/* Authentication Layout - Centered NeoMailer Design */
.login {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  position: relative;
  padding: 40px 16px;
  box-sizing: border-box;
}

.loginart {
  display: none;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md, 12px);
  padding: 40px 36px 32px;
  box-sizing: border-box;
  margin: 0 auto;
}

.loginform {
  padding: 40px 36px 32px;
  background: var(--surface);
}

.logininner {
  width: 100%;
  max-width: 100%;
}

.login-brand-header {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.login-brand-header .brandmark {
  width: 44px;
  height: 44px;
}

.login-brand-header .brandmark svg {
  width: 44px;
  height: 30px;
  max-width: 44px;
  max-height: 32px;
}

.login-brand-header .brand-title {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.login-brand-header .brand-sub {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  margin-top: 2px;
}

.login-card-title {
  font-size: 22px;
  font-weight: 750;
  color: var(--text);
  text-align: center;
  margin: 0 0 6px 0;
  letter-spacing: -0.4px;
}

.login-card-sub {
  font-size: 13.5px;
  color: var(--muted);
  text-align: center;
  margin: 0 0 22px 0;
  line-height: 1.5;
}

.login-field-group {
  margin-bottom: 16px;
}

.login-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.login-label {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 6px;
}

.login-label-row .login-label {
  margin-bottom: 0;
}

.login-input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm, 8px);
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
  background: var(--surface);
  box-sizing: border-box;
  transition: border-color 0.15s ease, background 0.15s ease;
  outline: none;
}

.login-input:focus {
  border-color: var(--accent);
}

.login-input::placeholder {
  color: var(--muted);
  opacity: 0.65;
}

.login-submit-btn {
  width: 100%;
  height: 42px;
  background: var(--accent);
  color: var(--accent-fg);
  border: none;
  border-radius: var(--radius-sm, 8px);
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.login-submit-btn:hover {
  background: var(--accent-hover);
}

.login-submit-btn:active {
  background: var(--accent-active);
}

.logininner .button {
  width: 100%;
  padding: 11px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;
  justify-content: center;
}

.login-alt-actions {
  margin-top: 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-footer-area {
  margin-top: 24px;
  text-align: center;
  border-top: 1px solid var(--line);
  padding-top: 16px;
}

.login-footer-area .footnote {
  color: var(--muted);
  font-size: 11.5px;
  margin-top: 0;
}

/* Validation & notice */
input[aria-invalid="true"],
input[aria-invalid="true"]:focus,
input[aria-invalid="true"]:focus-visible {
  border-color: var(--danger) !important;
  outline: none !important;
  box-shadow: none !important;
}

.logininner .notice {
  margin-top: 8px;
  margin-bottom: 16px;
}

.footnote {
  font-size: 11px;
  color: var(--muted);
  margin-top: 20px;
}

.notice a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 600;
}

.notice a:hover {
  opacity: 0.8;
}

.textbutton-link {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  text-decoration: none;
  font-weight: 600;
  transition: text-decoration 0.12s ease;
}

.textbutton-link:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

dialog.login-modal,
dialog.admin-modal {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 0;
  background: var(--surface);
  color: var(--text);
  max-width: 440px;
  width: 90vw;
  box-shadow: none !important;
  margin: auto;
}

dialog.login-modal[open],
dialog.admin-modal[open] {
  animation: dropMenuIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

dialog.login-modal::backdrop,
dialog.admin-modal::backdrop {
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
}

.modal-card {
  display: flex;
  flex-direction: column;
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
  background: var(--surface-hover);
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 22px;
  line-height: 1;
  color: var(--muted);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-xs);
  transition: color 0.12s ease;
}

.modal-close-btn:hover {
  color: var(--text);
}

.modal-body {
  padding: 18px;
}

.modal-body textarea {
  resize: vertical;
  min-height: 60px;
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

.button.small.iconb,
.iconb {
  width: 28px;
  height: 28px;
  min-width: 28px;
  padding: 0 !important;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xs);
  vertical-align: middle;
}

.iconb svg {
  width: 14px;
  height: 14px;
  display: block;
}

.button.copied,
.iconb.copied {
  background: var(--tint) !important;
  border-color: var(--accent) !important;
  color: var(--accent) !important;
}

.button.copied svg,
.iconb.copied svg {
  stroke: var(--accent) !important;
  color: var(--accent) !important;
  stroke-width: 2.5 !important;
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

.user-actions-row {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.user-edit-popover {
  position: relative;
  display: inline-block;
  border: none !important;
  padding: 0 !important;
}

.user-edit-popover > summary {
  list-style: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  user-select: none;
}

.user-edit-popover > summary::-webkit-details-marker {
  display: none;
}

.user-edit-popover .popover-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: auto;
  min-width: 280px;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  z-index: 100;
  text-align: left;
  box-shadow: none !important;
  animation: dropMenuIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.user-edit-popover .popover-dropdown form {
  margin-top: 0 !important;
}

.user-edit-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-edit-title svg {
  width: 14px;
  height: 14px;
  color: var(--accent);
}

.users-tablewrap {
  overflow-x: auto;
  min-height: 200px;
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
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 80px;
}
.profile-photo-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.profile-photo-hint {
  font-size: 13px;
  color: var(--muted);
  text-align: center;
}
.profile-photo-actions .footnote,
#profile-upload-status {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
  text-align: center;
}
#profile-upload-status:empty {
  display: none;
  margin: 0;
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

.docs-studio-header-bar {
  height: 50px !important;
  min-height: 50px !important;
  max-height: 50px !important;
  box-sizing: border-box !important;
  border-bottom: 1px solid var(--line) !important;
  display: flex !important;
  align-items: center !important;
  background: var(--surface) !important;
  margin: 0 !important;
}

.rich-editor-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  background: var(--surface-hover);
  border-bottom: 1px solid var(--line);
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  box-sizing: border-box;
}

.rich-editor-toolbar::-webkit-scrollbar {
  display: none;
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

/* Studio Header Action Buttons with Elevated Height & Polish */
.studio-action-btn {
  height: 38px !important;
  min-height: 38px !important;
  max-height: 38px !important;
  padding: 0 16px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  line-height: 1 !important;
  border-radius: 8px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  box-sizing: border-box !important;
  cursor: pointer !important;
  text-decoration: none !important;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1) !important;
  box-shadow: none !important;
}

.studio-action-btn.secondary {
  background: var(--surface) !important;
  color: var(--text) !important;
  border: 1px solid var(--line) !important;
}

.studio-action-btn.secondary:hover {
  background: var(--surface-hover) !important;
  border-color: var(--line-strong) !important;
  color: var(--text) !important;
  transform: translateY(-1px) !important;
}

.studio-action-btn:hover {
  transform: translateY(-1px) !important;
}

.studio-action-btn:active {
  transform: translateY(0) !important;
}

.studio-preview-segmented {
  display: inline-flex;
  align-items: center;
  height: 38px;
  min-height: 38px;
  max-height: 38px;
  background: var(--surface-hover);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 3px;
  box-sizing: border-box;
  gap: 2px;
}

.studio-seg-btn {
  height: 30px;
  min-height: 30px;
  max-height: 30px;
  padding: 0 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
  user-select: none;
  line-height: 1;
  box-sizing: border-box;
}

.studio-seg-btn svg {
  width: 13px;
  height: 13px;
}

.studio-seg-btn:hover {
  color: var(--text);
  background: rgba(0, 0, 0, 0.05);
}

:root[data-theme="dark"] .studio-seg-btn:hover,
:root.dark .studio-seg-btn:hover {
  background: rgba(255, 255, 255, 0.06);
}

.studio-seg-btn.active {
  background: var(--surface) !important;
  color: var(--accent) !important;
  border: 1px solid var(--line) !important;
  font-weight: 700 !important;
  box-shadow: none !important;
}

.studio-popover-menu {
  display: none;
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 6px;
  min-width: 210px;
  z-index: 1000;
  box-shadow: none !important;
}

.studio-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--text);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s ease, color 0.12s ease;
  box-sizing: border-box;
}

.studio-menu-item:hover {
  background: var(--surface-hover);
  color: var(--accent);
}

.studio-menu-item svg {
  width: 14px;
  height: 14px;
}

.editor-workspace {
  display: grid;
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  position: relative;
  height: 100%;
}

.editor-workspace.split-view {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
}

.editor-workspace.split-view #docs-editor-textarea {
  border-right: 1px solid var(--line);
}

.editor-workspace.split-view .editor-preview {
  display: flex !important;
  position: relative !important;
  width: auto !important;
  height: 100% !important;
  flex-direction: column !important;
  padding: 0 !important;
  z-index: 1 !important;
  max-height: none !important;
}

.editor-workspace.preview-mode {
  grid-template-columns: 1fr !important;
}

.editor-workspace.preview-mode #docs-editor-textarea {
  display: none !important;
}

.editor-workspace.preview-mode .editor-preview {
  display: flex !important;
  position: relative !important;
  width: 100% !important;
  height: 100% !important;
  flex-direction: column !important;
  padding: 0 !important;
  z-index: 1 !important;
  max-height: none !important;
}

.editor-workspace.edit-mode .editor-preview {
  display: none !important;
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
  resize: none;
  outline: none;
  box-shadow: none;
  border-radius: 0;
  margin: 0;
  box-sizing: border-box;
}

.editor-textarea:focus {
  box-shadow: none;
  outline: none;
}

.editor-preview {
  display: none;
  padding: 0;
  background: var(--bg);
  border-left: 1px solid var(--line);
  overflow-y: auto;
  line-height: 1.6;
  font-size: 13px;
  box-sizing: border-box;
}

.editor-workspace.split-view .editor-preview {
  display: flex;
}

.blob-preview-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  background: var(--surface-hover);
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.blob-preview-bar code {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--accent);
  background: var(--surface);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--line);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 340px;
}

.docs-preview-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}

/* Callouts & Alert Cards */
.docs-callout {
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 8px;
  border-left: 4px solid;
  font-size: 13px;
}
.docs-callout.callout-note {
  background: rgba(16, 185, 129, 0.08);
  border-color: #10b981;
  color: var(--text);
}
.docs-callout.callout-tip {
  background: rgba(59, 130, 246, 0.08);
  border-color: #3b82f6;
  color: var(--text);
}
.docs-callout.callout-warning {
  background: rgba(245, 158, 11, 0.08);
  border-color: #f59e0b;
  color: var(--text);
}
.docs-callout.callout-important {
  background: rgba(239, 68, 68, 0.08);
  border-color: #ef4444;
  color: var(--text);
}
.callout-header {
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Code Cards */
.docs-code-card {
  margin: 16px 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  background: #0f1412;
}
.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #151c19;
  border-bottom: 1px solid #23302a;
  font-size: 11px;
  font-family: var(--mono);
}
.code-lang {
  color: #10b981;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.btn-copy-code {
  background: transparent;
  border: 1px solid #2c3c35;
  color: #a3b8af;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.12s ease;
}
.btn-copy-code:hover {
  background: #10b981;
  color: #fff;
  border-color: #10b981;
}
.docs-code-card pre {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.6;
  color: #e5ece8;
  background: transparent;
  border: 0;
}

/* Tables */
.table-container {
  overflow-x: auto;
  margin: 16px 0;
  border: 1px solid var(--line);
  border-radius: 8px;
}
.table-container table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.table-container th {
  background: var(--surface-hover);
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid var(--line);
}
.table-container td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
}
.table-container tr:last-child td {
  border-bottom: 0;
}

/* Task Checklists */
.task-item {
  list-style-type: none !important;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
}
.task-item input[type="checkbox"] {
  accent-color: var(--accent);
  margin: 0;
  cursor: default;
}
.task-item.checked {
  color: var(--muted);
  text-decoration: line-through;
}

.docs-inline-img {
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid var(--line);
  margin: 12px 0;
  display: block;
}

.anchor-link {
  color: var(--muted);
  opacity: 0.3;
  text-decoration: none;
  font-size: 0.85em;
  margin-left: 6px;
  transition: opacity 0.12s ease, color 0.12s ease;
}
.anchor-link:hover {
  opacity: 1;
  color: var(--accent);
}

/* Highlights, Badges, Accordions, Diagrams, Math */
mark.docs-highlight {
  background: #fef08a;
  color: #854d0e;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: 500;
}
:root[data-theme="dark"] mark.docs-highlight,
:root.dark mark.docs-highlight {
  background: rgba(234, 179, 8, 0.25);
  color: #fef08a;
}

kbd.docs-kbd {
  display: inline-block;
  padding: 2px 5px;
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1;
  color: var(--text);
  background: var(--surface-hover);
  border: 1px solid var(--line);
  border-bottom: 2px solid var(--line);
  border-radius: 4px;
  box-shadow: none !important;
}

details.docs-accordion {
  margin: 12px 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  overflow: hidden;
}
details.docs-accordion summary {
  padding: 10px 14px;
  font-weight: 600;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  background: var(--surface-hover);
  user-select: none;
  list-style-position: inside;
}
details.docs-accordion .accordion-content {
  padding: 12px 16px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.docs-math-block {
  margin: 14px 0;
  padding: 12px 18px;
  background: var(--surface-hover);
  border: 1px dashed var(--line);
  border-radius: 8px;
  text-align: center;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--accent);
}

.docs-diagram-card {
  margin: 16px 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  overflow: hidden;
}
.diagram-header {
  padding: 6px 12px;
  background: var(--surface-hover);
  border-bottom: 1px solid var(--line);
  font-size: 11px;
  font-family: var(--mono);
  font-weight: 700;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 6px;
}
.diagram-body {
  padding: 14px 16px;
  font-family: var(--mono);
  font-size: 12px;
  background: #0f1412;
  color: #34d399;
  overflow-x: auto;
}
.diagram-body pre {
  margin: 0;
  background: transparent;
  border: 0;
  padding: 0;
  font-family: var(--mono);
}

.docs-divider {
  border: 0;
  border-top: 1px solid var(--line);
  margin: 20px 0;
}

/* Application Status Footer */
.app-footer {
  height: 38px;
  min-height: 38px;
  max-height: 38px;
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

:root[data-theme="dark"] .sidefoot,
:root.dark .sidefoot,
:root:has(#theme-toggle:checked) .sidefoot,
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

.docs-studio-panel.is-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  z-index: 999999 !important;
  border-radius: 0 !important;
  border: 0 !important;
  margin: 0 !important;
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

/* neoMailer Error Pages */
.error-page-wrapper {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  background: var(--bg);
  z-index: 999;
}
.error-page-card {
  width: 100%;
  max-width: 1040px;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  align-items: center;
  gap: 48px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 56px 48px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
  margin: auto;
}
@media (max-width: 860px) {
  .error-page-card {
    grid-template-columns: 1fr;
    padding: 36px 20px;
    gap: 32px;
    text-align: center;
  }
}
.error-page-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 2;
}
.error-page-brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: var(--text);
  margin-bottom: 8px;
}
.error-page-brand .brandmark {
  width: 44px;
  height: 44px;
}
.error-page-brand .brandmark svg {
  max-width: 44px;
  max-height: 32px;
  width: 44px;
  height: 30px;
}
.error-page-brand .brand-title {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.error-page-brand .brand-sub {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  margin-top: 2px;
}
@media (max-width: 860px) {
  .error-page-brand {
    justify-content: center;
  }
}
.error-page-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: var(--brand-dark);
  line-height: 1.15;
  margin: 0;
}
[data-theme="dark"] .error-page-title {
  color: var(--text);
}
.error-page-desc {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 440px;
  margin: 0;
}
@media (max-width: 860px) {
  .error-page-desc {
    margin: 0 auto;
  }
}
.error-page-time {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-top: 2px;
}
.error-page-time strong {
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.2px;
}
@media (max-width: 860px) {
  .error-page-time {
    text-align: center;
  }
}
.error-page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.error-page-actions .button {
  padding: 11px 26px;
  font-weight: 700;
  font-size: 14px;
}
@media (max-width: 860px) {
  .error-page-actions {
    justify-content: center;
  }
}
.error-page-art {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.error-page-svg {
  width: 100%;
  max-width: 480px;
  height: auto;
  overflow: visible;
}
@keyframes mascotBlink {
  0%, 90%, 100% {
    transform: scaleY(1);
  }
  93%, 95% {
    transform: scaleY(0.08);
  }
}
.mascot-blinking-eyes {
  transform-origin: 270px 225px;
  animation: mascotBlink 4.2s ease-in-out infinite;
}
@keyframes neomailSteamFloat {
  0% { opacity: 0; transform: translateY(0) scaleX(0.8); }
  50% { opacity: 0.7; transform: translateY(-8px) scaleX(1.1); }
  100% { opacity: 0; transform: translateY(-16px) scaleX(1.3); }
}
.error-steam-1 {
/* Steam float animation */
@keyframes neomailSteamFloat {
  0% { opacity: 0; transform: translateY(0) scaleX(0.8); }
  50% { opacity: 0.7; transform: translateY(-8px) scaleX(1.1); }
  100% { opacity: 0; transform: translateY(-16px) scaleX(1.3); }
}
.error-steam-1 {
  animation: neomailSteamFloat 2.8s ease-out infinite;
}
.error-steam-2 {
  animation: neomailSteamFloat 2.8s ease-out infinite 1.4s;
}

/* Waving animation from Koko */
.arm-rest {
  display: inline;
}
.arm-wave {
  display: none;
  transform-origin: 310px 254px;
}

@keyframes waveGesture {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(-26deg); }
  40% { transform: rotate(2deg); }
  60% { transform: rotate(-24deg); }
  80% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
}

.is-waving .arm-rest {
  display: none !important;
}
.is-waving .arm-wave {
  display: inline !important;
  animation: waveGesture 1.6s ease-in-out infinite;
}

/* Server Activity LEDs */
@keyframes serverLedBlink {
  0%, 100% { opacity: 1; }
  25% { opacity: 0.3; }
  50% { opacity: 0.9; }
  75% { opacity: 0.2; }
}
@keyframes serverLedPulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0.35; }
}
.server-led-1 { animation: serverLedBlink 1.9s infinite; }
.server-led-2 { animation: serverLedBlink 2.4s infinite 0.5s; }
.server-led-3 { animation: serverLedPulse 3.1s infinite 0.9s; }

/* Subtle natural plant breeze animation - gentle air movement at top, leaves stay fully attached at base */
@keyframes plantGentleAir {
  0%, 100% { transform: rotate(0deg); }
  35% { transform: rotate(1deg); }
  75% { transform: rotate(-0.7deg); }
}
.plant-breeze {
  transform-origin: 30px 150px;
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: plantGentleAir 6.5s ease-in-out infinite;
}
`;

function document(title, content, nonce = '', isDark = false, bodyClass = '') {
  return `<!doctype html><html lang="en" ${isDark ? 'data-theme="dark" class="dark"' : ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#063b2c"><link rel="icon" type="image/svg+xml" href="${faviconUri}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preload" href="https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwgknk-6nFg.woff2" as="font" type="font/woff2" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"><title>${e(title)} · neoMailer</title><style>${css}</style>${nonce ? `<script nonce="${nonce}">try{var cf=localStorage.getItem('neomail_font_css');if(cf){var s=document.createElement('style');s.id='neomail-fonts-cached';s.textContent=cf;document.head.appendChild(s);}var t=localStorage.getItem('neomail_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}}catch(e){}</script>` : ''}</head><body${bodyClass ? ` class="${e(bodyClass)}"` : ''}>${content}</body></html>`;
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

function formatCredit(credit = 'Developed by SoftLaya Tech') {
  const safe = e(credit || 'Developed by SoftLaya Tech');
  if (safe.startsWith('Developed by ')) {
    return 'Developed by <strong>' + safe.slice(13) + '</strong>';
  }
  return safe;
}

export function page(view, title, subtitle, content, sess, notice = '', alerts = [], footerCredit = 'Developed by SoftLaya Tech') {
  const base = sess?.base || '/dashboard';
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
            <span class="brandmark">${neomailLogoSvg}</span>
            <div class="brand-text">
              <span class="brand-title">neo<span>Mailer</span></span><span style="display:none">neo<span>Mailer</span></span>
              <span class="brand-sub">Mail Infrastructure</span>
            </div>
          </a>
          <label for="drawer-toggle" class="drawer-close" aria-label="Close navigation">${icon('close')}</label>
        </div>
        <div class="eyebrow">Workspace</div>
        <nav>${navFor(sess?.role).map(([id, label]) => `<a class="navlink ${id === view ? 'active' : ''}" ${id === view ? 'aria-current="page"' : ''} href="${base}/${id}">${icon(id)}<span>${label}</span></a>`).join('')}</nav>
        <div class="side-docs-box">
          <div class="side-docs-row">
            <a class="navlink side-docs-link" href="/docs" target="_blank" title="View live documentation in a new tab">${icon('docs')}<span>Documentation ↗</span></a>
            ${sess?.role === 'superadmin' ? `
              <a class="side-docs-edit-btn" href="${base}/docs" title="Edit documentation in Documentation Studio" aria-label="Edit documentation in Studio">${icon('edit')}<span>Edit</span></a>
            ` : ''}
          </div>
        </div>
        <div class="sidefoot">
          <div class="sidefoot-credit">
            <span>${formatCredit(sess?.footerCredit || footerCredit)}</span>
            ${sess?.role === 'superadmin' ? `
              <a class="sidefoot-credit-edit" href="${base}/settings#branding" title="Edit branding &amp; footer credit in Settings" aria-label="Edit footer credit in Settings">${icon('edit')}</a>
            ` : ''}
          </div>
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
                ${profileAvatar(sess.profile, base)}
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
                ${sess?.role === 'superadmin' ? `<a class="dropdown-item" href="${base}/security">${icon('security')} Security events</a>` : ''}
                <a class="dropdown-item" href="${base}/compose">${icon('mail')} Send test email</a>
                <div class="dropdown-divider"></div>
                <form method="post" action="${base}/logout">
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
              ${view === 'users' ? (sess?.role === 'superadmin' ? `
                <button type="button" class="button" onclick="document.getElementById('addAdminModal')?.showModal()">${icon('plus')} Add admin</button>
              ` : '') : `
                <a class="button secondary spa-refresh-btn" id="spa-refresh-link" href="${base}/${view}">${icon('refresh')} Refresh</a>
                <a class="button" href="${base}/compose">${icon('mail')} Send a test</a>
              `}
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
              <span>Database: <strong>Connected</strong></span>
            </div>
          </div>
          <div class="footer-right">
            <span>${formatCredit(sess?.footerCredit || footerCredit)}</span>
            <span>·</span>
            <span>Zero-Trust AES-256</span>
          </div>
        </footer>
      </div>
    </div>
    ${sess?.script_nonce ? `<script nonce="${sess.script_nonce}">${SPA_CLIENT_SCRIPT}</script>` : ''}
  `, sess?.script_nonce, isDark);
}

export function login(error = '', isDark = false, showRegister = true, footerCredit = 'Developed by SoftLaya Tech') {
  const renderedError = error ? renderNoticeText(error) : '';
  const registerModal = showRegister ? `
    <div style="margin-top:14px;text-align:center">
      <button type="button" class="textbutton-link" style="font-size:12px;color:var(--muted)" onclick="document.getElementById('regModal').showModal()">Request client access</button>
    </div>
    <dialog id="regModal" class="login-modal" onclick="if(event.target===this)this.close()">
      <div class="modal-card">
        <div class="modal-head">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="brandmark" style="width:32px;height:32px;padding:0;background:var(--tint);color:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center">${icon('users')}</div>
            <div>
              <h2 style="font-size:15px;margin:0;font-weight:700">Request Client Access</h2>
              <p style="font-size:11px;color:var(--muted);margin:2px 0 0">Apply for a verified workspace account</p>
            </div>
          </div>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('regModal').close()" aria-label="Close modal">&times;</button>
        </div>
        <form method="post" action="/login" class="modal-body">
          <input type="hidden" name="step" value="register_request">
          <label class="field">Full name
            <input type="text" name="name" required maxlength="80" placeholder="Jane Doe" autocomplete="name">
          </label>
          <label class="field">Work email address
            <input type="email" name="email" required maxlength="254" placeholder="you@company.com" autocomplete="email">
          </label>
          <label class="field">Organization / Company
            <input type="text" name="organization" required maxlength="120" placeholder="e.g. Acme Technologies">
          </label>
          <label class="field">Intended sending use case (optional)
            <textarea name="notes" rows="2" maxlength="500" placeholder="e.g. Transactional alerts, receipts, notification infrastructure..."></textarea>
          </label>
          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
            <button type="button" class="button secondary" onclick="document.getElementById('regModal').close()">Cancel</button>
            <button type="submit" class="button">Submit access request</button>
          </div>
        </form>
      </div>
    </dialog>
  ` : '';

  return document('Sign in', `<div class="login">
    <div class="login-card loginform">
      <div class="logininner">
        ${neomailBrandBadge}
        <h1 class="login-card-title" style="text-align:center">Sign in to neoMailer</h1><!-- Welcome to NeoMail --><!-- Welcome to neoMail -->
        <p class="login-card-sub" style="text-align:center">Enter your administrator access token to sign in to your workspace.</p>
        <form method="post" action="/login">
          <div class="login-field-group">
            <label class="login-label" for="login-token">Administrator token</label>
            <input type="password" id="login-token" name="admin_token" class="login-input" required minlength="43" maxlength="128" placeholder="Paste your secure access token" autocomplete="current-password" ${error ? 'aria-invalid="true"' : ''}>
            ${renderedError ? `<div class="notice error" role="alert">${renderedError}</div>` : ''}
          </div>
          <button type="submit" class="button login-submit-btn">Sign in to workspace ${icon('arrow')}</button>
        </form>
        ${registerModal}
        <span style="display:none" aria-hidden="true">${e(footerCredit)}</span>
      </div>
    </div>
  </div>`, '', isDark);
}

export function requestAccessPage(error = '', isDark = false, formVals = {}, successNotice = '', footerCredit = 'Developed by SoftLaya Tech', isDisabled = false) {
  const renderedError = error ? renderNoticeText(error) : '';

  const bodyContent = successNotice ? `
    <div style="text-align:center;padding:12px 0;">
      <div style="width:56px;height:56px;border-radius:50%;background:var(--tint);color:var(--accent);display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:28px;height:28px;"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style="font-size:22px;font-weight:800;margin:0 0 8px;color:var(--text);letter-spacing:-0.4px;">Request Received</h2>
      <p style="font-size:14px;color:var(--muted);margin:0 0 24px;line-height:1.6;">${e(successNotice)}</p>
      <div style="background:var(--surface-hover);border:1px solid var(--line);border-radius:var(--radius-sm);padding:14px 16px;text-align:left;margin-bottom:24px;font-size:13px;">
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--line);">
          <span style="color:var(--muted)">Applicant:</span>
          <span style="font-weight:600;color:var(--text)">${e(formVals.name || '')}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--line);">
          <span style="color:var(--muted)">Work email:</span>
          <span style="font-weight:600;color:var(--text)">${e(formVals.email || '')}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;">
          <span style="color:var(--muted)">Organization:</span>
          <span style="font-weight:600;color:var(--text)">${e(formVals.organization || 'Individual / Startup')}</span>
        </div>
      </div>
      <a href="/login" class="button" style="width:100%;justify-content:center;padding:11px 16px;box-sizing:border-box;">Return to Sign In</a>
    </div>
  ` : isDisabled ? `
    <div style="text-align:center;padding:16px 0;">
      <div style="width:52px;height:52px;border-radius:50%;background:rgba(239,68,68,0.1);color:#ef4444;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        ${icon('alert')}
      </div>
      <h2 style="font-size:20px;font-weight:800;margin:0 0 8px;color:var(--text);">Registration Unavailable</h2>
      <p style="font-size:14px;color:var(--muted);margin:0 0 24px;line-height:1.5;">Public registration requests are currently disabled by the workspace administrator.</p>
      <a href="/login" class="button secondary" style="width:100%;justify-content:center;padding:10px 16px;box-sizing:border-box;">Return to Sign In</a>
    </div>
  ` : `
    <form method="post" action="/request-access">
      <input type="hidden" name="step" value="register_request">
      <div style="display:flex;flex-direction:column;gap:14px;">
        <label class="field" style="margin:0;">
          <span>Full name <span style="color:#ef4444">*</span></span>
          <input type="text" name="name" required maxlength="80" placeholder="Jane Doe" autocomplete="name" value="${e(formVals.name || '')}">
        </label>
        <label class="field" style="margin:0;">
          <span>Work email address <span style="color:#ef4444">*</span></span>
          <input type="email" name="email" required maxlength="254" placeholder="you@company.com" autocomplete="email" value="${e(formVals.email || '')}">
        </label>
        <label class="field" style="margin:0;">
          <span>Company / Organization <span style="color:#ef4444">*</span></span>
          <input type="text" name="organization" required maxlength="120" placeholder="e.g. Acme Technologies Inc." autocomplete="organization" value="${e(formVals.organization || '')}">
        </label>
        <label class="field" style="margin:0;">
          <span>Expected monthly sending volume</span>
          <select name="volume" class="custom-select">
            <option value="< 25k" ${formVals.volume === '< 25k' ? 'selected' : ''}>&lt; 25,000 emails / month</option>
            <option value="25k - 100k" ${formVals.volume === '25k - 100k' ? 'selected' : ''}>25,000 – 100,000 emails / month</option>
            <option value="100k - 500k" ${formVals.volume === '100k - 500k' ? 'selected' : ''}>100,000 – 500,000 emails / month</option>
            <option value="500k+" ${formVals.volume === '500k+' ? 'selected' : ''}>500,000+ emails / month</option>
          </select>
        </label>
        <label class="field" style="margin:0;">
          <span>Intended sending use case</span>
          <textarea name="notes" rows="3" maxlength="500" placeholder="e.g. Transactional alerts, password resets, receipts, notification infrastructure...">${e(formVals.notes || '')}</textarea>
        </label>
      </div>

      <div style="margin-top:16px;padding:10px 12px;background:var(--surface-hover);border-radius:var(--radius-sm);border:1px solid var(--line);font-size:11.5px;color:var(--muted);display:flex;align-items:flex-start;gap:8px;line-height:1.45;">
        ${icon('security')}
        <span>Verified workspace access includes single-tenant domain isolation, SPF/DKIM validation, API keys, and enterprise dispatch routing.</span>
      </div>

      <button type="submit" class="button" style="width:100%;justify-content:center;padding:11px 16px;box-sizing:border-box;margin-top:18px;">
        Submit Access Request ${icon('arrow')}
      </button>

      <div style="text-align:center;margin-top:18px;">
        <a href="/login" class="textbutton-link" style="font-size:12.5px;color:var(--muted);">
          &larr; Already have an account? Sign in
        </a>
      </div>
    </form>
  `;

  return document('Request Client Access', `<div class="login">
    <div class="login-card loginform" style="max-width:480px;">
      <div class="logininner">
        ${neomailBrandBadge}
        <h1 class="login-card-title" style="text-align:center">Request Client Access</h1>
        <p class="login-card-sub" style="text-align:center">Apply for a verified neoMailer transactional email workspace.</p>
        ${renderedError ? `<div class="notice error" role="alert" style="margin-bottom:16px">${renderedError}</div>` : ''}
        ${bodyContent}
        <small class="footnote" style="display:block;text-align:center;margin-top:24px;color:var(--muted)">Private mail infrastructure · ${e(footerCredit)}</small>
      </div>
    </div>
  </div>`, '', isDark);
}

function empty(message = 'Your mail activity will appear here', help = 'Configure a provider and sender identity, then send your first test email.') {
  return `<div class="empty">${icon('mail')}<strong>${e(message)}</strong><p>${e(help)}</p></div>`;
}

export function mailTable(logs, base = '/dashboard') {
  if (!logs.length) return empty();
  return `<div class="tablewrap"><table><thead><tr><th>Message</th><th>Direction</th><th>Status</th><th>Provider</th><th>Time (UTC)</th><th>Details</th></tr></thead><tbody>${logs.map(m => `<tr><td><div class="subject">${e(m.subject)}</div><span class="muted">${e(m.recipient_address)}</span></td><td>${e(m.direction)}</td><td>${badge(m.transmission_status)}</td><td>${e(m.provider_used)}</td><td>${e(new Date(m.unix_timestamp * 1000).toISOString().slice(0, 16).replace('T', ' '))}</td><td><a class="button secondary small" href="${base}/view-mail?id=${e(m.id)}">Inspect ${icon('arrow')}</a></td></tr>`).join('')}</tbody></table></div>`;
}

export function providerList(rows = [], cfg = {}, csrf, base = '/dashboard') {
  const safeRows = Array.isArray(rows) ? rows : [];
  return PROVIDERS.map(p => {
    const row = safeRows.find(r => r && r.provider_name === p);
    let configured = false;
    if (p === 'smtp') {
      configured = !!(cfg.SMTP_HOST && cfg.SMTP_USER && cfg.SMTP_PASS);
    } else {
      configured = !!cfg[p.toUpperCase() + '_API_KEY'];
    }
    const failures = row?.consecutive_failures || 0;
    const isPaused = row?.is_active === 0;
    const inCooldown = failures >= 5;
    const hasFailures = failures > 0;
    const statusLabel = !configured ? 'Not configured'
      : isPaused ? 'Paused'
      : inCooldown ? 'Cooling down'
      : hasFailures ? 'Failing (' + failures + ')'
      : !row?.last_used_timestamp ? 'Configured'
      : 'Ready';
    return `<div class="provider"><div class="providerleft"><div class="providerlogo">${providerLogo(p)}</div><div><strong>${e(p)}</strong><p>${configured ? (row?.last_used_timestamp ? 'Operational' : 'Credential configured · Untested') : 'Add a credential in Settings'}${failures ? ' · ' + failures + ' recent failures' : ''}</p></div></div><div class="actions">${badge(statusLabel)}<a class="button secondary small" href="${base}/settings" aria-label="Configure">${icon('settings')}</a>${csrf ? `<form method="post" action="${base}/providers/toggle">${hidden(csrf)}<input type="hidden" name="provider" value="${p}"><button class="button secondary small">${row?.is_active === 0 ? 'Enable' : 'Pause'}</button></form>` : ''}</div></div>`;
  }).join('');
}

export function overview(stats = {}, logs = [], health = [], cfg = {}, isSuper = true, base = '/dashboard', hasVerifiedDomains = true) {
  const safeStats = stats || {};
  const unverifiedNotice = (!isSuper && !hasVerifiedDomains) ? `
    <div class="notice warn" style="margin-bottom:20px;border-left:4px solid var(--accent)">
      <strong>⚠️ Action Required: Add & Verify Your Sending Domain</strong>
      <p style="margin:4px 0 0;font-size:13px">To protect domain reputation and prevent unauthorized abuse, email sending and API keys are disabled until you verify domain ownership. <a href="${base}/domains" style="text-decoration:underline;font-weight:600">Configure your domain DNS now →</a></p>
    </div>
  ` : '';
  return `${unverifiedNotice}<div class="stats">${[
    ['Total messages', safeStats.total ?? 0, 'Inbound and outbound'],
    ['Accepted / delivered', safeStats.accepted ?? 0, 'Provider acceptance is not inbox placement'],
    ['Delivery issues', safeStats.issues ?? 0, 'Failed or bounced'],
    ['Pending', safeStats.pending ?? 0, 'Queued or awaiting reconciliation']
  ].map(([label, value, note]) => `<div class="stat"><div class="statlabel"><span>${e(label)}</span>${icon('mail')}</div><div class="statvalue">${e(Number(value || 0).toLocaleString())}</div><div class="statnote">${e(note)}</div></div>`).join('')}</div><div class="split"><div><section class="panel"><div class="panelhead"><div><h2>Recent mail</h2><p>Your latest messages, in one place.</p></div><a class="button secondary small" href="${base}/mail">View all</a></div>${mailTable(Array.isArray(logs) ? logs : [], base)}</section><div class="notice">Message bodies are ${cfg.STORE_MESSAGE_BODIES === 'true' ? 'stored for inspection. Avoid sending secrets in email.' : 'not retained. Metadata remains available for delivery tracking.'}</div></div><div><section class="panel"><div class="panelhead"><div><h2>${isSuper ? 'Delivery providers' : 'Workspace Delivery'}</h2><p>${isSuper ? 'Availability based on configuration and recent attempts.' : 'Sending capability and provider connectivity for your workspace.'}</p></div></div>${isSuper ? providerList(health, cfg, undefined, base) : `<div class="panelbody"><p class="sub">Outbound sending from your workspace uses your verified domains and encrypted provider keys.</p><div style="display:flex;gap:10px;margin-top:14px"><a class="button secondary small" href="${base}/identities">Sender identities ${icon('arrow')}</a><a class="button secondary small" href="${base}/domains">Domains ${icon('arrow')}</a></div></div>`}</section><section class="panel"><div class="panelbody"><h2>${isSuper ? 'Connect your platform' : 'API Integration'}</h2><p class="sub">${isSuper ? 'Send transactional mail from your application backend using a dedicated API credential.' : 'Issue and manage dedicated API credentials to send transactional mail from your backend.'}</p><a class="button secondary" href="${base}/${isSuper ? 'setup' : 'clients'}">${isSuper ? 'Integration guide' : 'API clients'} ${icon('arrow')}</a></div></section></div></div>`;
}

export function mailView(logs, filters, currentPage, hasNext, base = '/dashboard') {
  const query = new URLSearchParams(filters);
  const qStr = query.toString();
  return `<section class="panel"><div class="panelhead"><div><h2>Mail activity</h2><p>Search and inspect inbound and outbound messages.</p></div></div><form class="filters" method="get" action="${base}/mail"><div class="filter-group filter-search"><span class="field-label">Search</span><div class="input-with-icon"><span class="input-icon">${icon('search')}</span><input name="search" maxlength="100" placeholder="Subject or recipient" value="${e(filters.search)}"></div></div><div class="filter-group"><label class="field-label">Direction</label><select name="direction" class="custom-select"><option value="">All directions</option>${['outbound', 'inbound'].map(v => `<option value="${v}" ${filters.direction === v ? 'selected' : ''}>${v === 'outbound' ? 'Outbound ↗' : 'Inbound ↙'}</option>`).join('')}</select></div><div class="filter-group"><label class="field-label">Status</label><select name="status" class="custom-select"><option value="">All statuses</option>${['Queued', 'Sent', 'Delivered', 'Bounced', 'Failed'].map(v => `<option value="${v}" ${filters.status === v ? 'selected' : ''}>${v}</option>`).join('')}</select></div><div class="filter-actions"><button class="button secondary">${icon('filter')} Apply filters</button>${(filters.search || filters.direction || filters.status) ? `<a href="${base}/mail" class="button secondary small" title="Reset filters">${icon('close')} Clear</a>` : ''}</div></form>${mailTable(logs, base)}<div class="pagination"><span>Page ${currentPage} · Up to 25 messages per page</span><div class="actions">${currentPage > 1 ? `<a class="button secondary small" href="${base}/mail?${qStr ? e(qStr) + '&' : ''}page=${currentPage - 1}">Previous</a>` : ''}${hasNext ? `<a class="button secondary small" href="${base}/mail?${qStr ? e(qStr) + '&' : ''}page=${currentPage + 1}">Next</a>` : ''}</div></div></section>`;
}

function accountProviderCredentials(accountKeys = [], sess) {
  const base = sess?.base || '/dashboard';
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
        <strong>🔒 Write-Only Zero-Trust Protection:</strong> Your API keys are encrypted at rest with AES-256-GCM in Database (SQLite).
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
                ${item ? `<form method="post" action="${base}/account-keys/toggle">${hidden(sess.csrf_token)}<input type="hidden" name="provider" value="${p}"><button class="button secondary small">${item.is_active ? 'Pause' : 'Enable'}</button></form>` : ''}
                ${item ? `<form method="post" action="${base}/account-keys/delete" onsubmit="return confirm('Remove this provider key?')">${hidden(sess.csrf_token)}<input type="hidden" name="provider" value="${p}"><button class="button danger small">Remove</button></form>` : ''}
              </div>
            </div>
            ${item ? `<div style="font-size:12px;margin-bottom:12px;color:var(--muted)">Key Hint: <code style="background:var(--surface);border:1px solid var(--line);padding:2px 6px;border-radius:4px;color:var(--text)">${e(item.key_hint)}</code>${p === 'mailgun' && extra.domain ? ` &nbsp; Domain: <code>${e(extra.domain)}</code>` : ''}${p === 'smtp' && extra.smtp_host ? ` &nbsp; Host: <code>${e(extra.smtp_host)}</code> (User: <code>${e(extra.smtp_user)}</code>)` : ''}</div>` : ''}
            <details style="border-top:1px solid var(--line);padding-top:10px">
              <summary style="font-size:12px;color:var(--accent);cursor:pointer;font-weight:600">${item ? 'Rotate / Replace Key' : '+ Configure ' + e(meta.label) + ' Key'}</summary>
              <form method="post" action="${base}/account-keys/save" style="margin-top:10px">
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
  const base = sess?.base || '/dashboard';
  return `
    <section class="panel" id="provider-limits">
      <div class="panelhead">
        <div>
          <h2>Provider Sending Limits (Your Workspace)</h2>
          <p>Configurable per-provider dispatch limits. When usage reaches the limit, neoMailer fails over to the next provider.</p>
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
  const base = sess?.base || '/dashboard';
  const accountCredentialsSection = accountProviderCredentials(accountKeys, sess);
  const limitsSection = providerLimitsPanel(sess, limits, usage);
  if (!canEditGlobal) return `${profileSettings(sess)}${limitsSection}${accountCredentialsSection}`;
  return `${profileSettings(sess)}${limitsSection}${accountCredentialsSection}${bimiSettings(cfg)}<div class="notice">Global settings apply to new requests without account-specific overrides. Global credentials are encrypted with your Worker’s encryption key.</div><div class="grid2"><section class="panel" id="branding"><div class="panelhead"><div><h2>Global Workspace settings</h2><p>Mail routing, limits, and retention.</p></div></div><div class="panelbody"><form method="post" action="${base}/settings">${hidden(sess.csrf_token)}<div class="settingsgrid">${Object.entries(SETTINGS).map(([name, spec]) => `<label class="field">${e(spec[0])}${spec[1] === 'boolean' ? `<select name="${name}" class="custom-select"><option value="false" ${cfg[name] === 'false' ? 'selected' : ''}>False</option><option value="true" ${cfg[name] === 'true' ? 'selected' : ''}>True</option></select>` : `<input name="${name}" value="${e(cfg[name])}" type="${spec[1] === 'number' ? 'number' : spec[1] === 'email' ? 'email' : 'text'}" ${spec[1] === 'number' ? `min="${spec[3]}" max="${spec[4]}"` : ''} ${['https-url', 'optional-domain', 'sandbox-domain'].includes(spec[1]) ? '' : 'required'} maxlength="255">`}</label>`).join('')}</div><button class="button">Save settings</button></form></div></section><div><section class="panel"><div class="panelhead"><div><h2>Global Fallback Credentials</h2><p>Blank values keep your current credential. Values are never displayed.</p></div></div>${SECRETS.map(name => `<details><summary>${e(name)} &nbsp; ${badge(cfg[name] ? 'Configured' : 'Not set')}</summary><form method="post" action="${base}/credentials">${hidden(sess.csrf_token)}<input type="hidden" name="name" value="${name}"><label class="field">New credential<input type="password" name="value" autocomplete="new-password" required minlength="${name === 'API_SECRET_KEY' ? 43 : 16}" maxlength="4096" placeholder="Paste a new credential"></label>${sess.local_dev ? '<label class="field">Confirm local administrator token<input type="password" name="admin_token" autocomplete="current-password" required minlength="43" maxlength="128"></label>' : '<p class="footnote">Credential changes require a Cloudflare Access token issued within the last five minutes. Sign out of Access and sign in again if requested. This checks token age; identity-provider policy controls fresh user verification.</p>'}<button class="button">Save credential</button></form></details>`).join('')}</section><div class="notice warn">Access policy, local development token, encryption key, database binding, and domain routes stay in Cloudflare. They cannot be changed through this panel. Rotate credentials by replacing their values here.</div></div></div>`;
}

export function identities(rows, sess, domains = []) {
  const base = sess?.base || '/dashboard';
  const countBadge = rows.length ? `<span class="tag good">${rows.length} ${rows.length === 1 ? 'identity' : 'identities'}</span>` : '';
  const rowsHtml = rows.map(r => `<tr>
    <td>
      <div class="identity-name-cell">
        <span class="identity-avatar">${e(initial(r.display_name))}</span>
        <div class="identity-info">
          <span class="identity-title">${e(r.display_name)}</span>
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
      <form method="post" action="${base}/identities/update" class="identity-actions">
        ${hidden(sess.csrf_token)}
        <input type="hidden" name="email_address" value="${e(r.email_address)}">
        <button type="button" class="button secondary small" data-action="rename-identity" data-address="${e(r.email_address)}" data-name="${e(r.display_name)}" onclick="openEditIdentityModal('${e(r.email_address)}', '${e(r.display_name)}')" title="Rename display name or change address">
          ${icon('edit')}
          <span>Rename</span>
        </button>
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

  const editModal = `
    <dialog id="editIdentityModal" class="login-modal admin-modal" onclick="if(event.target===this)this.close()">
      <div class="modal-card">
        <div class="modal-head">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="brandmark" style="width:32px;height:32px;padding:0;background:var(--tint);color:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center">${icon('edit')}</div>
            <div>
              <h2 style="font-size:15px;margin:0;font-weight:700">Edit Sender Identity</h2>
              <p style="font-size:11px;color:var(--muted);margin:2px 0 0">Update display name or transfer sender email address</p>
            </div>
          </div>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('editIdentityModal').close()" aria-label="Close modal">&times;</button>
        </div>
        <form method="post" action="${base}/identities/update" class="modal-body" id="editIdentityForm">
          ${hidden(sess.csrf_token)}
          <input type="hidden" name="email_address" id="edit-id-original-address">
          <input type="hidden" name="action" value="rename">

          <label class="field" style="margin-bottom:12px">
            <span style="font-size:11px;font-weight:600;display:block;margin-bottom:4px">Display name</span>
            <input name="display_name" id="edit-id-display-name" required maxlength="100" autocomplete="off" placeholder="e.g. Support Team" style="width:100%">
            <small style="font-size:11px;color:var(--muted);display:block;margin-top:2px">Human-friendly sender name shown to recipients</small>
          </label>

          <label class="field" style="margin-bottom:14px">
            <span style="font-size:11px;font-weight:600;display:block;margin-bottom:4px">Sender email address</span>
            <input type="email" name="new_email_address" id="edit-id-email-address" required maxlength="254" autocomplete="off" spellcheck="false" placeholder="support@yourdomain.com" style="width:100%">
            <small style="font-size:11px;color:var(--muted);display:block;margin-top:2px">Must belong to one of your active verified sending domains</small>
          </label>

          <div id="edit-id-otp-section" style="display:none;background:var(--bg);border:1px solid var(--line);border-radius:var(--radius-md);padding:14px;margin-bottom:16px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">
              <div>
                <strong style="font-size:12px;display:block">Address Change Authorization</strong>
                <p style="font-size:11px;color:var(--muted);margin:2px 0 0">Confirmation code will be sent to: <span style="color:var(--text);font-weight:600">${e(sess.subject || 'your admin email')}</span></p>
              </div>
              <button type="button" class="button secondary small" id="edit-id-send-otp-btn" style="white-space:nowrap;flex-shrink:0">${icon('mail')} <span>Send OTP</span></button>
            </div>
            <div id="edit-id-otp-msg" style="font-size:11px;margin-bottom:8px;display:none;line-height:1.4"></div>
            <label class="field" style="margin:0">
              <span style="font-size:11px;font-weight:600;display:block;margin-bottom:4px">6-digit confirmation code</span>
              <input name="otp_code" id="edit-id-otp-input" maxlength="6" pattern="[0-9]{6}" autocomplete="one-time-code" placeholder="123456" style="width:100%;letter-spacing:4px;font-weight:700;font-family:monospace;font-size:16px">
            </label>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px">
            <button type="button" class="button secondary" onclick="document.getElementById('editIdentityModal').close()">Cancel</button>
            <button type="submit" class="button" id="edit-id-submit-btn">Save changes</button>
          </div>
        </form>
      </div>
    </dialog>
  `;

  const editIdentityScript = sess?.script_nonce ? `<script nonce="${e(sess.script_nonce)}">
window.openEditIdentityModal = function(address, displayName) {
  var modal = document.getElementById('editIdentityModal');
  if (!modal) return;
  var origInput = document.getElementById('edit-id-original-address');
  var nameInput = document.getElementById('edit-id-display-name');
  var emailInput = document.getElementById('edit-id-email-address');
  var otpSection = document.getElementById('edit-id-otp-section');
  var otpInput = document.getElementById('edit-id-otp-input');
  var otpMsg = document.getElementById('edit-id-otp-msg');
  if (origInput) origInput.value = address;
  if (nameInput) nameInput.value = displayName;
  if (emailInput) emailInput.value = address;
  if (otpSection) otpSection.style.display = 'none';
  if (otpInput) { otpInput.value = ''; otpInput.required = false; }
  if (otpMsg) { otpMsg.style.display = 'none'; otpMsg.textContent = ''; }
  modal.showModal();
};

document.addEventListener('click', function(ev) {
  var btn = ev.target.closest('[data-action="rename-identity"]');
  if (btn) {
    ev.preventDefault();
    window.openEditIdentityModal(btn.getAttribute('data-address'), btn.getAttribute('data-name'));
  }
});

(function() {
  var origInput = document.getElementById('edit-id-original-address');
  var emailInput = document.getElementById('edit-id-email-address');
  var otpSection = document.getElementById('edit-id-otp-section');
  var otpInput = document.getElementById('edit-id-otp-input');
  var sendBtn = document.getElementById('edit-id-send-otp-btn');
  var otpMsg = document.getElementById('edit-id-otp-msg');

  function checkAddressChange() {
    if (!origInput || !emailInput || !otpSection) return;
    var changed = emailInput.value.trim().toLowerCase() !== origInput.value.trim().toLowerCase();
    if (changed) {
      otpSection.style.display = 'block';
      if (otpInput) otpInput.required = true;
    } else {
      otpSection.style.display = 'none';
      if (otpInput) { otpInput.required = false; otpInput.value = ''; }
      if (otpMsg) otpMsg.style.display = 'none';
    }
  }

  if (emailInput) {
    emailInput.addEventListener('input', checkAddressChange);
    emailInput.addEventListener('change', checkAddressChange);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', async function() {
      var currentAddress = origInput.value.trim();
      var newAddress = emailInput.value.trim();
      if (!newAddress || currentAddress.toLowerCase() === newAddress.toLowerCase()) {
        if (otpMsg) {
          otpMsg.style.display = 'block';
          otpMsg.style.color = 'var(--danger)';
          otpMsg.textContent = 'Please enter a different email address to change.';
        }
        return;
      }
      sendBtn.disabled = true;
      var origBtnText = sendBtn.innerHTML;
      sendBtn.innerHTML = 'Sending...';
      if (otpMsg) {
        otpMsg.style.display = 'block';
        otpMsg.style.color = 'var(--muted)';
        otpMsg.textContent = 'Requesting 6-digit confirmation code...';
      }
      try {
        var formData = new FormData();
        formData.append('csrf_token', '${e(sess.csrf_token || '')}');
        formData.append('email_address', currentAddress);
        formData.append('new_email_address', newAddress);
        var resp = await fetch('${base}/identities/request-otp', {
          method: 'POST',
          body: formData,
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        var data = await resp.json().catch(function() { return {}; });
        if (resp.ok) {
          if (otpMsg) {
            otpMsg.style.color = 'var(--accent)';
            otpMsg.textContent = data.message || 'Verification code sent to your email! Please enter it below.';
          }
          sendBtn.innerHTML = 'Resend OTP';
          setTimeout(function() { sendBtn.disabled = false; }, 15000);
          if (otpInput) otpInput.focus();
        } else {
          if (otpMsg) {
            otpMsg.style.color = 'var(--danger)';
            otpMsg.textContent = data.error || (data.message || 'Failed to send confirmation code. Verify your email provider and domain.');
          }
          sendBtn.disabled = false;
          sendBtn.innerHTML = origBtnText;
        }
      } catch (err) {
        if (otpMsg) {
          otpMsg.style.color = 'var(--danger)';
          otpMsg.textContent = 'Network or server error while requesting code.';
        }
        sendBtn.disabled = false;
        sendBtn.innerHTML = origBtnText;
      }
    });
  }
})();
</script>` : '';

  return `<div class="notice warn">Creating an identity here does not verify its domain. Verify every sending domain with each active provider before sending.</div>
${!domains.length && sess?.role !== 'superadmin' ? `<div class="notice warn" style="margin-bottom:16px;border-left:4px solid var(--accent)"><strong>⚠️ Domain Verification Required:</strong> You cannot create sender identities until you add and verify at least one sending domain under <a href="${base}/domains" style="text-decoration:underline;font-weight:600">Domains</a>.</div>` : ''}
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
    <form class="identityform-grid" method="post" action="${base}/identities/create">
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
          <button class="button submit-btn" ${!domains.length && sess?.role !== 'superadmin' ? 'disabled title="Verify a domain first"' : ''}>${icon('plus')}<span>Add identity</span></button>
        </div>
      </div>
    </form>
  </div>
</section>
${editModal}
${editIdentityScript}`;
}

export function compose(rows, sess, hasVerifiedDomains = true) {
  const base = sess?.base || '/dashboard';
  const isSuper = sess?.role === 'superadmin';
  const canSend = isSuper || (hasVerifiedDomains && rows.some(r => r.is_active));
  const warning = (!isSuper && !hasVerifiedDomains) ? `
    <div class="notice warn" style="margin-bottom:16px;border-left:4px solid var(--accent)">
      <strong>⚠️ Domain Verification Required</strong>
      <p style="margin:4px 0 0;font-size:13px">You cannot send test emails until you add and verify ownership of a sending domain under <a href="${base}/domains" style="text-decoration:underline;font-weight:600">Domains</a>.</p>
    </div>
  ` : '';
  return `<div class="grid2"><section class="panel">${warning}<div class="panelhead"><div><h2>Send a test email</h2><p>This sends a real message through your configured providers.</p></div></div><div class="panelbody"><form method="post" action="${base}/send-test">${hidden(sess.csrf_token)}<input type="hidden" name="idempotency_key" value="${crypto.randomUUID()}"><label class="field">Delivery mode<select name="delivery_mode" class="custom-select"><option value="normal">Configured providers</option>${isSuper ? '<option value="mailgun-sandbox">Mailgun sandbox only</option>' : ''}</select><small>Sandbox uses postmaster@your-sandbox domain and only sends through Mailgun. The sender selection below is ignored in sandbox mode. Authorize the recipient in Mailgun first.</small></label><label class="field">Sender<select name="from" required class="custom-select" ${!canSend ? 'disabled' : ''}>${rows.filter(r => r.is_active).map(r => `<option value="${e(r.email_address)}" ${r.is_default ? 'selected' : ''}>${e(r.display_name)} · ${e(r.email_address)}</option>`).join('') || '<option value="" disabled>No active sender identities</option>'}</select></label><label class="field">Recipient<input type="email" name="to" maxlength="254" required autocomplete="off" spellcheck="false" placeholder="you@example.com" ${!canSend ? 'disabled' : ''}></label><label class="field">Subject<input name="subject" maxlength="255" required value="Your neoMailer connection is ready" ${!canSend ? 'disabled' : ''}></label><label class="field">Plain text message<textarea name="text" maxlength="50000" required ${!canSend ? 'disabled' : ''}>Hello! This is a test message from your neoMailer workspace.</textarea></label><button class="button" ${!canSend ? 'disabled' : ''}>Send test email ${icon('arrow')}</button></form></div></section><section class="panel"><div class="panelbody"><h2>Before you send</h2><ul class="list"><li>Verify the sender domain with your delivery provider.</li><li>Configure a provider credential in Settings.</li><li>Use an inbox you control for your first test.</li><li>Inspect the result in Mail activity. “Sent” means accepted by the provider.</li><li>If the result is uncertain, reconcile with the provider before sending again.</li></ul></div></section></div>`;
}

export function security(rows, env) {
  const page = env?.page || 1;
  const pageSize = env?.pageSize || 10;
  const totalCount = env?.totalCount !== undefined ? env.totalCount : rows.length;
  const totalPages = env?.totalPages || Math.max(1, Math.ceil(totalCount / pageSize));
  const base = env?.base || '/dashboard';

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
        <form method="post" action="${base}/sessions/revoke">
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

export function inspector(mail, base = '/dashboard') {
  let attempts;
  try {
    attempts = JSON.stringify(JSON.parse(mail.attempt_history || '[]'), null, 2);
  } catch {
    attempts = 'No trace available';
  }
  return `<section class="panel"><div class="panelhead"><div><h2>${e(mail.subject)}</h2><p>${e(mail.id)}</p></div>${badge(mail.transmission_status)}</div><div class="panelbody"><dl>${[['From', mail.sender_address], ['To', mail.recipient_address], ['Provider', mail.provider_used], ['Provider ID', mail.provider_message_id || 'Not available'], ['Content hash', mail.html_hash], ['Delivery note', mail.error_message || 'No delivery error recorded']].map(([k, v]) => `<dt>${e(k)}</dt><dd>${e(v)}</dd>`).join('')}</dl><h3>Message preview</h3>${mail.html_body ? `<iframe title="Isolated email preview" sandbox="" referrerpolicy="no-referrer" src="${base}/preview?id=${e(mail.id)}"></iframe>` : empty('HTML content was not retained', 'Enable body retention only if required. Existing content cannot be recovered.')}<details><summary>Plain text / raw inbound message</summary><pre>${e(mail.text_body || 'Message body was not retained.')}</pre></details><details><summary>Provider attempts</summary><pre class="trace">${e(attempts)}</pre></details></div></section>`;
}

export function setup(origin, cfg) {
  const snippet = `// Server-side only. Never expose the API token in browser code.\nconst response = await fetch('${origin}/api/v1/send', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer ' + process.env.NEOMAILER_API_KEY,\n    'Content-Type': 'application/json',\n    'Idempotency-Key': 'welcome:' + user.id + ':v1'\n  },\n  body: JSON.stringify({\n    from: '${cfg.DEFAULT_SENDER}',\n    to: user.email,\n    subject: 'Welcome to your account',\n    text: 'Your account is ready.'\n  })\n});\nconst result = await response.json();\nif (!response.ok) throw new Error('Mail request failed');`;
  return `<div class="grid2"><section class="panel"><div class="panelhead"><h2>Connect your platform</h2></div><div class="panelbody"><ol class="list">${[['Deploy the Worker', 'Create Database, apply the schema and migration, configure secrets, and bind your chosen custom domain.'], ['Protect the console', 'Create a Cloudflare Access application for /admin and /admin/* with an explicit administrator allowlist and MFA. Configure team domain and audience in the Worker.'], ['Verify your sending domain', 'Copy provider-generated DNS records exactly. Enable one provider first, then verify fallback providers.'], ['Configure the workspace', 'Add a sender identity matching your verified domain, then save provider credentials and your separate API token in Settings.'], ['Connect your backend', 'Store NEOMAILER_URL and NEOMAILER_API_KEY in your application server environment. Send from authenticated backend flows only.'], ['Test and operate', 'Test acceptance, delivery webhooks, duplicate requests, invalid credentials, backups, and retention before launch.']].map(([title, desc], i) => `<li class="step"><span class="stepnum">${i + 1}</span><div><h3>${e(title)}</h3><p>${e(desc)}</p></div></li>`).join('')}</ol></div></section><section class="panel"><div class="panelhead"><h2>Backend request example</h2></div><div class="panelbody"><pre>${e(snippet)}</pre><div class="notice warn">Confirmed sender: your-sender@your-verified-domain.com. Verify this sending domain with each active provider before deployment.</div><p class="sub">Full deployment, security, API, recovery, and DNS instructions are included in the project’s docs directory.</p></div></section></div>`;
}

export function docsEditor(content, sess) {
  const base = sess?.base || '/dashboard';
  return `<section class="panel docs-studio-panel">
    <div class="panelhead" style="padding:12px 18px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;background:var(--surface);flex-shrink:0">
      <div style="display:flex;align-items:center;gap:12px">
        <span class="tag good" style="font-weight:700;font-size:11px;padding:3px 8px;display:inline-flex;align-items:center;gap:5px">${icon('code')} STUDIO</span>
        <div>
          <h2 style="font-size:15px;margin:0;font-weight:700">Documentation Content & Live Editor</h2>
          <p style="margin:0;font-size:11px;color:var(--muted)">Author and publish system documentation with live Blob preview and integrated neoCodebase data.</p>
        </div>
      </div>
      <div class="actions" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <!-- Preview Options & Mode Switcher -->
        <div class="studio-preview-options-container" style="display:inline-flex;align-items:center;gap:6px">
          <div class="studio-preview-segmented" role="group" aria-label="Editor preview mode">
            <button type="button" class="studio-seg-btn" id="top-btn-mode-edit" title="Editor only">${icon('code')} <span>Edit</span></button>
            <button type="button" class="studio-seg-btn active" id="top-btn-mode-split" title="Side-by-side Split View"><span>Split</span></button>
            <button type="button" class="studio-seg-btn" id="top-btn-mode-preview" title="Full Live Preview">${icon('eye')} <span>Preview</span></button>
          </div>
          <div style="position:relative">
            <button type="button" class="button secondary studio-action-btn" id="top-btn-preview-options" title="More preview options" style="padding:0 10px;width:38px;min-width:38px" aria-label="More preview options">
              <span style="font-size:11px;display:flex;align-items:center;justify-content:center">▾</span>
            </button>
            <div id="top-preview-menu" class="studio-popover-menu">
              <button type="button" class="studio-menu-item" id="menu-open-blob">${icon('external')} <span>Open Blob in new tab</span></button>
              <button type="button" class="studio-menu-item" id="menu-toggle-engine">${icon('refresh')} <span>Toggle Iframe / DOM</span></button>
              <button type="button" class="studio-menu-item" id="menu-copy-blob-url">${icon('copy')} <span>Copy Blob URL</span></button>
            </div>
          </div>
        </div>

        <!-- View -->
        <a class="button secondary studio-action-btn" href="/docs" target="_blank" title="View published documentation page">
          ${icon('external')} <span>View</span>
        </a>

        <!-- Publish -->
        <button class="button studio-action-btn" id="studio-save-top-btn" type="button" title="Publish documentation changes">
          ${icon('check')} <span>Publish</span>
        </button>
      </div>
    </div>

    <div class="docs-studio-body">
      <!-- LEFT SIDEBAR: Documentation Navigation Links -->
      <aside class="docs-studio-sidebar-left" style="border-right:1px solid var(--line);display:flex;flex-direction:column;min-height:0;background:var(--surface);overflow-y:auto">
        <div class="docs-studio-header-bar" style="padding:0 14px;justify-content:space-between">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted)">Docs Structure</span>
          <span class="tag" style="font-size:10px;padding:2px 6px">10 topics</span>
        </div>
        <div class="docs-nav-links" style="padding:8px;display:flex;flex-direction:column;gap:3px">
          <button type="button" class="studio-nav-item active" data-title="Getting Started" data-snippet="## Getting Started\n\nWelcome to neoMailer. Private transactional email infrastructure.">
            ${icon('zap')} <span>Getting Started</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="Quickstart & Setup" data-snippet="## Quickstart & Setup\n\nConnect your application backend using the official SDK or REST API.">
            ${icon('play')} <span>Quickstart & Setup</span>
          </button>
          <button type="button" class="studio-nav-item" data-title="Sending Domains & DNS" data-snippet="## Sending Domains & DNS Verification\n\nAdd TXT verification record:\n- Name: \`_neomailer-verification.yourdomain.com\`\n- Value: \`your_verification_token\`">
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
          <button type="button" class="studio-nav-item" data-title="Zero-Trust Security" data-snippet="## Zero-Trust Security\n\nAccount-isolated provider credentials are encrypted at rest with AES-256-GCM in Database.">
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
        <form id="docs-editor-form" method="post" action="${base}/docs/save" style="display:flex;flex-direction:column;flex:1;min-height:0;margin:0">
          ${hidden(sess.csrf_token)}
          <div class="rich-editor-container" style="display:flex;flex-direction:column;flex:1;min-height:0;margin:0;border:0;border-radius:0">
            <!-- EXTENDED TOOLBAR WITH MODERN FEATURES -->
            <div class="rich-editor-toolbar docs-studio-header-bar" role="toolbar" aria-label="Editor toolbar">
              <!-- History -->
              <div class="editor-btn-group" title="History">
                <button type="button" class="editor-btn" data-action="undo" title="Undo (Ctrl+Z)">↶</button>
                <button type="button" class="editor-btn" data-action="redo" title="Redo (Ctrl+Y)">↷</button>
              </div>

              <!-- Headings & Paragraph -->
              <div class="editor-btn-group" title="Headings & Typography">
                <button type="button" class="editor-btn" data-action="h1" title="Heading 1 (#)">H1</button>
                <button type="button" class="editor-btn" data-action="h2" title="Heading 2 (##)">H2</button>
                <button type="button" class="editor-btn" data-action="h3" title="Heading 3 (###)">H3</button>
                <button type="button" class="editor-btn" data-action="h4" title="Heading 4 (####)">H4</button>
                <button type="button" class="editor-btn" data-action="p" title="Paragraph / Normal Text">P</button>
              </div>

              <!-- Inline Styles -->
              <div class="editor-btn-group" title="Text Styles">
                <button type="button" class="editor-btn" data-action="bold" title="Bold (Ctrl+B)">${icon('bold')}</button>
                <button type="button" class="editor-btn" data-action="italic" title="Italic (Ctrl+I)">${icon('italic')}</button>
                <button type="button" class="editor-btn" data-action="underline" title="Underline (Ctrl+U)"><u>U</u></button>
                <button type="button" class="editor-btn" data-action="strike" title="Strikethrough (~~)">~S~</button>
                <button type="button" class="editor-btn" data-action="highlight" title="Highlight (==text==)"><mark style="background:#fef08a;padding:0 2px;border-radius:2px;color:#854d0e">hl</mark></button>
                <button type="button" class="editor-btn" data-action="sub" title="Subscript (X₂)">X₂</button>
                <button type="button" class="editor-btn" data-action="sup" title="Superscript (X²)">X²</button>
                <button type="button" class="editor-btn" data-action="code" title="Inline code (\`)">${icon('code')}</button>
                <button type="button" class="editor-btn" data-action="kbd" title="Keyboard shortcut badge (&lt;kbd&gt;)">kbd</button>
              </div>

              <!-- Callouts / Admonitions -->
              <div class="editor-btn-group" title="Callouts & Quotes">
                <button type="button" class="editor-btn" data-action="callout-note" title="Note Callout (&gt; [!NOTE])">[!NOTE]</button>
                <button type="button" class="editor-btn" data-action="callout-tip" title="Tip Callout (&gt; [!TIP])">[!TIP]</button>
                <button type="button" class="editor-btn" data-action="callout-warn" title="Warning Callout (&gt; [!WARNING])">[!WARN]</button>
                <button type="button" class="editor-btn" data-action="callout-caution" title="Caution / Danger Callout (&gt; [!CAUTION])">[!DANGER]</button>
                <button type="button" class="editor-btn" data-action="quote" title="Blockquote (&gt;)">${icon('quote')}</button>
              </div>

              <!-- Lists & Indent -->
              <div class="editor-btn-group" title="Lists & Indent">
                <button type="button" class="editor-btn" data-action="bullet" title="Bullet list (-)">${icon('list')}</button>
                <button type="button" class="editor-btn" data-action="number" title="Numbered list (1.)">1.</button>
                <button type="button" class="editor-btn" data-action="task" title="Task checklist (- [ ])">[✓]</button>
                <button type="button" class="editor-btn" data-action="indent" title="Indent list (Tab)">⇥</button>
                <button type="button" class="editor-btn" data-action="outdent" title="Outdent list (Shift+Tab)">⇤</button>
              </div>

              <!-- Media, Blocks, Tables & Dividers -->
              <div class="editor-btn-group" title="Media & Layout">
                <button type="button" class="editor-btn" data-action="link" title="Insert link (Ctrl+K)">${icon('link')}</button>
                <button type="button" class="editor-btn" data-action="image" title="Insert markdown image">${icon('image')}</button>
                <button type="button" class="editor-btn" id="btn-upload-image-asset" title="Upload local image & show Blob preview URL">${icon('upload')} Asset</button>
                <button type="button" class="editor-btn" data-action="table" title="Insert table template">⊞ Table</button>
                <button type="button" class="editor-btn" data-action="codeblock" title="Code block (\`\`\`)">&lt;/&gt;</button>
                <button type="button" class="editor-btn" data-action="mermaid" title="Mermaid Architecture Diagram">☊ Diagram</button>
                <button type="button" class="editor-btn" data-action="details" title="Collapsible Spoiler Section (&lt;details&gt;)">▼ Spoiler</button>
                <button type="button" class="editor-btn" data-action="math" title="Math Formula ($$)">∑ Math</button>
                <button type="button" class="editor-btn" data-action="hr" title="Divider (---)">—</button>
              </div>

              <!-- Utilities: Find/Replace, Format, Export, Import, Help -->
              <div class="editor-btn-group" title="Editor Tools">
                <button type="button" class="editor-btn" id="btn-toggle-find" title="Find & Replace (Ctrl+F)">${icon('search')}</button>
                <button type="button" class="editor-btn" data-action="clear-fmt" title="Clear Formatting from selection">Tx</button>
                <button type="button" class="editor-btn" data-action="case-cycle" title="Toggle Case (Upper/Lower/Title)">aA</button>
                <button type="button" class="editor-btn" id="btn-export-md" title="Download Markdown file (.md)">⬇ .md</button>
                <button type="button" class="editor-btn" id="btn-import-md" title="Import local .md file">⬆ Open</button>
                <button type="button" class="editor-btn" id="btn-copy-markdown" title="Copy Raw Markdown">${icon('copy')} MD</button>
                <button type="button" class="editor-btn" id="btn-copy-html" title="Copy Rendered HTML">${icon('code')} HTML</button>
                <button type="button" class="editor-btn" id="btn-toggle-fullscreen" title="Toggle Zen Fullscreen Mode">⛶</button>
                <button type="button" class="editor-btn" id="btn-toggle-cheatsheet" title="Markdown Quick Reference">?</button>
              </div>

              <!-- Hidden input for file import -->
              <input type="file" id="import-md-file-input" accept=".md,.markdown,.txt" style="display:none">

              <!-- View Modes: Edit / Split View / Preview -->
              <div class="editor-btn-group" style="margin-left:auto" title="View Mode">
                <button type="button" id="mode-edit-btn" class="editor-btn" title="Editor only">Edit</button>
                <button type="button" id="mode-split-btn" class="editor-btn active" title="Side-by-side Split View">Split View</button>
                <button type="button" id="mode-preview-btn" class="editor-btn" title="Preview with Live Blob URL">${icon('eye')} Preview</button>
                <button type="button" id="editor-toggle-preview" class="editor-btn" style="display:none" title="Toggle Slide-out Preview">${icon('eye')} <span>Preview Drawer</span></button>
              </div>
            </div>

            <!-- COLLAPSIBLE SEARCH & REPLACE BAR -->
            <div id="editor-search-replace-bar" style="display:none;padding:8px 14px;background:var(--surface-hover);border-bottom:1px solid var(--line);align-items:center;gap:10px;flex-wrap:wrap">
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:11px;font-weight:600;color:var(--muted)">Find:</span>
                <input type="text" id="find-input" placeholder="Search in text..." style="padding:4px 8px;font-size:12px;border:1px solid var(--line);border-radius:4px;background:var(--surface);color:var(--text);width:160px">
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:11px;font-weight:600;color:var(--muted)">Replace:</span>
                <input type="text" id="replace-input" placeholder="Replace with..." style="padding:4px 8px;font-size:12px;border:1px solid var(--line);border-radius:4px;background:var(--surface);color:var(--text);width:160px">
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <button type="button" id="btn-find-next" class="button secondary small" style="padding:3px 8px;font-size:11px">Next</button>
                <button type="button" id="btn-replace-one" class="button secondary small" style="padding:3px 8px;font-size:11px">Replace</button>
                <button type="button" id="btn-replace-all" class="button secondary small" style="padding:3px 8px;font-size:11px">Replace All</button>
                <span id="find-count-pill" class="tag" style="font-size:10px;padding:2px 6px">0 matches</span>
              </div>
              <button type="button" id="btn-close-find" class="button secondary small iconb" style="margin-left:auto;padding:3px 6px" title="Close search">${icon('close')}</button>
            </div>

            <!-- COLLAPSIBLE MARKDOWN CHEATSHEET REFERENCE -->
            <div id="editor-cheatsheet-bar" style="display:none;padding:12px 16px;background:var(--surface-hover);border-bottom:1px solid var(--line);font-size:12px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <strong style="color:var(--accent)">Markdown Quick Reference</strong>
                <button type="button" id="btn-close-cheatsheet" class="button secondary small iconb" style="padding:2px 6px">${icon('close')}</button>
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;font-family:var(--mono);font-size:11px">
                <div><code># Heading 1</code><br><code>## Heading 2</code><br><code>### Heading 3</code></div>
                <div><code>**bold text**</code><br><code>*italic text*</code><br><code>~~strikethrough~~</code></div>
                <div><code>&gt; [!NOTE] Alert</code><br><code>&gt; [!TIP] ProTip</code><br><code>&gt; [!WARNING] Warning</code></div>
                <div><code>- [ ] Task checkbox</code><br><code>\`\`\`javascript\ncode\n\`\`\`</code><br><code>| A | B |\n| - | - |</code></div>
              </div>
            </div>

            <!-- ASSET FILE UPLOAD INPUT (HIDDEN) -->
            <input type="file" id="editor-image-file-input" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" style="display:none">

            <!-- FULL-HEIGHT EDITOR WORKSPACE (DEFAULT SPLIT-VIEW WITH LIVE BLOB PREVIEW) -->
            <div id="editor-workspace" class="editor-workspace split-view" style="flex:1;min-height:0;position:relative;height:100%">
              <textarea id="docs-editor-textarea" name="content" class="editor-textarea" maxlength="50000" placeholder="Write documentation here in Markdown or plain text..." style="flex:1;height:100%;min-height:0;resize:none;padding:18px 24px;font-family:var(--mono);font-size:13px;line-height:1.65;border:0;outline:none;background:var(--surface);color:var(--text);box-sizing:border-box">${e(content)}</textarea>

              <!-- LIVE PREVIEW CONTAINER WITH DEDICATED BLOB URL BAR -->
              <div id="docs-editor-preview" class="editor-preview" style="flex:1;height:100%;background:var(--bg);display:flex;flex-direction:column;min-height:0;box-sizing:border-box" aria-live="polite">
                <!-- LIVE BLOB PREVIEW URL BAR -->
                <div id="blob-preview-bar" class="blob-preview-bar">
                  <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1">
                    <span class="tag good" style="font-size:10px;font-weight:700;padding:2px 6px;display:inline-flex;align-items:center;gap:4px">
                      ${icon('zap')} LIVE BLOB PREVIEW
                    </span>
                    <code id="blob-preview-url-text" title="Click to copy live blob URL">generating blob…</code>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px">
                    <button type="button" id="copy-blob-btn" class="button secondary small" style="padding:3px 8px;font-size:11px" title="Copy live blob preview URL">
                      ${icon('copy')} <span>Copy Blob URL</span>
                    </button>
                    <a id="open-blob-link" href="#" target="_blank" class="button secondary small" style="padding:3px 8px;font-size:11px" title="Open blob preview in standalone tab">
                      ${icon('external')} <span>Open Tab ↗</span>
                    </a>
                    <button type="button" id="toggle-iframe-view-btn" class="button secondary small" style="padding:3px 8px;font-size:11px" title="Toggle between inline DOM and sandboxed iframe view">
                      ${icon('eye')} <span>Iframe View</span>
                    </button>
                    <button type="button" id="close-preview-btn" class="button secondary small iconb" style="padding:3px 6px" title="Close Preview">${icon('close')}</button>
                  </div>
                </div>

                <!-- PREVIEW CONTENT AREA -->
                <div id="docs-preview-content" class="docs-preview-body" style="flex:1;overflow-y:auto;padding:20px 24px"></div>
                <iframe id="blob-preview-iframe" title="Standalone blob preview" sandbox="allow-scripts allow-same-origin" style="display:none;width:100%;height:100%;border:0;flex:1;background:var(--surface)"></iframe>
              </div>
            </div>

            <!-- STATUS BAR -->
            <div class="editor-statusbar" style="padding:10px 18px;border-top:1px solid var(--line);background:var(--surface-hover);display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
              <span id="editor-counter">0 words · 0 / 50,000 characters</span>
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
        <div class="docs-studio-header-bar" style="padding:0 14px;justify-content:space-between">
          <div>
            <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);display:block;line-height:1.2">Projects & Data</span>
            <span style="font-size:10px;color:var(--muted);line-height:1.2">neoCodebase Workspace</span>
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
      var workspace = document.getElementById('editor-workspace');
      var preview = document.getElementById('docs-editor-preview');
      var previewContent = document.getElementById('docs-preview-content');
      var previewIframe = document.getElementById('blob-preview-iframe');
      var counter = document.getElementById('editor-counter');
      var toggleBtn = document.getElementById('editor-toggle-preview');
      var closePreviewBtn = document.getElementById('close-preview-btn');
      var saveTopBtn = document.getElementById('studio-save-top-btn');
      var form = document.getElementById('docs-editor-form');

      var blobUrlText = document.getElementById('blob-preview-url-text');
      var copyBlobBtn = document.getElementById('copy-blob-btn');
      var openBlobLink = document.getElementById('open-blob-link');
      var toggleIframeBtn = document.getElementById('toggle-iframe-view-btn');
      var currentBlobUrl = null;
      var isIframeMode = false;

      // View mode buttons
      var modeEditBtn = document.getElementById('mode-edit-btn');
      var modeSplitBtn = document.getElementById('mode-split-btn');
      var modePreviewBtn = document.getElementById('mode-preview-btn');

      // Search & Replace
      var findBar = document.getElementById('editor-search-replace-bar');
      var btnToggleFind = document.getElementById('btn-toggle-find');
      var btnCloseFind = document.getElementById('btn-close-find');
      var findInput = document.getElementById('find-input');
      var replaceInput = document.getElementById('replace-input');
      var btnFindNext = document.getElementById('btn-find-next');
      var btnReplaceOne = document.getElementById('btn-replace-one');
      var btnReplaceAll = document.getElementById('btn-replace-all');
      var findCountPill = document.getElementById('find-count-pill');

      // Cheatsheet
      var cheatsheetBar = document.getElementById('editor-cheatsheet-bar');
      var btnToggleCheatsheet = document.getElementById('btn-toggle-cheatsheet');
      var btnCloseCheatsheet = document.getElementById('btn-close-cheatsheet');

      // Utility copy buttons
      var btnCopyMd = document.getElementById('btn-copy-markdown');
      var btnCopyHtml = document.getElementById('btn-copy-html');

      // Asset upload
      var uploadAssetBtn = document.getElementById('btn-upload-image-asset');
      var assetFileInput = document.getElementById('editor-image-file-input');

      // Markdown file export & import & fullscreen
      var btnExportMd = document.getElementById('btn-export-md');
      var btnImportMd = document.getElementById('btn-import-md');
      var importFileInput = document.getElementById('import-md-file-input');
      var btnFullscreen = document.getElementById('btn-toggle-fullscreen');
      var studioPanel = document.querySelector('.docs-studio-panel');

      if (!ta) return;

      if (saveTopBtn && form) {
        saveTopBtn.addEventListener('click', function() { form.submit(); });
      }

      function setViewMode(mode) {
        if (!workspace) return;
        workspace.classList.remove('split-view', 'preview-mode', 'edit-mode');
        document.querySelectorAll('.studio-seg-btn').forEach(function(b) { b.classList.remove('active'); });
        if (modeEditBtn) modeEditBtn.classList.remove('active');
        if (modeSplitBtn) modeSplitBtn.classList.remove('active');
        if (modePreviewBtn) modePreviewBtn.classList.remove('active');

        var topEdit = document.getElementById('top-btn-mode-edit');
        var topSplit = document.getElementById('top-btn-mode-split');
        var topPreview = document.getElementById('top-btn-mode-preview');

        if (mode === 'edit') {
          workspace.classList.add('edit-mode');
          if (modeEditBtn) modeEditBtn.classList.add('active');
          if (topEdit) topEdit.classList.add('active');
          if (preview) preview.style.display = 'none';
        } else if (mode === 'preview') {
          workspace.classList.add('preview-mode');
          if (modePreviewBtn) modePreviewBtn.classList.add('active');
          if (topPreview) topPreview.classList.add('active');
          if (preview) preview.style.display = 'flex';
        } else {
          workspace.classList.add('split-view');
          if (modeSplitBtn) modeSplitBtn.classList.add('active');
          if (topSplit) topSplit.classList.add('active');
          if (preview) preview.style.display = 'flex';
        }
        update();
      }

      if (modeEditBtn) modeEditBtn.addEventListener('click', function() { setViewMode('edit'); });
      if (modeSplitBtn) modeSplitBtn.addEventListener('click', function() { setViewMode('split'); });
      if (modePreviewBtn) modePreviewBtn.addEventListener('click', function() { setViewMode('preview'); });

      var topEdit = document.getElementById('top-btn-mode-edit');
      var topSplit = document.getElementById('top-btn-mode-split');
      var topPreview = document.getElementById('top-btn-mode-preview');
      if (topEdit) topEdit.addEventListener('click', function() { setViewMode('edit'); });
      if (topSplit) topSplit.addEventListener('click', function() { setViewMode('split'); });
      if (topPreview) topPreview.addEventListener('click', function() { setViewMode('preview'); });

      var topPreviewMenuBtn = document.getElementById('top-btn-preview-options');
      var topPreviewMenu = document.getElementById('top-preview-menu');
      if (topPreviewMenuBtn && topPreviewMenu) {
        topPreviewMenuBtn.addEventListener('click', function(ev) {
          ev.stopPropagation();
          var isOpen = topPreviewMenu.style.display === 'block';
          topPreviewMenu.style.display = isOpen ? 'none' : 'block';
        });
        document.addEventListener('click', function(ev) {
          if (!topPreviewMenu.contains(ev.target) && ev.target !== topPreviewMenuBtn) {
            topPreviewMenu.style.display = 'none';
          }
        });
      }

      var menuOpenBlob = document.getElementById('menu-open-blob');
      if (menuOpenBlob) {
        menuOpenBlob.addEventListener('click', function() {
          if (currentBlobUrl) window.open(currentBlobUrl, '_blank');
          if (topPreviewMenu) topPreviewMenu.style.display = 'none';
        });
      }

      var menuToggleEngine = document.getElementById('menu-toggle-engine');
      if (menuToggleEngine && toggleIframeBtn) {
        menuToggleEngine.addEventListener('click', function() {
          toggleIframeBtn.click();
          if (topPreviewMenu) topPreviewMenu.style.display = 'none';
        });
      }

      var menuCopyBlobUrl = document.getElementById('menu-copy-blob-url');
      if (menuCopyBlobUrl && copyBlobBtn) {
        menuCopyBlobUrl.addEventListener('click', function() {
          copyBlobBtn.click();
          if (topPreviewMenu) topPreviewMenu.style.display = 'none';
        });
      }

      function renderMarkdown(md) {
        if (!md) return '<p class="muted">No content to preview.</p>';
        var text = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var blocks = text.split(/\\n\\n+/);
        var html = '';
        for (var i = 0; i < blocks.length; i++) {
          var b = blocks[i].trim();
          if (!b) continue;
          if (b.startsWith('#### ')) {
            html += '<h4 style="margin:16px 0 8px;font-size:14px;color:var(--text);font-weight:700">' + inlineFmt(b.slice(5)) + '</h4>';
          } else if (b.startsWith('### ')) {
            html += '<h3 style="margin:18px 0 8px;font-size:16px;color:var(--text);font-weight:700">' + inlineFmt(b.slice(4)) + '</h3>';
          } else if (b.startsWith('## ')) {
            html += '<h2 style="margin:22px 0 10px;font-size:18px;color:var(--text);border-bottom:1px solid var(--line);padding-bottom:6px;font-weight:700">' + inlineFmt(b.slice(3)) + '</h2>';
          } else if (b.startsWith('# ')) {
            html += '<h1 style="margin:24px 0 12px;font-size:24px;color:var(--accent);font-weight:800;letter-spacing:-0.03em">' + inlineFmt(b.slice(2)) + '</h1>';
          } else if (b.startsWith('&gt; [!NOTE]') || b.startsWith('&gt; [!TIP]') || b.startsWith('&gt; [!WARNING]') || b.startsWith('&gt; [!IMPORTANT]') || b.startsWith('&gt; [!CAUTION]')) {
            var type = b.includes('[!TIP]') ? 'tip' : (b.includes('[!WARNING]') || b.includes('[!CAUTION]')) ? 'warning' : b.includes('[!IMPORTANT]') ? 'important' : 'note';
            var lines = b.split('\\n').map(function(l) { return l.replace(/^&gt;\\s?(\\[!.*?\\])?/, '').trim(); }).filter(Boolean);
            html += '<div class="docs-callout callout-' + type + '"><div class="callout-header"><strong>' + type.toUpperCase() + '</strong></div><div class="callout-body">' + inlineFmt(lines.join(' ')) + '</div></div>';
          } else if (b.startsWith('> ')) {
            var q = b.split('\\n').map(function(l) { return l.replace(/^>\\s?/, ''); }).join('\\n');
            html += '<blockquote style="border-left:3px solid var(--accent);padding-left:12px;margin:12px 0;color:var(--muted);font-style:italic">' + inlineFmt(q.replace(/\\n/g, '<br>')) + '</blockquote>';
          } else if (b.startsWith('\x60\x60\x60mermaid')) {
            var mLines = b.split('\\n');
            var mCode = mLines.slice(1, mLines[mLines.length - 1].startsWith('\x60\x60\x60') ? -1 : undefined).join('\\n');
            html += '<div class="docs-diagram-card"><div class="diagram-header"><span>☊ MERMAID DIAGRAM</span></div><div class="diagram-body"><pre class="mermaid">' + mCode + '</pre></div></div>';
          } else if (b.startsWith('\x60\x60\x60')) {
            var cLines = b.split('\\n');
            var lang = (cLines[0].replace(/^\x60\x60\x60/, '').trim()) || 'CODE';
            var code = cLines.slice(1, cLines[cLines.length - 1].startsWith('\x60\x60\x60') ? -1 : undefined).join('\\n');
            html += '<div class="docs-code-card"><div class="code-header"><span class="code-lang">' + lang.toUpperCase() + '</span><button type="button" class="btn-copy-code" data-code="' + encodeURIComponent(code) + '">Copy</button></div><pre><code>' + code + '</code></pre></div>';
          } else if (b.includes('|') && b.split('\\n').length >= 2 && b.split('\\n')[1].includes('---')) {
            var tLines = b.split('\\n').map(function(l) { return l.trim(); }).filter(Boolean);
            var headers = tLines[0].split('|').map(function(c) { return c.trim(); }).filter(Boolean);
            var rows = tLines.slice(2).map(function(l) { return l.split('|').map(function(c) { return c.trim(); }).filter(Boolean); });
            var tHtml = '<div class="table-container"><table><thead><tr>';
            headers.forEach(function(h) { tHtml += '<th>' + inlineFmt(h) + '</th>'; });
            tHtml += '</tr></thead><tbody>';
            rows.forEach(function(r) {
              tHtml += '<tr>';
              r.forEach(function(cell) { tHtml += '<td>' + inlineFmt(cell) + '</td>'; });
              tHtml += '</tr>';
            });
            tHtml += '</tbody></table></div>';
            html += tHtml;
          } else if (b.startsWith('- ') || b.startsWith('* ')) {
            var items = b.split('\\n').map(function(l) { return l.replace(/^[-*]\\s+/, ''); });
            html += '<ul style="padding-left:20px;margin:8px 0">' + items.map(function(item) {
              if (item.startsWith('[x] ') || item.startsWith('[X] ')) {
                return '<li class="task-item checked"><input type="checkbox" checked disabled> ' + inlineFmt(item.slice(4)) + '</li>';
              }
              if (item.startsWith('[ ] ')) {
                return '<li class="task-item"><input type="checkbox" disabled> ' + inlineFmt(item.slice(4)) + '</li>';
              }
              return '<li style="margin:4px 0">' + inlineFmt(item) + '</li>';
            }).join('') + '</ul>';
          } else if (/^\\d+\\.\\s/.test(b)) {
            var numItems = b.split('\\n').map(function(l) { return l.replace(/^\\d+\\.\\s+/, ''); });
            html += '<ol style="padding-left:20px;margin:8px 0">' + numItems.map(function(item) { return '<li style="margin:4px 0">' + inlineFmt(item) + '</li>'; }).join('') + '</ol>';
          } else if (b.startsWith('$$') && b.endsWith('$$')) {
            var formula = b.slice(2, -2).trim();
            html += '<div class="docs-math-block"><code>$$ ' + formula + ' $$</code></div>';
          } else if (b.includes('&lt;details&gt;') || b.includes('<details>')) {
            var sumMatch = b.match(/&lt;summary&gt;(.*?)&lt;\/summary&gt;/) || b.match(/<summary>(.*?)<\/summary>/);
            var sumText = sumMatch ? sumMatch[1] : 'Click to expand';
            var bodyText = b
              .replace(/&lt;details&gt;|<details>/gi, '')
              .replace(/&lt;\/details&gt;|<\/details>/gi, '')
              .replace(/&lt;summary&gt;.*?&lt;\/summary&gt;|<summary>.*?<\/summary>/gi, '')
              .trim();
            html += '<details class="docs-accordion" open><summary>' + inlineFmt(sumText) + '</summary><div class="accordion-content">' + inlineFmt(bodyText.replace(/\\n/g, '<br>')) + '</div></details>';
          } else if (b === '---' || b === '***') {
            html += '<hr style="border:0;border-top:1px solid var(--line);margin:16px 0;">';
          } else {
            html += '<p style="margin:8px 0;line-height:1.65">' + inlineFmt(b.replace(/\\n/g, '<br>')) + '</p>';
          }
        }
        return html;
      }

      function inlineFmt(str) {
        return str
          .replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<img src="$2" alt="$1" class="docs-inline-img">')
          .replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline">$1</a>')
          .replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>')
          .replace(/\\*([^*]+)\\*/g, '<em>$1</em>')
          .replace(/~~([^~]+)~~/g, '<del>$1</del>')
          .replace(/==([^=]+)==/g, '<mark class="docs-highlight">$1</mark>')
          .replace(/&lt;mark&gt;(.*?)&lt;\\/mark&gt;/gi, '<mark class="docs-highlight">$1</mark>')
          .replace(/&lt;u&gt;(.*?)&lt;\\/u&gt;/gi, '<u>$1</u>')
          .replace(/&lt;kbd&gt;(.*?)&lt;\\/kbd&gt;/gi, '<kbd class="docs-kbd">$1</kbd>')
          .replace(/&lt;sub&gt;(.*?)&lt;\\/sub&gt;/gi, '<sub>$1</sub>')
          .replace(/&lt;sup&gt;(.*?)&lt;\\/sup&gt;/gi, '<sup>$1</sup>')
          .replace(/\x60([^\x60]+)\x60/g, '<code style="background:var(--surface-hover);padding:2px 6px;border-radius:4px;border:1px solid var(--line);font-family:var(--mono);font-size:12px">$1</code>');
      }

      function updateBlobPreview(rendered) {
        if (typeof Blob === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) return;
        var fullHtml = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>neoMail Live Docs Preview</title><style>body{font-family:system-ui,-apple-system,sans-serif;background:#0c100e;color:#f0ede6;padding:24px 32px;line-height:1.65;max-width:880px;margin:0 auto}h1,h2,h3{color:#10b981}code,pre{font-family:monospace}pre{background:#151c19;padding:12px;border-radius:8px;border:1px solid #23302a;color:#34d399}blockquote{border-left:3px solid #10b981;padding-left:12px;margin:12px 0;color:#84968d}table{border-collapse:collapse;width:100%;margin:16px 0}th,td{border:1px solid #202c25;padding:8px 12px;text-align:left}th{background:#18221d}a{color:#10b981}</style></head><body>' + rendered + '</body></html>';
        if (currentBlobUrl) {
          try { URL.revokeObjectURL(currentBlobUrl); } catch(e) {}
        }
        var docBlob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        currentBlobUrl = URL.createObjectURL(docBlob);

        if (blobUrlText) {
          blobUrlText.textContent = currentBlobUrl;
          blobUrlText.title = 'Click to copy: ' + currentBlobUrl;
        }
        if (openBlobLink) {
          openBlobLink.href = currentBlobUrl;
        }
        if (previewIframe && isIframeMode) {
          previewIframe.src = currentBlobUrl;
        }
      }

      function update() {
        var val = ta.value;
        var rendered = renderMarkdown(val);
        if (previewContent) previewContent.innerHTML = rendered;
        else if (preview) preview.innerHTML = rendered;

        updateBlobPreview(rendered);

        // Attach copy button handlers on code cards
        if (previewContent) {
          previewContent.querySelectorAll('.btn-copy-code').forEach(function(btn) {
            btn.addEventListener('click', function() {
              var code = decodeURIComponent(btn.getAttribute('data-code') || '');
              if (navigator && navigator.clipboard) {
                navigator.clipboard.writeText(code).then(function() {
                  btn.textContent = 'Copied!';
                  setTimeout(function() { btn.textContent = 'Copy'; }, 1500);
                });
              }
            });
          });
        }

        if (counter) {
          var trimmed = val.trim();
          var words = trimmed ? trimmed.split(/\\s+/).length : 0;
          var lines = val ? val.split('\\n').length : 0;
          var readTime = Math.ceil(words / 200) || 1;
          counter.textContent = words.toLocaleString() + ' words · ' + lines.toLocaleString() + ' lines · ~' + readTime + ' min read · ' + val.length.toLocaleString() + ' / 50,000 chars';
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

      // Wire Copy Blob Button
      if (copyBlobBtn) {
        copyBlobBtn.addEventListener('click', function() {
          if (!currentBlobUrl) return;
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(currentBlobUrl).then(function() {
              copyBlobBtn.innerHTML = '${icon('check')} <span>Copied!</span>';
              setTimeout(function() {
                copyBlobBtn.innerHTML = '${icon('copy')} <span>Copy Blob URL</span>';
              }, 1800);
            });
          }
        });
      }
      if (blobUrlText) {
        blobUrlText.addEventListener('click', function() {
          if (copyBlobBtn) copyBlobBtn.click();
        });
      }

      // Toggle Iframe vs Inline DOM preview
      if (toggleIframeBtn && previewIframe && previewContent) {
        toggleIframeBtn.addEventListener('click', function() {
          isIframeMode = !isIframeMode;
          if (isIframeMode) {
            previewContent.style.display = 'none';
            previewIframe.style.display = 'block';
            if (currentBlobUrl) previewIframe.src = currentBlobUrl;
            toggleIframeBtn.innerHTML = '${icon('code')} <span>DOM View</span>';
          } else {
            previewIframe.style.display = 'none';
            previewContent.style.display = 'block';
            toggleIframeBtn.innerHTML = '${icon('eye')} <span>Iframe View</span>';
          }
        });
      }

      // Image Asset Upload with Local Blob URL
      if (uploadAssetBtn && assetFileInput) {
        uploadAssetBtn.addEventListener('click', function() {
          assetFileInput.click();
        });
        assetFileInput.addEventListener('change', function() {
          if (!assetFileInput.files || !assetFileInput.files[0]) return;
          var file = assetFileInput.files[0];
          if (typeof URL !== 'undefined' && URL.createObjectURL) {
            var imgBlobUrl = URL.createObjectURL(file);
            insert('![Image: ' + file.name + '](' + imgBlobUrl + ')\\n', '');
            if (blobUrlText) {
              blobUrlText.textContent = imgBlobUrl;
              blobUrlText.title = 'Asset Blob URL: ' + imgBlobUrl;
            }
          }
        });
      }

      // Toolbar Buttons Actions
      document.querySelectorAll('.rich-editor-toolbar button[data-action]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var action = btn.getAttribute('data-action');
          if (action === 'undo') {
            try { document.execCommand('undo'); } catch(err){}
            update();
          } else if (action === 'redo') {
            try { document.execCommand('redo'); } catch(err){}
            update();
          } else if (action === 'h1') insert('# ', '\\n');
          else if (action === 'h2') insert('## ', '\\n');
          else if (action === 'h3') insert('### ', '\\n');
          else if (action === 'h4') insert('#### ', '\\n');
          else if (action === 'p') {
            var s = ta.selectionStart;
            var e = ta.selectionEnd;
            var text = ta.value;
            var startLine = text.lastIndexOf('\\n', s - 1) + 1;
            var endLine = text.indexOf('\\n', e);
            if (endLine === -1) endLine = text.length;
            var block = text.substring(startLine, endLine);
            var clean = block.replace(/^(#{1,6}\\s+|[-*]\\s+|\\d+\\.\\s+|&gt;\\s*|>\\s*)/gm, '');
            ta.value = text.substring(0, startLine) + clean + text.substring(endLine);
            ta.setSelectionRange(startLine, startLine + clean.length);
            update();
          } else if (action === 'bold') insert('**', '**');
          else if (action === 'italic') insert('*', '*');
          else if (action === 'strike') insert('~~', '~~');
          else if (action === 'underline') insert('<u>', '</u>');
          else if (action === 'highlight') insert('==', '==');
          else if (action === 'sub') insert('<sub>', '</sub>');
          else if (action === 'sup') insert('<sup>', '</sup>');
          else if (action === 'code') insert('\x60', '\x60');
          else if (action === 'kbd') insert('<kbd>', '</kbd>');
          else if (action === 'quote') insert('> ', '\\n');
          else if (action === 'callout-note') insert('> [!NOTE]\\n> ', '\\n');
          else if (action === 'callout-tip') insert('> [!TIP]\\n> ', '\\n');
          else if (action === 'callout-warn') insert('> [!WARNING]\\n> ', '\\n');
          else if (action === 'callout-caution') insert('> [!CAUTION]\\n> ', '\\n');
          else if (action === 'bullet') insert('- ', '\\n');
          else if (action === 'number') insert('1. ', '\\n');
          else if (action === 'task') insert('- [ ] ', '\\n');
          else if (action === 'indent') {
            var s = ta.selectionStart;
            var e = ta.selectionEnd;
            var text = ta.value;
            var startLine = text.lastIndexOf('\\n', s - 1) + 1;
            var endLine = text.indexOf('\\n', e);
            if (endLine === -1) endLine = text.length;
            var lines = text.substring(startLine, endLine).split('\\n');
            var indented = lines.map(function(l) { return '  ' + l; }).join('\\n');
            ta.value = text.substring(0, startLine) + indented + text.substring(endLine);
            ta.setSelectionRange(startLine, startLine + indented.length);
            update();
          } else if (action === 'outdent') {
            var s = ta.selectionStart;
            var e = ta.selectionEnd;
            var text = ta.value;
            var startLine = text.lastIndexOf('\\n', s - 1) + 1;
            var endLine = text.indexOf('\\n', e);
            if (endLine === -1) endLine = text.length;
            var lines = text.substring(startLine, endLine).split('\\n');
            var outdented = lines.map(function(l) { return l.replace(/^ {1,2}/, ''); }).join('\\n');
            ta.value = text.substring(0, startLine) + outdented + text.substring(endLine);
            ta.setSelectionRange(startLine, startLine + outdented.length);
            update();
          } else if (action === 'link') insert('[link title](', ')');
          else if (action === 'image') insert('![image alt](', ')');
          else if (action === 'table') insert('\\n| Header 1 | Header 2 | Header 3 |\\n| -------- | -------- | -------- |\\n| Cell 1   | Cell 2   | Cell 3   |\\n', '');
          else if (action === 'codeblock') insert('\x60\x60\x60javascript\\n// Code example\\n', '\\n\x60\x60\x60\\n');
          else if (action === 'mermaid') insert('\\n\x60\x60\x60mermaid\\nflowchart TD\\n    A[Client API] --> B[neoMail Gateway]\\n    B --> C{Healthy Provider?}\\n    C -->|Primary| D[Resend API]\\n    C -->|Fallback| E[Brevo / SMTP Relay]\\n\x60\x60\x60\\n', '');
          else if (action === 'details') insert('\\n<details>\\n<summary>Click to view details</summary>\\n\\nEnter detailed content, code examples, or notes here...\\n</details>\\n', '');
          else if (action === 'math') insert('$$ ', ' $$');
          else if (action === 'hr') insert('\\n---\\n', '');
          else if (action === 'clear-fmt') {
            var s = ta.selectionStart;
            var e = ta.selectionEnd;
            var text = ta.value;
            var sel = text.substring(s, e);
            if (sel) {
              var clean = sel
                .replace(/\\*\\*([^*]+)\\*\\*/g, '$1')
                .replace(/\\*([^*]+)\\*/g, '$1')
                .replace(/~~([^~]+)~~/g, '$1')
                .replace(/==([^=]+)==/g, '$1')
                .replace(/\x60([^\x60]+)\x60/g, '$1')
                .replace(/<\\/?(u|sub|sup|kbd|mark|details|summary)>/gi, '');
              ta.value = text.substring(0, s) + clean + text.substring(e);
              ta.setSelectionRange(s, s + clean.length);
              update();
            }
          } else if (action === 'case-cycle') {
            var s = ta.selectionStart;
            var e = ta.selectionEnd;
            var text = ta.value;
            var sel = text.substring(s, e);
            if (sel) {
              var cycled;
              if (sel === sel.toUpperCase() && sel !== sel.toLowerCase()) {
                cycled = sel.toLowerCase().replace(/\\b\\w/g, function(c) { return c.toUpperCase(); });
              } else if (sel === sel.toLowerCase()) {
                cycled = sel.toUpperCase();
              } else {
                cycled = sel.toLowerCase();
              }
              ta.value = text.substring(0, s) + cycled + text.substring(e);
              ta.setSelectionRange(s, s + cycled.length);
              update();
            }
          }
        });
      });

      // Search & Replace Functionality
      if (btnToggleFind && findBar) {
        btnToggleFind.addEventListener('click', function() {
          var isHidden = findBar.style.display === 'none';
          findBar.style.display = isHidden ? 'flex' : 'none';
          btnToggleFind.classList.toggle('active', isHidden);
          if (isHidden && findInput) findInput.focus();
        });
      }
      if (btnCloseFind && findBar) {
        btnCloseFind.addEventListener('click', function() {
          findBar.style.display = 'none';
          if (btnToggleFind) btnToggleFind.classList.remove('active');
        });
      }

      function updateFindCount() {
        if (!findInput || !findCountPill) return;
        var query = findInput.value;
        if (!query) { findCountPill.textContent = '0 matches'; return; }
        var matches = ta.value.split(query).length - 1;
        findCountPill.textContent = matches + ' ' + (matches === 1 ? 'match' : 'matches');
      }

      if (findInput) {
        findInput.addEventListener('input', updateFindCount);
      }
      if (btnFindNext && findInput) {
        btnFindNext.addEventListener('click', function() {
          var q = findInput.value;
          if (!q) return;
          var text = ta.value;
          var curPos = ta.selectionEnd;
          var idx = text.indexOf(q, curPos);
          if (idx === -1) idx = text.indexOf(q, 0);
          if (idx !== -1) {
            ta.focus();
            ta.setSelectionRange(idx, idx + q.length);
          }
        });
      }
      if (btnReplaceOne && findInput && replaceInput) {
        btnReplaceOne.addEventListener('click', function() {
          var q = findInput.value;
          var rep = replaceInput.value;
          if (!q) return;
          var s = ta.selectionStart;
          var e = ta.selectionEnd;
          if (ta.value.substring(s, e) === q) {
            ta.value = ta.value.substring(0, s) + rep + ta.value.substring(e);
            ta.setSelectionRange(s + rep.length, s + rep.length);
            update();
            updateFindCount();
          } else {
            if (btnFindNext) btnFindNext.click();
          }
        });
      }
      if (btnReplaceAll && findInput && replaceInput) {
        btnReplaceAll.addEventListener('click', function() {
          var q = findInput.value;
          var rep = replaceInput.value;
          if (!q) return;
          var count = ta.value.split(q).length - 1;
          ta.value = ta.value.split(q).join(rep);
          update();
          updateFindCount();
          alert('Replaced ' + count + ' occurrences.');
        });
      }

      // Cheatsheet Toggle
      if (btnToggleCheatsheet && cheatsheetBar) {
        btnToggleCheatsheet.addEventListener('click', function() {
          var isHidden = cheatsheetBar.style.display === 'none';
          cheatsheetBar.style.display = isHidden ? 'block' : 'none';
          btnToggleCheatsheet.classList.toggle('active', isHidden);
        });
      }
      if (btnCloseCheatsheet && cheatsheetBar) {
        btnCloseCheatsheet.addEventListener('click', function() {
          cheatsheetBar.style.display = 'none';
          if (btnToggleCheatsheet) btnToggleCheatsheet.classList.remove('active');
        });
      }

      // Copy Markdown & HTML
      if (btnCopyMd) {
        btnCopyMd.addEventListener('click', function() {
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(ta.value).then(function() {
              btnCopyMd.textContent = 'Copied!';
              setTimeout(function() { btnCopyMd.innerHTML = '${icon('copy')} MD'; }, 1500);
            });
          }
        });
      }
      if (btnCopyHtml && previewContent) {
        btnCopyHtml.addEventListener('click', function() {
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(previewContent.innerHTML).then(function() {
              btnCopyHtml.textContent = 'Copied!';
              setTimeout(function() { btnCopyHtml.innerHTML = '${icon('code')} HTML'; }, 1500);
            });
          }
        });
      }

      // Export Markdown file (.md)
      if (btnExportMd) {
        btnExportMd.addEventListener('click', function() {
          var mdContent = ta.value;
          var blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'neomail-documentation.md';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function() { URL.revokeObjectURL(url); }, 4000);
        });
      }

      // Import local Markdown file (.md)
      if (btnImportMd && importFileInput) {
        btnImportMd.addEventListener('click', function() {
          importFileInput.click();
        });
        importFileInput.addEventListener('change', function() {
          if (!importFileInput.files || !importFileInput.files[0]) return;
          var file = importFileInput.files[0];
          var reader = new FileReader();
          reader.onload = function(evt) {
            ta.value = evt.target.result || '';
            update();
            importFileInput.value = '';
          };
          reader.readAsText(file);
        });
      }

      // Zen Fullscreen Mode Toggle
      if (btnFullscreen && studioPanel) {
        btnFullscreen.addEventListener('click', function() {
          var isFs = studioPanel.classList.toggle('is-fullscreen');
          btnFullscreen.classList.toggle('active', isFs);
          btnFullscreen.textContent = isFs ? '⛶ Exit' : '⛶';
        });
      }

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

      // Preview Drawer Toggle (backward compatibility with test)
      if (toggleBtn && preview) {
        toggleBtn.addEventListener('click', function() {
          var isHidden = preview.style.display === 'none';
          preview.style.display = isHidden ? 'flex' : 'none';
          toggleBtn.classList.toggle('active', isHidden);
          update();
        });
      }
      if (closePreviewBtn && preview) {
        closePreviewBtn.addEventListener('click', function() {
          setViewMode('edit');
        });
      }

      // Projects Management in Right Sidebar
      var defaultProjects = [
        { id: 'proj-1', name: 'neoMailer Production Worker', url: 'https://mail.neopathshala.com', type: 'Cloudflare Worker', endpoints: ['POST /api/v1/send', 'POST /api/v1/domains/verify'] },
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
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
          e.preventDefault();
          if (btnToggleFind) btnToggleFind.click();
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

export function parseDocsMarkdown(md) {
  if (!md || typeof md !== 'string') return { html: '<p class="muted">No documentation content available.</p>', toc: [] };
  const text = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const blocks = text.split(/\n\n+/);
  let html = '';
  const toc = [];

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i].trim();
    if (!b) continue;

    if (b.startsWith('#### ')) {
      const hText = b.slice(5).trim();
      const id = hText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `h4-${i}`;
      toc.push({ level: 4, text: hText, id });
      html += `<h4 id="${id}">${inlineDocFmt(hText)} <a class="anchor-link" href="#${id}">#</a></h4>`;
    } else if (b.startsWith('### ')) {
      const hText = b.slice(4).trim();
      const id = hText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `h3-${i}`;
      toc.push({ level: 3, text: hText, id });
      html += `<h3 id="${id}">${inlineDocFmt(hText)} <a class="anchor-link" href="#${id}">#</a></h3>`;
    } else if (b.startsWith('## ')) {
      const hText = b.slice(3).trim();
      const id = hText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `h2-${i}`;
      toc.push({ level: 2, text: hText, id });
      html += `<h2 id="${id}">${inlineDocFmt(hText)} <a class="anchor-link" href="#${id}">#</a></h2>`;
    } else if (b.startsWith('# ')) {
      const hText = b.slice(2).trim();
      const id = hText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `h1-${i}`;
      toc.push({ level: 1, text: hText, id });
      html += `<h1 id="${id}">${inlineDocFmt(hText)} <a class="anchor-link" href="#${id}">#</a></h1>`;
    } else if (b.startsWith('&gt; [!NOTE]') || b.startsWith('&gt; [!TIP]') || b.startsWith('&gt; [!IMPORTANT]') || b.startsWith('&gt; [!WARNING]') || b.startsWith('&gt; [!CAUTION]')) {
      const isTip = b.includes('[!TIP]');
      const isWarn = b.includes('[!WARNING]') || b.includes('[!CAUTION]');
      const isImp = b.includes('[!IMPORTANT]');
      const type = isTip ? 'tip' : isWarn ? 'warning' : isImp ? 'important' : 'note';
      const label = type.toUpperCase();
      const lines = b.split('\n').map(l => l.replace(/^&gt;\s?(\[!.*?\])?/, '').trim()).filter(Boolean);
      html += `<div class="docs-callout callout-${type}"><div class="callout-header"><strong>${label}</strong></div><div class="callout-body">${inlineDocFmt(lines.join(' '))}</div></div>`;
    } else if (b.startsWith('&gt; ')) {
      const qLines = b.split('\n').map(l => l.replace(/^&gt;\s?/, '')).join('\n');
      html += `<blockquote>${inlineDocFmt(qLines.replace(/\n/g, '<br>'))}</blockquote>`;
    } else if (b.startsWith('\x60\x60\x60mermaid')) {
      const lines = b.split('\n');
      const code = lines.slice(1, lines[lines.length - 1].startsWith('\x60\x60\x60') ? -1 : undefined).join('\n');
      html += `<div class="docs-diagram-card"><div class="diagram-header"><span>☊ MERMAID DIAGRAM</span></div><div class="diagram-body"><pre class="mermaid">${code}</pre></div></div>`;
    } else if (b.startsWith('\x60\x60\x60')) {
      const lines = b.split('\n');
      const lang = (lines[0].replace(/^\x60\x60\x60/, '').trim()) || 'CODE';
      const code = lines.slice(1, lines[lines.length - 1].startsWith('\x60\x60\x60') ? -1 : undefined).join('\n');
      html += `<div class="docs-code-card"><div class="code-header"><span class="code-lang">${lang.toUpperCase()}</span><button type="button" class="btn-copy-code" data-code="${encodeURIComponent(code)}">Copy</button></div><pre><code>${code}</code></pre></div>`;
    } else if (b.includes('|') && b.split('\n').length >= 2 && b.split('\n')[1].includes('---')) {
      const tableLines = b.split('\n').map(l => l.trim()).filter(Boolean);
      const headers = tableLines[0].split('|').map(c => c.trim()).filter(Boolean);
      const rows = tableLines.slice(2).map(l => l.split('|').map(c => c.trim()).filter(Boolean));
      let tableHtml = '<div class="table-container"><table><thead><tr>';
      headers.forEach(h => { tableHtml += `<th>${inlineDocFmt(h)}</th>`; });
      tableHtml += '</tr></thead><tbody>';
      rows.forEach(r => {
        tableHtml += '<tr>';
        r.forEach(cell => { tableHtml += `<td>${inlineDocFmt(cell)}</td>`; });
        tableHtml += '</tr>';
      });
      tableHtml += '</tbody></table></div>';
      html += tableHtml;
    } else if (b.startsWith('- ') || b.startsWith('* ')) {
      const items = b.split('\n').map(l => l.replace(/^[-*]\s+/, ''));
      html += '<ul>' + items.map(item => {
        if (item.startsWith('[x] ') || item.startsWith('[X] ')) {
          return `<li class="task-item checked"><input type="checkbox" checked disabled> ${inlineDocFmt(item.slice(4))}</li>`;
        }
        if (item.startsWith('[ ] ')) {
          return `<li class="task-item"><input type="checkbox" disabled> ${inlineDocFmt(item.slice(4))}</li>`;
        }
        return `<li>${inlineDocFmt(item)}</li>`;
      }).join('') + '</ul>';
    } else if (/^\d+\.\s/.test(b)) {
      const numItems = b.split('\n').map(l => l.replace(/^\d+\.\s+/, ''));
      html += '<ol>' + numItems.map(item => `<li>${inlineDocFmt(item)}</li>`).join('') + '</ol>';
    } else if (b.startsWith('$$') && b.endsWith('$$')) {
      const formula = b.slice(2, -2).trim();
      html += `<div class="docs-math-block"><code>$$ ${formula} $$</code></div>`;
    } else if (b.includes('&lt;details&gt;') || b.includes('<details>')) {
      const summaryMatch = b.match(/&lt;summary&gt;(.*?)&lt;\/summary&gt;/) || b.match(/<summary>(.*?)<\/summary>/);
      const summaryText = summaryMatch ? summaryMatch[1] : 'Click to expand';
      const bodyText = b
        .replace(/&lt;details&gt;|<details>/gi, '')
        .replace(/&lt;\/details&gt;|<\/details>/gi, '')
        .replace(/&lt;summary&gt;.*?&lt;\/summary&gt;|<summary>.*?<\/summary>/gi, '')
        .trim();
      html += `<details class="docs-accordion"><summary>${inlineDocFmt(summaryText)}</summary><div class="accordion-content">${inlineDocFmt(bodyText.replace(/\n/g, '<br>'))}</div></details>`;
    } else if (b === '---' || b === '***') {
      html += '<hr class="docs-divider">';
    } else {
      html += `<p>${inlineDocFmt(b.replace(/\n/g, '<br>'))}</p>`;
    }
  }
  return { html, toc };
}

function inlineDocFmt(str) {
  return str
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="docs-inline-img">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="docs-link">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/==([^=]+)==/g, '<mark class="docs-highlight">$1</mark>')
    .replace(/&lt;mark&gt;(.*?)&lt;\/mark&gt;/gi, '<mark class="docs-highlight">$1</mark>')
    .replace(/&lt;u&gt;(.*?)&lt;\/u&gt;/gi, '<u>$1</u>')
    .replace(/&lt;kbd&gt;(.*?)&lt;\/kbd&gt;/gi, '<kbd class="docs-kbd">$1</kbd>')
    .replace(/&lt;sub&gt;(.*?)&lt;\/sub&gt;/gi, '<sub>$1</sub>')
    .replace(/&lt;sup&gt;(.*?)&lt;\/sup&gt;/gi, '<sup>$1</sup>')
    .replace(/\x60([^\x60]+)\x60/g, '<code class="inline-code">$1</code>');
}

export function publicDocs(content, isDark = false, footerCredit = 'Developed by SoftLaya Tech') {
  const defaultContent = `# neoMailer Documentation\n\nWelcome to **neoMailer** — hardened transactional email infrastructure designed for high deliverability, automated fallback routing, and zero-trust tenant isolation.\n\n> [!NOTE]\n> All tenant API keys and provider credentials are encrypted at rest with AES-256-GCM in Database.\n\n## Getting Started\n\nneoMailer provides a unified REST API and native SMTP relay that routes outbound transactional emails across multiple tier-1 providers with automated failover:\n\n- **Primary Provider**: Resend / Brevo\n- **Fallback Chain**: Resend → Brevo → Mailgun → Mailtrap → MailerSend → Custom SMTP\n- **Zero Downtime**: Circuit breakers automatically isolate unhealthy providers\n\n## System Guide\n\nConnect your application backend using the official REST API or native SMTP credentials.\n\n\`\`\`javascript\n// Node.js Dispatch Example\nconst response = await fetch('https://mail.neopathshala.com/api/v1/send', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer ' + process.env.NEOMAILER_API_KEY,\n    'Content-Type': 'application/json',\n    'Idempotency-Key': 'order:10294:invoice'\n  },\n  body: JSON.stringify({\n    from: 'support@mail.neopathshala.com',\n    to: 'customer@example.com',\n    subject: 'Your Invoice #10294 is Ready',\n    html: '<p>Thank you for your order! Your receipt is attached.</p>'\n  })\n});\n\`\`\`\n\n## Sending Domains & DNS\n\nBefore sending, configure these standard DNS verification records:\n\n| Record Type | Hostname | Value | Purpose |\n| ----------- | -------- | ----- | ------- |\n| TXT | \`_neomail-verification\` | \`[domain_token]\` | Domain Ownership & Anti-Scam Protection |\n| TXT | \`@\` | \`v=spf1 include:mail.neopathshala.com ~all\` | SPF Alignment |\n| CNAME | \`default._domainkey\` | \`dkim.mail.neopathshala.com\` | DKIM Signature |\n| TXT | \`_dmarc\` | \`v=DMARC1; p=reject; sp=reject;\` | DMARC Enforcement |\n\n> [!TIP]\n> neoMailer continuously monitors your domain DNS. If verification fails or records are tampered with, sending is paused automatically to protect your reputation.\n\n## REST API Reference\n\n### POST \`/api/v1/send\`\n\nDispatches an email through the optimal healthy provider.\n\n#### Request Headers\n\n- \`Authorization: Bearer <API_KEY>\` *(Required)*\n- \`Content-Type: application/json\` *(Required)*\n- \`Idempotency-Key: <unique_string>\` *(Recommended)*\n\n#### Response Schema\n\n\`\`\`json\n{\n  \"status\": \"success\",\n  \"id\": \"msg_90f23d8c11e74a6b\",\n  \"provider\": \"resend\",\n  \"transmission_status\": \"Delivered\",\n  \"timestamp\": 1730462400\n}\n\`\`\`\n\n## Provider Quotas & Rate Limits\n\nPer-user quotas prevent sudden spikes from degrading sender score.\n\n- [x] **Resend**: Tier 1 primary delivery\n- [x] **Brevo**: Global & EU transactional mail\n- [x] **Mailgun**: High-volume failover burst capacity\n- [x] **Mailtrap**: Production failover and sandbox staging\n- [x] **MailerSend**: Template fallback\n- [x] **SMTP Relay**: Port 465 (TLS) & 587 (STARTTLS)\n\n## Zero-Trust Security\n\n- **Session Binding**: Cryptographic SHA-256 session tokens with Cloudflare Access identity binding.\n- **Encrypted Storage**: Provider credentials and tenant secrets are sealed with authenticated AES-256-GCM.\n- **Immutable Auditing**: Every administrative change and dispatch event is logged.`;

  const md = content && content.trim() ? content : defaultContent;
  const { html, toc } = parseDocsMarkdown(md);

  const tocHtml = toc.map(item => `
    <a href="#${item.id}" class="docs-nav-link level-${item.level}">
      <span>${e(item.text)}</span>
    </a>
  `).join('');

  return `<!doctype html>
<html lang="en" ${isDark ? 'data-theme="dark" class="dark"' : ''}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="NeoMail Documentation · Private transactional email infrastructure and API reference.">
  <meta name="theme-color" content="#087d54">
  <title>NeoMail Documentation · Private Transactional Email Infrastructure</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #fcfdfc;
      --surface: #ffffff;
      --surface-hover: #f4f6f4;
      --text: #111816;
      --text-secondary: #526059;
      --muted: #6b7a72;
      --line: #e2e8e4;
      --accent: #087d54;
      --accent-hover: #059669;
      --tint: rgba(8, 125, 84, 0.08);
      --font: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --mono: 'JetBrains Mono', ui-monospace, monospace;
    }
    html.dark, [data-theme="dark"] {
      --bg: #0c100e;
      --surface: #121815;
      --surface-hover: #18221d;
      --text: #f0ede6;
      --text-secondary: #84968d;
      --muted: #6e8077;
      --line: #202c25;
      --accent: #10b981;
      --accent-hover: #059669;
      --tint: rgba(16, 185, 129, 0.1);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.65;
      -webkit-font-smoothing: antialiased;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    /* Fixed Top Navbar */
    .docs-navbar {
      height: 60px;
      background: var(--surface);
      border-bottom: 1px solid var(--line);
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }
    .docs-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text);
      font-weight: 800;
      font-size: 21px;
      letter-spacing: -0.5px;
    }
    .docs-brand .brandmark {
      width: 44px;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .docs-brand .brandmark svg { width: 44px; height: 30px; max-width: 44px; max-height: 32px; display: block; }
    .docs-brand .badge {
      font-size: 10px;
      padding: 2px 6px;
      background: var(--tint);
      color: var(--accent);
      border-radius: 4px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .docs-search-bar {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 380px;
      background: var(--surface-hover);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 0 12px;
    }
    .docs-search-bar svg { width: 14px; height: 14px; color: var(--muted); margin-right: 8px; }
    .docs-search-bar input {
      width: 100%;
      height: 36px;
      border: 0;
      background: transparent;
      color: var(--text);
      font-size: 13px;
      outline: none;
    }
    .docs-search-bar kbd {
      font-family: var(--mono);
      font-size: 11px;
      padding: 2px 6px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 4px;
      color: var(--muted);
    }
    .docs-nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .docs-link-btn {
      font-size: 13px;
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.12s ease;
    }
    .docs-link-btn:hover { color: var(--accent); background: var(--surface-hover); }
    .btn-theme-toggle {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--text);
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.12s ease;
    }
    .btn-theme-toggle:hover { border-color: var(--accent); color: var(--accent); }
    .btn-theme-toggle svg { width: 16px; height: 16px; }

    /* Docs Layout */
    .docs-layout {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr) 240px;
      flex: 1;
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
    }
    @media (max-width: 1100px) {
      .docs-layout { grid-template-columns: 240px minmax(0, 1fr); }
      .docs-right-col { display: none !important; }
    }
    @media (max-width: 768px) {
      .docs-layout { grid-template-columns: 1fr; }
      .docs-left-col { display: none; }
      .docs-left-col.open { display: block; position: fixed; inset: 60px 0 0 0; z-index: 40; background: var(--surface); }
    }

    /* Left Sidebar */
    .docs-left-col {
      border-right: 1px solid var(--line);
      background: var(--surface);
      height: calc(100vh - 60px);
      position: sticky;
      top: 60px;
      overflow-y: auto;
      padding: 20px 16px;
    }
    .docs-nav-group-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
      margin: 16px 0 8px 8px;
    }
    .docs-nav-link {
      display: flex;
      align-items: center;
      padding: 6px 12px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13px;
      border-radius: 6px;
      margin-bottom: 2px;
      transition: all 0.12s ease;
    }
    .docs-nav-link.level-3 { padding-left: 24px; font-size: 12px; color: var(--muted); }
    .docs-nav-link.level-4 { padding-left: 34px; font-size: 11px; color: var(--muted); }
    .docs-nav-link:hover { color: var(--accent); background: var(--surface-hover); }
    .docs-nav-link.active { color: var(--accent); background: var(--tint); font-weight: 600; }

    /* Center Content */
    .docs-main-col {
      padding: 40px 48px;
      min-width: 0;
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
    }
    .docs-breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--muted);
      margin-bottom: 24px;
    }
    .docs-breadcrumb a { color: var(--muted); text-decoration: none; }
    .docs-breadcrumb a:hover { color: var(--accent); }

    /* Typography inside Docs */
    .docs-content h1 {
      font-size: 32px;
      font-weight: 800;
      color: var(--accent);
      letter-spacing: -0.03em;
      margin-bottom: 16px;
      line-height: 1.25;
    }
    .docs-content h2 {
      font-size: 22px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.02em;
      margin: 36px 0 14px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--line);
    }
    .docs-content h3 {
      font-size: 17px;
      font-weight: 700;
      color: var(--text);
      margin: 24px 0 10px;
    }
    .docs-content h4 {
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
      margin: 18px 0 8px;
    }
    .docs-content p {
      font-size: 14px;
      color: var(--text);
      line-height: 1.7;
      margin: 12px 0;
    }
    .docs-content ul, .docs-content ol {
      padding-left: 24px;
      margin: 14px 0;
      font-size: 14px;
    }
    .docs-content li { margin: 6px 0; }
    .docs-content blockquote {
      border-left: 4px solid var(--accent);
      padding: 10px 18px;
      margin: 18px 0;
      background: var(--surface);
      color: var(--text-secondary);
      border-radius: 0 8px 8px 0;
      font-style: italic;
    }

    /* Right Sidebar */
    .docs-right-col {
      border-left: 1px solid var(--line);
      background: var(--surface);
      height: calc(100vh - 60px);
      position: sticky;
      top: 60px;
      overflow-y: auto;
      padding: 24px 18px;
      font-size: 12px;
    }
    .right-toc-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
      margin-bottom: 12px;
    }
    .right-toc-link {
      display: block;
      color: var(--text-secondary);
      text-decoration: none;
      padding: 4px 0;
      margin-bottom: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.12s ease;
    }
    .right-toc-link:hover { color: var(--accent); }

    /* Footer */
    .docs-footer {
      border-top: 1px solid var(--line);
      background: var(--surface);
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: var(--muted);
      margin-top: auto;
    }
  </style>
</head>
<body>
  <!-- NAVBAR -->
  <header class="docs-navbar">
    <div style="display:flex;align-items:center;gap:16px">
      <a class="docs-brand" href="/">
        <span class="brandmark">${neomailLogoSvg}</span>
        <span>neoMailer <span class="badge">Docs</span></span>
      </a>
      <span class="tag good" style="font-size:11px;padding:3px 8px;display:inline-flex;align-items:center;gap:5px">
        ${icon('zap')} Operational
      </span>
    </div>

    <div class="docs-search-bar">
      ${icon('search')}
      <input type="search" id="docs-search-input" placeholder="Search documentation (Press '/' to focus)..." aria-label="Search docs">
      <kbd>/</kbd>
    </div>

    <div class="docs-nav-actions">
      <a href="#rest-api-reference" class="docs-link-btn">API Reference</a>
      <a href="/dashboard" class="docs-link-btn" style="color:var(--accent);font-weight:700">Console ↗</a>
      <button type="button" id="docs-theme-toggle" class="btn-theme-toggle" title="Toggle theme">
        ${isDark ? icon('sun') : icon('moon')}
      </button>
    </div>
  </header>

  <!-- LAYOUT -->
  <div class="docs-layout">
    <!-- LEFT SIDEBAR -->
    <aside class="docs-left-col" id="docs-left-col">
      <div class="docs-nav-group-title">Documentation</div>
      <div id="docs-nav-links-container">
        ${tocHtml}
      </div>

      <div class="docs-nav-group-title" style="margin-top:24px">Quick References</div>
      <a href="#quickstart-setup" class="docs-nav-link">SDK & Quickstart</a>
      <a href="#sending-domains-dns" class="docs-nav-link">DNS Verification</a>
      <a href="#rest-api-reference" class="docs-nav-link">REST API Reference</a>
      <a href="#zero-trust-security" class="docs-nav-link">Zero-Trust Isolation</a>
      <a href="/dashboard/docs" class="docs-nav-link" style="color:var(--accent);font-weight:600;margin-top:12px">
        ${icon('code')} Studio Editor ↗
      </a>
    </aside>

    <!-- CENTER CONTENT -->
    <main class="docs-main-col">
      <div class="docs-breadcrumb">
        <a href="/">Home</a> / <a href="/docs">Docs</a> / <span>NeoMail Documentation</span>
      </div>

      <article class="docs-content" id="docs-content-area">
        ${html}
      </article>

      <div style="margin-top:48px;padding-top:20px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <span style="font-size:12px;color:var(--muted)">Need help or have security inquiries? Contact your workspace administrator.</span>
        <a href="/dashboard" style="font-size:12px;color:var(--accent);font-weight:600;text-decoration:none">Open neoMailer Workspace →</a>
      </div>
    </main>

    <!-- RIGHT SIDEBAR: ON THIS PAGE -->
    <aside class="docs-right-col">
      <div class="right-toc-title">On this page</div>
      <nav id="right-toc-container">
        ${toc.map(item => `<a href="#${item.id}" class="right-toc-link level-${item.level}">${e(item.text)}</a>`).join('')}
      </nav>

      <div class="right-toc-title" style="margin-top:24px">Developer Tools</div>
      <button type="button" id="btn-copy-doc-link" class="button secondary small" style="width:100%;justify-content:center;margin-bottom:6px">
        ${icon('link')} Copy Page Link
      </button>
      <a href="/api/v1/send" target="_blank" class="button secondary small" style="width:100%;justify-content:center;text-decoration:none;display:inline-flex;align-items:center;gap:6px">
        ${icon('external')} API Endpoint
      </a>
    </aside>
  </div>

  <!-- FOOTER -->
  <footer class="docs-footer">
    <p>neoMailer · Hardened Transactional Email Infrastructure · ${e(footerCredit)}</p>
  </footer>

  <script>
    (function() {
      // Dark Mode Toggle
      var themeBtn = document.getElementById('docs-theme-toggle');
      if (themeBtn) {
        themeBtn.addEventListener('click', function() {
          var isDark = document.documentElement.classList.contains('dark');
          var newTheme = isDark ? 'light' : 'dark';
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            themeBtn.innerHTML = '${icon('sun')}';
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
            themeBtn.innerHTML = '${icon('moon')}';
          }
          try {
            localStorage.setItem('neomail_theme', newTheme);
            document.cookie = 'neomail_theme=' + newTheme + '; path=/; max-age=31536000; SameSite=Lax';
          } catch(e) {}
        });
      }

      // Quick Search Filter
      var searchInput = document.getElementById('docs-search-input');
      var contentArea = document.getElementById('docs-content-area');
      if (searchInput && contentArea) {
        searchInput.addEventListener('input', function() {
          var q = searchInput.value.toLowerCase().trim();
          var headings = contentArea.querySelectorAll('h1, h2, h3, h4, p, li');
          if (!q) {
            headings.forEach(function(el) { el.style.opacity = '1'; });
            return;
          }
          headings.forEach(function(el) {
            var match = el.textContent.toLowerCase().includes(q);
            el.style.opacity = match ? '1' : '0.25';
          });
        });

        // Key shortcut '/'
        document.addEventListener('keydown', function(e) {
          if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
          }
        });
      }

      // Code Copy Buttons
      document.querySelectorAll('.btn-copy-code').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var code = decodeURIComponent(btn.getAttribute('data-code') || '');
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(code).then(function() {
              btn.textContent = 'Copied!';
              setTimeout(function() { btn.textContent = 'Copy'; }, 1600);
            });
          }
        });
      });

      // Copy Page Link
      var copyLinkBtn = document.getElementById('btn-copy-doc-link');
      if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).then(function() {
              copyLinkBtn.textContent = '✓ Copied Link!';
              setTimeout(function() { copyLinkBtn.innerHTML = '${icon('link')} Copy Page Link'; }, 1600);
            });
          }
        });
      }
    })();
  </script>
</body>
</html>`;
}

export function docsViewer(content, sess) {
  const { html } = parseDocsMarkdown(content);
  return `<section class="panel">
    <div class="panelhead">
      <div>
        <h2>Documentation & System Guide</h2>
        <p>Reference guide for neoMailer transactional mail infrastructure.</p>
      </div>
      <a class="button secondary studio-action-btn" href="/docs" target="_blank">${icon('external')} <span>View</span></a>
    </div>
    <div class="panelbody">
      <div class="docs-view-body">
        ${html}
      </div>
    </div>
  </section>`;
}

export function providersView(rows, cfg, sess, limits = {}, usage = {}, userLimits = [], users = []) {
  const base = sess?.base || '/dashboard';
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
            const hasFailures = failures > 0;
            const statusLabel = !configured ? 'Not configured'
              : isPaused ? 'Paused'
              : inCooldown ? 'Cooling down'
              : hasFailures ? 'Failing (' + failures + ')'
              : !row?.last_used_timestamp ? 'Configured'
              : 'Ready';

            return `
              <div class="routing-card ${i === 0 ? 'priority-primary' : ''}">
                <div class="routing-card-left">
                  <div class="order-btn-group">
                    <form method="post" action="${base}/providers/reorder">
                      ${hidden(sess.csrf_token)}
                      <input type="hidden" name="provider" value="${p}">
                      <input type="hidden" name="direction" value="up">
                      <button class="order-btn" title="Move up in priority" ${i === 0 ? 'disabled' : ''}>${icon('arrowUp')}</button>
                    </form>
                    <form method="post" action="${base}/providers/reorder">
                      ${hidden(sess.csrf_token)}
                      <input type="hidden" name="provider" value="${p}">
                      <input type="hidden" name="direction" value="down">
                      <button class="order-btn" title="Move down in priority" ${i === currentOrder.length - 1 ? 'disabled' : ''}>${icon('arrowDown')}</button>
                    </form>
                  </div>
                  <span class="routing-rank ${i === 0 ? 'primary' : ''}">#${i + 1} ${i === 0 ? 'Primary' : 'Failover'}</span>
                  <div class="providerlogo">${providerLogo(p)}</div>
                  <div class="routing-meta">
                    <strong>${e(p)}</strong>
                    <p>${configured ? 'Credential configured' : 'Add credentials below'}${failures ? ' · ' + failures + ' recent failures' : ''}</p>
                  </div>
                </div>
                <div class="routing-actions">
                  ${badge(statusLabel)}
                  ${failures > 0 ? `
                    <form method="post" action="${base}/providers/reset-health">
                      ${hidden(sess.csrf_token)}
                      <input type="hidden" name="provider" value="${p}">
                      <button class="button secondary small" title="Reset failure counter and circuit breaker">${icon('zap')} Reset breaker</button>
                    </form>
                  ` : ''}
                  <form method="post" action="${base}/providers/toggle">
                    ${hidden(sess.csrf_token)}
                    <input type="hidden" name="provider" value="${p}">
                    <button class="button secondary small">${isPaused ? 'Enable' : 'Pause'}</button>
                  </form>
                  <form method="post" action="${base}/providers/remove">
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
            <form method="post" action="${base}/providers/add" style="display:flex;align-items:center;gap:10px">
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
                <form method="post" action="${base}/providers/limit" style="display:flex;gap:8px;align-items:center">
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
        <form method="post" action="${base}/providers/limit" style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;margin-bottom:20px">
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
                      <form method="post" action="${base}/providers/limit" style="display:inline-flex;align-items:center;gap:6px">
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
          <form method="post" action="${base}/providers/configure">
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

export function apiClients(clients, sess, createdKey = '', verifiedDomains = []) {
  const base = sess?.base || '/dashboard';
  const isSuper = sess?.role === 'superadmin';
  const domainList = Array.isArray(verifiedDomains) ? verifiedDomains : (verifiedDomains ? [{ domain: 'mail.neopathshala.com', display_name: 'Primary Domain' }] : []);
  const canCreate = isSuper || domainList.length > 0;
  const keyNotice = createdKey ? `<div class="notice">New API key (shown once): <code>${e(createdKey)}</code>. Store it securely; it will not be displayed again.</div>` : '';
  const domainWarning = (!isSuper && domainList.length === 0) ? `
    <div class="notice warn" style="margin-bottom:16px;border-left:4px solid var(--accent)">
      <strong>⚠️ Domain Verification Required</strong>
      <p style="margin:4px 0 0;font-size:13px">You cannot generate API client keys until you add and verify ownership of a sending domain under <a href="${base}/domains" style="text-decoration:underline;font-weight:600">Domains</a>.</p>
    </div>
  ` : '';
  const createPanel = `
    <section class="panel">
      ${domainWarning}
      <div class="panelhead" style="display:flex;align-items:center;gap:8px">
        <h2 style="margin:0">Create API client</h2>
        <span class="info-help-btn" tabindex="0" role="tooltip" title="Leave sender blank to allow any active sender identity. A restricted client can only send from its assigned sender." aria-label="Leave sender blank to allow any active sender identity. A restricted client can only send from its assigned sender.">
          ${icon('info')}
          <span class="info-tooltip-box">Leave sender blank to allow any active sender identity. A restricted client can only send from its assigned sender. Each API key is strictly isolated to a single verified domain.</span>
        </span>
      </div>
      <div class="panelbody">
        <form method="post" action="${base}/api-clients/create">
          ${hidden(sess.csrf_token)}
          <div class="settingsgrid">
            <label class="field">Client name
              <input name="name" required maxlength="80" placeholder="App backend" ${!canCreate ? 'disabled' : ''}>
            </label>
            <label class="field">Authorized domain (Required)
              <select name="domain" required class="custom-select" ${!canCreate ? 'disabled' : ''}>
                ${domainList.length > 0 ? domainList.map(d => `<option value="${e(typeof d === 'string' ? d : d.domain)}">${e(typeof d === 'string' ? d : (d.display_name ? `${d.display_name} (${d.domain})` : d.domain))}</option>`).join('') : '<option value="" disabled selected>No verified domains available</option>'}
              </select>
              <small>This API key is strictly isolated to this domain only. Even superadmin cannot access your keys.</small>
            </label>
            <label class="field">Restricted sender (optional)
              <input type="email" name="sender_address" maxlength="254" autocomplete="off" spellcheck="false" placeholder="your-sender@your-verified-domain.com" ${!canCreate ? 'disabled' : ''}>
              <small>Optional exact sender email on the authorized domain.</small>
            </label>
          </div>
          <button class="button" ${!canCreate ? 'disabled' : ''}>Create client key</button>
        </form>
        <p class="footnote">Leave sender blank to allow any active sender identity. A restricted client can only send from its assigned sender. Each API key is strictly isolated to its authorized domain; even superadmin cannot view or access your keys.</p>
      </div>
    </section>
  `;
  const listPanel = `
    <section class="panel">
      <div class="panelhead" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h2>API clients</h2>
          <p>Issue separate bearer tokens for each application. Keys are stored only as hashes and isolated per domain.</p>
        </div>
        <span class="tag" style="font-size:11px">${clients.length} ${clients.length === 1 ? 'client' : 'clients'}</span>
      </div>
      <div class="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Domain</th>
              <th>Sender</th>
              <th>Status</th>
              <th>Created</th>
              <th>Last used</th>
              <th style="text-align:right">Action</th>
            </tr>
          </thead>
          <tbody>
            ${clients.map(c => `
              <tr>
                <td><strong>${e(c.name)}</strong></td>
                <td><span class="tag good" style="font-size:11px">${e(c.domain || 'Primary')}</span></td>
                <td><code>${e(c.sender_address || 'Any identity on domain')}</code></td>
                <td>${badge(c.is_active ? 'Active' : 'Revoked')}</td>
                <td><span style="color:var(--muted);font-size:12px">${e(new Date(c.created_at * 1000).toISOString().slice(0, 16).replace('T', ' '))}</span></td>
                <td><span style="color:var(--muted);font-size:12px">${c.last_used_at ? e(new Date(c.last_used_at * 1000).toISOString().slice(0, 16).replace('T', ' ')) : 'Never'}</span></td>
                <td style="text-align:right">
                  ${c.is_active ? `
                    <form method="post" action="${base}/api-clients/revoke" style="display:inline;margin:0" onsubmit="return confirm('Revoke API client ${e(c.name)}?');">
                      ${hidden(sess.csrf_token)}
                      <input type="hidden" name="id" value="${e(c.id)}">
                      <button class="button secondary small">Revoke</button>
                    </form>
                  ` : '<span class="muted">—</span>'}
                </td>
              </tr>
            `).join('') || `<tr><td colspan="7">No API clients yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
  return `${keyNotice}${createPanel}${listPanel}`;
}

function renderNoticeText(msg) {
  if (!msg) return '';
  const textClean = String(msg).replace(/<a\b[^>]*>workspace administrator<\/a>/gi, 'workspace administrator');
  const escaped = e(textClean);
  return escaped.replace(/workspace administrator/g, '<a href="mailto:aashish@neopathshala.com">workspace administrator</a>');
}

export function users(rows, sess, isSuperadmin = false, accessRequests = []) {
  const base = sess?.base || '/dashboard';
  const requestsPanel = (isSuperadmin && accessRequests.length > 0) ? `
    <section class="panel" style="margin-top:24px">
      <div class="panelhead">
        <div style="display:flex;align-items:center;gap:10px">
          <span class="tag good">${accessRequests.length} Pending</span>
          <h2>Client Registration Requests</h2>
        </div>
        <p>Prospective clients who applied for workspace access from the sign-in page.</p>
      </div>
      <div class="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Organization</th>
              <th>Notes / Use Case</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${accessRequests.map(r => `
              <tr>
                <td><strong>${e(r.name)}</strong><br><span class="muted">${e(r.email)}</span></td>
                <td>${e(r.organization || '—')}</td>
                <td><small>${e(r.notes || '—')}</small></td>
                <td>${e(new Date(r.created_at * 1000).toISOString().slice(0, 16).replace('T', ' '))}</td>
                <td>
                  <div style="display:flex;gap:6px">
                    <form method="post" action="${base}/users/approve-request" style="display:inline">
                      ${hidden(sess.csrf_token)}
                      <input type="hidden" name="email" value="${e(r.email)}">
                      <input type="hidden" name="name" value="${e(r.name)}">
                      <input type="hidden" name="request_id" value="${e(r.id)}">
                      <button class="button small">Approve as Admin</button>
                    </form>
                    <form method="post" action="${base}/users/reject-request" style="display:inline">
                      ${hidden(sess.csrf_token)}
                      <input type="hidden" name="request_id" value="${e(r.id)}">
                      <button class="button secondary small">Dismiss</button>
                    </form>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  ` : '';

  const addModal = isSuperadmin ? `
    <dialog id="addAdminModal" class="login-modal admin-modal" onclick="if(event.target===this)this.close()">
      <div class="modal-card">
        <div class="modal-head">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="brandmark" style="width:32px;height:32px;padding:0;background:var(--tint);color:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center">${icon('users')}</div>
            <div>
              <h2 style="font-size:15px;margin:0;font-weight:700">Add Administrator</h2>
              <p style="font-size:11px;color:var(--muted);margin:2px 0 0">Provision an isolated workspace for a team member</p>
            </div>
          </div>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('addAdminModal').close()" aria-label="Close modal">&times;</button>
        </div>
        <form method="post" action="${base}/users/add" class="modal-body">
          ${hidden(sess.csrf_token)}
          <label class="field" style="margin-bottom:12px">
            <span style="font-size:11px;font-weight:600;display:block;margin-bottom:4px">Access subject (email)</span>
            <input type="email" name="subject" required maxlength="254" autocomplete="off" spellcheck="false" placeholder="you@example.com" style="width:100%">
          </label>
          <label class="field" style="margin-bottom:14px">
            <span style="font-size:11px;font-weight:600;display:block;margin-bottom:4px">Role</span>
            <select name="role" class="custom-select" style="width:100%">
              <option value="admin">Admin</option>
            </select>
          </label>
          <p class="footnote" style="margin:0 0 16px 0;font-size:11px;color:var(--muted)">Admins receive a fully isolated workspace of their own. They never gain superadmin powers.</p>
          <div style="display:flex;justify-content:flex-end;gap:10px">
            <button type="button" class="button secondary" onclick="document.getElementById('addAdminModal').close()">Cancel</button>
            <button type="submit" class="button">${icon('plus')} Add user</button>
          </div>
        </form>
      </div>
    </dialog>
  ` : '';

  const clickScript = sess?.script_nonce ? `<script nonce="${e(sess.script_nonce)}">
document.addEventListener('click', function(ev) {
  if (!ev.target.closest('.user-edit-popover')) {
    document.querySelectorAll('.user-edit-popover[open]').forEach(function(el) {
      el.removeAttribute('open');
    });
  }
});
</script>` : '';

  return `
    ${requestsPanel}
    <section class="panel">
      <div class="panelhead" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h2>Administrator accounts</h2>
        </div>
        <span class="tag" style="font-size:11px">${rows.length} ${rows.length === 1 ? 'account' : 'accounts'}</span>
      </div>
      <div class="tablewrap users-tablewrap">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th style="text-align:right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:28px;height:28px;border-radius:50%;background:var(--tint);color:var(--accent);display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:11.5px;border:1px solid var(--tint-strong);flex-shrink:0">
                      ${e(initial(r.subject))}
                    </div>
                    <div>
                      <div style="font-weight:600;color:var(--text);font-size:13px">${e(r.subject)}</div>
                      ${r.subject === sess.subject ? `<div style="font-size:10.5px;color:var(--accent);font-weight:550">Active session</div>` : ''}
                    </div>
                  </div>
                </td>
                <td>
                  <code style="font-size:11.5px;padding:2px 7px;background:var(--surface-hover);border:1px solid var(--line);border-radius:4px;font-family:var(--mono);text-transform:uppercase">${e(r.role)}</code>
                </td>
                <td>${badge(r.is_active ? 'Active' : 'Revoked')}</td>
                <td><span style="color:var(--muted);font-size:12px">${e(new Date(r.created_at * 1000).toISOString().slice(0, 16).replace('T', ' '))}</span></td>
                <td style="text-align:right">
                  ${isSuperadmin && r.role !== 'superadmin' && r.subject !== sess.subject ? `
                    <div class="user-actions-row">
                      <details class="user-edit-popover">
                        <summary class="button secondary small" title="Edit administrator">${icon('edit')}<span>Edit</span></summary>
                        <div class="popover-dropdown">
                          <div class="user-edit-title">
                            ${icon('users')}
                            <span>Edit administrator</span>
                          </div>
                          <form method="post" action="${base}/users/update" style="margin:0">
                            ${hidden(sess.csrf_token)}
                            <input type="hidden" name="old_subject" value="${e(r.subject)}">
                            <label class="field" style="margin-bottom:10px">
                              <span>Subject (email)</span>
                              <input name="new_subject" value="${e(r.subject)}" required maxlength="254" autocomplete="off" spellcheck="false" style="font-size:12px;padding:6px 9px;width:100%">
                            </label>
                            <label class="field" style="margin-bottom:14px">
                              <span>Role</span>
                              <select name="role" class="custom-select" style="width:100%;font-size:12px">
                                <option value="admin" ${r.role === 'admin' ? 'selected' : ''}>Admin</option>
                              </select>
                            </label>
                            <div style="display:flex;justify-content:flex-end;gap:6px">
                              <button type="button" class="button secondary small" onclick="this.closest('details').removeAttribute('open')">Cancel</button>
                              <button type="submit" class="button small">Save</button>
                            </div>
                          </form>
                        </div>
                      </details>
                      <form method="post" action="${base}/users/revoke" style="display:inline;margin:0" onsubmit="return confirm('Revoke console access for ${e(r.subject)}?');">
                        ${hidden(sess.csrf_token)}
                        <input type="hidden" name="subject" value="${e(r.subject)}">
                        <button type="submit" class="button danger small" title="Revoke administrator access">${icon('trash')}<span>Revoke</span></button>
                      </form>
                    </div>
                  ` : (r.subject === sess.subject ? `<span class="tag default" style="font-size:10.5px">Current session</span>` : (r.role === 'superadmin' ? `<span class="tag good" style="font-size:10.5px">Superadmin</span>` : `<span class="muted">—</span>`))}
                </td>
              </tr>
            `).join('') || '<tr><td colspan="5">No users.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
    ${addModal}
    ${clickScript}
  `;
}

export function otpRequest(error = '', isDark = false, emailVal = '', showRegister = true, notice = '', footerCredit = 'Developed by SoftLaya Tech') {
  const renderedError = error ? renderNoticeText(error) : '';
  const registerModal = showRegister ? `
    <div style="margin-top:14px;text-align:center">
      <button type="button" class="textbutton-link" style="font-size:12px;color:var(--muted)" onclick="document.getElementById('regModal').showModal()">Request client access</button>
    </div>
    <dialog id="regModal" class="login-modal" onclick="if(event.target===this)this.close()">
      <div class="modal-card">
        <div class="modal-head">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="brandmark" style="width:32px;height:32px;padding:0;background:var(--tint);color:var(--accent);border-radius:8px;display:flex;align-items:center;justify-content:center">${icon('users')}</div>
            <div>
              <h2 style="font-size:15px;margin:0;font-weight:700">Request Client Access</h2>
              <p style="font-size:11px;color:var(--muted);margin:2px 0 0">Apply for a verified workspace account</p>
            </div>
          </div>
          <button type="button" class="modal-close-btn" onclick="document.getElementById('regModal').close()" aria-label="Close modal">&times;</button>
        </div>
        <form method="post" action="/login" class="modal-body">
          <input type="hidden" name="step" value="register_request">
          <label class="field">Full name
            <input type="text" name="name" required maxlength="80" placeholder="Jane Doe" autocomplete="name">
          </label>
          <label class="field">Work email address
            <input type="email" name="email" required maxlength="254" placeholder="you@company.com" autocomplete="email">
          </label>
          <label class="field">Organization / Company
            <input type="text" name="organization" required maxlength="120" placeholder="e.g. Acme Technologies">
          </label>
          <label class="field">Intended sending use case (optional)
            <textarea name="notes" rows="2" maxlength="500" placeholder="e.g. Transactional alerts, receipts, notification infrastructure..."></textarea>
          </label>
          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
            <button type="button" class="button secondary" onclick="document.getElementById('regModal').close()">Cancel</button>
            <button type="submit" class="button">Submit access request</button>
          </div>
        </form>
      </div>
    </dialog>
  ` : '';

  return document('Sign in', `<div class="login">
    <div class="login-card loginform">
      <div class="logininner">
        ${neomailBrandBadge}
        <h1 class="login-card-title" style="text-align:center">Welcome to neoMailer</h1><!-- Welcome to NeoMail --><!-- Welcome to neoMail -->
        <p class="login-card-sub" style="text-align:center">Sign in with a one-time verification code sent to your administrator email.</p>
        ${notice ? `<div class="notice good" role="status" style="margin-bottom:16px">${icon('check')}<span>${e(notice)}</span></div>` : ''}
        <form method="post" action="/login">
          <input type="hidden" name="step" value="request" id="login-step">
          <div class="login-field-group">
            <label class="login-label" for="login-email">Administrator email</label>
            <input type="email" id="login-email" name="email" class="login-input" required maxlength="254" autocomplete="username" placeholder="admin@neopathshala.com" value="${e(emailVal)}" ${error ? 'aria-invalid="true"' : ''}>
            ${renderedError ? `<div class="notice error" role="alert">${renderedError}</div>` : ''}
          </div>
          <button type="submit" class="button login-submit-btn">Send login code ${icon('arrow')}</button>
        </form>
        ${registerModal}
        <span style="display:none" aria-hidden="true">${e(footerCredit)}</span>
      </div>
    </div>
  </div>`, '', isDark);
}

export function otpVerify(email, error = '', isDark = false, footerCredit = 'Developed by SoftLaya Tech') {
  const renderedError = error ? renderNoticeText(error) : '';
  return document('Sign in', `<div class="login">
    <div class="login-card loginform">
      <div class="logininner">
        ${neomailBrandBadge}
        <h1 class="login-card-title" style="text-align:center">Enter your code</h1><!-- Welcome to NeoMail --><!-- Welcome to neoMail -->
        <p class="login-card-sub" style="text-align:center">A one-time code was sent to <strong>${e(email)}</strong>.</p>
        <form method="post" action="/login">
          <input type="hidden" name="step" value="verify">
          <input type="hidden" name="email" value="${e(email)}">
          <div class="login-field-group">
            <label class="login-label" for="login-code" style="text-align:center">Verification code</label>
            <input id="login-code" name="code" class="login-input code-input" required pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" placeholder="123456" autofocus style="text-align:center;letter-spacing:6px;font-size:22px;font-weight:700;font-family:var(--font-mono, monospace);" ${error ? 'aria-invalid="true"' : ''}>
            ${renderedError ? `<div class="notice error" role="alert">${renderedError}</div>` : ''}
          </div>
          <button type="submit" class="button login-submit-btn">Verify and sign in ${icon('arrow')}</button>
          <div class="login-alt-actions">
            <a href="/login" class="textbutton-link" style="font-size:12.5px">&larr; Use a different email</a>
          </div>
        </form>
        <span style="display:none" aria-hidden="true">${e(footerCredit)}</span>
      </div>
    </div>
  </div>`, '', isDark);
}

export function domains(rows, sess) {
  const base = sess?.base || '/dashboard';
  const isSuper = sess?.role === 'superadmin';
  const currentSubject = sess?.access_subject || sess?.subject || 'local-admin';

  const ownRows = isSuper ? rows.filter(r => !r.owner_subject || r.owner_subject === currentSubject || r.owner_subject === 'local-admin') : rows;
  const otherRows = isSuper ? rows.filter(r => r.owner_subject && r.owner_subject !== currentSubject && r.owner_subject !== 'local-admin') : [];

  const copyScript = sess.script_nonce ? `<script nonce="${e(sess.script_nonce)}">const copyIcon=${JSON.stringify(icon('copy'))};const check='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:14px;height:14px;display:block"><polyline points="20 6 9 17 4 12"/></svg>';document.addEventListener('click',async ev=>{const b=ev.target.closest('button[data-copy]');if(!b||b.dataset.copying)return;ev.preventDefault();const value=b.getAttribute('data-copy');if(!value)return;b.dataset.copying='1';try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(value);}else{throw new Error('exec');}}catch{const ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}finally{ta.remove();}}b.classList.add('copied');b.innerHTML=check;setTimeout(()=>{b.classList.remove('copied');b.innerHTML=copyIcon;delete b.dataset.copying;},1600);});</script>` : '';
  const dnsField = (label, value, title) => `<div class="dnsfield"><span class="dnstype">${label}</span><code title="${e(title)}">${e(value)}</code><button type="button" class="button secondary small iconb" data-copy="${e(value)}" aria-label="Copy ${label}" title="Copy">${icon('copy')}</button></div>`;
  const record = r => r.verification_token ? `${dnsField('Name', '_neomailer-verification.' + r.domain, 'TXT record host — paste this into the Host/Name field of your DNS provider')}${dnsField('Value', r.verification_token, 'TXT record content — paste this into the Value/Content field of your DNS provider')}` : '<p class="sub">Verification token missing — remove and re-add the domain.</p>';

  const deleteDomainForm = (d) => `
    <form method="post" action="${base}/domains/delete" onsubmit="return confirm('Permanently delete sending domain ${e(d)}? Outbound sending from this domain will stop.');" style="display:inline">
      ${hidden(sess.csrf_token)}
      <input type="hidden" name="domain" value="${e(d)}">
      <button class="button danger small iconb" type="submit" title="Delete domain" aria-label="Delete domain">${icon('trash')}</button>
    </form>
  `;

  const whiteLabelForm = (r) => isSuper ? `
    <details style="margin-top:6px;text-align:left">
      <summary style="font-size:11px;color:var(--accent);cursor:pointer;font-weight:600">⚙ White-Label API</summary>
      <form method="post" action="${base}/domains/white-label" style="margin-top:8px;padding:10px;background:var(--bg);border-radius:6px;border:1px solid var(--line);min-width:240px">
        ${hidden(sess.csrf_token)}
        <input type="hidden" name="domain" value="${e(r.domain)}">
        <label class="field" style="margin-bottom:6px">
          <span style="font-size:11px;font-weight:600">Custom API Hostname</span>
          <input name="custom_api_hostname" value="${e(r.custom_api_hostname || '')}" placeholder="api.${e(r.domain)}" maxlength="253" style="font-size:12px;padding:4px 8px">
        </label>
        <label style="display:flex;align-items:center;gap:6px;font-size:11px;margin-bottom:8px;cursor:pointer">
          <input type="checkbox" name="enforce_custom_hostname" value="1" ${r.enforce_custom_hostname ? 'checked' : ''}>
          <span>Enforce custom domain (block shared)</span>
        </label>
        ${r.custom_api_hostname ? `<div style="font-size:11px;color:var(--muted);margin-bottom:8px">Client DNS: <code>CNAME ${e(r.custom_api_hostname)} -> mail.neopathshala.com</code></div>` : ''}
        <button class="button small" style="width:100%">Save White-Label</button>
      </form>
    </details>
  ` : '';

  const otherDomainsPanel = otherRows.length > 0 ? `
    <details class="collapsible-domains-panel panel" open style="margin-top:24px;border:1px solid var(--line) !important;border-radius:12px;overflow:hidden">
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
                  ? `<img src="${base}/profile-image?subject=${encodeURIComponent(r.owner_subject)}" alt="${e(ownerName)}" style="width:34px;height:34px;border-radius:8px;object-fit:cover;border:1px solid var(--line);flex-shrink:0">`
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
                      ${whiteLabelForm(r)}
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
                  ${r.custom_api_hostname ? `<div style="margin-top:4px"><span class="tag ${r.enforce_custom_hostname ? 'danger' : 'good'}" style="font-size:10px">${icon('security')} ${e(r.custom_api_hostname)} (${r.enforce_custom_hostname ? 'Enforced' : 'Dual'})</span></div>` : ''}
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
                  ${whiteLabelForm(r)}
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

export function errorIllustrationSvg() {
  return `<svg class="error-page-svg" viewBox="0 0 500 420" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="errBackdropGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="var(--illus-blob)" stop-opacity="1"/>
        <stop offset="100%" stop-color="var(--illus-blob)" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="chairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--illus-chair-highlight)"/>
        <stop offset="100%" stop-color="var(--illus-chair)"/>
      </linearGradient>
      <linearGradient id="errChairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--illus-chair-highlight)"/>
        <stop offset="100%" stop-color="var(--illus-chair)"/>
      </linearGradient>
      <linearGradient id="errCushionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--illus-chair-highlight)"/>
        <stop offset="100%" stop-color="var(--illus-chair-shadow)"/>
      </linearGradient>
      <linearGradient id="errMascotGrad" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="var(--illus-mascot)"/>
        <stop offset="100%" stop-color="var(--illus-mascot-dark)"/>
      </linearGradient>
      <clipPath id="albumPhotoClip">
        <rect x="89" y="44" width="46" height="50" rx="2"/>
      </clipPath>
    </defs>
    <ellipse cx="270" cy="220" rx="190" ry="170" fill="url(#errBackdropGlow)"/>
    <ellipse cx="270" cy="378" rx="145" ry="16" fill="var(--text)" opacity="0.06"/>
    <ellipse cx="112" cy="374" rx="46" ry="9" fill="var(--text)" opacity="0.06"/>
    <ellipse cx="445" cy="372" rx="30" ry="8" fill="var(--text)" opacity="0.06"/>
    <g transform="translate(355, 30)" id="wallClockGroup">
      <circle cx="45" cy="45" r="38" fill="var(--surface)" stroke="var(--illus-clock-rim)" stroke-width="4"/>
      <line x1="45" y1="14" x2="45" y2="21" stroke="var(--illus-clock-rim)" stroke-width="3" stroke-linecap="round"/>
      <line x1="45" y1="69" x2="45" y2="76" stroke="var(--illus-clock-rim)" stroke-width="3" stroke-linecap="round"/>
      <line x1="14" y1="45" x2="21" y2="45" stroke="var(--illus-clock-rim)" stroke-width="3" stroke-linecap="round"/>
      <line x1="69" y1="45" x2="76" y2="45" stroke="var(--illus-clock-rim)" stroke-width="3" stroke-linecap="round"/>
      <line id="clockHourHand" x1="45" y1="45" x2="45" y2="28" stroke="var(--text)" stroke-width="3.5" stroke-linecap="round"/>
      <line id="clockMinuteHand" x1="45" y1="45" x2="45" y2="21" stroke="var(--text)" stroke-width="2.5" stroke-linecap="round"/>
      <line id="clockSecondHand" x1="45" y1="52" x2="45" y2="16" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="45" cy="45" r="3.2" fill="var(--accent)"/>
      <circle cx="45" cy="45" r="1.2" fill="#ffffff"/>
    </g>
    <g id="wallAlbumPhoto">
      <circle cx="112" cy="30" r="2.2" fill="var(--illus-frame-border)"/>
      <path d="M 112 30 L 96 37 M 112 30 L 128 37" stroke="var(--line-strong)" stroke-width="1.2" stroke-linecap="round"/>
      <rect x="82" y="37" width="60" height="76" rx="3.5" fill="var(--illus-frame-border)" stroke="var(--illus-frame-border)" stroke-width="1.5"/>
      <rect x="86" y="41" width="52" height="68" rx="1.5" fill="#f8fafc" stroke="var(--line)" stroke-width="0.6"/>
      <g clip-path="url(#albumPhotoClip)">
        <rect x="89" y="44" width="46" height="50" fill="#e0f2fe"/>
        <circle cx="123" cy="54" r="4.5" fill="#f59e0b"/>
        <path d="M 87 94 Q 102 77 116 94 Z" fill="#059669" opacity="0.65"/>
        <path d="M 104 94 Q 118 80 137 94 Z" fill="var(--accent)" opacity="0.85"/>
        <ellipse cx="107" cy="84" r="5" fill="#334155"/>
        <ellipse cx="107" cy="77" r="4" fill="#334155"/>
        <circle cx="105.5" cy="76.5" r="1.5" fill="none" stroke="#ffffff" stroke-width="0.6"/>
        <circle cx="108.5" cy="76.5" r="1.5" fill="none" stroke="#ffffff" stroke-width="0.6"/>
        <path d="M 112 78 Q 115 74 117 76" stroke="#334155" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        <path d="M 107 70 C 105.5 68 103 70 107 73.5 C 111 70 108.5 68 107 70 Z" fill="#ef4444"/>
        <polygon points="89,44 115,44 95,94 89,94" fill="#ffffff" opacity="0.2"/>
      </g>
      <line x1="97" y1="102" x2="127" y2="102" stroke="var(--line-strong)" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
      <circle cx="112" cy="102" r="1.5" fill="var(--accent)"/>
    </g>
    <g id="serverRack">
      <rect x="72" y="220" width="80" height="150" rx="8" fill="var(--illus-server)" stroke="var(--line-strong)" stroke-width="1.5"/>
      <rect x="76" y="224" width="72" height="142" rx="5" fill="var(--surface)" fill-opacity="0.05" stroke="var(--line)" stroke-width="0.8"/>
      <rect x="79" y="227" width="66" height="17" rx="3" fill="var(--surface)" fill-opacity="0.12"/>
      <rect x="84" y="233" width="18" height="4.5" rx="1.5" fill="var(--accent)"/>
      <circle cx="106" cy="235.2" r="1.5" fill="var(--accent)"/>
      <circle cx="132" cy="235.5" r="2.2" fill="var(--accent)" class="server-led-1"/>
      <circle cx="138" cy="235.5" r="1.5" fill="#3b82f6" class="server-led-2"/>
      <rect x="79" y="247" width="66" height="20" rx="2" fill="var(--surface)" fill-opacity="0.07" stroke="var(--line)" stroke-width="0.7"/>
      <rect x="84" y="255" width="5.5" height="5.5" rx="1" fill="var(--illus-server)"/>
      <rect x="91" y="255" width="5.5" height="5.5" rx="1" fill="var(--illus-server)"/>
      <rect x="98" y="255" width="5.5" height="5.5" rx="1" fill="var(--illus-server)"/>
      <rect x="105" y="255" width="5.5" height="5.5" rx="1" fill="var(--illus-server)"/>
      <circle cx="86.7" cy="252" r="1" fill="var(--accent)" class="server-led-1"/>
      <circle cx="93.7" cy="252" r="1" fill="var(--accent)" class="server-led-2"/>
      <circle cx="100.7" cy="252" r="1" fill="#3b82f6" class="server-led-3"/>
      <circle cx="107.7" cy="252" r="1" fill="var(--accent)" class="server-led-1"/>
      <rect x="120" y="253" width="18" height="8" rx="1.5" fill="var(--surface)" fill-opacity="0.15"/>
      <circle cx="125" cy="257" r="1.2" fill="var(--accent)" class="server-led-2"/>
      <circle cx="132" cy="257" r="1.2" fill="var(--accent)" class="server-led-1"/>
      <rect x="79" y="270" width="66" height="25" rx="2" fill="var(--surface)" fill-opacity="0.07" stroke="var(--line)" stroke-width="0.7"/>
      <line x1="84" y1="277" x2="114" y2="277" stroke="var(--text)" stroke-width="1.2" opacity="0.25" stroke-linecap="round"/>
      <line x1="84" y1="282" x2="114" y2="282" stroke="var(--text)" stroke-width="1.2" opacity="0.25" stroke-linecap="round"/>
      <line x1="84" y1="287" x2="114" y2="287" stroke="var(--text)" stroke-width="1.2" opacity="0.25" stroke-linecap="round"/>
      <rect x="120" y="276" width="19" height="9" rx="1.5" fill="var(--surface)" fill-opacity="0.2"/>
      <line x1="123" y1="280.5" x2="135" y2="280.5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="124" cy="289" r="1.3" fill="var(--accent)" class="server-led-1"/>
      <circle cx="129" cy="289" r="1.3" fill="var(--accent)" class="server-led-2"/>
      <circle cx="134" cy="289" r="1.3" fill="#10b981" class="server-led-3"/>
      <rect x="79" y="298" width="66" height="25" rx="2" fill="var(--surface)" fill-opacity="0.07" stroke="var(--line)" stroke-width="0.7"/>
      <rect x="84" y="302" width="12" height="17" rx="1.5" fill="var(--surface)" fill-opacity="0.12" stroke="var(--line)" stroke-width="0.5"/>
      <rect x="99" y="302" width="12" height="17" rx="1.5" fill="var(--surface)" fill-opacity="0.12" stroke="var(--line)" stroke-width="0.5"/>
      <rect x="114" y="302" width="12" height="17" rx="1.5" fill="var(--surface)" fill-opacity="0.12" stroke="var(--line)" stroke-width="0.5"/>
      <rect x="129" y="302" width="12" height="17" rx="1.5" fill="var(--surface)" fill-opacity="0.12" stroke="var(--line)" stroke-width="0.5"/>
      <line x1="86" y1="306" x2="94" y2="306" stroke="var(--text)" stroke-width="1" opacity="0.3"/>
      <line x1="101" y1="306" x2="109" y2="306" stroke="var(--text)" stroke-width="1" opacity="0.3"/>
      <line x1="116" y1="306" x2="124" y2="306" stroke="var(--text)" stroke-width="1" opacity="0.3"/>
      <line x1="131" y1="306" x2="139" y2="306" stroke="var(--text)" stroke-width="1" opacity="0.3"/>
      <circle cx="90" cy="315" r="1.1" fill="var(--accent)" class="server-led-1"/>
      <circle cx="105" cy="315" r="1.1" fill="var(--accent)" class="server-led-2"/>
      <circle cx="120" cy="315" r="1.1" fill="var(--accent)" class="server-led-3"/>
      <circle cx="135" cy="315" r="1.1" fill="var(--accent)" class="server-led-1"/>
      <rect x="79" y="326" width="66" height="25" rx="2" fill="var(--surface)" fill-opacity="0.07" stroke="var(--line)" stroke-width="0.7"/>
      <line x1="84" y1="333" x2="116" y2="333" stroke="var(--text)" stroke-width="1.2" opacity="0.25" stroke-linecap="round"/>
      <line x1="84" y1="338" x2="116" y2="338" stroke="var(--text)" stroke-width="1.2" opacity="0.25" stroke-linecap="round"/>
      <line x1="84" y1="343" x2="116" y2="343" stroke="var(--text)" stroke-width="1.2" opacity="0.25" stroke-linecap="round"/>
      <rect x="122" y="333" width="18" height="11" rx="2" fill="var(--surface)" fill-opacity="0.12"/>
      <circle cx="127" cy="338.5" r="1.3" fill="var(--accent)" class="server-led-2"/>
      <circle cx="133" cy="338.5" r="1.3" fill="var(--accent)" class="server-led-1"/>
      <rect x="79" y="354" width="66" height="8" rx="2" fill="var(--surface)" fill-opacity="0.15"/>
      <circle cx="87" cy="358" r="1.2" fill="var(--accent)"/>
      <circle cx="92" cy="358" r="1.2" fill="var(--accent)"/>
      <line x1="102" y1="358" x2="138" y2="358" stroke="var(--text)" stroke-width="1" opacity="0.2" stroke-linecap="round"/>
      <rect x="77" y="369" width="13" height="4" rx="1.5" fill="var(--illus-server)"/>
      <rect x="134" y="369" width="13" height="4" rx="1.5" fill="var(--illus-server)"/>
    </g>
    <g id="armchair">
      <path d="M200 280 C185 190, 205 130, 270 130 C335 130, 355 190, 340 280 Z" fill="url(#errChairGrad)"/>
      <path d="M185 240 C180 240, 175 250, 175 270 C175 305, 195 320, 215 320 C222 320, 226 312, 226 300 C226 265, 205 240, 185 240 Z" fill="url(#errChairGrad)" stroke="var(--illus-chair-shadow)" stroke-width="1"/>
      <path d="M355 240 C360 240, 365 250, 365 270 C365 305, 345 320, 325 320 C318 320, 314 312, 314 300 C314 265, 335 240, 355 240 Z" fill="url(#errChairGrad)" stroke="var(--illus-chair-shadow)" stroke-width="1"/>
      <line x1="234" y1="300" x2="220" y2="368" stroke="var(--illus-chair-legs)" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="306" y1="300" x2="320" y2="368" stroke="var(--illus-chair-legs)" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="217" y1="300" x2="192" y2="374" stroke="var(--illus-chair-legs)" stroke-width="5" stroke-linecap="round"/>
      <line x1="323" y1="300" x2="348" y2="374" stroke="var(--illus-chair-legs)" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g id="mascot">
      <path d="M225 300 C210 240, 225 170, 270 170 C315 170, 330 240, 315 300 C305 325, 235 325, 225 300 Z" fill="url(#errMascotGrad)"/>
      <rect x="238" y="212" width="28" height="26" rx="8" fill="#ffffff" fill-opacity="0.92" stroke="var(--illus-glasses)" stroke-width="3"/>
      <rect x="274" y="212" width="28" height="26" rx="8" fill="#ffffff" fill-opacity="0.92" stroke="var(--illus-glasses)" stroke-width="3"/>
      <line x1="266" y1="223" x2="274" y2="223" stroke="var(--illus-glasses)" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="238" y1="223" x2="226" y2="228" stroke="var(--illus-glasses)" stroke-width="3" stroke-linecap="round"/>
      <line x1="302" y1="223" x2="314" y2="228" stroke="var(--illus-glasses)" stroke-width="3" stroke-linecap="round"/>
      <g class="mascot-blinking-eyes">
        <ellipse cx="254" cy="225" rx="5.5" ry="7" fill="#142822"/>
        <circle cx="252" cy="222" r="2.2" fill="#ffffff"/>
        <ellipse cx="286" cy="225" rx="5.5" ry="7" fill="#142822"/>
        <circle cx="284" cy="222" r="2.2" fill="#ffffff"/>
      </g>
      <path d="M266 244 Q272 250 278 244" stroke="var(--illus-glasses)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="236" cy="235" rx="4" ry="2" fill="#f87171" opacity="0.4"/>
      <ellipse cx="304" cy="235" rx="4" ry="2" fill="#f87171" opacity="0.4"/>

      <!-- LEFT ARM & CUP (Hand securely grabbing the steaming cup) -->
      <path id="kokoLeftArmPath" d="M220 262 C210 270, 208 280, 222 284" stroke="var(--illus-arms)" stroke-width="11" stroke-linecap="round" fill="none"/>
      <g id="kokoCoffeeMugGroup" transform="translate(230, 270)">
        <path d="M0 4 C-8 4, -8 16, 0 16" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M0 4 C-8 4, -8 16, 0 16" fill="none" stroke="var(--line-strong)" stroke-width="1.3" stroke-linecap="round"/>
        <rect x="0" y="0" width="18" height="22" rx="4" fill="#ffffff" stroke="var(--line-strong)" stroke-width="1.5"/>
        <path d="M5 -2 Q8 -6 5 -10" stroke="var(--muted)" stroke-width="1.4" stroke-linecap="round" fill="none" class="error-steam-1"/>
        <path d="M12 -3 Q15 -8 12 -13" stroke="var(--muted)" stroke-width="1.4" stroke-linecap="round" fill="none" class="error-steam-2"/>
      </g>
      <!-- Hand Paw wrapping and gripping the cup -->
      <g id="kokoLeftPaw">
        <ellipse cx="225" cy="281" rx="7" ry="8" fill="var(--illus-arms)"/>
        <path d="M224 274 C228 273, 233 273, 237 275" stroke="var(--illus-arms)" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <path d="M225 280 C230 279, 235 280, 238 282" stroke="var(--illus-arms)" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <path d="M224 286 C229 285, 234 286, 236 288" stroke="var(--illus-arms)" stroke-width="4.2" stroke-linecap="round" fill="none"/>
      </g>

      <!-- RIGHT ARM: RESTING (Down on cushion) -->
      <g id="errArmRightRest" class="arm-rest">
        <path d="M308 262 C316 268, 324 278, 320 292" stroke="var(--illus-arms)" stroke-width="11" stroke-linecap="round" fill="none"/>
        <ellipse cx="318" cy="292" rx="7" ry="6.5" fill="var(--illus-arms)"/>
        <path d="M315 290 C319 289, 323 290, 325 292" stroke="var(--illus-arms)" stroke-width="3" stroke-linecap="round" fill="none"/>
      </g>

      <!-- RIGHT ARM: WAVING (The exact previous waving hand from user screenshot!) -->
      <g id="errArmRightWave" class="arm-wave">
        <path d="M308 258 C320 252, 328 238, 332 218" stroke="var(--illus-arms)" stroke-width="11" stroke-linecap="round" fill="none"/>
        <ellipse cx="334" cy="214" rx="7.5" ry="8.5" fill="var(--illus-arms)"/>
        <circle cx="327" cy="215" r="3.2" fill="var(--illus-arms)"/>
        <rect x="330" y="202" width="3.5" height="9" rx="1.75" fill="var(--illus-arms)"/>
        <rect x="334" y="200" width="3.5" height="10" rx="1.75" fill="var(--illus-arms)"/>
        <rect x="338" y="202" width="3.5" height="8.5" rx="1.75" fill="var(--illus-arms)"/>
      </g>

      <!-- Feet -->
      <ellipse cx="248" cy="326" rx="12" ry="7" fill="var(--illus-arms)"/>
      <ellipse cx="292" cy="326" rx="12" ry="7" fill="var(--illus-arms)"/>
    </g>
    <path d="M192 300 C192 290, 205 285, 270 285 C335 285, 348 290, 348 300 C348 322, 335 336, 270 336 C205 336, 192 322, 192 300 Z" fill="url(#errCushionGrad)" stroke="var(--illus-chair-shadow)" stroke-width="1.5"/>
    <g transform="translate(415, 170)">
      <g class="plant-breeze">
        <path d="M30 150 C10 100, 0 50, 15 10 C25 60, 35 110, 30 150 Z" fill="var(--illus-plant-dark)"/>
        <path d="M22 80 C26 50, 25 30, 15 10" stroke="var(--illus-plant-light)" stroke-width="1" fill="none" opacity="0.6"/>
        <path d="M30 150 C20 90, 25 30, 34 -15 C45 30, 42 90, 30 150 Z" fill="var(--illus-plant-light)"/>
        <path d="M31 70 C33 30, 33 0, 34 -15" stroke="var(--illus-plant-light)" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M30 150 C40 100, 60 55, 55 18 C42 65, 38 115, 30 150 Z" fill="var(--illus-plant-dark)"/>
        <path d="M30 150 C5 125, -5 95, 2 65 C15 95, 25 125, 30 150 Z" fill="var(--illus-plant-light)"/>
        <path d="M30 150 C50 125, 68 100, 62 70 C48 100, 38 125, 30 150 Z" fill="var(--illus-plant-dark)"/>
      </g>
      <ellipse cx="30" cy="150" rx="22" ry="6" fill="var(--text)" opacity="0.1"/>
      <path d="M12 152 L16 200 C17 205, 43 205, 44 200 L48 152 Z" fill="var(--illus-pot)" stroke="var(--line)" stroke-width="1.5"/>
      <ellipse cx="30" cy="152" rx="18" ry="4" fill="#374151" opacity="0.3"/>
    </g>
  </svg>`;
}

export function errorPage(message, status = 500, retryAfter = 60, nonce = '', isDark = false) {
  const isRateLimit = Number(status) === 429;
  const isNotFound = Number(status) === 404;
  const isForbidden = Number(status) === 403;
  const isServerError = Number(status) >= 500;

  const pageTitle = isRateLimit ? 'Too Many Attempts' :
    isNotFound ? 'Page Not Found' :
    isForbidden ? 'Access Restricted' :
    isServerError ? 'Something Went Wrong' : 'Request Failed';

  const defaultDesc = isRateLimit ? 'You’ve made several attempts in a short time.<br>Wait a few minutes before trying again.' :
    isNotFound ? (message || 'The requested page or resource could not be found.') :
    isForbidden ? (message || 'You do not have administrative permissions to view this resource.') :
    isServerError ? (message || 'An unexpected system error occurred while processing your request.') :
    (message || 'The request could not be completed.');

  const descHtml = isRateLimit ? defaultDesc : e(message || defaultDesc);

  const seconds = typeof retryAfter === 'number' && retryAfter > 0 ? Math.floor(retryAfter) : 60;
  const initialM = Math.floor(seconds / 60);
  const initialS = seconds % 60;
  const initialTimeStr = `${initialM}:${initialS < 10 ? '0' : ''}${initialS} min`;

  const timeBadgeHtml = isRateLimit ? `
    <p class="error-page-time" id="neomail-rate-container">
      Try again in <strong id="neomail-rate-timer">${e(initialTimeStr)}</strong>
    </p>
  ` : '';

  const actionsHtml = isRateLimit ? `
    <div class="error-page-actions">
      <button type="button" class="button" id="btn-retry" onclick="location.reload()">
        ${icon('refresh')} Try Again
      </button>
      <a class="button secondary" href="/dashboard">Return to workspace</a>
    </div>
  ` : isServerError ? `
    <div class="error-page-actions">
      <button type="button" class="button" onclick="location.reload()">${icon('refresh')} Reload page</button>
      <a class="button secondary" href="/dashboard">Return to workspace</a>
    </div>
  ` : `
    <div class="error-page-actions">
      <a class="button" href="/dashboard">Return to workspace</a>
      <a class="button secondary" href="/login">Back to Sign In</a>
    </div>
  `;

  const pageScript = `
    <script ${nonce ? `nonce="${e(nonce)}"` : ''}>
      (function(){
        function uClk() {
          var d = new Date(), s = d.getSeconds(), m = d.getMinutes(), h = d.getHours();
          var sE = document.getElementById('clockSecondHand');
          var mE = document.getElementById('clockMinuteHand');
          var hE = document.getElementById('clockHourHand');
          if (sE) sE.setAttribute('transform', 'rotate(' + (s * 6) + ' 45 45)');
          if (mE) mE.setAttribute('transform', 'rotate(' + (m * 6 + s * 0.1) + ' 45 45)');
          if (hE) hE.setAttribute('transform', 'rotate(' + ((h % 12) * 30 + m * 0.5) + ' 45 45)');
        }
        uClk();
        setInterval(uClk, 1000);

        // Koko Automatic Mascot Animation:
        // 1. Welcoming wave on visit
        // 2. Hand rests down for 4.5 seconds
        // 3. Smooth coffee sip during rest
        // 4. Loops automatically
        var leftArmPath = document.getElementById('kokoLeftArmPath');
        var coffeeMugGroup = document.getElementById('kokoCoffeeMugGroup');
        var leftPaw = document.getElementById('kokoLeftPaw');

        var ARM_REST = {
          p0: [220, 262], p1: [210, 270], p2: [208, 280], p3: [222, 284],
          mug: [230, 270], rot: 0, paw: [0, 0]
        };
        var ARM_SIP = {
          p0: [220, 262], p1: [216, 252], p2: [230, 238], p3: [256, 244],
          mug: [256, 230], rot: 24, paw: [31, -38]
        };

        function lerp(a, b, t) { return a + (b - a) * t; }
        function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

        function renderArm(t) {
          if (!leftArmPath || !coffeeMugGroup || !leftPaw) return;
          var p0 = ARM_REST.p0;
          var p1 = [lerp(ARM_REST.p1[0], ARM_SIP.p1[0], t), lerp(ARM_REST.p1[1], ARM_SIP.p1[1], t)];
          var p2 = [lerp(ARM_REST.p2[0], ARM_SIP.p2[0], t), lerp(ARM_REST.p2[1], ARM_SIP.p2[1], t)];
          var p3 = [lerp(ARM_REST.p3[0], ARM_SIP.p3[0], t), lerp(ARM_REST.p3[1], ARM_SIP.p3[1], t)];
          var mug = [lerp(ARM_REST.mug[0], ARM_SIP.mug[0], t), lerp(ARM_REST.mug[1], ARM_SIP.mug[1], t)];
          var rot = lerp(ARM_REST.rot, ARM_SIP.rot, t);
          var paw = [lerp(ARM_REST.paw[0], ARM_SIP.paw[0], t), lerp(ARM_REST.paw[1], ARM_SIP.paw[1], t)];

          leftArmPath.setAttribute('d', 'M ' + p0[0] + ' ' + p0[1] + ' C ' + p1[0] + ' ' + p1[1] + ', ' + p2[0] + ' ' + p2[1] + ', ' + p3[0] + ' ' + p3[1]);
          coffeeMugGroup.setAttribute('transform', 'translate(' + mug[0] + ', ' + mug[1] + ') rotate(' + rot + ', 9, 11)');
          leftPaw.setAttribute('transform', 'translate(' + paw[0] + ', ' + paw[1] + ')');
        }

        function triggerWave(cb) {
          document.body.classList.add('is-waving');
          setTimeout(function() {
            document.body.classList.remove('is-waving');
            if (cb) cb();
          }, 1600);
        }

        function triggerSip(cb) {
          var start = performance.now();
          var dur = 2200;
          function step(now) {
            var el = now - start;
            if (el < 700) {
              renderArm(ease(el / 700));
            } else if (el < 1500) {
              renderArm(1);
            } else if (el < 2200) {
              renderArm(1 - ease((el - 1500) / 700));
            }
            if (el < dur) {
              requestAnimationFrame(step);
            } else {
              renderArm(0);
              if (cb) cb();
            }
          }
          requestAnimationFrame(step);
        }

        function runMascotCycle() {
          triggerWave(function() {
            // Right hand is now down on cushion. Stay down for 4.5 seconds (4500ms):
            setTimeout(function() {
              triggerSip();
            }, 600);

            setTimeout(function() {
              runMascotCycle();
            }, 4500);
          });
        }

        // Initial welcoming wave completes at 1600ms, then hand rests down for 4.5s with coffee sip
        setTimeout(function() {
          document.body.classList.remove('is-waving');
          setTimeout(function() {
            triggerSip();
          }, 600);
          setTimeout(function() {
            runMascotCycle();
          }, 4500);
        }, 1600);
        ${isRateLimit ? `
        var sec = ${seconds};
        var disp = document.getElementById('neomail-rate-timer');
        var container = document.getElementById('neomail-rate-container');
        var btn = document.getElementById('btn-retry');
        function markFinished() {
          if (container) {
            container.innerHTML = '<span style="color:var(--accent);font-weight:600">Ready — try now</span>';
          }
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '${icon('refresh')} Try Now';
            btn.focus();
          }
        }
        if (sec <= 0) {
          markFinished();
        } else if (disp) {
          function fmt(s) {
            var m = Math.floor(s / 60);
            var rem = s % 60;
            return m + ':' + (rem < 10 ? '0' : '') + rem + ' min';
          }
          var iv = setInterval(function() {
            sec--;
            if (sec <= 0) {
              clearInterval(iv);
              markFinished();
            } else {
              disp.textContent = fmt(sec);
            }
          }, 1000);
        }
        ` : ''}
      })();
    </script>
  `;

  const content = `
    <div class="error-page-wrapper">
      <div class="error-page-card">
        <div class="error-page-content">
          <a class="error-page-brand" href="/dashboard">
            <span class="brandmark">${neomailLogoSvg}</span>
            <div class="brand-text">
              <span class="brand-title">neo<span>Mailer</span></span>
              <span class="brand-sub">Mail Infrastructure</span>
            </div>
          </a>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <h1 class="error-page-title">${e(pageTitle)}</h1>
            <span class="tag ${isRateLimit ? 'warn' : isServerError ? 'danger' : 'secondary'}" style="font-size:12px;font-weight:700;padding:2px 8px;border-radius:var(--radius-xs)">${status}</span>
          </div>
          <p class="error-page-desc">${descHtml}</p>
          ${timeBadgeHtml}
          ${actionsHtml}
        </div>
        <div class="error-page-art">
          ${errorIllustrationSvg()}
        </div>
      </div>
    </div>
    ${pageScript}
  `;

  return document(pageTitle, content, nonce, isDark, 'is-waving');
}

export function accessLogin() {
  return document('Secure sign-in', `<div class="login">
    <div class="login-card loginform">
      <div class="logininner">
        ${neomailBrandBadge}
        <h1 class="login-card-title" style="text-align:center">Verified by Cloudflare Access</h1><!-- Welcome to NeoMail --><!-- Welcome to neoMail -->
        <p class="login-card-sub" style="text-align:center">Your identity has been verified through your corporate access policy.</p>
        <form method="post" action="/login">
          <button type="submit" class="button login-submit-btn">Continue to workspace ${icon('arrow')}</button>
        </form>
      </div>
    </div>
  </div>`);
}

function profileAvatar(profile, base = '/dashboard') {
  const name = profile?.display_name || 'Administrator';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(part => part[0] || '').join('').toUpperCase() || 'A';
  const v = profile?.updated_at || Date.now();
  return `<span class="avatar">${profile?.avatar_mime ? `<img src="${base}/profile-image?v=${e(v)}" alt="${e(name)} profile image" onerror="this.style.display='none';this.parentElement.textContent='${e(initials)}'">` : e(initials)}</span>`;
}

function profileSquircle(profile, base = '/dashboard') {
  const name = profile?.display_name || 'Administrator';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(part => part[0] || '').join('').toUpperCase() || 'A';
  const v = profile?.updated_at || Date.now();
  return `<div class="avatar-squircle" id="avatar-squircle-preview" title="Click to change photo" role="button" tabindex="0">${profile?.avatar_mime ? `<img src="${base}/profile-image?v=${e(v)}" alt="${e(name)} profile image" onerror="this.style.display='none';this.parentElement.textContent='${e(initials)}'">` : e(initials)}</div>`;
}

function profileSettings(sess) {
  const base = sess?.base || '/dashboard';
  const hasAvatar = !!sess.profile?.avatar_mime;
  return `<section class="panel" id="profile">
    <div class="panelhead">
      <div>
        <h2>Your profile</h2>
        <p>Edit your name and upload a photo or company logo for your neoMailer profile.</p>
      </div>
    </div>
    <div class="panelbody">
      <form method="post" action="${base}/profile" enctype="multipart/form-data">
        ${hidden(sess.csrf_token)}
        <div class="profile-photo-section">
          <label class="profile-photo-title">Profile photo</label>
          <div class="profile-photo-card">
            <div class="avatar-wrapper">
              ${profileSquircle(sess.profile, base)}
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
              <div id="profile-blob-url-row" style="display:none;align-items:center;gap:8px;margin-top:6px;background:var(--surface);padding:4px 10px;border-radius:6px;border:1px solid var(--line);font-size:11px;font-family:var(--mono)">
                <span class="tag good" style="font-size:9px;padding:1px 5px">BLOB PREVIEW</span>
                <code id="profile-blob-url-text" style="color:var(--accent);max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></code>
                <button type="button" id="btn-copy-profile-blob" class="button secondary small" style="padding:1px 6px;font-size:10px">Copy</button>
              </div>
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

export function healthPage(isDark = false) {
  return `<!doctype html>
<html lang="en" ${isDark ? 'data-theme="dark" class="dark"' : ''}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="neoMailer · System Status & Live Telemetry">
  <meta name="theme-color" content="#063b2c">
  <link rel="icon" type="image/svg+xml" href="${faviconUri}">
  <title>neoMailer · System Status</title>
  <script>
    try {
      var cf = localStorage.getItem('neomail_font_css');
      if (cf) {
        var s = document.createElement('style');
        s.id = 'neomail-fonts-cached';
        s.textContent = cf;
        document.head.appendChild(s);
      }
    } catch(e) {}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwgknk-6nFg.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500;600&display=swap">
  <style>
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
      color-scheme: dark;
      --bg: #131514;
      --surface: #1a1e1c;
      --surface-hover: #222825;
      --surface-active: #2a312d;
      --text: #f0ede6;
      --text-secondary: #c5cbc7;
      --muted: #8d9a92;
      --line: #2b332f;
      --line-strong: #3d4842;
      --accent: #10b981;
      --accent-hover: #059669;
      --accent-active: #047857;
      --tint: rgba(16, 185, 129, 0.12);
      --tint-strong: rgba(16, 185, 129, 0.22);
      --brand-dark: #063b2c;
      --radius-xs: 4px;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --font: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    :root[data-theme="light"], :root.light {
      color-scheme: light;
      --bg: #fbfaf8;
      --surface: #ffffff;
      --surface-hover: #f5f4f0;
      --text: #212624;
      --text-secondary: #4a544f;
      --muted: #69746e;
      --line: #dfddd7;
      --line-strong: #d2d0c8;
      --accent: #087d54;
      --accent-hover: #066b47;
      --tint: rgba(8, 125, 84, 0.08);
      --tint-strong: rgba(8, 125, 84, 0.16);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 32px 16px;
      -webkit-font-smoothing: antialiased;
    }
    @media (max-width: 640px) {
      body { padding: 20px 12px; }
    }
    .wrapper {
      max-width: 760px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    a { color: inherit; text-decoration: none; }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 2px;
      flex-wrap: wrap;
    }
    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brandmark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      flex-shrink: 0;
    }
    .brandmark svg {
      width: 44px;
      height: 30px;
      max-width: 44px;
      max-height: 32px;
      display: block;
    }
    .brand-title {
      font-size: 21px;
      font-weight: 800;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }
    .brand-title span { color: var(--accent); }
    .status-badge {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 7px;
      border-radius: 9999px;
      background: var(--tint);
      color: var(--accent);
      border: 1px solid var(--line);
      margin-left: 8px;
      vertical-align: middle;
    }
    .brand-desc {
      font-size: 11.5px;
      color: var(--muted);
      margin-top: 2px;
      font-weight: 600;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .button {
      font-size: 12.5px;
      font-weight: 600;
      padding: 6.5px 14px;
      border-radius: var(--radius-sm);
      background: var(--accent);
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease, transform 0.1s ease;
      font-family: inherit;
    }
    .button:hover {
      background: var(--accent-hover);
      color: #ffffff;
    }
    .button.secondary {
      background: var(--surface);
      border: 1px solid var(--line);
      color: var(--text-secondary);
    }
    .button.secondary:hover {
      background: var(--surface-hover);
      color: var(--text);
      border-color: var(--line-strong);
    }
    .button svg { width: 13px; height: 13px; }
    .hero-panel {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      padding: 20px 22px;
      position: relative;
    }
    .hero-top-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }
    .hero-icon-badge {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-sm);
      background: var(--tint);
      border: 1px solid var(--line);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .hero-icon-badge svg { width: 22px; height: 22px; }
    .hero-text-wrap {
      flex: 1;
      min-width: 0;
    }
    .hero-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .hero-title {
      font-size: 19px;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.02em;
      line-height: 1.25;
    }
    .live-chip {
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 9999px;
      padding: 3px 9px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    .dot-green {
      width: 6.5px;
      height: 6.5px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent);
      display: inline-block;
      animation: statusBlink 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      flex-shrink: 0;
    }
    @keyframes statusBlink {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.9), 0 0 3px #10b981;
      }
      50% {
        opacity: 0.25;
        transform: scale(0.8);
        box-shadow: 0 0 2px rgba(16, 185, 129, 0.2);
      }
    }
    .hero-sub {
      font-size: 12.5px;
      color: var(--muted);
      margin-top: 4px;
      font-weight: 400;
      line-height: 1.5;
    }
    .btn-refresh {
      background: var(--bg);
      border: 1px solid var(--line);
      color: var(--muted);
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .btn-refresh:hover {
      background: var(--surface-hover);
      color: var(--text);
      border-color: var(--line-strong);
    }
    .btn-refresh svg { width: 14px; height: 14px; }
    .services-panel {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .service-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      gap: 14px;
      border-bottom: 1px solid var(--line);
      transition: background 0.12s ease;
    }
    .service-row:last-child { border-bottom: none; }
    .service-row:hover {
      background: var(--surface-hover);
    }
    .service-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .service-icon-sm {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      background: var(--bg);
      border: 1px solid var(--line);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .service-icon-sm svg { width: 14px; height: 14px; }
    .service-name {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.01em;
    }
    .service-detail {
      font-size: 12px;
      color: var(--muted);
      margin-top: 1px;
    }
    .service-detail code {
      font-family: var(--mono);
      color: var(--accent);
      background: var(--bg);
      padding: 1px 5px;
      border-radius: 4px;
      border: 1px solid var(--line);
      font-size: 11px;
    }
    .service-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--accent);
      flex-shrink: 0;
    }
    .curl-card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .curl-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .curl-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
    }
    .curl-copy-btn {
      background: transparent;
      border: 1px solid transparent;
      color: var(--accent);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      transition: all 0.15s ease;
      font-family: inherit;
    }
    .curl-copy-btn:hover {
      background: var(--tint);
      color: var(--accent-hover);
    }
    .curl-copy-btn.copied {
      color: var(--accent);
      background: var(--tint);
      border-color: var(--line-strong);
    }
    .curl-copy-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
    .curl-box {
      background: #0d100e;
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      padding: 11px 13px;
      font-family: var(--mono);
      font-size: 12px;
      color: #a7f3d0;
      overflow-x: auto;
      white-space: nowrap;
    }
    .curl-desc {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.5;
    }
    .curl-desc code {
      font-family: var(--mono);
      color: var(--accent);
      font-size: 11.5px;
    }
    .footer {
      border-top: 1px solid var(--line);
      padding-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--muted);
      font-weight: 500;
      flex-wrap: wrap;
      gap: 12px;
    }
    .footer-mono {
      font-family: var(--mono);
      font-size: 11px;
      display: flex;
      gap: 8px;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .rotating { animation: spin 0.6s linear infinite; }
  </style>
</head>
<body>
  <div class="wrapper">
    <header class="header">
      <div class="brand-wrap">
        <span class="brandmark">${neomailerLogoSvg}</span>
        <div>
          <div style="display: flex; align-items: center;">
            <span class="brand-title">neo<span>Mailer</span></span>
            <span class="status-badge">System Status</span>
          </div>
          <p class="brand-desc">Transactional email gateway & dispatch infrastructure</p>
        </div>
      </div>

      <div class="header-actions">
        <a href="/docs" target="_blank" class="button secondary">
          <span>Documentation</span>
          <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
        <a href="/login" class="button">
          <span>Console</span>
          <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
    </header>

    <div class="hero-panel">
      <div class="hero-top-row">
        <div class="hero-icon-badge">
          <svg fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <div class="hero-text-wrap">
          <div class="hero-title-row">
            <h1 class="hero-title">All Systems Operational</h1>
            <span class="live-chip">
              <span class="dot-green"></span>
              <span id="live-timer">Live · Just now</span>
            </span>
          </div>
          <p class="hero-sub">The dispatch gateway, database ledger, and API ingress are operating with 100% availability.</p>
        </div>
        <button id="btn-refresh" onclick="simulateRefresh()" class="btn-refresh" title="Refresh health telemetry" aria-label="Refresh health telemetry">
          <svg id="refresh-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </button>
      </div>
    </div>

    <div class="services-panel">
      <div class="service-row">
        <div class="service-left">
          <div class="service-icon-sm">
            <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <div class="service-name">Dispatch API Gateway</div>
            <div class="service-detail">Accepting authenticated <code>/api/v1/send</code> transactional payloads</div>
          </div>
        </div>
        <div class="service-status">
          <span class="dot-green"></span>
          <span>Operational</span>
        </div>
      </div>

      <div class="service-row">
        <div class="service-left">
          <div class="service-icon-sm">
            <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <div>
            <div class="service-name">Global Edge Network</div>
            <div class="service-detail">Anycast edge nodes with sub-5ms cold startup & low-latency routing</div>
          </div>
        </div>
        <div class="service-status">
          <span class="dot-green"></span>
          <span>Operational</span>
        </div>
      </div>

      <div class="service-row">
        <div class="service-left">
          <div class="service-icon-sm">
            <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7M4 7c0-2 1.5-3 3.5-3h9c2 0 3.5 1 3.5 3M4 7c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3"/></svg>
          </div>
          <div>
            <div class="service-name">Encrypted Storage & Ledger</div>
            <div class="service-detail">Distributed SQLite database with zero-trust authenticated encryption</div>
          </div>
        </div>
        <div class="service-status">
          <span class="dot-green"></span>
          <span>Operational</span>
        </div>
      </div>

      <div class="service-row">
        <div class="service-left">
          <div class="service-icon-sm">
            <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <div>
            <div class="service-name">Zero-Trust Security & Rate Limiting</div>
            <div class="service-detail">Replay defense, brute-force mitigation, and verified token validation</div>
          </div>
        </div>
        <div class="service-status">
          <span class="dot-green"></span>
          <span>Active</span>
        </div>
      </div>
    </div>

    <div class="curl-card">
      <div class="curl-head">
        <span class="curl-title">Automated Health Check Endpoint</span>
        <button id="btn-copy-curl" onclick="copyEndpoint()" class="curl-copy-btn" title="Copy curl command">
          <span id="copy-icon">
            <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </span>
          <span id="copy-label">Copy JSON curl</span>
        </button>
      </div>

      <div class="curl-box">
        <code>curl -sS -H "Accept: application/json" https://mail.neopathshala.com/health</code>
      </div>
      <p class="curl-desc">
        Uptime monitors (BetterStack, Datadog, UptimeRobot) requesting <code>application/json</code> receive a clean JSON payload <code>{"status":"ok","service":"neoMailer"}</code> with HTTP 200.
      </p>
    </div>

    <footer class="footer">
      <div>
        <span>neoMailer · Private Transactional Email Gateway</span>
      </div>
      <div class="footer-mono">
        <span>mail.neopathshala.com</span>
      </div>
    </footer>
  </div>

  <script>
    function simulateRefresh() {
      var icon = document.getElementById('refresh-icon');
      var timer = document.getElementById('live-timer');
      if (icon) icon.classList.add('rotating');
      if (timer) timer.textContent = 'Checking...';
      setTimeout(function() {
        if (icon) icon.classList.remove('rotating');
        if (timer) timer.textContent = 'Live · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }, 350);
    }

    function copyEndpoint() {
      var cmd = 'curl -sS -H "Accept: application/json" https://mail.neopathshala.com/health';
      var lbl = document.getElementById('copy-label');
      var iconWrap = document.getElementById('copy-icon');
      var btn = document.getElementById('btn-copy-curl');

      function success() {
        if (lbl) lbl.textContent = 'Copied';
        if (iconWrap) {
          iconWrap.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>';
        }
        if (btn) btn.classList.add('copied');
        setTimeout(function() {
          if (lbl) lbl.textContent = 'Copy JSON curl';
          if (iconWrap) {
            iconWrap.innerHTML = '<svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>';
          }
          if (btn) btn.classList.remove('copied');
        }, 2200);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmd).then(success).catch(function() {
          fallbackCopy(cmd, success);
        });
      } else {
        fallbackCopy(cmd, success);
      }
    }

    function fallbackCopy(text, cb) {
      try {
        var el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        cb();
      } catch (err) {
        cb();
      }
    }

    async function cacheFontsLocally() {
      try {
        if (localStorage.getItem('neomail_font_css')) return;
        var pjsUrl = 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2';
        var jbmUrl = 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwgknk-6nFg.woff2';
        var responses = await Promise.all([fetch(pjsUrl), fetch(jbmUrl)]);
        if (!responses[0].ok || !responses[1].ok) return;
        var buffers = await Promise.all([responses[0].arrayBuffer(), responses[1].arrayBuffer()]);

        function bufToB64(buf) {
          var u8 = new Uint8Array(buf);
          var bin = '';
          var chunk = 8192;
          for (var i = 0; i < u8.length; i += chunk) {
            bin += String.fromCharCode.apply(null, u8.subarray(i, i + chunk));
          }
          return btoa(bin);
        }

        var pjsB64 = bufToB64(buffers[0]);
        var jbmB64 = bufToB64(buffers[1]);

        var fontCss = '@font-face{font-family:\'Plus Jakarta Sans\';font-style:normal;font-weight:300 800;font-display:block;src:url(data:font/woff2;base64,' + pjsB64 + ') format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}' +
          '@font-face{font-family:\'JetBrains Mono\';font-style:normal;font-weight:400 600;font-display:block;src:url(data:font/woff2;base64,' + jbmB64 + ') format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}';

        localStorage.setItem('neomail_font_css', fontCss);
        if (!document.getElementById('neomail-fonts-cached')) {
          var s = document.createElement('style');
          s.id = 'neomail-fonts-cached';
          s.textContent = fontCss;
          document.head.appendChild(s);
        }
      } catch (e) {}
    }
    cacheFontsLocally();
  </script>
</body>
</html>`;
}
