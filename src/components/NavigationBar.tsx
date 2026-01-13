import { useLocation, Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import './NavigationBar.css';

interface Tab {
  id: string;
  label: string;
  path: string;
  devOnly?: boolean;
}

const tabs: Tab[] = [
  { id: 'about', label: 'About Me', path: '/' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'testing', label: 'Testing', path: '/testing', devOnly: true }
];

function NavigationBar() {
  const location = useLocation();
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicatorState, setIndicatorState] = useState({
    width: 0,
    left: 0,
    opacity: 0
  });

  // Filter tabs based on dev mode
  const visibleTabs = tabs.filter(tab =>
    !tab.devOnly || import.meta.env.DEV
  );

  // Determine active tab based on current route
  const getActiveTab = useCallback(() => {
    return visibleTabs.find(tab => {
      if (tab.path === '/' && location.pathname === '/') {
        return true;
      }
      if (tab.path !== '/' && location.pathname.startsWith(tab.path)) {
        return true;
      }
      return false;
    });
  }, [visibleTabs, location.pathname]);

  // Function to update indicator position
  const updateIndicatorPosition = useCallback(() => {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    const tabElement = tabRefs.current[activeTab.id];
    if (!tabElement) return;

    requestAnimationFrame(() => {
      const { offsetWidth, offsetLeft } = tabElement;

      setIndicatorState({
        width: offsetWidth + 2,
        left: offsetLeft - 1,
        opacity: 1
      });
    });
  }, [getActiveTab]);

  // Update indicator position when route changes
  useEffect(() => {
    updateIndicatorPosition();
  }, [updateIndicatorPosition]);

  // Update indicator position when window resizes
  useEffect(() => {
    window.addEventListener('resize', updateIndicatorPosition);

    return () => {
      window.removeEventListener('resize', updateIndicatorPosition);
    };
  }, [updateIndicatorPosition]);

  const activeTab = getActiveTab();

  return (
    <nav className="navigation-bar" aria-label="Main navigation">
      <div className="nav-container">
        {/* Animated indicator pill */}
        <div
          className="nav-indicator"
          style={{
            width: `${indicatorState.width}px`,
            left: `${indicatorState.left}px`,
            opacity: indicatorState.opacity
          }}
        />

        {/* Tab links */}
        {visibleTabs.map(tab => (
          <Link
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el; }}
            to={tab.path}
            className={`nav-tab ${activeTab?.id === tab.id ? 'active' : ''}`}
            aria-current={activeTab?.id === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default NavigationBar;
