import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, X, CheckCheck, Menu, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface TopNavProps {
    onMenuClick: () => void;
}

interface Notification {
    id: string | number;
    title: string;
    message: string;
    time: string;
    unread: boolean;
    type?: 'low' | 'expiry' | 'info';
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    fetchRealNotifications();
  }, []);

  const fetchRealNotifications = async () => {
    try {
        const { data: inventory } = await supabase.from('inventory').select('*');
        
        if (inventory) {
            const newNotifications: Notification[] = [];
            
            // 1. Low Stock Alerts
            const lowStockItems = inventory.filter(item => item.quantity <= (item.min_stock_level || 10));
            lowStockItems.slice(0, 2).forEach((item, index) => {
                newNotifications.push({
                    id: `low-${item.id}`,
                    title: 'Low Stock Alert',
                    message: `${item.name} is running low (${item.quantity} units left)`,
                    time: 'Just now',
                    unread: true,
                    type: 'low'
                });
            });

            // 2. Expiry Alerts
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            const expiringSoon = inventory.filter(item => {
                if (!item.expiry_date) return false;
                const expiry = new Date(item.expiry_date);
                return expiry > new Date() && expiry <= thirtyDaysFromNow;
            });
            
            expiringSoon.slice(0, 2).forEach((item, index) => {
                newNotifications.push({
                    id: `exp-${item.id}`,
                    title: 'Expiry Warning',
                    message: `${item.name} expires on ${new Date(item.expiry_date!).toLocaleDateString()}`,
                    time: 'Action required',
                    unread: true,
                    type: 'expiry'
                });
            });

            // 3. Static Info Filler
            newNotifications.push({
                id: 'system-1',
                title: 'System Initialized',
                message: 'SIMS is now connected to Cloud Storage & Real-time Auth.',
                time: 'Online',
                unread: false,
                type: 'info'
            });

            setNotifications(newNotifications);
        }
    } catch (err) {
        console.error('Error fetching notifications:', err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 relative z-30 transition-colors duration-300">
        <div className="flex items-center flex-1 gap-4">
            <button 
                onClick={onMenuClick}
                className="md:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-md hidden sm:block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="w-5 h-5 text-slate-400" />
                </span>
                <input
                    type="text"
                    placeholder="Search inventory..."
                    className="w-full py-2 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
            </div>
        </div>

        <div className="flex items-center space-x-4">
            {/* Notifications Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
                    )}
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        <div className="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-700/50">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Live Alerts</h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                                >
                                    <CheckCheck className="w-3 h-3" /> Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm italic">
                                    No active alerts
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div 
                                        key={notification.id} 
                                        className={`p-4 border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group relative ${
                                            notification.unread ? 'bg-slate-50/30 dark:bg-slate-700/30' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0">
                                                {notification.type === 'low' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                                                {notification.type === 'expiry' && <Calendar className="w-4 h-4 text-orange-500" />}
                                                {(notification.type === 'info' || !notification.type) && <Bell className="w-4 h-4 text-blue-500" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{notification.title}</h4>
                                                    {notification.unread && (
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 break-words leading-relaxed">{notification.message}</p>
                                                <span className="text-[10px] text-slate-400 mt-2 block font-medium">{notification.time}</span>
                                            </div>
                                            <button 
                                                onClick={(e) => removeNotification(notification.id, e)}
                                                className="text-slate-300 dark:text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all font-bold p-1"
                                                title="Dismiss"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-[120px]">
                        {profile?.name || 'Administrator'}
                    </p>
                </div>
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium border border-primary/20">
                    <User className="w-5 h-5" />
                </div>
            </div>
        </div>
    </header>
  );
}
