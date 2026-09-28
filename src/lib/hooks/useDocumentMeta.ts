import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  robots?: string;
  canonical?: string;
}

export function useDocumentMeta({ title, description, robots, canonical }: MetaOptions) {
  useEffect(() => {
    const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (title) {
      document.title = title;
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }

    const descriptionMeta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    if (description) {
      descriptionMeta.setAttribute('name', 'description');
      descriptionMeta.setAttribute('content', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
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
      const siteOrigin = new URL(canonical, window.location.origin).origin;
      setMeta('property', 'og:url', canonical);
      setMeta('property', 'og:image', `${siteOrigin}/og-image.svg`);
      setMeta('name', 'twitter:image', `${siteOrigin}/og-image.svg`);
    }
  }, [title, description, robots, canonical]);
}
