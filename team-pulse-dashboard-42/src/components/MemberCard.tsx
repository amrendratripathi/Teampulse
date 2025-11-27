import { Member } from '@/redux/slices/membersSlice';
import { Card } from './ui/card';
import StatusBadge from './StatusBadge';
import { Mail, ClipboardList } from 'lucide-react';

interface MemberCardProps {
  member: Member;
}

const MemberCard = ({ member }: MemberCardProps) => {
  const activeTasks = member.tasks.filter((t) => !t.completed).length;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={member.avatar}
          alt={member.name}
          className="w-14 h-14 rounded-full border-2 border-primary/20"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-foreground">{member.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Mail className="w-3 h-3" />
                <span className="truncate">{member.email}</span>
              </div>
            </div>
            <StatusBadge status={member.status} />
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <ClipboardList className="w-4 h-4" />
            <span>
              {activeTasks} active task{activeTasks !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MemberCard;
