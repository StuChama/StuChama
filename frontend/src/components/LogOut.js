import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toast } from 'sonner';

export default function LogoutButton() {
  const { clearToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
