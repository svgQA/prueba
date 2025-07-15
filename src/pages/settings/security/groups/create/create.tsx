import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
// import { Section } from '@/components/common/section/section';
import { GroupBuilder } from './GroupBuilder';
import { Group } from './utils/types';
import { createEmptyGroup } from './utils/utils';
import { Input } from '@/components/common/input/input';
import { EquationPreview } from './EquationPreview';
import { TextArea } from '@/components/common/text.area/text.area';
import { Button } from '@/components/common/button/button';
import { useSignal } from '@preact/signals';
import { GeneralService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@/utils/utilities/navigation';
import { useParams } from 'wouter';

export const GroupCreateSettingPage: FunctionComponent = () => {
  const { navigateUpsert } = useNavigation();
  const name = useSignal<string>('');
  const description = useSignal<string>('');
  const { id } = useParams();
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_group');
    getSmartGroupById();
  }, []);

  const [rootGroup, setRootGroup] = useState<Group>(createEmptyGroup());

  const saveGroup = async () => {
    if (
      !name.value ||
      name.value.length < 5 ||
      !description.value ||
      name.value.length < 5
    ) {
      ToastManager.error(t('smartGroup.form.rule'));
      return;
    }

    const data = {
      name: name.value,
      description: description.value,
      model: rootGroup,
    };

    const response = id
      ? await GeneralService.updateGroup(id, data)
      : await GeneralService.createGroup(data);

    if (!response.getStatus()) return;
    name.value = '';
    description.value = '';
    setRootGroup(createEmptyGroup());
    ToastManager.success(
      id ? t('smartGroup.updated') : t('smartGroup.created')
    );
    navigateUpsert('/security/groups');
  };

  const getSmartGroupById = async () => {
    if (!id) return;
    const response = await GeneralService.getSmartGroupById(id);
    if (!response.getStatus()) return;

    const smartGroup = response.getOne();
    name.value = smartGroup.name;
    description.value = smartGroup.description;
    setRootGroup(smartGroup.model);
  };

  return (
    <div className='space-y-2 max-h-[67vh] overflow-y-auto vox-scroll-design'>
      <div className='flex justify-end gap-4 absolute top-14 right-2'>
        <Button
          name='id-save-group'
          label={id ? 'update' : 'create'}
          icon='312'
          onClick={saveGroup}
        />
      </div>
      <div className='px-4'>
        <div className='pb-4'>
          <div className='flex flex-row justify-between items-end gap-3'>
            <Input
              name='Nombre'
              label='name'
              value={name.value}
              onChange={(e) => (name.value = e.currentTarget.value)}
            />
          </div>
          <TextArea
            name='Nombre'
            label='description'
            value={description.value}
            onChange={(e) => (description.value = e.currentTarget.value)}
          />
        </div>
        <EquationPreview filter={rootGroup} />
        <div class='space-y-4 rounded'>
          <GroupBuilder
            group={rootGroup}
            onChange={setRootGroup}
            onRemove={() => {}}
          />
          {/*
          <pre class='bg-gray-100 dark:bg-b-dark-light text-sm rounded overflow-auto max-h-64 text-gray-800 dark:text-white p-2'>
            {JSON.stringify(rootGroup, null, 2)}
          </pre>
          */}
        </div>
      </div>
    </div>
  );
};
