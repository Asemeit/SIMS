import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Filter, MoreVertical, AlertCircle, Trash2, Scan } from 'lucide-react';
import { cn } from '../lib/utils';
import { AddItemModal } from '../components/inventory/AddItemModal';
import { BarcodeScanner } from '../components/common/BarcodeScanner';
import type { InventoryItem } from '../types';

import { supabase } from '../lib/supabase';

import { useSettings } from '../context/SettingsContext';

export function Inventory() {
  const [searchParams] = useSearchParams();
  const { currency } = useSettings();

  const initialFilter = searchParams.get('filter');
  const [searchTerm, setSearchTerm] = useState(
    initialFilter === 'low' ? 'low stock' :
      initialFilter === 'expiry' ? 'expiring soon' : ''
  );
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setItems(data as InventoryItem[]);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      alert('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = (newItem: InventoryItem) => {
    setItems([newItem, ...items]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    setSearchTerm(decodedText);
    setIsScanning(false);
  };

  const filteredItems = items.filter(item => {
    const search = searchTerm.toLowerCase();

    // Special filter handling for dashboard shortcuts
    if (search === 'low stock') {
      return item.quantity <= (item.min_stock_level || 10);
    }

    if (search === 'expiring soon') {
      if (!item.expiry_date) return false;
      const expiry = new Date(item.expiry_date);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      return expiry >= today && expiry <= thirtyDaysFromNow;
    }

    return item.name.toLowerCase().includes(search) ||
      item.sku.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track, organize, and manage your stock.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, or scan barcode..."
            className="w-full pl-10 pr-12 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setIsScanning(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary transition-colors bg-slate-100 dark:bg-slate-700 rounded-md"
            title="Scan to Search"
          >
            <Scan className="w-5 h-5" />
          </button>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Stock Level</th>
                <th className="px-6 py-4 font-medium">Expiry Date</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No items found matching your search.
                  </td>
                </tr>
              ) : filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.sku}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 dark:text-slate-200 font-medium">{item.quantity}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs">/ {item.min_stock_level} min</span>
                    </div>
                    {item.quantity <= item.min_stock_level && (
                      <div className="flex items-center text-xs text-amber-600 dark:text-amber-400 mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" /> Low Stock
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.expiry_date ? (
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {new Date(item.expiry_date).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400 dark:text-slate-500 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{currency.symbol} {item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      item.status === 'In Stock' && "bg-emerald-100 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-400",
                      item.status === 'Low Stock' && "bg-amber-100 dark:bg-amber-400/10 text-amber-800 dark:text-amber-400",
                      item.status === 'Out of Stock' && "bg-red-100 dark:bg-red-400/10 text-red-800 dark:text-red-400",
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Delete Item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
      />

      {isScanning && (
        <BarcodeScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setIsScanning(false)}
        />
      )}
    </div>
  );
}
