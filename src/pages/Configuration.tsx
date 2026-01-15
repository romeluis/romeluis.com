import { Navigate } from 'react-router-dom';
import '../global.css';
import ConfigLayout from '../components/config/ConfigLayout';

function Configuration() {
  // Dev-only guard - prevent access in production
  if (!import.meta.env.DEV) {
    return <Navigate to="/" replace />;
  }

  return <ConfigLayout />;
}

export default Configuration;
