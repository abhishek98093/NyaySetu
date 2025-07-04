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
    }, 60 * 5000); // Check every 1 minute

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  return null;
};

export default TokenExpiryChecker;



// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { resetUser } from '../slices/userSlice';
// import { isValidToken } from '../utils/utils';
// import { useNavigate } from 'react-router-dom';

// const TokenExpiryChecker = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     let lastActivityTime = Date.now();

//     const updateActivity = () => {
//       lastActivityTime = Date.now();
//     };

//     // Events to track user activity
//     window.addEventListener('mousemove', updateActivity);
//     window.addEventListener('keydown', updateActivity);
//     window.addEventListener('click', updateActivity);
//     window.addEventListener('touchstart', updateActivity);

//     const interval = setInterval(() => {
//       const currentTime = Date.now();

//       // Check if inactive for more than 5 minutes (300,000 ms)
//       if (currentTime - lastActivityTime > 5 * 60 * 1000) {
//         console.log("🔴 User inactive for 5 minutes. Logging out...");

//         localStorage.removeItem("token");
//         dispatch(resetUser());
//         navigate('/landingpage');
//       } else if (!isValidToken()) {
//         // Token expiry check as a backup
//         console.log("🔴 Token expired. Logging out...");
//         localStorage.removeItem("token");
//         dispatch(resetUser());
//         navigate('/landingpage');
//       }
//     }, 60 * 1000); // Check every minute

//     // Cleanup on unmount
//     return () => {
//       clearInterval(interval);
//       window.removeEventListener('mousemove', updateActivity);
//       window.removeEventListener('keydown', updateActivity);
//       window.removeEventListener('click', updateActivity);
//       window.removeEventListener('touchstart', updateActivity);
//     };
//   }, [dispatch, navigate]);

//   return null;
// };

// export default TokenExpiryChecker;
