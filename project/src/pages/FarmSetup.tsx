import { useMemo } from 'react';
import { Wrench, Bird, Droplets, Wind, Shield, Calculator, Trash2, Radio } from 'lucide-react';
import { Card, SectionTitle } from '@/components/ui';
import { formatPrice } from '@/lib/format';

export function FarmSetup({ navigate }: { navigate: (r: string) => void }) {
  const setupGuides = [
    {
      icon: Bird,
      title: 'Shed Construction',
      items: [
        'Orientation: East-West to reduce direct sunlight',
        'Floor: Concrete or brick, sloped for drainage',
        'Walls: 3-4 ft brick, wire mesh above for ventilation',
        'Roof: Asbestos or insulated sheet, 8-10 ft height',
        'Doors: Wide enough for wheelbarrow entry, south side',
      ],
    },
    {
      icon: Droplets,
      title: 'Water Systems',
      items: [
        'Clean water source — borewell or municipal',
        'Overhead tank (500-1000 L) for storage',
        'Nipple or bell drinkers: 1 per 10-15 birds',
        'Daily cleaning of drinkers and tanks',
        'Water testing every 3 months for pH and minerals',
      ],
    },
    {
      icon: Wind,
      title: 'Ventilation & Heating',
      items: [
        'Brooder heating: gas or electric brooders for chicks',
        'Temperature: 35°C week 1, reduce 3°C weekly to 22°C',
        'Exhaust fans for cross-ventilation in closed sheds',
        'Curtains on sides for climate control',
        'Monitor ammonia levels — keep below 20 ppm',
      ],
    },
    {
      icon: Shield,
      title: 'Biosecurity & Waste',
      items: [
        'Foot dip with disinfectant at every entrance',
        'Separate clean and dirty zones',
        'Dead bird disposal pit or composting unit',
        'Litter management: dry sawdust/rice husk, 3-4 inch depth',
        'Rodent and wild bird control measures',
      ],
    },
  ];

  const equipmentList = [
    { item: 'Feeder (linear)', per: '1 per 30 birds', est: 250 },
    { item: 'Drinker (bell/nipple)', per: '1 per 15 birds', est: 180 },
    { item: 'Gas brooder', per: '1 per 250 chicks', est: 1200 },
    { item: 'Thermometer', per: '1-2 per shed', est: 300 },
    { item: 'Litter (sawdust, 50 kg)', per: 'As needed', est: 200 },
    { item: 'Lighting (bulb/tube)', per: '1 per 200 sq ft', est: 150 },
    { item: 'Water tank (1000 L)', per: '1 per shed', est: 5000 },
    { item: 'Feed storage bins', per: '2-4 per shed', est: 800 },
  ];

  const breeds = [
    { name: 'Cobb 400', type: 'Broiler', growth: '2.0 kg in 35 days', fcr: '1.6', note: 'Most popular broiler in India' },
    { name: 'Ross 308', type: 'Broiler', growth: '2.2 kg in 38 days', fcr: '1.55', note: 'Excellent feed conversion' },
    { name: 'BV-300', type: 'Layer', growth: '300+ eggs/year', fcr: '2.2', note: 'Top layer breed for Indian climate' },
    { name: 'Kadaknath', type: 'Country', growth: '1.5 kg in 120 days', fcr: '2.8', note: 'Premium black meat, high price' },
    { name: 'Aseel', type: 'Country', growth: '2.5 kg in 120 days', fcr: '2.5', note: 'Fighting breed, niche market' },
    { name: 'Vanaraja', type: 'Country', growth: '2.0 kg in 90 days', fcr: '2.4', note: 'Dual-purpose, free-range friendly' },
  ];

  const setupCost = useMemo(() => setupCostCalc(), []);

  function setupCostCalc() {
    return equipmentList.map((e) => ({ ...e, qty: 1, total: e.est }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 animate-fade-in">
      <SectionTitle
        title="Farm Setup Guide"
        subtitle="Everything you need to build your shed, choose equipment, select breeds, and set up biosecurity."
        icon={<Wrench size={28} />}
      />

      {/* Setup Guides */}
      <section className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-slate-900">Setup Requirements</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {setupGuides.map((g) => (
            <Card key={g.title} className="p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <g.icon size={20} />
                </div>
                <h4 className="text-lg font-bold text-slate-900">{g.title}</h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {g.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-amber-500">▸</span> {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Breed Selection */}
      <section className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-slate-900">Choose the Right Breed</h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Breed</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Growth/Output</th>
                  <th className="px-4 py-3 font-semibold">Feed Conversion Ratio</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {breeds.map((b) => (
                  <tr key={b.name} className="hover:bg-amber-50/40">
                    <td className="px-4 py-3 font-medium text-slate-900">{b.name}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{b.type}</span></td>
                    <td className="px-4 py-3 text-slate-600">{b.growth}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{b.fcr}</td>
                    <td className="px-4 py-3 text-slate-600">{b.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Equipment & Setup Cost Calculator */}
      <section className="mb-12">
        <h3 className="mb-4 text-xl font-bold text-slate-900">
          <span className="inline-flex items-center gap-2"><Calculator size={22} /> Equipment & Setup Cost Estimate</span>
        </h3>
        <EquipmentCalculator />
      </section>

      {/* Supplier CTA */}
      <div className="rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 p-8 text-center text-white">
        <Radio className="mx-auto mb-3" size={28} />
        <h3 className="text-2xl font-bold">Need Suppliers?</h3>
        <p className="mt-2 text-teal-50">Browse our verified directory of chick, feed, equipment, and veterinary suppliers.</p>
        <button onClick={() => navigate('/prices')} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-teal-700 transition hover:bg-teal-50">
          View Suppliers & Prices
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';

function EquipmentCalculator() {
  const [birdCount, setBirdCount] = useState(500);
  const [shedSize, setShedSize] = useState(400);

  const items = [
    { item: 'Feeders', per: 30, unitPrice: 250 },
    { item: 'Drinkers', per: 15, unitPrice: 180 },
    { item: 'Gas brooders', per: 250, unitPrice: 1200 },
    { item: 'Thermometers', per: 100, unitPrice: 300 },
    { item: 'Light bulbs', per: 200, unitPrice: 150 },
  ];

  const calcItems = items.map((it) => {
    const qty = Math.ceil(birdCount / it.per);
    return { ...it, qty, total: qty * it.unitPrice };
  });

  const shedCost = shedSize * 400;
  const equipmentTotal = calcItems.reduce((s, i) => s + i.total, 0);
  const waterTank = 5000;
  const grandTotal = shedCost + equipmentTotal + waterTank;

  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <label className="block text-sm font-medium text-slate-700">Number of Birds</label>
          <input
            type="number"
            value={birdCount}
            min={50}
            onChange={(e) => setBirdCount(Math.max(0, Number(e.target.value)))}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg font-bold focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <p className="mt-1 text-xs text-slate-500">Enter your planned flock size</p>
        </Card>
        <Card className="p-5">
          <label className="block text-sm font-medium text-slate-700">Shed Size (sq ft)</label>
          <input
            type="number"
            value={shedSize}
            min={100}
            onChange={(e) => setShedSize(Math.max(0, Number(e.target.value)))}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg font-bold focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <p className="mt-1 text-xs text-slate-500">~1 sq ft per broiler, ~2 sq ft per layer</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Item</th>
              <th className="px-4 py-3 text-center font-semibold">Quantity</th>
              <th className="px-4 py-3 text-right font-semibold">Unit Price</th>
              <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {calcItems.map((it) => (
              <tr key={it.item}>
                <td className="px-4 py-3 font-medium text-slate-900">{it.item}</td>
                <td className="px-4 py-3 text-center text-slate-600">{it.qty}</td>
                <td className="px-4 py-3 text-right text-slate-600">{formatPrice(it.unitPrice)}</td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">{formatPrice(it.total)}</td>
              </tr>
            ))}
            <tr>
              <td className="px-4 py-3 font-medium text-slate-900">Water tank (1000 L)</td>
              <td className="px-4 py-3 text-center text-slate-600">1</td>
              <td className="px-4 py-3 text-right text-slate-600">{formatPrice(waterTank)}</td>
              <td className="px-4 py-3 text-right font-medium text-slate-900">{formatPrice(waterTank)}</td>
            </tr>
            <tr className="bg-amber-50/50">
              <td className="px-4 py-3 font-bold text-slate-900" colSpan={3}>Shed Construction ({shedSize} sq ft @ ₹400/sq ft)</td>
              <td className="px-4 py-3 text-right font-bold text-slate-900">{formatPrice(shedCost)}</td>
            </tr>
            <tr className="border-t-2 border-amber-200 bg-amber-50">
              <td className="px-4 py-4 text-base font-bold text-amber-800" colSpan={3}>Total Setup Cost</td>
              <td className="px-4 py-4 text-right text-base font-bold text-amber-800">{formatPrice(grandTotal)}</td>
            </tr>
          </tbody>
        </table>
      </Card>
      <p className="mt-3 text-xs text-slate-500">
        * Estimates only. Actual costs vary by region, material quality, and shed design. Confirm current prices in Market Prices.
      </p>
    </div>
  );
}
