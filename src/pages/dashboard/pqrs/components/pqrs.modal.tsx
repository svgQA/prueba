import { Signal, useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

import { PqrsService } from '@/services/pqrs/pqrs';

import { Modal } from '@/components/common/modal/modal';

import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';

import { ICPqrsRequest } from '../utils/interface';
import PqrsInferenceModal from './modal/pqrs-inference.modal';
import PqrsFilesModal from './modal/pqrs-files.modal';
import PqrsGeneralModal from './modal/pqrs-general.modal';

interface IProps {
  showModal: Signal<boolean>;
  closeModal: () => void;
  id?: number;
}

export const PqrsModal = ({ showModal, closeModal, id }: IProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useUserStore();

  const loading = useSignal<boolean>(false);
  const pqrs = useSignal<ICPqrsRequest | null>(null);
  const activeTab = useSignal<string>('general');

  useEffect(() => {
    if (selectedCompany) {
      fetchInitialValues();
    }
  }, [selectedCompany, id]);

  const fetchInitialValues = async () => {
    if (!id) return;
    loading.value = true;
    const response = await PqrsService.get_by_id(String(id));
    if (!response.getStatus()) return;
    pqrs.value = response.getOne();
    loading.value = false;
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '📋' },
    { id: 'files', label: 'Archivos', icon: '📎' },
    { id: 'analysis', label: 'Análisis IA', icon: '🤖' },
  ];

  return (
    <Modal
      open={showModal.value}
      onClose={closeModal}
      name='modal-pqrs-details'
      width='w-2/3'
      position='fixed'
      header={<h3 className='text-xl font-medium'>{t('h_pqrs_details')}</h3>}
    >
      <div class='h-[600px] w-full flex flex-col'>
        <div class='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4'>
          <div class='grid grid-cols-4 gap-4 text-sm'>
            <div>
              <span class='text-gray-600'>Cliente:</span>
              <p class='font-semibold text-gray-900 truncate'>
                {pqrs.value?.extraData?.clientOrCompanyName || 'N/A'}
              </p>
            </div>
            <div>
              <span class='text-gray-600'>Estado:</span>
              <p class='font-semibold text-blue-700'>
                {pqrs.value?.status || 'N/A'}
              </p>
            </div>
            <div>
              <span class='text-gray-600'>Tipo:</span>
              <p class='font-semibold text-gray-900 capitalize'>
                {pqrs.value?.extraData?.requestType || 'N/A'}
              </p>
            </div>
            <div>
              <span class='text-gray-600'>Email:</span>
              <p class='font-semibold text-gray-900 truncate' title={pqrs.value?.extraData?.contactEmail || 'N/A'}>
                {pqrs.value?.extraData?.contactEmail || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div class='border-b border-gray-200 mb-4'>
          <nav class='flex space-x-1'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                class={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab.value === tab.id
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => (activeTab.value = tab.id)}
              >
                <span class='mr-1'>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de las pestañas */}
        <div class='flex-1 overflow-y-auto'>
          {activeTab.value === 'general' && <PqrsGeneralModal pqrs={pqrs} />}
          {activeTab.value === 'files' && <PqrsFilesModal pqrs={pqrs} />}
          {activeTab.value === 'analysis' && <PqrsInferenceModal pqrs={pqrs} />}
        </div>
      </div>
    </Modal>
  );
};
