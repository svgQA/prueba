import './home.css';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { HomeAbout } from './section/about';
import { HomePros } from './section/pros';
import { HomeHero } from './section/home';
import { HomeFooter } from './section/footer';
import { HomeCarousel } from './section/carousel';
import { HomeSolutions } from './section/solutions';
import { HomeHeader } from './section/header';
import { HomeBetaForm } from './section/join-beta';

export const HomeLayout: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Tryvoo';
  }, []);

  return (
    <section className='relative min-h-screen overflow-hidden bg-[#f8fbff] text-t-dark'>
      <HomeHeader />
      <main className='pt-16 md:pt-20'>
        <HomeHero />
        <HomeCarousel />
        <HomePros />
        <HomeSolutions />
        <HomeAbout />
        <HomeBetaForm />
      </main>
      <HomeFooter />
    </section>
  );
};
