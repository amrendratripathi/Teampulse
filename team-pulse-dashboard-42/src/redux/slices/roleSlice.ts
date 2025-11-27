import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Role = 'lead' | 'member';

interface RoleState {
  currentRole: Role;
  currentUser: string;
}

const initialState: RoleState = {
  currentRole: 'lead',
  currentUser: 'John Doe',
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    switchRole: (state, action: PayloadAction<Role>) => {
      state.currentRole = action.payload;
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { switchRole, setUser } = roleSlice.actions;
export default roleSlice.reducer;
