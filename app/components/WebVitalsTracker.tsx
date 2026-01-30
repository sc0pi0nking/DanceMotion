'use client';

import { useEffect } from 'react';

/**
 * Track Core Web Vitals for performance monitoring
 * Using performance observer API
 */
export function WebVitalsTracker() {
  useEffect(() => {
    // Track Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log('Paint timing:', {
              name: entry.name,
              startTime: Math.round(entry.startTime),
              duration: Math.round(entry.duration),
            });
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });

        const lcpObserver = new PerformanceObserver((list) => {
          const lastEntry = list.getEntries().pop() as any;
          if (lastEntry) {
            console.log('LCP:', Math.round(lastEntry.renderTime || lastEntry.loadTime));
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          console.log('CLS:', Math.round(clsValue * 100) / 100);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance observer error:', error);
      }
    }

    // Track First Input Delay via navigation timing
    if ('navigation' in window.performance) {
      window.addEventListener(
        'load',
        () => {
          const perfData = (window.performance as any).timing;
          if (perfData) {
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('Performance metrics:', {
              pageLoadTime: Math.round(pageLoadTime),
              connectTime: Math.round(connectTime),
              renderTime: Math.round(renderTime),
            });
          }
        },
        false
      );
    }
  }, []);

  return null;
}
