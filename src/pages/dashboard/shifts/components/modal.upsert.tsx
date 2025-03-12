import { Button } from '@/components/common/button/button';
import { Input } from '@/components/common/input/input';
import { Select } from '@/components/common/select/select';
import { Field, Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import dayjs from 'dayjs';
import { Signal } from '@preact/signals';
import { FormData } from '../interface';

interface Props {
  showModal: () => void;
  id: Signal<undefined>;
  initialValues: Signal<Partial<FormData>>;
  onSubmit: (values: any) => void;
  users: Signal<any[]>;
  services: Signal<any[]>;
  inputKeywords: Signal<string>;
}

export const TaskForm = ({
  showModal,
  id,
  initialValues,
  onSubmit,
  users,
  services,
  inputKeywords,
}: Props) => {
  const required = (value: any) => (value ? undefined : 'Required');

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20'>
      <div className='bg-white rounded-lg shadow-lg w-2/3 max-w-4xl'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium'>
            {id ? 'Editar Tarea' : 'Guardar Tarea'}
          </h3>
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues.value}
            mutators={{
              ...arrayMutators,
            }}
            render={({ handleSubmit, submitting, values }) => (
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-2 gap-3'>
                  <div class='col-span-1'>
                    <Field<string>
                      name='start'
                      validate={required}
                      parse={(value) =>
                        value ? dayjs(value).toISOString() : ''
                      }
                      format={(value) =>
                        value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''
                      }
                    >
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='datetime-local'
                          label='Fecha inicio'
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>

                  <div class='col-span-1'>
                    <Field<string>
                      name='end'
                      validate={required}
                      parse={(value) =>
                        value ? dayjs(value).toISOString() : ''
                      }
                      format={(value) =>
                        value ? dayjs(value).format('YYYY-MM-DD HH:mm') : ''
                      }
                    >
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type='datetime-local'
                          label='Fecha fin'
                          meta={meta}
                        />
                      )}
                    </Field>
                  </div>

                  <div class='col-span-1'>
                    <Field<string> name='status'>
                      {({ input }) => (
                        <Select
                          {...input}
                          placeholder='Selecione estado...'
                          label='Estado'
                          name='status'
                          icon='252'
                          options={[
                            { value: 'CREATED', label: 'Creado' },
                            { value: 'OPENED', label: 'Abierto' },
                            { value: 'CLOSED', label: 'Cerrado' },
                            { value: 'RESOLVED', label: 'Resuelto' },
                          ]}
                        />
                      )}
                    </Field>
                  </div>

                  <div class='col-span-1'>
                    <Field<string> name='type'>
                      {({ input }) => (
                        <Select
                          {...input}
                          placeholder='Selecione tipo...'
                          label='Tipo'
                          name='type'
                          icon='252'
                          options={[
                            { value: 'EXTERNAL', label: 'Externo' },
                            { value: 'INTERNAL', label: 'Interno' },
                          ]}
                        />
                      )}
                    </Field>
                  </div>

                  <div class='col-span-1'>
                    <Field<string> name='employeedId'>
                      {({ input }) => (
                        <Select
                          {...input}
                          placeholder='Selecione empleado...'
                          label='Empleado'
                          name='employeedId'
                          icon='252'
                          options={users.value}
                          optionValue='id'
                          optionLabel='fullname'
                          onChange={(e) => {
                            const id = parseInt(e.currentTarget.value);
                            input.onChange(id);
                          }}
                        />
                      )}
                    </Field>
                  </div>

                  <div class='col-span-1'>
                    <Field name='serviceId'>
                      {({ input }) => (
                        <Select
                          {...input}
                          placeholder='Selecione Servicio...'
                          label='Servicio'
                          name='serviceId'
                          icon='252'
                          optionValue='id'
                          optionLabel='description'
                          options={services.value}
                          onChange={(e) => {
                            const id = parseInt(e.currentTarget.value);
                            input.onChange(id);
                          }}
                        />
                      )}
                    </Field>
                  </div>

                  <div class='col-span-1'>
                    <Field<string> name='externalId'>
                      {({ input }) => (
                        <Input {...input} type='text' label='Codigo externo' />
                      )}
                    </Field>
                  </div>

                  <div class='col-span-1 mt-4'>
                    <FieldArray<string> name='keywords'>
                      {({ fields }) => (
                        <div className='flex flex-col gap-2'>
                          <div className='flex items-center border p-2 rounded-md'>
                            <input
                              value={inputKeywords.value}
                              type='keywords'
                              onChange={(e) =>
                                (inputKeywords.value = e.currentTarget.value)
                              }
                              placeholder='Escribe una palabra clave'
                              className='flex-grow p-2 border rounded-md'
                            />
                            <button
                              type='button'
                              className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-md'
                              onClick={() => {
                                fields.push(inputKeywords.value);
                                inputKeywords.value = '';
                              }}
                            >
                              Agregar
                            </button>
                          </div>
                          <div className='flex flex-wrap gap-2'>
                            {values.keywords?.map(
                              (keyword: string, index: number) => (
                                <span
                                  key={index}
                                  className='px-3 py-1 bg-gray-200 rounded-md flex items-center'
                                >
                                  {keyword}
                                  <button
                                    type='button'
                                    className='ml-2 text-red-500'
                                    onClick={() => {
                                      fields.remove(index);
                                    }}
                                  >
                                    ×
                                  </button>
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>

                <div className='flex dark:bg-b-dark-light justify-end gap-2 p-4 bg-gray-50'>
                  <Button
                    id='btn-close'
                    name='btn-close'
                    type='button'
                    label='Cancelar'
                    onClick={showModal}
                  />

                  <Button
                    id='btn-save'
                    name='btn-save'
                    type='submit'
                    label={id.value ? 'Editar' : 'Guardar'}
                    className="rounded-md bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600'"
                    disabled={submitting}
                  />
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </div>
  );
};
