/*
# Poultry Farm Business Website — Core Schema

## Overview
Single-tenant schema (no auth) for a poultry farm business guide website.
Admin-managed public data: market prices, suppliers, buyers, and price history.
All tables allow anon + authenticated CRUD so the admin dashboard (no login)
can manage data and visitors can read it.

## New Tables
1. `market_prices` — current market prices for chicks, feed, vaccines,
   equipment, utilities, and selling prices. Includes category, breed,
   unit, price, location, supplier, source, last-updated date, and a
   verified flag.
2. `price_history` — historical price snapshots for trend tracking.
3. `suppliers` — directory of chick, feed, equipment, and veterinary
   suppliers with contact details and location.
4. `buyers` — directory of chicken shops, wholesalers, restaurants,
   egg traders, and bulk buyers with contact details and current price.

## Security
- RLS enabled on every table.
- CRUD granted to `anon, authenticated` (single-tenant, no sign-in,
  intentionally public/shared data).
- Four separate policies per table (select/insert/update/delete).

## Notes
- All price columns are numeric to support filtering and sorting.
- `last_updated` and `recorded_date` track freshness for the
  "flag outdated prices" feature.
*/

CREATE TABLE IF NOT EXISTS market_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('chick','feed','vaccine','equipment','utility','selling','other')),
  item_name text NOT NULL,
  breed text,
  unit text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT '₹',
  location text,
  supplier text,
  source text,
  last_updated date NOT NULL DEFAULT CURRENT_DATE,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON market_prices TO anon, authenticated;

DROP POLICY IF EXISTS "mp_select" ON market_prices;
CREATE POLICY "mp_select" ON market_prices FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "mp_insert" ON market_prices;
CREATE POLICY "mp_insert" ON market_prices FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "mp_update" ON market_prices;
CREATE POLICY "mp_update" ON market_prices FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "mp_delete" ON market_prices;
CREATE POLICY "mp_delete" ON market_prices FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_market_prices_category ON market_prices(category);
CREATE INDEX IF NOT EXISTS idx_market_prices_location ON market_prices(location);

CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT '₹',
  location text,
  recorded_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON price_history TO anon, authenticated;

DROP POLICY IF EXISTS "ph_select" ON price_history;
CREATE POLICY "ph_select" ON price_history FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "ph_insert" ON price_history;
CREATE POLICY "ph_insert" ON price_history FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ph_update" ON price_history;
CREATE POLICY "ph_update" ON price_history FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ph_delete" ON price_history;
CREATE POLICY "ph_delete" ON price_history FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_price_history_item ON price_history(item_name);
CREATE INDEX IF NOT EXISTS idx_price_history_date ON price_history(recorded_date);

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('chick','feed','equipment','veterinary','mixed')),
  contact_person text,
  phone text,
  email text,
  location text,
  rating numeric DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON suppliers TO anon, authenticated;

DROP POLICY IF EXISTS "sup_select" ON suppliers;
CREATE POLICY "sup_select" ON suppliers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "sup_insert" ON suppliers;
CREATE POLICY "sup_insert" ON suppliers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "sup_update" ON suppliers;
CREATE POLICY "sup_update" ON suppliers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "sup_delete" ON suppliers;
CREATE POLICY "sup_delete" ON suppliers FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('shop','wholesaler','retailer','restaurant','egg_trader','distributor','bulk')),
  contact_person text,
  phone text,
  email text,
  location text,
  current_price numeric DEFAULT 0,
  currency text NOT NULL DEFAULT '₹',
  price_unit text DEFAULT 'per kg',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON buyers TO anon, authenticated;

DROP POLICY IF EXISTS "buy_select" ON buyers;
CREATE POLICY "buy_select" ON buyers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "buy_insert" ON buyers;
CREATE POLICY "buy_insert" ON buyers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "buy_update" ON buyers;
CREATE POLICY "buy_update" ON buyers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "buy_delete" ON buyers;
CREATE POLICY "buy_delete" ON buyers FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_buyers_type ON buyers(type);
CREATE INDEX IF NOT EXISTS idx_buyers_location ON buyers(location);