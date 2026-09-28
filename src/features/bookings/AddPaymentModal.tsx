import React, { useState } from 'react';
import { X, CheckCircle, Download, FileText, AlertCircle } from 'lucide-react';
import { useWorkspaceData } from '../../context/WorkspaceDataContext';
import { Booking } from '../../lib/repository/types';
import { Money } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/FormControls';
import { useToast } from '../../components/ui/Toast';

interface AddPaymentModalProps {
  booking: Booking;
  balanceDue: number;
  onClose: () => void;
  onSuccess: () => void;
  isOpen?: boolean;
}

export default function AddPaymentModal({
  booking,
  balanceDue,
  onClose,
  onSuccess,
  isOpen = true,
}: AddPaymentModalProps) {
  const { addPayment, data } = useWorkspaceData();
  const { showToast } = useToast();

  const [amount, setAmount] = useState<number | ''>(balanceDue);
  const [method, setMethod] = useState('Google Pay');
  const [refId, setRefId] = useState('');
  const [purpose, setPurpose] = useState('Payment');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{
    amount: number;
    newBalance: number;
    paymentNo: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const numAmount = Number(amount);
      if (numAmount <= 0) throw new Error('Enter an amount greater than ₹0.');
      if (numAmount > balanceDue) {
        throw new Error(`You can record up to ₹${balanceDue.toLocaleString('en-IN')} as that is the balance due.`);
      }

      const created = await addPayment({
        payment_no: 'PAY-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        booking_id: booking.id,
        date,
        amount: numAmount,
        method,
        purpose,
        ref_id: refId || undefined,
        status: 'Recorded',
      });

      const newBal = Math.max(0, balanceDue - numAmount);
      setSuccessData({
        amount: numAmount,
        newBalance: newBal,
        paymentNo: created.payment_no,
      });
      showToast({ message: 'Payment recorded and folio updated', type: 'success' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const { generatePaymentReceiptPDF } = await import('../../lib/services/pdfGenerator');
      const doc = await generatePaymentReceiptPDF(
        booking,
        {
          id: 'pay-temp',
          payment_no: successData?.paymentNo || 'PAY-REC',
          booking_id: booking.id,
          date,
          amount: successData?.amount || 0,
          method,
          status: 'Recorded',
          created_at: new Date().toISOString(),
        },
        booking.property,
        booking.customer,
        data.settings,
        booking.grand_total - balanceDue,
        successData?.newBalance || 0
      );
      doc.save(`REC-${successData?.paymentNo}.pdf`);
      showToast({ message: 'Receipt downloaded', type: 'success' });
    } catch (err) {
      console.error(err);
      showToast({ message: 'Failed to generate receipt PDF', type: 'error' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white border border-[#E4E7EC] rounded-[8px] shadow-[0_8px_24px_rgba(14,23,38,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 px-5 border-b border-[#E4E7EC] flex items-center justify-between shrink-0 bg-white">
          <h2 className="text-base font-semibold text-[#0E1726]">Record payment</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#0E1726] rounded-[4px] cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successData ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 bg-[#EAF4F1] text-[#0D5C4D] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#0E1726]">Payment recorded</h3>
              <p className="text-xs text-[#64748B] mt-1">
                {successData.newBalance > 0
                  ? `₹${successData.newBalance.toLocaleString('en-IN')} remains outstanding.`
                  : 'This reservation is now fully settled.'}
              </p>
            </div>

            <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-[6px] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Amount received:</span>
                <span className="font-semibold text-[#067647] tabular-nums">
                  <Money amount={successData.amount} />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Method:</span>
                <span className="font-medium text-[#0E1726]">{method}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E4E7EC]">
                <span className="text-[#64748B]">Remaining due:</span>
                <span className="font-semibold text-[#0E1726] tabular-nums">
                  <Money amount={successData.newBalance} />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadReceipt}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Receipt PDF
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Booking balance snapshot */}
            <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-[6px] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#64748B] block">Booking {booking.booking_no}</span>
                <span className="font-medium text-[#0E1726]">
                  {booking.customer?.name || 'Guest'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#64748B] block">Current Balance</span>
                <span className="font-semibold text-sm text-[#B45309] tabular-nums">
                  <Money amount={balanceDue} />
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[#FEF3F2] border border-[#FDA29B] rounded-[6px] text-xs text-[#B42318] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              type="number"
              step="any"
              min={1}
              max={balanceDue}
              label="Amount to collect (₹) *"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />

            <Select
              label="Payment Method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full"
            >
              <option value="Google Pay">Google Pay</option>
              <option value="PhonePe">PhonePe</option>
              <option value="Paytm">Paytm</option>
              <option value="UPI">UPI / QR</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer / NEFT</option>
              <option value="Cash">Cash</option>
            </Select>

            <Input
              label="Transaction / Reference ID (optional)"
              placeholder="e.g. UTR / UPI / Receipt #"
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full"
              >
                <option value="Advance">Advance deposit</option>
                <option value="During stay">Mid-stay folio</option>
                <option value="Final payment">Final checkout payment</option>
                <option value="Payment">Payment</option>
              </Select>

              <Input
                type="date"
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E4E7EC]">
              <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={loading}>
                Record payment
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
