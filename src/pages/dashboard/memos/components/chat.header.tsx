import { Button } from '@/components/common/button/button';

interface ChatHeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
  onMoreClick?: () => void;
}

export const ChatHeader = ({
  onMenuClick,
  onSettingsClick,
  onMoreClick,
}: ChatHeaderProps) => (
  <div className='flex justify-between items-center p-4 bg-b-light-dark dark:bg-b-dark-light'>
    <div className='flex gap-2'>
      <Button
        icon='123'
        rounded
        id='menu-btn'
        name='menu'
        type='button'
        onClick={onMenuClick}
      />
      <Button
        icon='231'
        rounded
        id='settings-btn'
        name='settings'
        type='button'
        onClick={onSettingsClick}
      />
    </div>
    <Button
      icon='233'
      rounded
      id='more-btn'
      name='more'
      type='button'
      onClick={onMoreClick}
    />
  </div>
);
