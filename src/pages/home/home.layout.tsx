import './home.css';
import { NAVBAR_MENUS } from '@/utils/menus';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { ModalServices } from './modal/modal.services';
import { VOX_SOCIAL_MEDIA } from './constants';
import { Waves } from '@/components/styles';
import { Navbar } from '@/components/common/navbar/navbar';
import { Logo } from '@/components/common/logo/logo';
import { Layer } from '@/components/compose/layer';
import { Button } from '@/components/common/button/button';

export const HomeLayout: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Voxline';
  }, []);

  const [homeMenu, setHomeMenu] = useState<string>('/');

  const onHandlerNavbarButton = (menu: string) => {
    setHomeMenu(menu);
  };

  return (
    <section className='relative overflow-hidden text-t-dark'>
      <Navbar
        id='voxline-navbar'
        name='voxline-navbar'
        menus={NAVBAR_MENUS}
        onActionHandler={onHandlerNavbarButton}
        logo={<Logo title='voxline' slogan='make your dreams' />}
        service={<ModalServices label='Services' />}
      />
      <div className='w-full pt-16 bg-gradient-to-r from-cyan-500 to-emerald-400 content-center'>
        {homeMenu === '/' && (
          // <Layer
          //   title='Gestión Simplificada de Recursos Informativos'
          //   subtitle='Todo lo Que Necesitas, Organizado Perfectamente'
          //   description='Facilita la gestión del conocimiento dentro de tu organización con herramientas poderosas para crear y compartir hitos informativos. Desde políticas internas hasta guías y tutoriales externos, organiza y distribuye contenido que empodera a tus empleados y mejora su productividad.'
          // />
          <>
            <div>
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-4xl mb-3 mt-3'>Transforma la Gestión de Operaciones Con Tryvoo</h1>
                <span className='mb-5 text-2xl'>Optimiza la gestión de actividades, recursos y activos, incluso sin <span className='font-bold'>conectividad para tus negocios</span></span>
                <Button
                  label='Agenda una Demo gratis'
                  type='button'
                  id='schedule'
                  name='schedule'
                  className='bg-[#43f876] text-[#393838] mb-4'
                />
              </div>

              <div></div>
            </div>

            <div className='bg-white text-center text-[#28787B]'>
              <h2 className='text-[#28787B] text-3xl pt-5'>¿Por que Tryvoo?</h2>
              <span className='text-[#28787B] pb-5 text-xl'>Simplifica. Optimiza. Crece</span>

              <div>
                <div>
                  <span className='font-bold'>El 60% de las empresas en LATAM buscan herramientas que mejoren la trazabilidad y reduzcan costos operativos</span>
                  <p className='hidden md:block'>Tryvoo está liderando esta transformación, gracias a la Digitalización y automatización completa de las actividades en campo, llegando a soluciones intuitivas, accesibles incluso sin conexión.</p>
                </div>

                <div>

                </div>
              </div>
            </div>

            <div className='flex flex-col items-center text-center bg-white text-[#28787B]'>
              <span className='text-3xl font-bold'>Servicios destacados</span>
              <span className='text-xl'>Todo lo que necesitas en una sola plataforma</span>
            </div>

            <div className='flex flex-col items-center text-center bg-white text-[#28787B]'>
              <span className='text-3xl font-bold'>Soluciones por industria</span>
              <span className='text-xl'>Tryvoo esta optimizado para diferentes sectores.</span>
            </div>

            <div className='flex flex-col items-center text-center bg-white text-[#28787B]'>
              <span className='text-3xl font-bold'>Quienes somos</span>
              <span className='text-xl'>En Tryvoo, entedemos las complejidades de operar fuera de la oficina.</span>
            </div>

            <div className='flex flex-col items-center text-center bg-white text-[#28787B]'>
              <span className='text-3xl font-bold'>Nuestros planes</span>
              <span className='text-xl'>Elige el plan perfecto para tu negocio y transforma tus operaciones de campo. Comienza con Tryvoo hoy mismo!</span>
            </div>
          </>
        )}
      </div>
      {/* <footer className='overflow-y-hidden container-waves text-white absolute bottom-0 w-full h-48 flex content-center items-center'>
        <div className='px-5 absolute bottom-5 text-cyan-500'>
          {VOX_SOCIAL_MEDIA.map((media) => (
            <a key={media.id} id={media.id} href={media.href}>
              <span className={`vx-icon mx-2 vx-${media.icon}`} />
            </a>
          ))}
        </div>
        <Waves />
      </footer> */}
    </section>
  );
};
