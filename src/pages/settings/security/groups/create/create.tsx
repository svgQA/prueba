import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
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
// TODO: Ver esto, porque este lo hace de forma absoluta
// import { navigate } from 'wouter/use-browser-location';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@/utils/hooks/navigation';

export const GroupCreateSettingPage: FunctionComponent = () => {
  const name = useSignal<string>('');
  const description = useSignal<string>('');
  const { go } = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('p_group');
  }, []);

  const [rootGroup, setRootGroup] = useState<Group>(createEmptyGroup());

  const saveGroup = async () => {
    if (
      !name.value ||
      name.value.length < 5 ||
      !description.value ||
      name.value.length < 5
    ) {
      ToastManager.error('Nombre o descripciòn no cumplen reglas: largo >= 5');
      return;
    }

    const response = await GeneralService.createGroup({
      name: name.value,
      description: description.value,
      model: rootGroup,
    });
    if (!response.getStatus()) return;
    name.value = '';
    description.value = '';
    setRootGroup(createEmptyGroup());
    ToastManager.success('s_created_success');
    go({
      to: '/security/groups',
      label: 'groups',
      id: 'security:groups:state',
    });
  };

  return (
    <>
      <div className='flex justify-end gap-4 absolute top-14 right-2'>
        <Button
          name='id-save-group'
          label='save'
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
        </div>
      </div>
    </>
  );
};
