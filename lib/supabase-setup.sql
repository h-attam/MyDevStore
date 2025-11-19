-- Supabase Products Tablosu Oluşturma Scripti
-- Bu scripti Supabase SQL Editor'de çalıştırın

-- Products tablosunu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Örnek ürünleri ekle (eğer tablo boşsa)
INSERT INTO products (name, price, description, image_url, category)
SELECT * FROM (VALUES
  ('JavaScript Kitabı', 89.99, 'JavaScript programlama dilini öğrenmek için kapsamlı bir rehber. Modern ES6+ özellikleri, async/await, ve daha fazlası.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', 'Kitap'),
  ('React Kursu', 149.99, 'React ile modern web uygulamaları geliştirmeyi öğrenin. Hooks, Context API, ve Redux dahil.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', 'Kurs'),
  ('Programcı T-Shirt', 129.99, 'Programcılar için özel tasarlanmış rahat ve şık t-shirt. %100 pamuk, çeşitli renkler.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'Aksesuar'),
  ('Next.js E-Kitap', 59.99, 'Next.js 14 ile full-stack uygulamalar geliştirin. App Router, Server Components, ve API Routes.', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', 'Kitap'),
  ('TypeScript Rehberi', 79.99, 'TypeScript ile tip güvenli kod yazmayı öğrenin. Advanced types, generics, ve decorators.', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800', 'Kitap'),
  ('Web Development Seti', 199.99, 'Web geliştirme için gerekli tüm araçlar. Klavye, mouse, ve laptop standı dahil.', 'https://images.unsplash.com/photo-1527864550417-7f91a2e2d6e2?w=800', 'Aksesuar')
) AS v(name, price, description, image_url, category)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

-- RLS (Row Level Security) politikaları
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Herkes ürünleri görebilir
CREATE POLICY IF NOT EXISTS "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Sadece admin ürün ekleyebilir (isteğe bağlı)
-- CREATE POLICY "Only admins can insert products"
--   ON products FOR INSERT
--   WITH CHECK (auth.jwt() ->> 'email' = 'admin@example.com');

