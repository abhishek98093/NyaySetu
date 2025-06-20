import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { getRole,isValidToken } from '../utils/utils';

const HomeRedirect = () => {
    const navigate=useNavigate();
    useEffect(()=>{
        if(isValidToken()){
            const role=getRole();
            switch(role){
                case 'admin':
                    navigate('/admindashboard');
                    break;
                case 'citizen':
                    navigate('/citizendashboard');
                    break;
                case 'police':
                    navigate('/policedashboard');
                    break;
                default:
                    navigate('/landingpage');
            }
        }else{
                navigate('/landingpage');
        }
    },[navigate]);
    return null;
}

export default HomeRedirect
