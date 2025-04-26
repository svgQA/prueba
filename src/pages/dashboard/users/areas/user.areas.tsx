import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { FunctionComponent } from 'preact';
import { columns } from './area.columns';
import { UserService } from '@/services/user';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { IUserAreaResponse } from '@/types/user/user.response';
import { Button } from '@/components/common/button/button';
import { useLocation } from 'wouter';
import { toast } from 'react-toastify';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '@/pages/settings/store/settings';
import { showAlert } from '@/components/common/show-alert/show-alert';
export const UserAreasPage: FunctionComponent = () => {
  const areas = useSignal<IUserAreaResponse[]>([]);
  const [_, navigate] = useLocation();

  useEffect(() => {
    document.title = 'VX - Areas';
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    const response = await UserService.getAreas();
    if (response.getStatus()) {
      areas.value = response.getMany();
    }
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Nueva area' });
    navigate('/users/areas/create');
  };

  const deleteArea = async (id: number) => {
    const request = await UserService.deleteArea(id);
    if (!request.getStatus()) return;
    toast.success('Ronda eliminado', { position: 'top-right' });
    fetchAreas();
  };

  const editArea = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar ronda' });
    navigate(`/users/areas/update/${id}`);
  };

  const handleOnClick = async (action: IRowAction | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editArea(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: 'Eliminar area',
          message: `¿Estás seguro de querer eliminar la area?`,
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
            label='Nueva Area'
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
        visibility={{}}
      />
    </Section>
  );
};
