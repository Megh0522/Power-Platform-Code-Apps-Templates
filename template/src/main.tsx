import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import config from './app.config.json';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import './styles/brand.css';
import './styles/app.css';

document.title = config.displayName || 'Code App';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
