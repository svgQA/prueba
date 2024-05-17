import { Navbar } from '@/components/common';
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
        logo={<p>LOGO</p>}
        actions={<p>ACTIONS</p>}
      />
      {/* No tocar esta parte */}
      <div className='w-full h-screen max-h-screen overflow-y-hidden pt-10 bg-purple-300'>
        {/* Trabajar desde aquí */}
        <section className='m-1 p-2 w-100 h-100 bg-teal-200'>HOME</section>
      </div>
    </section>
  );
};
