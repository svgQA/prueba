import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/schedule.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';

import { ShiftService } from '@/services/shift';
import { toast } from 'react-toastify';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';

export interface ISchedule {
  id: number;
  name: string;
  day: string;
  hourStart: string;
  hourEnd: string;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const ScheduleSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const schedules: Signal<ISchedule[]> = useSignal([]);

  useEffect(() => {
    document.title = 'VX - Schedule Service';
    getSchedules();
  }, []);

  const getSchedules = async () => {
    const request: any = await ShiftService.getSchedules();
    schedules.value = request.data;
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de horarios' });
    navigate('/rounds/schedule/create');
  };

  const update = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar horarios' });
    navigate(`/rounds/schedule/update/${id}`);
  };

  const deleteSchedule = async (id: string) => {
    const request = await ShiftService.deleteSchedule(id);
    if (!request.getStatus()) return;
    toast.success('horario eliminado', { position: 'top-right' });
    getSchedules();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteSchedule(action.id);
        break;
    }
  };

  return (
    <Section className='pt-2'>
      <div className='p-4 dark:bg-black bg-white rounde shado border-t-4 border-cyan-500  '>
        <Button
          onClick={redirect}
          type='button'
          icon='039'
          name='back'
          rounded={true}
          className='w-auto'
        />
        <Table<ISchedule>
          data={schedules.value}
          columns={columns}
          pageSize={20}
          visibility={{
            name: true,
            description: true,
            priority: true,
            action: true,
          }}
          onClickAction={handleOnClick}
          unsearch={false}
        />
      </div>
    </Section>
  );
};
