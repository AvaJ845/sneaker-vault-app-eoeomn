
export interface SneakerDrop {
  id: string;
  brand: string;
  model: string;
  colorway: string;
  imageUrl: string;
  releaseDate: string;
  price: number;
  retailer: 'SNKRS' | 'Adidas' | 'Foot Locker' | 'StockX' | 'GOAT' | 'Other';
  status: 'upcoming' | 'live' | 'sold-out' | 'restocking';
  raffleLink?: string;
  productLink?: string;
  isHyped: boolean;
  estimatedResaleValue?: number;
}

export interface BlockchainVerification {
  sneakerId: string;
  transactionHash: string;
  blockchainNetwork: 'XRP Ledger' | 'Ethereum' | 'Polygon';
  verificationDate: string;
  authenticityScore: number;
  verifiedBy: string;
  nftTokenId?: string;
  ownershipHistory: OwnershipRecord[];
}

export interface OwnershipRecord {
  ownerId: string;
  ownerName: string;
  acquiredDate: string;
  transferredDate?: string;
  transactionHash: string;
}
