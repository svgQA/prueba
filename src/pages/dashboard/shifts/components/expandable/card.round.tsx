import { TextEllipsis } from '@/components/common/text-ellipsis';
import { FormattedDate } from '@/components/compose/forms';

interface CardRoundProps {
  activity: any;
}

export const CardRound = ({ activity }: CardRoundProps) => {
  const openForm = (formId: number | null) => {
    if (formId) {
      // TODO: Open form
      console.log(formId);
    }
  };
  return (
    <div className='mt-10 flex items-start justify-between bg-b-light-dark dark:bg-b-dark-dark p-2 rounded-lg h-20 w-fit'>
      <div className='flex items-start flex-1'>
        {/* Detalles de la actividad */}
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-start gap-1'>
              {activity.state === true ? (
                <span className='vox-icon vx-icon-324 !text-secondary'></span>
              ) : (
                <span className='vox-icon vx-icon-323 !text-error'></span>
              )}
              <TextEllipsis text={activity.serviceTask.name} maxWidth='300px' />
            </div>
            <a
              href='#'
              className='flex items-center text-primary'
              onClick={() => openForm(activity.serviceTask.formId)}
            >
              <span className='vox-icon vx-icon-306 !text-primary mr-1'></span>
              {activity.serviceTask.formId
                ? `Formulario ${activity.serviceTask.formId}`
                : 'Sin formulario'}
              <span className='ml-1 vox-icon vx-icon-004 !text-primary'></span>
            </a>
          </div>

          {/* Programación y Solución en línea horizontal */}
          <div className='flex items-center space-x-6 w-full justify-between'>
            <div className='flex items-center gap-1'>
              <span className='vox-icon vx-icon-325'></span>
              <span>
                Programación:{' '}
                <FormattedDate
                  date={activity.serviceTask.hourStart}
                  format='datetime'
                />
              </span>
            </div>

            {activity.date !== '...' && (
              <div className='flex items-center gap-1'>
                <span className='vox-icon vx-icon-325'></span>
                <span>
                  Solución:{' '}
                  <FormattedDate date={activity.date} format='datetime' />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
