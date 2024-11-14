const DEFAULT_SERVICE = 'http://localhost:8080';

export const VOX_DEFAULT_PATH = {
  PROD: '/api/',
  DEFAULT: '/',
};

export const VOS_SERVICES = {
  tenant: import.meta.env.VITE_TENANT_SERVICE_URL || DEFAULT_SERVICE,
  shift: import.meta.env.VITE_SHIFT_SERVICE_URL || DEFAULT_SERVICE,
  auth: import.meta.env.VITE_AUTH_SERVICE_URL || DEFAULT_SERVICE,
  ia: import.meta.env.VITE_IA_SERVICE_URL || DEFAULT_SERVICE,
  form: import.meta.env.VITE_FORM_SERVICE_URL || DEFAULT_SERVICE,
  memo: import.meta.env.VITE_MEMO_SERVICE_URL || DEFAULT_SERVICE,
};
