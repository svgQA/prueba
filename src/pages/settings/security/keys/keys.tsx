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

  return (
    <Section className='space-y-4'>
      <div className='flex justify-end gap-2'>
        <Input
          id='key-name'
          name='key-name'
          label='name'
          value={name.value}
          onChange={(e) => (name.value = e.currentTarget.value)}
          placeholder='name'
        />
        <Button
          name='create-key'
          label='create'
          icon='312'
          onClick={createKey}
        />
      </div>
      <Table data={keys.value} columns={columns} loading={loading.value} />
    </Section>
  );
};
