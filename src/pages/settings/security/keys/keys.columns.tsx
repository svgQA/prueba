import { ColumnDef } from '@tanstack/react-table';
import { IKeyResponse } from '@/types/key/key.response';
import { useState } from 'react';
import { ROW_ACTIONS } from '@/components/common/table/enum';

export const columns: ColumnDef<IKeyResponse>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'h_id',
    size: 40,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'h_name',
    size: 40,
  },
  {
    id: 'pat',
    accessorKey: 'pat',
    header: 'h_pat',
    size: 60,
    cell: (info) => {
      const { pat, show } = info.row.original;
      const [copied, setCopied] = useState(false);

      const handleCopy = async () => {
        await navigator.clipboard.writeText(String(pat));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      };

      return (
        <div className='flex items-center gap-2'>
          {show && (
            <>
              <span className='truncate max-w-[150px] text-sm'>{pat}</span>
              <button
                onClick={handleCopy}
                className='px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600'
              >
                {copied ? '✔' : 'Copiar'}
              </button>
            </>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    size: 20,
    header: 'h_action',
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          {/*
          <span
            className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='key-update'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          */}
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='key-delete'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
        </div>
      );
    },
  },
];
