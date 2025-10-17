import { FunctionalComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { IaService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useTranslation } from 'react-i18next';
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

export const PlannerView: FunctionalComponent<{
  services: MentionOption[];
  users: MentionOption[];
}> = ({ services, users }) => {
  const currentPrompt = useSignal<string>('');
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const { t } = useTranslation();
  const handleShiftUpdate = useCallback((_: Shift) => {
    // console.log('Turno actualizado:', turnoActualizado);
  }, []);

  const handleSendPrompt = useCallback(async () => {
    if (!currentPrompt.value.trim()) return;

    setStreamingResponse('');
    setIsStreaming(true);
    let accumulatedResponse = '';
    try {
      await IaService.streamQuery(
        currentPrompt.value,
        (chunk) => {
          accumulatedResponse += chunk;
          setStreamingResponse(accumulatedResponse);
        },
        () => {
          const parsedShifts = fixTruncatedJSONArray(accumulatedResponse);
          setShifts(parsedShifts);
          setIsStreaming(false);
          ToastManager.success('f_stream_finish');
        },
        (_) => {
          setIsStreaming(false);
          // console.log('Stream error:', error);
          // TODO: Cambiar para que BaseService muestre el error
          //ToastManager.error(`Error en el stream: ${error.message}`);
        }
      );
    } catch (error) {
      setIsStreaming(false);
      ToastManager.error(
        `${t('s_error_send_prompt')} ${error instanceof Error ? error.message : t('s_error_unknown')}`
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
            {t('send')}
          </button>
        </div>
        <MentionEditor
          value={currentPrompt.value}
          onChange={(value) => {
            currentPrompt.value = value;
          }}
          groups={[
            { name: 'User', options: users },
            { name: 'Service', options: services },
          ]}
          placeholder={t('p_mention_placeholder')}
          className='min-h-[120px]'
        />
        {streamingResponse && (
          <div className='mt-4 p-4 bg-gray-50 rounded-md'>
            <div className='text-sm font-medium text-gray-700 mb-2'>
              {t('answer')}:
            </div>
            <div className='text-sm whitespace-pre-wrap'>
              {streamingResponse}
            </div>
          </div>
        )}
      </div>
      <div className='mt-8'>
        <ShiftsGanttViewer
          shifts={shifts}
          onShiftUpdate={handleShiftUpdate}
          userOptions={users}
          loading={isStreaming}
        />
      </div>
    </div>
  );
};
