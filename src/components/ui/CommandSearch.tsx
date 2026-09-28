import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, User, Building2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceData } from '../../context/WorkspaceDataContext';
import { Money } from './Typography';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandSearchModal: React.FC<CommandSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { data } = useWorkspaceData();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search bookings
  const matchedBookings = q
    ? data.bookings.filter((b) => {
        const guestName = (b.customer?.name || '').toLowerCase();
        const bNo = (b.booking_no || '').toLowerCase();
        const room = (b.room_number || '').toLowerCase();
        const phone = (b.customer?.phone || '').toLowerCase();
        return bNo.includes(q) || guestName.includes(q) || room.includes(q) || phone.includes(q);
      }).slice(0, 5)
    : [];

  // Search customers
  const matchedCustomers = q
    ? data.customers.filter((c) => {
        const name = (c.name || '').toLowerCase();
        const phone = (c.phone || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        return name.includes(q) || phone.includes(q) || email.includes(q);
      }).slice(0, 4)
    : [];

  // Search properties
  const matchedProperties = q
    ? data.properties.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const city = (p.city || '').toLowerCase();
        return name.includes(q) || city.includes(q);
      }).slice(0, 3)
    : [];

  const hasResults = matchedBookings.length > 0 || matchedCustomers.length > 0 || matchedProperties.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-white border border-[#E4E7EC] rounded-[8px] shadow-[0_8px_24px_rgba(14,23,38,0.16)] overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="h-12 px-4 border-b border-[#E4E7EC] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#64748B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search booking #, guest name, phone, room, or property..."
            className="flex-1 h-full text-sm text-[#0E1726] placeholder:text-[#94A3B8] outline-none bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#94A3B8] hover:text-[#0E1726] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#64748B] bg-[#F7F8FA] border border-[#CBD2DC] rounded-[4px]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {!q && (
            <div className="py-8 text-center text-xs text-[#64748B]">
              Type to search bookings, guests, and properties across your portfolio.
            </div>
          )}

          {q && !hasResults && (
            <div className="py-8 text-center text-xs text-[#64748B]">
              No matches found for &ldquo;{query}&rdquo;.
            </div>
          )}

          {matchedBookings.length > 0 && (
            <div className="mb-3">
              <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Bookings
              </div>
              {matchedBookings.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    navigate(`/app/bookings/${b.id}`);
                    onClose();
                  }}
                  className="w-full px-2.5 py-2 rounded-[6px] hover:bg-[#F7F8FA] text-left flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#0D5C4D] shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-[#0E1726]">
                        {b.customer?.name || 'Guest'}
                      </span>
                      <span className="ml-2 font-mono text-xs text-[#64748B]">{b.booking_no}</span>
                      <div className="text-xs text-[#64748B]">
                        {b.room_number ? `Room ${b.room_number}` : b.room_type} · {b.check_in} to {b.check_out}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-[#0E1726]">
                      <Money amount={b.grand_total} />
                    </div>
                    <div className="text-[11px] text-[#64748B]">{b.booking_status}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {matchedCustomers.length > 0 && (
            <div className="mb-3">
              <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Guests
              </div>
              {matchedCustomers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    navigate(`/app/customers?guest=${c.id}`);
                    onClose();
                  }}
                  className="w-full px-2.5 py-2 rounded-[6px] hover:bg-[#F7F8FA] text-left flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#334155] shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#0E1726]">{c.name}</div>
                      <div className="text-xs text-[#64748B]">{c.phone} {c.email ? `· ${c.email}` : ''}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {matchedProperties.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Properties
              </div>
              {matchedProperties.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    navigate(`/app/properties`);
                    onClose();
                  }}
                  className="w-full px-2.5 py-2 rounded-[6px] hover:bg-[#F7F8FA] text-left flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-[#64748B] shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#0E1726]">{p.name}</div>
                      <div className="text-xs text-[#64748B]">
                        {p.property_type} · {p.city}, {p.state}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
