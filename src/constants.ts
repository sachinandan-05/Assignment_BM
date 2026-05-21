import type { NavItem, TimeRange } from '@/types';

// ═══════════════════════════════════════════════════════
// PROTON FINANCE — APPLICATION CONSTANTS
// ═══════════════════════════════════════════════════════

export const APP_CONFIG = {
  name: 'Proton Finance',
  tagline: 'Wealth Curator',
  version: '1.0.0',
  description: 'Institutional-grade portfolio intelligence & wealth management',
  currency: 'USD' as const,
  locale: 'en-US',
} as const;

export const ROUTES = {
  DASHBOARD: '/',
  PORTFOLIO: '/portfolio',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  INSIGHTS: '/insights',
  WATCHLIST: '/watchlist',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { id: 'portfolio', label: 'Portfolio', path: ROUTES.PORTFOLIO, icon: 'Briefcase' },
  { id: 'transactions', label: 'Transactions', path: ROUTES.TRANSACTIONS, icon: 'ArrowLeftRight' },
  { id: 'budgets', label: 'Budgets', path: ROUTES.BUDGETS, icon: 'PieChart' },
  { id: 'insights', label: 'Insights', path: ROUTES.INSIGHTS, icon: 'Sparkles' },
  { id: 'watchlist', label: 'Watchlist', path: ROUTES.WATCHLIST, icon: 'Eye' },
  { id: 'analytics', label: 'Analytics', path: ROUTES.ANALYTICS, icon: 'BarChart3' },
  { id: 'settings', label: 'Settings', path: ROUTES.SETTINGS, icon: 'Settings' },
] as const;

export const TIME_RANGES: readonly { label: string; value: TimeRange }[] = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: '1Y', value: '1Y' },
  { label: '5Y', value: '5Y' },
  { label: 'All', value: 'ALL' },
] as const;

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#60a5fa',
  tertiary: '#93c5fd',
  gold: '#c5943a',
  goldLight: '#d4a574',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  palette: [
    '#3b82f6',
    '#60a5fa',
    '#c5943a',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#d4a574',
  ],
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const SIDEBAR_WIDTH = {
  collapsed: 72,
  expanded: 260,
} as const;

export const QUERY_KEYS = {
  portfolio: ['portfolio'] as const,
  holdings: ['holdings'] as const,
  transactions: ['transactions'] as const,
  budgets: ['budgets'] as const,
  insights: ['ai-insights'] as const,
  sentiment: ['market-sentiment'] as const,
  alerts: ['alerts'] as const,
  allocation: ['allocation'] as const,
  watchlist: ['watchlist'] as const,
  marketIndices: ['market-indices'] as const,
  performance: ['performance'] as const,
  statCards: ['stat-cards'] as const,
  notifications: ['notifications'] as const,
} as const;

// ═══════════════════════════════════════════════════════
// MOTION — Easing curves, page transitions, and variants
// ═══════════════════════════════════════════════════════

export const ANIMATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  easeOut: [0.22, 1, 0.36, 1] as const,
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  springGentle: { type: 'spring' as const, stiffness: 200, damping: 25 },
} as const;

export const EASING = {
  soft: [0.4, 0, 0.2, 1],
  gentle: [0.22, 1, 0.36, 1],
  bounce: [0.175, 0.885, 0.32, 1.275],
  out: [0, 0, 0.2, 1],
} as const;

export const TRANSITIONS = {
  page: {
    initial: { opacity: 0, y: 10, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -10, filter: 'blur(10px)' },
    transition: { duration: 0.4, ease: EASING.gentle },
  },
  stagger: {
    animate: {
      transition: { staggerChildren: 0.05 },
    },
  },
  card: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: EASING.soft },
    whileHover: {
      y: -4,
      scale: 1.01,
      boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(59, 130, 246, 0.1)',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  },
} as const;

export const VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: EASING.gentle },
  },
  list: {
    container: {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    },
    item: {
      hidden: { opacity: 0, x: -10 },
      show: { opacity: 1, x: 0 },
    },
  },
} as const;
