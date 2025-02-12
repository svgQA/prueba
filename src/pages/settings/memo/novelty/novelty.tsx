import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/novelty.columns';
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

export interface INovelty {
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

export const NoveltySettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const novelties: Signal<INovelty[]> = useSignal([]);

  useEffect(() => {
    document.title = 'VX - Novelty Service';
    getNovelties();
  }, []);

  const getNovelties = async () => {
    const request: any = await ShiftService.getNovelty();
    novelties.value = request.data;
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de novedad' });
    navigate('/memo/novelty/create');
  };

  const update = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar novedad' });
    navigate(`/memo/novelty/update/${id}`);
  };

  const deleteNovelty = async (id: string) => {
    const request = await ShiftService.deleteNovelty(id);
    if (!request.getStatus()) return;
    toast.success('Novedad eliminado', { position: 'top-right' });
    getNovelties();
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
    <Section className='pt-2'>
      <div className='p-4 dark:bg-black bg-white rounded-lg shadow-xl  border-t-4 border-cyan-500  '>
        <Button
          onClick={redirect}
          type='button'
          icon='039'
          name='back'
          rounded={true}
          className='w-auto'
        />
        <Table<INovelty>
          data={novelties.value}
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
