import socialIcon1 from '@/assets/image/icon1.svg';
import socialIcon2 from '@/assets/image/icon2.svg';
import socialIcon3 from '@/assets/image/icon3.svg';
import HomeMainDesktopImg from '@/assets/image/home-main-desktop.png';
import { Logo } from '@/components/common/logo/logo';
import { useTranslation } from 'react-i18next';

const footerLinks = [
  {
    titleKey: 'h_footer_product',
    items: [
      'h_footer_item_shifts',
      'h_footer_item_reports',
      'h_footer_item_bot',
      'h_footer_item_sdk',
    ],
  },
  {
    titleKey: 'h_footer_company',
    items: ['h_footer_item_use_cases', 'h_footer_item_team', 'h_footer_item_security'],
  },
  {
    titleKey: 'h_footer_resources',
    items: ['h_footer_item_help', 'h_footer_item_blog', 'h_footer_item_support'],
  },
];

export const HomeFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className='bg-[#0b1f33] text-white'>
      <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-10 lg:grid-cols-8 lg:items-start'>
          <div className='space-y-3 lg:col-span-3'>
            <div className='fill-white'>
              <Logo slogan={t('h_logo_slogan')} />
            </div>
            <p className='text-sm text-white/80'>
              {t('h_footer_intro')}
            </p>
            <div className='flex items-center gap-3 pt-1 text-sm text-white/70'>
              <span className='vx-icon vx-icon-041 size-sm text-white' />
              {t('h_footer_email')}
            </div>
            <div className='flex items-center gap-3 text-sm text-white/70'>
              <span className='vx-icon vx-icon-007 size-sm text-white' />
              {t('h_footer_phone')}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-3'>
            {footerLinks.map((section) => (
              <div key={section.titleKey} className='space-y-3'>
                <h3 className='text-lg font-semibold'>{t(section.titleKey)}</h3>
                <ul className='space-y-2 text-sm text-white/80'>
                  {section.items.map((item) => (
                    <li key={item}>{t(item)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div className='space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-lg w-64'>
            <p className='text-sm uppercase tracking-[0.15em] text-white/80'>
              {t('h_footer_beta_badge')}
            </p>
            <p className='text-xl font-semibold'>{t('h_footer_beta_title')}</p>
            <p className='text-sm text-white/80'>
              {t('h_footer_beta_desc')}
            </p>
            <a
              href='/demo'
              className='inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-xl'
            >
              {t('h_footer_beta_cta')}
            </a>
            <div className='flex gap-3 pt-2'>
              <img
                src={socialIcon1}
                alt='LinkedIn'
                className='h-9 w-9 rounded-full bg-white/10 p-2'
              />
              <img
                src={socialIcon2}
                alt='Twitter'
                className='h-9 w-9 rounded-full bg-white/10 p-2'
              />
              <img
                src={socialIcon3}
                alt='Facebook'
                className='h-9 w-9 rounded-full bg-white/10 p-2'
              />
            </div>
          </div>

          <div className='overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 via-white/5 to-emerald-200/25 p-3 shadow-lg backdrop-blur-lg'>
            <div className='relative aspect-video overflow-hidden rounded-xl border border-white/15 bg-black/20'>
              <video
                className='absolute inset-0 h-full w-full object-cover'
                src='https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4'
                poster={HomeMainDesktopImg}
                controls
                loop
                muted
                playsInline
              />
            </div>
            <p className='mt-3 text-sm text-white/80'>
              {t('h_footer_video_desc')}
            </p>
          </div>
        </div>
      </div>

      <div className='border-t border-white/10'>
        <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-white/70 sm:flex-row sm:px-6 lg:px-8'>
          <p>
            © {new Date().getFullYear()} Tryvoo. {t('h_footer_rights')}
          </p>
          <div className='flex gap-4'>
            <a href='#' className='hover:text-white'>
              {t('h_footer_privacy')}
            </a>
            <a href='#' className='hover:text-white'>
              {t('h_footer_terms')}
            </a>
            <a href='#' className='hover:text-white'>
              {t('h_footer_support')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
