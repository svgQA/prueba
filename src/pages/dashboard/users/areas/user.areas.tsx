import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { FunctionComponent } from 'preact';
import { columns } from './area.columns';
import { UserService } from '@/services/general/user';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { IUserAreaResponse } from '@/types/user/user.response';
import { Button } from '@/components/common/button/button';
import { useLocation } from 'wouter';
import { ToastManager } from '@/utils/toast/toast-manager';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useTranslation } from 'react-i18next';
import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '@/pages/settings/store/settings';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { useUserStore } from '@/store/slices';
export const UserAreasPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const areas = useSignal<IUserAreaResponse[]>([]);
  const [_, navigate] = useLocation();
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    document.title = t('p_area');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchAreas();
    }
  }, [selectedCompany, location]);

  const fetchAreas = async () => {
    loading.value = true;
    const response = await UserService.getAreas();
    if (response.getStatus()) {
      areas.value = response.getMany();
    }
    loading.value = false;
  };

  const redirect = () => {
    // OJO: No traducir, dejar asi los setMenu
    setMenu({ ...infoMenu.value, label: 'create' });
    navigate('/users/areas/create');
  };

  const deleteArea = async (id: number) => {
    const request = await UserService.deleteArea(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    fetchAreas();
  };

  const editArea = (id: string) => {
    // OJO: No traducir, dejar asi los setMenu
    setMenu({ ...infoMenu.value, label: 'edit' });
    navigate(`/users/areas/update/${id}`);
  };

  const handleOnClick = async (action: IRowAction | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editArea(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('user.area.showAlert.title'),
          message: t('user.area.showAlert.msg'),
          onConfirm: () => deleteArea(action.id),
          onCancel: () => {},
        });
        break;
    }
  };

  return (
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label='new'
            icon='039'
            onClick={() => redirect()}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<any>
        data={areas.value}
        columns={columns}
        showExpandableIcon={false}
        onClickAction={handleOnClick}
        pageSize={20}
        isSettingTable
        loading={loading.value}
      />
    </Section>
  );
};
