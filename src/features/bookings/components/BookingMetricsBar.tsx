import React from 'react';
import { StatStrip, StatCell } from '../../../components/ui/StatStrip';
import { Money } from '../../../components/ui/Typography';

interface BookingMetricsBarProps {
  arrivingTodayCount: number;
  inHouseCount: number;
  departingTodayCount: number;
  totalOutstanding: number;
  balanceBookingsCount: number;
  activeStageFilter?: string;
  onSelectStage: (stage: string) => void;
}

export const BookingMetricsBar: React.FC<BookingMetricsBarProps> = ({
  arrivingTodayCount,
  inHouseCount,
  departingTodayCount,
  totalOutstanding,
  balanceBookingsCount,
  activeStageFilter,
  onSelectStage,
}) => {
  return (
    <StatStrip className="mb-4">
      <StatCell
        label="ARRIVING TODAY"
        value={<span>{arrivingTodayCount}</span>}
        caption="Stays checking in today"
        active={activeStageFilter === 'arriving'}
        onClick={() => onSelectStage(activeStageFilter === 'arriving' ? '' : 'arriving')}
      />

      <StatCell
        label="IN HOUSE"
        value={<span>{inHouseCount}</span>}
        caption="Currently checked in"
        active={activeStageFilter === 'inHouse'}
        onClick={() => onSelectStage(activeStageFilter === 'inHouse' ? '' : 'inHouse')}
      />

      <StatCell
        label="DEPARTING TODAY"
        value={<span>{departingTodayCount}</span>}
        caption="Stays checking out today"
        active={activeStageFilter === 'departing'}
        onClick={() => onSelectStage(activeStageFilter === 'departing' ? '' : 'departing')}
      />

      <StatCell
        label="BALANCE DUE"
        value={
          <span className={totalOutstanding > 0 ? 'text-[#B45309]' : 'text-[#0E1726]'}>
            <Money amount={totalOutstanding} />
          </span>
        }
        caption={`${balanceBookingsCount} bookings with pending folios`}
        active={activeStageFilter === 'balanceDue'}
        onClick={() => onSelectStage(activeStageFilter === 'balanceDue' ? '' : 'balanceDue')}
      />
    </StatStrip>
  );
};

export default BookingMetricsBar;
