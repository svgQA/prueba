import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '@aws-amplify/ui-react';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';
import { useLocation } from 'wouter';
import { PAGES_LIST } from '@/utils/routing';
import { Logo } from '@/components/common/logo/logo';
import { useTranslation } from 'react-i18next';

interface CustomLoginContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showSlogan?: boolean;
  showDecoration?: boolean;
  containerClassName?: string;
  formClassName?: string;
}

const CustomLoginContainer = ({
  children,
  title,
  subtitle,
  showLogo = true,
  showSlogan = true,
  showDecoration = true,
  containerClassName = '',
  formClassName = '',
}: CustomLoginContainerProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1f33] via-[#102a44] to-[#0b1f33] p-4 sm:p-6 md:p-10 ${containerClassName}`}
    >
      <div className='pointer-events-none absolute inset-0 opacity-60'>
        <div className='absolute -left-20 -top-28 h-56 w-56 rounded-full bg-primary/30 blur-3xl' />
        <div className='absolute bottom-10 left-16 h-48 w-48 rounded-full bg-emerald-300/25 blur-3xl' />
        <div className='absolute right-[-10%] top-12 h-72 w-72 rounded-full bg-cyan-400/20 blur-[100px]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.15),transparent_32%)]' />
      </div>

      <div className='relative z-10 flex w-full max-w-6xl flex-col gap-10 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl md:flex-row md:p-10'>
        <div className='flex w-full flex-col justify-center gap-6 text-center text-white md:w-7/12 md:text-left'>
          <div className='flex flex-col gap-4'>
            {showLogo && (
              <div className='flex items-center justify-center md:justify-start fill-white'>
                <Logo title='' slogan='Gestiòn en campo' />
              </div>
            )}
            <div className='mx-auto flex max-w-xl items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 md:mx-0'>
              <span className='inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.8)]'></span>
              {t('i_signIn')}
            </div>
          </div>

          <div className='space-y-4'>
            <h1 className='text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl'>
              {title || t('i_welcome')}
            </h1>
            {showSlogan && (
              <p className='mx-auto max-w-2xl text-lg leading-relaxed text-white/80 md:mx-0 md:text-xl'>
                {subtitle || t('i_slogan')}
              </p>
            )}
          </div>

          {showDecoration && (
            <div className='grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-left shadow-lg backdrop-blur-xl sm:grid-cols-2'>
              <div className='flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10'>
                <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-200'>
                  ✓
                </div>
                <div>
                  <p className='text-sm font-semibold text-white'>
                    Gestión en tiempo real
                  </p>
                  <p className='text-xs text-white/70'>
                    Coordina equipos y tareas desde un solo panel.
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10'>
                <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-200'>
                  ★
                </div>
                <div>
                  <p className='text-sm font-semibold text-white'>
                    Experiencia segura
                  </p>
                  <p className='text-xs text-white/70'>
                    Accede con confianza a un entorno protegido.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`relative w-full md:w-[420px] ${formClassName}`}>
          <div className='absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-70 blur-2xl' />
          <div className='relative overflow-hidden rounded-lg bg-white p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6'>
            <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-emerald-300 to-cyan-400' />
            <div className='w-full h-full flex items-center justify-evenly flex-col min-h-96'>
              <div className='fill-primary'>
                <Logo
                  title='Tryvoo'
                  slogan='Gestión en campo'
                  color='text-primary'
                />
                <h3 className='mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl my-2 sm:my-3 text-ternary'>
                  {t('i_signIn')}
                </h3>
              </div>
              <div className='w-full min-h-64'>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Formulario de login totalmente custom ---
const CustomSignInForm: React.FC = () => {
  const { t } = useTranslation();
  const [_, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      setIsPending(true);
      await signIn({
        username: trimmedEmail,
        password: trimmedPassword,
      });

      // Si el signIn es correcto, navegamos al dashboard
      navigate(PAGES_LIST.DASHBOARD);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          'Ha ocurrido un error al iniciar sesión. Inténtalo de nuevo.'
      );
    } finally {
      setIsPending(false);
    }
  };

  // Comprobamos si ya hay sesión activa para redirigir automáticamente
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await fetchAuthSession();
        if (session?.tokens) {
          navigate('/');
        }
      } catch {
        // si no hay sesión, no pasa nada
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <form onSubmit={handleSubmit} className='w-full space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Correo electrónico
        </label>
        <input
          type='email'
          name='username'
          value={email}
          // @ts-ignore
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Introduce tu correo electrónico...'
          className='w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Contraseña
        </label>
        <input
          type='password'
          name='password'
          value={password}
          // @ts-ignore
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Introduce tu contraseña...'
          className='w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
        />
      </div>

      {error && <p className='text-xs text-red-500 mt-1'>{error}</p>}

      <Button
        className='w-full mt-4 px-4 py-2 bg-cyan-500 text-white font-medium rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200'
        type='submit'
        isLoading={isPending}
      >
        {t('i_signIn')}
      </Button>

      {/* Si quieres el enlace de "Olvidé contraseña", lo puedes dejar aquí */}
      {/*
      <div className='text-center mt-2'>
        <button
          type='button'
          onClick={() => {}}
          className='text-xs sm:text-sm font-normal border-0 outline-none focus:outline-none hover:underline text-ternary'
        >
          {t('i_forgotPassword')}
        </button>
      </div>
      */}
    </form>
  );
};

export const CustomLoginPage: React.FC = () => {
  return (
    <CustomLoginContainer>
      <CustomSignInForm />
    </CustomLoginContainer>
  );
};

// Export the container component for reuse
export { CustomLoginContainer };
