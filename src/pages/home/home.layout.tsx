import './home.css';
import { Layer } from '@/components/compose';
import { Navbar, Logo } from '@/components/common';
import { NAVBAR_MENUS } from '@/utils/constants/navbar';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { PAGES_LIST } from '@/utils';
import { SignupPage } from '../signup/signup.page';
import { SigninPage } from '../signin/signin.page';
import { ModalServices } from './modal/modal.services';

export const HomeLayout: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Voxline';
  }, []);

  const [homeMenu, setHomeMenu] = useState<string>('/');

  const onHandlerNavbarButton = (menu: string) => {
    setHomeMenu(menu);
  };

  return (
    <section className='relative overflow-hidden'>
      <Navbar
        id='voxline-navbar'
        name='voxline-navbar'
        menus={NAVBAR_MENUS}
        onActionHandler={onHandlerNavbarButton}
        logo={<Logo title='voxline' slogan='make your dreams' />}
        service={<ModalServices label='Services' />}
      />

      <div className='w-full h-screen pt-16 bg-gradient-to-r from-cyan-500 to-emerald-400 content-center'>
        {homeMenu === '/' && (
          <>
            <Layer
              title='Gestión Simplificada de Recursos Informativos'
              subtitle='Todo lo Que Necesitas, Organizado Perfectamente'
              description='Facilita la gestión del conocimiento dentro de tu organización con herramientas poderosas para crear y compartir hitos informativos. Desde políticas internas hasta guías y tutoriales externos, organiza y distribuye contenido que empodera a tus empleados y mejora su productividad.'
            />
          </>
        )}
        {homeMenu === PAGES_LIST.SIGNIN && (
          // <Layer
          //   title='SIGNIN'
          //   subtitle='Revoluciona la Comunicación Interna con Información Accesible'
          //   description='Eleva la experiencia de tus empleados con un acceso transparente y directo a la información que importa. Aprovecha nuestra plataforma para garantizar que todos en tu organización tengan la información necesaria para tomar decisiones informadas y actuar con confianza.'
          // >
          // </Layer>
          <div className='flex justify-center items-center w-full h-full -mt-20'>
            <SigninPage />
          </div>
        )}
        {homeMenu === PAGES_LIST.SIGNUP && (
          // <Layer
          //   title='SIGNUP'
          //   subtitle='Acceso Instantáneo a Recursos Clave, en Cualquier Momento y en Cualquier Lugar'
          //   description='Descubre la eficiencia de tener toda la información crítica de la empresa al alcance de tu mano. Nuestro Módulo de Información te permite navegar, visualizar y acceder a recursos esenciales con solo unos clics. Ideal para empleados que necesitan respuestas rápidas y administradores que buscan distribuir información vital de manera efectiva.'
          // >
          // </Layer>
          <div className='flex justify-center items-center w-full h-full -mt-20'>
            <SignupPage />
          </div>
        )}
      </div>
      {/*
      <div className='cursor-pointer hover:bg-cyan-600 absolute bottom-20 right-14 text-white bg-cyan-500 h-20 w-20 rounded-full text-center content-center z-10'>
        <span className='absolute text-left px-5 -top-16 min-w-80 -left-64 bg-white text-cyan-500 rounded-xl py-2'>
          ¿En què te podemos Ayudar?
          <span className='absolute w-10 h-10 bg-white rotate-45 right-2'></span>
        </span>
        <span className='vx-icon vx-users size-xl' />
      </div>
      */}
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
