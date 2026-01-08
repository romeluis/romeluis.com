import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, cloneElement, ReactElement } from 'react';
import NavigationBar from './NavigationBar';
import './Layout.css';

interface LayoutProps {
  children: ReactElement;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

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

  return (
    <>
      <NavigationBar />
      <main
        className={`page-wrapper ${transitionStage}`}
        onAnimationEnd={onAnimationEnd}
      >
        {cloneElement(children, { key: displayLocation.pathname, location: displayLocation })}
      </main>
    </>
  );
}

export default Layout;
