import { toast } from 'react-toastify';
import { getTheme } from '@/components/compose/button/signal.theme';
import { CustomToast } from '@/components/compose/toast/CustomToast';
import { VoxError } from '../network/error';
import i18n from '@/i18n';

export class ToastManager {
  public static success(message: string) {
    toast.success(i18n.t(message), {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: getTheme.value ? 'dark' : 'light',
    });
  }

  public static error(message: string | VoxError) {
    if (typeof message === 'string') {
      toast.error(i18n.t(message), {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: getTheme.value ? 'dark' : 'light',
      });
    } else {
      toast.error(CustomToast, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: getTheme.value ? 'dark' : 'light',
        data: message,
      });
    }
  }

  public static warning(message: string) {
    toast.warning(i18n.t(message), {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: getTheme.value ? 'dark' : 'light',
    });
  }

  public static info(message: string) {
    toast.info(i18n.t(message), {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: getTheme.value ? 'dark' : 'light',
    });
  }
}
