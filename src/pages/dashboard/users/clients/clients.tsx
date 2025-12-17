// import { Button } from '@/components/common/button/button';
// import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { columns } from './components/clients.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';

import { UserService } from '@/services';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';
import { IClientResponse } from '@/types/user/user.response';

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const ClientsSettingPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const clients: Signal<IClientResponse[]> = useSignal([]);
  const loading = useSignal<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('p_client');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    if (selectedCompany) {
      getClients();
    }
  }, [selectedCompany, location]);

  const getClients = async () => {
    loading.value = true;
    const request: any = await UserService.getClients();
    if (request.getStatus()) {
      clients.value = request.getMany();
    }
    loading.value = false;
  };

  const update = (id: string) => {
    go({
      to: `/users/clients/update/${id}`,
      label: 'edit',
      id: 'user:client:upsert',
      base: 'setting',
    });
  };

  const deleteClient = async (id: number) => {
    const request = await UserService.deleteClient(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getClients();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteClient(action.id);
        break;
    }
  };

  return (
    <>
      <Table<IClientResponse>
        data={clients.value}
        columns={columns}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
        absolute
      />
    </>
  );
};
