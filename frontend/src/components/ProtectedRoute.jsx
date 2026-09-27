import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { seller } = useAuth();
  const token = localStorage.getItem('seller_token');
  if (!seller && !token) return <Navigate to="/login" replace />;
  return children;
}
