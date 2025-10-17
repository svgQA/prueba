import i18n from '@/i18n';
import { showAlert } from '../../show-alert/show-alert';
import { ToastManager } from '@/utils/toast/toast-manager';

export const getLocation = async () => {
  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );
    return position;
  } catch (error) {
    getErrorGeolocation(error as GeolocationPositionError);
    return null;
  }
};

export const getErrorGeolocation = (error: GeolocationPositionError) => {
  if (!(error instanceof GeolocationPositionError)) return;

  if (error.code === error.PERMISSION_DENIED) {
    showAlert({
      title: i18n.t('i_location_title'),
      message: i18n.t('i_location_message'),
      onConfirm: () => {},
      onCancel: () => {},
    });
  } else if (error.code === error.POSITION_UNAVAILABLE) {
    ToastManager.error('s_gps_error');
  } else {
    ToastManager.error('s_gps_timeout');
  }
};

export const getLocationMap = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      resolve({ lat: latitude, lng: longitude });
    };

    const handleError = (err: GeolocationPositionError) => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          ToastManager.error(i18n.t('maps.connect.error_permission'));
          break;
        case err.POSITION_UNAVAILABLE:
          ToastManager.error(i18n.t('maps.connect.error_location'));
          break;
        case err.TIMEOUT:
          ToastManager.error(i18n.t('maps.connect.error_timeout'));
          break;
        default:
          ToastManager.error(i18n.t('maps.connect.error_unknown'));
      }
      reject(err);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
};
