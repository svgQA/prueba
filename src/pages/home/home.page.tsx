import { PAGES_LIST } from '@/utils';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Link } from 'wouter';

export const HomePage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Voxline';
  }, []);
  return (
    <section>
      HOME
      <Link to={PAGES_LIST.SIGNIN} className='px-2'>
        Signin
      </Link>
      <Link to={PAGES_LIST.SIGNUP} className='px-2'>
        Signup
      </Link>
    </section>
  );
};
