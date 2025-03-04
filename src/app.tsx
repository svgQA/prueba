import { type FunctionComponent } from 'preact';
import { Route, Router, Switch } from 'wouter';

import { PAGES_LIST } from '@/utils/routing';
import { HomeLayout } from '@/pages/home/home.layout';

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';
import { AWS_AMPLIFY_SETTINGS } from './aws-exports';
import { AuthAmplifyProps } from './utils/types/auth.interface';
import { DashboardLayout } from './pages/dashboard/dashboard.layout';
import { WebSocketProvider } from './utils/socket';
Amplify.configure(AWS_AMPLIFY_SETTINGS);

export const App: FunctionComponent<AuthAmplifyProps> = (props) => {
  return (
    <section className='h-screen'>
      <Switch>
        <Route path={PAGES_LIST.HOME} component={HomeLayout} />
        <Router base={PAGES_LIST.DASHBOARD}>
          <div className='w-full h-full flex justify-center items-center bg-b-light dark:bg-b-dark'>
            <Authenticator
            // hideSignUp
            // socialProviders={['google']}
            >
              {(authProps) => (
                <WebSocketProvider>
                  <DashboardLayout {...authProps} {...props} />
                </WebSocketProvider>
              )}
            </Authenticator>
          </div>
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
