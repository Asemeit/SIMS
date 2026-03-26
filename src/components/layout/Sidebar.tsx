import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, MapPin, Settings as SettingsIcon, LogOut, Package, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Box },
  { name: 'Locations', href: '/locations', icon: MapPin },
  { name: 'Support', href: '/support', icon: HelpCircle },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

interface SidebarProps {
    onClose?: () => void;
    className?: string; 
}

export function Sidebar({ onClose, className }: SidebarProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className={cn(
        "w-64 flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-full transition-colors duration-300",
        className
    )}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">SIMS</h1>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        to={item.href}
                        onClick={onClose}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            isActive 
                                ? "bg-primary text-white shadow-lg shadow-primary/25" 
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                    </Link>
                );
            })}
        </nav>

        {/* Footer / User */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 transition-all duration-200"
            >
                <LogOut className="w-5 h-5" />
                Sign Out
            </button>
        </div>
    </aside>
  );
}
