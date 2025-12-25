
# Sneaker Vault - Scalability Guide

## Overview

The Sneaker Vault app is now built on a scalable architecture using Supabase that can handle 1 million+ sneakers with real images and user-generated content.

## Architecture

### Database Schema

The app uses a PostgreSQL database with the following tables:

#### 1. **sneakers** - Global Sneaker Database
- Stores all sneakers (curated + user-generated)
- Indexed for fast searches on brand, model, SKU, tags
- Full-text search enabled for instant results
- Supports 1M+ records with optimized queries

#### 2. **user_collections** - Personal Collections
- Links users to sneakers they own
- Tracks purchase details, condition, size
- Supports marketplace listings (is_for_sale flag)

#### 3. **posts** - Social Feed
- Instagram-like posts with images
- Links to sneakers in the database
- Automatic like/comment counting

#### 4. **profiles** - User Profiles
- Username, avatar, bio
- Collection statistics

### Storage

**Supabase Storage Buckets:**
- `sneaker-images` - User-uploaded sneaker photos
- Organized by user ID for easy management
- CDN-backed for fast global delivery
- Automatic image optimization

### Performance Optimizations

1. **Pagination**: 20 items per page to reduce load times
2. **Indexes**: Strategic indexes on frequently queried columns
3. **Full-Text Search**: PostgreSQL's built-in search for instant results
4. **Row Level Security**: Secure data access at the database level
5. **Caching**: Client-side caching of sneaker data

## Seeding the Database

The app includes 200+ curated sneakers (Jordan, Kobe, LeBron, Yeezy, Off-White, etc.) that can be seeded with one tap:

```typescript
import { seedDatabase } from '@/scripts/seedDatabase';

// Seed the database
const result = await seedDatabase();
console.log(`Seeded ${result.count} sneakers`);
```

## User-Generated Content

Users can add sneakers to the global database:

1. **Add Sneaker Form**: Complete form with SKU, brand, model, colorway, etc.
2. **Automatic Tagging**: User-generated sneakers are marked with a badge
3. **Verification Status**: Pending verification for quality control
4. **Community Database**: All users benefit from community additions

## Image Upload Flow

1. User selects/takes photo
2. Image is uploaded to Supabase Storage
3. Public URL is generated
4. URL is stored in database
5. Image is served via CDN

## Scaling to 1M+ Sneakers

### Database Optimizations

```sql
-- Indexes for fast queries
CREATE INDEX idx_sneakers_brand ON sneakers(brand);
CREATE INDEX idx_sneakers_popularity ON sneakers(popularity DESC);
CREATE INDEX idx_sneakers_tags ON sneakers USING GIN(tags);

-- Full-text search
CREATE INDEX idx_sneakers_search ON sneakers USING GIN(
  to_tsvector('english', brand || ' ' || model || ' ' || colorway)
);
```

### Query Optimization

```typescript
// Efficient pagination
const { data } = await supabase
  .from('sneakers')
  .select('*')
  .range(0, 19)  // First 20 items
  .order('popularity', { ascending: false });

// Filtered search with indexes
const { data } = await supabase
  .from('sneakers')
  .select('*')
  .eq('brand', 'Nike')  // Uses idx_sneakers_brand
  .gte('estimated_value', 500)
  .order('popularity', { ascending: false });
```

### Storage Optimization

- Images are compressed before upload (quality: 0.8)
- Organized by user ID for easy cleanup
- CDN caching for fast global delivery
- Automatic cleanup of unused images

## Real Sneaker Images

### Curated Sneakers
- Use high-quality Unsplash images
- Consistent aspect ratio (1:1)
- Professional product photography

### User-Generated
- Users upload their own photos
- Stored in Supabase Storage
- Automatic compression and optimization

## API Rate Limits

Supabase Free Tier:
- 500MB database
- 1GB file storage
- 2GB bandwidth/month
- 50,000 monthly active users

For production:
- Upgrade to Pro ($25/month)
- 8GB database
- 100GB file storage
- 250GB bandwidth/month
- Unlimited users

## Security

### Row Level Security (RLS)

```sql
-- Anyone can view sneakers
CREATE POLICY "Anyone can view sneakers" ON sneakers
  FOR SELECT USING (true);

-- Only authenticated users can add
CREATE POLICY "Authenticated users can add sneakers" ON sneakers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can only edit their own
CREATE POLICY "Users can update their own sneakers" ON sneakers
  FOR UPDATE USING (added_by = auth.uid());
```

### Storage Security

```sql
-- Users can upload to their own folder
CREATE POLICY "Users can upload to their folder"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'sneaker-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Monitoring

### Database Stats

```typescript
const stats = await getStats();
console.log({
  total: stats.total,           // Total sneakers
  curated: stats.curated,       // Curated sneakers
  userGenerated: stats.userGenerated,  // User-added
  brands: stats.brands,         // Unique brands
  categories: stats.categories  // Unique categories
});
```

### Performance Metrics

- Query response time: < 100ms
- Image load time: < 500ms (CDN)
- Search results: < 200ms
- Upload time: 1-3 seconds

## Future Enhancements

1. **Image Recognition**: Auto-detect sneaker from photo
2. **Price Tracking**: Real-time market value updates
3. **Verification System**: Community verification of sneakers
4. **Advanced Search**: Filter by size, condition, location
5. **Marketplace**: Built-in buying/selling platform
6. **XRP Integration**: Blockchain verification and payments

## Best Practices

1. **Always paginate**: Never load all records at once
2. **Use indexes**: Ensure queries use appropriate indexes
3. **Compress images**: Reduce storage and bandwidth costs
4. **Cache aggressively**: Cache frequently accessed data
5. **Monitor usage**: Track database and storage usage
6. **Clean up**: Remove unused images and data

## Support

For issues or questions:
- Check Supabase logs in the dashboard
- Review RLS policies for permission errors
- Monitor storage usage for upload issues
- Check network tab for API errors
