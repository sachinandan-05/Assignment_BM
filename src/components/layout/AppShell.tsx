import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { PageTracker } from './PageTracker';
import { useAppStore } from '@/store';

const MOBILE_BREAKPOINT = 768;

export function AppShell() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const location = useLocation();

  // Sync sidebar open state with viewport size.
  useEffect(() => {
    const sync = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      useAppStore.setState({ sidebarOpen: !isMobile });
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  // Auto-close drawer on route change (mobile only).
  useEffect(() => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      useAppStore.setState({ sidebarOpen: false });
    }
  }, [location.pathname]);

  // Lock body scroll while mobile drawer is open.
  useEffect(() => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return;
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-text-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNavbar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10"
        >
          <Outlet />
        </main>
      </div>
      <PageTracker />
    </div>
  );
}
