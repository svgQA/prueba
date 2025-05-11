interface CardRoundProps {
  activity: any;
}

export const CardRound = ({ activity }: CardRoundProps) => {
  return (
    <div className='flex items-start justify-between bg-b-light-ligth dark:bg-b-dark-dark p-2 rounded-lg h-20 w-fit'>
      <div className='flex items-start flex-1'>
        {/* Icono de estado */}
        <div className='mr-2 mt-1'>
          {activity.status === '✔️' ? (
            <span className='vox-icon vx-icon-324 !text-secondary'></span>
          ) : (
            <span className='vox-icon vx-icon-323 !text-error'></span>
          )}
        </div>

        {/* Detalles de la actividad */}
        <div className='flex-1'>
          <p className='mb-2'>{activity.title}</p>

          {/* Programación y Solución en línea horizontal */}
          <div className='flex items-center space-x-6'>
            <div className='flex items-center'>
              <span className='vox-icon vx-icon-325 mr-1'></span>
              <span>Programación: {activity.schedule}</span>
            </div>

            {activity.solution !== '...' && (
              <div className='flex items-center'>
                <span className='vox-icon vx-icon-325 mr-1'></span>
                <span>Solución: {activity.solution}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lado derecho - Enlace al formulario */}
      <div className='ml-4 flex items-center'>
        <a href='#' className='flex items-center text-primary text-sm'>
          <span className='vox-icon vx-icon-306 !text-primary mr-1'></span>
          {activity.form}
          <span className='ml-1 vox-icon vx-icon-004 !text-primary'></span>
        </a>
      </div>
    </div>
  );
};
