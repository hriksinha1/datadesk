import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Booking } from '../../../lib/repository/types';
import { SegmentedTabs, TabItem } from '../../../components/ui/Tabs';
import { Button } from '../../../components/ui/Button';
import { BalanceCell } from '../../../components/ui/Badges';
import { ConfirmDialog } from '../../../components/ui/Dialog';
import { useToast } from '../../../components/ui/Toast';
import { BookingPaymentSummary } from '../../../lib/utils/financials';

interface MovementsPanelProps {
  arrivals: Booking[];
  departures: Booking[];
  inHouse: Booking[];
  balancesByBookingId: Record<string, BookingPaymentSummary>;
  scopeIsAll: boolean;
  activeTab: 'arrivals' | 'departures' | 'inhouse';
  onTabChange: (tab: 'arrivals' | 'departures' | 'inhouse') => void;
  onCheckIn: (bookingId: string) => Promise<void>;
  onCheckOut: (bookingId: string) => Promise<void>;
}

export const MovementsPanel: React.FC<MovementsPanelProps> = ({
  arrivals,
  departures,
  inHouse,
  balancesByBookingId,
  scopeIsAll,
  activeTab,
  onTabChange,
  onCheckIn,
  onCheckOut,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [checkoutTarget, setCheckoutTarget] = useState<Booking | null>(null);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const tabs: TabItem[] = [
    { id: 'arrivals', label: 'Arrivals', count: arrivals.length },
    { id: 'departures', label: 'Departures', count: departures.length },
    { id: 'inhouse', label: 'In House', count: inHouse.length },
  ];

  const currentList =
    activeTab === 'arrivals' ? arrivals : activeTab === 'departures' ? departures : inHouse;

  const handleArrivalCheckIn = async (b: Booking) => {
    try {
      setLoadingActionId(b.id);
      await onCheckIn(b.id);
      showToast({
        message: `${b.customer?.name || 'Guest'} checked in successfully.`,
        type: 'success',
      });
    } catch {
      showToast({ message: 'Failed to check in guest', type: 'error' });
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleDepartureCheckOut = async (b: Booking) => {
    const bal = balancesByBookingId[b.id]?.balanceDue || 0;
    if (bal > 0) {
      setCheckoutTarget(b);
      return;
    }
    await executeCheckOut(b.id);
  };

  const executeCheckOut = async (bookingId: string) => {
    try {
      setLoadingActionId(bookingId);
      await onCheckOut(bookingId);
      showToast({
        message: `Stay completed and checked out.`,
        type: 'success',
      });
    } catch {
      showToast({ message: 'Failed to check out guest', type: 'error' });
    } finally {
      setLoadingActionId(null);
      setCheckoutTarget(null);
    }
  };

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5 flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E7EC] mb-3">
        <h2 className="text-base font-semibold text-[#0E1726]">Today&apos;s movements</h2>
        <SegmentedTabs
          tabs={tabs}
          activeId={activeTab}
          onChange={(id) => onTabChange(id as 'arrivals' | 'departures' | 'inhouse')}
          size="sm"
        />
      </div>

      {currentList.length === 0 ? (
        <div className="py-8 text-center text-xs sm:text-sm text-[#64748B]">
          No {activeTab} scheduled for today.
        </div>
      ) : (
        <div className="divide-y divide-[#E4E7EC]">
          {currentList.map((b) => {
            const bal = balancesByBookingId[b.id]?.balanceDue || 0;
            const isArrival = activeTab === 'arrivals';
            const isDeparture = activeTab === 'departures';
            const isCheckedIn = b.booking_status === 'Checked In';
            const isCompleted = b.booking_status === 'Completed';

            return (
              <div
                key={b.id}
                className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F8FA] rounded-[4px] transition-colors"
              >
                {/* Guest & Room info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#EAF4F1] text-[#0D5C4D] flex items-center justify-center font-medium text-xs shrink-0 select-none">
                    {b.customer?.name ? b.customer.name.slice(0, 2).toUpperCase() : 'G'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <Link
                        to={`/app/bookings/${b.id}`}
                        className="text-sm font-medium text-[#0E1726] hover:text-[#0D5C4D] hover:underline truncate"
                      >
                        {b.customer?.name || 'Guest'}
                      </Link>
                      <span className="font-mono text-xs text-[#64748B] shrink-0">{b.booking_no}</span>
                    </div>

                    <div className="text-xs text-[#64748B] truncate mt-0.5">
                      <span className="font-medium text-[#334155]">
                        {b.room_number ? `Room ${b.room_number}` : b.room_type}
                      </span>
                      <span> · {b.nights}N · {b.guests} guests</span>
                      {scopeIsAll && b.property && (
                        <span> · <span className="text-[#0D5C4D]">{b.property.name}</span></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Balance & Action */}
                <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                  <BalanceCell balanceDue={bal} />

                  {isArrival && (
                    <Button
                      size="sm"
                      variant={isCheckedIn ? 'ghost' : 'primary'}
                      disabled={isCheckedIn || loadingActionId === b.id}
                      loading={loadingActionId === b.id}
                      onClick={() => handleArrivalCheckIn(b)}
                    >
                      {isCheckedIn ? 'Checked in' : 'Check in'}
                    </Button>
                  )}

                  {isDeparture && (
                    <Button
                      size="sm"
                      variant={isCompleted ? 'ghost' : bal > 0 ? 'danger' : 'secondary'}
                      disabled={isCompleted || loadingActionId === b.id}
                      loading={loadingActionId === b.id}
                      onClick={() => handleDepartureCheckOut(b)}
                    >
                      {isCompleted ? 'Completed' : 'Check out'}
                    </Button>
                  )}

                  {!isArrival && !isDeparture && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/app/bookings/${b.id}`)}
                    >
                      Open &rarr;
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation dialog for departure with balance due */}
      {checkoutTarget && (
        <ConfirmDialog
          isOpen={!!checkoutTarget}
          onClose={() => setCheckoutTarget(null)}
          onConfirm={() => executeCheckOut(checkoutTarget.id)}
          title="Checkout with balance due?"
          description={
            <div>
              <p>
                <strong>{checkoutTarget.customer?.name}</strong> still has an unpaid balance of{' '}
                <strong className="text-[#B42318]">
                  ₹{(balancesByBookingId[checkoutTarget.id]?.balanceDue || 0).toLocaleString('en-IN')}
                </strong>.
              </p>
              <p className="mt-2 text-xs text-[#64748B]">
                Completing checkout will release the room folio. Would you like to proceed anyway?
              </p>
            </div>
          }
          confirmLabel="Check out anyway"
          variant="danger"
          loading={loadingActionId === checkoutTarget.id}
        />
      )}
    </div>
  );
};
