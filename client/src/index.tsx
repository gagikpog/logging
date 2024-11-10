import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initServiceWorker } from './serviceWorkerInit';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);

initServiceWorker();
