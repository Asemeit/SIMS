import { useState } from 'react';
import { HelpCircle, Info, MessageSquare, Mail, Phone, ExternalLink, ChevronRight } from 'lucide-react';

export function Support() {
  const [activeTab, setActiveTab] = useState<'about' | 'faq' | 'contact'>('about');

  const faqs = [
    { q: "How do I add a new location?", a: "Go to the Locations page and click 'Add Facility'. You can enter the name, address, and coordinates for the new warehouse or store." },
    { q: "Is there a mobile app?", a: "SIMS is a Progressive Web App (PWA). You can install it on your mobile device by selecting 'Add to Home Screen' in your mobile browser." },
    { q: "How do I update my profile?", a: "Navigate to Settings and use the 'User Profile' section to update your name, email and role. Changes persist across sessions." },
    { q: "Can I delete inventory items?", a: "Yes, on the Inventory page, each item has a delete icon. You will be asked to confirm before the item is permanently removed from Supabase." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Support</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need to know about SIMS.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('about')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'about' 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'faq' 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          FAQ
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'contact' 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Contact Support
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden min-h-[400px]">
        {activeTab === 'about' && (
          <div className="p-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Info className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">About SIMS</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Smart Inventory Management System v1.0.4</p>
              </div>
            </div>
            
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                SIMS is a state-of-the-art inventory tracking and management solution designed to provide real-time visibility into supply chain operations. 
                Built for resilience and scalability, the system empowers businesses to manage stock levels, track facilities, and analyze trends with precision.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white mt-6 mb-2">Key Core Values</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-6">
                {['Real-time Data Persistence', 'User-Centric Dark Mode', 'Interactive Mapping', 'Scalable Architecture'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-700">
                <span className="text-sm font-medium">Technical Documentation</span>
                <ExternalLink className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="p-8 animate-in fade-in duration-300">
             <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <HelpCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-5 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-bold">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="p-8 animate-in fade-in duration-300">
             <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact & Support</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-slate-600 dark:text-slate-400">
                  Need direct assistance? Our technical support team is available mon-fri 9am - 5pm.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email Us</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">support@sims.co.ke</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Call Helpdesk</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">+254 700 000 000</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Internal Support Ticket</h4>
                <div className="space-y-3">
                  <input placeholder="Subject" className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-primary" />
                  <textarea placeholder="How can we help?" rows={3} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:border-primary resize-none" />
                  <button className="w-full py-2 bg-primary text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">Submit Ticket</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
