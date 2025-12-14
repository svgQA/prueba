import { Signal } from '@preact/signals';
import { ICPqrsRequest, Inference } from '../../utils/interface';
import { Badge } from '@/components/common/badge/badge';
import { Slider } from '@/components/common/slider/slider';
import { Chip } from '@/components/common/chip/chip';
import { TextEllipsis } from '@/components/common/text-ellipsis';

export interface IProps {
  pqrs: Signal<ICPqrsRequest | null>;
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

  // Campos conocidos que manejamos explícitamente
  const KNOWN_KEYS = new Set([
    'title',
    'subtitle',
    'description',
    'analysisRequest',
    'analysisResponse',
    'confidence',
    'etiquetas',
    'reasons',
    'razones',
    'priority',
    'prioridad',
    'subarea',
    'area',
    'clasificacion',
  ]);

  // Utilidad para presentar valores dinámicos
  const formatValue = (val: any): string => {
    if (val == null) return 'N/A';
    const t = typeof val;
    if (t === 'string') return val;
    if (t === 'number' || t === 'boolean') return String(val);
    if (t === 'object') {
      // Priorizar atributos comunes
      const candidate = val.name ?? val.label ?? val.description ?? val.value;
      if (candidate && typeof candidate === 'string') return candidate;
      try {
        return JSON.stringify(val);
      } catch {
        return '[object]';
      }
    }
    return String(val);
  };

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
                <TextEllipsis
                  text={String(data.description)}
                  maxWidth='100%'
                  lines={4}
                  className='text-xs text-gray-700 leading-relaxed'
                />
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

        {/* Render dinámico de campos adicionales desconocidos */}
        {Object.entries(data).some(([key]) => !KNOWN_KEYS.has(key)) && (
          <div class='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {Object.entries(data)
              .filter(([key, value]) => {
                if (KNOWN_KEYS.has(key)) return false;
                const fv = String(formatValue(value)).trim().toLowerCase();
                return fv !== 'n/a' && fv !== 'null' && fv !== '';
              })
              .map(([key, value]) => (
                <div key={key} class='flex flex-col gap-1'>
                  <span class='text-xs font-semibold text-gray-600 dark:text-b-light-dark capitalize'>
                    {key.replace(/_/g, ' ')}
                  </span>
                  <Chip label={formatValue(value)} width='sm' />
                </div>
              ))}
          </div>
        )}

        {/* Severidad (si viene) */}
        {data.severity && (
          <div class='flex items-center gap-2'>
            <Badge
              label={formatValue(data.severity)}
              status={
                ['alto', 'alta'].includes(String(data.severity).toLowerCase())
                  ? 'error'
                  : ['medio', 'media'].includes(
                        String(data.severity).toLowerCase()
                      )
                    ? 'warning'
                    : 'success'
              }
              size='sm'
              outline
            />
          </div>
        )}

        {/* Reasons */}
        {(data.reasons || data.razones) && (
          <div class='p-2 bg-amber-50 rounded'>
            <span class='text-xs font-medium text-amber-700 block mb-1'>
              Razones:
            </span>
            <p class='text-xs text-amber-900'>
              {Array.isArray(data.reasons || data.razones)
                ? (data.reasons || data.razones).join('; ')
                : formatValue(data.reasons || data.razones)}
            </p>
          </div>
        )}

        {data.etiquetas && data.etiquetas.length > 0 && (
          <div>
            <label class='block text-xs font-medium text-gray-500 mb-2'>
              Etiquetas
            </label>
            <div class='flex flex-wrap gap-2'>
              {data.etiquetas.map((tag: string, idx: number) => (
                <Chip key={idx} label={`#${String(tag)}`} />
              ))}
            </div>
          </div>
        )}

        {data.confidence !== undefined && (
          <Slider
            min={0}
            max={100}
            step={1}
            value={Math.round((Number(data.confidence) || 0) * 100)}
            label='Confianza'
            showValue={true}
            onChange={() => {}}
            disabled={true}
          />
        )}
      </div>
    </div>
  );
};

export default PqrsInferenceModal;
