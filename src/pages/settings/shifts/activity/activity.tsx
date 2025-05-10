import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/activity.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';

import { ShiftService } from '@/services/shift/shift';
import { ToastManager } from '@/utils/toast/toast-manager';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';

export interface IActivity {
  id: number;
  start: number;
  end: number;
  roundId: number;
  projectId: number;
  status: string;
  type: string;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const ActivitySettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const activity: Signal<IActivity[]> = useSignal([]);

  useEffect(() => {
    document.title = 'VX - Activity Service';
    getActivities();
  }, []);

  const getActivities = async () => {
    const request: any = await ShiftService.getActivities();
    activity.value = request.data;
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de turno' });
    navigate('/rounds/activity/create');
  };

  const updateActivity = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar turno' });
    navigate(`/rounds/activity/update/${id}`);
  };

  const deleteActivity = async (id: string) => {
    const request = await ShiftService.deleteActivity(id);
    if (!request.getStatus()) return;
    ToastManager.success('Turno eliminado');
    getActivities();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        updateActivity(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteActivity(action.id);
        break;
    }
  };

  return (
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label='Nueva Actividad'
            icon='039'
            onClick={redirect}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<IActivity>
        data={activity.value}
        columns={columns}
        pageSize={20}
        visibility={{
          start: true,
          end: true,
          roundId: true,
          projectId: true,
          status: true,
          type: true,
        }}
        onClickAction={handleOnClick}
      />
    </Section>
  );
};
