import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { itemsForm } from './constants';
import { ButtonMenu, Card, Input } from '@/components/common';
import { FORM_ITEM, IFormElement } from '@/types';
import shortUUID from 'short-uuid';

export const FormCreateSettingPage: FunctionComponent = () => {
  const [elements, setElements] = useState<IFormElement[]>([]);

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

  const closeMenu = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'SPAN') {
      const menuClicked = target.getAttribute('name');
      if (!menuClicked) return;
      const elementId = menuClicked.split('-')[1];
      setElements(elements.filter((element) => element.id !== elementId));
    }
  };

  useEffect(() => {
    document.title = 'Forms Create Settings';
  }, []);
  return (
    <section className='h-full'>
      <div className='flex flex-row'>
        <div className='flex flex-col w-full max-h-[80vh] overflow-auto vox-scroll-design mr-2'>
          <div>
            <Card name='header-create-form'>
              <div className='flex flex-col justify-between'>
                <Input
                  name='input-name-form'
                  placeholder='Form Name'
                  icon='apps'
                />
                <span className='my-2 w-full border-t-2'></span>
                <Input
                  name='input-description-form'
                  placeholder='Description'
                  icon='apps'
                />
              </div>
            </Card>
          </div>
          <div onClick={closeMenu}>
            {elements.map((element) => (
              <Card
                key={`element-${element.id}`}
                name={`element-${element.id}`}
              >
                <div className='relative h-20 w-full bg-red-100'>
                  <span
                    name={`element-${element.id}`}
                    className='cursor-pointer px-1 absolute font-bold vx-icon vx-apps top-0 right-1'
                  ></span>
                  {element.id}
                </div>
              </Card>
            ))}
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
