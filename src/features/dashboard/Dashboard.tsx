import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { useWorkspaceData, useDashboardModel } from '../../context/WorkspaceDataContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { ErrorState, Skeleton } from '../../components/ui/StateFeedback';
import { TodayStrip } from './components/TodayStrip';
import { AttentionPanel } from './components/AttentionPanel';
import { MovementsPanel } from './components/MovementsPanel';
import { OccupancyForecastCard } from './components/OccupancyForecastCard';
import { MoneyPanel } from './components/MoneyPanel';
import { PropertiesTable } from './components/PropertiesTable';
import { RecentlyAddedTable } from './components/RecentlyAddedTable';

export default function Dashboard() {
  const navigate = useNavigate();
  const { status, error, setPropertyFilter, data } = useWorkspaceData();
  const dashboard = useDashboardModel();
  const [movementsTab, setMovementsTab] = useState<'arrivals' | 'departures' | 'inhouse'>('arrivals');
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-8 h-96 w-full" />
          <Skeleton className="lg:col-span-4 h-96 w-full" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Couldn't load dashboard"
        message={error?.message || 'Failed to load front-desk operations'}
        onRetry={dashboard.refetch}
      />
    );
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dashboard.refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Formatted date: e.g. "Mon, 28 Sep"
  const [y, m, d] = dashboard.today.split('-').map(Number);
  const todayDateObj = new Date(Date.UTC(y, m - 1, d));
  const dateFormatted = todayDateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });

  // Time formatted: e.g. "10:42"
  const timeFormatted = dashboard.lastUpdated.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const scopeSubtitle = (
    <div className="flex items-center gap-2 text-xs text-[#64748B]">
      <span>Updated {timeFormatted}</span>
      <span>·</span>
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center gap-1 hover:text-[#0E1726] transition-colors cursor-pointer"
        aria-label="Refresh operational data"
      >
        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>Refresh</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Page Header */}
      <PageHeader
        title={`Today · ${dateFormatted}`}
        scopeLabel={
          dashboard.activeProperty
            ? dashboard.activeProperty.name
            : `All properties · ${dashboard.totalPropertiesCount}`
        }
        subtitle={scopeSubtitle}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => navigate('/app/bookings?view=calendar')}
              icon={<Calendar className="w-4 h-4" />}
            >
              Calendar
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/app/bookings/new')}
              icon={<Plus className="w-4 h-4" />}
            >
              New booking
            </Button>
          </>
        }
      />

      {/* 2. Today strip (single bordered container, 4 cells) */}
      <TodayStrip
        occupancy={dashboard.occupancyNow}
        arrivalsTotal={dashboard.arrivals.length}
        arrivalsPending={dashboard.arrivalsPendingCount}
        departuresTotal={dashboard.departures.length}
        departuresPending={dashboard.departuresPendingCount}
        departingBalanceDue={dashboard.departingBalanceTotal}
        inHouseStays={dashboard.inHouse.length}
        inHouseGuests={dashboard.inHouseGuests}
        onSelectTab={(tab) => setMovementsTab(tab)}
      />

      {/* 3. Main Area: 8 / 4 Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Attention & Today's Movements */}
        <div className="lg:col-span-8 space-y-6">
          <AttentionPanel
            items={dashboard.attention}
            onAction={(item) => {
              if (item.actionType === 'checkin') {
                setMovementsTab('arrivals');
              } else if (item.actionType === 'checkout') {
                setMovementsTab('departures');
              } else if (item.bookingId) {
                navigate(`/app/bookings/${item.bookingId}`);
              } else {
                navigate('/app/bookings');
              }
            }}
          />

          <MovementsPanel
            arrivals={dashboard.arrivals}
            departures={dashboard.departures}
            inHouse={dashboard.inHouse}
            balancesByBookingId={dashboard.balancesByBookingId}
            scopeIsAll={dashboard.scopeIsAll}
            activeTab={movementsTab}
            onTabChange={setMovementsTab}
            onCheckIn={dashboard.checkIn}
            onCheckOut={dashboard.checkOut}
          />
        </div>

        {/* Right Column (4 cols): Occupancy Forecast & Money */}
        <div className="lg:col-span-4 space-y-6">
          <OccupancyForecastCard
            data={dashboard.occupancyTrend}
            hasUnits={dashboard.occupancyNow.totalUnits > 0}
          />

          <MoneyPanel
            collectedThisMonth={dashboard.money.collectedThisMonth}
            collectedPrevMonth={dashboard.money.collectedPrevMonth}
            bookedThisMonth={dashboard.money.bookedThisMonth}
            totalOutstanding={dashboard.money.totalOutstanding}
            bookingsWithBalanceCount={dashboard.money.bookingsWithBalanceCount}
            collectionsChart={dashboard.money.collectionsChart}
          />
        </div>
      </div>

      {/* 4. Multi-Property Comparison Table (When All properties, >= 2 properties) */}
      {dashboard.scopeIsAll && dashboard.rollups.length > 1 && (
        <PropertiesTable
          rollups={dashboard.rollups}
          onSelectProperty={(propId) => setPropertyFilter(propId)}
        />
      )}

      {/* 5. Recently Created Bookings */}
      <RecentlyAddedTable
        bookings={data.bookings}
        balancesByBookingId={dashboard.balancesByBookingId}
      />
    </div>
  );
}
