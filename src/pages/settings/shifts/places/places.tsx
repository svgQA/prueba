import { FunctionComponent } from 'preact';
import { Place } from './utils/places';
import { columns } from './components/places.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect, useState } from 'preact/hooks';
import { PlaceService } from '@/services';
import { useSignal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const PlacesSettingPage: FunctionComponent = () => {
  const [places, setPlaces] = useState([]);
  const loading = useSignal<boolean>(false);
  const { go } = useNavigation();

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_place');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getPlaces();
    }
  }, [selectedCompany, location]);

  const getPlaces = async () => {
    loading.value = true;
    const request: any = await PlaceService.getPlaces();
    if (request.getStatus()) {
      setPlaces(request.getMany());
    }
    loading.value = false;
  };

  const deletePlace = async (id: string) => {
    const request = await PlaceService.deletePlace(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getPlaces();
  };

  const update = (id: string) => {
    go({
      to: `/shifts/places/update/${id}`,
      label: 'edit',
      id: 'shift:places:state:update',
      base: 'setting',
    });
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
    <>
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
        absolute
      />
    </>
  );
};
