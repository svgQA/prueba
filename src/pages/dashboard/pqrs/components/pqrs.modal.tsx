import { Signal, useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

import { PqrsService } from '@/services/pqrs/pqrs';

import { Modal } from '@/components/common/modal/modal';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { FormattedDate } from '@/components/compose/forms';

import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';

import { ICPqrsRequest } from '../utils/interface';
import PqrsInferenceModal from './modal/pqrs-inference.modal';
import PqrsGeneralModal from './modal/pqrs-general.modal';

interface IProps {
  showModal: Signal<boolean>;
  closeModal: () => void;
  id?: number;
  tags?: any[];
  areas?: any;
}

export const PqrsModal = ({
  showModal,
  closeModal,
  id,
  tags,
  areas,
}: IProps) => {
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
    { id: 'general', label: 'General', icon: '310' },
    { id: 'analysis', label: 'Análisis IA', icon: '311' },
  ];

  const getBadgeStatus = ():
    | 'error'
    | 'success'
    | 'warning'
    | 'info'
    | 'ternary' => {
    const requestType = pqrs.value?.extraData?.requestType?.toLowerCase();
    if (requestType === 'queja') return 'error';
    if (requestType === 'sugerencia') return 'success';
    if (requestType === 'reclamo') return 'warning';
    return 'info';
  };

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
        <div class='bg-b-light border border-gray-border rounded-lg p-4 mb-4'>
          <div class='flex items-start justify-between gap-3 mb-3'>
            <div class='flex-1 min-w-0'>
              <div class='flex items-center gap-2 mb-1'>
                <h4 class='font-semibold text-t-light text-base'>
                  {pqrs.value?.extraData?.clientOrCompanyName || 'Sin nombre'}
                </h4>
              </div>
              <div class='flex items-center gap-2 text-xs text-gray-text-light'>
                {pqrs.value?.extraData?.ticketNumber && (
                  <>
                    <span class='font-mono'>
                      #{pqrs.value.extraData.ticketNumber}
                    </span>
                    {pqrs.value?.extraData?.accountNumber && (
                      <>
                        <span>•</span>
                        <span>{pqrs.value.extraData.accountNumber}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {pqrs.value?.extraData?.requestType && (
              <Badge
                label={pqrs.value.extraData.requestType}
                status={getBadgeStatus()}
                outline
                size='sm'
                width='w-fit'
              />
            )}
          </div>

          {pqrs.value?.extraData?.registerObservation && (
            <div class='mb-3 pb-3 border-b border-gray-border'>
              <TextEllipsis
                text={pqrs.value.extraData.registerObservation}
                maxWidth='100%'
                lines={2}
                className='text-xs text-gray-text-light leading-relaxed'
              />
            </div>
          )}

          <div class='space-y-2'>
            <div class='grid grid-cols-3 gap-3 text-xs'>
              {pqrs.value?.extraData?.filingDate && (
                <div class='flex items-center gap-1.5 text-gray-text-light'>
                  <span>📅</span>
                  <FormattedDate
                    date={String(pqrs.value.extraData.filingDate)}
                    format='date'
                  />
                </div>
              )}

              {areas && (
                <div class='flex items-center gap-1.5 text-gray-text-light'>
                  <span>🏢</span>
                  <span class='truncate capitalize'>
                    {areas.replace(/_/g, ' ')}
                  </span>
                </div>
              )}

              {pqrs.value?.extraData?.contactEmail && (
                <div class='flex items-center gap-1.5 text-gray-text-light'>
                  <span>📧</span>
                  <TextEllipsis
                    text={pqrs.value.extraData.contactEmail}
                    maxWidth='100%'
                    lines={1}
                  />
                </div>
              )}
            </div>

            {((tags && tags.length > 0) ||
              pqrs.value?.extraData?.hasFiles ||
              typeof pqrs.value?.extraData?.daysToExpire === 'number') && (
              <div class='flex flex-wrap gap-1.5 pt-2 border-t border-gray-border'>
                {tags &&
                  tags.map((tag, idx) => (
                    <span
                      key={idx}
                      class='px-2 py-0.5 bg-b-light text-gray-text-light text-xs rounded'
                    >
                      #{String(tag)}
                    </span>
                  ))}

                {pqrs.value?.extraData?.hasFiles && (
                  <span class='px-2 py-0.5 bg-primary-opacity text-primary text-xs rounded flex items-center gap-1'>
                    📎 Archivos
                  </span>
                )}

                {typeof pqrs.value?.extraData?.daysToExpire === 'number' &&
                  pqrs.value.extraData.daysToExpire <= 3 && (
                    <span class='px-2 py-0.5 bg-error-opacity text-error text-xs rounded flex items-center gap-1 font-medium'>
                      ⏰ {pqrs.value.extraData.daysToExpire}d
                    </span>
                  )}
              </div>
            )}
          </div>
        </div>

        {/*This is the tabs*/}
        <div class='border-b border-gray-border mb-4'>
          <nav class='flex space-x-1'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                class={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab.value === tab.id
                    ? 'bg-primary-opacity text-primary border-b-2 border-primary'
                    : 'text-gray-text-light hover:text-t-light hover:bg-b-light'
                }`}
                onClick={() => (activeTab.value = tab.id)}
              >
                <span class={`mr-1 vox-icon vx-icon-${tab.icon}`}></span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div class='flex-1 overflow-y-auto p-3'>
          {activeTab.value === 'general' && <PqrsGeneralModal pqrs={pqrs} />}
          {activeTab.value === 'analysis' && <PqrsInferenceModal pqrs={pqrs} />}
        </div>
      </div>
    </Modal>
  );
};
