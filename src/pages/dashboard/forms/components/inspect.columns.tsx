import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/button/button';
import { Chip } from '@/components/common/chip/chip';
import { RelativeTime } from '@/components/common/relative/relative';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IResponseResponse, RESPONSE_STATUS } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';
import i18next from 'i18next';

// Función para obtener traducciones
const t = (key: string) => i18next.t(key);

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<IResponseResponse>[] => [
  {
    accessorKey: 'user',
    id: 'user',
    header: t('form.columns.user'),
    cell: (info) => {
      const { user } = info.row.original;
      return (
        <div className='flex items-center'>
          <Avatar name={user?.name} src={user?.image} size='sm' square />
          <div className='flex flex-col ml-3'>
            <div className='font-bold'>
              {user?.name} {user?.surname}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    id: 'title',
    header: t('form.columns.title'),
    cell: (info) => {
      const { form } = info.row.original;
      return (
        <div className='flex items-center'>
          <span className='vox-icon vx-icon-152 mt-1 size-md' />
          <div className='flex flex-col ml-3 text-left'>
            <h5 className='font-bold text-left'>{form.title}</h5>
            <p className='w-full flex justify-start max-w-96 overflow-hidden text-ellipsis whitespace-nowrap'>
              {form.description}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: t('form.columns.createdAt'),
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: t('form.columns.updatedAt'),
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: t('form.columns.status'),
    cell: (info) => {
      const { status } = info.row.original;
      return <Chip label={status} />;
    },
  },
  {
    id: 'action',
    size: 30,
    cell: (info) => {
      const { id, status } = info.row.original;

      const actions: IDropdownAction[] = [
        status === RESPONSE_STATUS.OPENED
          ? {
              label: t('form.buttons.continue'),
              icon: 'vox-icon vx-icon-030 text-primary',
              onClick: () => {
                onClickAction({
                  id: String(id),
                  type: 'response',
                  action: ROW_ACTIONS.RESPONSE,
                });
              },
            }
          : {
              label: 'Ver reporte',
              icon: 'vox-icon vx-icon-433 text-primary',
              onClick: () => {
                onClickAction({
                  id: String(id),
                  type: 'response',
                  action: ROW_ACTIONS.REPORT,
                });
              },
            },
        {
          label: 'Eliminar',
          icon: 'vox-icon vx-icon-053 text-red-500',
          color: 'text-red-600',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'response',
              action: ROW_ACTIONS.DELETE,
            });
          },
        },
      ];

      return (
        <div className='w-full flex justify-end gap-3 items-center'>
          {status === RESPONSE_STATUS.OPENED && (
            <Button
              name='continue'
              label='Continuar'
              onClick={() => {
                onClickAction({
                  id: String(id),
                  type: 'response',
                  action: ROW_ACTIONS.RESPONSE,
                });
              }}
            >
              Continuar
            </Button>
          )}
          <DropdownActionsMenu actions={actions} />
        </div>
      );
    },
  },
];
