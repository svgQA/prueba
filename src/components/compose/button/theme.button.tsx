import { Button } from '@/components/common';
import { useCallback } from 'preact/hooks';

export const ThemeButton = () => {
  const toggleTheme = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    document.body.classList.toggle('dark');
  }, []);

  return (
    <Button
      id='setting-min-menu'
      name='setting-min-menu'
      onClick={toggleTheme}
      type='button'
      rounded
      icon='301'
    />
  );
};
