import React, { useState, useMemo } from 'react';
import { Plus, Building2, MapPin, Phone, Mail, Bed, Wrench, X, Check } from 'lucide-react';
import { useWorkspaceData } from '../../context/WorkspaceDataContext';
import { Property, Unit } from '../../lib/repository/types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/FormControls';
import { Drawer } from '../../components/ui/Drawer';
import { StatStrip, StatCell } from '../../components/ui/StatStrip';
import { useToast } from '../../components/ui/Toast';
import PropertyModal from './PropertyModal';

export default function PropertiesList() {
  const { data, createUnit, updateUnit, createUnitBlock, deleteUnitBlock, refetch } = useWorkspaceData();
  const { showToast } = useToast();

  const [showAddProperty, setShowAddProperty] = useState(false);
  const [selectedPropForUnits, setSelectedPropForUnits] = useState<Property | null>(null);

  // Unit creation state
  const [newUnitNumber, setNewUnitNumber] = useState('');
  const [newUnitType, setNewUnitType] = useState('Standard Room');
  const [newUnitFloor, setNewUnitFloor] = useState('Floor 1');
  const [addingUnit, setAddingUnit] = useState(false);

  // Unit maintenance block state
  const [blockUnitId, setBlockUnitId] = useState('');
  const [blockStartDate, setBlockStartDate] = useState('');
  const [blockEndDate, setBlockEndDate] = useState('');
  const [blockReason, setBlockReason] = useState<'Maintenance' | 'Other'>('Maintenance');
  const [blockNote, setBlockNote] = useState('');

  const propertyUnits = useMemo(() => {
    if (!selectedPropForUnits) return [];
    return data.units.filter((u) => u.property_id === selectedPropForUnits.id);
  }, [data.units, selectedPropForUnits]);

  const propertyBlocks = useMemo(() => {
    if (!selectedPropForUnits) return [];
    return data.unit_blocks.filter((b) => b.property_id === selectedPropForUnits.id);
  }, [data.unit_blocks, selectedPropForUnits]);

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropForUnits || !newUnitNumber.trim()) return;
    setAddingUnit(true);
    try {
      await createUnit({
        property_id: selectedPropForUnits.id,
        number: newUnitNumber.trim(),
        unit_type: newUnitType,
        floor: newUnitFloor,
        status: 'active',
      });
      setNewUnitNumber('');
      showToast({ message: `Room ${newUnitNumber} added successfully`, type: 'success' });
    } catch {
      showToast({ message: 'Failed to add room', type: 'error' });
    } finally {
      setAddingUnit(false);
    }
  };

  const handleToggleUnitStatus = async (unit: Unit) => {
    const nextStatus = unit.status === 'active' ? 'inactive' : 'active';
    try {
      await updateUnit(unit.id, { status: nextStatus });
      showToast({ message: `Room ${unit.number} marked ${nextStatus}`, type: 'info' });
    } catch {
      showToast({ message: 'Failed to update room', type: 'error' });
    }
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropForUnits || !blockUnitId || !blockStartDate || !blockEndDate) return;
    try {
      await createUnitBlock({
        unit_id: blockUnitId,
        property_id: selectedPropForUnits.id,
        start_date: blockStartDate,
        end_date: blockEndDate,
        reason: blockReason,
        note: blockNote || undefined,
      });
      setBlockUnitId('');
      setBlockStartDate('');
      setBlockEndDate('');
      setBlockNote('');
      showToast({ message: 'Maintenance block added', type: 'success' });
    } catch {
      showToast({ message: 'Failed to create block', type: 'error' });
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await deleteUnitBlock(blockId);
      showToast({ message: 'Maintenance block removed', type: 'info' });
    } catch {
      showToast({ message: 'Failed to remove block', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <PageHeader
        title="Properties & Room Units"
        subtitle="Manage your hospitality properties, room categories, and maintenance schedules"
        actions={
          <Button
            variant="primary"
            onClick={() => setShowAddProperty(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add property
          </Button>
        }
      />

      {/* 2. Overview Strip */}
      <StatStrip>
        <StatCell
          label="TOTAL PROPERTIES"
          value={<span>{data.properties.length}</span>}
          caption="Active hotels, resorts & homestays"
        />
        <StatCell
          label="TOTAL CONFIGURED ROOMS"
          value={<span>{data.units.length} units</span>}
          caption={`${data.units.filter((u) => u.status === 'active').length} active available units`}
        />
        <StatCell
          label="SCHEDULED MAINTENANCE"
          value={<span>{data.unit_blocks.length}</span>}
          caption="Active out-of-service blocks"
        />
      </StatStrip>

      {/* 3. Properties Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.properties.map((p) => {
          const propUnits = data.units.filter((u) => u.property_id === p.id && u.status !== 'inactive');
          const propBlocks = data.unit_blocks.filter((b) => b.property_id === p.id);

          return (
            <div
              key={p.id}
              className="bg-white border border-[#E4E7EC] rounded-[8px] p-5 flex flex-col justify-between hover:border-[#CBD2DC] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-base text-[#0E1726]">{p.name}</h3>
                    <div className="text-xs text-[#64748B]">
                      {p.property_type} · {p.city}, {p.state}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-[4px] bg-[#EAF4F1] text-[#0D5C4D]">
                    {propUnits.length} rooms
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#64748B] pt-2 border-t border-[#E4E7EC]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <span className="truncate">{p.address || p.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <span>{p.phone || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-[#64748B]">
                    <span>Check-in: {p.check_in_time || '14:00'}</span>
                    <span>Check-out: {p.check_out_time || '11:00'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E4E7EC] flex items-center justify-between">
                <span className="text-xs text-[#64748B]">
                  {propBlocks.length > 0 ? (
                    <span className="text-[#B45309] font-medium">{propBlocks.length} maintenance</span>
                  ) : (
                    'All units operational'
                  )}
                </span>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedPropForUnits(p)}
                  icon={<Bed className="w-3.5 h-3.5" />}
                >
                  Manage rooms ({propUnits.length})
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Property Units Management Drawer */}
      {selectedPropForUnits && (
        <Drawer
          isOpen={!!selectedPropForUnits}
          onClose={() => setSelectedPropForUnits(null)}
          title={`Rooms at ${selectedPropForUnits.name}`}
          subtitle={`${propertyUnits.length} configured rooms · ${propertyBlocks.length} maintenance blocks`}
          width="560px"
        >
          {/* Quick Add Unit Form */}
          <form onSubmit={handleAddUnit} className="p-4 bg-[#F7F8FA] border border-[#E4E7EC] rounded-[8px] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0E1726]">
              + Add Room / Bed
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Room # (e.g. 105)"
                value={newUnitNumber}
                onChange={(e) => setNewUnitNumber(e.target.value)}
                required
              />
              <Select
                value={newUnitType}
                onChange={(e) => setNewUnitType(e.target.value)}
              >
                <option value="Standard Room">Standard Room</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Cottage Villa">Cottage Villa</option>
                <option value="Dorm Bed">Dorm Bed</option>
              </Select>
              <Input
                placeholder="Floor (Floor 1)"
                value={newUnitFloor}
                onChange={(e) => setNewUnitFloor(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" variant="primary" type="submit" loading={addingUnit}>
                Add Unit
              </Button>
            </div>
          </form>

          {/* Units List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Units Directory ({propertyUnits.length})
            </h4>
            <div className="divide-y divide-[#E4E7EC] border border-[#E4E7EC] rounded-[8px] overflow-hidden max-h-64 overflow-y-auto">
              {propertyUnits.map((u) => (
                <div key={u.id} className="p-2.5 px-3 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-sm text-[#0E1726]">Room {u.number}</span>
                    <span className="text-[#64748B] ml-2">
                      {u.unit_type} {u.floor ? `· ${u.floor}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 text-[11px] font-medium rounded ${
                        u.status === 'active' ? 'bg-[#EAF4F1] text-[#0D5C4D]' : 'bg-[#FEF3F2] text-[#B42318]'
                      }`}
                    >
                      {u.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleUnitStatus(u)}
                      className="text-[11px] text-[#64748B] hover:text-[#0E1726] underline cursor-pointer"
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Blocks */}
          <div className="space-y-3 pt-3 border-t border-[#E4E7EC]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>Schedule Maintenance Block</span>
            </h4>

            <form onSubmit={handleAddBlock} className="p-3 border border-[#E4E7EC] rounded-[6px] space-y-2.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={blockUnitId}
                  onChange={(e) => setBlockUnitId(e.target.value)}
                  required
                >
                  <option value="">Select Room</option>
                  {propertyUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      Room {u.number}
                    </option>
                  ))}
                </Select>
                <Input
                  type="date"
                  value={blockStartDate}
                  onChange={(e) => setBlockStartDate(e.target.value)}
                  required
                />
                <Input
                  type="date"
                  value={blockEndDate}
                  onChange={(e) => setBlockEndDate(e.target.value)}
                  required
                />
              </div>

              <Input
                placeholder="Reason / Note (e.g. AC Filter inspection, Painting)"
                value={blockNote}
                onChange={(e) => setBlockNote(e.target.value)}
              />

              <div className="flex justify-end">
                <Button size="sm" variant="secondary" type="submit">
                  Add Block
                </Button>
              </div>
            </form>

            {propertyBlocks.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-[#64748B]">Active blocks:</div>
                {propertyBlocks.map((blk) => {
                  const u = propertyUnits.find((unit) => unit.id === blk.unit_id);
                  return (
                    <div
                      key={blk.id}
                      className="p-2 bg-[#F7F8FA] border border-[#E4E7EC] rounded-[4px] flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong>Room {u?.number || '—'}</strong>: {blk.note || blk.reason}
                        <div className="text-[11px] text-[#64748B]">
                          {blk.start_date} to {blk.end_date}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(blk.id)}
                        className="text-xs text-[#B42318] hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* Add Property Modal */}
      {showAddProperty && (
        <PropertyModal
          onClose={() => setShowAddProperty(false)}
          onComplete={() => {
            setShowAddProperty(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
