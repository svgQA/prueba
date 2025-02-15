import './home.css';
import { NAVBAR_MENUS } from '@/utils/menus';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { ModalServices } from './modal/modal.services';
// import { VOX_SOCIAL_MEDIA } from './constants';
// import { Waves } from '@/components/styles';
import { Navbar } from '@/components/common/navbar/navbar';
import { Logo } from '@/components/common/logo/logo';
// import { Layer } from '@/components/compose/layer';
import { Button } from '@/components/common/button/button';
import homeMainDesktop from '../../assets/image/home-main-desktop.png';
import homeWhyTryvooIconAnalitics from '../../assets/image/home-mobile-why-tryvoo.png';

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
            <div className='flex'>
              <div className='md:w-2/5 flex flex-col items-center text-left pl-10 pr-7 mt-7'>
                <h1 className='text-4xl mb-3 mt-3'>Transforma la Gestión de Operaciones Con Tryvoo</h1>
                <span className='mb-5 text-2xl'>Optimiza la gestión de actividades, recursos y activos, incluso sin <span className='font-bold'>conectividad para tus negocios</span></span>
                <Button
                  label='Agenda una Demo gratis'
                  type='button'
                  id='schedule'
                  name='schedule'
                  className='bg-[#43f876] text-[#393838] mb-4 mt-10'
                />
              </div>

              <div className='md:w-3/5 flex items-center overflow-hidden'>
                <img src={homeMainDesktop} alt="" className="w-[70vh] max-w-full object-contain" />
              </div>
            </div>

            <div className='bg-white text-center text-[#28787B]'>
              <h2 className='text-[#28787B] text-3xl pt-5'>¿Por que Tryvoo?</h2>
              <span className='text-[#28787B] pb-5 text-xl'>Simplifica. Optimiza. Crece</span>

              <div className='flex'>
                {/* <div className='md:w-1/2'>
                  <span className='font-bold'>El 60% de las empresas en LATAM buscan herramientas que mejoren la trazabilidad y reduzcan costos operativos</span>
                  <p className='hidden md:block'>Tryvoo está liderando esta transformación, gracias a la Digitalización y automatización completa de las actividades en campo, llegando a soluciones intuitivas, accesibles incluso sin conexión.</p>
                </div> */}

                <div className='md:w-1/2'>
                  {/* <div className="shadow-xl bg-white rounded-lg">
                    <div className="flex items-start space-x-4">
                      <img src={homeWhyTryvooIconAnalitics} alt="Gestión" className="w-8 h-8" />
                      <div className='text-left'>
                        <span>
                          <span className="font-bold text-gray-700">Fácil Gestión y Trazabilidad:</span>
                          <span className="text-gray-600 text-sm">"Control total sobre las operaciones en campo, con visibilidad y seguimiento en tiempo real."</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <img src={homeWhyTryvooIconAnalitics} alt="Gestión" className="w-8 h-8" />
                      <div className='text-left'>
                        <span>
                          <span className="font-bold text-gray-700">Asistencia con IA:</span>
                          <span className="text-gray-600 text-sm">"Recibe recomendaciones automáticas y soporte para tus operativos directamente en el terreno."</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <img src={homeWhyTryvooIconAnalitics} alt="Gestión" className="w-8 h-8" />
                      <div className='text-left'>
                        <span>
                          <span className="font-bold text-gray-700">Sincronización Offline:</span>
                          <span className="text-gray-600 text-sm">"Sigue gestionando incluso sin internet, y los datos se sincronizan al restaurar la conexión."</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <img src={homeWhyTryvooIconAnalitics} alt="Gestión" className="w-8 h-8" />
                      <div className='text-left'>
                        <span>
                          <span className="font-bold text-gray-700">Escalabilidad:</span>
                          <span className="text-gray-600 text-sm">"Adaptable a cualquier tamaño de empresa o industria, desde la vigilancia hasta la logística."</span>
                        </span>
                      </div>
                    </div>
                  </div> */}
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
