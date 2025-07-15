import { FunctionComponent } from 'preact';
import { columns } from './components/service.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { ServiceService } from '@/services';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@/utils/hooks/navigation';
import { useUserStore } from '@/store/slices';

export interface IServicio {
  id: number;
  name: string;
  description: string;
  priority: string;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const ServiceSettingPage: FunctionComponent = () => {
  const { go } = useNavigation();

  const novelties: Signal<IServicio[]> = useSignal([]);
  const loading = useSignal<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_service');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getServices();
    }
  }, [selectedCompany, location]);

  const getServices = async () => {
    loading.value = true;
    const request: any = await ServiceService.getServices();
    if (request.getStatus()) {
      novelties.value = request.getMany();
    }
    loading.value = false;
  };

  const update = (id: string) => {
    go({
      to: `/shifts/service/update/${id}`,
      label: 'edit',
      id: 'shifts:service:state:update',
      base: 'setting',
    });
  };

  const deleteNovelty = async (id: string) => {
    const request = await ServiceService.deleteService(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getServices();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteNovelty(action.id);
        break;
    }
  };

  return (
    <>
      <Table<IServicio>
        data={novelties.value}
        columns={columns}
        visibility={{
          id: false,
        }}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
        absolute
      />
    </>
  );
};
