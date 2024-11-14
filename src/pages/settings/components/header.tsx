import { Button } from '@/components/common';
import { memo } from 'preact/compat';

export const MenuButtons = memo(({ goBack, goForward, toggleTheme }: any) => (
  <div className='mr-3 flex items-center justify-center max-w-44 min-w-40'>
    <Button
      id='setting-go-back'
      name='setting-go-back'
      onClick={goBack}
      type='button'
      rounded
      icon='210'
    />
    <Button
      id='setting-go-forward'
      name='setting-go-forward'
      onClick={goForward}
      type='button'
      rounded
      icon='212'
    />
    <Button
      id='setting-min-menu'
      name='setting-min-menu'
      onClick={toggleTheme}
      type='button'
      rounded
      icon='301'
    />
  </div>
));
