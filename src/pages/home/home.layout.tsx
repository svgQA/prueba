import './home.css';
import { NAVBAR_MENUS } from '@/utils/menus';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Navbar } from '@/components/common/navbar/navbar';
import { Logo } from '@/components/common/logo/logo';
import { HomeAbout } from './section/about';
import { HomePros } from './section/pros';
import { HomeHero } from './section/home';
import { HomeFooter } from './section/footer';
import { HomeCarousel } from './section/carousel';
import { HomeSolutions } from './section/solutions';
import { HomePlans } from './section/plan';
import { useTranslation } from 'react-i18next';
// import { HomeService } from './section/services';

export const HomeLayout: FunctionComponent = () => {
  const { t } = useTranslation();
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
        logo={<Logo slogan={t('slogan')} />}
      />
      <div className='w-full pt-16 bg-gradient-to-r from-cyan-500 to-emerald-400 content-center'>
        {homeMenu === '/' && (
          <section>
            <HomeHero />
            <HomePros />
            {/* <HomeService /> */}
            <HomeCarousel />
            <HomeSolutions />
            <HomeAbout />
            <HomePlans />
            <HomeFooter />
          </section>
        )}
      </div>
    </section>
  );
};
