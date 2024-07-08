import './home.css';
import { Navbar } from '@/components/common';
import { NAVBAR_MENUS } from '@/utils/constants/navbar';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const HomeLayout: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Voxline';
  }, []);
  return (
    <section className='relative'>
      <header>
        <Navbar
          id='voxline-navbar'
          name='voxline-navbar'
          menus={NAVBAR_MENUS}
          logo={
            <div className='flex flex-row items-center'>
              <span className='vx-icon vx-logo' />
              <div className='text-left mx-3'>
                <h1 className='font-bold'>VOXLINE</h1>
                <p className='text-xs capitalize font-light'>
                  Make your Dreams
                </p>
              </div>
            </div>
          }
        />
      </header>
      {/* No tocar esta parte */}
      <div className='w-full h-screen pt-10 bg-gradient-to-r from-cyan-500 to-emerald-400'></div>
      <div className='cursor-pointer hover:bg-cyan-600 absolute bottom-20 right-14 text-white bg-cyan-500 h-20 w-20 rounded-full text-center content-center z-10'>
        <span className='absolute text-left px-5 -top-16 min-w-80 -left-64 bg-white text-cyan-500 rounded-xl py-2'>
          ¿En què te podemos Ayudar?
          <span className='absolute w-10 h-10 bg-white rotate-45 right-2'></span>
        </span>
        <span className='vx-icon vx-users size-xl' />
      </div>
      <footer className='overflow-y-hidden container-waves text-white absolute bottom-0 w-full h-48 flex content-center items-center'>
        <div className='px-5 absolute bottom-5 text-cyan-500'>
          <a href='#' name='link-to-facebook'>
            <span className='vx-icon vx-logo mx-2' />
          </a>
          <a href='#' name='link-to-instagram'>
            <span className='vx-icon vx-settings mx-2' />
          </a>
          <a href='#' name='link-to-youtube'>
            <span className='vx-icon vx-gateway mx-2' />
          </a>
          <a href='#' name='link-to-twitter'>
            <span className='vx-icon vx-sensor mx-2' />
          </a>
        </div>
        <svg
          className='waves'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          viewBox='0 24 150 28'
          preserveAspectRatio='none'
          shapeRendering='auto'
        >
          <defs>
            <path
              id='gentle-wave'
              d='M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z'
            />
          </defs>
          <g className='parallax'>
            <use
              xlinkHref='#gentle-wave'
              x='48'
              y='0'
              fill='rgba(255,255,255,0.7)'
            />
            <use
              xlinkHref='#gentle-wave'
              x='48'
              y='3'
              fill='rgba(255,255,255,0.5)'
            />
            <use
              xlinkHref='#gentle-wave'
              x='48'
              y='5'
              fill='rgba(255,255,255,0.8)'
            />
            <use
              xlinkHref='#gentle-wave'
              x='48'
              y='7'
              fill='rgba(255,255,255,1)'
            />
          </g>
        </svg>
      </footer>
    </section>
  );
};
