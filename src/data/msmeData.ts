import { MSME, UserCoords } from '../types';

export const INITIAL_MSMES: MSME[] = [
  {
    id: 'msme-1',
    name: 'Warung Ketan Legendaris Coban',
    category: 'kuliner',
    lat: -7.8385,
    lng: 112.4782,
    address: 'Jl. Coban Rondo No. 12, Pujon',
    phone: '+62 812-3456-7890',
    openHours: '07:00 - 21:00 WIB',
    crowdStatus: 'sepi',
    crowdText: '🟢 Sepi (Tanpa Antre)',
    story: 'Berdiri sejak 1998, menyajikan ketan tradisional khas lereng pegunungan dengan taburan parutan kelapa gurih, susu kental manis, dan gula aren asli.',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 142,
    bonusCoins: 15,
    todayVisitors: 28,
    products: [
      { id: 'p1', name: 'Ketan Susu Gula Aren', price: 12000, description: 'Ketan pulen dengan parutan kelapa dan sirup aren hangat' },
      { id: 'p2', name: 'Ketan Durian Lumer Spesial', price: 20000, description: 'Topping vla durian asli Monthong lokal Pujon' },
      { id: 'p3', name: 'Wedang Ronde Jahe Emprit', price: 10000, description: 'Minuman penghangat khas pegunungan sejuk' }
    ],
    coinVouchers: [
      { id: 'v1', title: 'Voucher Potongan Rp 5.000', cost: 15, perk: 'Potongan Rp 5.000 min. belanja Rp 15.000', minSpend: 15000, discountValue: 5000 },
      { id: 'v1-b', title: 'Gratis Teh Hangat Rempah', cost: 10, perk: 'Gratis 1 gelas Teh Rempah Jahe hangat' }
    ]
  },
  {
    id: 'msme-2',
    name: 'Kerajinan Kayu Jati Pujon Indah',
    category: 'kerajinan',
    lat: -7.8402,
    lng: 112.4750,
    address: 'Desa Wisata Pandesari RT 04/RW 02, Pujon',
    phone: '+62 856-7890-1234',
    openHours: '08:30 - 17:30 WIB',
    crowdStatus: 'sepi',
    crowdText: '🟢 Sepi (Nyaman Santai)',
    story: 'Pusat kriya kayu sisa akar jati perhutani yang diukir langsung oleh perajin lokal desa dengan sentuhan seni estetis ramah lingkungan.',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 89,
    bonusCoins: 20,
    todayVisitors: 14,
    products: [
      { id: 'p4', name: 'Talenan Kayu Jati Minimalis', price: 45000, description: 'Kayu jati solid finishing food-grade beeswax alami' },
      { id: 'p5', name: 'Mangkok Buah Kayu Etnik', price: 85000, description: 'Diameter 22cm motif serat kayu alami elegan' },
      { id: 'p6', name: 'Set Sendok Garpu Kayu Mahoni', price: 25000, description: 'Set alat makan ramah lingkungan isi 3 pcs' }
    ],
    coinVouchers: [
      { id: 'v2', title: 'Diskon 15% Souvenir Kayu', cost: 25, perk: 'Diskon 15% semua kerajinan kayu tanpa minimum belanja' },
      { id: 'v2-b', title: 'Voucher Belanja Rp 15.000', cost: 35, perk: 'Potongan Rp 15.000 min. belanja Rp 75.000', minSpend: 75000, discountValue: 15000 }
    ]
  },
  {
    id: 'msme-3',
    name: 'Kopi Lesung Tradisional Desa',
    category: 'kopi',
    lat: -7.8420,
    lng: 112.4800,
    address: 'Sentra Kopi Pujon, Jl. Brantas No. 8',
    phone: '+62 821-4455-6677',
    openHours: '09:00 - 22:00 WIB',
    crowdStatus: 'sepi',
    crowdText: '🟢 Sepi (Sangat Tenang)',
    story: 'Menyangrai biji kopi lokal Robusta lereng Gunung Kawi dan Anjasmoro dengan cara tradisional ditumbuk lesung batu peninggalan leluhur.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 115,
    bonusCoins: 15,
    todayVisitors: 32,
    products: [
      { id: 'p7', name: 'Kopi Tubruk Lesung Hitam', price: 10000, description: 'Biji robusta sangrai medium-dark dengan crema pekat alami' },
      { id: 'p8', name: 'Es Kopi Susu Aren Pujon', price: 16000, description: 'Kopi robusta berpadu susu murni segar Pujon dan gula aren' },
      { id: 'p9', name: 'Biji Kopi Kemasan 250gr', price: 45000, description: 'Kopi sangrai asli petik merah petani desa' }
    ],
    coinVouchers: [
      { id: 'v3', title: 'Buy 1 Get 1 Kopi Tubruk', cost: 12, perk: 'Beli 1 Kopi Tubruk Gratis 1 cangkir kawan' },
      { id: 'v3-b', title: 'Diskon Rp 5.000 Kopi Kemasan', cost: 18, perk: 'Potongan Rp 5.000 untuk pembelian bubuk/biji 250gr' }
    ]
  },
  {
    id: 'msme-4',
    name: 'Susu Sapi Segar & Olahan KUD Karya Murni',
    category: 'kuliner',
    lat: -7.8350,
    lng: 112.4735,
    address: 'Jl. Raya Pujon KM 18, Pujon Lor',
    phone: '+62 813-9876-5432',
    openHours: '06:00 - 20:00 WIB',
    crowdStatus: 'sedang',
    crowdText: '🟡 Sedang (Sedikit Antre)',
    story: 'Dikelola oleh koperasi peternak sapi perah Pujon. Susu murni diperah setiap subuh dari peternak lereng bukit berketinggian 1.100 mdpl.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 310,
    bonusCoins: 10,
    todayVisitors: 88,
    products: [
      { id: 'p10', name: 'Susu Murni Pasteurisasi 1 Liter', price: 18000, description: 'Pilihan rasa original tawar atau manis alami' },
      { id: 'p11', name: 'Yogurt Buah Asli Stroberi Pujon', price: 15000, description: 'Fermentasi probiotik alami kaya nutrisi' },
      { id: 'p12', name: 'Permen Susu Karamel Tradisional', price: 12000, description: 'Oleh-oleh manis legendaris camilan anak' }
    ],
    coinVouchers: [
      { id: 'v4', title: 'Gratis 1 Cup Susu Hangat', cost: 15, perk: 'Gratis 1 cup susu hangat rasa cokelat/vanila' }
    ]
  },
  {
    id: 'msme-5',
    name: 'Oleh-Oleh Keripik Apel & Sayur Bu Nanik',
    category: 'oleh-oleh',
    lat: -7.8445,
    lng: 112.4720,
    address: 'Pusat Oleh-Oleh Pandesari No. 45',
    phone: '+62 878-1122-3344',
    openHours: '08:00 - 21:00 WIB',
    crowdStatus: 'sepi',
    crowdText: '🟢 Sepi (Belanja Tenang)',
    story: 'Memproduksi aneka keripik sayur dan buah khas Pujon-Batu dengan teknologi vacuum frying suhu rendah sehingga nutrisi tetap terjaga renyah.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 97,
    bonusCoins: 20,
    todayVisitors: 19,
    products: [
      { id: 'p13', name: 'Keripik Apel Manalagi Renyah 150gr', price: 22000, description: 'Rasa manis asam segar apel Batu pilihan' },
      { id: 'p14', name: 'Keripik Jamur Tiram Crispy', price: 18000, description: 'Gurih rempah bawang daun jeruk' },
      { id: 'p15', name: 'Keripik Wortel & Brokoli Sehat', price: 20000, description: 'Sayuran segar petani Pujon renyah alami' }
    ],
    coinVouchers: [
      { id: 'v5', title: 'Diskon Rp 10.000 Oleh-Oleh', cost: 20, perk: 'Potongan Rp 10.000 belanja min. Rp 50.000', minSpend: 50000, discountValue: 10000 }
    ]
  },
  {
    id: 'msme-6',
    name: 'Galeri Batik & Shibori Daun Pinus',
    category: 'kerajinan',
    lat: -7.8465,
    lng: 112.4775,
    address: 'Dusun Krajan, Belakang Balai Desa Pujon',
    phone: '+62 819-3344-5566',
    openHours: '09:00 - 17:00 WIB',
    crowdStatus: 'sepi',
    crowdText: '🟢 Sepi (Workshop Terbuka)',
    story: 'Komunitas ibu-ibu perajin batik ecoprint memanfaatkan dedaunan pinus dan tanaman liar hutan Coban Rondo sebagai pewarna alami ramah alam.',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 64,
    bonusCoins: 25,
    todayVisitors: 9,
    products: [
      { id: 'p16', name: 'Syal Ecoprint Sutra Daun Jati', price: 120000, description: 'Kain sutra serat alami dengan jejak daun organik unik' },
      { id: 'p17', name: 'Tote Bag Kanvas Shibori Indigo', price: 65000, description: 'Tas belanja modis pewarna tarum alami' },
      { id: 'p18', name: 'Pouch Serut Souvenir Cantik', price: 25000, description: 'Dompet kecil motif daun eksklusif' }
    ],
    coinVouchers: [
      { id: 'v6', title: 'Voucher Kelas Ecoprint Rp 25.000', cost: 30, perk: 'Potongan Rp 25.000 untuk paket workshop bikin karya sendiri', discountValue: 25000 },
      { id: 'v6-b', title: 'Diskon 10% Souvenir Kain', cost: 15, perk: 'Diskon 10% belanja kriya tekstil' }
    ]
  }
];

// Haversine formula to compute distance in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function estimateTravelTime(distanceKm: number): { walkingMin: number; drivingMin: number } {
  // Walking avg 4.5 km/h
  const walkingMin = Math.max(1, Math.round((distanceKm / 4.5) * 60));
  // Driving mountain road avg 25 km/h
  const drivingMin = Math.max(1, Math.round((distanceKm / 25) * 60));
  return { walkingMin, drivingMin };
}

// Pujon Center Default Coords (malang tourist district)
export const PUJON_DEFAULT_COORDS: UserCoords = {
  lat: -7.8375,
  lng: 112.4765,
  accuracy: 10
};
