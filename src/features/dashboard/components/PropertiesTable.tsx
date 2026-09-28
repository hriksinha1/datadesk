import React from 'react';
import { PropertyRollup } from '../../../lib/analytics';
import { Money } from '../../../components/ui/Typography';

interface PropertiesTableProps {
  rollups: PropertyRollup[];
  onSelectProperty: (propertyId: string) => void;
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({
  rollups,
  onSelectProperty,
}) => {
  if (rollups.length <= 1) return null;

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-3">
        <div>
          <h2 className="text-base font-semibold text-[#0E1726]">Property comparison</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Click any row to scope the entire workspace to that property</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="h-10 bg-[#F7F8FA] border-b border-[#E4E7EC] text-[#64748B] font-medium text-xs select-none">
              <th className="pl-3 pr-4">Property</th>
              <th className="px-3">Occupancy today</th>
              <th className="px-3">Arrivals today</th>
              <th className="px-3 text-right">Booked value</th>
              <th className="px-3 text-right">Collected</th>
              <th className="pr-3 pl-3 text-right">Outstanding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E7EC]">
            {rollups.map((r) => {
              const hasUnits = r.totalUnits > 0;
              return (
                <tr
                  key={r.property.id}
                  onClick={() => onSelectProperty(r.property.id)}
                  className="hover:bg-[#F7F8FA] cursor-pointer transition-colors group"
                >
                  <td className="py-3 pl-3 pr-4">
                    <div className="font-medium text-[#0E1726] group-hover:text-[#0D5C4D]">
                      {r.property.name}
                    </div>
                    <div className="text-xs text-[#64748B]">
                      {r.property.property_type} · {r.property.city}
                    </div>
                  </td>

                  <td className="py-3 px-3 tabular-nums">
                    {hasUnits ? (
                      <div>
                        <span className="font-medium text-[#0E1726]">{r.occupancyPct}%</span>
                        <span className="text-xs text-[#64748B] ml-1">
                          ({r.occupiedToday}/{r.totalUnits})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#64748B] italic">No rooms set up</span>
                    )}
                  </td>

                  <td className="py-3 px-3 tabular-nums text-[#0E1726]">
                    {r.arrivalsToday > 0 ? (
                      <span className="font-medium">{r.arrivalsToday}</span>
                    ) : (
                      <span className="text-[#64748B]">0</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right tabular-nums text-[#0E1726]">
                    <Money amount={r.bookedValue} />
                  </td>

                  <td className="py-3 px-3 text-right tabular-nums text-[#067647] font-medium">
                    <Money amount={r.collected} />
                  </td>

                  <td className="py-3 pr-3 pl-3 text-right tabular-nums font-medium">
                    {r.outstanding > 0 ? (
                      <span className="text-[#B45309]">
                        <Money amount={r.outstanding} />
                      </span>
                    ) : (
                      <span className="text-[#64748B] font-normal">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
