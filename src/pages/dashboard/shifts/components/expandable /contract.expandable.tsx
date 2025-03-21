import { IContract } from '@/types/shift/activity';

const ContractInfo = ({ contract }: { contract: IContract }) => {
  const extra = {
    completedShifts: 12,
    incidents: 2,
    totalHours: 144,
    compliance: 10,
  };

  return (
    <div className="bg-b-white p-4 rounded-lg">
      <div className="grid grid-cols-12 gap-8">
        {/* Columna izquierda - Información del contrato */}
        <div className="col-span-4 pr-4">
          <h3 className="text-lg font-medium text-t-light">{contract.name}</h3>
          <p className="text-sm text-t-light-dark mt-1 pr-4">{contract.description}</p>

          <div className="mt-3">
            <span className="inline-block px-3 py-0.5 bg-m6 text-secondary rounded-full text-xs">
              Prioridad {contract.priority}
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs text-t-light-dark">Cliente</p>
            <div className="flex items-center mt-1">
              <div className="flex-shrink-0 mr-2">
                <span className="!text-primary vox-icon size-sm vx-icon-308"></span>
              </div>
              <p className="text-sm text-t-light">
                {contract.client.name} {contract.client.surname}
              </p>
            </div>
          </div>
        </div>

        {/* Columna derecha - Estado, fechas y métricas */}
        <div className="col-span-8">
          {/* Estado */}
          <div className="flex justify-between items-center pb-2 mb-4 border-b border-b-light-dark w-[90%]">
            <p className="text-sm text-t-light-dark">Estado</p>
            <span className="inline-block px-3 py-0.5 bg-primary-opacity text-primary rounded-full text-xs">
              {contract.state}
            </span>
          </div>

          {/* Fechas y Métricas en dos columnas */}
          <div className="grid grid-cols-2 gap-6">
            {/* Fechas - Columna izquierda */}
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-center mb-8">
                <div className="flex-shrink-0 mr-2">
                  <span className="!text-primary vox-icon size-sm vx-icon-195"></span>
                </div>
                <div>
                  <p className="text-xs text-t-light-dark">Fecha de inicio</p>
                  <p className="text-sm text-secondary">{formatDate(contract.startDate)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 mr-2">
                  <span className="!text-primary vox-icon size-sm vx-icon-195"></span>
                </div>
                <div>
                  <p className="text-xs text-t-light-dark">Fecha de finalización</p>
                  <p className="text-sm text-error">{formatDate(contract.endDate)}</p>
                </div>
              </div>
            </div>

            {/* Métricas - Columna derecha */}
            <div>
              <h4 className="text-sm font-medium mb-4 text-t-light">Métricas del contrato</h4>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2">
                    <span className="text-secondary vox-icon size-sm vx-icon-308"></span>
                  </div>
                  <div>
                    <p className="text-xs text-t-light-dark">Turnos completados</p>
                    <p className="text-sm text-t-light">{extra.completedShifts}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2">
                    <span className="text-primary vox-icon size-sm vx-icon-308"></span>
                  </div>
                  <div>
                    <p className="text-xs text-t-light-dark">Horas totales</p>
                    <p className="text-sm text-t-light">{extra.totalHours}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2">
                    <span className="text-error vox-icon size-sm vx-icon-308"></span>
                  </div>
                  <div>
                    <p className="text-xs text-t-light-dark">Incidencias</p>
                    <p className="text-sm text-t-light">{extra.incidents}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2">
                    <span className="text-secondary vox-icon size-sm vx-icon-308"></span>
                  </div>
                  <div>
                    <p className="text-xs text-t-light-dark">Cumplimiento</p>
                    <p className="text-sm text-t-light">{extra.compliance}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export default ContractInfo;