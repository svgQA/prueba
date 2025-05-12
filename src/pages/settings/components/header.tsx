import { Button } from '@/components/common/button/button';
import { memo } from 'preact/compat';

export const MenuButtons = memo(({ goBack, goForward }: any) => (
  <div className='mr-3 flex items-center justify-center max-w-44 min-w-40 gap-4'>
    <Button
      id='setting-go-back'
      name='setting-go-back'
      onClick={goBack}
      type='button'
      rounded
      icon='003'
    />
    <Button
      id='setting-go-forward'
      name='setting-go-forward'
      onClick={goForward}
      type='button'
      rounded
      icon='004'
    />
  </div>
));
