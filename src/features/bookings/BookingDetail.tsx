import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Building,
  User,
  CreditCard,
  FileText,
  LogIn,
  LogOut,
  XCircle,
  ChevronRight,
  ArrowLeft,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { useWorkspaceData } from '../../context/WorkspaceDataContext';
import { Booking, Payment } from '../../lib/repository/types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge, PaymentBadge, BalanceCell } from '../../components/ui/Badges';
import { Money, DateText } from '../../components/ui/Typography';
import { ConfirmDialog } from '../../components/ui/Dialog';
import { ErrorState, Skeleton } from '../../components/ui/StateFeedback';
import { useToast } from '../../components/ui/Toast';
import { calculateBookingPaymentSummary } from '../../lib/utils/financials';
import AddPaymentModal from './AddPaymentModal';

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    data,
    status,
    checkIn,
    checkOut,
    cancelBooking,
    updateBookingStatus,
    addPayment,
  } = useWorkspaceData();

  const [showPayModal, setShowPayModal] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const booking = data.bookings.find((b) => b.id === id);
  const bookingPayments = data.payments
    .filter((p) => p.booking_id === id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <ErrorState
        title="Booking not found"
        message="The requested reservation does not exist or may have been deleted."
        onRetry={() => navigate('/app/bookings')}
      />
    );
  }

  const paymentSummary = calculateBookingPaymentSummary(booking, bookingPayments);

  const handleStatusChange = async (
    nextStatus: 'Confirmed' | 'Checked In' | 'Completed' | 'Cancelled'
  ) => {
    const previousStatus = booking.booking_status;
    setActionLoading(true);
    try {
      if (nextStatus === 'Checked In') {
        await checkIn(booking.id);
      } else if (nextStatus === 'Completed') {
        await checkOut(booking.id);
      } else if (nextStatus === 'Cancelled') {
        await cancelBooking(booking.id);
      } else {
        await updateBookingStatus(booking.id, nextStatus);
      }

      showToast({
        message: `Status updated to ${nextStatus}`,
        type: 'success',
        undoAction: async () => {
          await updateBookingStatus(
            booking.id,
            previousStatus as 'Confirmed' | 'Checked In' | 'Completed' | 'Cancelled'
          );
        },
        undoLabel: 'Undo',
      });
    } catch {
      showToast({ message: 'Failed to update booking status', type: 'error' });
    } finally {
      setActionLoading(false);
      setCancelDialogOpen(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const { generateBookingInvoicePDF } = await import('../../lib/services/pdfGenerator');
      const doc = await generateBookingInvoicePDF(
        booking,
        bookingPayments,
        booking.property,
        booking.customer,
        data.settings,
        paymentSummary.netPaid,
        paymentSummary.balanceDue
      );
      doc.save(`INV-${booking.booking_no}.pdf`);
      showToast({ message: 'Invoice PDF downloaded', type: 'success' });
    } catch (err) {
      console.error(err);
      showToast({ message: 'Failed to generate invoice', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <Link to="/app/bookings" className="hover:text-[#0E1726] transition-colors">
          Bookings
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-mono text-[#0E1726] font-medium">{booking.booking_no}</span>
      </div>

      {/* Header */}
      <PageHeader
        title={`Reservation ${booking.booking_no}`}
        scopeLabel={booking.property?.name || 'Property'}
        subtitle={
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.booking_status} />
            <PaymentBadge status={paymentSummary.paymentStatus} balanceDue={paymentSummary.balanceDue} />
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadInvoice}
              icon={<FileText className="w-4 h-4" />}
            >
              Invoice PDF
            </Button>

            {/* Status Transition Actions */}
            {booking.booking_status === 'Confirmed' && (
              <Button
                variant="primary"
                size="sm"
                loading={actionLoading}
                onClick={() => handleStatusChange('Checked In')}
                icon={<LogIn className="w-4 h-4" />}
              >
                Check in
              </Button>
            )}

            {booking.booking_status === 'Checked In' && (
              <Button
                variant="primary"
                size="sm"
                loading={actionLoading}
                onClick={() => handleStatusChange('Completed')}
                icon={<LogOut className="w-4 h-4" />}
              >
                Check out
              </Button>
            )}

            {paymentSummary.balanceDue > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPayModal(true)}
                icon={<CreditCard className="w-4 h-4" />}
              >
                Record payment
              </Button>
            )}

            {booking.booking_status !== 'Cancelled' && booking.booking_status !== 'Completed' && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setCancelDialogOpen(true)}
                icon={<XCircle className="w-4 h-4" />}
              >
                Cancel booking
              </Button>
            )}
          </div>
        }
      />

      {/* 2/3 and 1/3 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Stay Details, Guest Details, Notes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stay Details Panel */}
          <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E4E7EC] mb-4">
              <Calendar className="w-4 h-4 text-[#64748B]" />
              <h2 className="text-base font-semibold text-[#0E1726]">Stay details</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div className="p-3 bg-[#F7F8FA] rounded-[6px]">
                <span className="text-[#64748B] block text-xs mb-1">Check-in</span>
                <span className="font-semibold text-[#0E1726]">
                  <DateText date={booking.check_in} />
                </span>
              </div>

              <div className="p-3 bg-[#F7F8FA] rounded-[6px]">
                <span className="text-[#64748B] block text-xs mb-1">Check-out</span>
                <span className="font-semibold text-[#0E1726]">
                  <DateText date={booking.check_out} />
                </span>
              </div>

              <div className="p-3 bg-[#F7F8FA] rounded-[6px]">
                <span className="text-[#64748B] block text-xs mb-1">Duration</span>
                <span className="font-semibold text-[#0E1726]">
                  {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
                </span>
              </div>

              <div className="p-3 bg-[#F7F8FA] rounded-[6px]">
                <span className="text-[#64748B] block text-xs mb-1">Occupancy</span>
                <span className="font-semibold text-[#0E1726]">
                  {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-4 p-3 border border-[#E4E7EC] rounded-[6px]">
                <span className="text-[#64748B] block text-xs mb-1">Allocated Unit</span>
                <span className="font-semibold text-[#0E1726] text-sm">
                  {booking.room_number ? `Room ${booking.room_number} · ` : ''}
                  {booking.room_type || 'Standard'}
                </span>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-4 p-3 bg-[#FFFBEB] border border-[#F5D58A] rounded-[6px] text-xs text-[#B45309]">
                <span className="font-semibold block mb-0.5">Special requests / Notes:</span>
                {booking.notes}
              </div>
            )}
          </div>

          {/* Guest Information */}
          <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#64748B]" />
                <h2 className="text-base font-semibold text-[#0E1726]">Guest profile</h2>
              </div>

              {booking.customer_id && (
                <Link
                  to={`/app/customers?guest=${booking.customer_id}`}
                  className="text-xs font-medium text-[#0D5C4D] hover:underline"
                >
                  View guest history &rarr;
                </Link>
              )}
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#EAF4F1] text-[#0D5C4D] flex items-center justify-center font-bold text-base shrink-0 select-none">
                {booking.customer?.name ? booking.customer.name.slice(0, 2).toUpperCase() : 'G'}
              </div>

              <div className="space-y-1">
                <Link
                  to={`/app/customers?guest=${booking.customer_id}`}
                  className="font-semibold text-base text-[#0E1726] hover:text-[#0D5C4D] hover:underline"
                >
                  {booking.customer?.name || 'Guest'}
                </Link>
                <div className="text-xs text-[#64748B]">
                  Phone: <a href={`tel:${booking.customer?.phone}`} className="hover:underline font-medium text-[#0E1726]">{booking.customer?.phone || '—'}</a>
                </div>
                {booking.customer?.email && (
                  <div className="text-xs text-[#64748B]">
                    Email: <a href={`mailto:${booking.customer.email}`} className="hover:underline font-medium text-[#0E1726]">{booking.customer.email}</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payments Ledger */}
          <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-3">
              <h2 className="text-base font-semibold text-[#0E1726]">Recorded payments</h2>
              {paymentSummary.balanceDue > 0 && (
                <Button size="sm" variant="secondary" onClick={() => setShowPayModal(true)}>
                  + Add payment
                </Button>
              )}
            </div>

            {bookingPayments.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#64748B]">
                No payments recorded yet for this booking.
              </div>
            ) : (
              <div className="divide-y divide-[#E4E7EC]">
                {bookingPayments.map((p) => (
                  <div
                    key={p.id}
                    className="py-3 flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div>
                      <div className="font-medium text-[#0E1726]">
                        {p.method} · {p.purpose || 'Payment'}
                      </div>
                      <div className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5 font-mono">
                        <span>{p.payment_no}</span>
                        <span>·</span>
                        <DateText date={p.date} />
                        {p.ref_id && <span>· Ref: {p.ref_id}</span>}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-[#067647] tabular-nums">
                        <Money amount={p.amount} />
                      </div>
                      <div className="text-[11px] text-[#64748B]">{p.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Financial Summary & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Folio Summary Panel */}
          <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5 space-y-4">
            <h2 className="text-base font-semibold text-[#0E1726] pb-2 border-b border-[#E4E7EC]">
              Folio summary
            </h2>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-[#64748B]">
                <span>Base accommodation</span>
                <span className="tabular-nums font-medium text-[#0E1726]">
                  <Money amount={booking.base_amount} />
                </span>
              </div>

              {booking.tax_enabled && (
                <div className="flex justify-between text-[#64748B]">
                  <span>GST ({booking.tax_rate}%)</span>
                  <span className="tabular-nums font-medium text-[#0E1726]">
                    <Money amount={booking.tax_amount} />
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm font-semibold text-[#0E1726] pt-2 border-t border-[#E4E7EC]">
                <span>Grand total</span>
                <span className="tabular-nums">
                  <Money amount={booking.grand_total} />
                </span>
              </div>

              <div className="flex justify-between text-[#067647] font-medium pt-1">
                <span>Paid to date</span>
                <span className="tabular-nums">
                  <Money amount={paymentSummary.netPaid} />
                </span>
              </div>

              <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t border-[#E4E7EC]">
                <span>Balance due</span>
                <BalanceCell balanceDue={paymentSummary.balanceDue} />
              </div>
            </div>

            {paymentSummary.balanceDue > 0 && (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setShowPayModal(true)}
              >
                Record payment
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {cancelDialogOpen && (
        <ConfirmDialog
          isOpen={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          onConfirm={() => handleStatusChange('Cancelled')}
          title="Cancel this reservation?"
          description={
            <div>
              <p>
                Are you sure you want to cancel booking <strong>{booking.booking_no}</strong> for{' '}
                <strong>{booking.customer?.name}</strong>?
              </p>
              <p className="mt-2 text-xs text-[#64748B]">
                This releases room {booking.room_number || booking.room_type} for other bookings.
              </p>
            </div>
          }
          confirmLabel="Cancel reservation"
          variant="danger"
          loading={actionLoading}
        />
      )}

      {/* Add Payment Modal */}
      {showPayModal && (
        <AddPaymentModal
          isOpen={showPayModal}
          onClose={() => setShowPayModal(false)}
          booking={booking}
          balanceDue={paymentSummary.balanceDue}
          onSuccess={async () => {
            setShowPayModal(false);
            showToast({ message: 'Payment recorded successfully', type: 'success' });
          }}
        />
      )}
    </div>
  );
}
