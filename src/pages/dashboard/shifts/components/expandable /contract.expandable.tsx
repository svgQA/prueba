import { IContract } from '@/types/shift/activity';

const ContractInfo = ({ contract }: { contract: IContract }) => {
  const extra = {
    completedShifts: 12,
    incidents: 2,
    totalHours: 144,
    compliance: 10,
  };
  return (
    <div class='p-6 bg-gray-100 rounded-lg shadow-md'>
      <div class='bg-white p-4 rounded-lg shadow flex justify-between items-start'>
        {/* Información del contrato */}
        <div>
          <h4 class='text-lg font-semibold'>{contract.name}</h4>
          <p>{contract.description}</p>
          <span class='px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full'>
            {contract.priority}
          </span>
          <p class='mt-2 flex items-center gap-2'>
            👤 <strong>Cliente:</strong> {contract.client.name}
            {contract.client.surname}
          </p>
        </div>
        {/* Información del Estado */}
        <div class='text-right'>
          <span class='px-4 py-1 bg-blue-100 text-blue-600 rounded-full'>
            {contract.state}
          </span>
        </div>
      </div>

      {/* Fechas y métricas */}
      <div class='mt-4 bg-white p-4 rounded-lg shadow grid grid-cols-3 gap-4'>
        <div>
          <p class='flex items-center gap-2'>
            📅 <strong>Fecha de inicio:</strong>
            <span class='text-green-600'>{contract.startDate}</span>
          </p>
          <p class='flex items-center gap-2'>
            📅 <strong>Fecha de finalización:</strong>
            <span class='text-red-600'>{contract.endDate}</span>
          </p>
        </div>

        <div class='col-span-2 grid grid-cols-3 gap-4'>
          <p class='flex items-center gap-2'>
            ✅ {extra.completedShifts ?? 12} turnos completados
          </p>
          <p class='flex items-center gap-2'>
            ⚠️ {extra.incidents ?? 2} incidencias
          </p>
          <p class='flex items-center gap-2'>
            ⏳ {extra.totalHours ?? 144} horas totales
          </p>
          <p class='flex items-center gap-2'>
            📊 {extra.compliance ?? 98}% cumplimiento
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractInfo;
