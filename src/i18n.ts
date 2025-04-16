import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Recursos para traducciones directamente en el código
const resources = {
  en: {
    translation: {
      navbar: {
        products: 'Our Products',
        about: 'About Us',
        demo: 'Request a Demo',
        signin: 'Sign In',
      },
      home: {
        title: 'Transform Operations Management With Tryvoo',
        subtitle:
          'Optimize the management of activities, resources and assets, even without connectivity for your business',
        demoButton: 'Schedule a Free Demo',
      },
      pros: {
        title: 'Why Tryvoo?',
        subtitle: 'Simplify. Optimize. Grow.',
        stats:
          '60% of companies in LATAM are looking for tools that improve traceability and reduce operational costs',
        description:
          'Tryvoo is leading this transformation, thanks to the complete digitization and automation of field activities, delivering intuitive solutions, accessible even without connection.',
        items: {
          management: {
            title: 'Easy Management and Traceability:',
            subtitle:
              '"Total control over field operations, with real-time visibility and tracking."',
          },
          ai: {
            title: 'AI Assistance:',
            subtitle:
              '"Receive automatic recommendations and support for your operations directly in the field."',
          },
          offline: {
            title: 'Offline Synchronization:',
            subtitle:
              '"Continue managing even without internet, and data synchronizes when connection is restored."',
          },
          scalability: {
            title: 'Scalability:',
            subtitle:
              '"Adaptable to any company size or industry, from surveillance to logistics."',
          },
        },
        button: 'Discover all possibilities',
      },
      solutions: {
        title: 'Industry Solutions',
        subtitle: 'Tryvoo is optimized for different sectors.',
        items: {
          security: {
            title: 'Security',
            subtitle:
              'Manage security rounds, generate incident reports, and ensure complete control over operator activities.',
          },
          logistics: {
            title: 'Logistics',
            subtitle:
              'Track vehicles, monitor deliveries, and optimize route assignment to maximize efficiency.',
          },
          construction: {
            title: 'Construction',
            subtitle:
              'Coordinate field worker tasks, control resources, and track project progress.',
          },
          health: {
            title: 'Healthcare',
            subtitle:
              'Manage health technicians, track home visits, and handle requests in real-time.',
          },
        },
        button: 'Start free trial!',
      },
      services: {
        title: 'Featured Services',
        subtitle: 'Everything you need in one platform',
        items: {
          monitoring: {
            title: 'Real-Time Monitoring',
            subtitle:
              'Visualize task progress and asset status with automatic updates based on real-time data.',
          },
          offline: {
            title: 'Offline Capabilities',
            subtitle:
              'Operators can continue working without a connection, and all data syncs when internet connection is restored.',
          },
          ai: {
            title: 'AI and Virtual Support',
            subtitle:
              'Your virtual assistant to solve field problems, with recommendations based on data captured during operations.',
          },
          integration: {
            title: 'Integration and Customization',
            subtitle:
              'Easy integration with existing tools and a platform that adapts to the needs of each sector.',
          },
        },
        button: 'View details',
      },
      carousel: {
        viewDetails: 'View details',
        items: {
          monitoring: {
            title: 'Real-Time Monitoring',
            subtitle:
              'Visualize task progress and asset status with automatic updates based on real-time data.',
          },
          offline: {
            title: 'Offline Capabilities',
            subtitle:
              'Operators can continue working without connection, and all data syncs when internet connection is restored.',
          },
          ai: {
            title: 'AI and Virtual Support',
            subtitle:
              'Your virtual assistant to solve field problems, with recommendations based on data captured during operations.',
          },
          integration: {
            title: 'Integration and Customization',
            subtitle:
              'Easy integration with existing tools and a platform that adapts to the needs of each sector.',
          },
        },
      },
      about: {
        title: 'About Us',
        subtitle:
          'At Tryvoo, we understand the complexities of operating outside the office.',
        mainText:
          'At Tryvoo, we work to ensure your field team has the tools they need to achieve more, with safety and efficiency, anywhere.',
        missionTitle: 'Our Mission',
        missionText:
          'To empower companies with tools to efficiently manage their field operations, providing total control of activities, resources, and assets, while ensuring security and traceability at all times.',
        valuesTitle: 'Our Values',
        valuesText:
          'Innovation and continuous improvement. Security, traceability, and trust. Transparency in communication. Commitment to customers and collaborators.',
      },
      plans: {
        title: 'Our Plans',
        subtitle:
          'Choose the perfect plan for your business and transform your field operations. Start with Tryvoo today!',
        free: {
          pricing: '7 Days Free',
          name: 'Free Trial',
          action: 'Start Trial',
          subtitle: 'Start with 7 days and a basic plan',
          options: {
            option1: 'Limited operations management (up to 5 users).',
            option2: 'Real-time monitoring for a maximum of 3 assets.',
            option3:
              'Limited virtual assistance (support only during business hours).',
            option4:
              'Integration with one external tool. Duration: 30-day free trial. Enterprise Plan (Intermediate).',
            option5: 'For growing companies that need greater reach.',
          },
        },
        enterprise: {
          pricing: '$49 USD/month',
          name: 'Enterprise Plan',
          action: 'Start Plan',
          subtitle: 'Get greater reach.',
          options: {
            option1: 'Operations management for up to 50 users.',
            option2: 'Real-time monitoring with unlimited assets.',
            option3:
              'Complete offline functionality (automatic data synchronization).',
            option4: 'AI-powered assistance (24/7 support).',
            option5: 'Integration with up to 3 external tools.',
            option6: 'Basic reporting dashboard for data analysis.',
          },
        },
        premium: {
          pricing: '$49 USD/month',
          name: 'Premium Plan',
          action: 'Start Plan',
          subtitle: 'Advanced companies',
          options: {
            option1: 'Unlimited users and scalable operations.',
            option2:
              'Advanced monitoring with real-time reporting and predictive analytics.',
            option3:
              'Advanced offline capabilities (support for multiple devices).',
            option4:
              'Advanced AI with strategic recommendations and risk analysis.',
            option5: 'Unlimited integration with external tools.',
            option6: 'Advanced reporting dashboard with full customization.',
            option7: 'Priority 24/7 support with dedicated consultant.',
          },
        },
      },
      footer: {
        popularSections: 'Popular Sections',
        learnMore: 'Learn more about Tryvoo',
        contactUs: 'Contact Us',
        contactInfo: '3157789022 - Popayán, Cauca',
        ourNetworks: 'Our Networks',
        freeAdvice: 'We provide free advice!',
        optimizeMessage:
          'To help you start optimizing your business with agile tools that operate in any space and place',
        startButton: 'Start now and enjoy',
      },
      login: {
        welcome: 'Welcome to Tryvoo',
        slogan: 'Simplify. Optimize. Grow.',
        signIn: 'Sign In',
        forgotPassword: 'Forgot your password?',
      },
      memos: {
        title: 'VX - Chat',
        frequentQuestions: {
          title: 'Frequent Questions',
          question1: 'How can I start a new project?',
          question2: 'What are the best coding practices?',
          question3: 'How can I optimize my application?',
        },
        chat: {
          aiAssistant: 'AI Assistant',
          aiDefaultMessage: 'I can help with that',
          itsMe: "IT'S ME",
          other: 'OTHER',
          time: '10:15',
          errorMessage: 'The message has a bad structure',
        },
      },
    },
  },
  es: {
    translation: {
      navbar: {
        products: 'Nuestros productos',
        about: 'Conócenos',
        demo: 'Solicita una demo',
        signin: 'Iniciar sesión',
      },
      home: {
        title: 'Transforma la Gestión de Operaciones Con Tryvoo',
        subtitle:
          'Optimiza la gestión de actividades, recursos y activos, incluso sin conectividad para tus negocios',
        demoButton: 'Agenda Una Demo Gratis',
      },
      pros: {
        title: '¿Por qué Tryvoo?',
        subtitle: 'Simplifica. Optimiza. Crece.',
        stats:
          'El 60% de las empresas en LATAM buscan herramientas que mejoren la trazabilidad y reduzcan costos operativos',
        description:
          'Tryvoo está liderando esta transformación, gracias a la Digitalización y automatización completa de las actividades en campo, llegando a soluciones intuitivas, accesibles incluso sin conexión.',
        items: {
          management: {
            title: 'Fácil Gestión y Trazabilidad:',
            subtitle:
              '"Control total sobre las operaciones en campo, con visibilidad y seguimiento en tiempo real."',
          },
          ai: {
            title: 'Asistencia con IA:',
            subtitle:
              '"Recibe recomendaciones automáticas y soporte para tus operativos directamente en el terreno."',
          },
          offline: {
            title: 'Sincronización Offline:',
            subtitle:
              '"Sigue gestionando incluso sin internet, y los datos se sincronizan al restaurar la conexión."',
          },
          scalability: {
            title: 'Escalabilidad:',
            subtitle:
              '"Adaptable a cualquier tamaño de empresa o industria, desde la vigilancia hasta la logística."',
          },
        },
        button: 'Conoce todas las posibilidades',
      },
      solutions: {
        title: 'Soluciones por Industria',
        subtitle: 'Tryvoo está optimizado para diferentes sectores.',
        items: {
          security: {
            title: 'Seguridad',
            subtitle:
              'Administra rondas de seguridad, genera reportes de incidentes y asegura el control total sobre las actividades de los operadores.',
          },
          logistics: {
            title: 'Logística',
            subtitle:
              'Trackea vehículos, monitorea entregas y optimiza la asignación de rutas para maximizar la eficiencia.',
          },
          construction: {
            title: 'Construcción',
            subtitle:
              'Coordina tareas de trabajadores en campo, controla recursos y trackea el progreso del proyecto.',
          },
          health: {
            title: 'Salud',
            subtitle:
              'Administra técnicos de salud, trackea visitas a domicilio y maneja solicitudes en tiempo real.',
          },
        },
        button: 'Inicia tu prueba gratis!',
      },
      services: {
        title: 'Nuestros Servicios',
        subtitle: 'Soluciones para cada necesidad',
        items: {
          monitoring: {
            title: 'Monitorio en Tiempo Real',
            subtitle:
              'Visualiza el progreso de las tareas y el estado de los activos con actualizaciones automáticas y basadas en datos en tiempo real.',
          },
          offline: {
            title: 'Capacidades Offline',
            subtitle:
              'Los operarios pueden seguir trabajando sin conexión, y todos los datos se sincronizan cuando la conexión a Internet es restaurada.',
          },
          ai: {
            title: 'IA y Soporte Virtual',
            subtitle:
              'Tu asistente virtual para resolver problemas en campo, con recomendaciones basadas en los datos que se capturan durante las operaciones.',
          },
          integration: {
            title: 'Integración y Personalización',
            subtitle:
              'Fácil integración con herramientas ya existentes y una plataforma que se adapta a las necesidades de cada sector.',
          },
        },
        button: 'Ver más servicios',
      },
      carousel: {
        viewDetails: 'Ver detalle',
        items: {
          monitoring: {
            title: 'Monitorio en Tiempo Real',
            subtitle:
              'Visualiza el progreso de las tareas y el estado de los activos con actualizaciones automáticas y basadas en datos en tiempo real.',
          },
          offline: {
            title: 'Capacidades Offline',
            subtitle:
              'Los operarios pueden seguir trabajando sin conexión, y todos los datos se sincronizan cuando la conexión a Internet es restaurada.',
          },
          ai: {
            title: 'IA y Soporte Virtual',
            subtitle:
              'Tu asistente virtual para resolver problemas en campo, con recomendaciones basadas en los datos que se capturan durante las operaciones.',
          },
          integration: {
            title: 'Integración y Personalización',
            subtitle:
              'Fácil integración con herramientas ya existentes y una plataforma que se adapta a las necesidades de cada sector.',
          },
        },
      },
      about: {
        title: 'Conócenos',
        subtitle:
          'En Tryvoo, entendemos las complejidades de operar fuera de la oficina.',
        mainText:
          'En Tryvoo, trabajamos para asegurarnos de que tu equipo en campo tenga las herramientas necesarias para lograr más, con seguridad y eficiencia, en cualquier lugar.',
        missionTitle: 'Nuestra Misión',
        missionText:
          'Empoderar a las empresas con herramientas para gestionar de manera eficiente sus operaciones en campo, brindando control total de actividades, recursos y activos, asegurando la seguridad y trazabilidad en todo momento.',
        valuesTitle: 'Nuestros Valores',
        valuesText:
          'Innovación y mejora continua. Seguridad, trazabilidad y confianza. Transparencia en la comunicación. Compromiso con clientes y colaboradores.',
      },
      plans: {
        title: 'Nuestros Planes',
        subtitle:
          'Elige el plan perfecto para tu negocio y transforma tus operaciones en campo. ¡Comienza con Tryvoo hoy!',
        free: {
          pricing: '7 Días Gratis',
          name: 'Prueba Gratis',
          action: 'Inicia Prueba',
          subtitle: 'Comienza con 7 días y un plan básico',
          options: {
            option1: 'Gestión de operaciones limitada (hasta 5 usuarios).',
            option2: 'Monitoreo en tiempo real para un máximo de 3 activos.',
            option3:
              'Asistencia virtual limitada (soporte solo durante horas laborables).',
            option4:
              'Integración con una herramienta externa. Duración: Prueba gratuita de 30 días. Plan Empresarial (Intermedio).',
            option5:
              'Para empresas en crecimiento que necesitan mayor alcance.',
          },
        },
        enterprise: {
          pricing: '$49 USD/mes',
          name: 'Plan Empresarial',
          action: 'Inicia Plan',
          subtitle: 'Obtén mayor alcance.',
          options: {
            option1: 'Gestión de operaciones para hasta 50 usuarios.',
            option2: 'Monitoreo en tiempo real con activos ilimitados.',
            option3:
              'Funcionalidad completa sin conexión (sincronización automática de datos).',
            option4: 'Asistencia con IA (soporte 24/7).',
            option5: 'Integración con hasta 3 herramientas externas.',
            option6: 'Panel de informes básico para análisis de datos.',
          },
        },
        premium: {
          pricing: '$49 USD/mes',
          name: 'Plan Premium',
          action: 'Inicia Plan',
          subtitle: 'Empresas avanzadas',
          options: {
            option1: 'Usuarios ilimitados y operaciones escalables.',
            option2:
              'Monitoreo avanzado con informes en tiempo real y análisis predictivo.',
            option3:
              'Capacidades avanzadas sin conexión (soporte para múltiples dispositivos).',
            option4:
              'IA avanzada con recomendaciones estratégicas y análisis de riesgos.',
            option5: 'Integración ilimitada con herramientas externas.',
            option6: 'Panel de informes avanzado con personalización completa.',
            option7: 'Soporte prioritario 24/7 con consultor dedicado.',
          },
        },
      },
      footer: {
        popularSections: 'Secciones Populares',
        learnMore: 'Conoce más sobre Tryvoo',
        contactUs: 'Contáctanos',
        contactInfo: '3157789022 - Popayán, Cauca',
        ourNetworks: 'Nuestras Redes',
        freeAdvice: '¡Ofrecemos asesoría gratuita!',
        optimizeMessage:
          'Para ayudarte a empezar a optimizar tu negocio con herramientas ágiles que operan en cualquier espacio y lugar',
        startButton: 'Comienza ahora y disfruta',
      },
      login: {
        welcome: 'Bienvenido a Tryvoo',
        slogan: 'Simplifica. Optimiza. Crece.',
        signIn: 'Iniciar sesión',
        forgotPassword: '¿Olvidó su contraseña?',
      },
      memos: {
        title: 'VX - Chat',
        frequentQuestions: {
          title: 'Preguntas Frecuentes',
          question1: '¿Cómo puedo empezar un nuevo proyecto?',
          question2: '¿Cuáles son las mejores prácticas de código?',
          question3: '¿Cómo puedo optimizar mi aplicación?',
        },
        chat: {
          aiAssistant: 'Asistente IA',
          aiDefaultMessage: 'Puedo ayudar con eso',
          itsMe: 'SOY YO',
          other: 'OTRO',
          time: '10:15',
          errorMessage: 'El mensaje tiene mala estructura',
        },
      },
    },
  },
};

i18n
  // Detecta el idioma del usuario
  .use(LanguageDetector)
  // Pasa el i18n a react-i18next
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: true, // Puedes desactivar esto en producción

    interpolation: {
      escapeValue: false, // No es necesario para React/Preact
    },
  });

export default i18n;
