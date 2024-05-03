if (import.meta.env.DEV) {
  import('preact/debug').then((module) => module);
}

import './assets/styles/index.css';
import { render } from 'preact';
import { App } from './app.tsx';

render(<App />, document.getElementById('app')!);
