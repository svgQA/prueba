import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useState } from 'preact/hooks';

export const useTemplateColumns = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const columns: ColumnDef<any>[] = [
    {
      id: 'title',
      accessorKey: 'title',
      size: 180,
      header: 'Título',
      enableGrouping: false,
      cell: (info) => {
        const value = info.getValue() as string;
        return (
          <span
            className="p-1 size-sm cursor-pointer text-left"
            onClick={() => info.row.toggleExpanded()}
          >
            {value}
          </span>
        );
      },
    },
    {
      id: 'description',
      accessorKey: 'description',
      size: 300,
      header: 'Descripción',
      enableGrouping: false,
      cell: (info) => {
        const value = info.getValue() as string;
        return (
          <span className="p-1 size-sm text-gray-700 block whitespace-nowrap overflow-hidden text-ellipsis">
            {value}
          </span>
        );
      },
    },
    {
      id: 'data',
      accessorKey: 'data',
      size: 220,
      header: 'Datos enviados',
      enableGrouping: false,
      cell: (info) => {
        const value = info.getValue() as Record<string, any>;
        const parsed = `{formId: ${value?.formId ?? 'Ninguna'}, taskId: ${value?.taskId ?? 'Ninguna'}}`;
        return (
          <span className="p-1 size-xs text-gray-500 block whitespace-nowrap overflow-hidden text-ellipsis">
            {parsed}
          </span>
        );
      },
    },
    {
      id: 'actions',
      size: 20,
      cell: (info) => {
        const { id } = info.row.original;
        return (
          <div className='w-full flex justify-center group relative'>
            <span className='vox-icon vx-icon-233 p-1 size-sm cursor-pointer' />
            <div className='absolute left-full ml-2 hidden group-hover:flex bg-white shadow-lg rounded p-1'>
              <span
                className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
                data-id={id}
                data-type='shift'
                data-action={ROW_ACTIONS.UPDATE}
              ></span>
              <span
                className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
                data-id={id}
                data-type='shift'
                data-action={ROW_ACTIONS.DELETE}
              ></span>
            </div>
          </div>
        );
      },
    },
  ];

  return { columns, activeDropdown, setActiveDropdown };
};
