import { Amplify } from 'aws-amplify';
import { type FunctionComponent } from 'preact';
import { Route, Router, Switch } from 'wouter';
import { Authenticator } from '@aws-amplify/ui-react';
import { DashboardLayout } from './pages/dashboard';
// import { SigninPage, SignupPage } from './pages';
import { PAGES_LIST } from './utils';
import { HomeLayout } from './pages/home/home.layout';
import { AuthAmplifyProps } from './pages/dashboard/inteface';
import '@aws-amplify/ui-react/styles.css';

import { AWS_AMPLIFY_SETTINGS } from './aws-exports';
Amplify.configure(AWS_AMPLIFY_SETTINGS);

export const App: FunctionComponent<AuthAmplifyProps> = (props) => {
  return (
    <section className='h-screen w-screen'>
      <Switch>
        <Route path={PAGES_LIST.HOME} component={HomeLayout} />
        {/* <Route path={PAGES_LIST.SIGNIN} component={SigninPage} /> */}
        {/* <Route path={PAGES_LIST.SIGNUP} component={SignupPage} /> */}
        <Router base={PAGES_LIST.DASHBOARD}>
          <Authenticator
          // socialProviders={['amazon', 'apple', 'facebook', 'google']}
          >
            {(authProps) => <DashboardLayout {...authProps} {...props} />}
          </Authenticator>
        </Router>
      </Switch>
    </section>
  );
};

export async function getStaticProps() {
  return {
    props: {
      isPassedToWithAuthenticator: true,
    },
  };
}
