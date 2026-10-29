import { useEffect, useState, useMemo } from 'react';
import { LineChart, Search, Filter, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase, type MarketPrice } from '@/lib/supabase';
import { formatPrice, formatDate, daysSince } from '@/lib/format';
import { Card, SectionTitle, Badge } from '@/components/ui';

const categoryLabels: Record<string, string> = {
  chick: 'Chicks',
  feed: 'Feed',
  vaccine: 'Vaccines & Medicine',
  equipment: 'Equipment',
  utility: 'Utilities & Labour',
  selling: 'Selling Prices',
  other: 'Other',
};

const categoryColors: Record<string, 'blue' | 'green' | 'amber' | 'red' | 'slate'> = {
  chick: 'blue',
  feed: 'green',
  vaccine: 'amber',
  equipment: 'slate',
  utility: 'slate',
  selling: 'red',
  other: 'slate',
};

export function MarketPrices() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .order('category')
        .order('item_name');
      if (error) {
        console.error(error);
      } else {
        setPrices(data as MarketPrice[]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return prices.filter((p) => {
      const matchCat = category === 'all' || p.category === category;
      const matchSearch =
        !search ||
        p.item_name.toLowerCase().includes(search.toLowerCase()) ||
        (p.breed?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (p.location?.toLowerCase().includes(search.toLowerCase()) ?? false);
      return matchCat && matchSearch;
    });
  }, [prices, search, category]);

  const categories = ['all', ...Object.keys(categoryLabels)];
  const oldestDays = prices.length > 0 ? Math.max(...prices.map((p) => daysSince(p.last_updated))) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 animate-fade-in">
      <SectionTitle
        title="Market Prices"
        subtitle="Current prices for chicks, feed, vaccines, equipment, utilities, and selling rates."
        icon={<LineChart size={28} />}
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Total Items Tracked</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{prices.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Verified Prices</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{prices.filter((p) => p.verified).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Price Freshness</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {oldestDays <= 30 ? <span className="text-green-600">{oldestDays}d old</span> : <span className="text-amber-600">{oldestDays}d old</span>}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by item, breed, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-8 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : categoryLabels[c]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price table */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading prices...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500">No prices found. Try a different search or category.</div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Unit</th>
                  <th className="px-4 py-3 text-right font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const age = daysSince(p.last_updated);
                  const stale = age > 60;
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-amber-50/40">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{p.item_name}</div>
                        {p.breed && <div className="text-xs text-slate-500">{p.breed}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={categoryColors[p.category]}>{categoryLabels[p.category]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.unit}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">{formatPrice(p.price, p.currency)}</td>
                      <td className="px-4 py-3 text-slate-600">{p.location || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(p.last_updated)}</td>
                      <td className="px-4 py-3">
                        {p.verified && !stale ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                            <CheckCircle2 size={14} /> Verified
                          </span>
                        ) : stale ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <AlertTriangle size={14} /> {age}d ago
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                            Unverified
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Price trend note */}
      <div className="mt-6 flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <TrendingUp size={18} className="mt-0.5 shrink-0" />
        <p>
          Prices are sourced from verified suppliers and market surveys. Items marked as
          "Verified" have been confirmed within the last 60 days. Prices older than 60 days
          are flagged for re-verification. Contact suppliers directly for current bulk rates.
        </p>
      </div>
    </div>
  );
}
