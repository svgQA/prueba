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
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';

export const TemplateNotificationPage = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [_, navigate] = useLocation();
  const loading = useSignal<boolean>(false);

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_template');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchTemplates();
    }
  }, [selectedCompany, location]);

  const fetchTemplates = async () => {
    loading.value = true;
    const res = await TemplateService.getTemplates();
    if (res.getStatus()) {
      setTemplates(res.getMany());
    }
    loading.value = false;
  };

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

    ToastManager.success('s_deleted_success');
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
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-template'
            label='new'
            icon='039'
            onClick={() => redirect()}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
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
