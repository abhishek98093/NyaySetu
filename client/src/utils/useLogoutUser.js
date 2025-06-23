import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetComplaint } from '../slices/complaintSlice';
import { resetUser} from '../slices/userSlice';

const useLogoutUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    // ✅ Remove token
    localStorage.removeItem('token');

    // ✅ Reset Redux slices cleanly (without purging persist config)
    dispatch(resetComplaint());
    dispatch(resetUser());

    // ✅ Optional: pause persistor if needed (usually not required)
    // persistor.pause();

    toast.success("Logged out successfully");
    navigate('/');
  };

  return logout;
};

export default useLogoutUser;
