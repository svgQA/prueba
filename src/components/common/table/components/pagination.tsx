import { PropsWithChildren } from 'preact/compat';
import { Button } from '../../button/button';

interface ITablePagination extends PropsWithChildren {
  onNext: () => void;
  onBack: () => void;
  disableNext?: boolean;
  disableBack?: boolean;
}

export const Pagination = ({
  onNext,
  onBack,
  disableNext,
  disableBack,
  children,
}: ITablePagination) => (
  <div className='flex flex-row gap-3 justify-end p-3'>
    <Button
      onClick={onBack}
      disabled={disableBack}
      type='button'
      label='back'
      icon='123'
      name='back'
    />
    <div className='flex flex-row gap-1'>{children}</div>
    <Button
      onClick={onNext}
      disabled={disableNext}
      type='button'
      label='next'
      icon='123'
      name='next'
    />
  </div>
);
