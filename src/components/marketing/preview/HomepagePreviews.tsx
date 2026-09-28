import { useMemo, useState, type KeyboardEvent } from 'react';
import ProductFrame from './ProductFrame';
import {
  formatINR,
  getBalance,
  getGuest,
  getNights,
  getOccupiedCount,
  getOpenBalance,
  getPortfolioOpenBalance,
  getPortfolioTotals,
  getTotal,
  sampleBookings,
  sampleProperties,
  SAMPLE_TODAY,
} from './sampleData';

export function PreviewBookings() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('BK-1046');
  const results = useMemo(() => sampleBookings.filter((booking) => {
    const guestName = getGuest(booking.guestId)?.name || '';
    return `${guestName} ${booking.room} ${booking.id}`.toLowerCase().includes(query.toLowerCase());
  }).slice(0, 5), [query]);
  const selected = results.find((booking) => booking.id === selectedId) ?? results[0];

  return (
    <ProductFrame>
      <div className="mk-bookings-preview">
        <div className="mk-booking-list">
          <label className="mk-search-label" htmlFor="sample-booking-search">Find a booking</label>
          <input id="sample-booking-search" className="mk-search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, room or booking no." />
          <div aria-live="polite" className="mk-result-count">{results.length} sample {results.length === 1 ? 'stay' : 'stays'}</div>
          {results.map((booking) => (
            <button key={booking.id} type="button" onClick={() => setSelectedId(booking.id)} className={`mk-booking-result ${selected?.id === booking.id ? 'is-selected' : ''}`}>
              <span><strong>{getGuest(booking.guestId)?.name}</strong><small>Room {booking.room} · {booking.id}</small></span>
              <span className="mk-booking-amount">{formatINR(getBalance(booking))}<small>balance</small></span>
            </button>
          ))}
          {results.length === 0 && <p className="mk-empty-result">No matching sample bookings.</p>}
        </div>
        <div className="mk-booking-detail" aria-live="polite">
          {selected ? <>
            <span className="mk-preview-kicker">BOOKING DETAILS</span>
            <h3>{getGuest(selected.guestId)?.name}</h3>
            <dl><div><dt>Booking</dt><dd>{selected.id}</dd></div><div><dt>Room</dt><dd>{selected.room} · {selected.roomType}</dd></div><div><dt>Stay</dt><dd>{selected.checkIn.slice(5)} – {selected.checkOut.slice(5)} · {getNights(selected)} nights</dd></div><div><dt>Total</dt><dd>{formatINR(getTotal(selected))}</dd></div><div><dt>Balance</dt><dd className="mk-balance-value">{formatINR(getBalance(selected))}</dd></div></dl>
          </> : <p>Select a stay to see its details.</p>}
        </div>
      </div>
    </ProductFrame>
  );
}

const calendarRooms = ['101', '102', '103', '204', '201', '202'].map((number) => ({
  number,
  booking: sampleBookings.find((booking) => booking.propertyId === 'fern' && booking.room === number),
}));

export function PreviewCalendar() {
  const days = Array.from({ length: 7 }, (_, index) => new Date(Date.parse(`${SAMPLE_TODAY}T00:00:00Z`) + index * 86400000));
  return (
    <ProductFrame>
      <div className="mk-calendar-scroll" role="region" aria-label="Sample room availability for 28 September through 4 October 2026" tabIndex={0}>
        <div className="mk-calendar-grid">
          <div className="mk-calendar-head"><span>Room</span>{days.map((day) => <span key={day.toISOString()}>{day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', timeZone: 'UTC' })}</span>)}</div>
          {calendarRooms.map((room) => <div className="mk-calendar-row" key={room.number}>
            <strong className="mk-room-label">{room.number}<small>Room</small></strong>
            <div className="mk-calendar-track">
              {days.map((day) => <span key={day.toISOString()} className="mk-calendar-cell">{!room.booking && <span className="mk-open-label">Open</span>}</span>)}
              {room.booking && (() => {
                const booking = room.booking;
                const start = Date.parse(`${booking.checkIn}T00:00:00Z`);
                const end = Date.parse(`${booking.checkOut}T00:00:00Z`);
                const first = days[0].getTime();
                const last = days[days.length - 1].getTime();
                if (end < first || start > last) return null;
                const startIndex = Math.max(0, Math.floor((start - first) / 86400000));
                const visibleNights = Math.min(days.length - startIndex, Math.ceil((Math.min(end, last) - (first + startIndex * 86400000)) / 86400000) + 1);
                const status = getBalance(booking) > 0 ? 'due' : booking.checkOut === SAMPLE_TODAY ? 'checkout' : booking.checkIn === SAMPLE_TODAY ? 'confirmed' : 'checked';
                const statusLabel = status === 'due' ? 'Balance due' : status === 'checkout' ? 'Checkout today' : status === 'confirmed' ? 'Confirmed' : 'Checked in';
                return <span className={`mk-stay-bar state-${status}`} style={{ left: `${startIndex * 100 / 7}%`, width: `${visibleNights * 100 / 7}%` }}>{getGuest(booking.guestId)?.name} · {statusLabel}</span>;
              })()}
            </div>
          </div>)}
        </div>
      </div>
      <div className="mk-calendar-legend"><span><i className="legend-confirmed" />Confirmed</span><span><i className="legend-checked" />Checked in</span><span><i className="legend-due" />Balance due</span><span><i className="legend-open" />Open</span></div>
    </ProductFrame>
  );
}

export function PreviewPayments() {
  const booking = sampleBookings[0];
  const total = getTotal(booking);
  const paid = booking.paid;
  const balance = getBalance(booking);
  return (
    <ProductFrame>
      <div className="mk-ledger">
        <div className="mk-ledger-person"><span className="mk-preview-kicker">GUEST FOLIO · {booking.id}</span><h3>{getGuest(booking.guestId)?.name}</h3><p>Room {booking.room} · 25–28 September · 3 nights</p></div>
        <div className="mk-ledger-items"><div><span>Room · {formatINR(booking.rate)} × {getNights(booking)} nights</span><b>{formatINR(booking.rate * getNights(booking))}</b></div><div><span>Additional charges</span><b>{formatINR(booking.extras)}</b></div><div className="ledger-total"><span>Booking total</span><b>{formatINR(total)}</b></div><div><span>UPI advance recorded</span><b>− {formatINR(paid)}</b></div><div className="ledger-balance"><span>Balance due</span><b>{formatINR(balance)}</b></div></div>
      </div>
    </ProductFrame>
  );
}

export function PreviewPortfolio() {
  const [activeProperty, setActiveProperty] = useState('all');
  const totals = getPortfolioTotals();
  const visibleProperties = activeProperty === 'all' ? sampleProperties : sampleProperties.filter((property) => property.id === activeProperty);
  const activePropertyName = sampleProperties.find((property) => property.id === activeProperty)?.name;

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    if (!tabs?.length) return;
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  };

  return (
    <ProductFrame property={activePropertyName ?? 'All properties'}>
      <div className="mk-portfolio-switcher" role="tablist" aria-label="Choose a sample property view">
        <button id="portfolio-tab-all" type="button" role="tab" aria-selected={activeProperty === 'all'} aria-controls="portfolio-panel" tabIndex={activeProperty === 'all' ? 0 : -1} onClick={() => setActiveProperty('all')} onKeyDown={(event) => handleTabKeyDown(event, 0)}>All properties</button>
        {sampleProperties.map((property, index) => <button id={`portfolio-tab-${property.id}`} type="button" role="tab" aria-selected={activeProperty === property.id} aria-controls="portfolio-panel" tabIndex={activeProperty === property.id ? 0 : -1} onClick={() => setActiveProperty(property.id)} onKeyDown={(event) => handleTabKeyDown(event, index + 1)} key={property.id}>{property.name}</button>)}
      </div>
      <div id="portfolio-panel" role="tabpanel" aria-labelledby={activeProperty === 'all' ? 'portfolio-tab-all' : `portfolio-tab-${activeProperty}`}>
        <div className="mk-portfolio-table" role="table" aria-label="Sample property overview">
          <div className="mk-portfolio-row mk-portfolio-head" role="row"><span role="columnheader">Property</span><span role="columnheader">Rooms</span><span role="columnheader">Occupied today</span><span role="columnheader">Open balances</span></div>
          {visibleProperties.map((property) => {
          const openBalance = getOpenBalance(property.id);
          return <div className="mk-portfolio-row" role="row" key={property.id}><strong role="cell">{property.name}</strong><span role="cell">{property.roomCount}</span><span role="cell">{getOccupiedCount(property.id)} / {property.roomCount}</span><span role="cell">{formatINR(openBalance)}</span></div>;
          })}
          {activeProperty === 'all' && <div className="mk-portfolio-row mk-portfolio-total" role="row"><strong role="cell">Across {totals.properties} properties</strong><span role="cell">{totals.rooms}</span><span role="cell">{totals.occupied} / {totals.rooms}</span><span role="cell">{formatINR(getPortfolioOpenBalance())}</span></div>}
        </div>
      </div>
    </ProductFrame>
  );
}