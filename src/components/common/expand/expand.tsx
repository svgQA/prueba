// import { type FunctionComponent } from 'preact';
// import { type IExpandProps } from './interface';
// import { useState } from 'preact/hooks';

// export const Expand: FunctionComponent<IExpandProps> = ({
//   id,
//   name,
//   children,
//   header,
//   icon,
// }: IExpandProps) => {
//   const [status, setStatus] = useState<boolean>(false);
//   const onToggle = () => {
//     setStatus(!status);
//   };

//   return (
//     <div
//       id={id}
//       name={name}
//       className='capitalize w-full rounded p-2 my-1 flex flex-col relative'
//     >
//       <span
//         className='bottom-1 left-[45%] absolute rounded-xl w-20 h-1 cursor-pointer'
//         onClick={onToggle}
//       ></span>
//       <div className='h-20 w-100 overflow-hidden flex flex-row relative'>
//         <div className='w-full'>{header}</div>
//         <div className='p-5'>
//           <span className={`vx-icon ${icon || 'vx-apps'}`}></span>
//         </div>
//       </div>
//       <div className={`${status ? '' : 'hidden'} py-1 border-t`}>
//         {children}
//       </div>
//     </div>
//   );
// };
