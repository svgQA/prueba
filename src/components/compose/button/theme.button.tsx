import { Button } from '@/components/common/button/button';
import { useCallback } from 'preact/hooks';
import { themeSignal } from './signal.theme';
interface IThemeButtonProps {
  unpadded?: boolean;
  borderless?: boolean;
  rounded?: boolean;
}

export const ThemeButton = ({
  unpadded = false,
  borderless = false,
  rounded = false,
}: IThemeButtonProps) => {
  const toggleTheme = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    themeSignal.value = !themeSignal.value;
    document.body.classList.toggle('dark');
  }, []);

  return (
    <Button
      id='setting-min-menu'
      name='setting-min-menu'
      onClick={toggleTheme}
      type='button'
      rounded={rounded}
      icon='301'
      padding='px-1'
      borderless={borderless}
      iconSize='xsm'
      unpadded={unpadded}
    />
  );
};
