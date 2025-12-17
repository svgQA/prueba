import React, { memo, useMemo } from 'react';
import { Inference } from '../../utils/interface';
import { Badge } from '@/components/common/badge/badge';
// import { Chip } from '@/components/common/chip/chip';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { SimpleGauge } from '@/components/common/gauge/simple';

export interface IProps {
  inferences: Inference[];
  full?: boolean;
}

{
  /*
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
  'severity',
]);

const prettyKey = (key: string) =>
  key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');

*/
}
const formatValue = (val: any): string => {
  if (val == null) return 'N/A';
  const t = typeof val;

  if (t === 'string') return val;
  if (t === 'number' || t === 'boolean') return String(val);

  if (t === 'object') {
    const candidate = val?.name ?? val?.label ?? val?.description ?? val?.value;
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
    try {
      return JSON.stringify(val);
    } catch {
      return '[object]';
    }
  }
  return String(val);
};

const hasUsefulValue = (val: any) => {
  const fv = formatValue(val).trim().toLowerCase();
  return fv !== 'n/a' && fv !== 'null' && fv !== '';
};

const Section = memo(
  ({
    title,
    children,
    subtle = false,
    accent = false,
  }: {
    title?: string;
    children: React.ReactNode;
    subtle?: boolean;
    accent?: boolean; // solo para "lo que hizo la inferencia"
  }) => (
    <div
      className={[
        'rounded-lg border py-3',
        subtle
          ? 'border-gray-200/70 dark:border-b-dark-light bg-white/95 dark:bg-b-dark-light/95'
          : 'border-gray-200/70 dark:border-b-dark-light bg-gray-50/60 dark:bg-b-dark/60',
        accent
          ? 'pl-2 border-l-4 border-l-indigo-500 dark:border-l-indigo-400'
          : 'pl-2 border-l-4 border-l-ternary dark:border-l-ternary',
      ].join(' ')}
    >
      {title && (
        <div className='text-xs font-bold text-gray-700 dark:text-b-light-dark mb-2'>
          {title}
        </div>
      )}
      {children}
    </div>
  )
);

{
  /*
const FieldGrid = memo(({ entries }: { entries: Array<[string, any]> }) => {
  if (!entries.length) return null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
      {entries.map(([key, value]) => (
        <div
          key={key}
          className='rounded-lg border border-gray-200/70 dark:border-b-dark-light bg-white/90 dark:bg-b-dark-light/90 p-2.5'
        >
          <div className='text-[11px] font-semibold text-gray-600 dark:text-b-light-dark mb-1 capitalize'>
            {prettyKey(key)}
          </div>
          <Chip label={formatValue(value)} width='sm' />
        </div>
      ))}
    </div>
  );
});
	*/
}

const InferenceCard = memo(({ inference }: { inference: Inference }) => {
  const data = inference.inference ?? {};

  {
    /*
	const dynamicEntries = useMemo(() => {
		return Object.entries(data)
			.filter(([k, v]) => !KNOWN_KEYS.has(k) && hasUsefulValue(v))
			.sort(([a], [b]) => a.localeCompare(b));
	}, [data]);
  */
  }

  const title = data.title ? String(data.title) : '';
  const subtitle = data.subtitle ? String(data.subtitle) : '';
  const description = data.description ? String(data.description) : '';

  const reasonsRaw = data.reasons ?? data.razones;
  const reasons = Array.isArray(reasonsRaw)
    ? reasonsRaw.join('; ')
    : formatValue(reasonsRaw);

  {
    /*
  const etiquetas: string[] = Array.isArray(data.etiquetas)
    ? data.etiquetas
    : [];
  */
  }

  const confidence =
    data.confidence !== undefined ? Number(data.confidence) : undefined;

  const createdAt = useMemo(() => {
    try {
      return new Date(inference.createdAt).toLocaleDateString();
    } catch {
      return '';
    }
  }, [inference.createdAt]);

  return (
    <div className='rounded-xl border border-gray-200/70 dark:border-b-dark-light bg-white/95 dark:bg-b-dark-light/95 p-4 space-y-1 relative'>
      {/* Header sobrio */}
      <div className='flex items-start justify-between'>
        <div className='min-w-0'>
          <div className='font-semibold text-gray-900 dark:text-white text-sm truncate'>
            {title || inference.stage?.stageName || 'Análisis'}
          </div>
          {!!inference.stage?.goal && !subtitle && (
            <div className='text-xs text-gray-500 dark:text-b-light-dark'>
              Goal: {inference.stage.goal}
            </div>
          )}
          {subtitle && (
            <div className='text-xs text-gray-500 dark:text-b-light-dark'>
              {subtitle}
            </div>
          )}
        </div>
        <div className='text-[11px] text-gray-400 dark:text-b-light-dark whitespace-nowrap'>
          {createdAt}
        </div>
        {confidence !== undefined && (
          <SimpleGauge
            progress={Math.round((Number(confidence) || 0) * 100)}
            size={10}
            color='teal'
          />
        )}
      </div>
      {/* Descripción */}
      {description && (
        <Section subtle title='Descripción'>
          <TextEllipsis
            text={description}
            maxWidth='100%'
            lines={4}
            className='text-xs text-gray-700 dark:text-b-light-dark leading-relaxed'
          />
        </Section>
      )}
      {/* Análisis realizado (sobrio) */}
      {data.analysisRequest && (
        <Section subtle title='Análisis realizado'>
          <div className='text-xs text-gray-800 dark:text-b-light-dark whitespace-pre-wrap'>
            {typeof data.analysisRequest === 'string'
              ? data.analysisRequest
              : JSON.stringify(data.analysisRequest, null, 2)}
          </div>
        </Section>
      )}
      {/* Resultado del análisis (ÚNICO lugar con color/acento) */}
      {data.analysisResponse && (
        <Section accent title='Resultado del análisis'>
          <pre className='text-xs text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap overflow-x-auto'>
            {typeof data.analysisResponse === 'string'
              ? data.analysisResponse
              : JSON.stringify(data.analysisResponse, null, 2)}
          </pre>
        </Section>
      )}
      {/* Severidad (sobrio) */}
      {data.severity && (
        <div className='flex items-center gap-2'>
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
      {/* Razones */}
      {hasUsefulValue(reasonsRaw) && (
        <Section subtle title='Razones'>
          <div className='text-xs text-gray-800 dark:text-b-light-dark whitespace-pre-wrap'>
            {reasons}
          </div>
        </Section>
      )}
      {/* Etiquetas */}
      {/*
      {etiquetas.length > 0 && (
        <Section subtle title='Etiquetas'>
          <div className='flex flex-wrap gap-2'>
            {etiquetas.map((tag, idx) => (
              <Chip key={idx} label={`#${String(tag)}`} />
            ))}
          </div>
        </Section>
      )}

      {/* Campos dinámicos //}
      {dynamicEntries.length > 0 && (
        <Section subtle title='Campos adicionales'>
          <FieldGrid entries={dynamicEntries} />
        </Section>
      )}
      */}
    </div>
  );
});

// InferenceCard.displayName = 'InferenceCard';

const PqrsInferenceModal = ({ inferences, full }: IProps) => (
  <div className='space-y-1'>
    <div className='flex items-center justify-between rounded-xl border border-gray-200/70 dark:border-b-dark-light bg-white/95 dark:bg-b-dark-light/90 px-3 py-2'>
      <h4 className='font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide'>
        Análisis de IA
      </h4>
      <span className='text-xs text-gray-500 dark:text-b-light-dark'>
        {inferences.length} análisis
      </span>
    </div>

    {inferences.length > 0 ? (
      <div
        className={`grid grid-cols-1 gap-1 ${full ? '' : 'md:grid-cols-2 xl:grid-cols-3'}`}
      >
        {inferences.map((inference: Inference) => (
          <InferenceCard key={inference.id} inference={inference} />
        ))}
      </div>
    ) : (
      <div className='text-center py-10 rounded-xl border border-dashed border-gray-200/70 dark:border-b-dark-light bg-white/80 dark:bg-b-dark/60'>
        <p className='text-sm text-gray-500 dark:text-b-light-dark'>
          No hay análisis de IA disponible
        </p>
      </div>
    )}
  </div>
);

export default PqrsInferenceModal;
