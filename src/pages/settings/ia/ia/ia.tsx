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
