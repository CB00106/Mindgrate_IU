import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure you have this file with Tailwind CSS
import MindgrateApp from './MindgrateApp';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MindgrateApp />
  </React.StrictMode>
);
