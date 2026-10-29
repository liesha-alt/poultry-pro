import { useEffect, useState, useMemo } from 'react';
import { Store, Search, Filter, Phone, Mail, MapPin, Star, ArrowUpDown } from 'lucide-react';
import { supabase, type Buyer } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { Card, SectionTitle, Badge } from '@/components/ui';

const typeLabels: Record<string, string> = {
  shop: 'Retail Shop',
  wholesaler: 'Wholesaler',
  retailer: 'Retailer',
  restaurant: 'Restaurant',
  egg_trader: 'Egg Trader',
  distributor: 'Distributor',
  bulk: 'Bulk Buyer',
};

const typeColors: Record<string, 'blue' | 'green' | 'amber' | 'red' | 'slate'> = {
  shop: 'blue',
  wholesaler: 'green',
  retailer: 'blue',
  restaurant: 'amber',
  egg_trader: 'red',
  distributor: 'slate',
  bulk: 'slate',
};

export function FindBuyers() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'price' | 'name'>('price');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('buyers').select('*').order('current_price', { ascending: false });
      if (error) {
        console.error(error);
      } else {
        setBuyers(data as Buyer[]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = buyers.filter((b) => {
      const matchType = typeFilter === 'all' || b.type === typeFilter;
      const matchSearch =
        !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        (b.location?.toLowerCase().includes(search.toLowerCase()) ?? false);
      return matchType && matchSearch;
    });
    if (sortBy === 'price') {
      result = [...result].sort((a, b) => b.current_price - a.current_price);
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [buyers, search, typeFilter, sortBy]);

  const bestPrice = filtered.length > 0 ? Math.max(...filtered.map((b) => b.current_price)) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 animate-fade-in">
      <SectionTitle
        title="Find Buyers & Sell Products"
        subtitle="Directory of chicken shops, wholesalers, restaurants, egg traders, and bulk buyers near you."
        icon={<Store size={28} />}
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Total Buyers</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{buyers.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Buyer Types</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{new Set(buyers.map((b) => b.type)).size}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Best Price Available</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{formatPrice(bestPrice)}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by buyer name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white py-2.5 pl-3 pr-8 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Types</option>
            {Object.entries(typeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'price' ? 'name' : 'price')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowUpDown size={16} /> Sort: {sortBy === 'price' ? 'Price' : 'Name'}
        </button>
      </div>

      {/* Buyer cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading buyers...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500">No buyers found. Try a different search or filter.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b, idx) => (
            <Card
              key={b.id}
              className={`p-5 transition-all hover:shadow-md ${idx === 0 && sortBy === 'price' && b.current_price === bestPrice ? 'ring-2 ring-green-400' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{b.name}</h4>
                  <Badge color={typeColors[b.type]}>{typeLabels[b.type]}</Badge>
                </div>
                {idx === 0 && sortBy === 'price' && b.current_price === bestPrice && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Best Price</span>
                )}
              </div>

              <div className="mt-3 flex items-end gap-1">
                <span className="text-2xl font-bold text-slate-900">{formatPrice(b.current_price, b.currency)}</span>
                <span className="pb-1 text-xs text-slate-500">/{b.price_unit}</span>
              </div>

              {b.location && (
                <p className="mt-2 flex items-center gap-1 text-sm text-slate-600">
                  <MapPin size={14} /> {b.location}
                </p>
              )}

              {b.notes && <p className="mt-2 text-sm text-slate-500">{b.notes}</p>}

              <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
                {b.contact_person && (
                  <p className="text-slate-600">Contact: <span className="font-medium text-slate-800">{b.contact_person}</span></p>
                )}
                {b.phone && (
                  <a href={`tel:${b.phone}`} className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700">
                    <Phone size={14} /> {b.phone}
                  </a>
                )}
                {b.email && (
                  <a href={`mailto:${b.email}`} className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700">
                    <Mail size={14} /> {b.email}
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tip */}
      <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
        <p>
          <strong>Tip:</strong> Compare prices across buyers before selling. Wholesalers buy in bulk at slightly lower rates
          but save on transport, while retail shops pay more but buy smaller quantities. Always confirm prices on the day of sale.
        </p>
      </div>
    </div>
  );
}
