import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Navigation, Trash2, Edit3, Plus } from 'lucide-react';
import { MapComponent } from '../components/locations/MapComponent';
import { LocationModal } from '../components/locations/LocationModal';
import { supabase } from '../lib/supabase';

export function Locations() {
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location.');
    }
  };

  const handleEdit = (location: any) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedLocation(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Locations Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage warehouses, distribution centers, and stores.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Facility
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Locations List */}
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400">Loading your network...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No Locations Found</h3>
              <p className="text-slate-500 dark:text-slate-400">Start by adding your first facility.</p>
            </div>
          ) : (
            locations.map((location) => (
              <div key={location.id} className="group p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {location.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        {location.type}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      location.status === 'Active' 
                        ? 'bg-emerald-100 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-400' 
                        : 'bg-amber-100 dark:bg-amber-400/10 text-amber-800 dark:text-amber-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${location.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {location.status}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-start gap-3">
                    <Navigation className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{location.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{location.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-bold">{location.email || 'No email'}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-700/50 flex gap-2">
                  <button 
                    onClick={() => handleEdit(location)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteLocation(location.id)}
                    className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs font-bold rounded-xl transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Map */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[500px] overflow-hidden sticky top-6 shadow-inner ring-4 ring-slate-50 dark:ring-slate-800/50">
            <div className="absolute inset-0 z-0">
                {!isLoading && <MapComponent locations={locations} />}
            </div>
        </div>
      </div>

      <LocationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLocations}
        location={selectedLocation}
      />
    </div>
  );
}
