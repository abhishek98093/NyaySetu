import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole, isValidToken } from '../utils/utils';

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isValidToken()) {
      const role = getRole();
      switch (role) {
        case 'admin':
          navigate('/admindashboard', { replace: true });
          break;
        case 'citizen':
          navigate('/citizendashboard', { replace: true });
          break;
        case 'police':
          navigate('/policedashboard', { replace: true });
          break;
        default:
          // If no valid role, remove token and redirect to landing page
          localStorage.removeItem('token');
          navigate('/landingpage', { replace: true });
      }
    } else {
      navigate('/landingpage', { replace: true });
    }
  }, [navigate]);

  return null;
};

export default HomeRedirect;
