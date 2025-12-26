
# Collector-Focused Features Documentation

## Overview
This document outlines the advanced collector features implemented in Sneaker Vault, designed for serious sneaker collectors who need professional-grade tools to manage, protect, and grow their investments.

## 🎯 Core Features

### 1. Advanced Collection Tracking

#### Wear Count Tracking
- Track how many times each sneaker has been worn
- Visual indicator on collection cards showing wear count
- Increment/decrement controls in the enhanced detail modal
- Helps determine condition and resale value

#### Storage Location Management
- Record where each sneaker is stored (box number, shelf, storage unit)
- Quickly locate specific pairs in large collections
- Organize by location for inventory management

#### Maintenance Logs
- Record cleaning, sole swaps, repairs, and restorations
- Track costs associated with maintenance
- Before/after photo documentation
- Timeline view of all maintenance activities
- Helps maintain value and track investment in upkeep

#### Condition Rating Over Time
- Record condition changes (DS, VNDS, 9/10, 8/10, etc.)
- Historical timeline of condition ratings
- Photo documentation for each rating
- Track depreciation or preservation efforts

#### Size and Fit Notes
- Record how each sneaker fits (TTS, runs small, runs large)
- Personal fit preferences and sizing notes
- Helpful for future purchases and resale descriptions

#### Multi-Photo Gallery
- Upload multiple photos per sneaker:
  - Main product shot
  - Side view
  - Top view
  - Bottom/sole view
  - Box and packaging
  - Receipt/proof of purchase
  - UV light/blacklight photos (for authentication)
- Set primary photo for collection display
- Comprehensive visual documentation

### 2. Investment Analytics Dashboard

#### Portfolio Overview
- Total collection value
- Total investment (cost basis)
- Unrealized gains/losses
- Overall ROI percentage
- Item count

#### Performance Tracking
- **Top Performers**: Sneakers with highest ROI
- **Needs Attention**: Sneakers losing value
- Individual sneaker gain/loss tracking
- Historical performance data

#### Diversification Analysis
- **By Brand**: See which brands dominate your collection
- **By Category**: Basketball, Running, Lifestyle, etc.
- **By Year**: Release year distribution
- Visual charts showing percentage breakdowns
- Value distribution across categories

#### Time Range Filtering
- View analytics for different periods:
  - 1 Month
  - 3 Months
  - 6 Months
  - 1 Year
  - All Time

### 3. Authentication & Verification Suite

#### Document Management
- Upload and store authentication documents:
  - Purchase receipts
  - Invoices
  - Authentication certificates (StockX, GOAT, CheckCheck)
  - Legit check reports
- Track issuer and verification codes
- Batch number tracking
- Secure cloud storage via Supabase

#### Blockchain Verification
- Generate NFT certificates on XRP Ledger
- Immutable proof of ownership
- QR code linking to blockchain record
- Transfer verification with ownership
- Future-proof authentication

#### UV Light Documentation
- Special photo type for UV/blacklight verification
- Helps detect fakes and verify authenticity
- Professional-grade authentication tools

### 4. Wishlist & Grail Tracker

#### Priority System
- **Grail**: Holy grail sneakers (highest priority)
- **High**: Must-have sneakers
- **Medium**: Want but not urgent
- **Low**: Nice to have

#### Target Price Alerts
- Set target purchase price for each wishlist item
- Visual alerts when market price drops below target
- Track price trends over time
- Smart buying opportunities

#### Size Preferences
- Record preferred size for each wishlist item
- Helps when browsing marketplaces
- Ensures you don't miss the right size

#### Notes and Research
- Add personal notes about each wishlist item
- Research links and information
- Why you want it, what makes it special
- Collaboration history or significance

#### Grail Badges
- Special visual treatment for grail sneakers
- Star icon and "GRAIL" badge
- Quick toggle to mark/unmark as grail
- Filter view to see only grails

## 📊 Database Schema

### New Tables

#### `maintenance_logs`
```sql
- id (UUID, primary key)
- collection_item_id (foreign key to user_collections)
- user_id (foreign key to auth.users)
- maintenance_type (cleaning, sole_swap, repair, restoration)
- description (text)
- cost (numeric)
- performed_date (date)
- before_photos (text array)
- after_photos (text array)
- created_at (timestamp)
```

#### `condition_history`
```sql
- id (UUID, primary key)
- collection_item_id (foreign key to user_collections)
- user_id (foreign key to auth.users)
- condition_rating (text: DS, VNDS, 9/10, etc.)
- notes (text)
- photos (text array)
- recorded_date (date)
- created_at (timestamp)
```

#### `sneaker_photos`
```sql
- id (UUID, primary key)
- collection_item_id (foreign key to user_collections)
- user_id (foreign key to auth.users)
- photo_url (text)
- photo_type (main, side, top, bottom, box, receipt, uv_light)
- caption (text)
- is_primary (boolean)
- created_at (timestamp)
```

#### `authentication_documents`
```sql
- id (UUID, primary key)
- collection_item_id (foreign key to user_collections)
- user_id (foreign key to auth.users)
- document_type (receipt, invoice, authentication_cert, legit_check)
- document_url (text)
- issuer (text)
- verification_code (text)
- batch_number (text)
- notes (text)
- created_at (timestamp)
```

#### `wishlist`
```sql
- id (UUID, primary key)
- user_id (foreign key to auth.users)
- sneaker_id (foreign key to sneakers)
- priority (low, medium, high, grail)
- target_price (numeric)
- size_preference (text)
- notes (text)
- is_grail (boolean)
- added_at (timestamp)
```

#### `price_history`
```sql
- id (UUID, primary key)
- sneaker_id (foreign key to sneakers)
- price (numeric)
- source (stockx, goat, manual, estimated)
- size (text)
- recorded_date (date)
- created_at (timestamp)
```

### Enhanced `user_collections` Table
Added fields:
- `wear_count` (integer): Number of times worn
- `storage_location` (text): Where the sneaker is stored
- `fit_notes` (text): How the sneaker fits
- `cost_basis` (numeric): Actual cost including fees, shipping, etc.

## 🔐 Security & Privacy

### Row Level Security (RLS)
All new tables have RLS policies ensuring:
- Users can only view their own data
- Users can only modify their own data
- Price history is publicly readable (for market data)
- Authentication required for all write operations

### Data Encryption
- All photos stored in Supabase Storage with encryption
- Documents stored securely with access controls
- Sensitive data (prices, notes) protected by RLS

## 🚀 Usage Guide

### Adding a Sneaker to Collection
1. Browse the Database tab
2. Find a sneaker and tap "Add to Collection"
3. Fill in purchase details (price, date, size, condition)
4. Optionally add photos and documents
5. Save to your collection

### Tracking Wear and Maintenance
1. Open a sneaker from your collection
2. Navigate to the "Tracking" tab
3. Update wear count after each wear
4. Add maintenance logs when cleaning or repairing
5. Record condition changes over time

### Managing Your Wishlist
1. Browse the Database tab
2. Tap the star icon on any sneaker to add to wishlist
3. Set priority level and target price
4. Mark special sneakers as "Grails"
5. Get notified when prices drop below target

### Viewing Analytics
1. Navigate to the Analytics tab
2. View portfolio overview and performance
3. Check top and worst performers
4. Analyze diversification by brand/category
5. Adjust time range for different insights

## 📱 Navigation

### New Tabs
- **Analytics**: Investment dashboard and performance tracking
- **Wishlist**: Grail tracker and target price monitoring

### Enhanced Tabs
- **Collection (Vault)**: Now shows wear count badges
- **Database**: Add to wishlist functionality

### Enhanced Modals
- **EnhancedSneakerDetailModal**: 5 tabs for comprehensive tracking
  - Overview: Basic info and value
  - Tracking: Wear count, storage, fit notes
  - Photos: Multi-photo gallery
  - Verification: Documents and blockchain
  - Maintenance: Service history

## 🎨 UI/UX Highlights

### Visual Indicators
- Wear count badges on collection cards
- Grail star badges on wishlist items
- Priority color coding (grail=gold, high=red, medium=blue, low=gray)
- Price alert badges when under target
- Verified checkmarks for authenticated items

### Smooth Interactions
- Tab navigation in detail modal
- Increment/decrement controls for wear count
- Photo upload with preview
- Timeline views for history
- Pull-to-refresh on all lists

### Empty States
- Helpful messages when collections/wishlists are empty
- Call-to-action buttons to browse database
- Icons and descriptive text

## 🔮 Future Enhancements

### Planned Features
1. **Market Price Integration**
   - Real-time pricing from StockX/GOAT APIs
   - Automatic price history updates
   - Price drop notifications

2. **Advanced Analytics**
   - Portfolio value charts over time
   - Predictive analytics for value trends
   - Comparison with market averages

3. **Social Features**
   - Share collection stats
   - Compare portfolios with friends
   - Leaderboards for top collectors

4. **Export & Reporting**
   - PDF collection reports
   - CSV export for insurance
   - Tax documentation

5. **AI-Powered Features**
   - Automatic authentication via photo analysis
   - Price prediction models
   - Personalized recommendations

## 📞 Support

For issues or questions about collector features:
1. Check the in-app help section
2. Visit the Sneaker Vault community forum
3. Contact support@sneakervault.com

## 🏆 Best Practices

### For Serious Collectors
1. **Document Everything**: Take photos immediately upon purchase
2. **Track Costs Accurately**: Include all fees and shipping in cost basis
3. **Regular Maintenance**: Log all cleaning and repairs
4. **Condition Monitoring**: Record condition quarterly
5. **Storage Organization**: Use consistent location naming
6. **Wishlist Management**: Set realistic target prices
7. **Authentication**: Upload receipts and certificates immediately

### For Investment Tracking
1. **Use Cost Basis**: More accurate than purchase price alone
2. **Monitor Analytics**: Check dashboard weekly
3. **Diversify**: Track diversification metrics
4. **Set Goals**: Use target prices strategically
5. **Review Performance**: Identify trends in your collection

---

**Built with ❤️ by AvaResearchLLC**
**Track. Showcase. Connect.**
