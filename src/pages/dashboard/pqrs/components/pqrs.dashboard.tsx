import { Badge } from '@/components/common/badge/badge';

const DashboardPreview = () => {
  const SkeletonBlock = ({ className = '' }: { className?: string }) => (
    <div
      class={`animate-pulse bg-gray-100 dark:bg-b-dark-light rounded ${className}`}
    />
  );

  return (
    <div class='grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6'>
      <div class='xl:col-span-2 space-y-6'>
        <div class='bg-white rounded-xl p-6 shadow-sm dark:bg-b-dark-light dark:text-white text-b-dark'>
          <div class='flex items-start justify-between flex-wrap gap-4'>
            <div>
              <p class='text-xs uppercase tracking-wide'>Resumen operativo</p>
              <h2 class='text-xl font-semibold'>Dashboard de atención</h2>
              <p class='text-sm mt-1 max-w-xl'>
                Usa este espacio para visualizar el desempeño de PQRS: números
                atendidos por mes, resoluciones automáticas con IA y desglose
                por áreas o niveles de prioridad.
              </p>
            </div>
            <div class='flex items-center gap-2 bg-b-light dark:bg-b-dark rounded-full px-4 py-2 text-xs'>
              <span class='w-2 h-2 rounded-full bg-primary animate-pulse'></span>
              Diseño previo — listo para conectar con el backend
            </div>
          </div>

          <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            {[
              {
                title: 'Atenciones del mes',
                helper: 'Incluye totales y porcentaje vs. mes anterior',
              },
              {
                title: 'Resueltas por IA',
                helper: 'Qué porcentaje resolvió el chatbot o agente virtual',
              },
              {
                title: 'Prioridad alta',
                helper: 'Cuántas solicitudes críticas siguen abiertas',
              },
              {
                title: 'Área con más casos',
                helper: 'Top 3 áreas con mayor volumen y tiempos de respuesta',
              },
              {
                title: 'SLA promedio',
                helper: 'Duración desde radicación hasta resolución',
              },
              {
                title: 'Satisfacción',
                helper: 'NPS/CSAT asociado a casos atendidos',
              },
            ].map((card, idx) => (
              <div
                key={`${card.title}-${idx}`}
                class='p-4 rounded-lg transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:bg-b-dark bg-b-light'
              >
                <div class='flex items-start justify-between gap-3'>
                  <div>
                    <p class='text-xs uppercase tracking-wide'>{card.title}</p>
                    <p class='text-[13px] mt-1 leading-snug'>{card.helper}</p>
                  </div>
                  <span class='px-2 py-1 text-[11px] rounded-full bg-primary text-white border border-primary/30'>
                    Placeholder
                  </span>
                </div>
                <div class='mt-4 space-y-2'>
                  <SkeletonBlock className='h-6 w-24' />
                  <SkeletonBlock className='h-3 w-20' />
                  <SkeletonBlock className='h-2 w-full' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div class='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div class='p-6 rounded-xl bg-white shadow-sm dark:bg-b-dark-light dark:text-white text-b-dark'>
            <div class='flex items-start justify-between gap-2'>
              <div>
                <p class='text-xs uppercase tracking-wide'>Gráfica sugerida</p>
                <h3 class='text-lg font-semibold'>
                  Distribución por estado y prioridad
                </h3>
                <p class='text-sm'>
                  Aquí podría ir una gráfica de barras apiladas con estados
                  (creado, en proceso, finalizado) y prioridades
                  alta/media/baja.
                </p>
              </div>
              <Badge
                label='Gráfico'
                status='info'
                outline
                size='xs'
                width='w-fit'
              />
            </div>

            <div class='mt-4 h-52 rounded-lg bg-b-light flex items-center justify-center dark:bg-b-dark'>
              <div class='w-full px-4 space-y-3'>
                <SkeletonBlock className='h-4 w-1/2' />
                <SkeletonBlock className='h-4 w-2/3' />
                <SkeletonBlock className='h-24 w-full' />
              </div>
            </div>
          </div>

          <div class='p-6 rounded-xl bg-white shadow-sm dark:bg-b-dark-light dark:text-white text-b-dark'>
            <div class='flex items-start justify-between gap-2 '>
              <div>
                <p class='text-xs uppercase tracking-wide'>Tendencia semanal</p>
                <h3 class='text-lg font-semibold'>
                  Tiempo de respuesta y casos por día
                </h3>
                <p class='text-sm'>
                  Reserva este espacio para una gráfica de líneas con casos
                  atendidos y tiempos promedio de resolución.
                </p>
              </div>
              <Badge
                label='Línea'
                status='success'
                outline
                size='xs'
                width='w-fit'
              />
            </div>

            <div class='mt-4 h-52 rounded-lg dark:bg-b-dark bg-b-light flex items-center justify-center'>
              <div class='w-full px-4 space-y-3'>
                <SkeletonBlock className='h-4 w-2/5' />
                <SkeletonBlock className='h-28 w-full' />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class='space-y-6'>
        <div class='p-6 rounded-xl bg-white shadow-sm dark:bg-b-dark-light dark:text-white text-b-dark'>
          <div class='flex items-start justify-between gap-2'>
            <div>
              <p class='text-xs uppercase tracking-wide'>Tablas recomendadas</p>
              <h3 class='text-lg font-semibold'>Casos por agente o área</h3>
              <p class='text-sm'>
                Ideal para listar detalle de casos abiertos, SLA, responsable y
                prioridad.
              </p>
            </div>
            <Badge
              label='Tabla'
              status='warning'
              outline
              size='xs'
              width='w-fit'
            />
          </div>

          <div class='mt-4 space-y-3'>
            {[...Array(5)].map((_, idx) => (
              <div
                key={`row-${idx}`}
                class='flex items-center justify-between gap-3 p-3 rounded-lg dark:bg-b-dark bg-b-light'
              >
                <div class='flex items-center gap-3'>
                  <SkeletonBlock className='h-10 w-10 rounded-full' />
                  <div class='space-y-1'>
                    <SkeletonBlock className='h-3 w-32' />
                    <SkeletonBlock className='h-2 w-24' />
                  </div>
                </div>
                <div class='flex items-center gap-2'>
                  <SkeletonBlock className='h-3 w-10 rounded-full' />
                  <SkeletonBlock className='h-3 w-14 rounded-full' />
                  <SkeletonBlock className='h-3 w-10 rounded-full' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div class='p-6 bg-white shadow-sm dark:bg-b-dark-light dark:text-white text-b-dark'>
          <div class='flex items-start justify-between gap-2'>
            <div>
              <p class='text-xs uppercase tracking-wide'>Alertas clave</p>
              <h3 class='text-lg font-semibold'>Casos a punto de vencer</h3>
              <p class='text-sm'>
                Lista de casos con fecha límite cercana para priorizar acciones.
              </p>
            </div>
            <Badge
              label='Recordatorios'
              status='error'
              outline
              size='xs'
              width='w-fit'
            />
          </div>

          <div class='mt-4 space-y-3'>
            {[...Array(3)].map((_, idx) => (
              <div
                key={`alert-${idx}`}
                class='p-3 rounded-lg dark:bg-b-dark bg-b-light text-error'
              >
                <div class='flex items-center justify-between'>
                  <SkeletonBlock className='h-3 w-40 bg-error/30' />
                  <SkeletonBlock className='h-3 w-12 bg-error/30' />
                </div>
                <SkeletonBlock className='h-2 w-full mt-2 bg-error/20' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
