import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/group.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';
import { GeneralService } from '@/services';

export const GroupSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const groups = useSignal<any[]>([]);

  useEffect(() => {
    document.title = 'TR - Activity Service';
    getGroups();
  }, []);

  const getGroups = async () => {
    const response = await GeneralService.getGroup();
    if (!response.getStatus()) return;
    groups.value = response.getMany();
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de Grupo' });
    navigate('/security/grups/create');
  };

  // const updateActivity = (id: string) => {
  //   console.log('DATA: ', id);
  //   // setMenu({ ...infoMenu.value, label: 'Editar turno' });
  //   // navigate(`/rounds/activity/update/${id}`);
  // };

  // const deleteActivity = async (id: string) => {
  //   const request = await ShiftService.deleteActivity(id);
  //   if (!request.getStatus()) return;
  //   ToastManager.success('Turno eliminado');
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
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-group'
            label='new'
            icon='039'
            onClick={redirect}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<any>
        data={groups.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
        isSettingTable
      />
    </Section>
  );
};
