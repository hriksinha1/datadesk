import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AttentionItem } from '../../../lib/analytics';
import { Button } from '../../../components/ui/Button';

interface AttentionPanelProps {
  items: AttentionItem[];
  onAction?: (item: AttentionItem) => void;
}

export const AttentionPanel: React.FC<AttentionPanelProps> = ({ items, onAction }) => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const displayedItems = showAll ? items : items.slice(0, 5);

  const handleItemAction = (item: AttentionItem) => {
    if (onAction) {
      onAction(item);
      return;
    }
    if (item.bookingId) {
      navigate(`/app/bookings/${item.bookingId}`);
    } else {
      navigate('/app/bookings');
    }
  };

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-[8px] p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC] mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-[#0E1726]">Needs attention</h2>
          <span
            className={`px-1.5 py-0.5 text-xs font-semibold rounded-[4px] tabular-nums ${
              items.length > 0 ? 'bg-[#FEF3C7] text-[#B45309]' : 'bg-[#F7F8FA] text-[#64748B]'
            }`}
          >
            {items.length}
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#64748B]">
          <CheckCircle2 className="w-4 h-4 text-[#067647]" />
          <span>Nothing needs attention right now. All front-desk operations are clear.</span>
        </div>
      ) : (
        <div className="divide-y divide-[#E4E7EC]">
          {displayedItems.map((item) => {
            const isDanger = item.severity === 'danger';
            const isWarning = item.severity === 'warning';

            const borderLeft = isDanger
              ? 'border-l-4 border-l-[#B42318]'
              : isWarning
              ? 'border-l-4 border-l-[#B45309]'
              : 'border-l-4 border-l-[#1D4ED8]';

            const Icon = isDanger ? AlertCircle : isWarning ? AlertTriangle : Info;
            const iconColor = isDanger ? 'text-[#B42318]' : isWarning ? 'text-[#B45309]' : 'text-[#1D4ED8]';

            return (
              <div
                key={item.id}
                className={`py-3 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#F7F8FA] rounded-[4px] transition-colors ${borderLeft}`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-[#0E1726]">{item.title}</div>
                    <div className="text-xs text-[#64748B] mt-0.5">{item.subtitle}</div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <Button
                    size="sm"
                    variant={isDanger ? 'danger' : 'secondary'}
                    onClick={() => handleItemAction(item)}
                  >
                    {item.actionLabel}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 5 && (
        <div className="pt-3 border-t border-[#E4E7EC] mt-3 text-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-medium text-[#0D5C4D] hover:underline cursor-pointer"
          >
            {showAll ? 'Show fewer items' : `View all (${items.length})`}
          </button>
        </div>
      )}
    </div>
  );
};
