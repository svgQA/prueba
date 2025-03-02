import './home.css';
import { NAVBAR_MENUS } from '@/utils/menus';
import { type FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
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
      <div className='flex relative !h-[100vh] md:flex-row flex-col'>
        <div className='md:w-2/5 flex flex-col items-center text-left pl-10 pr-7 mt-7 mb-7'>
          <h1 className='md:text-5xl text-3xl mb-3 mt-3 text-center'>
            Transforma la Gestión de Operaciones Con Tryvoo
          </h1>
          <span className='mb-5 md:text-3xl text-2xl mt-5 text-center'>
            Optimiza la gestión de actividades, recursos y activos, incluso sin{' '}
            <span className='font-bold'>conectividad para tus negocios</span>
          </span>
          <Button
            label='Agenda una Demo gratis'
            type='button'
            id='schedule'
            name='schedule'
            className='bg-[#43f876] text-[#393838] mb-7 mt-10 text-xl rounded-full !p-5 object-contain z-[10]'
          />
        </div>

        <div className='md:w-3/5 flex items-center justify-center md:justify-left overflow-hidden'>
          <img
            src={homeMainDesktop}
            alt=''
            className='!md:h-[60vh] !md:w-auto w-[90%] h-auto object-contain z-[10] md:mr-7'
          />
        </div>

        <div class='absolute bottom-0 left-0 w-full md:h-[30vh] h-[30vh] bg-white'> </div>
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
      <div className='bg-white text-center text-[#28787B] !md:h-[100vh] !h-auto'>
        <h2 className='text-[#28787B] text-3xl pt-5'>¿Por que Tryvoo?</h2>
        <span className='text-[#28787B] pb-5 text-xl'>
          Simplifica. Optimiza. Crece
        </span>

        <div className='flex mt-7 md:flex-row flex-col'>
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

          <div className='md:w-1/2 mt-7 ml-5 mr-5'>
            <div className='shadow-xl bg-white rounded-lg'>
              {items.map((item: any, index: number) => (
                <div key={index}>
                  <div className='flex items-start space-x-4 md:p-5 p-1'>
                    <div className='h-[18vh] !w-[18vh] md:h-[10vh] !md:w-[10vh] flex items-center justify-center'>
                      <img src={item.image} alt='Gestión' className='!h-auto w-[100%] margin-auto' />
                    </div>

                    <div className='text-left h-[18vh] md:h-[10vh] flex items-center justify-center'>
                      <span>
                        <span className='font-bold text-[#505050] text-xl'>
                          {item.title}
                        </span>
                        <span className='text-[#505050] text-sm text-xl'>
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
      <div className='flex flex-col items-center text-center bg-white text-[#28787B] pt-[70px] !md:h-[100vh] !h-auto'>
        <span className='text-3xl font-bold text-[#349396]'>
          Servicios destacados
        </span>
        <span className='text-xl text-[#349396]'>
          Todo lo que necesitas en una sola plataforma
        </span>

        <div className='hidden lg:block'>
          <div className='flex flex-wrap gap-6 justify-center mt-7'>
            {items.map((item: any, index: number) => (
              <div
                key={index}
                class='flex flex-col items-center text-center w-[40vh] max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white p-6 border border-gray-200 hover:bg-[#20314F] text-[#349396] hover:text-white'
              >
                <img
                  class='w-auto h-48 object-cover rounded-lg'
                  src={item.image}
                  alt='Card Image'
                />
                <div class='mt-4'>
                  <h2 class='text-2xl font-semibold'>{item.title}</h2>
                  <p class='mt-2 '>{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          label='Ver detalle'
          type='button'
          id='schedule'
          name='schedule'
          className='bg-[#20314F] text-[#FFFF] mb-4 mt-10 text-xl rounded-full !p-5 !w-[400px] hidden lg:block'
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
      <div className='flex flex-col items-center text-center bg-white text-[#28787B] pt-[70px] !h-[100vh]'>
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
              class='flex items-center shadow-lg rounded-lg border border-gray-200 w-[90vh]'
            >
              <div class='!bg-[#26B6D4] rounded-lg h-[20vh] !w-[20vh] flex items-center justify-center'>
                <img
                  src={item.image}
                  alt=''
                  className='h-auto w-[60%] margin-auto'
                />
              </div>
              <div class='text-left !w-[60vh] pl-4'>
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
      <div className='flex flex-col items-center text-center !bg-[#f5cde0] !bg-opacity-75 pt-[70px] pb-4 !h-[100vh]'>
        <span className='text-3xl font-bold text-[#20314F]'>Quienes somos</span>
        <span className='text-xl text-[#505050]'>
          En Tryvoo, entedemos las complejidades de operar fuera de la oficina.
        </span>

        <div className='mt-7 flex items-center justify-center'>
          <div className='w-[30%] shadow-xl bg-white rounded-lg p-[20px]'>
            <span className='text-[#707070] text-[20px] ml-[20px]'>
              En Tryvoo trabajamos para que tu equipo en campo tenga las
              herramientas necesarias para lograr más, con seguridad y
              eficiencia, en cualquier lugar.
            </span>
          </div>
          <img src={homeWeCenter} alt='' className='w-[20%] h-auto' />

          <div
            className={`w-[30%] flex flex-col items-center justify-center bg-we text-white p-5 rounded-lg h-auto`}
          >
            <span className='text-[20px] font-bold mt-2'>Nuestros Valores</span>
            <span className='text-[18px]'>
              “Empoderar a las empresas con herramientas para gestionar de
              manera eficiente sus operaciones en campo, brindando un control
              total de actividades, recursos y activos, mientras se garantiza la
              seguridad y trazabilidad en todo momento.”
            </span>
            <span className='text-[20px] font-bold mt-2'>Nuestros Valores</span>
            <span className='text-[18px] mb-2'>
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
      <div className='flex flex-col items-center text-center bg-white text-[#28787B] pt-[70px] !h-[100vh]'>
        <span className='text-3xl font-bold text-[#20314F]'>
          Nuestros planes
        </span>
        <span className='text-xl text-[#505050]'>
          Elige el plan perfecto para tu negocio y transforma tus operaciones de
          campo. Comienza con Tryvoo hoy mismo!
        </span>

        <div className='flex flex-wrap gap-6 justify-center mt-7 mb-10'>
          <div class='max-w-sm bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 !h-[73vh]'>
            <div className='!h-[5vh]'>
              <div class='w-[40%] ml-auto rounded-bl-lg bg-[#26B6D4] text-white text-center text-[15px] py-2 font-semibold'>
                7 Días free
              </div>
            </div>

            <div class='p-6 text-center !h-[12vh]'>
              <h2 class='text-[#26B6D4] text-[20px] font-bold'>Prueba Gratis</h2>
              <p class='text-gray-600 text-[13px] mt-1'>
                Inicio 7 días y un plan básico
              </p>
            </div>

            <div className='bg-[#26B6D4] rounded-lg !h-[56vh]'>
              <div class='bg-[#26B6D4] text-white p-6 rounded-lg !h-[80%]'>
                <ul class='space-y-3 text-[14px]'>
                  <li class='flex items-start text-white'>
                    <span
                      className={`!text-[#26B6D4] !text-[14px] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full`}
                    />
                    <span class='ml-2 text-left'>
                      Gestión de operaciones limitada (hasta 5 usuarios).
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-[#26B6D4] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Monitoreo en tiempo real para un máximo de 3 activos.
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-[#26B6D4] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Asistencia virtual limitada (soporte solo en horario
                      laboral).
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-[#26B6D4] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Integración con una herramienta externa. Duración: 30 días
                      de prueba gratuita. Plan Enterprise (Intermedio).
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-[#26B6D4] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
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

          <div class='max-w-sm bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 !h-[73vh]'>
            <div class='w-[40%] ml-auto rounded-bl-lg bg-[#1D2B53] text-white text-center py-2 text-[15px] font-semibold !h-[5vh]'>
              $49 USD/mes
            </div>

            <div class='p-6 text-center !h-[12vh]'>
              <h2 class='text-[#1D2B53] text-[20px] font-bold'>Plan Enterprise</h2>
              <p class='text-gray-600 text-[13px] mt-1'>Obtén un mayor alcance.</p>
            </div>

            <div className='bg-[#1D2B53] rounded-lg !h-[56vh]'>
              <div class='bg-[#1D2B53] text-white p-6 rounded-lg !h-[80%]'>
                <ul class='space-y-3 !text-[14px]'>
                  <li class='flex items-start'>
                    <span
                      className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Gestión de operaciones para hasta 50 usuarios.
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Monitoreo en tiempo real sin límite de activos.
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Funcionalidades offline completas (sincronización
                      automática de datos).
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Asistencia con IA personalizada (soporte 24/7).
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Integración con hasta 3 herramientas externas.
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-[#1D2B53] bg-white left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
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

          <div class='max-w-sm bg-[#1D2B53] shadow-lg rounded-lg overflow-hidden border border-gray-200 !h-[73vh]'>
            <div class='w-[40%] ml-auto rounded-bl-lg bg-white text-[#1D2B53] text-center py-2 font-semibold text-[15px] !h-[5vh]'>
              $49 USD/mes
            </div>

            <div class='p-6 text-center !h-[12vh]'>
              <h2 class='text-white text-[20px] font-bold'>Plan Premium</h2>
              <p class='text-white text-[13px] mt-1'>Empresas avanzadas</p>
            </div>

            <div className='bg-white rounded-lg !h-[56vh]'>
              <div class='p-6 rounded-lg !h-[80%]'>
                <ul class='space-y-3 !text-[14px] text-gray-700'>
                  <li class='flex items-start'>
                    <span
                      className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Usuarios ilimitados y operaciones escalables.
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Monitoreo avanzado con reportes en tiempo real y análisis
                      predictivo.
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Funcionalidades offline avanzadas (soporte para
                      dispositivos múltiples).
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      IA avanzada con recomendaciones estratégicas y análisis de
                      riesgos.
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Integración ilimitada con herramientas externas.
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
                    <span class='ml-2 text-left'>
                      Panel de informes avanzado con personalización total.
                    </span>
                  </li>
                  <li class='flex items-start'>
                    <span
                      className={`!text-white bg-[#1D2B53] left-0 px-1 size vox-icon vx-icon-030 rounded-full !text-[14px]`}
                    />
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
      <div className='bg-[#20314F] flex justify-center gap-4 pt-10 pb-10'>
        <div className='w-[30%]'>
          <h2 className='text-[20px] font-bold'>Secciones Populares</h2>
          <p className='text-[18px] pt-2'>Conoce más de tryvoo</p>
        </div>

        <div className='w-[30%]'>
          <h3 className='text-[20px] font-bold'>Contáctanos</h3>
          <p className='text-[18px] pt-2'>3157789022 - Popayán, Cauca</p>
        </div>

        <div className='w-[30%]'>
          <div className='w-full block'>
            <h3 className='text-[20px] font-bold'>Nuestra redes</h3>
          </div>
          <div className='w-full block flex justify-left pt-2'>
            <img src={socialIcon1} alt='' className='mr-3' />
            <img src={socialIcon2} alt='' className='mr-3' />
            <img src={socialIcon3} alt='' className='mr-3' />
          </div>
        </div>
      </div>
    );
  };

  const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef: any = useRef(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);

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

    // Función para actualizar el índice actual
    const updateCurrentIndex = () => {
      if (carouselRef.current) {
        const cardWidth = carouselRef.current.clientWidth / 3; // Ancho de cada card
        const newIndex = Math.round(carouselRef.current.scrollLeft / cardWidth);
        setCurrentIndex(newIndex);
      }
    };

    // Evento para iniciar el arrastre
    const handleMouseDown = (e: any) => {
      isDraggingRef.current = true;
      startXRef.current = e.pageX - carouselRef.current.offsetLeft;
      scrollLeftRef.current = carouselRef.current.scrollLeft;
    };

    // Evento para mover el carousel mientras se arrastra
    const handleMouseMove = (e: any) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const x = e.pageX - carouselRef.current.offsetLeft;
      const walk = (x - startXRef.current) * 2; // Ajusta la sensibilidad del arrastre
      carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    // Evento para detener el arrastre
    const handleMouseUp = () => {
      isDraggingRef.current = false;
      updateCurrentIndex();
    };

    // Evento para cambiar de slide al hacer clic en un indicador
    const goToSlide = (index: number) => {
      if (carouselRef.current) {
        const cardWidth = carouselRef.current.clientWidth / 3; // Ancho de cada card
        const containerWidth = carouselRef.current.clientWidth;
        const scrollPosition = index * cardWidth - (containerWidth / 2 - cardWidth / 2); // Centrar la card
        carouselRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
        setCurrentIndex(index);
      }
    };

    // Efecto para agregar/eliminar event listeners
    useEffect(() => {
      const carousel: any = carouselRef.current;
      if (carousel) {
        carousel.addEventListener("scroll", updateCurrentIndex);
        carousel.addEventListener("mousedown", handleMouseDown);
        carousel.addEventListener("mousemove", handleMouseMove);
        carousel.addEventListener("mouseup", handleMouseUp);
        carousel.addEventListener("mouseleave", handleMouseUp);
      }

      return () => {
        if (carousel) {
          carousel.removeEventListener("scroll", updateCurrentIndex);
          carousel.removeEventListener("mousedown", handleMouseDown);
          carousel.removeEventListener("mousemove", handleMouseMove);
          carousel.removeEventListener("mouseup", handleMouseUp);
          carousel.removeEventListener("mouseleave", handleMouseUp);
        }
      };
    }, []);

    return (
      <div className='bg-white block lg:hidden'>
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((card) => (
              <div
                key={card.id}
                className="w-[90%] flex-shrink-0 p-4 snap-start"
              >
                <div className="bg-white h-[400px] rounded-lg shadow-lg overflow-hidden">
                  <div className='flex items-center justify-center h-[200px]'>
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-auto h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-[#349396]">
                    <h3 className="text-xl font-bold text-center">{card.title}</h3>
                    <p className="text-gray-600 text-center">{card.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores circulares */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {items.map((card, index) => (
              <div
                key={card.id}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 bg-gray-600 rounded-full cursor-pointer ${index === currentIndex ? "opacity-100" : "opacity-50"
                  }`}
              ></div>
            ))}
          </div>

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
            <Carousel />
            <Solutions />
            <We />
            <Plans />
            <div className='flex gap-4 w-full mt-7 mb-10'>
              <div className='w-[25%] text-[26px] font-bold pl-12'>
                <span className='mr-12'>¡Te brindamos asesoria gratuita!</span>
              </div>
              <div className='w-[40%] text-xl'>
                <span>
                  Para que comiences optimizar tu negocio con herramientas
                  ágiles y operables en cualquiers espacio y lugar
                </span>
              </div>
              <div className='w-[25%] text-center'>
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
            <div className="flex justify-center items-center h-screen bg-gray-100">


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
