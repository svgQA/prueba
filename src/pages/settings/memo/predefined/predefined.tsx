import { FunctionComponent } from 'preact';
import { columns } from './components/predefined';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { IPredefined, IRowActionPlace } from './utils/predefined.d';
import { PredefinedService } from '@/services/shift/predefined';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';

export const PredefinedSettingPage: FunctionComponent = () => {
  const predefined: Signal<IPredefined[]> = useSignal([]);
  const { go } = useNavigation();
  const loading = useSignal<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_predefined');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getPredefined();
    }
  }, [selectedCompany, location]);

  const getPredefined = async () => {
    loading.value = true;
    const request: any = await PredefinedService.getPredefined();
    if (request.getStatus()) {
      predefined.value = request.getMany();
    }
    loading.value = false;
  };

  const update = (id: string) => {
    go({
      to: `/memo/predefined/update/${id}`,
      label: 'edit',
      id: 'memo:predefined:state:update',
      base: 'setting',
    });
  };

  const deletePredefined = async (id: string) => {
    const request = await PredefinedService.deletePredefined(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getPredefined();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deletePredefined(action.id);
        break;
    }
  };

  return (
    <>
      <Table<IPredefined>
        data={predefined.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
        absolute
      />
    </>
  );
};
