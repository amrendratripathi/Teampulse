import { Status } from '@/redux/slices/membersSlice';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  Working: {
    className: 'bg-status-working text-white hover:bg-status-working',
    label: 'Working',
  },
  Break: {
    className: 'bg-status-break text-white hover:bg-status-break',
    label: 'Break',
  },
  Meeting: {
    className: 'bg-status-meeting text-white hover:bg-status-meeting',
    label: 'Meeting',
  },
  Offline: {
    className: 'bg-status-offline text-white hover:bg-status-offline',
    label: 'Offline',
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
