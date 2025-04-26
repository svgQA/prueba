import { useEffect, useState } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { TemplateServiceFront } from '@/services/template';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/components/common/table/table';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { appendHistory } from '../../store/settings';

export const TemplateNotificationPage = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [_, navigate] = useLocation();

  const fetchTemplates = async () => {
    const res = await TemplateServiceFront.getTemplates();
    if (res.getStatus()) setTemplates(res.getMany());
  };

  useEffect(() => {
    document.title = 'VX - Plantillas de notificaciones';
    fetchTemplates();
  }, []);

  const columns: ColumnDef<any>[] = [
    {
      header: 'Título',
      accessorKey: 'title',
      minSize: 150,
      maxSize: 250,
      cell: ({ getValue }) => (
        <span className='text-sm'>{getValue() as string}</span>
      ),
    },
    {
      header: 'Descripción',
      accessorKey: 'description',
      minSize: 200,
      maxSize: 400,
      cell: ({ getValue }) => (
        <span className='text-sm block whitespace-nowrap overflow-hidden text-ellipsis'>
          {getValue() as string}
        </span>
      ),
    },
    {
      header: 'Datos enviados',
      accessorKey: 'data',
      minSize: 150,
      maxSize: 250,
      cell: ({ getValue }) => {
        const value = getValue() as Record<string, any>;
        const parsed = `{formId: ${value?.formId ?? 'Ninguna'}, taskId: ${value?.taskId ?? 'Ninguna'}}`;
        return (
          <span className='text-xs text-gray-600 block whitespace-nowrap overflow-hidden text-ellipsis'>
            {parsed}
          </span>
        );
      },
    },
    {
      header: 'Acciones',
      id: 'actions',
      minSize: 100,
      maxSize: 120,
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className='relative z-50'>
            <span
              className='vox-icon vx-icon-147 text-lg cursor-pointer'
              onClick={() =>
                setActiveDropdown(activeDropdown === id ? null : id)
              }
            ></span>
            {activeDropdown === id && (
              <div className='absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10'>
                <button
                  className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100'
                  onClick={() => {
                    setActiveDropdown(null);
                    navigate(`/notifications/templateNotifications/edit/${id}`);
                  }}
                >
                  Editar
                </button>
                <button
                  className='w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50'
                  onClick={() => {
                    setActiveDropdown(null);
                    alert('Eliminar plantilla ' + id);
                  }}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications.templateNotification
        .create.to,
      label: 'create',
      id: 'template-create',
    };
    navigate(menu.to);
    appendHistory(menu);
  };

  return (
    <Section padding>
      <div className='flex justify-between items-center mb-4'>
        <div className='absolute mt-12 z-50'>
          <Button
            name='create-template'
            label='+ Nueva Plantilla'
            className='bg-primary text-white p-2 mt-10'
            onClick={redirect}
          />
        </div>
      </div>

      <Table<any>
        data={templates}
        columns={columns}
        pageSize={10}
        unsettings
        visibility={{}}
      />
    </Section>
  );
};
