import { Modal } from '@/components/common/modal/modal';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useSignal } from '@preact/signals';
import { useNavigation } from '@/utils/utilities/navigation';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common/button/button';
import { IOption, SmartSelector } from '@/components/common/smart-selector/smart-select';
import { UserService } from '@/services';
import { ICCorrespondence, ICorrespondence } from '@/types/access';
import { Correspondence_STATUS } from '@/types/access/service';
import { CorrespondenceService } from '@/services/access/correspondence';
import { DateField } from '@/components/compose/forms';

interface Props {
  closed: boolean;
  onClose: () => void;
  id?: string;
}

export const CorrespondenceForm = ({ closed, onClose, id }: Props) => {
  const { t } = useTranslation();
  const { navigateUpsert } = useNavigation();

  const users = useSignal<IOption[]>([]);
  const status = useSignal<IOption[]>(Object.values(Correspondence_STATUS).map((value, index) => ({ label: value, value: index })));
  const loading = useSignal<boolean>(false);
  const [initialValues, setInitialValues] = useState<any>();

  useEffect(() => {
    if (closed) {
      fetchInitialValues();
    }
  }, [id, closed]);

  const fetchInitialValues = async () => {
    // Si necesitas usuarios, mantenlo
    const [usersResponse] = await Promise.all([
      UserService.getListUsers(),
    ]);

    if (usersResponse.getStatus()) {
      users.value = usersResponse.getMany();
    }

    if (!id) {
      setInitialValues({
        sender: '',
        owner: '',
        receivedAt: '',
        houseNumber: '',
        status: '',
        whoPickedUp: '',
        packageType: '',
        observation: '',
        messageToOwner: '',
      });
      return;
    }

    const response = await CorrespondenceService.get_by_id(id);
    if (!response.getStatus()) return;
    const initialData = response.getOne();
    const statusFind = status.value.find(s => s.label === initialData.status);

    setInitialValues({
      sender: initialData.sender || '',
      owner: initialData.owner || '',
      receivedAt: initialData.receivedAt || '',
      houseNumber: initialData.houseNumber || '',
      status: statusFind || '',
      whoPickedUp: initialData.whoPickedUp || '',
      packageType: initialData.packageType || '',
      observation: initialData.observation || '',
      messageToOwner: initialData.messageToOwner || '',
    });
  };

  const handleSubmit = async (model: any, _form?: any) => {
    loading.value = true;

    const body: ICCorrespondence = {
      sender: model.sender,
      owner: model.owner,
      receivedAt: model.receivedAt,
      houseNumber: model.houseNumber,
      status: model.status.label,
      whoPickedUp: model.whoPickedUp,
      packageType: model.packageType,
      observation: model.observation,
      messageToOwner: model.messageToOwner,
    };

    let response = id
      ? await CorrespondenceService.updateCorrespondence(id, body)
      : await CorrespondenceService.createCorrespondence(body);

    if (!response.getStatus()) return;
    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    handleClose();
    navigateUpsert('/correspondence');
    loading.value = false;
  };

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  const handleClose = () => {
    setInitialValues({} as ICorrespondence);
    onClose();
  };

  const footerContent = useMemo(
    () => (
      <div className='flex justify-end items-center gap-2 p-4'>
        <Button
          name='btn-form-shift-close'
          label='cancel'
          type='button'
          onClick={() => onClose()}
          icon='041'
        />
        <Button
          name='btn-form-shift-save'
          type='submit'
          label={id ? 'edit' : 'save'}
          form='form-correspondence-create-update'
          icon='041'
        />
      </div>
    ),
    []
  );

  return (
    <Modal
      name='correspondence-form'
      open={closed}
      onClose={handleClose}
      width='w-2/3'
      position='fixed'
      header={<span>{id ? t('udpate') : t('create')}</span>}
      footer={footerContent}
    >
      <div className='px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design'>
        <Form
          onSubmit={handleSubmit}
          initialValues={initialValues}
          enableReinitialize={true}
          render={({ handleSubmit }) => (
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
              id='form-correspondence-create-update'
              onKeyDown={preventKeyDown}
            >
              <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-1'>
                  <Field<string> name='sender'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={t('h_sender')}
                        label={t('h_sender')}
                        meta={meta}
                        icon='120'
                        type='text'
                        disabled={loading.value}
                        required
                      />
                    )}
                  </Field>
                </div>
                <div className='col-span-1'>
                  <Field<string> name='owner'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={t('h_owner')}
                        label={t('h_owner')}
                        meta={meta}
                        icon='120'
                        type='text'
                        disabled={loading.value}
                        required
                      />
                    )}
                  </Field>
                </div>
                <div className='col-span-1'>
                  <DateField name='receivedAt' label='h_received' />
                </div>
                <div className='col-span-1'>
                  <Field<string> name='houseNumber'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={t('h_house_number')}
                        label={t('h_house_number')}
                        meta={meta}
                        icon='120'
                        type='text'
                        disabled={loading.value}
                        required
                      />
                    )}
                  </Field>
                </div>
                <div className='col-span-1'>
                  <Field<string> name='status'>
                    {({ input, meta }) => (
                      <SmartSelector
                        {...input}
                        options={status.value}
                        label={t('h_status')}
                        meta={meta}
                        disabled={loading.value}
                      />
                    )}
                  </Field>
                </div>
                <div className='col-span-1'>
                  <Field<string> name='whoPickedUp'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={t('h_who_picked_up')}
                        label={t('h_who_picked_up')}
                        meta={meta}
                        icon='120'
                        type='text'
                        disabled={loading.value}
                        required
                      />
                    )}
                  </Field>
                </div>
                <div className='col-span-1'>
                  <Field<string> name='packageType'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={t('h_package_type')}
                        label={t('h_package_type')}
                        meta={meta}
                        icon='120'
                        type='text'
                        disabled={loading.value}
                        required
                      />
                    )}
                  </Field>
                </div>
                <div className='col-span-2'>
                  <Field<string> name='observation'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={t('h_observation')}
                        label={t('h_observation')}
                        meta={meta}
                        icon='120'
                        type='text'
                        disabled={loading.value}
                        required
                      />
                    )}
                  </Field>
                </div>
                <div className='col-span-2'>
                  <Field<string> name='messageToOwner'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={t('h_message_to_owner')}
                        label={t('h_message_to_owner')}
                        meta={meta}
                        icon='120'
                        type='text'
                        disabled={loading.value}
                        required
                      />
                    )}
                  </Field>
                </div>
              </div>
            </form>
          )}
        />
      </div>
    </Modal>
  );
};
