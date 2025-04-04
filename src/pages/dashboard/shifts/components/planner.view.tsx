import { FunctionalComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { IaService } from '@/services';
import { toast } from 'react-toastify';
import {
  MentionEditor,
  MentionOption,
} from '@/components/common/mention-editor';
import {
  ShiftsGanttViewer,
  Shift,
} from '@/components/common/shift-viewer/shift.viewer';
import { fixTruncatedJSONArray } from '@/components/common/mention-editor/utils';
// import turnos from '@/components/common/shift-viewer/turnos_semanales.json';

export const PlannerView: FunctionalComponent = () => {
  const currentPrompt = useSignal<string>('');
  //const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const userOptions: MentionOption[] = [
    {
      value: 1,
      label: 'John Doe',
      groupName: 'Usuarios',
    },
    {
      value: 2,
      label: 'Jane Smith',
      groupName: 'Usuarios',
    },
  ];

  const serviceOptions: MentionOption[] = [
    {
      value: 1,
      label: 'Servicio A',
      groupName: 'Servicios',
    },
    {
      value: 2,
      label: 'Servicio B',
      groupName: 'Servicios',
    },
  ];

  const handleShiftUpdate = useCallback((turnoActualizado: Shift) => {
    console.log('Turno actualizado:', turnoActualizado);
  }, []);

  const handleSendPrompt = useCallback(async () => {
    if (!currentPrompt.value.trim()) return;

    // setStreamingResponse('');
    setIsStreaming(true);
    let accumulatedResponse = '';
    try {
      await IaService.streamQuery(
        currentPrompt.value,
        (chunk) => {
          accumulatedResponse += chunk;
          // setStreamingResponse(accumulatedResponse);
        },
        () => {
          const parsedShifts = fixTruncatedJSONArray(accumulatedResponse);
          setShifts(parsedShifts);
          setIsStreaming(false);
          toast.success('Stream completado');
        },
        (error) => {
          setIsStreaming(false);
          toast.error(`Error en el stream: ${error.message}`);
        }
      );
    } catch (error) {
      setIsStreaming(false);
      toast.error(
        `Error al enviar el prompt: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }, [currentPrompt.value]);

  return (
    <div className='px-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-end'>
          <button
            onClick={handleSendPrompt}
            disabled={!currentPrompt.value.trim() || isStreaming}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            Enviar
          </button>
        </div>
        <MentionEditor
          value={currentPrompt.value}
          onChange={(value) => {
            currentPrompt.value = value;
          }}
          groups={[
            {
              name: 'User',
              options: userOptions,
            },
            {
              name: 'Service',
              options: serviceOptions,
            },
          ]}
          placeholder='Escribe @ para mencionar a alguien en el turno...'
          className='min-h-[120px]'
        />
        {/*
        {streamingResponse && (
          <div className='mt-4 p-4 bg-gray-50 rounded-md'>
            <div className='text-sm font-medium text-gray-700 mb-2'>
              Respuesta:
            </div>
            <div className='text-sm whitespace-pre-wrap'>
              {streamingResponse}
            </div>
          </div>
        )}
      */}
      </div>
      <div className='mt-8'>
        <ShiftsGanttViewer
          shifts={shifts}
          onShiftUpdate={handleShiftUpdate}
          userOptions={userOptions}
          loading={isStreaming}
        />
      </div>
    </div>
  );
};
