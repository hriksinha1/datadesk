import React, { useState } from 'react';
import { X, Building } from 'lucide-react';
import { Property } from '../../lib/repository/types';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/FormControls';
import { useWorkspaceData } from '../../context/WorkspaceDataContext';
import { useToast } from '../../components/ui/Toast';

export default function PropertyModal({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: () => void;
}) {
  const { data, refetch } = useWorkspaceData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Omit<Property, 'id' | 'created_at'>>({
    name: '',
    property_type: 'Hotel',
    location: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    check_in_time: '14:00',
    check_out_time: '11:00',
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { repository } = await import('../../lib/repository');
      await repository.createProperty(formData);
      await refetch();
      showToast({ message: 'Property created successfully', type: 'success' });
      onComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-white border border-[#E4E7EC] rounded-[8px] shadow-[0_8px_24px_rgba(14,23,38,0.16)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="h-14 px-5 border-b border-[#E4E7EC] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-[#0D5C4D]" />
            <h2 className="text-base font-semibold text-[#0E1726]">Add New Property</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#0E1726] rounded-[4px] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 bg-[#FEF3F2] border border-[#FDA29B] rounded-[6px] text-xs text-[#B42318]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Property Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. The Grand Heritage"
              />
            </div>

            <Select
              label="Property Type"
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
              className="w-full"
            >
              <option value="Hotel">Hotel</option>
              <option value="Resort">Resort</option>
              <option value="Homestay">Homestay</option>
              <option value="Hostel">Hostel</option>
              <option value="Guest House">Guest House</option>
            </Select>

            <Input
              label="Location / Area"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. City Center, Beach Road"
            />

            <Input
              label="City *"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              placeholder="e.g. Mysuru"
            />

            <Input
              label="State *"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
              placeholder="e.g. Karnataka"
            />

            <Input
              label="Phone Number *"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="+91 98765 43210"
            />

            <Input
              label="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@property.com"
            />

            <Input
              type="time"
              label="Standard Check-in Time"
              value={formData.check_in_time}
              onChange={(e) => setFormData({ ...formData, check_in_time: e.target.value })}
            />

            <Input
              type="time"
              label="Standard Check-out Time"
              value={formData.check_out_time}
              onChange={(e) => setFormData({ ...formData, check_out_time: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E4E7EC]">
            <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              Create Property
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
