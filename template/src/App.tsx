import config from './app.config.json';
import { Home } from './features/home/Home';
import logo from './assets/takeda-logo.png';

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="app-header">
        <div className="header-content">
          <div className="brand-logo-space"><img className="brand-logo" src={logo} alt="Takeda" /></div>
          <span>{config.displayName || 'Code App Starter'}</span>
        </div>
      </header>
      <main id="main" className="main-content"><Home /></main>
      <footer className="app-footer">Internal use only</footer>
    </div>
  );
}
