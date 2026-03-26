import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
          <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 z-50 animate-in slide-in-from-left duration-200">
                  <Sidebar 
                    onClose={() => setIsMobileMenuOpen(false)} 
                    className="h-full shadow-2xl"
                  />
              </div>
          </div>
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
