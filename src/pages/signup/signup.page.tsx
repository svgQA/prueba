import { Button, Dropdown, Input } from '@/components/common';
// import { PAGES_LIST } from '@/utils';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
// import { Link } from 'wouter';

export const SignupPage: FunctionComponent = () => {
  // const authService = new AuthService();

  useEffect(() => {
    document.title = 'VX - Signup Service';
  }, []);
  return (
    <form className='bg-teal-500 bg-opacity-90 max-w-96 min-h-64 min-w-80 p-6 rounded flex flex-col justify-between'>
      <Input
        id='username'
        name='username'
        label='username'
        type='email'
        icon='settings'
      />
      <Input
        id='password'
        name='password'
        label='password'
        type='password'
        icon='sensor'
      />
      <Input
        id='repeat'
        name='repeat'
        label='repeat password'
        type='password'
        icon='logo'
      />
      <Dropdown
        id='signup-type'
        name='signup-type'
        label='Company Type'
        elements={[
          { label: '123', value: '123' },
          { label: '1233', value: '2323' },
        ]}
      />
      <div className='text-right text-sm font-extralight mt-3 text-white'>
        {/*<Link to={PAGES_LIST.SIGNIN}>Sigin</Link>
        <Link to={PAGES_LIST.HOME}>
          <span className='vx-icon vx-home mx-2' />
        </Link>
        */}
        <Button id='signup' name='signup' label='Sigup' type='submit' full />
      </div>
      <div className='mt-3 py-2 border-t-2'>
        <Button
          id='google'
          name='google'
          label='Google'
          type='button'
          icon='settings'
          full
        />
        <Button
          id='facebook'
          name='facebook'
          label='Facebook'
          type='button'
          icon='sales'
          full
        />
      </div>
    </form>
  );
};
