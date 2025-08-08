import { Modal } from '@/components/common/modal/modal';
import { AccessesService } from '@/services/access/accesses';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { IAccess } from '../utils';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useSignal } from '@preact/signals';
import { useNavigation } from '@/utils/utilities/navigation';
import { Form, Field } from 'react-final-form';
import { Input } from '@/components/common/input/input';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/common/button/button';

export interface IAccessFormProps {
  closed: boolean;
  onClose: () => void;
  id?: string;
}

export const AccessForm = ({ closed, onClose, id }: IAccessFormProps) => {
  const { t } = useTranslation();
  const { navigateUpsert } = useNavigation();

  const [initialValues, setInitialValues] = useState<IAccess>({
    name: '',
    description: '',
  });
  const loading = useSignal<boolean>(false);

  useEffect(() => {
    if (closed) {
      fetchInitialValues();
    }
  }, [id, closed]);

  const fetchInitialValues = async () => {
    if (!id) {
      setInitialValues({
        name: '',
        description: '',
      });
      return;
    }

    const response = await AccessesService.get_by_id(id);
    if (!response.getStatus()) return;
    const initialData = response.getOne();

    setInitialValues({
      name: initialData.name || '',
      description: initialData.description || '',
    });
  };

  const handleSubmit = async (model: any, _form?: any) => {
    loading.value = true;

    let access: IAccess = {
      name: model.name,
      description: model.description,
    };

    let response = id
      ? await AccessesService.updateAccesses(id, access)
      : await AccessesService.createAccesses(access);

    if (!response.getStatus()) return;
    ToastManager.success(id ? 's_updated_success' : 's_created_success');
    onClose();
    navigateUpsert('/access');
    loading.value = false;
  };

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  const handleClose = () => {
    setInitialValues({} as IAccess);
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
      header={<span>{id ? t('edit_access') : t('create_access')}</span>}
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
              <div className='flex flex-col justify-center border-t dark:border-t-light-dark py-2'>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='col-span-1'>
                    <Field<string> name='name'>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          placeholder={t('h_name')}
                          label={t('h_name')}
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
                </div>
              </div>
            </form>
          )}
        />
      </div>
    </Modal>
  );
};
