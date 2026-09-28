import type { ReactNode } from 'react';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';

type RevealProps = { children: ReactNode; className?: string; delay?: number };

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  return <LazyMotion features={domAnimation}><m.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.48, delay, ease: [0.2, 0.7, 0.2, 1] }}>{children}</m.div></LazyMotion>;
}
