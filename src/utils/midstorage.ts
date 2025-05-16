import { localStorage } from './storage';

export const cleanUserStorage = () => {
  localStorage.remove('company');
  localStorage.remove('user');
  localStorage.remove('token');
  localStorage.remove('cognito');
  localStorage.remove('tenant');
};
