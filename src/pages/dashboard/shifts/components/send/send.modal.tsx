import { Modal } from '@/components/common/modal/modal';
import { useState } from 'preact/hooks';
import { ManualNotificationForm } from './tabs/manual-notification-form';
import { TemplateManager } from './tabs/template-manager';
import { ScheduledNotifications } from './tabs/scheduled-notifications';

interface Props {
  closed?: boolean;
  onClose?: () => void;
  onSend?: (data: any) => void;
}

const TABS = [
  { key: 'manual', label: 'Enviar manual' },
  { key: 'template', label: 'Gestionar plantillas' },
  { key: 'scheduled', label: 'Notificaciones programadas' },
];

export const SendForm = ({ closed, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<
    'manual' | 'template' | 'scheduled'
  >('manual');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'manual':
        return <ManualNotificationForm />;
      case 'template':
        return <TemplateManager />;
      case 'scheduled':
        return <ScheduledNotifications />;
      default:
        return null;
    }
  };

  return (
    <Modal
      open={!!closed}
      onClose={onClose}
      name='modal-shift-updsert'
      width='w-3/4'
      position='fixed'
      header={
        <h3 className='text-lg font-semibold'>Centro de notificaciones</h3>
      }
    >
      <div className='px-4 py-4 space-y-4 w-full'>
        <div className='flex gap-2 border-b pb-2'>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-t font-medium ${
                activeTab === tab.key
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div>{renderTabContent()}</div>
      </div>
    </Modal>
  );
};
