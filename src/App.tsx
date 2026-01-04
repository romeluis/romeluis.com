import './global.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import TestPage from './pages/test';

function App() {
  const isDevelopment = import.meta.env.DEV;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {isDevelopment && <Route path="/test" element={<TestPage />} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
