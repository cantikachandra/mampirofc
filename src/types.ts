export type CrowdStatus = 'sepi' | 'sedang' | 'ramai';
export type Category = 'kuliner' | 'kerajinan' | 'kopi' | 'oleh-oleh' | 'wisata';

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface CoinVoucher {
  id: string;
  title: string;
  cost: number;
  perk: string;
  minSpend?: number;
  discountValue?: number;
}

export interface MSME {
  id: string;
  name: string;
  category: Category;
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  openHours?: string;
  crowdStatus: CrowdStatus;
  crowdText: string;
  distanceKm?: string;
  story: string;
  image: string;
  rating: number;
  reviewCount: number;
  products: Product[];
  coinVouchers: CoinVoucher[];
  bonusCoins?: number; // Extra coins given if user checks in while 'sepi'
  todayVisitors?: number;
}

export interface MyVoucher {
  id: string;
  code: string;
  title: string;
  msmeId: string;
  msmeName: string;
  perk: string;
  acquiredAt: string;
  isUsed: boolean;
}

export interface UserCoords {
  lat: number;
  lng: number;
  accuracy?: number;
  isCustom?: boolean;
}
