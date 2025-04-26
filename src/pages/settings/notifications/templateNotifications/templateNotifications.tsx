import { useEffect, useState } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { TemplateServiceFront } from '@/services/template';
import { Table } from '@/components/common/table/table';
import { useLocation } from 'wouter';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { appendHistory } from '../../store/settings';
import { useTemplateColumns } from './template.columns';

export const TemplateNotificationPage = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [_, navigate] = useLocation();
  const { columns } = useTemplateColumns();

  const fetchTemplates = async () => {
    const res = await TemplateServiceFront.getTemplates();
    if (res.getStatus()) setTemplates(res.getMany());
  };

  useEffect(() => {
    document.title = 'VX - Plantillas de notificaciones';
    fetchTemplates();
  }, []);

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications.templateNotification.create.to,
      label: 'create',
      id: 'template-create',
    };
    navigate(menu.to);
    appendHistory(menu);
  };

  return (
    <Section padding>
      <div className="flex justify-between items-center mb-4">
        <div className="absolute mt-12 z-50">
          <Button
            name="create-template"
            label="+ Nueva Plantilla"
            className="bg-primary text-white p-2 mt-10"
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
