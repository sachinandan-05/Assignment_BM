import ReactGA from 'react-ga4';

// ═══════════════════════════════════════════════════════
// GOOGLE ANALYTICS (GA4) – Event Tracking Utility
// ═══════════════════════════════════════════════════════

export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual ID in production

/**
 * Predefined analytics events for consistent tracking.
 */
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  SEARCH_USAGE: 'search_usage',
  EXPORT_CSV: 'export_csv_click',
  EXECUTE_STRATEGY: 'execute_strategy_click',
  FILTER_INTERACTION: 'filter_interaction',
  NAV_EVENT: 'navigation_event',
  AI_INSIGHT_CLICK: 'ai_insight_click',
  THEME_TOGGLE: 'theme_toggle',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Initialize Google Analytics 4.
 * Call once at app startup (App.tsx).
 */
export function initGA(): void {
  try {
    ReactGA.initialize(GA_MEASUREMENT_ID);

    if (import.meta.env.DEV) {
      console.log('[Analytics] GA4 initialized');
    }
  } catch (error) {
    console.warn('[Analytics] GA4 initialization failed:', error);
  }
}

/**
 * Track a custom event with optional properties.
 */
export function trackGAEvent(
  eventName: AnalyticsEventName,
  params?: Record<string, unknown>,
): void {
  ReactGA.event(eventName, params);

  if (import.meta.env.DEV) {
    console.log(`[Analytics] Event: ${eventName}`, params);
  }
}

/**
 * Track a page view.
 */
export function trackGAPageView(path: string): void {
  ReactGA.send({ hitType: 'pageview', page: path });

  if (import.meta.env.DEV) {
    console.log(`[Analytics] PageView: ${path}`);
  }
}
