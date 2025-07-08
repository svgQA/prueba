
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
}