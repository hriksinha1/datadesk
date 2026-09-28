import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandMark from './BrandMark';

const productLinks = [
  ['Today', '#today'], ['Bookings', '#bookings'], ['Calendar', '#calendar'], ['Payments', '#payments'], ['Portfolio', '#portfolio'],
] as const;
const solutionLinks = [['Hotels', '#use-cases'], ['Homestays & lodges', '#use-cases'], ['Hostels & dorms', '#use-cases'], ['Small resorts', '#use-cases']] as const;

export default function MarketingHeader() {
  const [openMenu, setOpenMenu] = useState<'product' | 'solutions' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0.03 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    mobileRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
      }
      if (event.key === 'Tab' && mobileRef.current) {
        const items = [...mobileRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!openMenu) return;
    const handleOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const items = menuRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]');
        if (!items?.length) return;
        event.preventDefault();
        const current = [...items].indexOf(document.activeElement as HTMLAnchorElement);
        const next = event.key === 'ArrowDown' ? (current + 1) % items.length : (current <= 0 ? items.length - 1 : current - 1);
        items[next].focus();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openMenu]);

  const renderMenu = (type: 'product' | 'solutions', links: ReadonlyArray<readonly [string, string]>) => (
    <div className="mk-nav-dropdown">
      <button ref={menuButtonRef} className="mk-nav-trigger" type="button" aria-expanded={openMenu === type} aria-controls={`${type}-nav-menu`} onClick={(event) => { menuButtonRef.current = event.currentTarget; setOpenMenu(openMenu === type ? null : type); }}>
        {type === 'product' ? 'Product' : 'For your property'}<ChevronDown size={14} aria-hidden="true" />
      </button>
      {openMenu === type && <div className="mk-nav-menu" id={`${type}-nav-menu`} role="menu">{links.map(([label, href]) => <a key={label} href={href} role="menuitem" onClick={() => setOpenMenu(null)}>{label}</a>)}</div>}
    </div>
  );

  return (
    <header className={`mk-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="mk-shell mk-header-inner">
        <Link to="/" className="mk-brand" aria-label="MyTrackYo home"><BrandMark size={32} /><span>MyTrackYo</span></Link>
        <nav ref={menuRef} className="mk-desktop-nav" aria-label="Main navigation">
          {renderMenu('product', productLinks)}
          {renderMenu('solutions', solutionLinks)}
          <a href="#morning">How it works</a>
          <a href="#why">Why it exists</a>
        </nav>
        <div className="mk-header-actions">
          <Link className="mk-login-link" to="/login">Log in</Link>
          <Link className="mk-button-primary mk-header-cta" to={user ? '/app' : '/signup'}>{user ? 'Open workspace' : 'Create workspace'}</Link>
        </div>
        <button ref={mobileButtonRef} className="mk-mobile-trigger" type="button" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(true)}><Menu aria-hidden="true" /></button>
      </div>
      {mobileOpen && <div className="mk-mobile-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileOpen(false); }}>
        <div id="mobile-navigation" ref={mobileRef} className="mk-mobile-dialog" role="dialog" aria-modal="true" aria-labelledby="mobile-nav-title">
          <div className="mk-mobile-dialog-head"><span id="mobile-nav-title">Explore MyTrackYo</span><button type="button" aria-label="Close navigation" onClick={() => { setMobileOpen(false); mobileButtonRef.current?.focus(); }}><X aria-hidden="true" /></button></div>
          <nav aria-label="Mobile navigation" className="mk-mobile-links">
            {productLinks.map(([label, href]) => <a key={label} href={href} onClick={() => setMobileOpen(false)}>{label}</a>)}
            <a href="#use-cases" onClick={() => setMobileOpen(false)}>For your property</a>
            <a href="#morning" onClick={() => setMobileOpen(false)}>How it works</a>
            <a href="#why" onClick={() => setMobileOpen(false)}>Why it exists</a>
          </nav>
          <div className="mk-mobile-actions"><Link to="/login" onClick={() => setMobileOpen(false)}>Log in</Link><Link className="mk-button-primary" to={user ? '/app' : '/signup'} onClick={() => setMobileOpen(false)}>{user ? 'Open workspace' : 'Create your workspace'}</Link></div>
        </div>
      </div>}
    </header>
  );
}
