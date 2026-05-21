import { useCallback } from 'react';
import {
  trackGAEvent,
  trackGAPageView,
  ANALYTICS_EVENTS,
  type AnalyticsEventName,
} from '@/utils/analytics';

/**
 * useAnalytics – Encapsulates GA4 event tracking.
 *
 * Provides memoized helpers for tracking page views and
 * custom user interactions throughout the application.
 *
 * @returns Object with trackEvent, trackPageView, and EVENTS constants.
 *
 * @example
 * const { trackEvent, trackPageView, EVENTS } = useAnalytics();
 *
 * trackPageView('/dashboard');
 * trackEvent(EVENTS.EXECUTE_STRATEGY, { strategy: 'rebalance' });
 */
export function useAnalytics() {
  const trackEvent = useCallback(
    (event: AnalyticsEventName, properties?: Record<string, unknown>) => {
      trackGAEvent(event, properties);
    },
    [],
  );

  const trackPageView = useCallback((path: string) => {
    trackGAPageView(path);
  }, []);

  return { trackEvent, trackPageView, EVENTS: ANALYTICS_EVENTS } as const;
}
