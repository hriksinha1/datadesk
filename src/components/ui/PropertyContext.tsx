import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { usePropertyScope } from '../../context/WorkspaceDataContext';

export const PropertyContextSelector: React.FC = () => {
  const { propertyFilter, setPropertyFilter, properties, scopeLabel } = usePropertyScope();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3 bg-white hover:bg-[#F7F8FA] border border-[#E4E7EC] hover:border-[#CBD2DC] rounded-[6px] text-xs sm:text-sm font-medium text-[#0E1726] inline-flex items-center gap-2 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#0D5C4D]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Building2 className="w-4 h-4 text-[#64748B] shrink-0" />
        <span className="truncate max-w-[130px] sm:max-w-[200px]">{scopeLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-[#E4E7EC] rounded-[8px] shadow-[0_8px_24px_rgba(14,23,38,0.12)] z-50 py-1 overflow-hidden"
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#64748B] border-b border-[#E4E7EC]">
            Select Property Scope
          </div>

          <button
            type="button"
            role="option"
            aria-selected={!propertyFilter}
            onClick={() => {
              setPropertyFilter('');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs sm:text-sm hover:bg-[#F7F8FA] transition-colors cursor-pointer ${
              !propertyFilter ? 'bg-[#EAF4F1] text-[#0D5C4D] font-medium' : 'text-[#0E1726]'
            }`}
          >
            <div>
              <div>All Properties</div>
              <div className="text-[11px] text-[#64748B]">{properties.length} properties portfolio</div>
            </div>
            {!propertyFilter && <Check className="w-4 h-4 text-[#0D5C4D] shrink-0" />}
          </button>

          <div className="my-1 border-t border-[#E4E7EC]" />

          <div className="max-h-60 overflow-y-auto">
            {properties.map((p) => {
              const isSelected = propertyFilter === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setPropertyFilter(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs sm:text-sm hover:bg-[#F7F8FA] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#EAF4F1] text-[#0D5C4D] font-medium' : 'text-[#0E1726]'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate font-medium">{p.name}</div>
                    <div className="text-[11px] text-[#64748B] truncate">
                      {p.property_type} · {p.city}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#0D5C4D] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
