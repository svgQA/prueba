import { Modal } from '@/components/common/modal/modal';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useSignal } from '@preact/signals';
import { useNavigation } from '@/utils/utilities/navigation';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common/button/button';
import { NotificationHistoryService } from '@/services';
import { DateField } from '@/components/compose/forms';
import { INotificationListItem } from '@/types/notification/INotificationTypes';

export interface IProps {
  closed: boolean;
  onClose: () => void;
  id?: string;
}

export const HistoryForm = ({ closed, onClose, id }: IProps) => {
  const { t } = useTranslation();
  const { navigateUpsert } = useNavigation();

  const loading = useSignal<boolean>(false);
  const [initialValues, setInitialValues] = useState<any>();

  useEffect(() => {
    if (closed) {
      fetchInitialValues();
    }
  }, [id, closed]);

  const fetchInitialValues = async () => {
    if (!id) {
      setInitialValues({
        title: '',
        description: '',
        type: '',
        sentAt: '',
      });
      return;
    }

    const response = await NotificationHistoryService.get_by_id(id);
    if (!response.getStatus()) return;
    const initialData = response.getOne();

    setInitialValues({
      title: initialData.overrideTitle || '',
      description: initialData.overrideDescription || '',
      type: initialData.notificationType || '',
      sentAt: initialData.sentAt || '',
    });
  };

  const handleSubmit = async (model: any, _form?: any) => {
    loading.value = true;
    const response = id
      ? await NotificationHistoryService.update(id, model)
      : await NotificationHistoryService.create(model);
    if (!response.getStatus()) return;
    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    handleClose();
    navigateUpsert('/history');
    loading.value = false;
  };

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  const handleClose = () => {
    setInitialValues({} as INotificationListItem);
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
          form='form-access-create-update'
          icon='041'
        />
      </div>
    ),
    []
  );

  return (
    <Modal
      name='access-form'
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
              id='form-access-create-update'
              onKeyDown={preventKeyDown}
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='col-span-1'>
                  <Field<string> name='title'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={t('h_title')}
                        label={t('h_title')}
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
                  <Field<string> name='description'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={t('h_description')}
                        label={t('h_description')}
                        meta={meta}
                        icon='120'
                        type='text'
                        disabled={loading.value}
                      />
                    )}
                  </Field>
                </div>

                {/* <div className='col-span-1'>
                  <Field<string> name='type'>
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        placeholder={t('h_type')}
                        label={t('h_type')}
                        meta={meta}
                        icon='120'
                        type='text'
                        disabled={loading.value}
                      />
                    )}
                  </Field>
                </div> */}

                <div class='col-span-1'>
                  <DateField name='sentAt' label='h_sent_date' />
                </div>
              </div>
            </form>
          )}
        />
      </div>
    </Modal>
  );
};
