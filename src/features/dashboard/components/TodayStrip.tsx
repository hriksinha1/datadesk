import React from 'react';
import { Link } from 'react-router-dom';
import { StatStrip, StatCell } from '../../../components/ui/StatStrip';
import { Money } from '../../../components/ui/Typography';
import { OccupancySnapshot } from '../../../lib/analytics';

interface TodayStripProps {
  occupancy: OccupancySnapshot;
  arrivalsTotal: number;
  arrivalsPending: number;
  departuresTotal: number;
  departuresPending: number;
  departingBalanceDue: number;
  inHouseStays: number;
  inHouseGuests: number;
  onSelectTab: (tab: 'arrivals' | 'departures' | 'inhouse') => void;
}

export const TodayStrip: React.FC<TodayStripProps> = ({
  occupancy,
  arrivalsTotal,
  arrivalsPending,
  departuresTotal,
  departuresPending,
  departingBalanceDue,
  inHouseStays,
  inHouseGuests,
  onSelectTab,
}) => {
  const hasUnits = occupancy.totalUnits > 0;
  const occupiedTotal = occupancy.occupied + occupancy.reserved;

  return (
    <StatStrip className="mb-6">
      {/* 1. Occupancy */}
      <StatCell
        label="OCCUPANCY TODAY"
        value={
          hasUnits ? (
            <div className="flex items-baseline gap-1.5">
              <span>{occupancy.occupancyPct}%</span>
              <span className="text-xs font-normal text-[#64748B]">
                ({occupiedTotal}/{occupancy.totalUnits})
              </span>
            </div>
          ) : (
            <span className="text-sm font-normal text-[#64748B]">—</span>
          )
        }
        caption={
          hasUnits ? (
            <div className="w-full bg-[#E4E7EC] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#0D5C4D] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, occupancy.occupancyPct || 0)}%` }}
              />
            </div>
          ) : (
            <Link to="/app/properties" className="text-xs text-[#0D5C4D] hover:underline font-medium">
              Add rooms to see occupancy &rarr;
            </Link>
          )
        }
      />

      {/* 2. Arrivals */}
      <StatCell
        label="ARRIVALS"
        value={<span>{arrivalsTotal}</span>}
        caption={
          <span className={arrivalsPending > 0 ? 'text-[#B45309] font-medium' : 'text-[#64748B]'}>
            {arrivalsPending > 0 ? `${arrivalsPending} still to check in` : 'All checked in'}
          </span>
        }
        onClick={() => onSelectTab('arrivals')}
      />

      {/* 3. Departures */}
      <StatCell
        label="DEPARTURES"
        value={<span>{departuresTotal}</span>}
        caption={
          departingBalanceDue > 0 ? (
            <span className="text-[#B45309] font-medium">
              <Money amount={departingBalanceDue} /> due at checkout
            </span>
          ) : (
            <span>{departuresPending > 0 ? `${departuresPending} still in room` : 'All completed'}</span>
          )
        }
        onClick={() => onSelectTab('departures')}
      />

      {/* 4. In House */}
      <StatCell
        label="IN HOUSE"
        value={<span>{inHouseStays}</span>}
        caption={<span>{inHouseGuests} guests currently on property</span>}
        onClick={() => onSelectTab('inhouse')}
      />
    </StatStrip>
  );
};
