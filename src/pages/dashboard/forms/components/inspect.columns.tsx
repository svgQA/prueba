import { ButtonAction } from '@/components/common/button/column';
import { RelativeTime } from '@/components/common/relative/relative';
import { IDropdownAction, DropdownActionsMenu } from '@/components/common/table/components/dropdown.actions.menu';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IFormat, IResponseResponse, RESPONSE_STATUS } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';
import i18next from 'i18next';

// Función para obtener traducciones
const t = (key: string) => i18next.t(key);

export const getColumns = (
  onClickAction: (params: { id: string; type: string; action: ROW_ACTIONS }) => void
): ColumnDef<IResponseResponse>[] => [
    {
      accessorKey: 'structure',
      id: 'title',
      header: t('forms.columns.id'),
      cell: (info) => {
        const value = info.getValue() as IFormat;
        return (
          <div className='flex items-center'>
            <span className='vox-icon vx-icon-152 mt-1 size-sm' />
            <div className='flex flex-col ml-3'>
              <div className='font-bold'>{value.label}</div>
              <div className='w-full flex justify-center max-w-96 overflow-hidden text-ellipsis whitespace-nowrap'>
                {value.description}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: t('forms.columns.createdAt'),
      cell: (info) => <RelativeTime date={info.getValue() as string} />,
    },
    {
      accessorKey: 'updatedAt',
      id: 'updatedAt',
      header: t('forms.columns.updatedAt'),
      cell: (info) => <RelativeTime date={info.getValue() as string} />,
    },
    {
      id: 'action',
      size: 30,
      cell: (info) => {
        const { id, status } = info.row.original;

        const actions: IDropdownAction[] = [
          status === RESPONSE_STATUS.OPENED
            ? {
              label: t('forms.buttons.continue') || 'Continuar',
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
          <div className="w-full flex justify-center">
            <DropdownActionsMenu actions={actions} />
          </div>
        );
      },
    }

  ];
