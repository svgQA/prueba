import { tryvoo_solutions } from '../utils/data/solutions';

export const HomeSolutions = () => {
  return (
    <div
      id='soluciones'
      className='flex flex-col items-center bg-white text-ternary py-16 sm:py-20 px-4 sm:px-6'
    >
      <div className='max-w-6xl text-center'>
        <p className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary'>
          Suite modular
        </p>
        <h2 className='mt-4 text-3xl font-bold leading-tight sm:text-4xl'>
          Todo lo que necesitas para operar y auditar equipos en campo.
        </h2>
        <p className='mt-3 text-lg text-gray-600'>
          Módulos interoperables que combinan trazabilidad, colaboración, IA y
          automatización. Activa solo lo que tu operación necesita.
        </p>
      </div>

      <div className='mt-12 grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2'>
        {tryvoo_solutions.map((item) => (
          <div
            key={item.id}
            className='group relative flex flex-col overflow-hidden rounded-2xl border border-[#d7e3f2] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'
          >
            <div className='bg-primary/5 p-6 sm:p-8'>
              <img
                src={item.image}
                alt={item.titleKey ?? ''}
                className='h-28 w-auto object-contain'
              />
            </div>
            <div className='flex flex-1 flex-col justify-between space-y-3 p-6'>
              <div>
                <h3 className='text-xl font-bold text-[#0b1f33]'>
                  {item.titleKey ?? ''}
                </h3>
                <p className='mt-2 text-base text-gray-600'>
                  {item.subtitleKey ?? ''}
                </p>
              </div>
              <div className='flex items-center gap-3 text-sm font-semibold text-primary'>
                <span className='vox-icon vx-icon-008 size-sm text-primary' />
                Listo para tus equipos web y móvil
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
