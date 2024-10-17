import { type FunctionComponent } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { memosData } from './memos.data';
import { Memo } from './memos.d';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/components/common/table/table';
import { InfoIcon } from './memos.columns';
// import { PrioritySection } from '@/components/common/expansible/expansible';

export const MemosPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Memos Service';
  }, []);

  // const [expandableData, setExpandableData] = useState<PrioritySection[]>([]);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    // const priorityData: PrioritySection[] = [
    //   { title: 'Alta', items: [] },
    //   { title: 'Media', items: [] },
    //   { title: 'Baja', items: [] },
    // ];
    // memosData.forEach((memo) => {
    //   const priorityIndex =
    //     memo.priority === 'Alta' ? 0 : memo.priority === 'Media' ? 1 : 2;
    //   priorityData[priorityIndex].items.push(memo);
    // });
    // setExpandableData(priorityData);
  }, []);

  const columns = useMemo<ColumnDef<Memo>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        header: 'Nombre',
      },
      {
        accessorKey: 'noveltyType',
        header: 'Tipo Novedad',
      },
      {
        accessorKey: 'noveltyDate',
        header: 'Fecha Novedad',
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
      },
      {
        accessorKey: 'priority',
        header: 'Prioridad',
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

  // const filteredData = useMemo(() => {
  //   return expandableData.map((section) => ({
  //     ...section,
  //     items: section.items.filter((item) =>
  //       Object.values(item).some((value) =>
  //         value.toString().toLowerCase().includes(filterValue.toLowerCase())
  //       )
  //     ),
  //   }));
  // }, [expandableData, filterValue]);

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Memos</h1>
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Buscar memos...'
          value={filterValue}
          onChange={(e) => setFilterValue(e.currentTarget.value)}
          className='w-full p-2 border border-gray-300 rounded'
        />
      </div>
      {/*
      {filteredData.map((prioritySection, index) => (
        <div key={index} className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>
            {prioritySection.title}
          </h2>
          */}
      <Table<Memo>
        data={memosData}
        columns={columns}
        // pageSize={10}
        // expandableData={prioritySection.items}
      />
      {/*
        </div>
      ))}
      */}
    </section>
  );
};
