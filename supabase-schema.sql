-- ============================================================
--  KNET'S BREW — Supabase (PostgreSQL) Schema
--  Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── PRODUCTS ────────────────────────────────────────────────
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category VARCHAR(80),
  stock INT DEFAULT 20,
  is_available SMALLINT DEFAULT 1,
  is_featured SMALLINT DEFAULT 0,
  image VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STAFF / ADMIN ACCOUNTS ──────────────────────────────────
CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  auth_id UUID UNIQUE,
  name VARCHAR(150) NOT NULL,
  username VARCHAR(80) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE,
  user_type VARCHAR(20) DEFAULT 'staff', -- 'admin' or 'staff'
  is_active SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDERS ──────────────────────────────────────────────────
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(20) NOT NULL UNIQUE,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(150),
  delivery_type VARCHAR(20) DEFAULT 'pickup',
  delivery_address TEXT,
  payment_method VARCHAR(20) DEFAULT 'cash',
  special_requests TEXT,
  subtotal NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) DEFAULT 0,
  status VARCHAR(30) DEFAULT 'received',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(150) NOT NULL,
  product_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

-- ─── NOTIFICATIONS ───────────────────────────────────────────
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,           -- 'new_order', 'order_update', 'low_stock', etc.
  title VARCHAR(200) NOT NULL,
  message TEXT,
  link VARCHAR(255),                    -- optional path to navigate to
  is_read SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ
CREATE POLICY "public read products"     ON products    FOR SELECT USING (true);
CREATE POLICY "public read orders"       ON orders      FOR SELECT USING (true);
CREATE POLICY "public read order_items"  ON order_items FOR SELECT USING (true);

-- PUBLIC INSERT (guest orders)
CREATE POLICY "public insert orders"      ON orders      FOR INSERT WITH CHECK (true);
CREATE POLICY "public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- AUTHENTICATED (logged-in staff/admin) full access
CREATE POLICY "auth full products"      ON products       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full orders"        ON orders         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full order_items"   ON order_items    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full staff"         ON staff          FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth full notifications" ON notifications  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
--  STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public read product-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "auth upload product-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "auth update product-images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
CREATE POLICY "auth delete product-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- ============================================================
--  SEED PRODUCTS — Knet's Brew premium menu
-- ============================================================

INSERT INTO products (name, description, price, category, stock, is_available, is_featured) VALUES
-- Ultra-rare flagship coffees
('Black Ivory', 'Ultra-rare elephant-processed coffee. Naturally sweet with notes of chocolate, malt, and a hint of red berry. A once-in-a-lifetime cup.', 1100.00, 'Rare Origins', 8, 1, 1),
('Kopi Luwak', 'The world''s most exotic coffee. Smooth, earthy, and complex with a velvety body and subtle caramel finish.', 650.00, 'Rare Origins', 12, 1, 1),
('Panama Geisha', 'Award-winning specialty. Bright florals of jasmine and bergamot with tropical fruit notes. Light, elegant, unforgettable.', 470.00, 'Rare Origins', 15, 1, 1),
('Blue Mountain', 'Jamaica''s legendary highland brew. Mild, balanced, and silky-smooth — clean acidity with mellow chocolate finish.', 400.00, 'Rare Origins', 18, 1, 1),

-- Espresso Collection
('Espresso', 'A clean, intense shot — pulled from our house-roasted single-origin beans.', 180.00, 'Espresso Collection', 30, 1, 0),
('Doppio', 'Double shot of pure espresso. For when one isn''t enough.', 200.00, 'Espresso Collection', 30, 1, 0),
('Cortado', 'Equal parts espresso and warm steamed milk. Bold but balanced.', 210.00, 'Espresso Collection', 25, 1, 0),
('Flat White', 'Velvety microfoam over a double ristretto. Smooth, strong, complete.', 220.00, 'Espresso Collection', 25, 1, 1),

-- Matcha & Signatures
('Matcha Latte', 'Ceremonial-grade matcha whisked into silky steamed milk. Grassy, sweet, energizing.', 280.00, 'Matcha & Signatures', 20, 1, 1),
('Iced Matcha Tonic', 'Matcha shaken with tonic and a hint of citrus. Refreshing and unexpected.', 310.00, 'Matcha & Signatures', 15, 1, 0),
('Spanish Latte', 'Espresso with condensed and fresh milk. House favorite — sweet, rich, indulgent.', 250.00, 'Matcha & Signatures', 25, 1, 1),
('Salted Caramel Latte', 'Caramel and sea salt over our signature espresso blend. Comfort in a cup.', 290.00, 'Matcha & Signatures', 20, 1, 0),

-- Pastries
('Classic Almond Croissant', 'Twice-baked with house-made almond cream. Flaky outside, tender inside.', 160.00, 'Pastries', 12, 1, 1),
('Chocolate Babka', 'Layered brioche with dark chocolate and a glossy honey glaze.', 180.00, 'Pastries', 10, 1, 0),
('Butter Croissant', 'European-style butter croissant. Twenty-seven layers, baked at dawn.', 125.00, 'Pastries', 15, 1, 0),
('Blueberry Scone', 'Crumbly, tender, packed with wild blueberries and a touch of lemon zest.', 145.00, 'Pastries', 12, 1, 0),
('Tiramisu Cup', 'Mascarpone, espresso-soaked ladyfingers, dusted with Valrhona cocoa.', 185.00, 'Pastries', 10, 1, 1),
('Pistachio Financier', 'Buttery French almond cake with pistachio. Dense, rich, perfect with espresso.', 165.00, 'Pastries', 12, 1, 0);

-- Placeholder staff rows (link to Supabase Auth users after)
INSERT INTO staff (name, username, email, user_type) VALUES
('Knet Admin',  'admin', 'admin@knetsbrew.ph', 'admin'),
('Barista One', 'staff', 'staff@knetsbrew.ph', 'staff');

-- Welcome notification
INSERT INTO notifications (type, title, message)
VALUES ('system', 'Welcome to Knet''s Brew Admin', 'Your portal is ready. New orders will appear here.');
