import { useCallback, useState, useMemo, useEffect } from 'preact/hooks';
import { FileControlProps } from './interface';
import { Button } from '../button/button';
import { IOptionCheck, SelectCheck } from '../select-check';
import { useSignal } from '@preact/signals';
import { Form, Field } from 'react-final-form';
import { ShiftService } from '@/services/shift/shift';
import { ToastManager } from '@/utils/toast/toast-manager';
import { UserService } from '@/services/general/user';
import { TenantService } from '@/services/general/tenant';
import { useTranslation } from 'react-i18next';

export enum FileControlType {
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
}

const MODAL_STYLES =
  'absolute right-0 top-full mt-2 w-[800px] min-h-[200px] max-w-[90vw] shadow-lg rounded-md modal-shadow p-0 bg-white dark:bg-b-dark-dark text-t-light dark:text-t-dark border border-gray-200 dark:border-gray-700 z-40 animate-fade-in';

const HEADER_STYLES =
  'flex flex-row w-full items-center pt-2 p-3 border-b-2 border-b-b-light-light dark:border-b-dark-light bg-white dark:bg-b-dark-dark';

const CONTENT_STYLES = 'flex flex-row bg-white dark:bg-b-dark-dark';

const FOOTER_STYLES =
  'flex flex-row w-full justify-end gap-2 bg-white dark:bg-b-dark-dark';

export const FileControl = ({ fileName }: FileControlProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const loading = useSignal(false);
  const checkListSelected = useSignal<FileControlType | null>(null);
  const uploads = useSignal<any[]>([]);

  const FILE_OPTIONS: IOptionCheck[] = useMemo(
    () => [
      {
        value: FileControlType.UPLOAD,
        label: t('file_upload'),
        icon: '187',
        color: 'primary',
        disabled: false,
      },
      {
        value: FileControlType.DOWNLOAD,
        label: t('file_download'),
        icon: '057',
        color: 'secondary',
        disabled: false,
      },
    ],
    [t]
  );

  // Force re-render when language changes
  useEffect(() => {}, [t]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    loading.value = false;
    checkListSelected.value = null;
    setSelectedFile(null);
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      ToastManager.error(t('file_invalidFileType'));
      return false;
    }

    if (file.size > maxSize) {
      ToastManager.error(t('file_fileTooLarge'));
      return false;
    }

    return true;
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file && validateFile(file)) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
    },
    [validateFile]
  );

  const handleUploadFile = useCallback(async () => {
    if (!selectedFile) {
      ToastManager.error(t('file_noFileSelected'));
      return;
    }

    loading.value = true;

    const response = await TenantService.uploadFile(selectedFile, fileName);

    if (!response) {
      ToastManager.error(t('file_uploadError'));
      return;
    }

    if (response.getStatus() && response.getOne()) {
      ToastManager.success(t('file_uploadSuccess'));
      onClose();
      getUploads();
    }

    loading.value = false;
  }, [selectedFile, fileName, onClose, t]);

  const handleDownloadFile = useCallback(async () => {
    loading.value = true;

    try {
      let response;
      if (fileName === 'shift') {
        response = await ShiftService.downloadFile();
      } else if (fileName === 'employee') {
        response = await UserService.downloadFile();
      }

      if (!response) return ToastManager.error(t('file_downloadError'));
      if (response.getStatus() && response.getOne()) {
        const result = response.getOne();

        if (result.success && result.data) {
          const byteCharacters = atob(result.data.buffer);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type:
              result.data.mimeType ||
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = result.data.filename || 'data_export.xlsx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      } else {
        console.error('Error downloading file:', response.getStatus());
      }
    } catch (error) {
      console.error('Error in download operation:', error);
    } finally {
      loading.value = false;
      setIsOpen(false);
      checkListSelected.value = null;
    }
  }, [t]);

  const handleOptionSelect = useCallback(
    (option: any) => {
      checkListSelected.value = option.value as FileControlType;

      if (option.value === FileControlType.DOWNLOAD) {
        handleDownloadFile();
      } else if (option.value === FileControlType.UPLOAD) {
      }
    },
    [handleDownloadFile]
  );

  const getUploads = async () => {
    const response = await TenantService.get_uploads(fileName);
    if (response.getStatus()) {
      uploads.value = response.getMany();
    }
  };

  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
    getUploads();
    checkListSelected.value = null;
  }, []);

  const footerContent = useMemo(
    () => (
      <div className='flex justify-between items-center gap-2 p-4'>
        {checkListSelected.value === FileControlType.UPLOAD && (
          <Button
            name='btn-file-control-back'
            label={t('file_back')}
            type='button'
            onClick={() => {
              checkListSelected.value = null;
              setSelectedFile(null);
            }}
            icon='041'
            disabled={loading.value}
            transparent
          />
        )}

        <div className='flex gap-2 ml-auto'>
          {checkListSelected.value === FileControlType.UPLOAD &&
            selectedFile && (
              <Button
                name='btn-file-control-upload'
                label={t('file_uploadFile')}
                type='button'
                onClick={handleUploadFile}
                icon='070'
                disabled={loading.value || !selectedFile}
                loading={loading.value}
              />
            )}

          <Button
            name='btn-file-control-cancel'
            label={t('file_cancel')}
            type='button'
            onClick={onClose}
            icon='192'
            disabled={loading.value}
            transparent
          />
        </div>
      </div>
    ),
    [
      onClose,
      loading.value,
      checkListSelected.value,
      selectedFile,
      handleUploadFile,
      t,
    ]
  );

  const modalContent = useMemo(
    () => (
      <Form
        onSubmit={() => {}}
        initialValues={{}}
        render={() => (
          <div className='space-y-6'>
            {checkListSelected.value === null && (
              <Field<string> name='typeCheck'>
                {({ input }) => (
                  <SelectCheck
                    {...input}
                    options={FILE_OPTIONS}
                    loading={loading.value}
                    onChange={(option: any) => {
                      input.onChange(option.value);
                      handleOptionSelect(option);
                    }}
                    size='md'
                  />
                )}
              </Field>
            )}

            {checkListSelected.value === FileControlType.UPLOAD && (
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t('file_selectFile')}
                  </label>
                  <input
                    type='file'
                    accept='.xlsx,.xls,.csv'
                    onChange={handleFileChange}
                    className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300'
                    disabled={loading.value}
                  />
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    {t('file_fileFormats')}
                  </p>
                </div>

                {selectedFile && (
                  <div className='p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0'>
                        <span className='text-green-400 text-sm'>📄</span>
                      </div>
                      <div className='ml-3'>
                        <p className='text-sm font-medium text-green-800 dark:text-green-200'>
                          {selectedFile.name}
                        </p>
                        <p className='text-xs text-green-600 dark:text-green-400'>
                          {(selectedFile.size / 1024 / 1024).toFixed(2)}{' '}
                          {t('file_fileSize')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      />
    ),
    [
      checkListSelected.value,
      loading.value,
      handleOptionSelect,
      handleFileChange,
      selectedFile,
      t,
    ]
  );

  return (
    <div className='relative flex items-center'>
      <div className='flex flex-row justify-between items-center'>
        <div className='h-6 w-px bg-b-light-dark dark:bg-gray-700 mx-2' />
        <Button
          name='group-file-control'
          onClick={handleOpenModal}
          icon='065'
          square
          transparent
          borderless
        />
      </div>
      {isOpen && (
        <div className={MODAL_STYLES}>
          {/* Header */}
          <div className={HEADER_STYLES}>
            <div className='flex flex-row w-full items-center px-2.5'>
              <div className='flex flex-row w-full items-center'>
                <h3>{t('file_modalTitle')}</h3>
              </div>
              <div className='flex items-center justify-end gap-2'>
                <Button
                  id='btn-close'
                  name='btn-close'
                  onClick={onClose}
                  type='button'
                  rounded
                  icon='192'
                  transparent
                  borderless
                />
              </div>
            </div>
          </div>
          {/* Content */}
          <div className={CONTENT_STYLES}>
            <div className='px-4 py-6 flex flex-col w-full h-full'>
              {modalContent}
            </div>
          </div>
          {/* Footer */}
          <div className={FOOTER_STYLES}>{footerContent}</div>
          {uploads.value.length > 0 && (
            <div className='border-t border-gray-200 dark:border-gray-700 p-4'>
              <h4 className='text-sm font-medium mb-2'>
                {t('file_recentUploads')}
              </h4>
              <div className='space-y-2'>
                {uploads.value.map((upload) => (
                  <div
                    key={upload.id}
                    className='flex flex-row items-center justify-between'
                  >
                    <div>{upload.originalName}</div>
                    <div className='text-xs text-gray-500'>
                      {upload.created_at}
                    </div>
                    <div className='text-xs text-gray-500'>{upload.status}</div>
                    <div className='text-xs text-gray-500'>
                      {upload.processedRecords || 0} /{' '}
                      {upload.totalRecords || 0}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {upload.errorMessage || 'No error'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
