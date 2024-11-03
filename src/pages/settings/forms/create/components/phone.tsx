// import { IFormElement } from '@/types';
// import update from 'immutability-helper';
// import { useCallback, useState } from 'preact/hooks';
// import { CardElement } from './card';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// interface IGeneralForm {
//   label: string;
//   description: string;
// }
// const generalFormInitState: IGeneralForm = {
//   label: 'Nombre de Formulario',
//   description: 'Descripciòn de Formularion',
// };

// export const FormPhoneViewer = () => {
//   const [selected, setSelected] = useState<string | undefined>();
//   const [elements, setElements] = useState<IFormElement[]>([]);
//   const [generalForm, setGeneralForm] =
//     useState<IGeneralForm>(generalFormInitState);
//   const onCancel = () => {
//     setSelected(() => undefined);
//   };

//   const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
//     setElements((prevCards: IFormElement[]) =>
//       update(prevCards, {
//         $splice: [
//           [dragIndex, 1],
//           [hoverIndex, 0, prevCards[dragIndex]],
//         ],
//       })
//     );
//   }, []);

//   const renderCard = useCallback(
//     (element: IFormElement, index: number) => {
//       const id = `form-element-${element.id}`;
//       return (
//         <CardElement
//           key={id}
//           name={id}
//           id={element.id}
//           selected={element.selected && !!selected}
//           index={index}
//           element={element}
//           moveCard={moveCard}
//         />
//       );
//     },
//     [selected]
//   );
//   const actions = (action: string, id: string) => {
//     if (selected === id) return;
//     switch (action) {
//       case 'remove':
//         setElements(elements.filter((element) => element.id !== id));
//         break;
//       case 'setting':
//         setSelected(id);
//         setElements(
//           elements.map((element) => ({
//             ...element,
//             selected: element.id === id,
//           }))
//         );
//         break;
//       default:
//         console.log('No existe tal acciòn');
//         break;
//     }
//   };
//   const actionMenu = (event: MouseEvent) => {
//     const target = event.target as HTMLElement;
//     if (target.nodeName === 'SPAN') {
//       const menuClicked = target.getAttribute('name');
//       if (!menuClicked) return;
//       const elementAction = menuClicked.split('-');
//       if (elementAction.length < 1) return;
//       actions(elementAction[0], elementAction[1]);
//     }
//   };
//   return (
//     <div
//       className='w-5/12 flex flex-col max-h-[80vh] mr-2 py-2 relative bg-red-100'
//       onClick={actionMenu}
//     >
//       <div className='absolute z-40 top-5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-400 rounded-full' />
//       <div className='absolute z-20 bottom-6 left-1/2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow text-white hover:bg-opacity-60'>
//         <span
//           className='cursor-pointer font-bold vx-icon vx-settings size-sm'
//           onClick={onCancel}
//         ></span>
//       </div>
//       <div className='flex flex-col bg-white border shadow-lg rounded-2xl w-[340px] h-[667px] overflow-y-auto mx-auto overflow-auto vox-scroll-design px-2 pt-6 padd'>
//         <div
//           className={`${selected ? '' : 'bg-teal-300'} flex flex-col items-center justify-center mb-2 rounded-md py-2`}
//         >
//           <h3 className='font-bold text-xl'>{generalForm.label}</h3>
//           <p className='font-thin text-sm text-gray-700'>
//             {generalForm.description}
//           </p>
//         </div>
//         <DndProvider backend={HTML5Backend}>
//           {elements.map((card, i) => renderCard(card, i))}
//         </DndProvider>
//       </div>
//     </div>
//   );
// };
