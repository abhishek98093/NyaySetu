import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetUser } from '../slices/userSlice';
import { isValidToken } from '../utils/utils';
import { useNavigate } from 'react-router-dom';

const TokenExpiryChecker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isValidToken()) {
        console.log("🔴 Token expired. Logging out...");
        localStorage.removeItem("token");
        dispatch(resetUser());
        navigate('/landingpage');
      }
    }, 60 * 1000); // Check every 1 minute

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  return null;
};

export default TokenExpiryChecker;
