import './home.css';
import { Layer } from '@/components/compose';
import { Navbar, Logo } from '@/components/common';
import { NAVBAR_MENUS } from '@/utils/menus';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { ModalServices } from './modal/modal.services';
import { VOX_SOCIAL_MEDIA } from './constants';
import { Waves } from '@/components/styles';

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
          <Layer
            title='Gestión Simplificada de Recursos Informativos'
            subtitle='Todo lo Que Necesitas, Organizado Perfectamente'
            description='Facilita la gestión del conocimiento dentro de tu organización con herramientas poderosas para crear y compartir hitos informativos. Desde políticas internas hasta guías y tutoriales externos, organiza y distribuye contenido que empodera a tus empleados y mejora su productividad.'
          />
        )}
      </div>
      <footer className='overflow-y-hidden container-waves text-white absolute bottom-0 w-full h-48 flex content-center items-center'>
        <div className='px-5 absolute bottom-5 text-cyan-500'>
          {VOX_SOCIAL_MEDIA.map((media) => (
            <a key={media.id} id={media.id} href={media.href}>
              <span className={`vx-icon mx-2 vx-${media.icon}`} />
            </a>
          ))}
        </div>
        <Waves />
      </footer>
    </section>
  );
};
