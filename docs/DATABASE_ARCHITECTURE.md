
# Sneaker Vault Database Architecture

## Overview
The Sneaker Vault app includes a comprehensive sneaker database system designed to scale from 100 to 1M+ entries while supporting user-generated content.

## Current Implementation (Local/Mock Data)

### Data Structure
- **SneakerDatabase**: Core sneaker entity with 20+ fields including SKU, brand, model, colorway, pricing, images, and metadata
- **Curated Collection**: Starting with 30+ iconic sneakers (Jordan, Kobe, LeBron, Yeezy, etc.)
- **Brand Registry**: Organized by brand with popular silhouettes

### Features
- ✅ Search by brand, model, SKU, colorway, tags
- ✅ Filter by brand, category, price range
- ✅ Sort by popularity, price, release date, name
- ✅ Pagination (20 items per page)
- ✅ Detailed sneaker view with full specs
- ✅ Curated vs user-generated distinction
- ✅ Verification status tracking

### File Structure
```
types/
  └── database.ts          # TypeScript interfaces
data/
  └── sneakerDatabase.ts   # Mock data + utility functions
hooks/
  └── useSneakerDatabase.ts # Data management hooks
app/(tabs)/
  └── database.tsx         # Main database screen
components/
  └── SneakerDetailModal.tsx # Detailed sneaker view
```

## Scaling to 1M+ Entries (Supabase Integration)

### Database Schema (PostgreSQL via Supabase)

```sql
-- Main sneakers table
CREATE TABLE sneakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(50) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(200) NOT NULL,
  colorway VARCHAR(200) NOT NULL,
  release_date DATE NOT NULL,
  retail_price DECIMAL(10,2) NOT NULL,
  estimated_value DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(50) NOT NULL,
  silhouette VARCHAR(100) NOT NULL,
  is_curated BOOLEAN DEFAULT false,
  added_by UUID REFERENCES auth.users(id),
  verification_status VARCHAR(20) DEFAULT 'unverified',
  popularity INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sneakers_brand ON sneakers(brand);
CREATE INDEX idx_sneakers_sku ON sneakers(sku);
CREATE INDEX idx_sneakers_category ON sneakers(category);
CREATE INDEX idx_sneakers_popularity ON sneakers(popularity DESC);
CREATE INDEX idx_sneakers_tags ON sneakers USING GIN(tags);
CREATE INDEX idx_sneakers_search ON sneakers USING GIN(
  to_tsvector('english', model || ' ' || colorway || ' ' || brand)
);

-- User collections
CREATE TABLE user_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  sneaker_id UUID REFERENCES sneakers(id) NOT NULL,
  purchase_price DECIMAL(10,2),
  purchase_date DATE,
  condition VARCHAR(50),
  size VARCHAR(20),
  notes TEXT,
  is_verified BOOLEAN DEFAULT false,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sneaker_id)
);

-- Brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  popular_silhouettes TEXT[] DEFAULT '{}'
);

-- Row Level Security (RLS)
ALTER TABLE sneakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Sneakers are viewable by everyone" 
  ON sneakers FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can add sneakers" 
  ON sneakers FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own collections" 
  ON user_collections FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own collections" 
  ON user_collections FOR ALL 
  USING (auth.uid() = user_id);
```

### API Integration

#### Supabase Client Setup
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### Query Examples
```typescript
// Search with filters
const { data, error } = await supabase
  .from('sneakers')
  .select('*')
  .ilike('model', `%${query}%`)
  .eq('brand', brand)
  .gte('estimated_value', minPrice)
  .lte('estimated_value', maxPrice)
  .order('popularity', { ascending: false })
  .range(start, end);

// Add user-generated sneaker
const { data, error } = await supabase
  .from('sneakers')
  .insert([{
    sku: form.sku,
    brand: form.brand,
    model: form.model,
    // ... other fields
    is_curated: false,
    added_by: user.id,
    verification_status: 'pending'
  }]);

// Add to user collection
const { data, error } = await supabase
  .from('user_collections')
  .insert([{
    user_id: user.id,
    sneaker_id: sneakerId,
    purchase_price: price,
    condition: condition
  }]);
```

### Performance Optimizations

1. **Pagination**: Use cursor-based pagination for large datasets
2. **Caching**: Implement React Query for client-side caching
3. **Image CDN**: Use Supabase Storage with CDN for images
4. **Full-Text Search**: PostgreSQL's built-in FTS for fast searches
5. **Materialized Views**: For complex aggregations (e.g., trending sneakers)

### User-Generated Content Flow

1. **Submission**: User fills out form with sneaker details
2. **Image Upload**: Upload to Supabase Storage
3. **Database Insert**: Create entry with `is_curated: false`
4. **Verification Queue**: Admin review for quality control
5. **Approval**: Status changes to 'verified', becomes searchable

### Migration Path

1. ✅ **Phase 1 (Current)**: Local mock data, UI/UX development
2. **Phase 2**: Enable Supabase, migrate curated data
3. **Phase 3**: Enable user submissions with moderation
4. **Phase 4**: Add real-time features (live price updates, notifications)
5. **Phase 5**: Scale to 1M+ with advanced features (ML recommendations, market analytics)

## Next Steps

To enable the full database functionality:

1. **Enable Supabase** in Natively
2. **Run migrations** to create tables
3. **Seed database** with curated sneakers
4. **Update hooks** to use Supabase client
5. **Implement image uploads** for user-generated content
6. **Add moderation** dashboard for verifying submissions

## Benefits of This Architecture

- **Scalable**: PostgreSQL can handle millions of rows efficiently
- **Flexible**: Easy to add new fields or relationships
- **Secure**: RLS ensures users can only modify their own data
- **Fast**: Proper indexing enables sub-second queries
- **Real-time**: Supabase Realtime for live updates
- **Cost-effective**: Pay only for what you use
