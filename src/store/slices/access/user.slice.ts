import { create } from 'zustand';
import { type IUser } from './interface/user.interface';

type State = {
  id: string;
};

type Actions = {
  addUser: (user: IUser) => void;
  addPermission: () => void;
};

export const userStore = create<State & Actions>((set) => ({
  id: '',
  addUser: (user: IUser) => set(() => ({ id: user.id })),
  addPermission: () => set((state) => ({ ...state })),
}));
