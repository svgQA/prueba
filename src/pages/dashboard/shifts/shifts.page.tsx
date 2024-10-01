import { type FunctionComponent } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { Table } from '@/components/common/table/table';
import { shiftsData } from './shifts.data';
import { Shift } from './shifts.d';
import { ColumnDef } from '@tanstack/react-table';
import {
  SendIcon,
  NotificationBadge,
  ProgressBar,
  ActionButtons,
  InfoIcon,
  Modal,
} from './shift.columns.tsx';

export const ShiftsPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Shifts Service';
  }, []);

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const columns = useMemo<ColumnDef<Shift>[]>(
    () => [
      {
        accessorKey: 'employeeName',
        header: 'Empleado',
      },
      {
        id: 'send',
        header: 'Enviar',
        cell: () => <SendIcon onClick={() => console.log('Enviar clicked')} />,
      },
      {
        accessorKey: 'id',
        header: 'Id',
      },
      {
        accessorKey: 'employeeId',
        header: 'Id Empleado',
      },
      {
        accessorKey: 'startTime',
        header: 'Inicio',
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleTimeString(),
      },
      {
        accessorKey: 'endTime',
        header: 'Finalización',
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleTimeString(),
      },
      {
        accessorKey: 'duration',
        header: 'Duración',
      },
      {
        accessorKey: 'notifications',
        header: 'Notificación',
        cell: (info) => <NotificationBadge count={info.getValue() as number} />,
      },
      {
        accessorKey: 'activitiesProgress',
        header: 'Actividades',
        cell: (info) => <ProgressBar progress={info.getValue() as number} />,
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: () => (
          <ActionButtons
            onEdit={() => console.log('Edit clicked')}
            onDelete={() => console.log('Delete clicked')}
          />
        ),
      },
      {
        accessorKey: 'moreInfo',
        header: 'Más información',
        cell: (info) => (
          <InfoIcon onClick={() => setSelectedShift(info.row.original)} />
        ),
      },
    ],
    []
  );

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Turnos</h1>
      <Table
        data={shiftsData}
        columns={columns}
        searchPlaceholder='Buscar turnos...'
      />
      <Modal isOpen={!!selectedShift} onClose={() => setSelectedShift(null)}>
        {selectedShift && (
          <div>
            <h2 className='text-xl font-bold mb-2'>Información adicional</h2>
            <p>
              <strong>Empleado:</strong> {selectedShift.employeeName}
            </p>
            <p>
              <strong>ID:</strong> {selectedShift.id}
            </p>
            <p>
              <strong>ID Empleado:</strong> {selectedShift.employeeId}
            </p>
            <p>
              <strong>Inicio:</strong>{' '}
              {new Date(selectedShift.startTime).toLocaleString()}
            </p>
            <p>
              <strong>Finalización:</strong>{' '}
              {new Date(selectedShift.endTime).toLocaleString()}
            </p>
            <p>
              <strong>Duración:</strong> {selectedShift.duration}
            </p>
            <p>
              <strong>Notificaciones:</strong> {selectedShift.notifications}
            </p>
            <p>
              <strong>Progreso de actividades:</strong>{' '}
              {selectedShift.activitiesProgress}%
            </p>
            <p>
              <strong>Más información:</strong> {selectedShift.moreInfo}
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
};
