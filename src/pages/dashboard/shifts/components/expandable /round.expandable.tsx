const RoundInfo = ({}: any) => {
  return (
    <div class='bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto'>
      <div class='flex justify-between items-center mb-4'>
        <h2 class='text-lg font-semibold'>Rondas del Turno</h2>
        <span class='text-green-600 font-semibold'>Progreso: 75%</span>
      </div>

      <div class='space-y-4'>
        <div class='flex items-center justify-between bg-gray-50 p-4 rounded-lg border'>
          <div class='flex items-center space-x-3'>
            <span class='text-green-500'>✔️</span>
            <div>
              <p class='font-medium'>Punto 1</p>
              <p class='text-sm text-gray-600'>📅 Escaneo: 11/04/2024 19:30</p>
              <p class='text-sm text-gray-600'>📏 Distancia: 9 metros</p>
            </div>
          </div>
          <a href='#' class='text-blue-500 font-medium'>
            FORMULARIO 1
          </a>
        </div>

        <div class='flex items-center justify-between bg-gray-50 p-4 rounded-lg border'>
          <div class='flex items-center space-x-3'>
            <span class='text-red-500'>⚠️</span>
            <div>
              <p class='font-medium'>Punto 3</p>
              <p class='text-sm text-gray-600'>📅 Escaneo: 11/04/2024 18:30</p>
              <p class='text-sm text-gray-600'>📏 Distancia: 30 metros</p>
            </div>
          </div>
          <a href='#' class='text-blue-500 font-medium'>
            ...
          </a>
        </div>

        <div class='flex items-center justify-between bg-gray-50 p-4 rounded-lg border'>
          <div class='flex items-center space-x-3'>
            <span class='text-green-500'>✔️</span>
            <div>
              <p class='font-medium'>Punto 2</p>
              <p class='text-sm text-gray-600'>📅 Escaneo: 11/04/2024 18:00</p>
              <p class='text-sm text-gray-600'>📏 Distancia: 9 metros</p>
            </div>
          </div>
          <a href='#' class='text-blue-500 font-medium'>
            FORMULARIO 3
          </a>
        </div>
      </div>
    </div>
  );
};

export default RoundInfo;
