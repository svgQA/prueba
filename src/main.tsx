if (tryvoo_environment) {
  import('preact/debug').then((module) => module);
}

import './assets/styles/index.css';
import { render } from 'preact';
import { App } from './app.tsx';
import { tryvoo_environment } from './env.config.ts';

render(<App isPassedToWithAuthenticator />, document.getElementById('app')!);

/* Antes de quitar el indexHidden
dist/index.html                              0.95 kB │ gzip:   0.41 kB
dist/assets/icons-BdQocFq0.woff             32.43 kB
dist/assets/icons-DcaNf80O.woff2            33.02 kB
dist/assets/@components-base-DjTDVqoG.css    1.94 kB │ gzip:   0.66 kB
dist/assets/@assets-base-bwcUWZqS.css       53.38 kB │ gzip:  10.25 kB
dist/assets/index-BjL7t-NL.css             310.53 kB │ gzip:  30.54 kB
dist/assets/@router-base-LezkR45N.js         3.77 kB │ gzip:   2.01 kB
dist/assets/@preact-base-BUzJybyS.js        40.90 kB │ gzip:  15.29 kB
dist/assets/index-CDhUoP53.js               99.01 kB │ gzip:  29.21 kB
dist/assets/@utils-base-ChMnL8kP.js        131.47 kB │ gzip:  37.80 kB
dist/assets/@components-base-B_AuT0dF.js   632.43 kB │ gzip: 178.24 kB
*/

/* Despues de quitar el indexHidden
dist/index.html                              0.95 kB │ gzip:   0.40 kB
dist/assets/icons-BdQocFq0.woff             32.43 kB
dist/assets/icons-DcaNf80O.woff2            33.02 kB
dist/assets/@components-base-C13SWiFJ.css    1.94 kB │ gzip:   0.66 kB
dist/assets/@assets-base-bwcUWZqS.css       53.38 kB │ gzip:  10.25 kB
dist/assets/index-DInLb-iO.css             310.53 kB │ gzip:  30.46 kB
dist/assets/@router-base-HFxrIdhp.js         3.77 kB │ gzip:   2.01 kB
dist/assets/@preact-base-DyvCmhM-.js        40.90 kB │ gzip:  15.29 kB
dist/assets/index-DviuN9OI.js               99.01 kB │ gzip:  29.05 kB
dist/assets/@utils-base-BvWoWBdL.js        131.47 kB │ gzip:  37.42 kB
dist/assets/@components-base-BVI4P_as.js   631.10 kB │ gzip: 177.35 kB
*/
