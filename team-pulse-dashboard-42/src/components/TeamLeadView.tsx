import { useState, useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { Status } from '@/redux/slices/membersSlice';
import MemberCard from './MemberCard';
import TaskForm from './TaskForm';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Users, Coffee, Video, WifiOff, TrendingUp } from 'lucide-react';

const TeamLeadView = () => {
  const members = useAppSelector((state) => state.members.members);
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'tasks'>('name');

  const statusCounts = useMemo(() => {
    return members.reduce(
      (acc, member) => {
        acc[member.status]++;
        return acc;
      },
      { Working: 0, Break: 0, Meeting: 0, Offline: 0 } as Record<Status, number>
    );
  }, [members]);

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members;

    if (filterStatus !== 'All') {
      filtered = members.filter((m) => m.status === filterStatus);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'tasks') {
        const aActiveTasks = a.tasks.filter((t) => !t.completed).length;
        const bActiveTasks = b.tasks.filter((t) => !t.completed).length;
        return bActiveTasks - aActiveTasks;
      }
      return a.name.localeCompare(b.name);
    });

    return sorted;
  }, [members, filterStatus, sortBy]);

  const statusSummary = [
    { status: 'Working', count: statusCounts.Working, icon: Users, color: 'text-status-working' },
    { status: 'Break', count: statusCounts.Break, icon: Coffee, color: 'text-status-break' },
    { status: 'Meeting', count: statusCounts.Meeting, icon: Video, color: 'text-status-meeting' },
    { status: 'Offline', count: statusCounts.Offline, icon: WifiOff, color: 'text-status-offline' },
  ];

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusSummary.map((item) => (
          <Card key={item.status} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.status}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{item.count}</p>
              </div>
              <item.icon className={`w-8 h-8 ${item.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Task Assignment Form */}
      <TaskForm />

      {/* Filters and Team List */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Team Members</h2>
            <span className="text-sm text-muted-foreground">
              ({filteredAndSortedMembers.length})
            </span>
          </div>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as Status | 'All')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Working">Working</SelectItem>
              <SelectItem value="Break">Break</SelectItem>
              <SelectItem value="Meeting">Meeting</SelectItem>
              <SelectItem value="Offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'name' | 'tasks')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="tasks">Sort by Tasks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamLeadView;
