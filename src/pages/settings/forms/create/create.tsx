import update from 'immutability-helper';
import { type FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { itemsForm } from './constants';
import { ButtonMenu } from '@/components/common';
import { FORM_ITEM, IFormElement } from '@/types';
import shortUUID from 'short-uuid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CardElement } from './card';
import { Field, Form } from 'react-final-form';
import { required } from '@/pages/onbording/validate';

interface IGeneralForm {
  label: string;
  description: string;
}
const generalFormInitState: IGeneralForm = {
  label: 'Nombre de Formulario',
  description: 'Descripciòn de Formularion',
};

export const FormCreateSettingPage: FunctionComponent = () => {
  const [elements, setElements] = useState<IFormElement[]>([]);
  const [selected, setSelected] = useState<string | undefined>();
  const [generalForm, setGeneralForm] =
    useState<IGeneralForm>(generalFormInitState);

  const getElement = (type: FORM_ITEM): IFormElement => {
    return {
      type,
      label: '',
      description: '',
      icon: '',
      admin: false,
      id: shortUUID.generate(),
    };
  };

  const selectMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'SPAN') {
      const menuClicked = target.getAttribute('name');
      if (!menuClicked) return;
      setElements([...elements, getElement(menuClicked as FORM_ITEM)]);
    }
  };

  const actionMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'SPAN') {
      const menuClicked = target.getAttribute('name');
      if (!menuClicked) return;
      const elementAction = menuClicked.split('-');
      if (elementAction.length < 1) return;
      actions(elementAction[0], elementAction[1]);
    }
  };

  const actions = (action: string, id: string) => {
    switch (action) {
      case 'remove':
        setElements(elements.filter((element) => element.id !== id));
        break;
      case 'setting':
        setSelected(id);
        setElements(
          elements.map((element) => ({
            ...element,
            selected: element.id === id,
          }))
        );
        break;
      default:
        console.log('No existe tal acciòn');
        break;
    }
  };

  const onSave = (value: any) => {
    if (!selected) {
      setGeneralForm(() => value);
      return;
    }

    setElements(
      elements.map((element) =>
        element.id === selected ? { ...element, ...value } : element
      )
    );
  };

  const onCancel = () => {
    setSelected(() => undefined);
  };

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setElements((prevCards: IFormElement[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);

  const renderCard = useCallback(
    (element: IFormElement, index: number) => {
      const id = `form-element-${element.id}`;
      return (
        <CardElement
          key={id}
          name={id}
          id={element.id}
          selected={element.selected && !!selected}
          index={index}
          element={element}
          moveCard={moveCard}
        />
      );
    },
    [selected]
  );

  useEffect(() => {
    document.title = 'Forms Create Settings';
  }, []);
  return (
    <section className='h-full'>
      <div className='flex flex-row'>
        <div className='w-7/12 relative'>
          <Form
            onSubmit={onSave}
            subscription={{ submitting: true, pristine: true }}
            // @ts-ignore
            render={({ handleSubmit, reset }) => (
              <form onSubmit={(event) => handleSubmit(event)?.then(reset)}>
                <div className='flex flex-col my-2 px-2 justify-center'>
                  <Field<string> name='label' validate={required}>
                    {({ input, meta }) => (
                      <div className='onboarding-inputs'>
                        <input
                          {...input}
                          placeholder='Nombre del Campo'
                          name='fm-input-name'
                          type='text'
                          aria-label='Field name input'
                        />
                        {meta.touched && meta.error && (
                          <span>{meta.error}</span>
                        )}
                      </div>
                    )}
                  </Field>
                  <Field<string> name='description' validate={required}>
                    {({ input, meta }) => (
                      <div className='onboarding-inputs'>
                        <input
                          {...input}
                          placeholder='Descripciòn del Campo'
                          name='fm-input-description'
                          type='text'
                          aria-label='Field description input'
                        />
                        {meta.touched && meta.error && (
                          <span>{meta.error}</span>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div className='absolute bottom-4 right-1/4'>
                  <button
                    className='onboarding-buttons bg-[#00BDD6] mx-1'
                    type='submit'
                  >
                    Save
                  </button>
                  <button
                    className='onboarding-buttons bg-[#A5ACBA] mx-1'
                    onClick={onCancel}
                    type='button'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          ></Form>
        </div>
        <div
          className='w-5/12 flex flex-col max-h-[80vh] mr-2 py-2 relative'
          onClick={actionMenu}
        >
          <div className='absolute z-40 top-5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-400 rounded-full' />
          <div className='absolute z-20 bottom-6 left-1/2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow text-white hover:bg-opacity-60'>
            <span
              className='cursor-pointer font-bold vx-icon vx-settings size-sm'
              onClick={onCancel}
            ></span>
          </div>
          <div className='flex flex-col bg-white border shadow-lg rounded-2xl w-[340px] h-[667px] overflow-y-auto mx-auto overflow-auto vox-scroll-design px-2 pt-6'>
            <div
              className={`${selected ? '' : 'bg-teal-300'} flex flex-col items-center justify-center mb-2 rounded-md py-2`}
            >
              <h3 className='font-bold text-xl'>{generalForm.label}</h3>
              <p className='font-thin text-sm text-gray-700'>
                {generalForm.description}
              </p>
            </div>
            <DndProvider backend={HTML5Backend}>
              {elements.map((card, i) => renderCard(card, i))}
            </DndProvider>
          </div>
        </div>
        <div
          onClick={selectMenu}
          className='flex flex-col my-1 px-2 text-center min-w-10 max-w-12 rounded-sm bg-gray-100'
        >
          {itemsForm.map((item) => (
            <ButtonMenu
              small
              icon={item.icon}
              label={item.label}
              name={item.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
