// useLogout.js
import { useNavigate } from 'react-router-dom';
import { useUser } from './context';

const useLogout = () => {
    const { logout } = useUser();
    const navigate = useNavigate();

    const logoutAndNavigate = () => {
        logout();
        navigate("/");
    };

    return logoutAndNavigate;
};

export default useLogout;
