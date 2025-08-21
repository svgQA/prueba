import { IRowAction } from '@/components/common/table/interface.d';
import { Table } from '@/components/common/table/table';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Round } from './utils/rounds';
import { columns } from './components/rounds.columns';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ExpandableRounds } from '@/components/compose/table/expandable/rounds';
import { ToastManager } from '@/utils/toast/toast-manager';
import { RoundService } from '@/services';
import { useSignal } from '@preact/signals';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';

export const RoundsSettingPage: FunctionComponent = () => {
  const [rounds, setRounds] = useState([]);
  const loading = useSignal<boolean>(false);
  const { go } = useNavigation();
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_round');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getRounds();
    }
  }, [selectedCompany, location]);

  const getRounds = async () => {
    loading.value = true;
    const request: any = await RoundService.getRounds();

    const rounds = request.data.map((item: any) => {
      const points = [];

      for (let point of item.points) {
        const marker = {
          id: point.id,
          name: point.name,
          position: {
            lat: point.latitude,
            lng: point.longitude,
          },
        };

        points.push(marker);
      }

      return {
        markers: points,
        ...item,
      };
    });

    setRounds(rounds);
    loading.value = false;
  };

  const deleteRound = async (id: string) => {
    const request = await RoundService.deleteRound(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getRounds();
  };

  const editProject = (id: string) => {
    go({
      to: `/shifts/rounds/update/${id}`,
      label: 'edit',
      id: 'shifts:rounds:state:update',
      base: 'setting',
    });
  };

  const handleOnClick = async (action: IRowAction | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editProject(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteRound(action.id);
        break;
    }
  };

  return (
    <>
      <Table<Round>
        showExpandableIcon={true}
        data={rounds}
        columns={columns}
        expandable={(row: any) => <ExpandableRounds row={row} />}
        pageSize={10}
        visibility={{
          id: false,
        }}
        onClickAction={handleOnClick}
        unsearch={false}
        isSettingTable
        absolute
        loading={loading.value}
      />
    </>
  );
};
