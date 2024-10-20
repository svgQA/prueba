import { generate } from './build';

export const VOX_DEFAULT_PATH = {
  PROD: '/api/',
  DEFAULT: '/',
};

export const VOS_SERVICES = generate([
  {
    name: 'Tenant',
    value: import.meta.env.VITE_TENANT_SERVICE_URL,
  },
  {
    name: 'Shift',
    value: import.meta.env.VITE_SHIFT_SERVICE_URL,
  },
  {
    name: 'Auth',
    value: import.meta.env.VITE_AUTH_SERVICE_URL,
  },
]);
