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
import homeWhyTryvooIconAnalitics from '../../assets/image/home-icon-analitics.jpg';
import homeService1 from '../../assets/image/home-service-1.svg';
import homeService2 from '../../assets/image/home-service-2.svg';
import homeService3 from '../../assets/image/home-service-3.svg';
import homeService4 from '../../assets/image/home-service-4.svg';
import homeSolution1 from '../../assets/image/home-solution-1.svg';
import homeWeCenter from '../../assets/image/home-we-center.png';

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
                <img src={homeMainDesktop} alt="" className="w-[90vh] max-w-full object-contain" />
              </div>
            </div>

            <div className='bg-white text-center text-[#28787B]'>
              <h2 className='text-[#28787B] text-3xl pt-5'>¿Por que Tryvoo?</h2>
              <span className='text-[#28787B] pb-5 text-xl'>Simplifica. Optimiza. Crece</span>

              <div className='flex mt-7'>
                <div className='md:w-1/2'>
                  <span className='font-bold text-2xl'>El 60% de las empresas en LATAM buscan herramientas que mejoren la trazabilidad y reduzcan costos operativos</span>
                  <p className='hidden md:block text-xl'>Tryvoo está liderando esta transformación, gracias a la Digitalización y automatización completa de las actividades en campo, llegando a soluciones intuitivas, accesibles incluso sin conexión.</p>
                </div>

                <div className='md:w-1/2'>
                  <div className="shadow-xl bg-white rounded-lg">
                    <div className="flex items-start space-x-4 p-5">
                      <img src={homeWhyTryvooIconAnalitics} alt="Gestión" className="w-8 h-8" />
                      <div className='text-left'>
                        <span>
                          <span className="font-bold text-gray-700 text-xl">Fácil Gestión y Trazabilidad:</span>
                          <span className="text-gray-600 text-sm text-xl">"Control total sobre las operaciones en campo, con visibilidad y seguimiento en tiempo real."</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-5">
                      <img src={homeWhyTryvooIconAnalitics} alt="Gestión" className="w-8 h-8" />
                      <div className='text-left'>
                        <span>
                          <span className="font-bold text-gray-700 text-xl">Asistencia con IA:</span>
                          <span className="text-gray-600 text-sm text-xl">"Recibe recomendaciones automáticas y soporte para tus operativos directamente en el terreno."</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-5">
                      <img src={homeWhyTryvooIconAnalitics} alt="Gestión" className="w-8 h-8" />
                      <div className='text-left'>
                        <span>
                          <span className="font-bold text-gray-700 text-xl">Sincronización Offline:</span>
                          <span className="text-gray-600 text-sm text-xl">"Sigue gestionando incluso sin internet, y los datos se sincronizan al restaurar la conexión."</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-5">
                      <img src={homeWhyTryvooIconAnalitics} alt="Gestión" className="w-8 h-8" />
                      <div className='text-left'>
                        <span>
                          <span className="font-bold text-gray-700 text-xl">Escalabilidad:</span>
                          <span className="text-gray-600 text-sm text-xl">"Adaptable a cualquier tamaño de empresa o industria, desde la vigilancia hasta la logística."</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                label='Conoce todas las posibilidades'
                type='button'
                id='schedule'
                name='schedule'
                className='bg-[#20314F] text-[#FFFF] mb-4 mt-7 mb-10'
              />
            </div>

            <div className='flex flex-col items-center text-center bg-white text-[#28787B]'>
              <span className='text-3xl font-bold'>Servicios destacados</span>
              <span className='text-xl'>Todo lo que necesitas en una sola plataforma</span>

              <div className='flex flex-wrap gap-6 justify-center mt-7'>
                <div class="flex flex-col items-center text-center max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white p-6 border border-gray-200">
                  <img class="w-auto h-48 object-cover rounded-lg" src={homeService1} alt="Card Image" />
                  <div class="mt-4">
                    <h2 class="text-xl font-semibold text-gray-900">Monitorio en Tiempo Real</h2>
                    <p class="text-gray-600 mt-2">Visualiza el progreso de las tareas y el estado de los activos con actualizaciones automáticas y basadas en datos en tiempo real.</p>
                  </div>
                </div>

                <div class="flex flex-col items-center text-center max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white p-6 border border-gray-200">
                  <img class="w-auto h-48 object-cover rounded-lg" src={homeService2} alt="Card Image" />
                  <div class="mt-4">
                    <h2 class="text-xl font-semibold text-gray-900">Capacidades Offline</h2>
                    <p class="text-gray-600 mt-2">Los operarios pueden seguir trabajando sin conexión, y todos los datos se sincronizan cuando la conexión a Internet es restaurada.</p>
                  </div>
                </div>

                <div class="flex flex-col items-center text-center max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white p-6 border border-gray-200">
                  <img class="w-auto h-48 object-cover rounded-lg" src={homeService3} alt="Card Image" />
                  <div class="mt-4">
                    <h2 class="text-xl font-semibold text-gray-900">IA y Soporte Virtual</h2>
                    <p class="text-gray-600 mt-2">Tu asistente virtual para resolver problemas en campo, con recomendaciones basadas en los datos que se capturan durante las operaciones.</p>
                  </div>
                </div>

                <div class="flex flex-col items-center text-center max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white p-6 border border-gray-200">
                  <img class="w-auto h-48 object-cover rounded-lg" src={homeService4} alt="Card Image" />
                  <div class="mt-4">
                    <h2 class="text-xl font-semibold text-gray-900">Integración y Personalización</h2>
                    <p class="text-gray-600 mt-2">Fácil integración con herramientas ya existentes y una plataforma que se adapta a las necesidades de cada sector.</p>
                    {/* <button class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                      Ver más
                    </button> */}
                  </div>
                </div>
              </div>

              <Button
                label='Ver detalle'
                type='button'
                id='schedule'
                name='schedule'
                className='bg-[#20314F] text-[#FFFF] mb-4 mt-10'
              />
            </div>

            <div className='flex flex-col items-center text-center bg-white text-[#28787B]'>
              <span className='text-3xl font-bold'>Soluciones por industria</span>
              <span className='text-xl'>Tryvoo esta optimizado para diferentes sectores.</span>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 mb-10'>
                <div class="flex items-center bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-md">
                  <div class="bg-[#26B6D4] p-4 rounded-lg">
                    <img src={homeSolution1} alt="" />
                  </div>
                  <div class="ml-4 text-left">
                    <h2 class="text-lg font-semibold text-gray-900">Salud</h2>
                    <p class="text-gray-600 text-sm">
                      Gestiona a los técnicos de salud, realiza un seguimiento de las visitas domiciliarias y administra las solicitudes en tiempo real.
                    </p>
                  </div>
                </div>

                <div class="flex items-center bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-md">
                  <div class="bg-[#26B6D4] p-4 rounded-lg">
                    <img src={homeSolution1} alt="" />
                  </div>
                  <div class="ml-4 text-left">
                    <h2 class="text-lg font-semibold text-gray-900">Salud</h2>
                    <p class="text-gray-600 text-sm">
                      Gestiona a los técnicos de salud, realiza un seguimiento de las visitas domiciliarias y administra las solicitudes en tiempo real.
                    </p>
                  </div>
                </div>

                <div class="flex items-center bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-md">
                  <div class="bg-[#26B6D4] p-4 rounded-lg">
                    <img src={homeSolution1} alt="" />
                  </div>
                  <div class="ml-4 text-left">
                    <h2 class="text-lg font-semibold text-gray-900">Salud</h2>
                    <p class="text-gray-600 text-sm">
                      Gestiona a los técnicos de salud, realiza un seguimiento de las visitas domiciliarias y administra las solicitudes en tiempo real.
                    </p>
                  </div>
                </div>


                <div class="flex items-center bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-md">
                  <div class="bg-[#26B6D4] p-4 rounded-lg">
                    <img src={homeSolution1} alt="" />
                  </div>
                  <div class="ml-4 text-left">
                    <h2 class="text-lg font-semibold text-gray-900">Salud</h2>
                    <p class="text-gray-600 text-sm">
                      Gestiona a los técnicos de salud, realiza un seguimiento de las visitas domiciliarias y administra las solicitudes en tiempo real.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                label='Inicia prueba gratis!'
                type='button'
                id='schedule'
                name='schedule'
                className='bg-[#20314F] text-[#FFF] mb-4'
              />
            </div>

            <div className='flex flex-col items-center text-center bg-white text-[#28787B]'>
              <span className='text-3xl font-bold'>Quienes somos</span>
              <span className='text-xl'>En Tryvoo, entedemos las complejidades de operar fuera de la oficina.</span>

              <div className='mt-7'>
                <img src={homeWeCenter} alt="" className='w-auto h-[50vh]'/>
              </div>
            </div>

            <div className='flex flex-col items-center text-center bg-white text-[#28787B]'>
              <span className='text-3xl font-bold'>Nuestros planes</span>
              <span className='text-xl'>Elige el plan perfecto para tu negocio y transforma tus operaciones de campo. Comienza con Tryvoo hoy mismo!</span>
            </div>

            <div>
              <div>
                <span>Te brindamos asesoria gratuita</span>
              </div>
              <div>
                <span>Para que comiences optimizar tu negocio con herramientas ágiles y operables en cualquiers espacio y lugar</span>
              </div>
              <div>
                <Button
                  label='Inicia ya y disfruta'
                  type='button'
                  id='schedule'
                  name='schedule'
                  className='bg-[#43f876] text-[#393838] mb-4'
                />
              </div>
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
