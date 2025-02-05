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
            lat: Number(point.latitude),
            lng: Number(point.longitude),
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
      <div className='p-4 dark:bg-black bg-white rounded-lg shadow-xl  border-t-4 border-cyan-500  '>
        <div className='flex flex-col gap-1 w-10/12'>
          <div className='flex flex-row'>
            <Button
              onClick={() => redirect()}
              type='button'
              icon='039'
              name='back'
              rounded={true}
              className='w-auto'
            />
          </div>
        </div>
        <Table<Round>
          data={rounds}
          columns={columns}
          expandable={(row: any) => <ExpandableRounds row={row} />}
          pageSize={20}
          visibility={{
            address: false,
            city: false,
            employeeId: false,
            duration: false,
          }}
          onClickAction={handleOnClick}
          unsearch={false}
        />
      </div>
    </Section>
  );
};
