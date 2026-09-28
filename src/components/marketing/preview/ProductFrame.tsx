import type { ReactNode } from 'react';

type ProductFrameProps = { children: ReactNode; property?: string };

export default function ProductFrame({ children, property = 'The Fern Residency' }: ProductFrameProps) {
  return <div className="mk-product-frame"><div className="mk-product-bar"><span className="mk-product-property">{property}</span><span className="mk-sample-label">Sample data</span></div>{children}</div>;
}
