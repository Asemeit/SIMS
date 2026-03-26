import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Package, TrendingUp, AlertTriangle, Users, History, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import type { InventoryItem } from '../types';
import { useTheme } from '../components/layout/ThemeProvider';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ title, value, subtext, icon: Icon, color }: StatCardProps) => (
  <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-lg", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="mt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtext}</p>
    </div>
  </div>
);

export function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalInventory: 0,
    lowStock: 0,
    totalValue: 0,
    totalUsers: 0,
    expiringSoon: 0,
  });
  const [recentItems, setRecentItems] = useState<InventoryItem[]>([]);
  const [trendData, setTrendData] = useState<{name: string, count: number}[]>([]);
  const [valueData, setValueData] = useState<{name: string, value: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: inventory, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (inventory) {
        // Calculate stats
        const total = inventory.reduce((acc, item) => acc + (item.quantity || 0), 0);
        const low = inventory.filter(item => item.quantity <= (item.min_stock_level || 10)).length;
        const valueTotal = inventory.reduce((acc, item) => acc + ((item.quantity || 0) * (item.price || 0)), 0);
        
        // Calculate expiring soon (next 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const expiring = inventory.filter(item => {
            if (!item.expiry_date) return false;
            const expiry = new Date(item.expiry_date);
            return expiry > new Date() && expiry <= thirtyDaysFromNow;
        }).length;

        // Fetch total user count from profiles
        const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        // Calculate Inventory Value by Category
        const categoryValue: Record<string, number> = {};
        inventory.forEach((item: InventoryItem) => {
          const cat = item.category || 'Uncategorized';
          const val = (item.quantity || 0) * (item.price || 0);
          categoryValue[cat] = (categoryValue[cat] || 0) + val;
        });

        const formattedValueData = Object.entries(categoryValue).map(([name, value]) => ({
          name,
          value
        })).sort((a, b) => b.value - a.value).slice(0, 6);

        // Calculate trend (Items added per month)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const countsByMonth: Record<string, number> = {};
        
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          countsByMonth[monthNames[d.getMonth()]] = 0;
        }

        inventory.forEach((item: InventoryItem) => {
          if (item.created_at) {
            const date = new Date(item.created_at);
            const month = monthNames[date.getMonth()];
            if (countsByMonth[month] !== undefined) {
              countsByMonth[month]++;
            }
          }
        });

        const formattedTrend = Object.entries(countsByMonth).map(([name, count]) => ({
          name,
          count
        }));

        setTrendData(formattedTrend);
        setValueData(formattedValueData);
        setStats({
          totalInventory: total,
          lowStock: low,
          totalValue: valueTotal,
          totalUsers: userCount || 0,
          expiringSoon: expiring
        });
        
        setRecentItems(inventory.slice(0, 5) as InventoryItem[]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">Business Intelligence Dashboard</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Financial overview and real-time inventory performance.</p>
        </div>
        <div className="flex space-x-2">
            <button 
                onClick={() => navigate('/inventory')}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
                Add Item
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Units" 
            value={stats.totalInventory} 
            subtext="Items in stock" 
            icon={Package} 
            color="bg-blue-500" 
        />
        <StatCard 
            title="Total Stock Value" 
            value={`$${stats.totalValue.toLocaleString()}`} 
            subtext="Asset valuation" 
            icon={DollarSign} 
            color="bg-emerald-500" 
        />
        <StatCard 
            title="Low Stock Alerts" 
            value={stats.lowStock} 
            subtext="Items needing reorder" 
            icon={AlertTriangle} 
            color="bg-amber-500" 
        />
        <StatCard 
            title="System Users" 
            value={stats.totalUsers} 
            subtext="Active in portal" 
            icon={Users} 
            color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inventory Trend</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-500">
                <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            {isLoading ? (
               <div className="h-full w-full flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
               </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis 
                        stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                            borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                            borderRadius: '12px',
                            color: theme === 'dark' ? '#ffffff' : '#000000'
                        }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Stock Value by Category</h3>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-500">
                <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="h-[300px] w-full">
            {isLoading ? (
               <div className="h-full w-full flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
               </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={valueData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {valueData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: any) => [`$${(Number(value) || 0).toLocaleString()}`, 'Value']}
                        contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                            borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                            borderRadius: '12px',
                            color: theme === 'dark' ? '#ffffff' : '#000000'
                        }}
                    />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <History className="w-5 h-5 text-slate-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="pb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Item</th>
                  <th className="pb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Category</th>
                  <th className="pb-3 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Quantity</th>
                  <th className="pb-3 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {recentItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 font-medium text-slate-900 dark:text-white">{item.name}</td>
                    <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                       <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">{item.category}</span>
                    </td>
                    <td className="py-4 text-sm text-slate-900 dark:text-white text-right font-bold">{item.quantity} units</td>
                    <td className="py-4 text-sm text-slate-500 dark:text-slate-400 text-right">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl shadow-amber-500/20 text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Stock Expiry Watch</h3>
            <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium">
              You have <span className="font-bold underlineDecoration decoration-white/30">{stats.expiringSoon} items</span> reaching their expiry date within the next 30 days. Action required to prevent waste.
            </p>
            <button 
                onClick={() => navigate('/inventory?filter=expiry')}
                className="w-full py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg shadow-black/10 active:scale-95"
            >
              Check Expiration Dates
            </button>
          </div>
          <AlertTriangle className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
        </div>
      </div>
    </div>
  );
}
