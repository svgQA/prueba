import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { Place } from './utils/places';
import { columns } from './components/places.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect, useState } from 'preact/hooks';
// import { ToastManager } from '@/utils/toast/toast-manager';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { appendHistory } from '../../store/settings';

import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';
import { PlaceService } from '@/services';
import { useSignal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useTranslation } from 'react-i18next';

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const PlacesSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const [places, setPlaces] = useState([]);
  const loading = useSignal<boolean>(false);

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_place');
    getPlaces();
  }, []);

  const getPlaces = async () => {
    loading.value = true;
    const request: any = await PlaceService.getPlaces();
    if (request.getStatus()) {
      setPlaces(request.getMany());
    }
    loading.value = false;
  };

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.placesCreate.to,
      label: 'create',
      id: 'places-create',
    };
    navigate(menu.to);
    appendHistory(menu);
    setMenu({ ...infoMenu.value, label: 'Creacion de lugar' });
  };

  const deletePlace = async (id: string) => {
    const request = await PlaceService.deletePlace(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getPlaces();
  };

  const update = (id: string) => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.placesUpdate.to,
      label: 'update',
      id: 'places-update',
    };
    appendHistory(menu);
    setMenu({ ...infoMenu.value, label: 'Editar lugar' });
    navigate(`/rounds/places/update/${id}`);
  };
  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deletePlace(action.id);
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
      <Table<Place>
        data={places}
        columns={columns}
        visibility={{
          description: false,
          id: false,
        }}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
      />
    </Section>
  );
};
