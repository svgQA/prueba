import { PAGES_LIST } from '@/utils';
import { computed, signal } from '@preact/signals';
import { navigate } from 'wouter/use-browser-location';
import { IAuthState } from './auth';

export const AuthInitialState: IAuthState = {
  status: false,
  username: '',
};

export const authState = signal<IAuthState>(AuthInitialState);
export const authStatus = computed(() => authState.value.status);

export const logout = () => {
  authState.value = AuthInitialState;
  navigate(PAGES_LIST.HOME, { replace: true });
};
