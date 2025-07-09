import { ToastManager } from "@/utils/toast/toast-manager";

export const handleNotificationEvent = (
  eventName: string,
  onEmit?: (id: any) => any
) => {
  const handleNotificationClick = (event: CustomEvent) => {
    const { id } = event.detail;
    if (id) onEmit?.(id);
  };

  window.addEventListener(eventName, handleNotificationClick as EventListener);
  const urlParams = new URLSearchParams(window.location.search);
  const urlId = urlParams.get('notificationId');
  if (urlId) onEmit?.(urlId);
};

export const handleSendNotificationEvent = (
  eventId: any, 
  eventName: string,
  t: (key: string) => string,
) => {
    if(!eventId) ToastManager.error(t('notification.error_redirect'));
    const eventEmit = new CustomEvent(eventName, { detail: { id: eventId }, });
    window.dispatchEvent(eventEmit);
};