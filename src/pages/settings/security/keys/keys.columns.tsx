import { ColumnDef } from '@tanstack/react-table';
import { IKeyResponse } from '@/types/key/key.response';
import { useState } from 'react';

export const columns: ColumnDef<IKeyResponse>[] = [
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
    cell: ({ getValue }) => {
      const pat = getValue() as string;
      const [copied, setCopied] = useState(false);

      const handleCopy = async () => {
        await navigator.clipboard.writeText(pat);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      };

      return (
        <div className='flex items-center gap-2'>
          <span className='truncate max-w-[150px] text-sm'>{pat}</span>
          <button
            onClick={handleCopy}
            className='px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600'
          >
            {copied ? '✔' : 'Copiar'}
          </button>
        </div>
      );
    },
  },
];
