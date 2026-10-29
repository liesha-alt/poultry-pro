import { useEffect, useState, type ReactNode } from 'react';
import { Shield, Plus, Pencil, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import { supabase, type MarketPrice, type Supplier, type Buyer } from '@/lib/supabase';
import { formatPrice, formatDate, daysSince } from '@/lib/format';
import { Card, SectionTitle, Badge, showToast } from '@/components/ui';

type Tab = 'prices' | 'suppliers' | 'buyers';

export function Admin() {
  const [tab, setTab] = useState<Tab>('prices');

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 animate-fade-in">
      <SectionTitle
        title="Admin Dashboard"
        subtitle="Add and update prices, manage suppliers and buyers, and keep data fresh and verified."
        icon={<Shield size={28} />}
      />

      <div className="mb-6 flex gap-2 border-b border-slate-200">
        {([
          ['prices', 'Market Prices'],
          ['suppliers', 'Suppliers'],
          ['buyers', 'Buyers'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === key
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'prices' && <PricesAdmin />}
      {tab === 'suppliers' && <SuppliersAdmin />}
      {tab === 'buyers' && <BuyersAdmin />}
    </div>
  );
}

// ---- Prices Admin ----

const priceCategories = ['chick', 'feed', 'vaccine', 'equipment', 'utility', 'selling', 'other'];

function PricesAdmin() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MarketPrice | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadPrices(); }, []);
  async function loadPrices() {
    setLoading(true);
    const { data } = await supabase.from('market_prices').select('*').order('category').order('item_name');
    setPrices((data as MarketPrice[]) || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this price entry?')) return;
    const { error } = await supabase.from('market_prices').delete().eq('id', id);
    if (error) { showToast('Failed to delete', 'error'); return; }
    showToast('Price deleted', 'success');
    loadPrices();
  }

  async function handleToggleVerified(p: MarketPrice) {
    const { error } = await supabase.from('market_prices')
      .update({ verified: !p.verified, last_updated: new Date().toISOString().slice(0, 10) })
      .eq('id', p.id);
    if (error) { showToast('Update failed', 'error'); return; }
    showToast(p.verified ? 'Marked unverified' : 'Marked verified', 'success');
    loadPrices();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white transition hover:bg-amber-700"
        >
          <Plus size={18} /> Add Price
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prices.map((p) => {
                  const stale = daysSince(p.last_updated) > 60;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{p.item_name}</div>
                        {p.breed && <div className="text-xs text-slate-500">{p.breed}</div>}
                      </td>
                      <td className="px-4 py-3"><Badge>{p.category}</Badge></td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(p.price, p.currency)}</td>
                      <td className="px-4 py-3 text-slate-600">{p.location || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(p.last_updated)}</td>
                      <td className="px-4 py-3">
                        {stale ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600"><AlertTriangle size={12} /> Stale</span>
                        ) : p.verified ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600"><Check size={12} /> Verified</span>
                        ) : (
                          <span className="text-xs text-slate-400">Unverified</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleToggleVerified(p)} title="Toggle verified" className="rounded p-1.5 text-slate-400 hover:bg-green-50 hover:text-green-600">
                            <Check size={16} />
                          </button>
                          <button onClick={() => { setEditing(p); setShowForm(true); }} className="rounded p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showForm && (
        <PriceForm
          editing={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); loadPrices(); }}
        />
      )}
    </div>
  );
}

function PriceForm({ editing, onClose, onSaved }: { editing: MarketPrice | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    category: editing?.category || 'chick',
    item_name: editing?.item_name || '',
    breed: editing?.breed || '',
    unit: editing?.unit || 'per piece',
    price: editing?.price || 0,
    currency: editing?.currency || '₹',
    location: editing?.location || '',
    supplier: editing?.supplier || '',
    source: editing?.source || '',
    verified: editing?.verified ?? false,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      breed: form.breed || null,
      location: form.location || null,
      supplier: form.supplier || null,
      source: form.source || null,
      last_updated: new Date().toISOString().slice(0, 10),
    };
    let error;
    if (editing) {
      ({ error } = await supabase.from('market_prices').update(payload).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('market_prices').insert(payload));
    }
    setSaving(false);
    if (error) { showToast('Save failed: ' + error.message, 'error'); return; }
    showToast(editing ? 'Price updated' : 'Price added', 'success');
    onSaved();
  }

  return (
    <Modal title={editing ? 'Edit Price' : 'Add Price'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormGrid>
          <SelectField label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v as MarketPrice['category'] })} options={priceCategories} />
          <InputField label="Item Name" value={form.item_name} onChange={(v) => setForm({ ...form, item_name: v })} required />
          <InputField label="Breed" value={form.breed} onChange={(v) => setForm({ ...form, breed: v })} />
          <InputField label="Unit" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} required />
          <InputField label="Price" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} required />
          <InputField label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <InputField label="Supplier" value={form.supplier} onChange={(v) => setForm({ ...form, supplier: v })} />
          <InputField label="Source" value={form.source} onChange={(v) => setForm({ ...form, source: v })} />
        </FormGrid>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} className="rounded" />
          Verified
        </label>
        <FormActions saving={saving} onCancel={onClose} isEdit={!!editing} />
      </form>
    </Modal>
  );
}

// ---- Suppliers Admin ----

const supplierTypes = ['chick', 'feed', 'equipment', 'veterinary', 'mixed'];

function SuppliersAdmin() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from('suppliers').select('*').order('name');
    setSuppliers((data as Supplier[]) || []);
    setLoading(false);
  }
  async function handleDelete(id: string) {
    if (!confirm('Delete this supplier?')) return;
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) { showToast('Failed to delete', 'error'); return; }
    showToast('Supplier deleted', 'success');
    load();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700">
          <Plus size={18} /> Add Supplier
        </button>
      </div>
      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                    <td className="px-4 py-3"><Badge color="blue">{s.type}</Badge></td>
                    <td className="px-4 py-3 text-slate-600">
                      {s.phone || '—'}{s.contact_person ? ` (${s.contact_person})` : ''}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.location || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{s.rating > 0 ? `${s.rating}★` : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditing(s); setShowForm(true); }} className="rounded p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(s.id)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {showForm && <SupplierForm editing={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
}

function SupplierForm({ editing, onClose, onSaved }: { editing: Supplier | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: editing?.name || '',
    type: editing?.type || 'chick',
    contact_person: editing?.contact_person || '',
    phone: editing?.phone || '',
    email: editing?.email || '',
    location: editing?.location || '',
    rating: editing?.rating || 0,
    notes: editing?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      contact_person: form.contact_person || null,
      phone: form.phone || null,
      email: form.email || null,
      location: form.location || null,
      notes: form.notes || null,
    };
    let error;
    if (editing) {
      ({ error } = await supabase.from('suppliers').update(payload).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('suppliers').insert(payload));
    }
    setSaving(false);
    if (error) { showToast('Save failed', 'error'); return; }
    showToast(editing ? 'Supplier updated' : 'Supplier added', 'success');
    onSaved();
  }

  return (
    <Modal title={editing ? 'Edit Supplier' : 'Add Supplier'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormGrid>
          <InputField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <SelectField label="Type" value={form.type} onChange={(v) => setForm({ ...form, type: v as Supplier['type'] })} options={supplierTypes} />
          <InputField label="Contact Person" value={form.contact_person} onChange={(v) => setForm({ ...form, contact_person: v })} />
          <InputField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <InputField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <InputField label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <InputField label="Rating (0-5)" type="number" value={String(form.rating)} onChange={(v) => setForm({ ...form, rating: Number(v) })} />
        </FormGrid>
        <InputField label="Notes" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
        <FormActions saving={saving} onCancel={onClose} isEdit={!!editing} />
      </form>
    </Modal>
  );
}

// ---- Buyers Admin ----

const buyerTypes = ['shop', 'wholesaler', 'retailer', 'restaurant', 'egg_trader', 'distributor', 'bulk'];

function BuyersAdmin() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Buyer | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from('buyers').select('*').order('name');
    setBuyers((data as Buyer[]) || []);
    setLoading(false);
  }
  async function handleDelete(id: string) {
    if (!confirm('Delete this buyer?')) return;
    const { error } = await supabase.from('buyers').delete().eq('id', id);
    if (error) { showToast('Failed to delete', 'error'); return; }
    showToast('Buyer deleted', 'success');
    load();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700">
          <Plus size={18} /> Add Buyer
        </button>
      </div>
      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {buyers.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{b.name}</td>
                    <td className="px-4 py-3"><Badge color="green">{b.type}</Badge></td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(b.current_price, b.currency)}/{b.price_unit}</td>
                    <td className="px-4 py-3 text-slate-600">{b.phone || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{b.location || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditing(b); setShowForm(true); }} className="rounded p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(b.id)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {showForm && <BuyerForm editing={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
}

function BuyerForm({ editing, onClose, onSaved }: { editing: Buyer | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: editing?.name || '',
    type: editing?.type || 'shop',
    contact_person: editing?.contact_person || '',
    phone: editing?.phone || '',
    email: editing?.email || '',
    location: editing?.location || '',
    current_price: editing?.current_price || 0,
    currency: editing?.currency || '₹',
    price_unit: editing?.price_unit || 'per kg',
    notes: editing?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      contact_person: form.contact_person || null,
      phone: form.phone || null,
      email: form.email || null,
      location: form.location || null,
      notes: form.notes || null,
    };
    let error;
    if (editing) {
      ({ error } = await supabase.from('buyers').update(payload).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('buyers').insert(payload));
    }
    setSaving(false);
    if (error) { showToast('Save failed', 'error'); return; }
    showToast(editing ? 'Buyer updated' : 'Buyer added', 'success');
    onSaved();
  }

  return (
    <Modal title={editing ? 'Edit Buyer' : 'Add Buyer'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormGrid>
          <InputField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <SelectField label="Type" value={form.type} onChange={(v) => setForm({ ...form, type: v as Buyer['type'] })} options={buyerTypes} />
          <InputField label="Contact Person" value={form.contact_person} onChange={(v) => setForm({ ...form, contact_person: v })} />
          <InputField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <InputField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <InputField label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <InputField label="Current Price" type="number" value={String(form.current_price)} onChange={(v) => setForm({ ...form, current_price: Number(v) })} required />
          <InputField label="Price Unit" value={form.price_unit} onChange={(v) => setForm({ ...form, price_unit: v })} />
        </FormGrid>
        <InputField label="Notes" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
        <FormActions saving={saving} onCancel={onClose} isEdit={!!editing} />
      </form>
    </Modal>
  );
}

// ---- Shared Form Components ----

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function InputField({ label, value, onChange, required, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}{required && <span className="text-red-500"> *</span>}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FormActions({ saving, onCancel, isEdit }: { saving: boolean; onCancel: () => void; isEdit: boolean }) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
      <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
      <button type="submit" disabled={saving} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50">
        {saving ? 'Saving...' : isEdit ? 'Update' : 'Add'}
      </button>
    </div>
  );
}
