import { Signal, useSignal } from '@preact/signals';

import { Modal } from '@/components/common/modal/modal';

import { useTranslation } from 'react-i18next';
import { Field, Form } from 'react-final-form';
import { TextArea } from '@/components/common/text.area/text.area';
import { useMemo, useCallback } from 'preact/hooks';
import { Button } from '@/components/common/button/button';
import { File } from '@/components/common/file/file';
import { IPresignedRequest } from '@/types/file';
import { PqrsAiService } from '@/services/pqrs/ai-pqrs';
import { Loading } from '@/components/common/loading/loading';

interface IProps {
  showModal: Signal<boolean>;
  closeModal: () => void;
}

export const PqrsUpsert = ({ showModal, closeModal }: IProps) => {
  const { t } = useTranslation();

  const loading = useSignal<boolean>(false);
  const files = useSignal<IPresignedRequest[]>([]);

  const handleSubmit = async (model: any, _form: any) => {
    loading.value = true;

    let data = {
      information: model.description,
      files: files.value,
    };

    const response = await PqrsAiService.execute_ai_pqrs(data);
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
      <div className='flex justify-end items-center gap-2 p-4 bg-white dark:bg-b-dark-light border-t border-gray-border dark:border-b-dark-light rounded-b-xl'>
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
      width='w-11/12 max-w-5xl'
      position='fixed'
      header={
        <div className='flex items-center justify-between w-full gap-3'>
          <div>
            <h3 className='text-xl font-semibold text-t-light dark:text-white'>
              {t('h_pqrs_details')}
            </h3>
            <p className='text-sm text-gray-text-light dark:text-b-light-dark'>
              Comparte los detalles del caso y adjunta archivos antes de
              enviarlo a IA.
            </p>
          </div>
          {/*
          <div className='hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-primary-opacity text-primary text-xs font-medium border border-primary/40'>
            <span className='vox-icon vx-icon-201 text-base'></span>
            Redacción asistida
          </div>
          */}
        </div>
      }
      footer={footerContent}
    >
      <div className='px-4 py-6 flex flex-col w-full max-h-[80vh] overflow-y-auto vox-scroll-design bg-white dark:bg-b-dark'>
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
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 z-50 bg-b-light dark:bg-b-dark-light p-4 rounded-xl border border-gray-border dark:border-b-dark-light shadow-sm'>
                <div className='lg:col-span-2 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-semibold text-t-light dark:text-white'>
                      Descripción del caso
                    </p>
                    <span className='text-[11px] text-gray-text-light dark:text-b-light-dark bg-white/80 dark:bg-b-dark px-2 py-1 rounded-full border border-gray-border/60'>
                      Sé específico y conciso
                    </span>
                  </div>
                  <Field<string> name='description'>
                    {({ input, meta }) => (
                      <TextArea
                        {...input}
                        type='text'
                        // placeholder={t('h_description')}
                        label={t('h_description')}
                        meta={meta}
                        disabled={loading.value}
                        rows={12}
                        className='bg-white dark:bg-b-dark text-t-light dark:text-white resize-none'
                      />
                    )}
                  </Field>
                </div>
                <div className='lg:col-span-1 space-y-3'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-t-light dark:text-white'>
                    <span className='vox-icon vx-icon-284 text-primary'></span>
                    Adjuntos
                  </div>
                  <p className='text-xs text-gray-text-light dark:text-b-light-dark'>
                    Agrega capturas, videos o documentos que ayuden a
                    contextualizar la solicitud.
                  </p>
                  <div className='rounded-lg border border-dashed border-gray-border dark:border-b-dark-light p-3 bg-white dark:bg-b-dark shadow-inner h-72'>
                    <Field name='attachments'>
                      {() => (
                        <File
                          name='attachments'
                          onChange={handleAttachmentUpload}
                          value={files.value}
                          accept='image/*, video/*, application/pdf'
                          // label='h_attachment'
                          area='trybook'
                          showFiles={true}
                          multiple={true}
                          disabled={loading.value}
                          service='ai_pqrs'
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                {[
                  'Claridad en el asunto',
                  'Datos de contacto',
                  'Tiempo transcurrido',
                  'Impacto en el cliente',
                ].map((tip) => (
                  <div
                    key={tip}
                    className='flex items-center gap-2 p-3 rounded-lg bg-b-light dark:bg-b-dark-light border border-gray-border dark:border-b-dark-light text-xs text-gray-text-light dark:text-b-light-dark'
                  >
                    <span className='w-6 h-6 rounded-full bg-primary-opacity text-primary flex items-center justify-center text-xs font-semibold'>
                      ✓
                    </span>
                    <span className='leading-snug'>{tip}</span>
                  </div>
                ))}
              </div>
            </form>
          )}
        />
      </div>
    </Modal>
  );
};
