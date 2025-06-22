import { persistor } from '../store/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setComplaints } from '../slices/complaintSlice';
import { setUser } from '../slices/userSlice';


const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    persistor.purge();
    dispatch(setComplaints({ complaints: [], loadedAt: null }));
    dispatch(setUser({user:[],loadedAt:null}));
    localStorage.removeItem('token');
    toast.success("Logged out successfully");
    navigate('/');
  };

  return logout;
};

export default useLogout;
