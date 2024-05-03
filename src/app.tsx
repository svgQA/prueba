import { type FunctionComponent } from 'preact';
import { Route, Router, Switch } from 'wouter';
import { Security } from '@/components/common';
import { DashboardLayout } from './pages/dashboard';
import { HomePage, SigninPage, SignupPage } from './pages';
import { PAGES_LIST } from './utils';

export const App: FunctionComponent = () => {
  return (
    <section className='h-screen w-screen'>
      <Switch>
        <Route path={PAGES_LIST.HOME} component={HomePage} />
        <Route path={PAGES_LIST.SIGNIN} component={SigninPage} />
        <Route path={PAGES_LIST.SIGNUP} component={SignupPage} />
        <Router base={PAGES_LIST.DASHBOARD}>
          <Security>
            <DashboardLayout />
          </Security>
        </Router>
      </Switch>
    </section>
  );
};
