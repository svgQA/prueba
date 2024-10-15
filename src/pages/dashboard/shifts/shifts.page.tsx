import { type FunctionComponent } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
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
} from './shift.columns.tsx';

export const ShiftsPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Shifts Service';
  }, []);

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
        id: 'expand',
        header: 'Más información',
        cell: ({ row }) => (
          <InfoIcon
            onClick={() => row.toggleExpanded()}
            isExpanded={row.getIsExpanded()}
          />
        ),
      },
    ],
    []
  );

  const renderExpandedRow = (rowData: Shift) => (
    <div className='p-4 bg-gray-100'>
      <h3 className='text-lg font-bold mb-2'>Información adicional</h3>
      <p>
        <strong>Empleado:</strong> {rowData.employeeName}
      </p>
      <p>
        <strong>ID:</strong> {rowData.id}
      </p>
      <p>
        <strong>ID Empleado:</strong> {rowData.employeeId}
      </p>
      <p>
        <strong>Inicio:</strong> {new Date(rowData.startTime).toLocaleString()}
      </p>
      <p>
        <strong>Finalización:</strong>{' '}
        {new Date(rowData.endTime).toLocaleString()}
      </p>
      <p>
        <strong>Duración:</strong> {rowData.duration}
      </p>
      <p>
        <strong>Notificaciones:</strong> {rowData.notifications}
      </p>
      <p>
        <strong>Progreso de actividades:</strong> {rowData.activitiesProgress}%
      </p>
      <p>
        <strong>Más información:</strong> {rowData.moreInfo}
      </p>
    </div>
  );

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Turnos</h1>
      <Table
        data={shiftsData}
        columns={columns}
        searchPlaceholder='Buscar turnos...'
        renderExpandedRow={renderExpandedRow}
      />
    </section>
  );
};
