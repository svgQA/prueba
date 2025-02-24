if (tryvoo_environment) {
  import('preact/debug').then((module) => module);
}

import './assets/styles/index.css';
import { render } from 'preact';
import { App } from './app.tsx';
import { tryvoo_environment } from './env.config.ts';

render(<App isPassedToWithAuthenticator />, document.getElementById('app')!);

/* Antes de quitar el indexHidden
dist/index.html                                      1.21 kB │ gzip:   0.45 kB
dist/assets/home-solution-4-Bm3Ggmpo.svg             4.12 kB │ gzip:   0.96 kB
dist/assets/home-service-3-s8M_e4e3.svg              4.79 kB │ gzip:   2.14 kB
dist/assets/home-service-1-DSfN2-5k.svg              4.87 kB │ gzip:   1.71 kB
dist/assets/home-solution-1-CsuiAUNk.svg             5.19 kB │ gzip:   1.35 kB
dist/assets/home-service-2-Cpc4nDwY.svg              5.33 kB │ gzip:   1.72 kB
dist/assets/home-icon-analitics-yEvf-Bmn.jpg         5.42 kB
dist/assets/home-service-4-CLZ6vl_7.svg              5.57 kB │ gzip:   1.36 kB
dist/assets/home-solution-2-raYGn25J.svg             6.28 kB │ gzip:   1.51 kB
dist/assets/home-icon-scalar-C7t4gSQE.jpg            6.58 kB
dist/assets/home-icon-reason-DKvDd-yu.jpg            7.78 kB
dist/assets/home-icon-place-DCHXcT1z.jpg             8.82 kB
dist/assets/home-solution-3-CvERAQR5.svg            11.04 kB │ gzip:   1.83 kB
dist/assets/icons-BdQocFq0.woff                     32.43 kB
dist/assets/icons-DcaNf80O.woff2                    33.02 kB
dist/assets/home-we-center-Bsyq9JTs.png             65.51 kB
dist/assets/edificio-LuqAcWCu.jpg                   72.52 kB
dist/assets/home-desktop-with-tryvoo-CnjT-uZF.png   86.71 kB
dist/assets/home-main-desktop-rFWM59hb.png         204.92 kB
dist/assets/we-background-K5BQnESa.png             817.40 kB
dist/assets/index-B0-NZaW-.css                      83.81 kB │ gzip:  15.48 kB
dist/assets/@aws-amplify-base-Tt1gacIg.css         295.94 kB │ gzip:  27.77 kB
dist/assets/debug.module-BeY38Waa.js                 9.42 kB │ gzip:   4.04 kB
dist/assets/purify.es-Ci5xwkH_.js                   21.71 kB │ gzip:   8.55 kB
dist/assets/@qrcode-base-Bn4uQIiW.js                24.56 kB │ gzip:   9.67 kB
dist/assets/@final-form-base-ClGtOGAi.js            30.90 kB │ gzip:  10.28 kB
dist/assets/@dnd-kit-base-BEpQy3jd.js               42.38 kB │ gzip:  14.53 kB
dist/assets/@tanstack-base-D8Kglm6d.js              55.81 kB │ gzip:  14.99 kB
dist/assets/@lodash-base-pu_xaHWl.js                97.91 kB │ gzip:  36.11 kB
dist/assets/@google-base-T7qo_CFo.js               148.79 kB │ gzip:  33.81 kB
dist/assets/index.es-NRs6hlxc.js                   149.85 kB │ gzip:  51.26 kB
dist/assets/html2canvas.esm-CBrSDip1.js            201.42 kB │ gzip:  48.03 kB
dist/assets/@jspdf-base-stljfAkU.js                358.36 kB │ gzip: 118.34 kB
*/
