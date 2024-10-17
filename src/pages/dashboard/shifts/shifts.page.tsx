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
// import { ExpandableContentProps } from '@/components/common/expansible/expansible';

export const ShiftsPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Shifts Service';
  }, []);

  // const [expandableData, setExpandableData] = useState<
  //   ExpandableContentProps['data'][]
  // >([]);

  useEffect(() => {
    // Simular la obtención de datos del endpoint
    // const fetchExpandableData = async () => {
    // Aquí iría la llamada real al endpoint
    // const data: ExpandableContentProps['data'][] = shiftsData.map(
    //   (shift) => ({
    //     description: `Descripción del turno ${shift.id}`,
    //     supervisor: 'Supervisor del turno',
    //     relatedShift: shift.id,
    //     updatedBy: 'Último actualizador',
    //     location: 'Ubicación del turno',
    //     client: 'Cliente del turno',
    //     city: 'Ciudad del turno',
    //     company: 'Compañía del turno',
    //     address: 'Dirección del turno',
    //     mapUrl: 'https://via.placeholder.com/300x200',
    //     attachments: [
    //       {
    //         type: 'image',
    //         url: 'https://via.placeholder.com/100',
    //         name: 'Imagen del turno',
    //       },
    //       { type: 'pdf', url: '#', name: 'Reporte del turno.pdf' },
    //     ],
    //   })
    // );
    // setExpandableData(data);
    // };
    // fetchExpandableData();
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

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Turnos</h1>
      <Table<Shift>
        data={shiftsData}
        columns={columns}
        // searchPlaceholder='Buscar turnos...'
        // expandableData={expandableData}
      />
    </section>
  );
};
