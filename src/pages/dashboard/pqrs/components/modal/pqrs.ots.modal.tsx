import { Signal } from '@preact/signals';
import { ICOtsRequest, ICPqrsRequest } from '../../utils/interface';
import PqrsInferenceModal from './pqrs-inference.modal';

export interface IProps {
  pqrs: Signal<ICPqrsRequest | null>;
}

const PqrsOTSModal = ({ pqrs }: IProps) => {
  const ots: ICOtsRequest[] = pqrs.value?.pqrs_ots ?? [];

  return (
    <div class='space-y-4'>
      <div class='flex items-center justify-between bg-white/95 dark:bg-b-dark-light/90 border border-gray-border/70 dark:border-b-dark-light rounded-xl px-3 py-2 shadow-sm'>
        <h4 class='font-semibold text-t-light dark:text-white text-sm uppercase tracking-wide'>
          OTS asociadas
        </h4>
        <span class='text-xs text-gray-500 dark:text-b-light-dark'>
          {ots.length} OTS
        </span>
      </div>

      {ots.length > 0 ? (
        <div class='space-y-5'>
          {ots.map((ot: ICOtsRequest) => (
            <div
              key={ot.id}
              class='space-y-3 border border-gray-border/60 dark:border-b-dark-light rounded-xl p-3 bg-white/95 dark:bg-b-dark-light/95'
            >
              <div class='flex items-center justify-between'>
                <div class='flex items-center gap-2'>
                  <span class='text-sm font-semibold text-t-light dark:text-white'>
                    OTS #{ot.id}
                  </span>
                  {ot.status && (
                    <span class='text-[11px] px-2 py-0.5 rounded-full bg-b-light dark:bg-b-dark text-gray-text-light dark:text-b-light-dark'>
                      {ot.status}
                    </span>
                  )}
                </div>
                {ot.executionDate && (
                  <span class='text-[11px] text-gray-500 dark:text-b-light-dark'>
                    {new Date(ot.executionDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div class='grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-text-light dark:text-b-light-dark'>
                <div class='flex items-center gap-2'>
                  <span class='text-gray-500'>Costo:</span>
                  <span class='font-medium text-t-light dark:text-white'>
                    {typeof ot.cost === 'number' ? ot.cost.toFixed(2) : '--'}
                  </span>
                </div>
                <div class='flex items-center gap-2'>
                  <span class='text-gray-500'>Estado:</span>
                  <span class='font-medium'>{ot.status ?? '--'}</span>
                </div>
                <div class='flex items-center gap-2'>
                  <span class='text-gray-500'>Ejecución:</span>
                  <span class='font-medium'>
                    {ot.executionDate
                      ? new Date(ot.executionDate).toLocaleString()
                      : '--'}
                  </span>
                </div>
              </div>

              <PqrsInferenceModal inferences={ot.inference ?? []} />
            </div>
          ))}
        </div>
      ) : (
        <div class='text-center py-10 bg-b-light dark:bg-b-dark rounded-xl border border-dashed border-gray-border/70 dark:border-b-dark-light'>
          <p class='text-sm text-gray-500 dark:text-b-light-dark'>
            No hay OTS disponibles para este caso
          </p>
        </div>
      )}
    </div>
  );
};

export default PqrsOTSModal;
