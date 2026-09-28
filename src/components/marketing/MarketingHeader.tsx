import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandMark from './BrandMark';
import { BRAND } from './siteConfig';

export default function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { user, quickDemoAccess } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!panelRef.current || !triggerRef.current) return;
      if (!panelRef.current.contains(event.target as Node) && !triggerRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSolutionsOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const openDemoWorkspace = async () => {
    if (!user) {
      await quickDemoAccess();
    }
    navigate('/app');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E4E1D8] bg-[#F6F4EF]/90 backdrop-blur-sm">
      <div className="mk-content flex h-16 items-center justify-between gap-4 md:h-20">
        <div className="flex items-center gap-3 md:gap-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="MyTrackYo home">
            <BrandMark size={28} />
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-[-0.04em] text-[#0E1726] md:text-lg">{BRAND.name}</span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0D5C4D]">Property OS</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            <a href="#product" className="rounded-lg px-3 py-2 text-sm font-medium text-[#4B5567] transition-colors hover:bg-white hover:text-[#0E1726]">Product</a>
            <div className="relative">
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={solutionsOpen}
                aria-controls="solutions-menu"
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[#4B5567] transition-colors hover:bg-white hover:text-[#0E1726]"
                onClick={() => setSolutionsOpen((v) => !v)}
              >
                Solutions
                <ChevronDown size={14} className={solutionsOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              {solutionsOpen && (
                <div ref={panelRef} id="solutions-menu" className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-[#E4E7EC] bg-white p-2 shadow-md">
                  {['Hotels', 'Homestays', 'Hostels and dorms', 'Lodges', 'Multi-property managers'].map((item) => (
                    <a key={item} href="#solutions" onClick={() => setSolutionsOpen(false)} className="block rounded-lg px-3 py-2 text-left text-sm text-[#334155] transition-colors hover:bg-[#F6F4EF] hover:text-[#0E1726]">
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="#story" className="rounded-lg px-3 py-2 text-sm font-medium text-[#4B5567] transition-colors hover:bg-white hover:text-[#0E1726]">How it works</a>
            <a href="#why-free" className="rounded-lg px-3 py-2 text-sm font-medium text-[#0D5C4D] transition-colors hover:bg-[#EAF4F1]">Why free</a>
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link to="/app" className="inline-flex items-center justify-center rounded-lg bg-[#0E1726] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16213A]">
              Open workspace
            </Link>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-[#4B5567] transition-colors hover:bg-white hover:text-[#0E1726]">Log in</Link>
              <Link to="/signup" className="inline-flex items-center justify-center rounded-lg bg-[#0E1726] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16213A]">
                Create free workspace
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link to="/signup" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0E1726] px-3 text-sm font-semibold text-white">Create free</Link>
          <button type="button" aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((v) => !v)} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#E4E7EC] bg-white text-[#0E1726]">
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#E4E1D8] bg-white px-4 py-4 md:hidden">
          <nav className="space-y-1" aria-label="Mobile navigation">
            <a href="#product" onClick={closeMobileMenu} className="block rounded-lg px-3 py-3 text-base font-medium text-[#0E1726]">Product</a>
            <a href="#story" onClick={closeMobileMenu} className="block rounded-lg px-3 py-3 text-base font-medium text-[#0E1726]">How it works</a>
            <a href="#solutions" onClick={closeMobileMenu} className="block rounded-lg px-3 py-3 text-base font-medium text-[#0E1726]">Solutions</a>
            <a href="#why-free" onClick={closeMobileMenu} className="block rounded-lg px-3 py-3 text-base font-medium text-[#0D5C4D]">Why free</a>
          </nav>
          <div className="mt-4 space-y-2 border-t border-[#E4E7EC] pt-4">
            <Link to="/login" onClick={closeMobileMenu} className="block rounded-lg border border-[#E4E7EC] px-4 py-3 text-center text-sm font-semibold text-[#0E1726]">Log in</Link>
            <button type="button" onClick={async () => { closeMobileMenu(); await openDemoWorkspace(); }} className="block w-full rounded-lg bg-[#0E1726] px-4 py-3 text-center text-sm font-semibold text-white">Open the sample workspace</button>
            <Link to="/signup" onClick={closeMobileMenu} className="block rounded-lg bg-[#0D5C4D] px-4 py-3 text-center text-sm font-semibold text-white">Create free workspace</Link>
          </div>
        </div>
      )}
    </header>
  );
}
