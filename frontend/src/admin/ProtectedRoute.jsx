import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    //  Use sessionStorage instead of localStorage
    const token = sessionStorage.getItem('token');
    if (!token) return <Navigate to="/admin/login" replace />;
    return children;
}