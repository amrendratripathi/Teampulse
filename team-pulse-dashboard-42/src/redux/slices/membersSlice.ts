import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Status = 'Working' | 'Break' | 'Meeting' | 'Offline';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  progress: number;
  completed: boolean;
  assignedTo: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: Status;
  tasks: Task[];
}

interface MembersState {
  members: Member[];
}

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    status: 'Working',
    tasks: [
      {
        id: 't1',
        title: 'Review pull requests',
        dueDate: '2025-12-01',
        progress: 60,
        completed: false,
        assignedTo: '1',
      },
    ],
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah.smith@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'Meeting',
    tasks: [
      {
        id: 't2',
        title: 'Update documentation',
        dueDate: '2025-11-30',
        progress: 80,
        completed: false,
        assignedTo: '2',
      },
      {
        id: 't3',
        title: 'Client presentation',
        dueDate: '2025-11-28',
        progress: 100,
        completed: true,
        assignedTo: '2',
      },
    ],
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    status: 'Break',
    tasks: [],
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'Working',
    tasks: [
      {
        id: 't4',
        title: 'Bug fixes for release',
        dueDate: '2025-11-29',
        progress: 40,
        completed: false,
        assignedTo: '4',
      },
    ],
  },
  {
    id: '5',
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    status: 'Offline',
    tasks: [],
  },
];

const initialState: MembersState = {
  members: initialMembers,
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    updateMemberStatus: (
      state,
      action: PayloadAction<{ memberId: string; status: Status }>
    ) => {
      const member = state.members.find((m) => m.id === action.payload.memberId);
      if (member) {
        member.status = action.payload.status;
      }
    },
    assignTask: (
      state,
      action: PayloadAction<{ memberId: string; task: Omit<Task, 'id'> }>
    ) => {
      const member = state.members.find((m) => m.id === action.payload.memberId);
      if (member) {
        const newTask: Task = {
          ...action.payload.task,
          id: `t${Date.now()}`,
        };
        member.tasks.push(newTask);
      }
    },
    updateTaskProgress: (
      state,
      action: PayloadAction<{ memberId: string; taskId: string; progress: number }>
    ) => {
      const member = state.members.find((m) => m.id === action.payload.memberId);
      if (member) {
        const task = member.tasks.find((t) => t.id === action.payload.taskId);
        if (task) {
          task.progress = Math.max(0, Math.min(100, action.payload.progress));
          task.completed = task.progress === 100;
        }
      }
    },
  },
});

export const { updateMemberStatus, assignTask, updateTaskProgress } = membersSlice.actions;
export default membersSlice.reducer;
