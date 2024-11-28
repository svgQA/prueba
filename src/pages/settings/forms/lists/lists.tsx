import { Input, Modal, MultipleInput, Table } from '@/components/common';

import { getStatusListModal, toggleListModal } from './store';
import { useSignal } from '@preact/signals';
import { IOption } from '@/components/common/interface';
import { Field, Form } from 'react-final-form';
import { required } from '@/utils/utilities';
import { useEffect, useCallback } from 'preact/hooks';
import { FormService } from '@/services';
import { IListRequest, IListResponse } from '@/types/form';
import { columns } from './components';

interface IListFormModalProps {
  onSelected?: (value: IListResponse) => void;
}

export const ListFormModal = ({
  onSelected = () => {},
}: IListFormModalProps) => {
  const listValues = useSignal<IOption[]>([]);
  const lists = useSignal<IListResponse[]>([]);

  const getLists = useCallback(async () => {
    const response = await FormService.get_list_all();
    if (!response.getStatus()) throw Error('ERROR: no loaded lists');
    lists.value = response.getMany();
  }, []);

  useEffect(() => {
    if (!getStatusListModal.value) return;
    getLists();
  }, [getStatusListModal.value, getLists]);

  const onChange = useCallback((value: IOption[]) => {
    listValues.value = value;
  }, []);

  const saveList = useCallback(
    async (value: IListRequest) => {
      if (listValues.value.length < 1)
        throw Error('ERROR: no elements in list');
      value.structure = listValues.value;

      const response = await FormService.create_list(value);
      if (!response.getStatus()) throw Error('ERROR: no created list');
      listValues.value = [];
      getLists();
    },
    [listValues.value, getLists]
  );

  return (
    <Modal
      open={getStatusListModal.value}
      onClose={toggleListModal}
      name='setting-list-modal'
      id='setting-list-modal'
      width='w-[50vw]'
      shadowed
      header={<h2>Agregar o Seleccionar una lista</h2>}
      position='fixed'
    >
      {/* transparent */}
      <div className='p-3 w-full flex flex-col max-h-[70vh] overflow-y-hidden'>
        <Form
          onSubmit={saveList}
          subscription={{ submitting: true, pristine: true }}
          render={({ handleSubmit, form }) => (
            <form
              onSubmit={(e) => {
                handleSubmit(e)?.then(() => form.reset());
              }}
              className='pb-3'
            >
              <Field<string> name='name' validate={required}>
                {({ input, meta }) => (
                  <Input
                    {...input}
                    placeholder='Name'
                    label='Name'
                    name='ob-input-list-label'
                    id='ob-input-list-label'
                    type='text'
                    meta={meta}
                    icon='204'
                  />
                )}
              </Field>
              <MultipleInput
                name='list'
                id={`mt-form-new-list-options`}
                icon='123'
                value={listValues.value}
                onChange={onChange}
                buttonIcon='054'
                button
                buttonType='submit'
                scrollable
              />
            </form>
          )}
        ></Form>
        <Table<IListResponse>
          data={lists.value}
          columns={columns(onSelected)}
          pageSize={8}
          unsettings
        />
      </div>
    </Modal>
  );
};
