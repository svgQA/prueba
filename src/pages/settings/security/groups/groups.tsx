import { FunctionComponent } from 'preact';
import { columns } from './components/group.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { GeneralService } from '@/services';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';

export const GroupSettingPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const groups = useSignal<any[]>([]);

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_activity');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getGroups();
    }
  }, [selectedCompany]);

  const getGroups = async () => {
    const response = await GeneralService.getGroup();
    if (!response.getStatus()) return;
    groups.value = response.getMany();
  };

  const updateActivity = (id: string) => {
    go({
      to: `/security/groups/update/${id}`,
      label: 'edit',
      id: 'security:groups:state:update',
    });
  };

  const handleOnClick = async (action: any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        updateActivity(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        // await deleteActivity(action.id);
        break;
    }
  };

  return (
    <>
      <Table<any>
        data={groups.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
        isSettingTable
        absolute
      />
    </>
  );
};
