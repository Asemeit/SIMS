import { Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function Pricing() {
  const { currency, subscriptionPlan, setSubscriptionPlan } = useSettings();

  const getPrice = (basePrice: number) => {
    // Simple mock conversion for demo purposes
    if (currency.code === 'KES') return `${currency.symbol} ${(basePrice * 100).toLocaleString()}`;
    if (currency.code === 'EUR') return `${currency.symbol} ${(basePrice * 0.92).toFixed(2)}`;
    if (currency.code === 'GBP') return `${currency.symbol} ${(basePrice * 0.79).toFixed(2)}`;
    return `${currency.symbol} ${basePrice.toFixed(2)}`;
  };

  const plans = [
    {
      name: 'Starter',
      price: getPrice(29),
      description: 'Perfect for small businesses just getting started.',
      features: ['Up to 1,000 items', 'Basic Reporting', '1 User Account', 'Email Support'],
      popular: false
    },
    {
      name: 'Professional',
      price: getPrice(79),
      description: 'Ideal for growing businesses with multiple locations.',
      features: ['Unlimited items', 'Advanced Analytics', '5 User Accounts', 'Priority Support', 'Barcode Scanning'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with complex needs.',
      features: ['Unlimited everything', 'Custom API Access', 'Dedicated Account Manager', 'SLA Support', 'On-premise deployment'],
      popular: false
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 dark:text-white">Simple, Transparent Pricing</h2>
        <p className="text-slate-500 dark:text-slate-400">Choose the plan that best fits your business needs. No hidden fees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isSelected = subscriptionPlan === plan.name;
          const isPopular = plan.popular;
          
          return (
            <div 
              key={plan.name} 
              // Cast to SubscriptionPlan for type safety since we know plan.name matches
              onClick={() => setSubscriptionPlan(plan.name as any)}
              className={`relative flex flex-col p-8 bg-white dark:bg-slate-800 rounded-2xl border cursor-pointer transition-all duration-200 
                ${isSelected 
                  ? 'border-primary ring-2 ring-primary ring-opacity-50 shadow-lg scale-105 z-10' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md'
                } shadow-sm`}
            >
              {isPopular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-sm">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-slate-500 dark:text-slate-400">/month</span>}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Check className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 px-4 rounded-xl font-bold transition-colors 
                  ${isSelected 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                {isSelected ? 'Selected Plan' : 'Choose ' + plan.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
