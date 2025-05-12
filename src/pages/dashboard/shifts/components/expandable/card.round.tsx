import { TextEllipsis } from '@/components/common/text-ellipsis';

interface CardRoundProps {
  activity: any;
}

export const CardRound = ({ activity }: CardRoundProps) => {
  return (
    <div className='mt-10 flex items-start justify-between bg-b-light-dark dark:bg-b-dark-dark p-2 rounded-lg h-20 w-fit'>
      <div className='flex items-start flex-1'>
        {/* Detalles de la actividad */}
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-start gap-1'>
              {activity.status === '✔️' ? (
                <span className='vox-icon vx-icon-324 !text-secondary'></span>
              ) : (
                <span className='vox-icon vx-icon-323 !text-error'></span>
              )}
              <TextEllipsis text={activity.title} maxWidth='300px' />
            </div>
            <a href='#' className='flex items-center text-primary text-md'>
              <span className='vox-icon vx-icon-306 !text-primary mr-1'></span>
              {activity.form}
              <span className='ml-1 vox-icon vx-icon-004 !text-primary'></span>
            </a>
          </div>

          {/* Programación y Solución en línea horizontal */}
          <div className='flex items-center space-x-6 w-full justify-between'>
            <div className='flex items-center gap-1'>
              <span className='vox-icon vx-icon-325'></span>
              <span>Programación: {activity.schedule}</span>
            </div>

            {activity.solution !== '...' && (
              <div className='flex items-center gap-1'>
                <span className='vox-icon vx-icon-325'></span>
                <span>Solución: {activity.solution}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
