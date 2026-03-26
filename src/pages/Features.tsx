import { Package, Bell, FileText, Scan, Smartphone, Shield } from 'lucide-react';

const features = [
  {
    name: 'Inventory Tracking',
    description: 'Real-time tracking of stock levels, locations, and movements across all your stores.',
    icon: Package,
  },
  {
    name: 'Automated Alerts',
    description: 'Get notified immediately via SMS or Email when stock is low or items are expiring.',
    icon: Bell,
  },
  {
    name: 'Reporting & Analytics',
    description: 'Deep insights into your best sellers, slow moving items, and overall inventory value.',
    icon: FileText,
  },
  {
    name: 'Barcode Scanning',
    description: 'Use your smartphone camera to scan items for quick lookups and stock adjustments.',
    icon: Scan,
  },
  {
    name: 'Mobile First',
    description: 'Designed for the device in your pocket. Manage your business from anywhere.',
    icon: Smartphone,
  },
  {
    name: 'Enterprise Security',
    description: 'Role-based access control and encrypted data to keep your business safe.',
    icon: Shield,
  },
];

export function Features() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900">Features & Solutions</h2>
        <p className="mt-4 text-lg text-slate-600">Everything you need to manage your inventory effectively, built into one powerful platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.name} className="flex flex-col items-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="p-4 bg-primary/10 rounded-full text-primary mb-6">
              <feature.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.name}</h3>
            <p className="text-slate-500 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
