import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateTaskProgress } from '@/redux/slices/membersSlice';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { CalendarDays, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const TaskList = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.role.currentUser);
  const members = useAppSelector((state) => state.members.members);

  const currentMember = members.find((m) => m.name === currentUser);

  if (!currentMember) {
    return null;
  }

  const handleProgressChange = (taskId: string, delta: number) => {
    const task = currentMember.tasks.find((t) => t.id === taskId);
    if (task) {
      dispatch(
        updateTaskProgress({
          memberId: currentMember.id,
          taskId,
          progress: task.progress + delta,
        })
      );
    }
  };

  return (
    <div className="space-y-3">
      {currentMember.tasks.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No tasks assigned yet</p>
        </Card>
      ) : (
        currentMember.tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    {task.completed && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                {!task.completed && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProgressChange(task.id, -10)}
                      disabled={task.progress === 0}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProgressChange(task.id, 10)}
                      disabled={task.progress === 100}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default TaskList;
