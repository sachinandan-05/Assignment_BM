import { useEffect, useState } from 'react';
import { Bell, Menu, Moon, Search, Settings, Sun, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Tooltip } from '@/components/ui/Tooltip';
import { Tabs } from '@/components/ui/Tabs';
import { useAppStore } from '@/store';
import { useNotifications } from '@/hooks/useFinance';
import { useDebounce } from '@/hooks/useDebounce';
import { useAnalytics } from '@/hooks/useAnalytics';
import { cn } from '@/utils';

const TOP_TABS = [
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'markets', label: 'Markets' },
] as const;

export function TopNavbar() {
  const [activeTab, setActiveTab] = useState<string>('portfolio');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [draftQuery, setDraftQuery] = useState('');

  const {
    setSearchQuery,
    theme,
    setTheme,
    notificationPanelOpen,
    setNotificationPanelOpen,
    toggleSidebar,
  } = useAppStore();

  const { data: notifications } = useNotifications();
  const { trackEvent, EVENTS } = useAnalytics();

  // Debounce the search input → push to global store + GA event
  const debouncedQuery = useDebounce(draftQuery, 300);
  useEffect(() => {
    setSearchQuery(debouncedQuery);
    if (debouncedQuery.trim().length >= 2) {
      trackEvent(EVENTS.SEARCH_USAGE, { length: debouncedQuery.length });
    }
  }, [debouncedQuery, setSearchQuery, trackEvent, EVENTS]);

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
  const isDark = theme === 'dark';
  const ThemeIcon = isDark ? Sun : Moon;

  const handleThemeToggle = () => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    trackEvent(EVENTS.THEME_TOGGLE, { to: next });
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 shrink-0',
        'h-204px md:h-20px-3 sm:px-4 md:px-6',
        'border-b border-edge-subtle bg-bg/80 backdrop-blur-xl',
        'flex items-center gap-3',
      )}
    >
      {/* Sidebar toggle (mobile) */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden shrink-0"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Brand mini (mobile only — sidebar isn't visible) */}
      <Link
        to="/"
        className="md:hidden flex items-center gap-2 shrink-0"
        aria-label="Proton Finance home"
      >
        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-glow-blue">
          <span className="text-xs font-bold text-white">P</span>
        </span>
        <span className="text-body-md font-bold text-text-primary tracking-tight">Proton</span>
      </Link>

      {/* Search (md+) */}
      <div className="hidden md:block w-full max-w-[260px] lg:max-w-[320px]">
        <SearchBar
          value={draftQuery}
          onChange={setDraftQuery}
          placeholder="Search portfolio or markets…"
          showShortcut={false}
        />
      </div>

      {/* Top tabs (lg+) */}
      <nav
        className="hidden lg:flex flex-1 justify-center"
        aria-label="Section view"
      >
        <Tabs
          tabs={TOP_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="underline"
          className="h-20 border-none"
        />
      </nav>

      {/* Spacer when tabs are hidden, keeps actions right-aligned */}
      <div className="flex-1 lg:hidden" />

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Search trigger (mobile only) */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setMobileSearchOpen((v) => !v)}
          aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
          aria-expanded={mobileSearchOpen}
        >
          {mobileSearchOpen ? <X className="h-8 w-8" /> : <Search className="h-4 w-4" />}
        </Button>

        <Tooltip content={isDark ? 'Light mode' : 'Dark mode'}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleThemeToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <ThemeIcon className="h-8 w-8 text-text-muted" />
          </Button>
        </Tooltip>

        <Tooltip content="Notifications">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
            className="relative"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : 'Notifications'
            }
          >
            <Bell className="h-8 w-8 text-text-muted" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-gold-500 shadow-glow-gold flex items-center justify-center text-[9px] font-bold text-white"
                aria-hidden="true"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </Tooltip>

        <Tooltip content="Settings">
          <Link
            to="/settings"
            className={cn(
              'hidden sm:inline-flex items-center justify-center h-8 w-8 rounded-lg',
              'text-text-muted hover:text-text-secondary hover:bg-surface-mid transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
            )}
            aria-label="Settings"
          >
            <Settings className="h-8 w-8" />
          </Link>
        </Tooltip>

        {/* Profile */}
        <div className="ml-1 sm:ml-2 sm:pl-3 sm:border-l sm:border-edge-subtle flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden lg:block">
            <div className="text-label-sm font-semibold text-text-primary leading-tight">
              Sachinandan
            </div>
            <div className="text-[10px] text-gold-500 font-bold uppercase tracking-wider">
              Private Client
            </div>
          </div>
          <button
            type="button"
            aria-label="Open profile menu"
            className={cn(
              'w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800',
              'flex items-center justify-center text-xs font-bold text-white',
              'ring-1 ring-white/10 shadow-lg cursor-pointer',
              'transition-transform hover:scale-105 active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
            )}
          >
            SN
          </button>
        </div>
      </div>

      {/* Mobile search drawer */}
      {mobileSearchOpen && (
        <div className="absolute left-0 right-0 top-full md:hidden border-b border-edge-subtle bg-bg/95 backdrop-blur-xl px-3 py-3">
          <SearchBar
            value={draftQuery}
            onChange={setDraftQuery}
            placeholder="Search portfolio or markets…"
            showShortcut={false}
          />
        </div>
      )}
    </header>
  );
}
