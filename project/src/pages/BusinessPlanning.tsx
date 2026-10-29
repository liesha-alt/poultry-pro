import { useState } from 'react';
import { Bird, Egg, Trees, Landmark, Wallet, FileText, MapPin, Ruler, ArrowRight } from 'lucide-react';
import { Card, SectionTitle, Badge } from '@/components/ui';

type Budget = 'small' | 'medium' | 'large';

export function BusinessPlanning({ navigate }: { navigate: (r: string) => void }) {
  const [budget, setBudget] = useState<Budget>('small');

  const farmTypes = [
    {
      name: 'Broiler Farm',
      icon: Bird,
      capital: '₹50,000 – ₹5,00,000',
      cycle: '35-45 days',
      space: '1 sq ft per bird',
      returns: 'Fast, 6-7 batches/year',
      pros: ['Quick turnover', 'Lower initial investment', 'Simple management'],
      cons: ['Price fluctuations', 'Disease risk in dense housing'],
    },
    {
      name: 'Layer Farm',
      icon: Egg,
      capital: '₹1,00,000 – ₹10,00,000',
      cycle: '18-72 weeks',
      space: '1.5-2 sq ft per bird',
      returns: 'Steady egg income for 1+ year',
      pros: ['Consistent daily income', 'Eggs have longer shelf life', 'Higher profit per bird'],
      cons: ['Larger upfront cost', 'Longer payback period', 'Needs more space'],
    },
    {
      name: 'Country Chicken',
      icon: Trees,
      capital: '₹30,000 – ₹3,00,000',
      cycle: '90-120 days',
      space: '3-5 sq ft per bird (free-range)',
      returns: 'Premium price per kg',
      pros: ['Lower feed cost (free-range)', 'Disease-resistant breeds', 'Premium market price'],
      cons: ['Slower growth', 'Smaller batch sizes', 'Needs open land'],
    },
  ];

  const budgetPlans: Record<Budget, { range: string; birds: string; shed: string; advice: string }> = {
    small: {
      range: 'Under ₹1,00,000',
      birds: '200-500 birds',
      shed: 'Simple open-sided shed with basic equipment',
      advice: 'Start with broilers for fastest return. Use a small shed (200-400 sq ft). Focus on one batch, learn the process, then expand.',
    },
    medium: {
      range: '₹1,00,000 – ₹5,00,000',
      birds: '500-2000 birds',
      shed: 'Semi-automated shed with feeders, drinkers, and ventilation',
      advice: 'Consider layers for steady income or 1000+ broilers per batch. Invest in quality equipment and a vaccination schedule.',
    },
    large: {
      range: 'Above ₹5,00,000',
      birds: '2000+ birds',
      shed: 'Fully equipped shed with automated feeding, cooling, and biosecurity',
      advice: 'Run multiple batches in rotation. Consider integration with feed milling or a processing unit for maximum margins.',
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 animate-fade-in">
      <SectionTitle
        title="Business Planning"
        subtitle="Choose your farm type, plan your budget, and understand the requirements before you start."
        icon={<Landmark size={28} />}
      />

      {/* Farm Types Comparison */}
      <section className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-slate-900">1. Choose Your Poultry Type</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {farmTypes.map((ft) => (
            <Card key={ft.name} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white">
                <ft.icon size={28} />
                <h4 className="mt-2 text-lg font-bold">{ft.name}</h4>
              </div>
              <div className="p-5">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-slate-500">Capital</dt><dd className="font-medium text-slate-800">{ft.capital}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Cycle</dt><dd className="font-medium text-slate-800">{ft.cycle}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Space</dt><dd className="font-medium text-slate-800">{ft.space}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Returns</dt><dd className="font-medium text-slate-800">{ft.returns}</dd></div>
                </dl>
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-xs font-semibold text-green-600">Pros</p>
                  <ul className="mt-1 space-y-1 text-xs text-slate-600">
                    {ft.pros.map((p) => <li key={p}>• {p}</li>)}
                  </ul>
                  <p className="mt-2 text-xs font-semibold text-amber-600">Consider</p>
                  <ul className="mt-1 space-y-1 text-xs text-slate-600">
                    {ft.cons.map((c) => <li key={c}>• {c}</li>)}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Land & Infrastructure */}
      <section className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-slate-900">2. Land, Location & Infrastructure</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPin, title: 'Location', text: 'Away from residential areas (500m+), accessible by road, near water and electricity supply.' },
            { icon: Ruler, title: 'Land Size', text: '1 acre supports ~5000 broilers or ~3000 layers with shed, storage, and waste area.' },
            { icon: Bird, title: 'Shed Type', text: 'Open-sided (natural ventilation) or closed (environment-controlled). Orientation east-west.' },
            { icon: Trees, title: 'Biosecurity', text: 'Perimeter fence, foot dip, separate entry, drainage, and waste pit. No waterlogging.' },
          ].map((item) => (
            <Card key={item.title} className="p-5">
              <item.icon className="text-amber-600" size={24} />
              <h4 className="mt-2 font-bold text-slate-900">{item.title}</h4>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Budget Planner */}
      <section className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-slate-900">3. Budget-Based Business Plan</h3>
        <p className="mb-4 text-slate-600">Select your investment level to get a tailored plan.</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {(Object.keys(budgetPlans) as Budget[]).map((b) => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className={`rounded-lg px-5 py-2.5 font-medium transition-colors ${
                budget === b
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="capitalize">{b}</span> — {budgetPlans[b].range}
            </button>
          ))}
        </div>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Wallet className="text-amber-600" size={24} />
            <h4 className="text-lg font-bold text-slate-900">Plan for {budget} investment ({budgetPlans[budget].range})</h4>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Flock Size</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{budgetPlans[budget].birds}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Infrastructure</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{budgetPlans[budget].shed}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Strategy</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{budgetPlans[budget].advice}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Legal */}
      <section className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-slate-900">4. Registration & Licences</h3>
        <Card className="divide-y divide-slate-100">
          {[
            { title: 'Business Registration', detail: 'Register as Sole Proprietor, Partnership, or Pvt Ltd. Get a GST number if turnover exceeds the threshold.' },
            { title: 'Poultry Farm Licence', detail: 'Apply to the local municipal corporation or panchayat. Includes site inspection and shed approval.' },
            { title: 'Pollution Control', detail: 'Obtain No Objection Certificate (NOC) from State Pollution Control Board for waste management.' },
            { title: 'Animal Husbandry Registration', detail: 'Register with the State Animal Husbandry Department for subsidies and veterinary support.' },
            { title: 'Insurance', detail: 'Insure your flock against disease and natural calamity. Available through livestock insurance schemes.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="mt-0.5 text-sm text-slate-600">{item.detail}</p>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* CTA */}
      <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-center text-white">
        <h3 className="text-2xl font-bold">Ready to check what it will cost?</h3>
        <p className="mt-2 text-amber-50">Use the Market Prices and Profit Calculator to build your budget.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate('/prices')} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-amber-700 transition hover:bg-amber-50">
            View Market Prices <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/calculator')} className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10">
            Profit Calculator <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
