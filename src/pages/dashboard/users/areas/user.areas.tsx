import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { FunctionComponent } from 'preact';
import { Field, Form } from 'react-final-form';
import { columns } from './area.columns';
import { UserService } from '@/services/user';
import { toast } from 'react-toastify';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
export const UserAreasPage: FunctionComponent = () => {
  const areas = useSignal<any[]>([]);

  const onSubmit = async (values: any) => {
    const response = await UserService.createArea(values);
    if (response.getStatus()) {
      toast.success('Área creada exitosamente');
    }
  };

  const fetchAreas = async () => {
    const response = await UserService.getAreas();
    if (response.getStatus()) {
      areas.value = response.getMany();
    }
    // console.log(areas.value);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return (
    <Section className='pt-2'>
      <Form
        onSubmit={onSubmit}
        initialValues={{}}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-1'>
                <Field name='name'>
                  {({ input, meta }) => (
                    <Input
                      id='name'
                      name='name'
                      placeholder='Ingrese el nombre de la área...'
                      meta={meta}
                      label='Nombre'
                      value={input.value}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>

              <div className='col-span-1'>
                <Field name='description'>
                  {({ input, meta }) => (
                    <Input
                      id='description'
                      name='description'
                      placeholder='Ingrese la descripción de la área...'
                      label='Descripción'
                      value={input.value}
                      meta={meta}
                      onChange={input.onChange}
                    />
                  )}
                </Field>
              </div>
            </div>
            <div className='flex justify-end space-x-4'>
              <Button
                id='btn-save'
                name='btn-save'
                type='submit'
                label='Guardar'
                className='rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'
                disabled={submitting}
              />
            </div>
          </form>
        )}
      />
      <Table<any>
        data={areas.value}
        columns={columns}
        unsearch={false}
        showExpandableIcon={false}
        pageSize={20}
        visibility={{}}
      />
    </Section>
  );
};
