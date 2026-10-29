import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MarketPrice = {
  id: string;
  category: 'chick' | 'feed' | 'vaccine' | 'equipment' | 'utility' | 'selling' | 'other';
  item_name: string;
  breed: string | null;
  unit: string;
  price: number;
  currency: string;
  location: string | null;
  supplier: string | null;
  source: string | null;
  last_updated: string;
  verified: boolean;
};

export type PriceHistory = {
  id: string;
  item_name: string;
  category: string;
  price: number;
  currency: string;
  location: string | null;
  recorded_date: string;
};

export type Supplier = {
  id: string;
  name: string;
  type: 'chick' | 'feed' | 'equipment' | 'veterinary' | 'mixed';
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  rating: number;
  notes: string | null;
};

export type Buyer = {
  id: string;
  name: string;
  type: 'shop' | 'wholesaler' | 'retailer' | 'restaurant' | 'egg_trader' | 'distributor' | 'bulk';
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  current_price: number;
  currency: string;
  price_unit: string;
  notes: string | null;
};
