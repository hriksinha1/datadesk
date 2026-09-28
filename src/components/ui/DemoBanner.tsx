import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useWorkspaceData } from '../../context/WorkspaceDataContext';
import { useToast } from './Toast';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, resetDemoData } = useWorkspaceData();
  const { showToast } = useToast();
  const [resetting, setResetting] = useState(false);

  if (!isDemoMode) return null;

  const handleReset = async () => {
    try {
      setResetting(true);
      await resetDemoData();
      showToast({ message: 'Sample data reset to default successfully', type: 'success' });
    } catch {
      showToast({ message: 'Failed to reset sample data', type: 'error' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="w-full bg-[#EAF4F1] border-b border-[#D1E8E2] px-4 py-1.5 text-xs text-[#0D5C4D] flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0D5C4D]" />
        <span>Sample workspace. Changes stay in this browser.</span>
      </div>

      <button
        type="button"
        onClick={handleReset}
        disabled={resetting}
        className="inline-flex items-center gap-1 font-medium underline hover:text-[#094539] cursor-pointer disabled:opacity-50"
      >
        <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
        <span>Reset sample data</span>
      </button>
    </div>
  );
};
