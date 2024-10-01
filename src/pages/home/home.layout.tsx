import './home.css';
import { Layer } from '@/components/compose';
import { Navbar, Logo, Button } from '@/components/common';
import { NAVBAR_MENUS } from '@/utils/constants/navbar';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { ModalServices } from './modal/modal.services';
import { TenantService } from '@/services';

export const HomeLayout: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Voxline';
  }, []);

  const [homeMenu, setHomeMenu] = useState<string>('/');

  const onHandlerNavbarButton = (menu: string) => {
    setHomeMenu(menu);
  };

  const onMakeRequest = async () => {
    const response = await TenantService.get_tenants();
    if (response.getStatus()) {
      console.log(response.getMany());
    }
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
          <Layer
            title='Gestión Simplificada de Recursos Informativos'
            subtitle='Todo lo Que Necesitas, Organizado Perfectamente'
            description='Facilita la gestión del conocimiento dentro de tu organización con herramientas poderosas para crear y compartir hitos informativos. Desde políticas internas hasta guías y tutoriales externos, organiza y distribuye contenido que empodera a tus empleados y mejora su productividad.'
          />
        )}
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
          <Button
            onClick={onMakeRequest}
            name='Button'
            type='button'
            label='Button'
          />
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
