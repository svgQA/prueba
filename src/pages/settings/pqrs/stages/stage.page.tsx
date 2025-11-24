import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { Table } from '@/components/common/table/table';
import { ExpandableAccess } from '@/components/compose/table/expandable/access';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from '@/components/common/table/interface';
import { getColumns } from './components/stages.columns';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { Section } from '@/components/common/section/section';

import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';

import { StageService } from '@/services/pqrs/stage';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { IStages } from './utils/interface';
import { StageFlow } from './components/stage.flow';

export const StagePage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const stages = useSignal<IStages[]>([]);
  const view = useSignal<'table' | 'flow'>('table');

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    document.title = t('p_access');
    if (selectedCompany) {
      fetchInitialData();
    }
  }, [selectedCompany, location]);

  const fetchInitialData = async () => {
    const [stageResponse] = await Promise.all([StageService.get_all()]);

    if (stageResponse.getStatus()) {
      stages.value = stageResponse.getMany();
    }
  };

  const deleteRow = async (id: string) => {
    const req = await StageService.delete(id);
    if (!req.getStatus()) return;
    ToastManager.success('s_deleted_success');
    await fetchInitialData();
  };

  const editRow = (id: number) => {
    go({
      to: `/pqrs/stages/update/${id}`,
      label: 'edit',
      id: 'pqrs:stages:state:update',
      base: 'setting',
    });
  };

  const onClickAction = async (action: IRowAction) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editRow(Number(action.id));
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('i_showAlert_title_zone'),
          message: t('i_showAlert_msg_zone'),
          onConfirm: () => {
            void deleteRow(String(action.id));
          },
          onCancel: () => {},
        });
        break;
    }
  };

  return (
    <Section className='space-y-4 p-4'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div className='space-y-1'>
          <p className='text-xs font-semibold uppercase tracking-[0.08em] text-primary'>PQRS</p>
          <h1 className='text-2xl font-semibold text-slate-900'>{t('h_stages')}</h1>
          <p className='text-sm text-slate-500'>
            {t(
              'i_stages_overview',
              'Administra tus etapas en una tabla o explóralas como un flujo visual.',
            )}
          </p>
        </div>
        <div className='inline-flex items-center rounded-full bg-slate-100 p-1 text-sm font-medium text-slate-600 shadow-inner'>
          {[
            { id: 'table', label: t('table', 'Tabla') },
            { id: 'flow', label: t('flow', 'Flujo') },
          ].map((option) => {
            const isActive = view.value === option.id;
            return (
              <button
                key={option.id}
                onClick={() => (view.value = option.id as 'table' | 'flow')}
                className={`relative rounded-full px-4 py-2 transition-colors duration-200 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                type='button'
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {view.value === 'table' ? (
        <Table<IStages>
          data={stages.value}
          columns={getColumns(onClickAction)}
          pageSize={10}
          expandable={(row: IStages) => <ExpandableAccess row={row} />}
          visibility={{
            id: false,
          }}
          absolute
        />
      ) : (
        <StageFlow stages={stages.value} />
      )}
    </Section>
  );
};
