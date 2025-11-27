import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  loading: boolean;
  error?: string;
}

const statusPool: Status[] = ['Working', 'Meeting', 'Break', 'Offline'];
const taskTemplates = [
  'Prepare sprint report',
  'Update project documentation',
  'Review pull requests',
  'Client presentation prep',
  'Fix priority bugs',
  'Plan team sync',
];

const createTasksForMember = (memberId: string, seed: number): Task[] => {
  return Array.from({ length: 2 }, (_, index) => {
    const template = taskTemplates[(seed + index) % taskTemplates.length];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (index + 1) * 2);
    const progress = Math.floor(Math.random() * 100);

    return {
      id: `${memberId}-task-${index}`,
      title: template,
      dueDate: dueDate.toISOString().split('T')[0],
      progress,
      completed: progress >= 100,
      assignedTo: memberId,
    };
  });
};

export const fetchMembers = createAsyncThunk<Member[]>('members/fetchRandom', async () => {
  const response = await fetch('https://randomuser.me/api/?results=8&nat=us,gb,ca');

  if (!response.ok) {
    throw new Error('Failed to fetch team members');
  }

  const data = await response.json();

  return data.results.map((user: any, index: number) => {
    const memberStatus = statusPool[index % statusPool.length];

    return {
      id: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      avatar: user.picture.large,
      status: memberStatus,
      tasks: createTasksForMember(user.login.uuid, index),
    } as Member;
  });
});

const initialState: MembersState = {
  members: [],
  loading: false,
  error: undefined,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.members = action.payload;
        state.loading = false;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateMemberStatus, assignTask, updateTaskProgress } = membersSlice.actions;
export default membersSlice.reducer;
