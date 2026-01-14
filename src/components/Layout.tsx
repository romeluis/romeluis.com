import { useLocation, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar';
import AboutMe from '../pages/AboutMe';
import Projects from '../pages/Projects';
import Configuration from '../pages/Configuration';
import TestPage from '../pages/test';
import './Layout.css';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut');
    }
  }, [location.pathname, displayLocation.pathname]);

  const onAnimationEnd = () => {
    if (transitionStage === 'fadeOut') {
      setTransitionStage('fadeIn');
      setDisplayLocation(location);
    }
  };

  // Check if current location is valid, if not redirect
  useEffect(() => {
    const validPaths = ['/', '/projects'];
    if (isDevelopment) {
      validPaths.push('/testing', '/configuration');
    }

    if (!validPaths.includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate, isDevelopment]);

  return (
    <>
      <NavigationBar />
      <main
        className={`page-wrapper ${transitionStage}`}
        onAnimationEnd={onAnimationEnd}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<AboutMe />} />
          <Route path="/projects" element={<Projects />} />
          {isDevelopment && <Route path="/configuration" element={<Configuration />} />}
          {isDevelopment && <Route path="/testing" element={<TestPage />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default Layout;
