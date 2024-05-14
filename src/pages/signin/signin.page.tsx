import { Button, Input } from '@/components/common';
import { PAGES_LIST } from '@/utils';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Link } from 'wouter';
import Lottie from 'lottie-react';
import SigninAnimation from '../../assets/animations/signin.json';

export const SigninPage: FunctionComponent = () => {
  // const authService = new AuthService();

  useEffect(() => {
    document.title = 'VX - Signin Service';
  }, []);
  return (
    <section className='flex flex-col justify-center items-center'>
      <div className='w-80 h-50'>
        <Lottie animationData={SigninAnimation} />
      </div>
      <form className='bg-teal-500 bg-opacity-90 min-h-64 min-w-80 p-6 rounded flex flex-col justify-between'>
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
        <div className='text-right text-sm font-extralight mt-3 text-white'>
          <Link to={PAGES_LIST.SIGNUP}>Register</Link>
          <Link to={PAGES_LIST.HOME}>
            <span className='vx-icon vx-home mx-2' />
          </Link>
          <Button id='signin' name='signin' label='Sigin' type='submit' />
        </div>
      </form>
    </section>
  );
};
