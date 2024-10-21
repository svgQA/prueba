import { Button, Input } from '@/components/common';
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
    <form className='bg-white max-w-96 min-h-64 min-w-80 p-6 rounded flex flex-col justify-between relative z-10'>
      <Input
        id='username'
        name='username'
        label='Correo Electrónico'
        type='email'
        icon='email'
      />
      <Input
        id='password'
        name='password'
        label='Contraseña'
        type='password'
        icon='sensor'
      />
      <Input
        id='repeat'
        name='repeat'
        label='Repetir Contraseña'
        type='password'
        icon='logo'
      />
      {/* <Dropdown
        id='signup-type'
        name='signup-type'
        label='Company Type'
        elements={[
          { label: '123', value: '123' },
          { label: '1233', value: '2323' },
        ]}
      /> */}
      <div className='text-right text-sm font-extralight mt-3 text-white'>
        {/*<Link to={PAGES_LIST.SIGNIN}>Sigin</Link>
        <Link to={PAGES_LIST.HOME}>
          <span className='vx-icon vx-home mx-2' />
        </Link>
        */}
        <Button
          id='signup'
          name='signup'
          label='Sigup'
          type='submit'
          full
          className='bg-cyan-500 text-white'
        />
      </div>
      <div className='mt-3 py-2 border-t-2'>
        <Button
          id='google'
          name='google'
          label='Google'
          type='button'
          icon='google'
          full
          className='text-gray-600 border border-gray-300'
        />
        <Button
          id='facebook'
          name='facebook'
          label='Facebook'
          type='button'
          icon='facebook'
          full
          className='text-blue-700 border border-gray-300'
        />
      </div>
    </form>
  );
};
