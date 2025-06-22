import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/novelty.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';
import { NoveltyService } from '@/services';

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
  const loading = useSignal<boolean>(false);
  useEffect(() => {
    document.title = 'VX - Novelty Service';
    getNovelties();
  }, []);

  const getNovelties = async () => {
    loading.value = true;
    const request: any = await NoveltyService.getNovelty();
    if (request.getStatus()) {
      novelties.value = request.getMany();
    }
    loading.value = false;
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
    const request = await NoveltyService.deleteNovelty(id);
    if (!request.getStatus()) return;
    ToastManager.success('Novedad eliminado');
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
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label='new'
            icon='039'
            onClick={redirect}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<INovelty>
        data={novelties.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
      />
    </Section>
  );
};
