type Point = {
  id: number;
  name: string;
  status: string;
  statusColor: string;
  scan: string;
  distance: string;
  form: string;
};

interface CardTaskProps {
  point: Point;
}

export const CardTask = ({ point }: CardTaskProps) => {
  return (
    <div className='flex flex-col items-center justify-between bg-b-light-ligth dark:bg-b-dark-dark rounded-lg p-2'>
      <div className='flex flex-row items-center justify-between w-full'>
        <div className='w-32 flex items-center'>
          <span className='vox-icon vx-icon-324 !text-secondary mr-2'></span>
          <p>{point.name}</p>
        </div>

        <div>
          <span className='vox-icon vx-icon-325 mr-1'></span>
          <span>{point.scan}</span>
        </div>
      </div>

      <div className='flex flex-row items-center justify-between w-full'>
        <div className='w-40 flex items-center'>
          <span className='vox-icon vx-icon-329 !text-primary mr-1'></span>
          <span className='text-xs'>{point.distance}</span>
        </div>

        <div className='w-40 text-right'>
          <a
            href='#'
            className='flex items-center justify-end text-primary text-sm'
          >
            <span className='vox-icon vx-icon-306 !text-primary mr-1'></span>
            {point.form}
            <span className='ml-1 vox-icon vx-icon-004 !text-primary'></span>
          </a>
        </div>
      </div>
    </div>
  );
};
