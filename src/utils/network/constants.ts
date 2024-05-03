const MY_LOCATION = window.location.protocol + '//' + window.location.host;
const VITE_UCA_LOCAL_SERVICE_URL = 'http://localhost:8080';

export const UCA_DEFAULT_SERVICE_URL = import.meta.env.PROD
  ? MY_LOCATION
  : import.meta.env.VITE_UCA_DEFAULT_SERVICE_URL || VITE_UCA_LOCAL_SERVICE_URL;

export const UCA_DEFAULT_PATH = {
  PROD: '/api/',
  DEFAULT: '/',
};
