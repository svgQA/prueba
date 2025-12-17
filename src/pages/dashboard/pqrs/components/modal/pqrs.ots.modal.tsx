import { Signal } from '@preact/signals';
import { ICOtsRequest, ICPqrsRequest } from '../../utils/interface';
import PqrsInferenceModal from './pqrs-inference.modal';

export interface IProps {
  pqrs: Signal<ICPqrsRequest | null>;
}

const fmtDate = (d?: string | Date | null, withTime = false) => {
  if (!d) return '--';
  try {
    const date = new Date(d);
    return withTime ? date.toLocaleString() : date.toLocaleDateString();
  } catch {
    return '--';
  }
};

const fmtMoney = (n?: number | null) =>
  typeof n === 'number' && Number.isFinite(n) ? n.toFixed(2) : '--';

const PqrsOTSModal = ({ pqrs }: IProps) => {
  const ots: ICOtsRequest[] = pqrs.value?.pqrs_ots ?? [];

  return (
    <div className='space-y-1'>
      {/* Header */}
      <div className='flex items-center justify-between rounded-xl border border-gray-200/70 dark:border-b-dark-light bg-white/95 dark:bg-b-dark-light/90 px-3 py-2'>
        <h4 className='font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide'>
          OTS asociadas
        </h4>
        <span className='text-xs text-gray-500 dark:text-b-light-dark'>
          {ots.length} OTS
        </span>
      </div>

      {ots.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
          {ots.map((ot: ICOtsRequest) => (
            <div
              key={ot.id}
              className='rounded-xl border border-gray-200/70 dark:border-b-dark-light bg-white/95 dark:bg-b-dark-light/95 p-4 space-y-3 hover:shadow-sm transition-shadow'
            >
              {/* Header card */}
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <div className='flex items-center gap-2'>
                    <span className='font-bold px-2 py-0.5 bg-teal-700 rounded-md'>
                      OTS #{ot.id}
                    </span>

                    {ot.status && (
                      <span className='text-[11px] px-2 py-0.5 rounded-full border border-gray-200/70 dark:border-b-dark-light text-gray-700 dark:text-b-light-dark bg-white/70 dark:bg-b-dark/40'>
                        {ot.status}
                      </span>
                    )}
                  </div>
                </div>

                <span className='text-[11px] text-gray-400 dark:text-b-light-dark whitespace-nowrap'>
                  {fmtDate(ot.executionDate)}
                </span>
              </div>

              {/* Resumen OTS */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs'>
                <div className='rounded-lg border border-gray-200/70 dark:border-b-dark-light bg-gray-50/60 dark:bg-b-dark/40 p-2'>
                  <div className='text-[11px] font-semibold text-gray-600 dark:text-b-light-dark'>
                    Costo
                  </div>
                  <div className='text-gray-900 dark:text-white font-medium'>
                    {fmtMoney(ot.cost)}
                  </div>
                </div>

                <div className='rounded-lg border border-gray-200/70 dark:border-b-dark-light bg-gray-50/60 dark:bg-b-dark/40 p-2'>
                  <div className='text-[11px] font-semibold text-gray-600 dark:text-b-light-dark'>
                    Estado
                  </div>
                  <div className='text-gray-800 dark:text-b-light-dark font-medium'>
                    {ot.status ?? '--'}
                  </div>
                </div>

                <div className='rounded-lg border border-gray-200/70 dark:border-b-dark-light bg-gray-50/60 dark:bg-b-dark/40 p-2'>
                  <div className='text-[11px] font-semibold text-gray-600 dark:text-b-light-dark'>
                    Ejecución
                  </div>
                  <div className='text-gray-800 dark:text-b-light-dark font-medium'>
                    {fmtDate(ot.executionDate, true)}
                  </div>
                </div>
              </div>

              {/* Inference (usa el modal refactorizado) */}
              <PqrsInferenceModal full inferences={ot.inference ?? []} />
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-10 rounded-xl border border-dashed border-gray-200/70 dark:border-b-dark-light bg-white/80 dark:bg-b-dark/60'>
          <p className='text-sm text-gray-500 dark:text-b-light-dark'>
            No hay OTS disponibles para este caso
          </p>
        </div>
      )}
    </div>
  );
};

export default PqrsOTSModal;
