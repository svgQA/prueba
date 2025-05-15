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
  label = 'Guardar',
}: StatusButtonProps) => {
  return (
    <div className='w-full flex-row flex justify-end items-center gap-4'>
      <Button
        id='btn-clean'
        name='btn-clean'
        type='button'
        label='Limpiar'
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
        className='rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'
        disabled={submitting}
      />
    </div>
  );
};
