import { computed, signal } from '@preact/signals';
import { navigate } from 'wouter/use-browser-location';
import { IAuthState } from './interfaces';

import { PAGES_LIST } from '@/utils/routing';

export const AuthInitialState: IAuthState = {
  status: false,
  username: 'Juan Pablo Rodrìguez Fernàndez',
  company: 'Voxline',
  rol: 'Administrador',
  image:
    'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L3BmLWljb240LWppcjIwNjItcG9yLWwtam9iNzg4LnBuZw.png',
};

export const authState = signal<IAuthState>(AuthInitialState);
export const authStatus = computed(() => authState.value.status);
export const authModel = computed(() => authState.value);

export const logout = () => {
  authState.value = AuthInitialState;
  navigate(PAGES_LIST.HOME, { replace: true });
};
