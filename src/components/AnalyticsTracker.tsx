'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const hasTrackedSession = useRef(false)
  const startTime = useRef(Date.now())

  useEffect(() => {
    // Only track once per session on initial load
    if (hasTrackedSession.current) return;
    
    const trackVisit = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const { collection, addDoc } = await import('firebase/firestore');
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        await addDoc(collection(db, 'market_insights'), {
          type: 'visit',
          pathname,
          userAgent: navigator.userAgent,
          isMobile,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          language: navigator.language,
          referrer: document.referrer || 'direct',
          timestamp: new Date().toISOString()
        });
        
        hasTrackedSession.current = true;
      } catch (e) {
        console.error("Analytics tracking failed", e);
      }
    };
    
    // Slight delay to not block rendering
    const timer = setTimeout(trackVisit, 2000);
    return () => clearTimeout(timer);
  }, []); // Run once on mount

  // Track page views when pathname changes
  useEffect(() => {
    if (!hasTrackedSession.current) return; // Skip first load, handled above
    
    const trackPageView = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const { collection, addDoc } = await import('firebase/firestore');
        
        await addDoc(collection(db, 'market_insights'), {
          type: 'pageview',
          pathname,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        // Silent fail for analytics
      }
    };
    
    trackPageView();
  }, [pathname]);

  // Track time spent when leaving
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      // Beacon API is better for unload events, but standard fetch works in modern browsers
      const data = JSON.stringify({
        timeSpentSeconds: timeSpent,
        pathname,
        timestamp: new Date().toISOString()
      });
      // Try to send via beacon if possible, otherwise we miss this data point
      if (navigator.sendBeacon) {
        // We can't easily use sendBeacon with Firestore REST directly without auth, 
        // but we could set up an API route for it later.
        // For now we just skip unload tracking or do a quick fetch
        fetch('/api/analytics', { method: 'POST', body: data, keepalive: true }).catch(() => {});
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pathname]);

  return null; // Invisible component
}
