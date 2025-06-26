import { useEffect, useState } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { TemplateService } from '@/services';
import { Table } from '@/components/common/table/table';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { appendHistory } from '../../store/settings';
import { getColumns } from './components/template.columns';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useSignal } from '@preact/signals';

export const TemplateNotificationPage = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [_, navigate] = useLocation();
  const loading = useSignal<boolean>(false);
  const fetchTemplates = async () => {
    loading.value = true;
    const res = await TemplateService.getTemplates();
    if (res.getStatus()) {
      setTemplates(res.getMany());
    }
    loading.value = false;
  };

  useEffect(() => {
    document.title = 'TR - Plantillas de notificaciones';
    fetchTemplates();
  }, []);

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications.templateNotification
        .create.to,
      label: 'create',
      id: 'template-create',
    };
    appendHistory(menu);
    navigate(menu.to);
  };

  const editTemplate = (id: string) => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications.templateNotification.update.to.replace(
        ':id',
        id
      ),
      label: 'update',
      id: 'template-update',
    };
    appendHistory(menu);
    navigate(menu.to);
  };

  const deleteTemplate = async (id: string) => {
    const confirmed = window.confirm('¿Deseas eliminar esta plantilla?');
    if (!confirmed) return;

    const res = await TemplateService.deleteTemplate(id);
    if (!res.getStatus()) return;

    ToastManager.success('Plantilla eliminada correctamente');
    fetchTemplates();
  };

  const handleOnClick = async (action: { id: string; action: ROW_ACTIONS }) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editTemplate(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteTemplate(action.id);
        break;
    }
  };

  return (
    <Section>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <Button
          name='create-template'
          label='+ Nueva Plantilla'
          className='bg-primary text-white p-2'
          onClick={redirect}
        />
      </div>

      <Table<any>
        data={templates}
        columns={getColumns(handleOnClick)}
        pageSize={10}
        isSettingTable
        loading={loading.value}
      />
    </Section>
  );
};
