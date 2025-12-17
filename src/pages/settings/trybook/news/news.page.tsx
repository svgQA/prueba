import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import { Table } from '@/components/common/table/table';
import { ExpandableAccess } from '@/components/compose/table/expandable/access';
import { useTranslation } from 'react-i18next';
import { useSignal } from '@preact/signals';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from '@/components/common/table/interface';
import { getColumns } from './components/news.columns';
import { INews } from '@/types/trybook/news';
import { NewsService } from '@/services/trybook/news';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { useUserStore } from '@/store/slices';

export const NewsPage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const { go } = useNavigation();
  const news = useSignal<INews[]>([]);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    document.title = t('p_access');
    if (selectedCompany) {
      fetchInitialData();
    }
  }, [selectedCompany, location]);

  const fetchInitialData = async () => {
    const [newsResponse] = await Promise.all([NewsService.get_all()]);

    if (newsResponse.getStatus()) {
      news.value = newsResponse.getMany();
    }
  };

  const deleteRow = async (id: string) => {
    const req = await NewsService.delete(id);
    if (!req.getStatus()) return;
    ToastManager.success('s_deleted_success');
    await fetchInitialData();
  };

  const editRow = (id: number) => {
    go({
      to: `/trybook/news/update/${id}`,
      label: 'edit',
      id: 'trybook:news:state:update',
      base: 'setting',
    });
  };

  const onClickAction = async (action: IRowAction) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editRow(Number(action.id));
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('i_showAlert_title_zone'),
          message: t('i_showAlert_msg_zone'),
          onConfirm: () => {
            void deleteRow(String(action.id));
          },
          onCancel: () => {},
        });
        break;
    }
  };

  return (
    <Table<INews>
      data={news.value}
      columns={getColumns(onClickAction)}
      expandable={(row: INews) => <ExpandableAccess row={row} />}
      visibility={{
        id: false,
      }}
      absolute
      className='!max-h-[65vh]'
    />
  );
};
