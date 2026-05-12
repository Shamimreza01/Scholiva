import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 min-h-screen overflow-y-auto p-4 md:p-10 lg:p-12">
        <Outlet context={{ user, fetchProfile }} />
      </main>
    </div>
  );
}
