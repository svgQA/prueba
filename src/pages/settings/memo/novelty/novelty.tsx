// import { Button } from '@/components/common/button/button';
// import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { columns } from './components/novelty.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';

import { NoveltyService } from '@/services';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';
export interface INovelty {
  id: number;
  name: string;
  description: string;
  priority: string;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const NoveltySettingPage: FunctionComponent = () => {
  const { go } = useNavigation();
  const novelties: Signal<INovelty[]> = useSignal([]);
  const loading = useSignal<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_novelty');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getNovelties();
    }
  }, [selectedCompany, location]);

  const getNovelties = async () => {
    loading.value = true;
    const request: any = await NoveltyService.getNovelty();
    if (request.getStatus()) {
      novelties.value = request.getMany();
    }
    loading.value = false;
  };

  const update = (id: string) => {
    go({
      to: `/memo/novelty/update/${id}`,
      label: 'edit',
      id: 'memo:novelty:state:update',
      base: 'setting',
    });
  };

  const deleteNovelty = async (id: string) => {
    const request = await NoveltyService.deleteNovelty(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getNovelties();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteNovelty(action.id);
        break;
    }
  };

  return (
    <>
      <Table<INovelty>
        data={novelties.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
        absolute
      />
    </>
  );
};
