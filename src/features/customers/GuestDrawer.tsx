import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, Copy, Check, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { GuestSummary } from '../../lib/analytics';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { StatusBadge, BalanceCell } from '../../components/ui/Badges';
import { Money, DateText } from '../../components/ui/Typography';
import { Booking, Property } from '../../lib/repository/types';
import { useToast } from '../../components/ui/Toast';

interface GuestDrawerProps {
  summary: GuestSummary | null;
  onClose: () => void;
  allBookings: Booking[];
  properties: Property[];
}

export const GuestDrawer: React.FC<GuestDrawerProps> = ({
  summary,
  onClose,
  allBookings,
  properties,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [copiedField, setCopiedField] = useState<'phone' | 'email' | null>(null);

  if (!summary) return null;

  const { customer, staysCount, lifetimeValue, outstandingBalance, status, currentStay, nextStay } =
    summary;

  const guestBookings = allBookings
    .filter((b) => b.customer_id === customer.id)
    .sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime());

  const handleCopy = (text: string, field: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast({ message: `Copied ${field} to clipboard`, type: 'info' });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const activeStay = currentStay || nextStay;

  return (
    <Drawer
      isOpen={!!summary}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>{customer.name}</span>
          <span
            className={`px-1.5 py-0.5 text-xs font-medium rounded-[4px] ${
              status === 'In house'
                ? 'bg-[#EAF4F1] text-[#0D5C4D]'
                : status === 'Upcoming'
                ? 'bg-[#EFF4FF] text-[#1D4ED8]'
                : status === 'Past'
                ? 'bg-[#F7F8FA] text-[#64748B]'
                : 'bg-white border text-[#334155]'
            }`}
          >
            {status}
          </span>
        </div>
      }
      subtitle={`Guest directory record · Registered ${customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-IN') : 'recently'}`}
      width="480px"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              navigate(`/app/bookings/new`);
              onClose();
            }}
          >
            + Create booking for {customer.name.split(' ')[0]}
          </Button>
        </div>
      }
    >
      {/* Contact Quick Actions */}
      <div className="p-3.5 bg-[#F7F8FA] border border-[#E4E7EC] rounded-[8px] space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#64748B]" />
            <a
              href={`tel:${customer.phone}`}
              className="text-sm font-semibold text-[#0E1726] hover:text-[#0D5C4D] hover:underline"
            >
              {customer.phone || '—'}
            </a>
          </div>
          {customer.phone && (
            <button
              type="button"
              onClick={() => handleCopy(customer.phone, 'phone')}
              className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#0E1726] p-1 cursor-pointer"
              title="Copy phone"
            >
              {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-[#067647]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        {customer.email && (
          <div className="flex items-center justify-between pt-1 border-t border-[#E4E7EC]">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#64748B]" />
              <a
                href={`mailto:${customer.email}`}
                className="text-xs font-medium text-[#0E1726] hover:text-[#0D5C4D] hover:underline"
              >
                {customer.email}
              </a>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(customer.email!, 'email')}
              className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#0E1726] p-1 cursor-pointer"
              title="Copy email"
            >
              {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-[#067647]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3-Cell Summary Strip */}
      <div className="grid grid-cols-3 gap-2 text-center bg-white border border-[#E4E7EC] rounded-[8px] p-3">
        <div>
          <div className="text-xs text-[#64748B] font-medium">STAYS</div>
          <div className="text-lg font-semibold text-[#0E1726] tabular-nums mt-0.5">{staysCount}</div>
        </div>
        <div className="border-x border-[#E4E7EC]">
          <div className="text-xs text-[#64748B] font-medium">LIFETIME VALUE</div>
          <div className="text-lg font-semibold text-[#0E1726] tabular-nums mt-0.5">
            <Money amount={lifetimeValue} compact />
          </div>
        </div>
        <div>
          <div className="text-xs text-[#64748B] font-medium">BALANCE DUE</div>
          <div className="text-lg font-semibold tabular-nums mt-0.5">
            {outstandingBalance > 0 ? (
              <span className="text-[#B45309]">
                <Money amount={outstandingBalance} compact />
              </span>
            ) : (
              <span className="text-[#067647]">₹0</span>
            )}
          </div>
        </div>
      </div>

      {/* Current or Upcoming Stay Spotlight Card */}
      {activeStay && (
        <div className="bg-[#EAF4F1]/40 border border-[#D1E8E2] rounded-[8px] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0D5C4D]">
              {currentStay ? 'Current active stay' : 'Upcoming stay'}
            </span>
            <Link
              to={`/app/bookings/${activeStay.id}`}
              className="text-xs text-[#0D5C4D] hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>Open booking</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-sm font-semibold text-[#0E1726]">
              {activeStay.room_number ? `Room ${activeStay.room_number}` : activeStay.room_type}
            </div>
            <div className="text-xs text-[#64748B]">
              <DateText date={activeStay.check_in} format="short" /> &rarr;{' '}
              <DateText date={activeStay.check_out} format="short" /> ({activeStay.nights}N)
            </div>
          </div>

          <div className="text-xs text-[#64748B] flex justify-between items-center pt-1 border-t border-[#D1E8E2]/60">
            <span>{activeStay.property?.name || 'Property'}</span>
            <StatusBadge status={activeStay.booking_status} />
          </div>
        </div>
      )}

      {/* Complete Booking History */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          Stay history ({guestBookings.length})
        </h4>

        {guestBookings.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#64748B] border border-dashed border-[#CBD2DC] rounded-[6px]">
            No previous reservations on record.
          </div>
        ) : (
          <div className="divide-y divide-[#E4E7EC] border border-[#E4E7EC] rounded-[8px] overflow-hidden">
            {guestBookings.map((b) => (
              <Link
                key={b.id}
                to={`/app/bookings/${b.id}`}
                className="p-3 bg-white hover:bg-[#F7F8FA] flex items-center justify-between text-xs transition-colors block"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-[#0E1726]">{b.booking_no}</span>
                    <StatusBadge status={b.booking_status} />
                  </div>
                  <div className="text-[#64748B] mt-0.5">
                    {b.room_number ? `Room ${b.room_number}` : b.room_type} ·{' '}
                    <DateText date={b.check_in} format="short" /> to{' '}
                    <DateText date={b.check_out} format="short" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-[#0E1726] tabular-nums">
                    <Money amount={b.grand_total} />
                  </div>
                  <div className="text-[11px] text-[#64748B]">{b.nights} nights</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};
