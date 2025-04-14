import { useRef, useEffect, useState } from 'preact/hooks';
import { ManualNotificationForm } from './tabs/manual-notification-form';
import { TemplateManager } from './tabs/template-manager';
import { ScheduledNotifications } from './tabs/scheduled-notifications';
import { IShiftResponse } from '@/types/shift/activity';

interface Props {
  closed?: boolean;
  onClose?: () => void;
  onSend?: (data: any) => void;
  viewMode?: 'setting' | 'dash';
  users?: IShiftResponse[];
}

export const SendForm = ({ closed, onClose, onSend, viewMode, users }: Props) => {
  const [activeTab, setActiveTab] = useState<'template' | 'scheduled'>('template');
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar si se hace click por fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  const renderTabContent = () => {
    if (viewMode === 'dash') return <ManualNotificationForm users={users} />;

    switch (activeTab) {
      case 'template':
        return <TemplateManager />;
      case 'scheduled':
        return <ScheduledNotifications />;
      default:
        return null;
    }
  };

  if (closed) return null;

  return (
    <div
      ref={ref}
      className="absolute mt-2 w-[400px] max-w-[90vw] bg-white rounded shadow-lg z-50 border"
    >
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h3 className="text-base font-semibold">Centro de notificaciones</h3>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div className="px-4 pt-3">
        {viewMode !== 'dash' && (
          <div className="flex gap-2 border-b pb-2 mb-2">
            <button
              className={`px-3 py-1 text-sm rounded font-medium ${activeTab === 'template'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              onClick={() => setActiveTab('template')}
            >
              Gestionar plantillas
            </button>
            <button
              className={`px-3 py-1 text-sm rounded font-medium ${activeTab === 'scheduled'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              onClick={() => setActiveTab('scheduled')}
            >
              Notificaciones programadas
            </button>
          </div>
        )}
        <div className="pb-4">{renderTabContent()}</div>
      </div>
    </div>
  );
};
