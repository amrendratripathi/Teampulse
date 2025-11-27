import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { assignTask } from '@/redux/slices/membersSlice';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const TaskForm = () => {
  const dispatch = useAppDispatch();
  const members = useAppSelector((state) => state.members.members);

  const [selectedMember, setSelectedMember] = useState<string>('');
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMember || !taskTitle || !dueDate) {
      toast.error('Please fill in all fields');
      return;
    }

    dispatch(
      assignTask({
        memberId: selectedMember,
        task: {
          title: taskTitle,
          dueDate: format(dueDate, 'yyyy-MM-dd'),
          progress: 0,
          completed: false,
          assignedTo: selectedMember,
        },
      })
    );

    const memberName = members.find((m) => m.id === selectedMember)?.name;
    toast.success(`Task assigned to ${memberName}`);

    // Reset form
    setSelectedMember('');
    setTaskTitle('');
    setDueDate(undefined);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Assign New Task</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="member">Team Member</Label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger id="member">
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dueDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit" className="w-full">
          Assign Task
        </Button>
      </form>
    </Card>
  );
};

export default TaskForm;
