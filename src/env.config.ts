export const {
  VITE_FALLBACK_LOCALE: vite_fallback_locale = 'en',
  VITE_DEFAULT_LOCALE: vite_default_locale = 'es',

  VITE_TENANT_HEADER: tenant_header,
  VITE_COMPANY_HEADER: company_header,
  VITE_PLACE_HEADER: place_header,

  VITE_APP_ENVIRONMENT: app_environment = 'qa',
  VITE_CDN_SERVICE_URL: cdn_service_url,

  VITE_DEFAULT_SERVICE_URL: default_service_url,
  VITE_TRACKING_SERVICE_URL: tracking_service_url,
  BASE_URL: base_url,

  VITE_TENANT_SERVICE_URL: tenant_service_url,
  VITE_IA_SERVICE_URL: ai_pqrs_service_url,

  VITE_LATITUDE_SERVICE_URL: latitude_service_url,

  VITE_AWS_COGNITO_USER_POOL_ID: aws_cognito_user_pool,
  VITE_AWS_COGNITO_CLIENT_ID: aws_cognito_client_id,
  VITE_AWS_COGNITO_IDENTITY_POOL: aws_cognito_identity_pool,
  VITE_AWS_OAUTH_DOMAIN: aws_oauth_domain,

  DEV: tryvoo_environment = false,
} = import.meta.env;
