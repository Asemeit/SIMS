import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/layout/ThemeProvider.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { registerSW } from 'virtual:pwa-register';

// Automatically update the Service Worker when a new version is available
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <ThemeProvider defaultTheme="system" storageKey="sims-ui-theme">
        <App />
      </ThemeProvider>
    </SettingsProvider>
  </StrictMode>,
)
