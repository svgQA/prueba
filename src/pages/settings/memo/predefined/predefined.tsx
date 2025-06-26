import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/predefined';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';
import { IPredefined, IRowActionPlace } from './utils/predefined.d';
import { PredefinedService } from '@/services/shift/predefined';

export const PredefinedSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const predefined: Signal<IPredefined[]> = useSignal([]);
  const loading = useSignal<boolean>(false);
  useEffect(() => {
    document.title = 'TR - Predefined Service';
    getPredefined();
  }, []);

  const getPredefined = async () => {
    loading.value = true;
    const request: any = await PredefinedService.getPredefined();
    if (request.getStatus()) {
      predefined.value = request.getMany();
    }
    loading.value = false;
  };

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de predefinido' });
    navigate('/memo/predefined/create');
  };

  const update = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar predefinido' });
    navigate(`/memo/predefined/update/${id}`);
  };

  const deletePredefined = async (id: string) => {
    const request = await PredefinedService.deletePredefined(id);
    if (!request.getStatus()) return;
    ToastManager.success('Predefinido eliminado');
    getPredefined();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deletePredefined(action.id);
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
          />
        </div>
      </div>
      <Table<IPredefined>
        data={predefined.value}
        columns={columns}
        pageSize={20}
        visibility={{
          name: true,
          description: true,
          priority: true,
          action: true,
        }}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
      />
    </Section>
  );
};
