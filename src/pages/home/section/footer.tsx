import socialIcon1 from '@/assets/image/icon1.svg';
import socialIcon2 from '@/assets/image/icon2.svg';
import socialIcon3 from '@/assets/image/icon3.svg';
import { Logo } from '@/components/common/logo/logo';

const footerLinks = [
  {
    title: 'Producto',
    items: ['Turnos y rondas', 'Reportes y formularios', 'IA Bot-Doc', 'SDK e integraciones'],
  },
  {
    title: 'Empresa',
    items: ['Casos de uso', 'Equipo', 'Seguridad y cumplimiento'],
  },
  {
    title: 'Recursos',
    items: ['Centro de ayuda', 'Blog', 'Soporte prioritario'],
  },
];

export const HomeFooter = () => {
  return (
    <footer className='bg-[#0b1f33] text-white'>
      <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-4 md:items-start'>
          <div className='space-y-3'>
            <Logo slogan='Tryvoo' />
            <p className='text-sm text-white/80'>
              Plataforma modular de trazabilidad y control operativo para equipos en campo. Web + App con IA y capacidades offline.
            </p>
            <div className='flex items-center gap-3 pt-1 text-sm text-white/70'>
              <span className='vox-icon vx-icon-041 size-sm text-white' />
              soporte@tryvoo.com
            </div>
            <div className='flex items-center gap-3 text-sm text-white/70'>
              <span className='vox-icon vx-icon-007 size-sm text-white' />
              +57 300 000 0000
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className='space-y-3'>
              <h3 className='text-lg font-semibold'>{section.title}</h3>
              <ul className='space-y-2 text-sm text-white/80'>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className='space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-lg'>
            <p className='text-sm uppercase tracking-[0.15em] text-white/80'>Programa beta</p>
            <p className='text-xl font-semibold'>Agendemos una demo</p>
            <p className='text-sm text-white/80'>Descubre cómo Tryvoo reduce costos operativos en semanas, no meses.</p>
            <a
              href='/demo'
              className='inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-xl'
            >
              Reservar espacio
            </a>
            <div className='flex gap-3 pt-2'>
              <img src={socialIcon1} alt='LinkedIn' className='h-9 w-9 rounded-full bg-white/10 p-2' />
              <img src={socialIcon2} alt='Twitter' className='h-9 w-9 rounded-full bg-white/10 p-2' />
              <img src={socialIcon3} alt='Facebook' className='h-9 w-9 rounded-full bg-white/10 p-2' />
            </div>
          </div>
        </div>
      </div>

      <div className='border-t border-white/10'>
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-white/70 sm:flex-row sm:px-6 lg:px-8'>
          <p>© {new Date().getFullYear()} Tryvoo. Todos los derechos reservados.</p>
          <div className='flex gap-4'>
            <a href='#' className='hover:text-white'>Política de privacidad</a>
            <a href='#' className='hover:text-white'>Términos</a>
            <a href='#' className='hover:text-white'>Soporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
