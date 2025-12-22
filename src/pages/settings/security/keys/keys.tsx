import { type FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { useSignal } from '@preact/signals';
import { Section } from '@/components/common/section/section';
import { Input } from '@/components/common/input/input';
import { Button } from '@/components/common/button/button';
import { Table } from '@/components/common/table/table';
import { columns } from './keys.columns';
import { KeyService } from '@/services';
import { IKeyResponse } from '@/types/key/key.response';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useUserStore } from '@/store/slices';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { showAlert } from '@/components/common/show-alert/show-alert';

export const KeysSettingPage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const name = useSignal('');
  const keys = useSignal<IKeyResponse[]>([]);
  const loading = useSignal(false);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    document.title = t('p_key');
    if (selectedCompany) {
      fetchKeys();
    }
  }, [selectedCompany, location]);

  const fetchKeys = async () => {
    loading.value = true;
    const response = await KeyService.listAll();
    if (response.getStatus()) {
      keys.value = response.getMany();
    }
    loading.value = false;
  };

  const createKey = async () => {
    if (!name.value) return;
    const response = await KeyService.create({ name: name.value });
    if (!response.getStatus()) return;
    ToastManager.success('s_created_success');
    name.value = '';
    await fetchKeys();
  };

  const deleteGroup = async (id: number) => {
    const response = await KeyService.delete(id);
    if (!response.getStatus()) return;
    ToastManager.success('s_deleted_success');
    fetchKeys();
  };

  const handleOnClick = async (action: any) => {
    switch (action.action) {
      // case ROW_ACTIONS.UPDATE:
      //   update(action.id);
      //   break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('a_title_delete'),
          message: t('a_message_delete', {
            name: action.name,
          }),
          onConfirm: () => deleteGroup(Number(action.id)),
          onCancel: () => {},
        });
        break;
    }
  };

  return (
    <Section className='space-y-4'>
      <div className='flex items-end gap-2'>
        <Input
          id='key-name'
          name='key-name'
          label='name'
          value={name.value}
          onChange={(e) => (name.value = e.currentTarget.value)}
          placeholder='name'
        />
      </div>
      <div className='max-h-screen'>
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark'>
          <div className='flex flex-row items-center justify-between'>
            <Button
              name='create-key'
              label='create'
              icon='039'
              onClick={createKey}
            />
          </div>
        </div>
        <Table
          data={keys.value}
          columns={columns}
          loading={loading.value}
          onClickAction={handleOnClick}
          className='!h-[52.5vh]'
        />
      </div>
    </Section>
  );
};
