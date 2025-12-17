import { type FunctionComponent } from 'preact';
import { Route, Router, Switch } from 'wouter';
import { PAGES_LIST } from '@/utils/routing';
import { HomeLayout } from '@/pages/home/home.layout';
import DemoPage from '@/pages/demo';
import { ResponsePublicPage } from '@/pages/response';
import { AWS_AMPLIFY_SETTINGS } from './aws-exports';
import { AuthAmplifyProps } from './utils/types/auth.interface';
import { DashboardLayout } from './pages/dashboard/dashboard.layout';
import { Amplify } from 'aws-amplify';
import { useLocation } from 'wouter';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { CustomLoginPage } from '@/components/compose/login/custom';
import { getIsInErrorState } from './store/signals/service/service.signals';
import { ToastContainer } from 'react-toastify';
import { ModalBaseService } from './components/compose/base-service/base-service';
import { Spinner } from './components/common/spinner/spinner';
import 'react-toastify/dist/ReactToastify.css';

Amplify.configure(AWS_AMPLIFY_SETTINGS);

// Componente AuthenticatedContent que decide qué renderizar basado en el estado de autenticación
const AuthenticatedContent = ({ props }: any) => {
  const [location] = useLocation();
  const { route, signOut } = useAuthenticator((context) => [
    context.route,
    context.signOut,
  ]);

  if (route === 'authenticated') {
    return <DashboardLayout {...props} location={location} signOut={signOut} />;
  }

  return <CustomLoginPage />;
};

export const App: FunctionComponent<AuthAmplifyProps> = (props) => {
  return (
    <section>
      <Switch>
        <Route path={PAGES_LIST.HOME} component={HomeLayout} />
        <Route path={PAGES_LIST.DEMO} component={DemoPage} />
        <Route path={PAGES_LIST.RESPONSE} component={ResponsePublicPage} />
        <Router base={PAGES_LIST.DASHBOARD}>
          <div className='w-full h-full'>
            <Authenticator.Provider>
              <AuthenticatedContent props={props} />
            </Authenticator.Provider>
          </div>
        </Router>
      </Switch>
      <ModalBaseService isOpen={getIsInErrorState()} />
      <Spinner />
      <ToastContainer />
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
