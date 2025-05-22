import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MindgrateApp from './MindgrateApp';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<MindgrateApp />} />
        <Route path="/hub" element={<MindgrateApp />} />
        <Route path="/agent" element={<MindgrateApp />} />
        <Route path="/data" element={<MindgrateApp />} />
        <Route path="/settings" element={<MindgrateApp />} />
        <Route path="/projects" element={<MindgrateApp />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
