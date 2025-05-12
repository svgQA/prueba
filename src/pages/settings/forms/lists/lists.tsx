import { useSignal } from '@preact/signals';
import { Field, Form } from 'react-final-form';
import { required } from '@/utils/utilities';
import { useEffect, useCallback, useMemo } from 'preact/hooks';
import { FormService } from '@/services';
import { IListRequest, IListResponse } from '@/types/form';
import { IOption } from '@/components/common/multi/interface';
import { IRowAction } from '@/components/common/table/interface';
import { Input } from '@/components/common/input/input';
import { MultipleInput } from '@/components/common/multi/multi';
import { Modal } from '@/components/common/modal/modal';
import { Table } from '@/components/common/table/table';
import { columns } from './components/list.columns';
import { getStatusListModal, toggleListModal } from './store/list';

interface IListFormModalProps {
  onSelected?: (value: IListResponse) => void;
}

export const ListFormModal = ({ onSelected }: IListFormModalProps) => {
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

  const handleOnClick = useCallback(
    (action: IRowAction) => {
      const foundList = lists.value.find((list) => list.id == action.id);
      if (foundList) {
        onSelected?.(foundList);
      }
    },
    [lists.value, onSelected]
  );

  const renderForm = useMemo(
    () => (
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
              id='mt-form-new-list-options'
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
      />
    ),
    [saveList, listValues.value, onChange]
  );

  const modalHeader = useMemo(
    () => <h2>Agregar o Seleccionar una lista</h2>,
    []
  );

  return (
    <Modal
      open={getStatusListModal.value}
      onClose={toggleListModal}
      name='setting-list-modal'
      id='setting-list-modal'
      width='w-[50vw]'
      shadowed
      header={modalHeader}
      position='fixed'
    >
      <div className='p-3 w-full flex flex-col max-h-[70vh] overflow-y-hidden'>
        {renderForm}
        <Table<IListResponse>
          data={lists.value}
          columns={columns}
          pageSize={8}
          unsettings
          isSettingTable
          onClickAction={handleOnClick}
        />
      </div>
    </Modal>
  );
};
