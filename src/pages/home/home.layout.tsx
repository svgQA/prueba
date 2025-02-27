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
import homeWhyTryvooIconReason from '../../assets/image/home-icon-reason.jpg';
import homeWhyTryvooIconPlace from '../../assets/image/home-icon-place.jpg';
import homeWhyTryvooIconScalar from '../../assets/image/home-icon-scalar.jpg';

import homeService1 from '../../assets/image/home-service-1.svg';
import homeService2 from '../../assets/image/home-service-2.svg';
import homeService3 from '../../assets/image/home-service-3.svg';
import homeService4 from '../../assets/image/home-service-4.svg';

import homeSolution1 from '../../assets/image/home-solution-1.svg';
import homeSolution2 from '../../assets/image/home-solution-2.svg';
import homeSolution3 from '../../assets/image/home-solution-3.svg';
import homeSolution4 from '../../assets/image/home-solution-4.svg';

import homeWeCenter from '../../assets/image/home-we-center.png';
import homeWithTryvooDesktop from '../../assets/image/home-desktop-with-tryvoo.png';

import socialIcon1 from '../../assets/image/icon1.svg';
import socialIcon2 from '../../assets/image/icon2.svg';
import socialIcon3 from '../../assets/image/icon3.svg';

export const HomeLayout: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Voxline';
  }, []);

  const [homeMenu, setHomeMenu] = useState<string>('/');

  const onHandlerNavbarButton = (menu: string) => {
    setHomeMenu(menu);
  };

  const Main = () => {
    return (
      <div className='flex relative'>
        <div className='md:w-2/5 flex flex-col items-center text-left pl-10 pr-7 mt-7 mb-7'>
          <h1 className='text-4xl mb-3 mt-3'>
            Transforma la Gestión de Operaciones Con Tryvoo
          </h1>
          <span className='mb-5 text-2xl mt-5'>
            Optimiza la gestión de actividades, recursos y activos, incluso sin{' '}
            <span className='font-bold'>conectividad para tus negocios</span>
          </span>
          <Button
            label='Agenda una Demo gratis'
            type='button'
            id='schedule'
            name='schedule'
            className='bg-[#43f876] text-[#393838] mb-7 mt-10 text-xl rounded-full !p-5'
          />
        </div>

        <div className='md:w-3/5 flex items-center overflow-hidden'>
          <img
            src={homeMainDesktop}
            alt=''
            className='w-[95vh] max-w-full object-contain z-[10]'
          />
        </div>

        <div class='absolute bottom-0 left-0 w-full h-[5vh] bg-white'> </div>
      </div>
    );
  };

  const WhyTryvoo = () => {
    const items: any = [
      {
        id: 1,
        title: 'Fácil Gestión y Trazabilidad:',
        subtitle:
          '"Control total sobre las operaciones en campo, con visibilidad y seguimiento en tiempo real."',
        image: homeWhyTryvooIconAnalitics,
      },
      {
        id: 2,
        title: 'Asistencia con IA:',
        subtitle:
          '"Recibe recomendaciones automáticas y soporte para tus operativos directamente en el terreno."',
        image: homeWhyTryvooIconReason,
      },
      {
        id: 3,
        title: 'Sincronización Offline:',
        subtitle:
          '"Sigue gestionando incluso sin internet, y los datos se sincronizan al restaurar la conexión."',
        image: homeWhyTryvooIconPlace,
      },
      {
        id: 4,
        title: 'Escalabilidad:',
        subtitle:
          '"Adaptable a cualquier tamaño de empresa o industria, desde la vigilancia hasta la logística."',
        image: homeWhyTryvooIconScalar,
      },
    ];

    return (
      <div className='bg-white text-center text-[#28787B]'>
        <h2 className='text-[#28787B] text-3xl pt-5'>¿Por que Tryvoo?</h2>
        <span className='text-[#28787B] pb-5 text-xl'>
          Simplifica. Optimiza. Crece
        </span>

        <div className='flex mt-7'>
          <div className='md:w-1/2 flex flex-col items-center'>
            <img
              src={homeWithTryvooDesktop}
              alt=''
              className='w-[50%] h-auto'
            />
            <span className='font-bold text-2xl ml-10 mr-10 text-left'>
              El 60% de las empresas en LATAM buscan herramientas que mejoren la
              trazabilidad y reduzcan costos operativos
            </span>
            <p className='hidden md:block text-xl ml-10 mr-10 mt-5 text-left'>
              Tryvoo está liderando esta transformación, gracias a la
              Digitalización y automatización completa de las actividades en
              campo, llegando a soluciones intuitivas, accesibles incluso sin
              conexión.
            </p>
          </div>

          <div className='md:w-1/2 mt-7'>
            <div className='shadow-xl bg-white rounded-lg'>
              {items.map((item: any, index: number) => (
                <div key={index}>
                  <div className='flex items-start space-x-4 p-5'>
                    <img src={item.image} alt='Gestión' className='w-16 h-16' />

                    <div className='text-left'>
                      <span>
                        <span className='font-bold text-gray-700 text-xl'>
                          {item.title}
                        </span>
                        <span className='text-gray-600 text-sm text-xl'>
                          {item.subtitle}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div class='w-[90%] h-px bg-[#CECECE]'></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          label='Conoce todas las posibilidades'
          type='button'
          id='schedule'
          name='schedule'
          className='bg-[#20314F] text-[#FFFF] mb-4 mt-7 mb-10 text-xl rounded-full !p-5'
        />
      </div>
    );
  };

  const Services = () => {
    const items: any[] = [
      {
        id: 1,
        title: 'Monitorio en Tiempo Real',
        subtitle:
          'Visualiza el progreso de las tareas y el estado de los activos con actualizaciones automáticas y basadas en datos en tiempo real.',
        image: homeService1,
      },
      {
        id: 2,
        title: 'Capacidades Offline',
        subtitle:
          'Los operarios pueden seguir trabajando sin conexión, y todos los datos se sincronizan cuando la conexión a Internet es restaurada.',
        image: homeService2,
      },
      {
        id: 3,
        title: 'IA y Soporte Virtual',
        subtitle:
          'Tu asistente virtual para resolver problemas en campo, con recomendaciones basadas en los datos que se capturan durante las operaciones.',
        image: homeService3,
      },
      {
        id: 4,
        title: 'Integración y Personalización',
        subtitle:
          'Fácil integración con herramientas ya existentes y una plataforma que se adapta a las necesidades de cada sector.',
        image: homeService4,
      },
    ];

    return (
      <div className='flex flex-col items-center text-center bg-white text-[#28787B] pt-[70px]'>
        <span className='text-3xl font-bold text-[#349396]'>
          Servicios destacados
        </span>
        <span className='text-xl text-[#349396]'>
          Todo lo que necesitas en una sola plataforma
        </span>

        <div className='flex flex-wrap gap-6 justify-center mt-7'>
          {items.map((item: any, index: number) => (
            <div
              key={index}
              class='flex flex-col items-center text-center max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white p-6 border border-gray-200'
            >
              <img
                class='w-auto h-48 object-cover rounded-lg'
                src={item.image}
                alt='Card Image'
              />
              <div class='mt-4'>
                <h2 class='text-2xl font-semibold text-[#349396]'>
                  {item.title}
                </h2>
                <p class='text-[#349396] mt-2'>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          label='Ver detalle'
          type='button'
          id='schedule'
          name='schedule'
          className='bg-[#20314F] text-[#FFFF] mb-4 mt-10 text-xl rounded-full !p-5 !w-[400px]'
        />
      </div>
    );
  };

  const Solutions = () => {
    const items: any[] = [
      {
        id: 1,
        title: 'Seguridad',
        subtitle:
          'Gestiona rondas de vigilancia, genera reportes de incidentes y asegura un control completo sobre las actividades de los operarios.',
        image: homeSolution1,
      },
      {
        id: 2,
        title: 'Logística',
        subtitle:
          'Rastrea vehículos, monitorea entregas y optimiza la asignación de rutas para maximizar la eficiencia.',
        image: homeSolution2,
      },
      {
        id: 3,
        title: 'Construcción',
        subtitle:
          'Coordina las tareas de los trabajadores en campo, controla los recursos y realiza un seguimiento de los avances del proyecto.',
        image: homeSolution3,
      },
      {
        id: 4,
        title: 'Salud',
        subtitle:
          'Gestiona a los técnicos de salud, realiza un seguimiento de las visitas domiciliarias y administra las solicitudes en tiempo real.',
        image: homeSolution4,
      },
    ];

    return (
      <div className='flex flex-col items-center text-center bg-white text-[#28787B] pt-[70px]'>
        <span className='text-3xl font-bold mb-5 text-[#28787B]'>
          Soluciones por industria
        </span>
        <span className='text-xl text-[#505050]'>
          Tryvoo esta optimizado para diferentes sectores.
        </span>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 mb-10'>
          {items.map((item: any, index: number) => (
            <div
              key={index}
              class='flex items-center bg-white shadow-lg rounded-lg border border-gray-200 max-w-lg'
            >
              <div class='bg-[#26B6D4] p-4 rounded-lg h-full w-auto'>
                <img
                  src={item.image}
                  alt=''
                  className='!h-[100%] w-auto ml-1 mr-7'
                />
              </div>
              <div class='text-left p-4'>
                <h2 class='text-2xl font-semibold text-[#505050]'>
                  {item.title}
                </h2>
                <p class='text-[#505050] text-lg'>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          label='Inicia prueba gratis!'
          type='button'
          id='schedule'
          name='schedule'
          className='bg-[#20314F] text-[#FFF] mb-4 text-xl rounded-full !p-5'
        />
      </div>
    );
  };

  const We = () => {
    return (
      <div className='flex flex-col items-center text-center bg-white pt-[70px]'>
        <span className='text-3xl font-bold text-[#20314F]'>Quienes somos</span>
        <span className='text-xl text-[#505050]'>
          En Tryvoo, entedemos las complejidades de operar fuera de la oficina.
        </span>

        <div className='mt-7 flex items-center justify-center'>
          <div className='w-[25%] shadow-xl bg-white rounded-lg p-[20px]'>
            <span className='text-[#707070] text-2xl ml-[20px]'>
              En Tryvoo trabajamos para que tu equipo en campo tenga las
              herramientas necesarias para lograr más, con seguridad y
              eficiencia, en cualquier lugar.
            </span>
          </div>
          <img src={homeWeCenter} alt='' className='w-[20%] h-auto' />

          <div
            className={`w-[25%] flex flex-col items-center justify-center bg-we text-white p-5 rounded-lg`}
          >
            <span className='text-2xl font-bold mt-7'>Nuestros Valores</span>
            <span className='text-lg'>
              “Empoderar a las empresas con herramientas para gestionar de
              manera eficiente sus operaciones en campo, brindando un control
              total de actividades, recursos y activos, mientras se garantiza la
              seguridad y trazabilidad en todo momento.”
            </span>
            <span className='text-2xl font-bold mt-7'>Nuestros Valores</span>
            <span className='text-lg mb-7'>
              Innovación y mejora continua Seguridad, trazabilidad y confianza
              Transparencia en la comunicación Compromiso con el cliente y
              colaboradores
            </span>
          </div>
        </div>
      </div>
    );
  };

  const Plans = () => {
    return (
      <div className='flex flex-col items-center text-center bg-white text-[#28787B] pt-[70px]'>
        <span className='text-3xl font-bold text-[#20314F]'>
          Nuestros planes
        </span>
        <span className='text-xl text-[#505050]'>
          Elige el plan perfecto para tu negocio y transforma tus operaciones de
          campo. Comienza con Tryvoo hoy mismo!
        </span>

        <div className='flex flex-wrap gap-6 justify-center mt-7 mb-10'>
          
          <div class='max-w-sm bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 !h-[100vh]'>
            <div className='!h-[5vh]'>
              <div class='w-[40%] ml-auto rounded-bl-lg bg-[#26B6D4] text-white text-center text-xl py-2 font-semibold'>
                7 Días free
              </div>
            </div>

            <div class='p-6 text-center !h-[15vh]'>
              <h2 class='text-[#26B6D4] text-2xl font-bold'>Prueba Gratis</h2>
              <p class='text-gray-600 text-xl mt-1'>
                Inicio 7 días y un plan básico
              </p>
            </div>

            <div className='bg-[#26B6D4] rounded-lg !h-[80vh]'>
              <div class='bg-[#26B6D4] text-white p-6 rounded-lg !h-[85%]'>
                <ul class='space-y-3 text-lg'>
                  <li class='flex items-start text-white'>
                    <span className={`!text-[#26B6D4] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Gestión de operaciones limitada (hasta 5 usuarios).
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span className={`!text-[#26B6D4] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Monitoreo en tiempo real para un máximo de 3 activos.
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span className={`!text-[#26B6D4] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Asistencia virtual limitada (soporte solo en horario
                      laboral).
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span className={`!text-[#26B6D4] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Integración con una herramienta externa. Duración: 30 días
                      de prueba gratuita. Plan Enterprise (Intermedio).
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span className={`!text-[#26B6D4] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Para empresas en crecimiento que necesitan mayor alcance.
                    </span>
                  </li>
                </ul>
              </div>
              <div class='p-6 flex justify-center'>
                <button class='bg-white text-[#26B6D4] font-semibold border border-[#26B6D4] rounded-full px-6 py-2 hover:bg-[#26B6D4] hover:text-white transition'>
                  Iniciar prueba
                </button>
              </div>
            </div>
          </div>

          <div class='max-w-sm bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 !h-[100vh]'>
            <div class='w-[40%] ml-auto rounded-bl-lg bg-[#1D2B53] text-white text-center py-2 text-xl font-semibold !h-[5vh]'>
              $49 USD/mes
            </div>

            <div class='p-6 text-center !h-[15vh]'>
              <h2 class='text-[#1D2B53] text-2xl font-bold'>Plan Enterprise</h2>
              <p class='text-gray-600 text-xl mt-1'>Obtén un mayor alcance.</p>
            </div>

            <div className='bg-[#1D2B53] rounded-lg !h-[80vh]'>
              <div class='bg-[#1D2B53] text-white p-6 rounded-lg !h-[85%]'>
                <ul class='space-y-3 text-lg'>
                  <li class='flex items-start'>
                  <span className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Gestión de operaciones para hasta 50 usuarios.
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Monitoreo en tiempo real sin límite de activos.
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Funcionalidades offline completas (sincronización
                      automática de datos).
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Asistencia con IA personalizada (soporte 24/7).
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Integración con hasta 3 herramientas externas.
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Panel de informes básicos para análisis de datos.
                    </span>
                  </li>
                </ul>
              </div>

              <div class='p-6 flex justify-center'>
                <button class='bg-white text-[#1D2B53] font-semibold border border-[#1D2B53] rounded-full px-6 py-2 hover:bg-[#1D2B53] hover:text-white transition'>
                  Iniciar plan
                </button>
              </div>
            </div>
          </div>

          <div class='max-w-sm bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 !h-[100vh]'>
            <div class='w-[40%] ml-auto rounded-bl-lg bg-[#1D2B53] text-white text-center py-2 font-semibold text-xl !h-[5vh]'>
              $49 USD/mes
            </div>

            <div class='p-6 text-center !h-[15vh]'>
              <h2 class='text-[#1D2B53] text-2xl font-bold'>Plan Premium</h2>
              <p class='text-gray-600 text-xl mt-1'>Empresas avanzadas</p>
            </div>

            <div className='bg-white rounded-lg !h-[80vh]'>
              <div class='p-6 rounded-lg !h-[85%]'>
                <ul class='space-y-3 text-lg text-gray-700'>
                  <li class='flex items-start'>
                  <span className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Usuarios ilimitados y operaciones escalables.
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Monitoreo avanzado con reportes en tiempo real y análisis
                      predictivo.
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Funcionalidades offline avanzadas (soporte para dispositivos
                      múltiples).
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      IA avanzada con recomendaciones estratégicas y análisis de
                      riesgos.
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Integración ilimitada con herramientas externas.
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Panel de informes avanzado con personalización total.
                    </span>
                  </li>
                  <li class='flex items-start'>
                  <span className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full p-1`} />
                    <span class='ml-2 text-left'>
                      Soporte prioritario 24/7 con consultor dedicado.
                    </span>
                  </li>
                </ul>
              </div>

              <div class='p-6 flex justify-center'>
                <button class='bg-[#1D2B53] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#16203E] transition'>
                  Iniciar plan
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };

  const Footer = () => {
    return (
      <div className="bg-gray-800 flex justify-center gap-4 pt-10 pb-10">
        <div className='w-[30%]'>
          <h2 className="text-xl font-bold">Secciones Populares</h2>
          <p className="text-sm pt-2">Conoce más de tryvoo</p>
        </div>

        <div className='w-[30%]'>
          <h3 className="text-xl font-bold">Contáctanos</h3>
          <p className="text-sm pt-2">3157789022 - Popayán, Cauca</p>
        </div>

        <div className='w-[30%]'>
            <div className='w-full block'>
              <h3 className="text-xl font-bold">Nuestra redes</h3>
            </div>
            <div className='w-full block flex justify-left pt-2'>
              <img src={socialIcon1} alt="" className='mr-2'/>
              <img src={socialIcon2} alt="" className='mr-2'/>
              <img src={socialIcon3} alt="" className='mr-2'/>
            </div>
          
        </div>
      </div>
    )
  }

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
          <>
            <Main />
            <WhyTryvoo />
            <Services />
            <Solutions />
            <We />
            <Plans />
            <div className='flex gap-4 w-full mt-7 mb-10'>
              <div className='w-[30%] text-3xl text-center'>
                <span>Te brindamos asesoria gratuita</span>
              </div>
              <div className='w-[30%] text-xl'>
                <span>
                  Para que comiences optimizar tu negocio con herramientas
                  ágiles y operables en cualquiers espacio y lugar
                </span>
              </div>
              <div className='w-[30%] text-center'>
                <Button
                  label='Inicia ya y disfruta'
                  type='button'
                  id='schedule'
                  name='schedule'
                  className='bg-[#20314F] text-[#FFF] mb-4 text-xl rounded-full !p-5'
                />
              </div>
            </div>
            <Footer />
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
