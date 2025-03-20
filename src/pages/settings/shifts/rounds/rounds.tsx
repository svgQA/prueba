import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { IRowAction } from '@/components/common/table/interface.d';
import { Table } from '@/components/common/table/table';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'wouter';
import { Round } from './utils/rounds';
import { columns } from './components/rounds.columns';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ExpandableRounds } from '@/components/compose/table/expandable/rounds';
import { ShiftService } from '@/services/shift';
import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../store/settings';
import { toast } from 'react-toastify';

export const RoundsSettingPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const [rounds, setRounds] = useState([]);

  const redirect = () => {
    setMenu({ ...infoMenu.value, label: 'Creacion de ronda' });
    navigate('/round/create');
  };

  useEffect(() => {
    document.title = 'VX - Round Service';
    getRounds();
  }, []);

  const getRounds = async () => {
    const request: any = await ShiftService.getRounds();

    const rounds = request.data.map((item: any) => {
      const points = [];

      for (let point of item.points) {
        const marker = {
          id: point.id,
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
  };

  const deleteRound = async (id: string) => {
    const request = await ShiftService.deleteRound(id);
    if (!request.getStatus()) return;
    toast.success('Ronda eliminado', { position: 'top-right' });
    getRounds();
  };

  const editProject = (id: string) => {
    setMenu({ ...infoMenu.value, label: 'Editar proyecto' });
    navigate(`/round/update/${id}`);
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
    <Section>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label='Nueva Ronda'
            icon='039'
            onClick={() => redirect()}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<Round>
        data={rounds}
        columns={columns}
        expandable={(row: any) => <ExpandableRounds row={row} />}
        pageSize={20}
        visibility={{
          id: false,
        }}
        onClickAction={handleOnClick}
        unsearch={false}
      />
    </Section>
  );
};
