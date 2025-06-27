import { useState, useImperativeHandle } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import { FloatBadge } from '../badge/float';
import { useTranslation } from 'react-i18next';

interface INotificationBannerProps {
  message: string;
  reload?: () => void;
  color?: string;
}

const NotificationBanner = forwardRef<
  { startBannerAnimation: () => void },
  INotificationBannerProps
>(({ message, reload, color = 'primary' }, ref) => {
  const [notificationMemo, setNotificationMemo] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({ startBannerAnimation, closeBanner }));

  const startBannerAnimation = () => {
    setNotificationMemo((prevCount: number) => prevCount + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const closeBanner = () => {
    setIsAnimating(false);
    setNotificationMemo(0);
  };

  const handleReload = async () => {
    setNotificationMemo(0);
    reload?.();
    closeBanner();
  };

  return (
    <>
      {notificationMemo > 0 && (
        <div className='ml-3 relative'>
          <FloatBadge label={notificationMemo || '0'} color={`bg-${color}`}>
            <div
              className={`border border-${color} rounded-lg px-4 py-1.5 flex items-center justify-center cursor-pointer transition-all duration-300 ${isAnimating ? 'animate-curtain' : ''}`}
              onClick={handleReload}
            >
              <span className={`text-sm text-${color} pr-2`}>{t(message)}</span>
            </div>
          </FloatBadge>
        </div>
      )}
    </>
  );
});

export default NotificationBanner;
