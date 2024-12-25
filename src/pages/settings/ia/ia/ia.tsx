import { Button } from '@/components/common/button/button';
import { IaService } from '@/services';
import { IModelFile, IModelStatus, ITenantModelStatus } from '@/types/ia';
import { useSignal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { HistoryCard } from './components/history.card';
import { Input } from '@/components/common/input/input';
import { FileCard } from './components/file.card';

export const IASettingPage: FunctionComponent = () => {
  const model_status = useSignal<IModelStatus | null>(null);
  const model_files = useSignal<IModelFile[]>();
  const tenant_status = useSignal<ITenantModelStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFileName = useSignal<string>('');
  const uploadStatus = useSignal<'idle' | 'uploading' | 'success' | 'error'>(
    'idle'
  );
  const testMessage = useSignal<string>('');
  const testResponse = useSignal<string>('');

  useEffect(() => {
    document.title = 'IA Settings';
    get_config_model();
  }, []);

  const get_config_model = async () => {
    try {
      const [response_model, response_files /*, response_tenant_status*/] =
        await Promise.all([
          IaService.model_status(),
          IaService.model_files(),
          // IaService.tenant_status(),
        ]);

      if (response_model.getStatus()) {
        model_status.value = response_model.getOne();
      }

      if (response_files.getStatus()) {
        model_files.value = response_files.getMany();
      }

      // if (response_tenant_status.getStatus()) {
      //   tenant_status.value = response_tenant_status.getOne();
      // }
    } catch (error) {
      console.error('Error fetching model data:', error);
    }
  };

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.[0]) {
      selectedFileName.value = fileInputRef.current.files[0].name;
      uploadStatus.value = 'idle';
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return;
    uploadStatus.value = 'uploading';
    const response = await IaService.upload_file(fileInputRef.current.files[0]);
    if (!response.getStatus()) {
      uploadStatus.value = 'error';
    } else {
      uploadStatus.value = 'success';
      fileInputRef.current.value = '';
      selectedFileName.value = '';
      get_config_model();
    }
  };

  const create_model = async () => {
    const response = await IaService.create_model();
    if (!response.getStatus()) return;
    get_config_model();
  };

  const sync_model = async () => {
    const response = await IaService.model_sync();
    if (!response.getStatus()) return;
    model_status.value = response.getOne();
  };

  const makeRequest = async () => {
    const response = await IaService.make_query({
      question: testMessage.value,
    });
    if (!response.getStatus()) testResponse.value = 'error.';
    else testResponse.value = response.getOne().answer;
  };

  return (
    <section className='container mx-auto p-4'>
      <div className='grid gap-6'>
        {/* Status Section */}
        {tenant_status.value}
        <div className='border rounded-lg p-4 dark:border-b-dark-light border-b-light-dark'>
          <div className='bg-red- flex-row flex justify-between'>
            <div className='w-10/12'>
              <h2 className='text-xl font-bold mb-4'>Model Status</h2>
              <p>
                Current Status:{' '}
                <span className='font-semibold'>
                  {model_status.value?.status || 'Inactive'}
                </span>
              </p>
            </div>
            <div className='w-2/12 flex flex-row justify-end items-center'>
              {!model_status.value && (
                <Button
                  id='btn-sync-model'
                  name='btn-sync-model'
                  type='button'
                  onClick={create_model}
                  icon='128'
                />
              )}
              <Button
                id='btn-sync-model'
                name='btn-sync-model'
                type='button'
                onClick={sync_model}
                icon='127'
              />
            </div>
          </div>

          {/* Execution History List */}
          {model_status.value?.execution_history && (
            <div className='mt-4'>
              <h3 className='text-lg font-semibold mb-2'>Execution History</h3>
              <div className='space-y-2 max-h-64 overflow-y-auto'>
                {model_status.value.execution_history.map((history, index) => (
                  <HistoryCard key={index} history={history} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Test Section */}
        {model_status.value?.status === 'running' && (
          <div className='border rounded-lg p-6 dark:border-b-dark-light border-b-light-dark shadow-sm'>
            <div className='max-w-2xl mx-auto space-y-4'>
              {testResponse.value && (
                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-700 mb-4'>
                  <p className='text-gray-800 dark:text-gray-200'>
                    {testResponse.value}
                  </p>
                </div>
              )}
              <div className='flex gap-2 justify-center fler-row items-center'>
                <Input
                  name='in-ia-test-model'
                  id='in-ia-test-model'
                  type='text'
                  placeholder='Enter your test message...'
                  icon='231'
                  value={testMessage.value}
                  onChange={(e) =>
                    (testMessage.value = (e.target as HTMLInputElement).value)
                  }
                />
                <Button
                  id='test-message'
                  name='test-message'
                  onClick={makeRequest}
                  type='button'
                  label='Send'
                />
              </div>
            </div>
          </div>
        )}

        {/* File Upload Section */}
        <div className='border rounded-lg p-4 dark:border-b-dark-light border-b-light-dark'>
          <h2 className='text-xl font-bold mb-6'>Upload New File</h2>
          <div className='flex flex-col items-center space-y-4'>
            <label className='w-full max-w-md flex flex-col items-center px-4 py-6 rounded-lg border-2 border-dashed cursor-pointer dark:hover:bg-b-dark-light hover:bg-b-light-dark transition-colors border-b-light-dark dark:border-b-dark-light'>
              <span className='vox-icon vx-icon-052' />
              <span className='mt-2 text-sm'>
                {selectedFileName.value || 'Select a file'}
              </span>
              <input
                type='file'
                className='hidden'
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={
                  !model_status.value || uploadStatus.value === 'uploading'
                }
                onClick={(e) => (e.currentTarget.value = '')}
              />
            </label>
            <Button
              id='upload-ia-file'
              name='upload-ia-file'
              onClick={handleUpload}
              disabled={
                !model_status.value || uploadStatus.value === 'uploading'
              }
              type='button'
              label={
                uploadStatus.value === 'uploading'
                  ? 'Uploading...'
                  : 'Upload File'
              }
            />
            {uploadStatus.value === 'error' && (
              <p className='text-error text-sm'>
                Upload failed. Please try again.
              </p>
            )}
            {uploadStatus.value === 'success' && (
              <p className='text-green-500 text-sm'>
                File uploaded successfully!
              </p>
            )}
          </div>
        </div>

        {/* Files Grid */}
        <div className='flex flex-row flex-wrap justify-center gap-2'>
          {model_files.value?.map((file) => (
            <FileCard file={file} key={file.id} />
          ))}
        </div>
      </div>
    </section>
  );
};
