import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { Table } from '@/components/common/table/table';
import { ExpandableAccess } from '@/components/compose/table/expandable/access';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from '@/components/common/table/interface';
import { getColumns } from './components/stages.columns';
import { showAlert } from '@/components/common/show-alert/show-alert';

import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';

import { StageService } from '@/services/pqrs/stage';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { IStages } from './utils/interface';

export const StagePage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const stages = useSignal<IStages[]>([]);

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
  );
};
