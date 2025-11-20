import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Cloud, Users, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Cloud Resources', path: '/resources', icon: <Cloud size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-30 h-screen w-64 bg-sidebar text-white transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 bg-slate-900 shadow-md">
          <h1 className="text-xl font-bold tracking-wider">OpsManager</h1>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => { if(window.innerWidth < 1024) onClose(); }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive(item.path) 
                  ? 'bg-primary text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}

           <div className="pt-6 pb-2">
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</p>
           </div>
           <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Settings size={20} />
              <span>Settings</span>
           </Link>
           <button 
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              window.location.hash = '#/login';
              window.location.reload();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
           >
              <LogOut size={20} />
              <span>Sign Out</span>
           </button>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900">
           <div className="flex items-center gap-3">
              <img src="https://picsum.photos/seed/currentUser/40/40" alt="User" className="w-10 h-10 rounded-full border-2 border-slate-600" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-slate-400 truncate">admin@ops.com</p>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;