import { Button } from '@/components/common/button/button';

interface StatusButtonProps {
  onClickClean: () => void;
  submitting: boolean;
  pristine: boolean;
  form: string;
  label?: string;
}

export const StatusButton = ({
  onClickClean,
  submitting,
  pristine,
  form,
  label = 'save',
}: StatusButtonProps) => {
  return (
    <div className='flex justify-end space-x-4 absolute top-14 right-2'>
      <div className='w-full flex-row flex justify-end items-center gap-4'>
        <Button
          id='btn-clean'
          name='btn-clean'
          type='button'
          label='clean'
          icon='023'
          onClick={onClickClean}
          disabled={submitting || pristine}
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
