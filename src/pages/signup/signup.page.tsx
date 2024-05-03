import { Button, Input } from '@/components/common';
import { PAGES_LIST } from '@/utils';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Link } from 'wouter';

export const SignupPage: FunctionComponent = () => {
  // const authService = new AuthService();

  useEffect(() => {
    document.title = 'VX - Signup Service';
  }, []);
  return (
    <section className='flex flex-row justify-center items-center h-full'>
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
        <Input
          id='repeat'
          name='repeat'
          label='repeat password'
          type='number'
          icon='logo'
        />
        <div className='text-right text-sm font-extralight mt-3'>
          <Link to={PAGES_LIST.SIGNIN}>Sigin</Link>
          <Button id='signup' name='signup' label='Sigup' type='submit' />
        </div>
        <div className='mt-3 py-2 border-t-2'>
          <Button
            id='google'
            name='google'
            label='Google'
            type='button'
            icon='settings'
          />
          <Button
            id='facebook'
            name='facebook'
            label='Facebook'
            type='button'
            icon='sales'
          />
        </div>
      </form>
    </section>
  );
};
