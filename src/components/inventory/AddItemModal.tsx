import React, { useState } from 'react';
import { X, Scan } from 'lucide-react';
import type { InventoryItem } from '../../types';
import { BarcodeScanner } from '../common/BarcodeScanner';
import { supabase } from '../../lib/supabase';
import { useSettings } from '../../context/SettingsContext';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: InventoryItem) => void;
}

export function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const { currency } = useSettings();
  const [isScanning, setIsScanning] = useState(false);
  // Use strings for numeric inputs to allow empty state during typing
  const [formData, setFormData] = useState({
    status: 'In Stock',
    category: 'General',
    name: '',
    sku: '',
    quantity: '',
    min_stock_level: '10',
    price: '',
    expiry_date: ''
  });

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        status: 'In Stock',
        category: 'General',
        name: '',
        sku: '',
        quantity: '',
        min_stock_level: '10',
        price: '',
        expiry_date: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScanSuccess = (decodedText: string) => {
      setFormData(prev => ({ ...prev, sku: decodedText }));
      setIsScanning(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Improved validation
    if (!formData.name?.trim() || !formData.sku?.trim()) {
      alert('Please fill in Name and SKU');
      return;
    }
    
    const quantity = parseInt(formData.quantity);
    const price = parseFloat(formData.price);
    const min_stock_level = parseInt(formData.min_stock_level);

    if (isNaN(quantity)) {
        alert('Please enter a valid Quantity');
        return;
    }
    
    if (isNaN(price)) {
         alert('Please enter a valid Price');
         return;
    }

    // Prepare item for DB
    const newItemForDb = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      status: 'In Stock' as const,
      quantity: quantity,
      price: price,
      min_stock_level: isNaN(min_stock_level) ? 10 : min_stock_level,
      expiry_date: formData.expiry_date || null,
    };
    
    // Status update logic based on quantity
    if (newItemForDb.quantity === 0) newItemForDb.status = 'Out of Stock';
    else if (newItemForDb.quantity <= newItemForDb.min_stock_level) newItemForDb.status = 'Low Stock';
    else newItemForDb.status = 'In Stock';

    try {
        const { data, error } = await supabase
            .from('inventory')
            .insert([newItemForDb])
            .select()
            .single();

        if (error) throw error;

        if (data) {
            onAdd(data as InventoryItem);
            onClose();
        }
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to save item to database.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Add New Inventory Item</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Item Name *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="e.g. Paracetamol"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SKU / Code *</label>
              <div className="flex gap-2">
                <input 
                    type="text" 
                    required
                    value={formData.sku}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="e.g. MED-001"
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                />
                <button 
                    type="button"
                    onClick={() => setIsScanning(true)}
                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 flex items-center justify-center min-w-[42px]"
                    title="Scan Barcode"
                >
                    <Scan className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select 
                value={formData.category}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="General">General</option>
                <option value="Medicine">Medicine</option>
                <option value="Supplies">Supplies</option>
                <option value="Food">Food</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expiry Date</label>
              <input 
                type="date" 
                value={formData.expiry_date}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                onChange={e => setFormData({...formData, expiry_date: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity *</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.quantity}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                onChange={e => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Min Level</label>
              <input 
                type="number" 
                min="0"
                value={formData.min_stock_level}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                onChange={e => setFormData({...formData, min_stock_level: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price ({currency.symbol}) *</label>
              <input 
                type="number" 
                required
                min="0"
                step="0.01"
                value={formData.price}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 transition-all"
            >
              Save Item
            </button>
          </div>

        </form>
      </div>
      
      {isScanning && (
        <BarcodeScanner 
            onScanSuccess={handleScanSuccess} 
            onClose={() => setIsScanning(false)} 
        />
      )}
    </div>
  );
}
