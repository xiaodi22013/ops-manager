import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import EditProject from './pages/EditProject';
import ProjectDetail from './pages/ProjectDetail';
import CloudResources from './pages/CloudResources';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/projects" element={<Layout><ProjectList /></Layout>} />
        <Route path="/projects/new" element={<Layout><EditProject /></Layout>} />
        <Route path="/projects/:id" element={<Layout><ProjectDetail /></Layout>} />
        <Route path="/projects/:id/edit" element={<Layout><EditProject /></Layout>} />
        <Route path="/resources" element={<Layout><CloudResources /></Layout>} />
      </Routes>
    </HashRouter>
  );
};

export default App;