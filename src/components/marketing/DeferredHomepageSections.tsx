import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const HomepageContent = lazy(() => import('./HomepageContent'));

export default function DeferredHomepageSections() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const target = triggerRef.current;
    if (!target) return;
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: '1200px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return <div ref={triggerRef}>{shouldLoad && <Suspense fallback={<div className="mk-belowfold-loading" aria-hidden="true" />}><HomepageContent /></Suspense>}</div>;
}
