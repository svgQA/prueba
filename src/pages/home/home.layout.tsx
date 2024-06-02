import { Navbar } from '@/components/common';
import { NAVBAR_MENUS } from '@/utils/constants/navbar';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Route, Switch } from 'wouter';
import {
  MainHomeSlice,
  ServicesHomeSlice,
  DescriptionHomeSlice,
} from './sections';

export const HomeLayout: FunctionComponent = () => {
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
        <div className='flex flex-col pl-20 w-full bg-green-100 pr-2'>
          <Switch>
            <Route path='/home' component={MainHomeSlice} />
            <Route path='/description' component={DescriptionHomeSlice} />
            <Route path='/services' component={ServicesHomeSlice} />
          </Switch>
        </div>
      </div>
    </section>
  );
};
