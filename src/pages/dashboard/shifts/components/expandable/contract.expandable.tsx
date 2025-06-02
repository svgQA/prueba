import { Chip } from '@/components/common/chip/chip';
import { IContract } from '@/types/shift/activity';
import { useEffect } from 'react';
import { ContractService } from '@/services';
import { useSignal } from '@preact/signals';
import { IProjectMetricsResponse } from '@/types/contract/contract.response';

const ContractInfo = ({ contract }: { contract: IContract }) => {
  const metrics = useSignal<IProjectMetricsResponse>({
    completedShifts: 0,
    completionPercentage: 0,
    totalHours: 0,
    totalShifts: 0,
  });

  const getMetrics = async () => {
    const response = await ContractService.getProjectMetrics(contract.id);
    if (!response.getStatus()) return;
    metrics.value = response.getOne();
  };

  useEffect(() => {
    getMetrics();
  }, []);

  return (
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-4'>
      <div className='grid grid-cols-12 gap-8'>
        {/* Columna izquierda - Información del contrato */}
        <div className='col-span-4 pr-4'>
          <h3 className='font-medium'>{contract.name}</h3>
          <p className='mt-1 pr-4'>{contract.description}</p>

          <div className='mt-3'>
            <Chip label={contract.priority} color='success' width='md' />
          </div>

          <div className='mt-4'>
            <p className='font-semibold'>Cliente</p>
            <div className='flex items-center mt-1'>
              <div className='flex-shrink-0 mr-2'>
                <span className='!text-primary vox-icon size-sm vx-icon-308'></span>
              </div>
              <p>
                {contract.client.name} {contract.client.surname}
              </p>
            </div>
          </div>
        </div>

        {/* Columna derecha - Estado, fechas y métricas */}
        <div className='col-span-8'>
          {/* Estado */}
          <div className='flex justify-between items-center pb-2 mb-4 border-b border-b-light-light dark:border-b-dark-light w-[90%]'>
            <p className='font-semibold '>Estado</p>
            <Chip label={contract.state} color='success' />
          </div>

          {/* Fechas y Métricas en dos columnas */}
          <div className='grid grid-cols-2 gap-6'>
            {/* Fechas - Columna izquierda */}
            <div className='flex flex-col justify-between h-full'>
              <div className='flex items-center mb-8'>
                <div className='flex-shrink-0 mr-2'>
                  <span className='!text-primary vox-icon size-sm vx-icon-195'></span>
                </div>
                <div>
                  <p className='font-semibold'>Fecha de inicio</p>
                  <p>{formatDate(contract.startDate)}</p>
                </div>
              </div>

              <div className='flex items-center'>
                <div className='flex-shrink-0 mr-2'>
                  <span className='!text-primary vox-icon size-sm vx-icon-195'></span>
                </div>
                <div>
                  <p className='font-semibold'>Fecha de finalización</p>
                  <p>{formatDate(contract.endDate)}</p>
                </div>
              </div>
            </div>

            {/* Métricas - Columna derecha */}
            <div>
              <h4 className='font-semibold mb-4'>Métricas del contrato</h4>

              <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0 mr-2'>
                    <span className='!text-secondary vox-icon size-sm vx-icon-308'></span>
                  </div>
                  <div>
                    <p className='font-semibold'>Turnos completados</p>
                    <p>{metrics.value.completedShifts}</p>
                  </div>
                </div>

                <div className='flex items-center'>
                  <div className='flex-shrink-0 mr-2'>
                    <span className='!text-primary vox-icon size-sm vx-icon-308'></span>
                  </div>
                  <div>
                    <p className='font-semibold'>Horas totales</p>
                    <p>{metrics.value.totalHours}</p>
                  </div>
                </div>

                <div className='flex items-center'>
                  <div className='flex-shrink-0 mr-2'>
                    <span className='text-error vox-icon size-sm vx-icon-308'></span>
                  </div>
                  <div>
                    <p className='font-semibold'>Total de turnos</p>
                    <p>{metrics.value.totalShifts}</p>
                  </div>
                </div>

                <div className='flex items-center'>
                  <div className='flex-shrink-0 mr-2'>
                    <span className='!text-secondary vox-icon size-sm vx-icon-308'></span>
                  </div>
                  <div>
                    <p className='font-semibold'>Cumplimiento</p>
                    <p>{metrics.value.completionPercentage.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function formatDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export default ContractInfo;
