import {
  default_service_url,
  ia_service_url,
  tenant_service_url,
} from '@/env.config';

export const VOX_DEFAULT_PATH = {
  PROD: '/api/',
  DEFAULT: '/',
};

export const VOS_SERVICES = {
  tenant: tenant_service_url,
  ia: ia_service_url,
  shift: default_service_url,
  auth: default_service_url,
  form: default_service_url,
  memo: default_service_url,
  user: default_service_url,
  file: default_service_url,
  notification: default_service_url,
  module: default_service_url,
  role: default_service_url,
};
