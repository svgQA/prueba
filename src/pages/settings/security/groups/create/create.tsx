import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
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
import { navigate } from 'wouter/use-browser-location';

export const GroupCreateSettingPage: FunctionComponent = () => {
  const name = useSignal<string>('');
  const description = useSignal<string>('');

  useEffect(() => {
    document.title = 'Security Group Settings';
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
    ToastManager.success('Grupo creado exitosamente');
    navigate('/security/groups');
  };

  return (
    <Section>
      <div className='p-4'>
        <div className='pb-4'>
          <div className='flex flex-row justify-between items-end gap-3'>
            <Input
              name='Nombre'
              label='name'
              value={name.value}
              onChange={(e) => (name.value = e.currentTarget.value)}
            />
            <Button
              name='id-save-group'
              label='save'
              icon='312'
              onClick={saveGroup}
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
        <div class='space-y-4 rounded shadow-md'>
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
    </Section>
  );
};
