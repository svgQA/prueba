if (tryvoo_environment) {
  import('preact/debug').then((module) => module);
}

import './assets/styles/index.css';
import { render } from 'preact';
import { App } from './app.tsx';
import { tryvoo_environment } from './env.config.ts';

render(<App isPassedToWithAuthenticator />, document.getElementById('app')!);
