import { Signal, useSignal } from '@preact/signals';

import { Modal } from '@/components/common/modal/modal';

import { useTranslation } from 'react-i18next';
import { Field, Form } from 'react-final-form';
import { TextArea } from '@/components/common/text.area/text.area';
import { useMemo, useCallback } from 'preact/hooks';
import { Button } from '@/components/common/button/button';
import { File } from '@/components/common/file/file';
import { IPresignedRequest } from '@/types/file';
import { fileManager } from '@/utils/network/file/file';
import { useUserStore } from '@/store/slices';
import { PqrsAiService } from '@/services/pqrs/ai-pqrs';
import { Loading } from '@/components/common/loading/loading';

interface IProps {
  showModal: Signal<boolean>;
  closeModal: () => void;
}

export const PqrsUpsert = ({ showModal, closeModal }: IProps) => {
  const { t } = useTranslation();
  const { getTenant, getCompanyId } = useUserStore();

  const loading = useSignal<boolean>(false);
  const files = useSignal<IPresignedRequest[]>([]);

  const handleSubmit = async (model: any, _form: any) => {
    loading.value = true;
    let description = model.description;

    if (files.value && files.value.length > 0) {
      let getUrls = files.value.map((file: IPresignedRequest) =>
        fileManager.getUrl(getTenant(), getCompanyId(), file)
      );
      description += `\n\nAttachments:\n` + getUrls.join('\n');
    }
    const response = await PqrsAiService.execute_ai_pqrs({ description });
    if (!response.getStatus()) {
      loading.value = false;
      return;
    }
    closeModal();
    loading.value = false;
  };

  const handleAttachmentUpload = (e: any) => {
    const fileInput: IPresignedRequest = e.target.value[0];
    files.value = [...files.value, fileInput];
  };

  const handleOnClose = useCallback(() => {
    files.value = [];
    closeModal();
  }, [closeModal]);

  const preventKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  const footerContent = useMemo(
    () => (
      <div className='flex justify-end items-center gap-2 p-4'>
        <Button
          name='btn-form-pqrs-close'
          label='cancel'
          type='button'
          onClick={handleOnClose}
          icon='041'
        />
        <Button
          name='btn-form-pqrs-save'
          type='submit'
          label={'save'}
          form='form-pqrs-upsert'
          icon='041'
        />
      </div>
    ),
    [handleOnClose]
  );

  return (
    <Modal
      open={showModal.value}
      onClose={handleOnClose}
      name='modal-pqrs-details'
      width='w-2/3'
      position='fixed'
      header={<h3 className='text-xl font-medium'>{t('h_pqrs_details')}</h3>}
      footer={footerContent}
    >
      <div className='px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design'>
        {loading.value && <Loading />}

        <Form
          onSubmit={handleSubmit}
          render={({ handleSubmit }) => (
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
              id='form-pqrs-upsert'
              onKeyDown={preventKeyDown}
            >
              <div className='grid grid-cols-2 gap-3 z-50 p-4'>
                <div className='col-span-2'>
                  <Field<string> name='description'>
                    {({ input, meta }) => (
                      <TextArea
                        {...input}
                        icon='120'
                        type='text'
                        placeholder={t('h_description')}
                        label={t('h_description')}
                        meta={meta}
                        disabled={loading.value}
                      />
                    )}
                  </Field>
                </div>
                <div className='col-span-1'>
                  <Field name='attachments'>
                    {() => (
                      <File
                        name='attachments'
                        onChange={handleAttachmentUpload}
                        value={files.value}
                        accept='image/*, video/*'
                        label='h_attachment'
                        area='trybook'
                        showFiles={true}
                        multiple={true}
                        disabled={loading.value}
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
