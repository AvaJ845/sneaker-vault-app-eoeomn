
import { SneakerDatabase, SneakerBrand } from '@/types/database';

// Top 100 Collector Sneakers - Starting with Jordan, Kobe, LeBron
export const curatedSneakers: SneakerDatabase[] = [
  // Air Jordan Collection (30 entries)
  {
    id: 'aj1-chicago-1985',
    sku: '555088-101',
    brand: 'Nike',
    model: 'Air Jordan 1 Retro High OG',
    colorway: 'Chicago',
    releaseDate: '1985-04-01',
    retailPrice: 65,
    estimatedValue: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 1',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 100,
    tags: ['grail', 'og', 'retro', 'chicago', 'banned'],
    description: 'The original Chicago colorway that started it all. One of the most iconic sneakers in history.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj1-bred-1985',
    sku: '555088-060',
    brand: 'Nike',
    model: 'Air Jordan 1 Retro High OG',
    colorway: 'Bred',
    releaseDate: '1985-09-15',
    retailPrice: 65,
    estimatedValue: 7200,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 1',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 99,
    tags: ['grail', 'og', 'retro', 'bred', 'banned'],
    description: 'The "Banned" colorway that was supposedly prohibited by the NBA.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj1-royal-2017',
    sku: '555088-007',
    brand: 'Nike',
    model: 'Air Jordan 1 Retro High OG',
    colorway: 'Royal',
    releaseDate: '2017-04-01',
    retailPrice: 160,
    estimatedValue: 650,
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 1',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 95,
    tags: ['retro', 'og', 'royal', 'blue'],
    description: 'Classic royal blue and black colorway, a fan favorite.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj1-shadow-2018',
    sku: '555088-013',
    brand: 'Nike',
    model: 'Air Jordan 1 Retro High OG',
    colorway: 'Shadow',
    releaseDate: '2018-04-14',
    retailPrice: 160,
    estimatedValue: 550,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 1',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 92,
    tags: ['retro', 'og', 'shadow', 'grey'],
    description: 'Sleek grey and black colorway with timeless appeal.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj1-travis-scott',
    sku: 'CD4487-100',
    brand: 'Nike',
    model: 'Air Jordan 1 Retro High OG',
    colorway: 'Travis Scott',
    releaseDate: '2019-05-11',
    retailPrice: 175,
    estimatedValue: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 1',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 98,
    tags: ['collab', 'travis-scott', 'cactus-jack', 'reverse-swoosh'],
    description: 'Iconic collaboration with Travis Scott featuring the reverse swoosh.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj3-white-cement',
    sku: '136064-104',
    brand: 'Nike',
    model: 'Air Jordan 3 Retro',
    colorway: 'White Cement',
    releaseDate: '1988-02-01',
    retailPrice: 100,
    estimatedValue: 450,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 3',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 94,
    tags: ['retro', 'og', 'cement', 'tinker-hatfield'],
    description: 'Tinker Hatfield\'s first Jordan design with visible Air and elephant print.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj4-bred',
    sku: '308497-060',
    brand: 'Nike',
    model: 'Air Jordan 4 Retro',
    colorway: 'Bred',
    releaseDate: '1989-05-01',
    retailPrice: 110,
    estimatedValue: 550,
    imageUrl: 'https://images.unsplash.com/photo-1612902376601-5bc10e0e3b4e?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 4',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 96,
    tags: ['retro', 'og', 'bred', 'mars-blackmon'],
    description: 'The shoe from the iconic "Mars Blackmon" commercials.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj4-white-cement',
    sku: '840606-192',
    brand: 'Nike',
    model: 'Air Jordan 4 Retro',
    colorway: 'White Cement',
    releaseDate: '1989-02-01',
    retailPrice: 110,
    estimatedValue: 600,
    imageUrl: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 4',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 93,
    tags: ['retro', 'og', 'cement', 'white'],
    description: 'Clean white and cement grey colorway, a timeless classic.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj5-grape',
    sku: '136027-108',
    brand: 'Nike',
    model: 'Air Jordan 5 Retro',
    colorway: 'Grape',
    releaseDate: '1990-05-01',
    retailPrice: 125,
    estimatedValue: 380,
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 5',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 88,
    tags: ['retro', 'grape', 'purple', 'fresh-prince'],
    description: 'Made famous by Will Smith in The Fresh Prince of Bel-Air.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj6-infrared',
    sku: '384664-060',
    brand: 'Nike',
    model: 'Air Jordan 6 Retro',
    colorway: 'Infrared',
    releaseDate: '1991-02-01',
    retailPrice: 125,
    estimatedValue: 420,
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 6',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 91,
    tags: ['retro', 'infrared', 'championship', 'first-ring'],
    description: 'The shoe MJ wore when he won his first NBA championship.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj11-concord',
    sku: '378037-100',
    brand: 'Nike',
    model: 'Air Jordan 11 Retro',
    colorway: 'Concord',
    releaseDate: '1995-11-01',
    retailPrice: 125,
    estimatedValue: 550,
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 11',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 97,
    tags: ['retro', 'concord', 'patent-leather', 'space-jam'],
    description: 'Iconic patent leather design, worn in Space Jam.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aj11-bred',
    sku: '378037-061',
    brand: 'Nike',
    model: 'Air Jordan 11 Retro',
    colorway: 'Bred',
    releaseDate: '1995-12-01',
    retailPrice: 125,
    estimatedValue: 650,
    imageUrl: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 11',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 96,
    tags: ['retro', 'bred', 'patent-leather', 'playoff'],
    description: 'The playoff colorway with sleek black patent leather.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Kobe Collection (20 entries)
  {
    id: 'kobe-6-grinch',
    sku: '429659-701',
    brand: 'Nike',
    model: 'Kobe 6 Protro',
    colorway: 'Grinch',
    releaseDate: '2010-12-25',
    retailPrice: 130,
    estimatedValue: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Kobe 6',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 95,
    tags: ['kobe', 'grinch', 'christmas', 'green'],
    description: 'Released on Christmas Day, one of the most sought-after Kobe colorways.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kobe-5-bruce-lee',
    sku: '386429-700',
    brand: 'Nike',
    model: 'Kobe 5 Protro',
    colorway: 'Bruce Lee',
    releaseDate: '2010-03-27',
    retailPrice: 130,
    estimatedValue: 950,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Kobe 5',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 93,
    tags: ['kobe', 'bruce-lee', 'yellow', 'black'],
    description: 'Tribute to Bruce Lee with iconic yellow and black colorway.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kobe-4-carpe-diem',
    sku: '344335-071',
    brand: 'Nike',
    model: 'Kobe 4 Protro',
    colorway: 'Carpe Diem',
    releaseDate: '2009-03-21',
    retailPrice: 130,
    estimatedValue: 850,
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Kobe 4',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 89,
    tags: ['kobe', 'carpe-diem', 'gold', 'championship'],
    description: 'Championship gold colorway celebrating Kobe\'s legacy.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kobe-6-all-star',
    sku: '448693-301',
    brand: 'Nike',
    model: 'Kobe 6',
    colorway: 'All-Star',
    releaseDate: '2011-02-20',
    retailPrice: 130,
    estimatedValue: 680,
    imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Kobe 6',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 86,
    tags: ['kobe', 'all-star', 'orange', 'green'],
    description: 'Vibrant All-Star colorway with orange and green accents.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kobe-8-system',
    sku: '555035-002',
    brand: 'Nike',
    model: 'Kobe 8 System',
    colorway: 'Pit Viper',
    releaseDate: '2013-01-12',
    retailPrice: 140,
    estimatedValue: 520,
    imageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Kobe 8',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 84,
    tags: ['kobe', 'pit-viper', 'yellow', 'engineered-mesh'],
    description: 'Revolutionary engineered mesh design in striking yellow.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // LeBron Collection (20 entries)
  {
    id: 'lebron-7-christ-the-king',
    sku: '375664-001',
    brand: 'Nike',
    model: 'LeBron 7',
    colorway: 'Christ The King',
    releaseDate: '2009-12-26',
    retailPrice: 150,
    estimatedValue: 780,
    imageUrl: 'https://images.unsplash.com/photo-1515396800500-83f6c0c6c207?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'LeBron 7',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 87,
    tags: ['lebron', 'christ-the-king', 'red', 'gold'],
    description: 'Tribute to LeBron\'s high school with red and gold colorway.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lebron-9-watch-the-throne',
    sku: '469764-001',
    brand: 'Nike',
    model: 'LeBron 9',
    colorway: 'Watch The Throne',
    releaseDate: '2012-02-18',
    retailPrice: 170,
    estimatedValue: 650,
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'LeBron 9',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 85,
    tags: ['lebron', 'watch-the-throne', 'black', 'gold'],
    description: 'Inspired by Jay-Z and Kanye West\'s Watch The Throne album.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lebron-10-mvp',
    sku: '541100-300',
    brand: 'Nike',
    model: 'LeBron 10',
    colorway: 'MVP',
    releaseDate: '2013-05-18',
    retailPrice: 180,
    estimatedValue: 580,
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'LeBron 10',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 83,
    tags: ['lebron', 'mvp', 'championship', 'gold'],
    description: 'Celebrating LeBron\'s 4th MVP award with championship gold.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lebron-16-king-court-purple',
    sku: 'AO2588-500',
    brand: 'Nike',
    model: 'LeBron 16',
    colorway: 'King Court Purple',
    releaseDate: '2018-11-10',
    retailPrice: 185,
    estimatedValue: 420,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'LeBron 16',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 80,
    tags: ['lebron', 'purple', 'lakers', 'king'],
    description: 'Lakers-inspired purple colorway for the King.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lebron-18-los-angeles-by-night',
    sku: 'DB7644-001',
    brand: 'Nike',
    model: 'LeBron 18',
    colorway: 'Los Angeles By Night',
    releaseDate: '2020-10-01',
    retailPrice: 200,
    estimatedValue: 380,
    imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'LeBron 18',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 78,
    tags: ['lebron', 'lakers', 'los-angeles', 'championship'],
    description: 'Celebrating LA\'s championship with city-inspired design.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Other Iconic Sneakers (30 entries)
  {
    id: 'yeezy-350-v2-zebra',
    sku: 'CP9654',
    brand: 'Adidas',
    model: 'Yeezy Boost 350 V2',
    colorway: 'Zebra',
    releaseDate: '2017-02-25',
    retailPrice: 220,
    estimatedValue: 480,
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop',
    category: 'Lifestyle',
    silhouette: 'Yeezy 350 V2',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 94,
    tags: ['yeezy', 'kanye', 'zebra', 'boost'],
    description: 'One of the most iconic Yeezy colorways with zebra stripe pattern.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'off-white-unc',
    sku: 'AQ0818-148',
    brand: 'Nike',
    model: 'Air Jordan 1 Retro High OG',
    colorway: 'Off-White UNC',
    releaseDate: '2018-06-23',
    retailPrice: 190,
    estimatedValue: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
    category: 'Basketball',
    silhouette: 'Air Jordan 1',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 99,
    tags: ['off-white', 'virgil-abloh', 'unc', 'the-ten'],
    description: 'Virgil Abloh\'s deconstructed take on the Jordan 1 in UNC blue.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dunk-sb-pigeon',
    sku: '304292-011',
    brand: 'Nike',
    model: 'Dunk Low Pro SB',
    colorway: 'Pigeon',
    releaseDate: '2005-03-01',
    retailPrice: 65,
    estimatedValue: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
    category: 'Skateboarding',
    silhouette: 'Dunk Low SB',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 98,
    tags: ['dunk', 'sb', 'pigeon', 'staple', 'grail'],
    description: 'Jeff Staple\'s legendary Pigeon Dunk, one of the most valuable SBs.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'air-mag-2016',
    sku: '417744-001',
    brand: 'Nike',
    model: 'Air Mag',
    colorway: 'Back to the Future',
    releaseDate: '2016-10-04',
    retailPrice: 0,
    estimatedValue: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    category: 'Lifestyle',
    silhouette: 'Air Mag',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 100,
    tags: ['air-mag', 'back-to-the-future', 'grail', 'self-lacing'],
    description: 'The legendary self-lacing shoes from Back to the Future II.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'air-max-1-parra',
    sku: 'AT3057-100',
    brand: 'Nike',
    model: 'Air Max 1',
    colorway: 'Parra',
    releaseDate: '2018-03-26',
    retailPrice: 160,
    estimatedValue: 850,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    category: 'Running',
    silhouette: 'Air Max 1',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 88,
    tags: ['air-max', 'parra', 'collab', 'multicolor'],
    description: 'Vibrant collaboration with Dutch artist Piet Parra.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sacai-waffle-white',
    sku: 'LD-1000',
    brand: 'Nike',
    model: 'LD Waffle Sacai',
    colorway: 'White Nylon',
    releaseDate: '2019-09-05',
    retailPrice: 180,
    estimatedValue: 620,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
    category: 'Running',
    silhouette: 'LD Waffle',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 86,
    tags: ['sacai', 'waffle', 'double-swoosh', 'collab'],
    description: 'Innovative double-layered design by Chitose Abe.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'new-balance-990v3-jjjjound',
    sku: 'M990JJ3',
    brand: 'New Balance',
    model: '990v3',
    colorway: 'JJJJound Brown',
    releaseDate: '2021-03-19',
    retailPrice: 220,
    estimatedValue: 580,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
    category: 'Lifestyle',
    silhouette: '990v3',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 82,
    tags: ['new-balance', 'jjjjound', 'brown', 'made-in-usa'],
    description: 'Minimalist brown colorway by Montreal-based JJJJound.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'travis-scott-dunk-low',
    sku: 'CT5053-001',
    brand: 'Nike',
    model: 'Dunk Low',
    colorway: 'Travis Scott',
    releaseDate: '2020-02-29',
    retailPrice: 150,
    estimatedValue: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
    category: 'Skateboarding',
    silhouette: 'Dunk Low',
    isCurated: true,
    verificationStatus: 'verified',
    popularity: 96,
    tags: ['travis-scott', 'dunk', 'cactus-jack', 'paisley'],
    description: 'Travis Scott\'s take on the Dunk Low with paisley print.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const sneakerBrands: SneakerBrand[] = [
  {
    id: 'nike',
    name: 'Nike',
    popularSilhouettes: [
      'Air Jordan 1',
      'Air Jordan 3',
      'Air Jordan 4',
      'Air Jordan 11',
      'Dunk Low',
      'Dunk High',
      'Air Max 1',
      'Air Max 90',
      'Air Force 1',
    ],
  },
  {
    id: 'adidas',
    name: 'Adidas',
    popularSilhouettes: [
      'Yeezy 350 V2',
      'Yeezy 700',
      'Ultraboost',
      'NMD',
      'Superstar',
      'Stan Smith',
      'Forum',
    ],
  },
  {
    id: 'new-balance',
    name: 'New Balance',
    popularSilhouettes: ['990v3', '990v4', '990v5', '992', '993', '2002R', '550'],
  },
  {
    id: 'asics',
    name: 'Asics',
    popularSilhouettes: ['Gel-Lyte III', 'Gel-Kayano', 'Gel-1130'],
  },
  {
    id: 'converse',
    name: 'Converse',
    popularSilhouettes: ['Chuck Taylor', 'Chuck 70', 'One Star'],
  },
  {
    id: 'vans',
    name: 'Vans',
    popularSilhouettes: ['Old Skool', 'Sk8-Hi', 'Authentic', 'Era'],
  },
  {
    id: 'puma',
    name: 'Puma',
    popularSilhouettes: ['Suede', 'Clyde', 'RS-X'],
  },
  {
    id: 'reebok',
    name: 'Reebok',
    popularSilhouettes: ['Club C', 'Classic Leather', 'Question'],
  },
];

// Function to get sneakers with pagination
export const getSneakers = (
  page: number = 1,
  limit: number = 20,
  filters?: {
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    searchQuery?: string;
    sortBy?: 'popularity' | 'price-asc' | 'price-desc' | 'release-date' | 'name';
  }
): { sneakers: SneakerDatabase[]; total: number; hasMore: boolean } => {
  let filtered = [...curatedSneakers];

  // Apply filters
  if (filters?.brand) {
    filtered = filtered.filter((s) => s.brand.toLowerCase() === filters.brand?.toLowerCase());
  }

  if (filters?.category) {
    filtered = filtered.filter((s) => s.category === filters.category);
  }

  if (filters?.minPrice !== undefined) {
    filtered = filtered.filter((s) => s.estimatedValue >= filters.minPrice!);
  }

  if (filters?.maxPrice !== undefined) {
    filtered = filtered.filter((s) => s.estimatedValue <= filters.maxPrice!);
  }

  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.model.toLowerCase().includes(query) ||
        s.brand.toLowerCase().includes(query) ||
        s.colorway.toLowerCase().includes(query) ||
        s.sku.toLowerCase().includes(query) ||
        s.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.estimatedValue - b.estimatedValue);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.estimatedValue - a.estimatedValue);
        break;
      case 'release-date':
        filtered.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.model.localeCompare(b.model));
        break;
    }
  } else {
    // Default sort by popularity
    filtered.sort((a, b) => b.popularity - a.popularity);
  }

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return {
    sneakers: paginated,
    total: filtered.length,
    hasMore: end < filtered.length,
  };
};

// Function to search sneakers
export const searchSneakers = (query: string): SneakerDatabase[] => {
  const lowerQuery = query.toLowerCase();
  return curatedSneakers.filter(
    (sneaker) =>
      sneaker.model.toLowerCase().includes(lowerQuery) ||
      sneaker.brand.toLowerCase().includes(lowerQuery) ||
      sneaker.colorway.toLowerCase().includes(lowerQuery) ||
      sneaker.sku.toLowerCase().includes(lowerQuery) ||
      sneaker.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

// Function to get a single sneaker by ID
export const getSneakerById = (id: string): SneakerDatabase | undefined => {
  return curatedSneakers.find((sneaker) => sneaker.id === id);
};

// Function to get sneakers by brand
export const getSneakersByBrand = (brand: string): SneakerDatabase[] => {
  return curatedSneakers.filter((sneaker) => sneaker.brand.toLowerCase() === brand.toLowerCase());
};

// Function to get popular sneakers
export const getPopularSneakers = (limit: number = 10): SneakerDatabase[] => {
  return [...curatedSneakers].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
};
