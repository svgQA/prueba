import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/service.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { appendHistory } from '../../store/settings';
import { ToastManager } from '@/utils/toast/toast-manager';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';
import { ServiceService } from '@/services';
import { useTranslation } from 'react-i18next';

export interface IServicio {
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

export const ServiceSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const novelties: Signal<IServicio[]> = useSignal([]);
  const loading = useSignal<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_service');
    getServices();
  }, []);

  const getServices = async () => {
    loading.value = true;
    const request: any = await ServiceService.getServices();
    if (request.getStatus()) {
      novelties.value = request.getMany();
    }
    loading.value = false;
  };

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.service.create.to,
      label: 'create',
      id: 'service-create',
    };
    appendHistory(menu);
    // OJO: No traducir, dejar asi los setMenu
    setMenu({ ...infoMenu.value, label: 'create' });
    navigate('/rounds/service/create');
  };

  const update = (id: string) => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.service.update.to,
      label: 'update',
      id: 'service-update',
    };
    appendHistory(menu);
    // OJO: No traducir, dejar asi los setMenu
    setMenu({ ...infoMenu.value, label: 'edit' });
    navigate(`/rounds/service/update/${id}`);
  };

  const deleteNovelty = async (id: string) => {
    const request = await ServiceService.deleteService(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getServices();
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
      <Table<IServicio>
        data={novelties.value}
        columns={columns}
        visibility={{
          id: false,
        }}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
      />
    </Section>
  );
};
