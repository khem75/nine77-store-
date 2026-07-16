'use client';

import { useCallback } from 'react';

// Log formatted messages in console for local validation
const logEventToConsole = (name: string, props?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `%c[Analytics] ${name}`,
      'color: #c8a84b; font-weight: bold; background: #121008; padding: 2px 6px; border-radius: 4px;',
      props
    );
  }
};

/**
 * Global function to track hero-related events.
 * Can be imported anywhere in client files.
 */
export const trackHeroEvent = (eventName: string, properties?: Record<string, any>) => {
  logEventToConsole(eventName, properties);

  try {
    // Dynamically attempt to track on vercel analytics if loaded
    import('@vercel/analytics').then((va) => {
      va.track(eventName, properties);
    }).catch(() => {
      // Ignored if package fails to load dynamically
    });
  } catch (err) {
    // Catch-all to keep component working
  }
};

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    trackHeroEvent(eventName, properties);
  }, []);

  return { trackEvent };
}
