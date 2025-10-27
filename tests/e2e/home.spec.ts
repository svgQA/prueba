import { expect, test, type Locator, type Page } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://dev.tryvoo.com';

type LanguageKey = 'es' | 'en';

type HomeContent = {
  [key in LanguageKey]: {
    languageLabel: string;
    heroHeading: string;
    heroCta: string;
    prosTitle: string;
    prosStats: string;
    carouselCta: string;
    solutionsTitle: string;
    solutionsCta: string;
    aboutTitle: string;
    plansTitle: string;
    footerTitle: string;
    footerCta: string;
  };
};

const homeContent: HomeContent = {
  es: {
    languageLabel: 'Español',
    heroHeading: 'Transforma la Gestión de Operaciones Con Tryvoo',
    heroCta: 'Agenda Una Demo Gratis',
    prosTitle: '¿Por qué Tryvoo?',
    prosStats:
      'El 60% de las empresas en LATAM buscan herramientas que mejoren la trazabilidad y reduzcan costos operativos',
    carouselCta: 'Ver detalle',
    solutionsTitle: 'Soluciones por Industria',
    solutionsCta: 'Inicia tu prueba gratis!',
    aboutTitle: 'Conócenos',
    plansTitle: 'Nuestros Planes',
    footerTitle: 'Secciones Populares',
    footerCta: 'Comienza ahora y disfruta',
  },
  en: {
    languageLabel: 'English',
    heroHeading: 'Transform Operations Management With Tryvoo',
    heroCta: 'Schedule a Free Demo',
    prosTitle: 'Why Tryvoo?',
    prosStats:
      '60% of companies in LATAM are looking for tools that improve traceability and reduce operational costs',
    carouselCta: 'View details',
    solutionsTitle: 'Industry Solutions',
    solutionsCta: 'Start free trial!',
    aboutTitle: 'About Us',
    plansTitle: 'Our Plans',
    footerTitle: 'Popular Sections',
    footerCta: 'Start now and enjoy',
  },
};

const assertHomeContent = async (
  page: Page,
  language: LanguageKey,
  languageSwitcher: Locator
) => {
  const content = homeContent[language];

  await expect(languageSwitcher).toHaveText(content.languageLabel);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    content.heroHeading
  );
  await expect(
    page.getByRole('button', { name: content.heroCta, exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: content.prosTitle })
  ).toBeVisible();
  await expect(
    page.getByText(content.prosStats, { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: content.carouselCta, exact: true })
  ).toBeVisible();
  await expect(
    page.locator('span').filter({ hasText: content.solutionsTitle })
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: content.solutionsCta, exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: content.aboutTitle, exact: true })
  ).toBeVisible();
  // await expect(
  //   page.getByRole('heading', { name: content.plansTitle, exact: true })
  // ).toBeVisible();
  // await expect(
  //   page.getByRole('heading', { name: content.footerTitle, exact: true })
  // ).toBeVisible();
  await expect(
    page.getByRole('button', { name: content.footerCta, exact: true })
  ).toBeVisible();
};

/**
 * E2E test to ensure the Home page displays the expected marketing information.
 */
test.describe('Home page', () => {
  test('shows all key sections and updates text when switching languages', async ({
    page,
  }) => {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

    const languageSwitcher = page
      .locator('button:has(span.vx-icon-080)')
      .first();
    await expect(languageSwitcher).toBeVisible();

    const initialLabel = (await languageSwitcher.innerText()).trim();
    const initialLanguage: LanguageKey = initialLabel.includes(
      homeContent.es.languageLabel
    )
      ? 'es'
      : 'en';

    await assertHomeContent(page, initialLanguage, languageSwitcher);

    const targetLanguage: LanguageKey = initialLanguage === 'es' ? 'en' : 'es';
    await languageSwitcher.click();
    const switcherContainer = languageSwitcher.locator('..');
    await switcherContainer.getByTestId(`opt-lang-${targetLanguage}`).click();

    await expect(languageSwitcher).toHaveText(
      homeContent[targetLanguage].languageLabel
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      homeContent[targetLanguage].heroHeading
    );

    await assertHomeContent(page, targetLanguage, languageSwitcher);
  });
});
