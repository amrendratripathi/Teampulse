import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateMemberStatus, Status } from '@/redux/slices/membersSlice';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Coffee, Users, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

const statusOptions: { status: Status; icon: React.ReactNode; label: string }[] = [
  { status: 'Working', icon: <Wifi className="w-4 h-4" />, label: 'Working' },
  { status: 'Break', icon: <Coffee className="w-4 h-4" />, label: 'Break' },
  { status: 'Meeting', icon: <Users className="w-4 h-4" />, label: 'Meeting' },
  { status: 'Offline', icon: <WifiOff className="w-4 h-4" />, label: 'Offline' },
];

const StatusSelector = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.role.currentUser);
  const members = useAppSelector((state) => state.members.members);

  const currentMember = members.find((m) => m.name === currentUser);

  if (!currentMember) {
    return null;
  }

  const handleStatusChange = (status: Status) => {
    dispatch(updateMemberStatus({ memberId: currentMember.id, status }));
    toast.success(`Status updated to ${status}`);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Update Your Status</h2>
      <div className="grid grid-cols-2 gap-3">
        {statusOptions.map((option) => {
          const isActive = currentMember.status === option.status;
          return (
            <Button
              key={option.status}
              variant={isActive ? 'default' : 'outline'}
              className="h-auto py-4 gap-2 flex-col"
              onClick={() => handleStatusChange(option.status)}
            >
              {option.icon}
              <span>{option.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default StatusSelector;
