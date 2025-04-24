import { toast, ToastOptions } from 'react-toastify';
import { CustomToast } from './CustomToast';

interface ToastData {
  title: string;
  text: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showToast = (data: ToastData, options?: ToastOptions) => {
  const toastOptions = { ...defaultOptions, ...options };

  switch (data.type) {
    case 'success':
      return toast.success(CustomToast, { ...toastOptions, data });
    case 'error':
      return toast.error(CustomToast, { ...toastOptions, data });
    case 'warning':
      return toast.warning(CustomToast, { ...toastOptions, data });
    default:
      return toast.info(CustomToast, { ...toastOptions, data });
  }
};

// Helper functions for common toast types
export const showSuccessToast = (
  title: string,
  text: string,
  options?: ToastOptions
) => {
  return showToast({ title, text, type: 'success' }, options);
};

export const showErrorToast = (
  title: string,
  text: string,
  options?: ToastOptions
) => {
  return showToast({ title, text, type: 'error' }, options);
};

export const showWarningToast = (
  title: string,
  text: string,
  options?: ToastOptions
) => {
  return showToast({ title, text, type: 'warning' }, options);
};

export const showInfoToast = (
  title: string,
  text: string,
  options?: ToastOptions
) => {
  return showToast({ title, text, type: 'info' }, options);
};
