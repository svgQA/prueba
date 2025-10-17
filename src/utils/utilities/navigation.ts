import { useLocation } from 'wouter';
import {
  appendHistory,
  currentPosition,
  setMenu,
} from '@/utils/hooks/store/settings';
import { menuInformationSelected as infoMenu } from '@/utils/hooks/store/settings';

export const useNavigation = () => {
  const [_, navigate] = useLocation();

  const navigateUpsert = (path: string) => {
    currentPosition.value = currentPosition.value - 1;
    navigate(path);
  };

  const goBackNative = () => {
    window.history.back();
  };

  const goForwardNative = () => {
    window.history.forward();
  };

  const redirectSettings = (
    base: string,
    path: string,
    label: string,
    id: string
  ) => {
    // console.log(`${base}${path}`);
    const menu = {
      to: `${base}${path}`,
      label,
      id,
    };
    appendHistory(menu);
    setMenu({ ...infoMenu.value, label: label });
    navigate(path);
  };

  return {
    navigateUpsert,
    goBackNative,
    goForwardNative,
    redirectSettings,
  };
};
