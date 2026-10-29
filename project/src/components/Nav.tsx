import { useState } from 'react';
import { Egg, Menu, X, Home, BookOpen, LineChart, Wrench, Calculator, Store, Shield } from 'lucide-react';

const navItems = [
  { route: '/', label: 'Home', icon: Home },
  { route: '/planning', label: 'Business Planning', icon: BookOpen },
  { route: '/prices', label: 'Market Prices', icon: LineChart },
  { route: '/setup', label: 'Farm Setup', icon: Wrench },
  { route: '/calculator', label: 'Profit Calculator', icon: Calculator },
  { route: '/buyers', label: 'Find Buyers', icon: Store },
  { route: '/admin', label: 'Admin', icon: Shield },
];

export function Navbar({ route, navigate }: { route: string; navigate: (r: string) => void }) {
  const [open, setOpen] = useState(false);

  const go = (r: string) => {
    navigate(r);
    setOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => go('/')} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
              <Egg size={20} />
            </div>
            <span className="text-lg font-bold text-slate-900">PoultryPro</span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = route === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => go(item.route)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 top-[57px] z-30 bg-white lg:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const active = route === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => go(item.route)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    active
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

export function Footer({ navigate }: { navigate: (r: string) => void }) {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                <Egg size={18} />
              </div>
              <span className="text-lg font-bold text-white">PoultryPro</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Your complete guide to starting, running, and growing a profitable poultry farm — from planning to selling.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white">Guides</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><button onClick={() => navigate('/planning')} className="hover:text-amber-400">Business Planning</button></li>
              <li><button onClick={() => navigate('/setup')} className="hover:text-amber-400">Farm Setup</button></li>
              <li><button onClick={() => navigate('/calculator')} className="hover:text-amber-400">Profit Calculator</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">Market</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><button onClick={() => navigate('/prices')} className="hover:text-amber-400">Market Prices</button></li>
              <li><button onClick={() => navigate('/buyers')} className="hover:text-amber-400">Find Buyers</button></li>
              <li><button onClick={() => navigate('/admin')} className="hover:text-amber-400">Admin Dashboard</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">Stay Updated</h4>
            <p className="mt-3 text-sm text-slate-400">Prices updated regularly from verified suppliers and market surveys.</p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          © 2026 PoultryPro. Built for poultry farmers.
        </div>
      </div>
    </footer>
  );
}
