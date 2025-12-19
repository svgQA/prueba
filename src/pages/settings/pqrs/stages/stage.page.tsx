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

enum StageView {
  TABLE,
  FLOW,
}

export const StagePage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const stages = useSignal<IStages[]>([]);
  const view = useSignal<StageView>(StageView.TABLE);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    document.title = t('p_stage');
    if (selectedCompany) {
      fetchInitialData();
    }
  }, [selectedCompany, location]);

  const fetchInitialData = async () => {
    const stageResponse = await StageService.get_all();

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
    <Section
      className='relative'
      header={
        <div className='inline-flex items-center rounded-full p-1 text-sm font-medium'>
          {[
            { id: StageView.TABLE, label: t('table', 'Tabla') },
            { id: StageView.FLOW, label: t('flow', 'Flujo') },
          ].map((option) => {
            const isActive = view.value === option.id;
            return (
              <button
                key={option.id}
                onClick={() => (view.value = option.id)}
                className={`relative rounded-full px-4 py-2 transition-colors duration-200 mx-1 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:text-slate-700'
                }`}
                type='button'
              >
                {option.label}
              </button>
            );
          })}
        </div>
      }
    >
      {view.value === StageView.TABLE ? (
        <Table<IStages>
          data={stages.value}
          columns={getColumns(onClickAction)}
          expandable={(row: IStages) => <ExpandableAccess row={row} />}
          visibility={{
            id: false,
          }}
          absolute
          unsearch
          className='!max-h-[65vh]'
        />
      ) : (
        <StageFlow stages={stages.value} />
      )}
    </Section>
  );
};
