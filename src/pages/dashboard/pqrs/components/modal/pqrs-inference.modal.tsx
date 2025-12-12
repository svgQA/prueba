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
          <p class='text-sm text-gray-500 dark:text-b-light-dark'>
            No hay análisis de IA disponible
          </p>
        </div>
      )}
    </div>
  );
};

const InferenceCard = ({ inference }: { inference: Inference }) => {
  const data = inference.inference;

  return (
    <div class='border border-gray-200 dark:border-b-dark-light rounded-lg p-4 hover:shadow-lg transition-shadow bg-white dark:bg-b-dark'>
      {!(data.title || data.subtitle || data.description) && (
        <div class='flex items-start justify-between mb-3'>
          <div class='flex-1'>
            <h4 class='font-semibold text-gray-900 dark:text-white text-sm mb-1'>
              {inference.stage.stageName}
            </h4>
            <p class='text-xs text-gray-500 dark:text-b-light-dark leading-relaxed'>
              Goal: {inference.stage.goal}
            </p>
          </div>
          <span class='text-xs text-gray-400 dark:text-b-light-dark ml-2 whitespace-nowrap'>
            {new Date(inference.createdAt).toLocaleDateString()}
          </span>
        </div>
      )}
      <div class='space-y-3'>
        {/* Main content section - title, subtitle, description */}
        {(data.title || data.subtitle || data.description) && (
          <div class='space-y-2'>
            {data.title && (
              <div class='p-3 bg-indigo-50 rounded-lg'>
                <h5 class='font-semibold text-indigo-900 text-sm mb-1'>
                  {data.title}
                </h5>
                {data.subtitle && (
                  <p class='text-xs text-indigo-700'>{data.subtitle}</p>
                )}
              </div>
            )}
            {data.description && (
              <div class='p-3 bg-gray-50 rounded-lg'>
                <p class='text-xs text-gray-700 leading-relaxed whitespace-pre-line'>
                  {data.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analysis Request & Response */}
        {(data.analysisRequest || data.analysisResponse) && (
          <div class='space-y-2'>
            {data.analysisRequest && (
              <div class='p-2 bg-blue-50 rounded'>
                <span class='text-xs font-medium text-blue-700 block mb-1'>
                  Análisis Realizado:
                </span>
                <p class='text-xs text-blue-900'>
                  {typeof data.analysisRequest === 'string'
                    ? data.analysisRequest
                    : JSON.stringify(data.analysisRequest, null, 2)}
                </p>
              </div>
            )}
            {data.analysisResponse && (
              <div class='p-2 bg-green-50 rounded'>
                <span class='text-xs font-medium text-green-700 block mb-1'>
                  Resultado del Análisis:
                </span>
                <pre class='text-xs text-green-900 leading-relaxed whitespace-pre-wrap overflow-x-auto'>
                  {typeof data.analysisResponse === 'string'
                    ? data.analysisResponse
                    : JSON.stringify(data.analysisResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Legacy tipo/clasificacion fields */}
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

        {/* Priority (prioridad or priority) */}
        {(data.prioridad || data.priority) && (
          <div class='flex items-center gap-2'>
            <span class='text-xs font-medium text-gray-500'>Prioridad:</span>
            <span
              class={`px-2 py-1 text-xs font-medium rounded capitalize ${
                (data.prioridad || data.priority) === 'alta'
                  ? 'bg-red-100 text-red-800'
                  : (data.prioridad || data.priority) === 'media'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}
            >
              {data.prioridad || data.priority}
            </span>
          </div>
        )}

        {/* Severity */}
        {data.severity && (
          <div class='flex items-center gap-2'>
            <span class='text-xs font-medium text-gray-500'>Severidad:</span>
            <span
              class={`px-2 py-1 text-xs font-medium rounded capitalize ${
                data.severity === 'alto' || data.severity === 'alta'
                  ? 'bg-red-100 text-red-800'
                  : data.severity === 'medio' || data.severity === 'media'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}
            >
              {data.severity}
            </span>
          </div>
        )}

        {/* Reasons */}
        {data.reasons && (
          <div class='p-2 bg-amber-50 rounded'>
            <span class='text-xs font-medium text-amber-700 block mb-1'>
              Razones:
            </span>
            <p class='text-xs text-amber-900'>{data.reasons}</p>
          </div>
        )}

        {/* {(data.area || data.subarea) && (
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
        )} */}

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

        {/* Banderas - handle different formats */}
        {(data.banderas ||
          data.riesgo_vida !== undefined ||
          data.multicliente !== undefined) && (
          <div class='p-3 bg-orange-50 rounded-lg'>
            <label class='block text-xs font-medium text-orange-800 mb-2'>
              Banderas de Alerta
            </label>
            <div class='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
              {data.banderas &&
                Object.entries(data.banderas).map(
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
              {!data.banderas && (
                <>
                  {data.riesgo_vida !== undefined && (
                    <div class='flex items-center gap-2'>
                      <span
                        class={
                          data.riesgo_vida ? 'text-red-600' : 'text-green-600'
                        }
                      >
                        {data.riesgo_vida ? '⚠️' : '✓'}
                      </span>
                      <span class='text-gray-700'>riesgo vida</span>
                    </div>
                  )}
                  {data.multicliente !== undefined && (
                    <div class='flex items-center gap-2'>
                      <span
                        class={
                          data.multicliente ? 'text-red-600' : 'text-green-600'
                        }
                      >
                        {data.multicliente ? '⚠️' : '✓'}
                      </span>
                      <span class='text-gray-700'>multicliente</span>
                    </div>
                  )}
                  {data.falta_ubicacion !== undefined && (
                    <div class='flex items-center gap-2'>
                      <span
                        class={
                          data.falta_ubicacion
                            ? 'text-red-600'
                            : 'text-green-600'
                        }
                      >
                        {data.falta_ubicacion ? '⚠️' : '✓'}
                      </span>
                      <span class='text-gray-700'>falta ubicacion</span>
                    </div>
                  )}
                  {data.tema_medidor_contador !== undefined && (
                    <div class='flex items-center gap-2'>
                      <span
                        class={
                          data.tema_medidor_contador
                            ? 'text-red-600'
                            : 'text-green-600'
                        }
                      >
                        {data.tema_medidor_contador ? '⚠️' : '✓'}
                      </span>
                      <span class='text-gray-700'>tema medidor contador</span>
                    </div>
                  )}
                  {data.posible_consumo_ilegal !== undefined && (
                    <div class='flex items-center gap-2'>
                      <span
                        class={
                          data.posible_consumo_ilegal
                            ? 'text-red-600'
                            : 'text-green-600'
                        }
                      >
                        {data.posible_consumo_ilegal ? '⚠️' : '✓'}
                      </span>
                      <span class='text-gray-700'>posible consumo ilegal</span>
                    </div>
                  )}
                </>
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
    </div>
  );
};

export default PqrsInferenceModal;
