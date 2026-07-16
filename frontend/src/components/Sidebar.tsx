import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, HeadphonesIcon, LogOut } from 'lucide-react';
import { cn } from '../utils';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'New Ticket', to: '/tickets/new', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <HeadphonesIcon className="h-6 w-6 text-indigo-400 mr-2" />
        <span className="text-xl font-bold tracking-wide">SupportPro</span>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )
            }
          >
            <link.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            {link.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold uppercase">
              {user?.full_name?.substring(0, 2) || 'US'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium truncate max-w-[100px]">{user?.full_name || 'User'}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role || 'Agent'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
