import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  robots?: string;
  canonical?: string;
}

export function useDocumentMeta({ title, description, robots, canonical }: MetaOptions) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const descriptionMeta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    if (description) {
      descriptionMeta.setAttribute('name', 'description');
      descriptionMeta.setAttribute('content', description);
      if (!descriptionMeta.parentNode) {
        document.head.appendChild(descriptionMeta);
      }
    }

    if (robots) {
      let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', robots);
    }

    if (canonical) {
      let canonicalMeta = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalMeta) {
        canonicalMeta = document.createElement('link');
        canonicalMeta.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalMeta);
      }
      canonicalMeta.setAttribute('href', canonical);
    }
  }, [title, description, robots, canonical]);
}
