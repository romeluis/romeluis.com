import './global.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AboutMe from './pages/AboutMe';
import Projects from './pages/Projects';
import TestPage from './pages/test';

function App() {
  const isDevelopment = import.meta.env.DEV;

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<AboutMe />} />
          <Route path="/projects" element={<Projects />} />
          {isDevelopment && <Route path="/testing" element={<TestPage />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
