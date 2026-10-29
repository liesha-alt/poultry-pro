import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign, PiggyBank, Target } from 'lucide-react';
import { Card, SectionTitle } from '@/components/ui';
import { formatPrice } from '@/lib/format';

type FarmType = 'broiler' | 'layer' | 'country';

const presets: Record<FarmType, { chickPrice: number; feedPrice: number; fcr: number; cycleDays: number; sellPrice: number; targetWeight: number; mortality: number }> = {
  broiler: { chickPrice: 28, feedPrice: 36, fcr: 1.6, cycleDays: 38, sellPrice: 95, targetWeight: 2.0, mortality: 5 },
  layer: { chickPrice: 42, feedPrice: 39, fcr: 2.2, cycleDays: 456, sellPrice: 6, targetWeight: 300, mortality: 8 },
  country: { chickPrice: 55, feedPrice: 32, fcr: 2.5, cycleDays: 100, sellPrice: 260, targetWeight: 1.8, mortality: 7 },
};

export function ProfitCalculator() {
  const [farmType, setFarmType] = useState<FarmType>('broiler');
  const p = presets[farmType];

  const [birdCount, setBirdCount] = useState(500);
  const [chickPrice, setChickPrice] = useState(p.chickPrice);
  const [feedPrice, setFeedPrice] = useState(p.feedPrice);
  const [fcr, setFcr] = useState(p.fcr);
  const [cycleDays, setCycleDays] = useState(p.cycleDays);
  const [sellPrice, setSellPrice] = useState(p.sellPrice);
  const [targetWeight, setTargetWeight] = useState(p.targetWeight);
  const [mortality, setMortality] = useState(p.mortality);
  const [miscCost, setMiscCost] = useState(5000);

  const applyPreset = (type: FarmType) => {
    setFarmType(type);
    const preset = presets[type];
    setChickPrice(preset.chickPrice);
    setFeedPrice(preset.feedPrice);
    setFcr(preset.fcr);
    setCycleDays(preset.cycleDays);
    setSellPrice(preset.sellPrice);
    setTargetWeight(preset.targetWeight);
    setMortality(preset.mortality);
  };

  const results = useMemo(() => {
    const surviving = birdCount * (1 - mortality / 100);
    const totalChickCost = birdCount * chickPrice;

    let feedConsumedPerBird: number;
    let revenuePerBird: number;

    if (farmType === 'layer') {
      // targetWeight = eggs per hen per cycle
      feedConsumedPerBird = (targetWeight / 10) * fcr * 30; // rough daily feed * days
      // For layers: feed per day ~ 110g, cycle days
      const dailyFeedKg = 0.110;
      feedConsumedPerBird = dailyFeedKg * cycleDays;
      revenuePerBird = targetWeight * sellPrice; // eggs * price per egg
    } else {
      // broiler/country: weight-based
      feedConsumedPerBird = targetWeight * fcr;
      revenuePerBird = targetWeight * sellPrice;
    }

    const totalFeedCost = surviving * feedConsumedPerBird * feedPrice;
    const totalRevenue = surviving * revenuePerBird;
    const totalCost = totalChickCost + totalFeedCost + miscCost;
    const profit = totalRevenue - totalCost;
    const costPerBird = totalCost / surviving;
    const revenuePerBirdFinal = totalRevenue / surviving;
    const profitPerBird = profit / surviving;
    const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
    const breakEvenPrice = farmType === 'layer'
      ? totalCost / (surviving * targetWeight)
      : totalCost / (surviving * targetWeight);
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return {
      surviving: Math.round(surviving),
      totalChickCost,
      totalFeedCost,
      totalCost,
      totalRevenue,
      profit,
      costPerBird,
      revenuePerBirdFinal,
      profitPerBird,
      margin,
      breakEvenPrice,
      roi,
      feedConsumedPerBird: feedConsumedPerBird.toFixed(1),
    };
  }, [birdCount, chickPrice, feedPrice, fcr, cycleDays, sellPrice, targetWeight, mortality, miscCost, farmType]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 animate-fade-in">
      <SectionTitle
        title="Cost & Profit Calculator"
        subtitle="Calculate your total investment, revenue, profit, break-even price, and return on investment."
        icon={<Calculator size={28} />}
      />

      {/* Farm type selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(['broiler', 'layer', 'country'] as FarmType[]).map((t) => (
          <button
            key={t}
            onClick={() => applyPreset(t)}
            className={`rounded-lg px-5 py-2.5 font-medium capitalize transition-colors ${
              farmType === t
                ? 'bg-amber-600 text-white shadow-md'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t === 'country' ? 'Country Chicken' : t} Farm
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Inputs</h3>
          <div className="space-y-4">
            <Field label="Number of Birds" value={birdCount} onChange={setBirdCount} suffix="birds" />
            <Field label="Chick Price" value={chickPrice} onChange={setChickPrice} prefix="₹" suffix="per chick" />
            <Field label="Feed Price" value={feedPrice} onChange={setFeedPrice} prefix="₹" suffix="per kg" />
            <Field label="Feed Conversion Ratio (FCR)" value={fcr} onChange={setFcr} suffix="kg feed/kg gain" step={0.1} />
            <Field label="Cycle Duration" value={cycleDays} onChange={setCycleDays} suffix="days" />
            <Field
              label={farmType === 'layer' ? 'Eggs per Hen (cycle)' : 'Target Weight'}
              value={targetWeight}
              onChange={setTargetWeight}
              suffix={farmType === 'layer' ? 'eggs' : 'kg'}
              step={0.1}
            />
            <Field
              label={farmType === 'layer' ? 'Selling Price per Egg' : 'Selling Price per kg'}
              value={sellPrice}
              onChange={setSellPrice}
              prefix="₹"
            />
            <Field label="Expected Mortality" value={mortality} onChange={setMortality} suffix="%" step={0.5} />
            <Field label="Misc. Costs (vaccine, labour, utilities)" value={miscCost} onChange={setMiscCost} prefix="₹" />
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              icon={DollarSign}
              label="Total Investment"
              value={formatPrice(results.totalCost)}
              color="slate"
            />
            <ResultCard
              icon={TrendingUp}
              label="Total Revenue"
              value={formatPrice(results.totalRevenue)}
              color="blue"
            />
            <ResultCard
              icon={results.profit >= 0 ? PiggyBank : TrendingDown}
              label={results.profit >= 0 ? 'Net Profit' : 'Net Loss'}
              value={formatPrice(Math.abs(results.profit))}
              color={results.profit >= 0 ? 'green' : 'red'}
            />
            <ResultCard
              icon={Target}
              label="Return on Investment"
              value={`${results.roi.toFixed(1)}%`}
              color={results.roi >= 0 ? 'green' : 'red'}
            />
          </div>

          {/* Breakdown */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Cost Breakdown</h3>
            <div className="space-y-3 text-sm">
              <Row label="Surviving birds" value={`${results.surviving}`} />
              <Row label="Chick cost (total)" value={formatPrice(results.totalChickCost)} />
              <Row label={`Feed cost (${results.feedConsumedPerBird} kg/bird)`} value={formatPrice(results.totalFeedCost)} />
              <Row label="Misc. costs" value={formatPrice(miscCost)} />
              <div className="border-t border-slate-200 pt-3">
                <Row label="Total Cost" value={formatPrice(results.totalCost)} bold />
              </div>
              <Row label="Total Revenue" value={formatPrice(results.totalRevenue)} bold />
              <div className="border-t-2 border-amber-200 pt-3">
                <Row
                  label={results.profit >= 0 ? 'Net Profit' : 'Net Loss'}
                  value={`${results.profit >= 0 ? '+' : '-'}${formatPrice(Math.abs(results.profit))}`}
                  bold
                  highlight={results.profit >= 0 ? 'green' : 'red'}
                />
              </div>
            </div>
          </Card>

          {/* Per bird metrics */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Per-Bird Metrics</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric label="Cost per Bird" value={formatPrice(results.costPerBird)} />
              <Metric label="Revenue per Bird" value={formatPrice(results.revenuePerBirdFinal)} />
              <Metric
                label="Profit per Bird"
                value={formatPrice(results.profitPerBird)}
                color={results.profitPerBird >= 0 ? 'text-green-600' : 'text-red-600'}
              />
              <Metric label="Profit Margin" value={`${results.margin.toFixed(1)}%`} color={results.margin >= 0 ? 'text-green-600' : 'text-red-600'} />
              <Metric
                label="Break-even Price"
                value={farmType === 'layer' ? `${formatPrice(results.breakEvenPrice)}/egg` : `${formatPrice(results.breakEvenPrice)}/kg`}
              />
            </div>
          </Card>
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        * Estimates based on the inputs you provide. Actual results depend on market conditions, management quality, and disease incidence.
        Use the Market Prices page for current rates. Preset values are typical industry averages for India.
      </p>
    </div>
  );
}

function Field({ label, value, onChange, prefix, suffix, step = 1 }: {
  label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1 flex items-center rounded-lg border border-slate-300 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
        {prefix && <span className="pl-3 text-slate-500">{prefix}</span>}
        <input
          type="number"
          value={value}
          step={step}
          min={0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent px-3 py-2 text-base font-medium focus:outline-none"
        />
        {suffix && <span className="pr-3 text-xs text-slate-400">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultCard({ icon: Icon, label, value, color }: { icon: typeof DollarSign; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <Icon size={20} className="mb-2 opacity-70" />
      <p className="text-xs font-medium uppercase opacity-70">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: 'green' | 'red' }) {
  const color = highlight === 'green' ? 'text-green-600' : highlight === 'red' ? 'text-red-600' : 'text-slate-900';
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-semibold text-slate-700' : 'text-slate-600'}>{label}</span>
      <span className={`${bold ? 'font-bold' : 'font-medium'} ${color}`}>{value}</span>
    </div>
  );
}

function Metric({ label, value, color = 'text-slate-900' }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
