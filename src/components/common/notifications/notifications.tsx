import { useRef, useState, useEffect } from 'preact/hooks';
import { FloatBadge } from "../badge/float";
import { Button } from "../button/button";
import { INotification, INotificationsProps } from "./interface";
import { useLocation } from 'wouter';
import { localStorage } from '@/utils/storage';
import { EventBus } from '@/utils/network/event.bus';
import { IBaseSSE, SSE_TYPE } from '@/utils/network/sse/base';
import { SIDEBAR_MENUS } from '@/utils/menus/sidebar';

const STORAGE_KEY = 'notifications';

const Notifications = ({
    icon,
    iconSize = 'xsm'
}: INotificationsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localNotifications, setLocalNotifications] = useState<INotification[]>([]);
    const [badgeColor, setBadgeColor] = useState('bg-primary');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [, navigate] = useLocation();
    const [notifications, setNotifications] = useState<INotification[]>([]);

    useEffect(() => {
        const storedNotifications = localStorage.get<INotification[]>(STORAGE_KEY);
        const initialNotifications = Array.isArray(storedNotifications) ? storedNotifications : [];
        setLocalNotifications(initialNotifications);
        setNotifications(initialNotifications);
        EventBus.on(SSE_TYPE.ALL, handleNotificationSSE);
    }, []);

    const handleNotificationSSE = (event: IBaseSSE) => {
        const { type, message, notification } = event;
        if (!notification) return;

        let newNotification = {
            id: String(notifications.length + 1),
            label: type + ' ' + notification,
            value: message,
            icon: SIDEBAR_MENUS.find(menu => menu.label === type)?.icon,
            redirect: SIDEBAR_MENUS.find(menu => menu.label === type)?.to,
        }

        setNotifications(prevNotifications => {
            const updatedNotifications = [...prevNotifications, newNotification];
            setLocalNotifications(updatedNotifications);
            localStorage.set(STORAGE_KEY, updatedNotifications);
            return updatedNotifications;
        });
    }

    useEffect(() => {
        if (notifications.length > 0) {
            const uniqueNotifications = notifications.filter(newNotif => !localNotifications.some(existingNotif => existingNotif.value === newNotif.value));

            if (uniqueNotifications.length > 0) {
                const allNotifications = [...localNotifications, ...uniqueNotifications];
                setLocalNotifications(allNotifications);
                localStorage.set(STORAGE_KEY, allNotifications);

                // Efecto especial para múltiples notificaciones
                if (uniqueNotifications.length > 1) {
                    let pulseCount = 0;
                    const maxPulses = 6; // 3 segundos con cambios cada 500ms

                    const pulseInterval = setInterval(() => {
                        setBadgeColor(prev => prev === 'bg-secondary' ? 'bg-primary' : 'bg-secondary');
                        pulseCount++;

                        if (pulseCount >= maxPulses) {
                            clearInterval(pulseInterval);
                            setBadgeColor('bg-primary');
                        }
                    }, 500);

                    return () => clearInterval(pulseInterval);
                } else {
                    // Efecto normal para una sola notificación
                    setBadgeColor('bg-caution');
                    const timer = setTimeout(() => {
                        setBadgeColor('bg-primary');
                    }, 3000);

                    return () => clearTimeout(timer);
                }
            }
        }
    }, [notifications]);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleRedirect = (info: INotification) => {
        if (info.redirect) {
            const updatedNotifications = localNotifications.filter(n => n.value !== info.value);
            setLocalNotifications(updatedNotifications);
            localStorage.set(STORAGE_KEY, updatedNotifications);

            const index = notifications.indexOf(info);
            if (index > -1) {
                notifications.splice(index, 1);
            }

            // Emit custom event for notification click
            if (info.id) {
                const event = new CustomEvent('notification-click', { detail: { id: info.id } });
                window.dispatchEvent(event);
            }

            // Añadir el ID como parámetro de consulta si existe
            const redirectUrl = info.id ? `${info.redirect}?notificationId=${info.id}` : info.redirect;
            navigate(redirectUrl);
            setIsOpen(false);
        }
    }

    const handleDelete = (info: INotification, event: MouseEvent) => {
        event.stopPropagation();
        const updatedNotifications = localNotifications.filter(n => n.value !== info.value);
        setLocalNotifications(updatedNotifications);
        localStorage.set(STORAGE_KEY, updatedNotifications);

        const index = notifications.indexOf(info);
        if (index > -1) {
            notifications.splice(index, 1);
        }
    }

    const allNotifications = notifications.length > 0 ? notifications : localNotifications;

    return (
        <div className="relative">
            <FloatBadge label={allNotifications.length || '0'} color={badgeColor}>
                <Button
                    name='user-action'
                    icon={icon}
                    iconSize={iconSize}
                    borderless
                    unpadded
                    onClick={() => setIsOpen(!isOpen)}
                />
            </FloatBadge>
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className='absolute top-full right-0 mt-2 bg-white dark:bg-b-dark-dark shadow-lg rounded-lg p-2 animate-fade-in border border-gray-200 dark:border-gray-700 w-80 max-h-[300px] overflow-y-auto vox-scroll-design'
                >
                    {allNotifications.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No hay notificaciones
                        </div>
                    ) : (
                        allNotifications.map((notification) => (
                            <div
                                key={notification.value}
                                className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between gap-2"
                                onClick={() => handleRedirect(notification)}
                            >
                                <div className="flex items-center gap-2">
                                    {notification.icon && (
                                        <span className={`vx-icon vx-icon-${notification.icon}`} />
                                    )}
                                    <span className="text-sm text-gray-700 dark:text-gray-200">
                                        {notification.label}
                                    </span>
                                </div>
                                <span
                                    className="vx-icon vx-icon-053 text-gray-400 hover:text-red-500 transition-colors"
                                    onClick={(e) => handleDelete(notification, e)}
                                />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;