const MY_LOCATION = window.location.protocol + '//' + window.location.host;
const VITE_VOX_LOCAL_SERVICE_URL = 'http://localhost:8080';

export const VOX_DEFAULT_SERVICE_URL = import.meta.env.PROD
  ? MY_LOCATION
  : import.meta.env.VITE_DEFAULT_SERVICE_URL || VITE_VOX_LOCAL_SERVICE_URL;

export const VOX_DEFAULT_PATH = {
  PROD: '/api/',
  DEFAULT: '/',
};
