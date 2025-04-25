import { Button } from '@/components/common/button/button';
import { useCallback } from 'preact/hooks';
import { themeSignal } from './signal.theme';

export const ThemeButton = () => {
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
      rounded
      icon='170'
    />
  );
};
