import { ColumnDef } from '@tanstack/react-table';
import { IWebhookResponse } from '@/types/webhook/webhook.response';

export const columns: ColumnDef<IWebhookResponse>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'h_name',
    size: 20,
  },
  {
    id: 'webhook',
    accessorKey: 'webhook',
    header: 'h_url',
    size: 30,
  },
  /*
  {
    id: 'events',
    accessorKey: 'events',
    header: 'h_events',
    size: 20,
    cell: ({ getValue }) => (getValue() as string[]).join(', '),
  },
  */
  {
    id: 'platform',
    accessorKey: 'platform',
    header: 'h_platform',
    size: 15,
  },
  {
    id: 'token',
    accessorKey: 'token',
    header: 'h_token',
    size: 15,
  },
];
