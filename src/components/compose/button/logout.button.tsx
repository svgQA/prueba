import { Button } from '@/components/common/button/button';
import { useCallback } from 'preact/hooks';

export const LogoutButton = () => {
  const logout = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <Button
      id='setting-min-menu'
      name='setting-min-menu'
      onClick={logout}
      type='button'
      rounded
      icon='120'
    />
  );
};
