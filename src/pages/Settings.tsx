import React, { useState, useEffect } from 'react';
import { Globe, Moon, MapPin, Save, User as UserIcon, Mail, Shield } from 'lucide-react';
import { useSettings, type CurrencyCode, type RegionCode } from '../context/SettingsContext';
import { useTheme } from '../components/layout/ThemeProvider';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency, region, setRegion } = useSettings();
  const { profile, updateProfile, isLoading } = useAuth();
  const [language, setLanguage] = useState('English (US)');
  
  // Local state for deferred saving
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>(region);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(currency.code);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync local state if global state changes externally
  useEffect(() => {
    setSelectedRegion(region);
    setSelectedCurrency(currency.code);
    if (profile) {
        setProfileData({
            name: profile.name,
            email: profile.email,
            role: profile.role
        });
    }
  }, [region, currency.code, profile]);

  if (isLoading) {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
    );
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setHasChanges(true);
    setShowSuccess(false);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value as RegionCode);
    setHasChanges(true);
    setShowSuccess(false);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value as CurrencyCode);
    setHasChanges(true);
    setShowSuccess(false);
  };

  const handleSave = async () => {
    try {
        setRegion(selectedRegion);
        setCurrency(selectedCurrency);
        const { error } = await updateProfile(profileData);
        
        if (error) throw error;

        setHasChanges(false);
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
    } catch (err: any) {
        console.error('Save error:', err);
        alert('Failed to save settings: ' + (err.message || 'Unknown error'));
        // Re-sync with profile on error to reset UI
        if (profile) {
            setProfileData({
                name: profile.name,
                email: profile.email,
                role: profile.role
            });
        }
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'English (US)' ? 'Spanish (ES)' : 'English (US)';
    setLanguage(newLang);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account settings and preferences.</p>
        </div>
        <div className="flex items-center gap-3">
            {showSuccess && (
                <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-right-4">
                    <span className="mr-2">Settings saved successfully!</span>
                </div>
            )}
            {hasChanges && (
                <button 
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 animate-in fade-in slide-in-from-right-4 shadow-lg shadow-primary/20"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </button>
            )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Profile</h3>
              </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                  </div>
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        name="email"
                        disabled
                        value={profileData.email}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-400 dark:text-slate-500 outline-none cursor-not-allowed"
                      />
                  </div>
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role / Position</label>
                  <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        name="role"
                        value={profileData.role}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                  </div>
              </div>
          </div>
      </div>

      {/* Localization & System */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                  <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Localization & System</h3>
              </div>
          </div>
          <div className="p-6 space-y-4">
              
              {/* Region Selector */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Region</span>
                  </div>
                  <select 
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    className="bg-transparent text-sm text-slate-600 dark:text-slate-300 font-medium outline-none text-right cursor-pointer"
                  >
                    <option value="Global">Global</option>
                    <option value="North America">North America</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Europe">Europe</option>
                  </select>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                      <span className="text-slate-500 dark:text-slate-400 font-bold text-sm w-4 text-center">
                          {selectedCurrency === 'USD' && '$'}
                          {selectedCurrency === 'KES' && 'KSh'}
                          {selectedCurrency === 'EUR' && '€'}
                          {selectedCurrency === 'GBP' && '£'}
                      </span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Currency</span>
                  </div>
                  <select 
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    className="bg-transparent text-sm text-slate-600 dark:text-slate-300 font-medium outline-none text-right cursor-pointer"
                  >
                      <option value="USD">USD ($)</option>
                      <option value="KES">KES (KSh)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                  </select>
              </div>

              <div className="w-full h-px bg-slate-100 dark:bg-slate-700 my-2"></div>

              <button 
                onClick={toggleLanguage}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
               >
                  <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Language</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{language}</span>
              </button>
              
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                  <div className="flex items-center gap-3">
                      <Moon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Dark Mode</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{theme === 'system' ? 'System' : theme}</span>
              </button>
          </div>
      </div>
    </div>
  );
}
