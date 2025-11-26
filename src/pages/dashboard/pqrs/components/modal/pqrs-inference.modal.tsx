import { Signal } from '@preact/signals';
import { ICPqrsRequest } from '../../utils/interface';

export interface IProps {
  pqrs: Signal<ICPqrsRequest | null>;
}

interface Inference {
  id: number;
  createdAt: string;
  stage: {
    id: number;
    stageName: string;
    goal: string;
  };
  inference: any;
  createdBy: {
    id: number;
    name: string;
  };
}

const InferenceCard = ({ inference }: { inference: Inference }) => {
  const renderInferenceContent = () => {
    const data = inference.inference;

    if (data.title && data.summary) {
      return (
        <div class='space-y-3'>
          <div class='p-3 bg-indigo-50 rounded-lg'>
            <h5 class='font-semibold text-indigo-900 text-sm mb-1'>
              {data.title}
            </h5>
            {data.subtitle && (
              <p class='text-xs text-indigo-700 mb-2'>{data.subtitle}</p>
            )}
            <p class='text-sm text-indigo-800'>{data.summary}</p>
          </div>
          {data.description && (
            <div class='p-3 bg-gray-50 rounded-lg'>
              <p class='text-xs text-gray-700 leading-relaxed'>
                {data.description}
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div class='space-y-3'>
        {data.tipo && (
          <div class='flex items-center gap-2'>
            <span class='text-xs font-medium text-gray-500'>Tipo:</span>
            <span class='px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded capitalize'>
              {data.tipo}
            </span>
          </div>
        )}

        {data.clasificacion && (
          <div class='flex items-center gap-2'>
            <span class='text-xs font-medium text-gray-500'>
              Clasificación:
            </span>
            <span class='px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded capitalize'>
              {data.clasificacion}
            </span>
          </div>
        )}

        {data.prioridad && (
          <div class='flex items-center gap-2'>
            <span class='text-xs font-medium text-gray-500'>Prioridad:</span>
            <span
              class={`px-2 py-1 text-xs font-medium rounded capitalize ${
                data.prioridad === 'alta'
                  ? 'bg-red-100 text-red-800'
                  : data.prioridad === 'media'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}
            >
              {data.prioridad}
            </span>
          </div>
        )}

        {(data.area || data.subarea) && (
          <div class='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {data.area && (
              <div>
                <span class='text-xs font-medium text-gray-500 block mb-1'>
                  Área:
                </span>
                <span class='text-sm text-gray-900 capitalize'>
                  {data.area.replace(/_/g, ' ')}
                </span>
              </div>
            )}
            {data.subarea && (
              <div>
                <span class='text-xs font-medium text-gray-500 block mb-1'>
                  Subárea:
                </span>
                <span class='text-sm text-gray-900 capitalize'>
                  {data.subarea.replace(/_/g, ' ')}
                </span>
              </div>
            )}
          </div>
        )}

        {data.routing_queue && (
          <div class='p-2 bg-cyan-50 rounded'>
            <span class='text-xs font-medium text-cyan-700'>
              📍 Cola: <span class='font-mono'>{data.routing_queue}</span>
            </span>
          </div>
        )}

        {data.razones && data.razones.length > 0 && (
          <div class='p-3 bg-blue-50 rounded-lg'>
            <label class='block text-xs font-medium text-blue-800 mb-2'>
              Razones del Análisis
            </label>
            <ul class='text-sm text-blue-900 space-y-1'>
              {data.razones.map((razon: string, idx: number) => (
                <li key={idx} class='flex items-start'>
                  <span class='text-blue-600 mr-2 mt-1'>•</span>
                  <span>{razon}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.etiquetas && data.etiquetas.length > 0 && (
          <div>
            <label class='block text-xs font-medium text-gray-500 mb-2'>
              Etiquetas
            </label>
            <div class='flex flex-wrap gap-2'>
              {data.etiquetas.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  class='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.banderas && Object.keys(data.banderas).length > 0 && (
          <div class='p-3 bg-orange-50 rounded-lg'>
            <label class='block text-xs font-medium text-orange-800 mb-2'>
              Banderas de Alerta
            </label>
            <div class='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
              {Object.entries(data.banderas).map(
                ([key, value]: [string, any]) => (
                  <div key={key} class='flex items-center gap-2'>
                    <span class={value ? 'text-red-600' : 'text-green-600'}>
                      {value ? '⚠️' : '✓'}
                    </span>
                    <span class='text-gray-700 capitalize'>
                      {key.replace(/_/g, ' ')}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {data.confidence !== undefined && (
          <div class='flex items-center gap-2'>
            <span class='text-xs font-medium text-gray-500'>Confianza:</span>
            <div class='flex-1 bg-gray-200 rounded-full h-2'>
              <div
                class={`h-2 rounded-full ${
                  data.confidence >= 0.8
                    ? 'bg-green-500'
                    : data.confidence >= 0.6
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${data.confidence * 100}%` }}
              />
            </div>
            <span class='text-xs font-medium text-gray-700'>
              {(data.confidence * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div class='border border-gray-200 dark:border-b-dark-light rounded-lg p-4 hover:shadow-lg transition-shadow bg-white dark:bg-b-dark'>
      <div class='flex items-start justify-between mb-3'>
        <div class='flex-1'>
          <h4 class='font-semibold text-gray-900 dark:text-white text-sm mb-1'>
            {inference.stage.stageName}
          </h4>
          <p class='text-xs text-gray-500 dark:text-b-light-dark leading-relaxed'>
            {inference.stage.goal}
          </p>
        </div>
        <span class='text-xs text-gray-400 dark:text-b-light-dark ml-2 whitespace-nowrap'>
          {new Date(inference.createdAt).toLocaleDateString()}
        </span>
      </div>

      {renderInferenceContent()}
    </div>
  );
};

const PqrsInferenceModal = ({ pqrs }: IProps) => {
  const inferences = (pqrs.value as any)?.inferences || [];

  return (
    <div>
      {inferences.length > 0 ? (
        <div class='space-y-4'>
          <div class='flex items-center justify-between mb-2'>
            <h4 class='font-semibold text-t-light dark:text-white text-sm uppercase tracking-wide'>
              Análisis de IA
            </h4>
            <span class='text-xs text-gray-500 dark:text-b-light-dark'>
              {inferences.length} análisis realizados
            </span>
          </div>

          {inferences.map((inference: Inference) => (
            <InferenceCard key={inference.id} inference={inference} />
          ))}
        </div>
      ) : (
        <div class='text-center py-10 bg-b-light dark:bg-b-dark rounded-lg border border-dashed border-gray-border dark:border-b-dark-light'>
          <svg
            class='w-12 h-12 text-gray-300 dark:text-b-light-dark mx-auto mb-3'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <p class='text-sm text-gray-500 dark:text-b-light-dark'>No hay análisis de IA disponible</p>
        </div>
      )}
    </div>
  );
};

export default PqrsInferenceModal;
