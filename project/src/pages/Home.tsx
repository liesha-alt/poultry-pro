import { ArrowRight, Bird, Egg, Trees, TrendingUp, Store, Wrench, Calculator, LineChart, BookOpen, Shield } from 'lucide-react';

export function Home({ navigate }: { navigate: (r: string) => void }) {
  const features = [
    { route: '/planning', label: 'Business Planning', desc: 'Choose your farm type, plan your budget, and get your licences in order.', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { route: '/prices', label: 'Market Prices', desc: 'Live prices for chicks, feed, vaccines, equipment, and selling rates.', icon: LineChart, color: 'from-amber-500 to-orange-600' },
    { route: '/setup', label: 'Farm Setup', desc: 'Shed construction, equipment, breeds, biosecurity, and a setup cost calculator.', icon: Wrench, color: 'from-teal-500 to-emerald-600' },
    { route: '/calculator', label: 'Profit Calculator', desc: 'Calculate costs, revenue, break-even, and return on investment per batch.', icon: Calculator, color: 'from-rose-500 to-red-600' },
    { route: '/buyers', label: 'Find Buyers', desc: 'Directory of wholesalers, shops, restaurants, and egg traders near you.', icon: Store, color: 'from-violet-500 to-purple-600' },
    { route: '/admin', label: 'Admin Dashboard', desc: 'Add and update prices, manage suppliers and buyers, flag outdated data.', icon: Shield, color: 'from-slate-600 to-slate-800' },
  ];

  const farmTypes = [
    { name: 'Broilers', icon: Bird, desc: 'Meat-producing chickens grown for 35-45 days. Fast turnover, quick profits.', tag: 'Meat' },
    { name: 'Layers', icon: Egg, desc: 'Egg-laying hens producing 300+ eggs/year. Steady long-term income.', tag: 'Eggs' },
    { name: 'Country Chicken', icon: Trees, desc: 'Free-range native breeds. Premium price, lower input costs.', tag: 'Premium' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #f59e0b 0, transparent 40%), radial-gradient(circle at 80% 70%, #ea580c 0, transparent 40%)'
        }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-amber-700 shadow-sm backdrop-blur">
              <Egg size={16} /> Complete Poultry Farm Business Platform
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl lg:text-6xl">
              From Your First Chick to a{' '}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Profitable Farm
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Everything you need to plan, set up, manage, and grow your poultry business —
              market prices, setup guides, cost calculators, and buyer directories, all in one place.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/planning')}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700 hover:shadow-xl"
              >
                Start Your Farm <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/prices')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
              >
                Check Market Prices
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Farm Types */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Which Farm Type Is Right for You?</h2>
          <p className="mt-2 text-slate-600">Three main paths, each with different investment, timeline, and returns.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {farmTypes.map((ft) => (
            <div
              key={ft.name}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <ft.icon size={24} />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{ft.name}</h3>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{ft.tag}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{ft.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Your Complete Farming Toolkit</h2>
            <p className="mt-2 text-slate-600">Tools and guides for every stage of your poultry journey.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <button
                key={f.route}
                onClick={() => navigate(f.route)}
                className="group rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md`}>
                  <f.icon size={24} />
                </div>
                <h3 className="flex items-center gap-1 text-lg font-bold text-slate-900">
                  {f.label}
                  <ArrowRight size={16} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Your Farm Journey in 4 Steps</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { step: '01', title: 'Plan', desc: 'Choose farm type, set budget, register business.', icon: BookOpen },
            { step: '02', title: 'Set Up', desc: 'Build shed, get equipment, buy chicks and feed.', icon: Wrench },
            { step: '03', title: 'Manage & Calculate', desc: 'Track growth, health, and profits in real time.', icon: Calculator },
            { step: '04', title: 'Sell & Grow', desc: 'Find buyers, sell profitably, expand your flock.', icon: TrendingUp },
          ].map((s) => (
            <div key={s.step} className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-4xl font-extrabold text-amber-200">{s.step}</div>
              <s.icon className="mt-2 text-amber-600" size={28} />
              <h3 className="mt-3 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
