import { type ILogo } from './interface';

export const Logo = ({ title, slogan }: ILogo) => {
  return (
    <div className='flex flex-row items-center'>
      <span className='vx-icon vx-logo !text-5xl' />
      <div className='text-left mx-3'>
        <h1 className='font-bold uppercase'>{title}</h1>
        <p className='text-xs capitalize font-light'>{slogan}</p>
      </div>
    </div>
  );
};
