-- ============================================================
-- HIEA MVP — Initial Schema
-- Run in Supabase SQL Editor (single transaction)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. TABLES
-- ────────────────────────────────────────────────────────────

-- Categories (news, policies, events)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles (extends auth.users with role)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'editor'
    CHECK (role IN ('editor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Articles (full CMS content model)
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500),
  slug VARCHAR(500) UNIQUE,
  content JSONB,
  excerpt TEXT,
  category_id UUID REFERENCES categories(id),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending', 'published')),
  author_id UUID REFERENCES profiles(id),
  featured_image_url TEXT,
  attachment_url TEXT,
  is_member_only BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 2. INDEXES
-- ────────────────────────────────────────────────────────────

CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published_at DESC)
  WHERE status = 'published';
CREATE INDEX idx_articles_author ON articles(author_id);

-- ────────────────────────────────────────────────────────────
-- 3. FUNCTIONS & TRIGGERS
-- ────────────────────────────────────────────────────────────

-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Categories: anyone can read
CREATE POLICY "public_read" ON categories
  FOR SELECT USING (true);

-- Categories: only admins can manage
CREATE POLICY "admin_manage" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Profiles: users can read their own profile
CREATE POLICY "read_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: users can update their own profile
CREATE POLICY "update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Profiles: admins can read all profiles
CREATE POLICY "admin_read_all_profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Articles: anyone can read published, non-member-only articles
CREATE POLICY "public_read_published" ON articles
  FOR SELECT USING (status = 'published' AND is_member_only = false);

-- Articles: authors can CRUD their own articles
CREATE POLICY "author_crud_own" ON articles
  FOR ALL USING (auth.uid() = author_id);

-- Articles: admins have full access
CREATE POLICY "admin_full_access" ON articles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ────────────────────────────────────────────────────────────
-- 5. SEED DATA
-- ────────────────────────────────────────────────────────────

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Tin tức', 'news', 1),
  ('Chính sách & Quy định', 'policies', 2),
  ('Sự kiện', 'events', 3);

-- ────────────────────────────────────────────────────────────
-- 6. STORAGE BUCKET
-- ────────────────────────────────────────────────────────────
-- Run these in Supabase SQL Editor (storage schema access required)

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('attachments', 'attachments', true, 20971520); -- 20MB limit

-- Storage policy: authenticated users can upload
CREATE POLICY "authenticated_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'attachments' AND auth.role() = 'authenticated'
  );

-- Storage policy: anyone can read public bucket files
CREATE POLICY "public_read_attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'attachments');

-- Storage policy: owners can update/delete their uploads
CREATE POLICY "owner_manage_attachments" ON storage.objects
  FOR UPDATE USING (bucket_id = 'attachments' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'attachments' AND auth.uid() = owner);

CREATE POLICY "owner_delete_attachments" ON storage.objects
  FOR DELETE USING (bucket_id = 'attachments' AND auth.uid() = owner);
