import { Button, Input } from '@/components/common';
// import { PAGES_LIST } from '@/utils';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
// import { Link } from 'wouter';

export const SigninPage: FunctionComponent = () => {
  // const authService = new AuthService();

  useEffect(() => {
    document.title = 'VX - Signin Service';
  }, []);
  return (
    <form className='bg-white bg-opacity-90 min-h-64 min-w-80 max-w-96 p-6 rounded flex flex-col justify-between'>
      <Input
        id='username'
        name='username'
        label='Correo Electrónico'
        type='email'
        icon='settings'
      />
      <Input
        id='password'
        name='password'
        label='Contraseña'
        type='password'
        icon='sensor'
      />
      <div className='flex items-center justify-between mt-4'>
        <label className='flex items-center justify-center'>
          <input
            type='checkbox'
            id='remember-me'
            name='remember-me'
            className='mr-2'
          />
          <span className='text-sm text-gray-700'>Recordarme</span>
        </label>
        <a
          href='#forgot-password'
          className='text-xs text-gray-500 hover:underline'
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      <div className='text-right text-sm font-extralight mt-3 text-white'>
        {/*
        <Link to={PAGES_LIST.SIGNUP}>Register</Link>
        <Link to={PAGES_LIST.HOME}>
          <span className='vx-icon vx-home mx-2' />
        </Link>
       */}
        <Button id='signin' name='signin' label='Sigin' type='submit' full />
      </div>
    </form>
  );
};
