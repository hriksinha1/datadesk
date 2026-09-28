import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useWorkspaceData } from '../../context/WorkspaceDataContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/FormControls';
import { Money } from '../../components/ui/Typography';
import { generateId } from '../../lib/utils/formatters';
import { isBookingOverlapping } from '../../lib/analytics';
import { useToast } from '../../components/ui/Toast';

export default function NewBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { data, createBooking, addPayment, createCustomer } = useWorkspaceData();

  const qDate = searchParams.get('date');
  const qRoom = searchParams.get('room');
  const qProp = searchParams.get('prop');
  const qUnit = searchParams.get('unit');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  // Step 1: Stay & Unit
  const [propertyId, setPropertyId] = useState(qProp || (data.properties[0]?.id || ''));
  const [checkIn, setCheckIn] = useState(qDate || '');
  const [checkOut, setCheckOut] = useState(() => {
    if (qDate) {
      const d = new Date(qDate);
      d.setDate(d.getDate() + 2);
      return d.toISOString().split('T')[0];
    }
    return '';
  });
  const [selectedUnitId, setSelectedUnitId] = useState(qUnit || '');
  const [roomType, setRoomType] = useState('Standard Room');
  const [roomNumber, setRoomNumber] = useState(qRoom || '');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');

  // Units for selected property
  const availableUnits = useMemo(() => {
    return data.units.filter((u) => u.property_id === propertyId && u.status !== 'inactive');
  }, [data.units, propertyId]);

  // Sync unit selection
  useEffect(() => {
    if (selectedUnitId) {
      const u = availableUnits.find((unit) => unit.id === selectedUnitId);
      if (u) {
        setRoomNumber(u.number);
        setRoomType(u.unit_type);
      }
    }
  }, [selectedUnitId, availableUnits]);

  // Step 2: Guest
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  // Step 3: Pricing
  const [baseAmount, setBaseAmount] = useState<number | ''>(5000);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState(12);

  // Step 4: Advance / Payment
  const [paymentType, setPaymentType] = useState<'none' | 'advance' | 'full'>('advance');
  const [paymentAmount, setPaymentAmount] = useState<number | ''>(2500);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentRef, setPaymentRef] = useState('');

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const d1 = new Date(checkIn).getTime();
    const d2 = new Date(checkOut).getTime();
    const diff = d2 - d1;
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  }, [checkIn, checkOut]);

  // Grand total calculation
  const numBase = Number(baseAmount) || 0;
  const taxAmount = taxEnabled ? Math.round(numBase * (taxRate / 100)) : 0;
  const grandTotal = numBase + taxAmount;

  // Auto-fill payment amount if 'full'
  useEffect(() => {
    if (paymentType === 'full') {
      setPaymentAmount(grandTotal);
    } else if (paymentType === 'none') {
      setPaymentAmount(0);
    }
  }, [paymentType, grandTotal]);

  const numPayment = Number(paymentAmount) || 0;
  const balanceDue = Math.max(0, grandTotal - numPayment);

  // Overlap verification helper
  const checkConflicts = () => {
    if (selectedUnitId && checkIn && checkOut) {
      const res = isBookingOverlapping(
        data.bookings,
        data.unit_blocks,
        selectedUnitId,
        checkIn,
        checkOut
      );
      if (res.hasConflict) {
        return res.message;
      }
    }
    return null;
  };

  const handleNextStep = () => {
    setError('');

    if (step === 1) {
      if (!propertyId || !checkIn || !checkOut || nights <= 0) {
        setError('Please choose valid stay dates (minimum 1 night).');
        return;
      }
      const conflictMsg = checkConflicts();
      if (conflictMsg) {
        setError(conflictMsg);
        return;
      }
    } else if (step === 2) {
      if (isNewGuest) {
        if (!guestName.trim() || !guestPhone.trim()) {
          setError('Guest name and phone number are required.');
          return;
        }
      } else if (!customerId) {
        setError('Please select a registered guest or switch to New Guest.');
        return;
      }
    } else if (step === 3) {
      if (numBase <= 0) {
        setError('Please enter valid accommodation charges.');
        return;
      }
    }

    setStep((s) => s + 1);
  };

  const handleSubmitBooking = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      // Re-verify conflicts before final commit
      const conflictMsg = checkConflicts();
      if (conflictMsg) {
        throw new Error(conflictMsg);
      }

      let finalCustomerId = customerId;
      if (isNewGuest) {
        const createdCust = await createCustomer({
          name: guestName.trim(),
          phone: guestPhone.trim(),
          email: guestEmail.trim() || undefined,
        });
        finalCustomerId = createdCust.id;
      }

      const bookingStatus = 'Confirmed';
      const paymentStatus = balanceDue <= 0 ? 'Paid' : numPayment > 0 ? 'Partially Paid' : 'Unpaid';

      const newBooking = await createBooking({
        booking_no: generateId('BK-'),
        customer_id: finalCustomerId,
        property_id: propertyId,
        unit_id: selectedUnitId || undefined,
        check_in: checkIn,
        check_out: checkOut,
        nights,
        rooms: 1,
        guests,
        room_type: roomType,
        room_number: roomNumber || undefined,
        notes: notes || undefined,
        base_amount: numBase,
        tax_enabled: taxEnabled,
        tax_rate: taxEnabled ? taxRate : 0,
        tax_amount: taxAmount,
        grand_total: grandTotal,
        booking_status: bookingStatus,
        payment_status: paymentStatus,
      });

      // Record advance payment if specified
      if (paymentType !== 'none' && numPayment > 0) {
        await addPayment({
          payment_no: generateId('PAY-'),
          booking_id: newBooking.id,
          date: checkIn <= todayISO() ? todayISO() : checkIn,
          amount: numPayment,
          method: paymentMethod,
          ref_id: paymentRef || undefined,
          purpose: paymentType === 'full' ? 'Full Prepayment' : 'Advance Deposit',
          status: 'Recorded',
        });
      }

      setCreatedBookingId(newBooking.id);
      showToast({ message: 'Reservation created successfully', type: 'success' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (createdBookingId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
        <div className="w-12 h-12 bg-[#EAF4F1] text-[#0D5C4D] rounded-full flex items-center justify-center mb-3">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-[#0E1726]">Reservation confirmed</h2>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-sm">
          The booking has been saved to the tape chart and operational dashboard.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/app/bookings')}>
            View all bookings
          </Button>
          <Button variant="primary" onClick={() => navigate(`/app/bookings/${createdBookingId}`)}>
            Open booking folio &rarr;
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
        <Link to="/app/bookings" className="hover:text-[#0E1726]">
          Bookings
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0E1726] font-medium">New booking</span>
      </div>

      <PageHeader
        title="Create new reservation"
        subtitle={`Step ${step} of 4: ${
          step === 1 ? 'Stay details' : step === 2 ? 'Guest info' : step === 3 ? 'Folio & pricing' : 'Payment deposit'
        }`}
      />

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              s <= step ? 'bg-[#0D5C4D]' : 'bg-[#E4E7EC]'
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="p-3 bg-[#FEF3F2] border border-[#FDA29B] rounded-[6px] text-xs text-[#B42318] font-medium">
          {error}
        </div>
      )}

      {/* STEP 1: Stay Details */}
      {step === 1 && (
        <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#0E1726]">Property & Stay Schedule</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Property"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full"
            >
              {data.properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </Select>

            <Select
              label="Allocated Room / Unit"
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="w-full"
            >
              <option value="">-- Choose available unit --</option>
              {availableUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  Room {u.number} · {u.unit_type}
                </option>
              ))}
            </Select>

            <Input
              type="date"
              label="Check-in Date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />

            <Input
              type="date"
              label="Check-out Date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />

            <Input
              type="number"
              min={1}
              max={10}
              label="Number of Guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />

            <div className="flex flex-col justify-end">
              <div className="h-9 px-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-[6px] flex items-center text-xs text-[#64748B]">
                Stay duration:{' '}
                <strong className="text-[#0E1726] ml-1">{nights} nights</strong>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Input
              label="Special Requests / Notes"
              placeholder="e.g. Airport pick-up, high floor, early arrival"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* STEP 2: Guest Details */}
      {step === 2 && (
        <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4E7EC]">
            <h3 className="text-sm font-semibold text-[#0E1726]">Guest Information</h3>
            <button
              type="button"
              onClick={() => setIsNewGuest(!isNewGuest)}
              className="text-xs text-[#0D5C4D] font-medium hover:underline cursor-pointer"
            >
              {isNewGuest ? 'Select existing guest' : '+ Register new guest'}
            </button>
          </div>

          {isNewGuest ? (
            <div className="space-y-3">
              <Input
                label="Full Name *"
                placeholder="e.g. Rahul Sharma"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
              <Input
                label="Phone Number *"
                placeholder="+91 98765 43210"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
              />
              <Input
                type="email"
                label="Email Address (optional)"
                placeholder="rahul@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <Select
                label="Select Existing Guest"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full"
              >
                <option value="">-- Choose guest from directory --</option>
                {data.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.phone}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Pricing */}
      {step === 3 && (
        <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#0E1726]">Folio & Accommodation Charges</h3>

          <div className="space-y-4">
            <Input
              type="number"
              label="Accommodation Charges (₹) *"
              value={baseAmount}
              onChange={(e) => setBaseAmount(Number(e.target.value))}
            />

            <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-[6px] space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-[#0E1726] cursor-pointer">
                <input
                  type="checkbox"
                  checked={taxEnabled}
                  onChange={(e) => setTaxEnabled(e.target.checked)}
                  className="rounded text-[#0D5C4D]"
                />
                <span>Apply GST / Tax</span>
              </label>

              {taxEnabled && (
                <div className="flex items-center gap-2 pt-1">
                  <Select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-36"
                  >
                    <option value={12}>12% GST</option>
                    <option value={18}>18% GST</option>
                    <option value={5}>5% GST</option>
                    <option value={0}>0% Exempt</option>
                  </Select>
                  <span className="text-xs text-[#64748B]">
                    Tax amount: <strong className="text-[#0E1726]">₹{taxAmount.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#E4E7EC] text-sm font-semibold text-[#0E1726]">
              <span>Grand Total</span>
              <span className="tabular-nums text-base">
                <Money amount={grandTotal} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Payment */}
      {step === 4 && (
        <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#0E1726]">Initial Payment / Deposit</h3>

          <div className="grid grid-cols-3 gap-2">
            {(['none', 'advance', 'full'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPaymentType(type)}
                className={`py-2 text-xs font-medium rounded-[6px] border cursor-pointer capitalize transition-colors ${
                  paymentType === type
                    ? 'bg-[#0D5C4D] text-white border-[#0D5C4D]'
                    : 'bg-white text-[#334155] border-[#E4E7EC] hover:bg-[#F7F8FA]'
                }`}
              >
                {type === 'none' ? 'No payment' : type === 'advance' ? 'Advance deposit' : 'Full payment'}
              </button>
            ))}
          </div>

          {paymentType !== 'none' && (
            <div className="space-y-3 pt-2">
              <Input
                type="number"
                label="Payment Amount (₹)"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
              />

              <Select
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full"
              >
                <option value="UPI">UPI / QR</option>
                <option value="Google Pay">Google Pay</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Bank Transfer">Bank Transfer / NEFT</option>
                <option value="Cash">Cash</option>
              </Select>

              <Input
                label="Transaction / Reference ID (optional)"
                placeholder="e.g. UPI8912049"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
              />
            </div>
          )}

          <div className="p-3 bg-[#F7F8FA] border border-[#E4E7EC] rounded-[6px] flex justify-between items-center text-xs">
            <span>Pending Balance at Checkout:</span>
            <span className={`font-semibold tabular-nums ${balanceDue > 0 ? 'text-[#B45309]' : 'text-[#067647]'}`}>
              <Money amount={balanceDue} />
            </span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
            &larr; Back
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => navigate('/app/bookings')}>
            Cancel
          </Button>
        )}

        {step < 4 ? (
          <Button variant="primary" onClick={handleNextStep}>
            Continue &rarr;
          </Button>
        ) : (
          <Button variant="primary" loading={loading} onClick={handleSubmitBooking}>
            Confirm and create reservation
          </Button>
        )}
      </div>
    </div>
  );
}
