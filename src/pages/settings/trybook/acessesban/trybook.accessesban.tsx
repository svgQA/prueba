import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useTranslation } from 'react-i18next';

import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from '@/components/common/table/interface';

import { IAccessBan } from '@/types/trybook/access-ban';
import { AccessBansService } from '@/services/trybook/access-bans';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { getColumns } from './accessesbans.columns';

export const AccessBansPage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();

  const rows = useSignal<IAccessBan[]>([]);

  useEffect(() => {
    document.title = t('h_access_bans') || 'Access Bans';
    void fetchInitial();
  }, []);

  const fetchInitial = async () => {
    const res = await AccessBansService.getAccessBans({ page: 1, items: 1000 });
    if (res.getStatus()) {
      rows.value = res.getMany();
    }
  };

  const onDelete = async (id: string) => {
    const req = await AccessBansService.deleteAccessBan(id);
    if (!req.getStatus()) return;
    ToastManager.success('s_deleted_success');
    await fetchInitial();
  };

  const onClickAction = async (action: IRowAction) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        go({
          to: `/trybook/access-bans/update/${action.id}`,
          label: 'edit',
          id: 'trybook:access-bans:update',
          base: 'setting',
        });
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('i_showAlert_title_zone') || 'Confirmar',
          message: t('i_showAlert_msg_zone') || '¿Eliminar este registro?',
          onConfirm: () => void onDelete(String(action.id)),
          onCancel: () => {},
        });
        break;
    }
  };

  return (
    <Section>
      <div className='max-h-screen'>
        <Table<IAccessBan>
          data={rows.value}
          columns={getColumns(({ id, action }: { id: string; action: ROW_ACTIONS }) => onClickAction({ id, type: 'ban', action }))}
          pageSize={10}
          visibility={{ id: false }}
        />
      </div>
    </Section>
  );
};
