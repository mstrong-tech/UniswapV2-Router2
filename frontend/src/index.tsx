import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import Providers from './Providers';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);
