import { Button } from '@/components/common/button/button';
import { useCallback, useEffect } from 'preact/hooks';
import { getTheme, setTheme, toggleTheme } from './signal.theme';
import { localStorage } from '@/utils/storage';
interface IThemeButtonProps {
  unpadded?: boolean;
  rounded?: boolean;
}

export const ThemeButton = ({
  unpadded = false,
  rounded = false,
}: IThemeButtonProps) => {
  useEffect(() => {
    initTheme();
  }, []);

  const initTheme = () => {
    const theme = localStorage.get('theme');
    if (theme && typeof theme === 'boolean') {
      setTheme(theme);
      setBodyTheme(theme);
    }
  };

  const setBodyTheme = (mode: boolean) => {
    document.body.classList.add(mode ? 'dark' : 'light');
  };

  const toogleBodyTheme = () => {
    document.body.classList.toggle('dark');
  };

  const onClickTheme = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleTheme();
    toogleBodyTheme();
    localStorage.set('theme', getTheme.value);
  }, []);

  return (
    <Button
      id='setting-min-menu'
      name='setting-min-menu'
      onClick={onClickTheme}
      type='button'
      rounded={rounded}
      icon='301'
      padding='px-1'
      borderless
      iconSize='xsm'
      transparent
      unpadded={unpadded}
    />
  );
};
