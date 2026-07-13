import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, BookOpen, Target, LogOut, Bell, Settings } from 'lucide-react';

const PortalLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <h1 className="text-xl font-bold text-blue-600 tracking-tight">WorkForceX</h1>
          </div>
          
          <nav className="p-4 space-y-1">
            <NavLink 
              to="/portal" 
              end
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <User size={20} />
              <span>My Profile</span>
            </NavLink>
            
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <BookOpen size={20} />
                <span>Learning</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">Soon</span>
            </button>
            
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-400 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Target size={20} />
                <span>Career Goals</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">Soon</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              {user?.first_name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6 z-10">
          <div className="flex items-center gap-4 ml-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
