import ProductFrame from './ProductFrame';
import { formatINR, getArrivals, getBalance, getDepartures, getGuest, getOccupiedCount, getProperty, sampleBookings, SAMPLE_TIME, SAMPLE_TODAY } from './sampleData';

export default function PreviewToday() {
  const occupancy = getOccupiedCount('fern');
  const property = getProperty('fern');
  const arrivals = getArrivals();
  const departures = getDepartures();
  const balanceBooking = sampleBookings[0];
  const todayLabel = new Date(`${SAMPLE_TODAY}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).toUpperCase();

  return <ProductFrame><div className="mk-preview-content">
    <div className="mk-preview-heading"><div><span className="mk-preview-kicker">{todayLabel}</span><h3>Today at a glance</h3></div><span className="mk-preview-clock">{SAMPLE_TIME}</span></div>
    <div className="mk-preview-stats">
      <div><span>In house</span><strong>{occupancy}</strong><small>of {property?.roomCount} rooms</small></div>
      <div><span>Arrivals</span><strong>{arrivals.length}</strong><small>expected today</small></div>
      <div><span>Departures</span><strong>{departures.length}</strong><small>checking out</small></div>
    </div>
    <div className="mk-attention">
      <div className="mk-attention-title"><span className="mk-warning-dot" />Attention today</div>
      <div className="mk-attention-row"><span><strong>{getGuest(balanceBooking.guestId)?.name}</strong> · Room {balanceBooking.room} · departs today</span><b>{formatINR(getBalance(balanceBooking))} due</b></div>
      <div className="mk-attention-row"><span>{arrivals.length} arrivals still to welcome</span><span className="mk-status status-confirmed">Arrivals</span></div>
      <div className="mk-attention-row"><span>Room {departures[1]?.room} · checkout today</span><span className="mk-status status-neutral">Departure</span></div>
    </div>
  </div></ProductFrame>;
}
