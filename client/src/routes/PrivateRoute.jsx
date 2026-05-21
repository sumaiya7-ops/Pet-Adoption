import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import LoadingSpinner from '../components/LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext) || {};
    const location = useLocation();

    if (loading) {
        // আমাদের নতুন থিমের স্পিনারটি রেন্ডার হবে
        return <LoadingSpinner />;
    }

    if (user) {
        return children;
    }

    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
