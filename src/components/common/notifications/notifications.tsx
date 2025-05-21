import { useRef, useState, useEffect } from 'preact/hooks';
import { FloatBadge } from "../badge/float";
import { Button } from "../button/button";
import { INotification, INotificationsProps } from "./interface";
import { useLocation } from 'wouter';

const Notifications = ({
    notifications,
    icon,
    iconSize = 'xsm'
}: INotificationsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [, navigate] = useLocation();

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
            navigate(info.redirect);
            notifications.splice(notifications.indexOf(info), 1);
            setIsOpen(false);
        }
    }

    return (
        <div className="relative">
            <FloatBadge label={notifications.length || '0'} color='bg-primary'>
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
                    className='absolute top-full right-0 mt-2 bg-white dark:bg-b-dark-dark shadow-lg rounded-lg p-2 animate-fade-in border border-gray-200 dark:border-gray-700'
                >
                    {notifications.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No hay notificaciones
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.value}
                                className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                                onClick={() => handleRedirect(notification)}
                            >
                                {notification.icon && (
                                    <span className={`vx-icon vx-icon-${notification.icon}`} />
                                )}
                                <span className="text-sm text-gray-700 dark:text-gray-200">
                                    {notification.label}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;