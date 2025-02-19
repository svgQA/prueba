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
import imageMobile from '../../assets/image/home-mobile.png';
import imageDesktopWhyTryvoo from '../../assets/image/home-mobile-why-tryvoo.png';
import imageDesktopHomeAnalitics from '../../assets/image/home-icon-analitics.jpg';

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
      <div className='h-1/2 w-full pt-16 bg-gradient-to-r from-cyan-500 to-emerald-400 content-center'>
        {homeMenu === '/' && (
          <>
            <div className='flex flex-col items-center text-center'>
              {/* <Layer
                title='Transforma la Gestión de Operaciones Con Tryvoo'
                subtitle=''
                description='Optimiza la gestión de actividades, recursos y activos, incluso sin conectividad para tus negocios'
              /> */}
              <h1 className='text-3xl mb-3 mt-3'>
                Transforma la Gestión de Operaciones Con Tryvoo
              </h1>
              <span className='mb-5'>
                Optimiza la gestión de actividades, recursos y activos, incluso
                sin{' '}
                <span className='font-bold'>
                  conectividad para tus negocios
                </span>
              </span>
              <Button
                label='Agenda una Demo gratis'
                type='button'
                id='schedule'
                name='schedule'
                className='bg-[#43f876] text-[#393838] mb-4'
              />
              <img className='mb-6 pl-5 pr-5' src={imageMobile} alt='' />
            </div>

            <div className='bg-white text-center'>
              <h2 className='text-[#28787B] text-xl pt-5'>¿Por que Tryvoo?</h2>
              <span className='text-[#28787B] pb-5'>
                Simplifica. Optimiza. Crece
              </span>

              <div>
                <div className='content-center text-[#28787B] pl-5 pr-5'>
                  <img src={imageDesktopWhyTryvoo} alt='' className='pb-7' />
                  <span className='font-bold'>
                    El 60% de las empresas en LATAM buscan herramientas que
                    mejoren la trazabilidad y reduzcan costos operativos
                  </span>
                  <p className='hidden md:block'>
                    Tryvoo está liderando esta transformación, gracias a la
                    Digitalización y automatización completa de las actividades
                    en campo, llegando a soluciones intuitivas, accesibles
                    incluso sin conexión.
                  </p>
                </div>

                <div className=''>
                  <div className='pl-4 pr-4 mt-5 p-4 shadow-xl max-w-md mx-auto bg-white rounded-lg space-y-4'>
                    <div className='flex items-start space-x-4'>
                      <img
                        src={imageDesktopHomeAnalitics}
                        alt='Gestión'
                        className='w-8 h-8'
                      />
                      <div className='text-left'>
                        <span>
                          <span className='font-bold text-gray-700'>
                            Fácil Gestión y Trazabilidad:
                          </span>
                          <span className='text-gray-600 text-sm'>
                            "Control total sobre las operaciones en campo, con
                            visibilidad y seguimiento en tiempo real."
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className='flex items-start space-x-4'>
                      <img
                        src={imageDesktopHomeAnalitics}
                        alt='Gestión'
                        className='w-8 h-8'
                      />
                      <div className='text-left'>
                        <span>
                          <span className='font-bold text-gray-700'>
                            Asistencia con IA:
                          </span>
                          <span className='text-gray-600 text-sm'>
                            "Recibe recomendaciones automáticas y soporte para
                            tus operativos directamente en el terreno."
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className='flex items-start space-x-4'>
                      <img
                        src={imageDesktopHomeAnalitics}
                        alt='Gestión'
                        className='w-8 h-8'
                      />
                      <div className='text-left'>
                        <span>
                          <span className='font-bold text-gray-700'>
                            Sincronización Offline:
                          </span>
                          <span className='text-gray-600 text-sm'>
                            "Sigue gestionando incluso sin internet, y los datos
                            se sincronizan al restaurar la conexión."
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className='flex items-start space-x-4'>
                      <img
                        src={imageDesktopHomeAnalitics}
                        alt='Gestión'
                        className='w-8 h-8'
                      />
                      <div className='text-left'>
                        <span>
                          <span className='font-bold text-gray-700'>
                            Escalabilidad:
                          </span>
                          <span className='text-gray-600 text-sm'>
                            "Adaptable a cualquier tamaño de empresa o
                            industria, desde la vigilancia hasta la logística."
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                label='Agenda una Demo gratis'
                type='button'
                id='schedule'
                name='schedule'
                className='bg-[#43f876] text-[#393838] mb-4'
              />

              <div>
                <span>Servicios destacados</span>
                <span>Todo lo que necesitas en una sola plataforma</span>
              </div>

              <div>
                <span>Soluciones por industria</span>
                <span>Tryvoo está optimizado para diferentes sectores</span>

                <Button
                  label='Inicia prueba gratis!'
                  type='button'
                  id='schedule'
                  name='schedule'
                  className='bg-[#43f876] text-[#393838] mb-4'
                />
              </div>

              <div>
                <span>Quienes somos</span>
                <span>
                  En Tryvoo, entendemos las complejidades de operar fuera de la
                  oficina.
                </span>
              </div>

              <div>
                <span>Nuestros planes</span>
                <span>
                  Elige el plan perfecto para tu negocio y transforma tus
                  operaciones de campo. Comienza con Tryvoo hoy mismo!
                </span>
              </div>

              <div>
                <div>
                  <span>Te brindamos asesoria gratuita</span>
                </div>
                <div>
                  <span>
                    Para que comiences optimizar tu negocio con herramientas
                    ágiles y operables en cualquiers espacio y lugar
                  </span>
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
