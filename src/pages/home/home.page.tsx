import { Carousel, Navbar, Slide } from '@/components/common';
import { CardProductHomeMenu } from '@/components/compose/home';
import { NAVBAR_MENUS } from '@/utils/constants/navbar';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const HomePage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Voxline';
  }, []);
  return (
    <section>
      <Navbar
        id='voxline-navbar'
        name='voxline-navbar'
        menus={NAVBAR_MENUS}
        logo={<span className='vx-icon vx-logo' />}
        actions={<p>ACTIONS</p>}
      />
      {/* No tocar esta parte */}
      <div className='w-full h-screen pt-10 bg-red-300'>
        {/* Trabajar desde aquí */}
        <Carousel name='sponsor-carrousel' visibleCount={3}>
          <Slide>
            <CardProductHomeMenu name='users' icon='gateway' />
          </Slide>
          <Slide>
            <CardProductHomeMenu name='users' icon='apps' />
          </Slide>
          <Slide>
            <CardProductHomeMenu name='users' icon='settings' />
          </Slide>
          <Slide>
            <CardProductHomeMenu name='users' icon='actuator' />
          </Slide>
        </Carousel>
      </div>
    </section>
  );
};
