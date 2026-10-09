import { useState } from 'react';
import config from '../../app.config.json';

export function Home() {
  const [started, setStarted] = useState(false);
  return (
    <>
      <p className="eyebrow">Your workspace</p>
      <h1>{config.displayName || 'Build your next Code App'}</h1>
      <p className="intro">A shared foundation for your team's next business application.</p>
      <section className="panel" aria-labelledby="workspace-heading">
        <h2 id="workspace-heading">Make it yours</h2>
        <p>Add the workflows, data, and tools your team needs.</p>
        <button className="button button-primary" onClick={() => setStarted(true)}>Get started</button>
        <p className="status" role="status">{started ? 'Your workspace is ready to customize.' : '\u00a0'}</p>
      </section>
    </>
  );
}
