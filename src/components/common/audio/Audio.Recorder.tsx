import { useState } from 'react';
import { Button } from '../button/button';
import { IPresignedRequest } from '@/types/file';
import { useSignal } from '@preact/signals';
import { DateUtils } from '@/utils/utilities/dates';
import ShowFiles from '@/components/common/file/show.file';
import { handleFileSaveWrapper } from '../file/utils/utils';
import { ToastManager } from '@/utils/toast/toast-manager';
import { AudioRecorderProps } from './utils/interface';

export const AudioRecorder = ({
  name,
  onChange,
  value = [],
  label,
  disabled,
  area,
  page,
}: AudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [resources, setResources] = useState<IPresignedRequest[]>(value);
  const chunks = useSignal<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.value.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks.value, { type: 'audio/m4a' });

        if (blob) {
          await handleFileSaveWrapper(
            blob,
            `${DateUtils.dateToBackend(new Date())}-audio.m4a`,
            'audio/m4a',
            emitChange,
            area as any
          );
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      ToastManager.error('No se pudo acceder al micrófono.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setRecording(false);
  };

  const handleRemoveAudio = (uuid: string) => {
    setResources((prev) => prev.filter((file) => file.uuid !== uuid));
  };

  const emitChange = (dataset: any, file: IPresignedRequest) => {
    setResources((prev) => [...prev, file]);
    let realDataset = dataset;

    if (dataset == null || dataset == undefined) {
      realDataset = { page };
    }

    onChange?.({
      target: {
        name: name,
        type: 'file',
        dataset: realDataset,
        value: [...value, file],
      },
    });
  };

  return (
    <div className='flex flex-col items-start gap-2 w-full'>
      {label && (
        <label className='capitalize block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200'>
          {label}
        </label>
      )}
      <Button
        name='btn-response-audio'
        type='button'
        className={`flex items-center gap-2 px-5 py-3 rounded-lg shadow-md text-white text-base font-semibold transition-all duration-200 ${recording ? 'bg-error hover:bg-error' : 'bg-primary hover:bg-primary-dark'} disabled:opacity-50`}
        onClick={recording ? stopRecording : startRecording}
        disabled={disabled || resources.length > 0}
        icon={`${recording ? '192' : '307'}`}
        label={recording ? 'Detener grabación' : 'Grabar audio'}
      />
      {resources.length > 0 && (
        <ShowFiles resources={resources} removeFile={handleRemoveAudio} />
      )}
    </div>
  );
};
