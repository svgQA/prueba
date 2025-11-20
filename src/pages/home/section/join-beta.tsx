import { useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

interface BetaFormData {
  name: string;
  email: string;
  company: string;
  role: string;
  teamSize: string;
  message: string;
}

const initialForm: BetaFormData = {
  name: '',
  email: '',
  company: '',
  role: '',
  teamSize: '',
  message: '',
};

export const HomeBetaForm = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<BetaFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    event: Event & {
      currentTarget: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    }
  ) => {
    const { name, value } = event.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id='beta'
      className='relative overflow-hidden bg-[#0b1f33] py-16 text-white md:py-24'
    >
      <div className='absolute inset-0 bg-gradient-to-r from-primary to-emerald-400 opacity-70' />
      <div className='relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 md:px-8'>
        <div className='space-y-5'>
          <p className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/90'>
            {t('h_beta_badge')}
          </p>
          <h2 className='text-3xl font-bold leading-tight md:text-4xl'>
            {t('h_beta_title')}
          </h2>
          <p className='text-lg text-white/90'>
            {t('h_beta_description')}
          </p>
          <ul className='grid grid-cols-1 gap-3 text-sm text-white/90 sm:grid-cols-2'>
            <li className='flex items-start gap-3 rounded-xl bg-white/10 p-3'>
              <span className='vx-icon vx-icon-013 size-sm text-white' />
              <div>
                <p className='font-semibold text-white'>{t('h_beta_item_onboarding_title')}</p>
                <p>{t('h_beta_item_onboarding_desc')}</p>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-xl bg-white/10 p-3'>
              <span className='vx-icon vx-icon-041 size-sm text-white' />
              <div>
                <p className='font-semibold text-white'>{t('h_beta_item_feedback_title')}</p>
                <p>{t('h_beta_item_feedback_desc')}</p>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-xl bg-white/10 p-3'>
              <span className='vx-icon vx-icon-007 size-sm text-white' />
              <div>
                <p className='font-semibold text-white'>{t('h_beta_item_ai_title')}</p>
                <p>{t('h_beta_item_ai_desc')}</p>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-xl bg-white/10 p-3'>
              <span className='vx-icon vx-icon-017 size-sm text-white' />
              <div>
                <p className='font-semibold text-white'>
                  {t('h_beta_item_operations_title')}
                </p>
                <p>{t('h_beta_item_operations_desc')}</p>
              </div>
            </li>
          </ul>
        </div>

        <div className='rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-white/20 md:p-8'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-xl font-bold text-[#0b1f33]'>
              {t('h_beta_form_title')}
            </h3>
            {submitted ? (
              <span className='rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700'>
                {t('h_beta_status_sent')}
              </span>
            ) : (
              <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary'>
                {t('h_beta_status_limited')}
              </span>
            )}
          </div>

          <form className='space-y-4' onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <label className='text-sm font-semibold text-[#0b1f33]'>
                {t('h_beta_field_name')}
                <input
                  required
                  type='text'
                  name='name'
                  value={form.name}
                  onInput={handleChange}
                  className='mt-2 w-full rounded-lg border border-[#d7e3f2] bg-white px-3 py-2 text-sm text-[#0b1f33] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
                  placeholder={t('h_beta_placeholder_name')}
                />
              </label>
              <label className='text-sm font-semibold text-[#0b1f33]'>
                {t('h_beta_field_email')}
                <input
                  required
                  type='email'
                  name='email'
                  value={form.email}
                  onInput={handleChange}
                  className='mt-2 w-full rounded-lg border border-[#d7e3f2] bg-white px-3 py-2 text-sm text-[#0b1f33] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
                  placeholder={t('h_beta_placeholder_email')}
                />
              </label>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <label className='text-sm font-semibold text-[#0b1f33]'>
                {t('h_beta_field_company')}
                <input
                  required
                  type='text'
                  name='company'
                  value={form.company}
                  onInput={handleChange}
                  className='mt-2 w-full rounded-lg border border-[#d7e3f2] bg-white px-3 py-2 text-sm text-[#0b1f33] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
                  placeholder={t('h_beta_placeholder_company')}
                />
              </label>
              <label className='text-sm font-semibold text-[#0b1f33]'>
                {t('h_beta_field_role')}
                <input
                  required
                  type='text'
                  name='role'
                  value={form.role}
                  onInput={handleChange}
                  className='mt-2 w-full rounded-lg border border-[#d7e3f2] bg-white px-3 py-2 text-sm text-[#0b1f33] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
                  placeholder={t('h_beta_placeholder_role')}
                />
              </label>
            </div>

            <label className='text-sm font-semibold text-[#0b1f33]'>
              {t('h_beta_field_team')}
              <select
                required
                name='teamSize'
                value={form.teamSize}
                onInput={handleChange}
                className='mt-2 w-full appearance-none rounded-lg border border-[#d7e3f2] bg-white px-3 py-2 pr-10 text-sm text-[#0b1f33] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
                style={{
                  backgroundImage:
                    'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none"%3E%3Cpath d="M1 1.5L6 6.5L11 1.5" stroke="%230b1f33" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/%3E%3C/svg%3E\')',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                }}
              >
                <option value=''>{t('h_beta_option_select')}</option>
                <option value='0-50'>{t('h_beta_option_0_50')}</option>
                <option value='51-150'>{t('h_beta_option_51_150')}</option>
                <option value='151-300'>{t('h_beta_option_151_300')}</option>
                <option value='300+'>{t('h_beta_option_300_plus')}</option>
              </select>
            </label>

            <label className='text-sm font-semibold text-[#0b1f33]'>
              {t('h_beta_field_message')}
              <textarea
                name='message'
                rows={3}
                value={form.message}
                onInput={handleChange}
                className='mt-2 w-full rounded-lg border border-[#d7e3f2] bg-white px-3 py-2 text-sm text-[#0b1f33] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
                placeholder={t('h_beta_placeholder_message')}
              />
            </label>

            <button
              type='submit'
              className='flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl'
            >
              <span className='vox-icon vx-icon-004 size-sm text-white' />
              {t('h_beta_submit')}
            </button>

            {submitted && (
              <p className='rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700'>
                {t('h_beta_success')}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
