import {
  ai_pqrs_service_url,
  default_service_url,
  latitude_service_url,
  tenant_service_url,
} from '@/env.config';

export const VOX_DEFAULT_PATH = {
  PROD: '/api/',
  DEFAULT: '/',
};

export const VOS_SERVICES = {
  tenants: tenant_service_url,
  shift: default_service_url,
  report: latitude_service_url,
  auth: default_service_url,
  form: default_service_url,
  memo: default_service_url,
  user: default_service_url,
  file: default_service_url,
  notification: default_service_url,
  module: default_service_url,
  role: default_service_url,
  access: default_service_url,
  key: default_service_url,
  webhook: default_service_url,
  pqrs: default_service_url,
  ai_pqrs: ai_pqrs_service_url,
};
