import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type SampleWorkspaceActionProps = { className?: string; label?: string };

export default function SampleWorkspaceAction({ className = '', label = 'Open the sample workspace' }: SampleWorkspaceActionProps) {
  const { user, quickDemoAccess } = useAuth();
  const navigate = useNavigate();

  const openWorkspace = async () => {
    if (!user) await quickDemoAccess();
    navigate('/app');
  };

  return <button className={className} type="button" onClick={openWorkspace}>{label}</button>;
}
