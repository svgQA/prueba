import { PlandCard } from './component/plan.card';

export const HomePlans = () => {
  return (
    <div className='flex flex-col items-center text-center bg-white text-gray-700 pt-[70px] !md:h-[100vh] h-auto'>
      <span className='text-3xl font-bold text-blue-dark'>Nuestros planes</span>
      <span className='text-xl text-gray-700'>
        Elige el plan perfecto para tu negocio y transforma tus operaciones de
        campo. Comienza con Tryvoo hoy mismo!
      </span>

      <div className='flex flex-wrap gap-6 justify-center mt-7 mb-10'>
        <PlandCard
          pricing='7 Dias free'
          bgColor='primary'
          name='Prueba Gratis'
          action='Iniciar prueba'
          subtitle='Inicio 7 días y un plan básico'
          border='border-2 border-primary'
          options={[
            'Gestión de operaciones limitada (hasta 5 usuarios).',
            'Monitoreo en tiempo real para un máximo de 3 activos.',
            'Asistencia virtual limitada (soporte solo en horario laboral).',
            'Integración con una herramienta externa. Duración: 30 días de prueba gratuita. Plan Enterprise (Intermedio).',
            'Para empresas en crecimiento que necesitan mayor alcance.',
          ]}
        />

        <PlandCard
          pricing='$49 USD/mes'
          bgColor='blue-dark'
          name='Plan Enterprise'
          action='Iniciar plan'
          subtitle='Obtén un mayor alcance.'
          options={[
            'Gestión de operaciones para hasta 50 usuarios.',
            'Monitoreo en tiempo real sin límite de activos.',
            'Funcionalidades offline completas (sincronización automática de datos).',
            'Asistencia con IA personalizada (soporte 24/7).',
            'Integración con hasta 3 herramientas externas.',
            'Panel de informes básicos para análisis de datos.',
          ]}
        />

        <PlandCard
          pricing='$49 USD/mes'
          bgColor='blue-dark'
          name='Plan Premium'
          action='Iniciar plan'
          subtitle='Empresas avanzadas'
          options={[
            'Usuarios ilimitados y operaciones escalables.',
            'Monitoreo avanzado con reportes en tiempo real y análisis predictivo.',
            'Funcionalidades offline avanzadas (soporte para dispositivos múltiples).',
            'IA avanzada con recomendaciones estratégicas y análisis de riesgos.',
            'Integración ilimitada con herramientas externas.',
            'Panel de informes avanzado con personalización total.',
            'Soporte prioritario 24/7 con consultor dedicado.',
          ]}
          inverse
        />
      </div>
    </div>
  );
};
