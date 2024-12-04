import { IaService } from '@/services';
import { IModelFile, IModelStatus } from '@/types/ia';
import { useSignal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { useEffect, useRef, useMemo } from 'preact/hooks';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from 'chart.js';
import { FileCard } from './components/file.card';
import { Button } from '@/components/common';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const IASettingPage: FunctionComponent = () => {
  const model_status = useSignal<IModelStatus>();
  const model_files = useSignal<IModelFile[]>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'IA Settings';
    get_config_model();
  }, []);

  const get_config_model = async () => {
    try {
      const [response_model, response_files] = await Promise.all([
        IaService.model_status(),
        IaService.model_files(),
      ]);

      if (response_model.getStatus()) {
        model_status.value = response_model.getOne();
      }

      if (response_files.getStatus()) {
        model_files.value = response_files.getMany();
      }
    } catch (error) {
      console.error('Error fetching model data:', error);
    }
  };

  const uploadFile = (e: Event) => {
    e.preventDefault();
    const files = fileInputRef.current?.files;
    if (files && files[0]) {
      console.log('File to upload:', files[0]);
    }
  };

  const create_model = async () => {
    console.log('CREATE MODEL');
  };

  const sync_model = async () => {
    const response = await IaService.model_sync();
    if (!response.getStatus()) return;
    console.log(response.getOne());
  };

  const chartData = useMemo(
    () => ({
      labels: model_status.value?.execution_history.map((h) =>
        dayjs(h.start_time).format('MM/DD/YYYY HH:mm')
      ),
      datasets: [
        {
          label: 'Execution Duration (milliseconds)',
          data: model_status.value?.execution_history.map((h) => {
            const start = dayjs(h.start_time);
            const end = dayjs(h.end_time);
            return end.diff(start, 'milliseconds');
          }),
          backgroundColor: model_status.value?.execution_history.map((h) =>
            h.status === 'success'
              ? 'rgba(75, 192, 92, 0.5)'
              : 'rgba(255, 99, 132, 0.5)'
          ),
          borderWidth: 1,
        },
      ],
    }),
    [model_status.value?.execution_history]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const history =
              model_status.value?.execution_history[context.dataIndex];
            return [
              `Items Processed: ${history?.item_count}`,
              `Failed Items: ${history?.failed_item_count}`,
            ];
          },
        },
      },
    },
  };

  if (!model_status.value) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='p-8 bg-white rounded-lg shadow-md text-center'>
          <h2 className='text-2xl font-bold mb-4'>
            Create AI Model Integration
          </h2>
          <p className='mb-6 text-gray-600'>
            No model configuration found. Let's create one!
          </p>
          <button
            onClick={create_model}
            className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
          >
            Create New Model
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className='container mx-auto p-4'>
      <div className='grid gap-6'>
        {/* Status Section */}
        <div className='border rounded-lg p-4'>
          <div className='w-full bg-red- flex-row flex justify-between'>
            <div className='w-11/12'>
              <h2 className='text-xl font-bold mb-4'>Model Status</h2>
              <p>
                Current Status:{' '}
                <span className='font-semibold'>
                  {model_status.value?.status}
                </span>
              </p>
            </div>
            <Button
              id='btn-sync-model'
              name='btn-sync-model'
              type='button'
              onClick={sync_model}
              icon='080'
            />
          </div>
          {/* Execution History Chart */}
          <div className='mt-4 h-64'>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* File Upload Section */}
        <div className='border rounded-lg p-4'>
          <h2 className='text-xl font-bold mb-4'>Upload New File</h2>
          <input
            type='file'
            ref={fileInputRef}
            className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
            onChange={uploadFile}
          />
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
