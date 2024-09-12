import { ISearchProps } from './interface';

export const Search = ({ id, name }: ISearchProps) => {
  return (
    <div
      id={id}
      name={name}
      className='w-full flex flex-row items-center border-2 rounded-sm relative'
    >
      <span className='left-0 px-2 vx-icon vx-search border-r-2' />
      <div className='relative border-gray-300 rounded flex items-center w-full'>
        <input className='w-full p-2 rounded pl-10 bg-transparent capitalize' />
      </div>
      {/*
      <div className='absolute right-0 w-48 bg-white border-2 -bottom-7'>
        text
      </div>
      */}
    </div>
  );
};
