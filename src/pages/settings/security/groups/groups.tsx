// import { Button } from '@/components/common/button/button';
// import {
//   menuInformationSelected as infoMenu,
//   setMenu,
// } from '../../store/settings';
// import { Section } from '@/components/common/section/section';
// import { useLocation } from 'wouter';
import { FunctionComponent } from 'preact';
import { columns } from './components/group.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { GeneralService } from '@/services';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';

export const GroupSettingPage: FunctionComponent = () => {
  // const [_, navigate] = useLocation();
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
  }, [selectedCompany, location]);

  const getGroups = async () => {
    const response = await GeneralService.getGroup();
    if (!response.getStatus()) return;
    groups.value = response.getMany();
  };

  // const redirect = () => {
  //   // OJO: No traducir, dejar asi los setMenu
  //   setMenu({ ...infoMenu.value, label: 'create' });
  //   navigate('/security/groups/create');
  // };

  // const updateActivity = (id: string) => {
  //   console.log('DATA: ', id);
  //   // setMenu({ ...infoMenu.value, label: 'edit' });
  //   // navigate(`/rounds/activity/update/${id}`);
  // };

  // const deleteActivity = async (id: string) => {
  //   const request = await ShiftService.deleteActivity(id);
  //   if (!request.getStatus()) return;
  //   ToastManager.success('s_deleted_success');
  //   getGroups();
  // };

  const handleOnClick = async (action: any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        // updateActivity(action.id);
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
