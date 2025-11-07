import { Button } from '@/components/common/button/button';

interface Props {
  onClickClean: () => void;
  submitting: boolean;
  pristine: boolean;
  form: string;
  label?: string;
  clear?: boolean;
  lock?: boolean;
  top?: boolean;
}

export const StatusButton = ({
  onClickClean,
  submitting,
  pristine,
  form,
  label = 'save',
  clear = false,
  lock = false,
  top = true,
}: Props) => {
  return (
    <div
      className={`flex justify-end space-x-4 absolute ${top ? 'top-14' : 'bottom-0'} right-2`}
    >
      <div className='w-full flex-row flex justify-end items-center gap-4'>
        <Button
          id='btn-clean'
          name='btn-clean'
          type='button'
          label='clean'
          icon='023'
          onClick={onClickClean}
          disabled={clear ? lock && pristine : submitting || pristine}
        />

        <Button
          id='btn-save'
          name='btn-save'
          type='submit'
          label={label}
          form={form}
          icon='022'
          disabled={submitting}
        />
      </div>
    </div>
  );
};
