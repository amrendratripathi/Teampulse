import { useAppSelector } from '@/redux/hooks';
import StatusSelector from './StatusSelector';
import TaskList from './TaskList';
import { Card } from './ui/card';
import { ClipboardList } from 'lucide-react';

const TeamMemberView = () => {
  const currentUser = useAppSelector((state) => state.role.currentUser);
  const members = useAppSelector((state) => state.members.members);
  const currentMember = members.find((m) => m.name === currentUser);

  if (!currentMember) {
    return null;
  }

  const activeTasks = currentMember.tasks.filter((t) => !t.completed).length;
  const completedTasks = currentMember.tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Tasks</p>
              <p className="text-2xl font-bold text-foreground mt-1">{activeTasks}</p>
            </div>
            <ClipboardList className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed Tasks</p>
              <p className="text-2xl font-bold text-foreground mt-1">{completedTasks}</p>
            </div>
            <ClipboardList className="w-8 h-8 text-status-working" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {currentMember.tasks.length}
              </p>
            </div>
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Status Selector */}
      <StatusSelector />

      {/* Task List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Your Tasks</h2>
        </div>
        <TaskList />
      </div>
    </div>
  );
};

export default TeamMemberView;
