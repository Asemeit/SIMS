import { useState, useEffect } from 'react';
import { X, MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  location?: any; // If provided, we are editing
}

export function LocationModal({ isOpen, onClose, onSuccess, location }: LocationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    type: 'Warehouse',
    status: 'Active',
    latitude: 0,
    longitude: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        address: location.address || '',
        phone: location.phone || '',
        email: location.email || '',
        type: location.type || 'Warehouse',
        status: location.status || 'Active',
        latitude: location.latitude || 0,
        longitude: location.longitude || 0
      });
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        type: 'Warehouse',
        status: 'Active',
        latitude: 0,
        longitude: 0
      });
    }
  }, [location, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (location) {
        // Update
        const { error } = await supabase
          .from('locations')
          .update(formData)
          .eq('id', location.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('locations')
          .insert([formData]);
        if (error) throw error;
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Failed to save location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {location ? 'Edit Location' : 'Add New Location'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {location ? 'Update existing facility details' : 'Register a new warehouse or store'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Facility Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="e.g. Nairobi Central Warehouse"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" font-bold>Street Address</label>
              <div className="relative">
                <Navigation className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  required
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="Street name, City, Country"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="+254..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="email@sims.co"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="Warehouse">Warehouse</option>
                  <option value="Retail Store">Retail Store</option>
                  <option value="Distribution Center">Distribution Center</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : (location ? 'Update Location' : 'Create Location')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
