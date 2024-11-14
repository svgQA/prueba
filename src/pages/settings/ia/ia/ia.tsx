import { type FunctionComponent } from 'preact';
import { useEffect, useRef, useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { memo } from 'preact/compat';
import { IaService } from '@/services';
import shortUUID from 'short-uuid';

interface TenantResponse {
  answer: string;
  status: boolean;
}

const SelectInput = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      className='w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200'
    >
      <option value='tenant1'>Tenant 1 (Journey)</option>
      <option value='tenant2'>Tenant 2 (Recipes)</option>
    </select>
  )
);

const TextInput = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <input
      type='text'
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-200'
      placeholder='Ingrese información del tenant'
    />
  )
);

export const IASettingPage: FunctionComponent = () => {
  const tenantResponse = useSignal<TenantResponse | null>(null);
  const displayText = useSignal('');
  const inputValue = useSignal('');
  const selectedTenant = useSignal('tenant1');
  const isTyping = useSignal(false);
  const typeTimeout = useRef<NodeJS.Timeout>();
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'IA Settings';
  }, []);

  useEffect(() => {
    if (tenantResponse.value?.answer && !isTyping.value) {
      isTyping.value = true;
      displayText.value = '';

      const answer = tenantResponse.value.answer;
      let currentIndex = 0;
      const textChunks = answer.split('');

      const typeChar = () => {
        if (currentIndex < textChunks.length) {
          displayText.value = displayText.value + textChunks[currentIndex];
          currentIndex++;
          typeTimeout.current = setTimeout(typeChar, 20);
        } else {
          isTyping.value = false;
        }
      };

      typeChar();

      return () => {
        if (typeTimeout.current) {
          clearTimeout(typeTimeout.current);
        }
      };
    }
  }, [tenantResponse.value]);

  const createTenant = useCallback(async () => {
    const response = await IaService.question({
      tenant: selectedTenant.value,
      question: inputValue.value,
    });
    if (!response.getStatus()) return;
    const value = response.getOne();
    tenantResponse.value = value;
  }, [selectedTenant.value, inputValue.value]);

  const handleCreateNewTenant = useCallback(async () => {
    const newTenantId = shortUUID.generate();
    await IaService.create_tenant(newTenantId);
  }, []);

  const handleFileUpload = useCallback(
    async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (!target.files?.length) return;

      const file = target.files[0];
      const formData = new FormData();
      formData.append('document', file);
      formData.append('tenant', selectedTenant.value);

      try {
        await IaService.document(formData);
        alert('Document uploaded successfully!');
      } catch (error) {
        alert('Error uploading document');
      }
    },
    [selectedTenant.value]
  );

  return (
    <section className='mt-4'>
      <div className='mb-4'>
        <SelectInput
          value={selectedTenant.value}
          onChange={(value) => (selectedTenant.value = value)}
        />
        <TextInput
          value={inputValue.value}
          onChange={(value) => (inputValue.value = value)}
        />
        <div className='mb-4'>
          <input
            type='file'
            ref={fileInput}
            onChange={handleFileUpload}
            className='hidden'
            accept='.pdf,.doc,.docx,.txt'
          />
          <button
            onClick={() => fileInput.current?.click()}
            className='w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              />
            </svg>
            Upload Document
          </button>
        </div>
      </div>
      <div className='flex gap-4'>
        <button
          className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105'
          onClick={createTenant}
        >
          Make question
        </button>
        <button
          className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105'
          onClick={handleCreateNewTenant}
        >
          Create New Tenant
        </button>
      </div>
      {tenantResponse.value && (
        <div className='mt-4 text-xl'>
          <p className='whitespace-pre-wrap'>{displayText.value}</p>
        </div>
      )}
    </section>
  );
};
