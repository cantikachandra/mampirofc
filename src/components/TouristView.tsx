import React, { useState, useMemo } from 'react';
import { MSME, UserCoords, MyVoucher, Category, CoinVoucher } from '../types';
import InteractiveMap from './InteractiveMap';
import { 
  LocateFixed, Coins, Route, Ticket, QrCode, Search, Filter, 
  ExternalLink, Sparkles, Clock, Phone, MapPin, ChevronRight,
  Coffee, Utensils, Hammer, ShoppingBag, Check, Copy
} from 'lucide-react';
import { formatRupiah, estimateTravelTime, PUJON_DEFAULT_COORDS } from '../data/msmeData';
import confetti from 'canvas-confetti';

interface TouristViewProps {
  userCoords: UserCoords;
  requestGps: () => void;
  gpsLoading: boolean;
  setUserCoords: React.Dispatch<React.SetStateAction<UserCoords>>;
  coinBalance: number;
  setCoinBalance: React.Dispatch<React.SetStateAction<number>>;
  myVouchers: MyVoucher[];
  setMyVouchers: React.Dispatch<React.SetStateAction<MyVoucher[]>>;
  onOpenCheckIn: (msme: MSME) => void;
  showToast: (msg: string) => void;
  msmes: MSME[];
}

export default function TouristView({
  userCoords,
  requestGps,
  gpsLoading,
  setUserCoords,
  coinBalance,
  setCoinBalance,
  myVouchers,
  setMyVouchers,
  onOpenCheckIn,
  showToast,
  msmes
}: TouristViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [onlySepi, setOnlySepi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMsmeId, setSelectedMsmeId] = useState<string | null>(msmes[0]?.id || null);
  const [activeBarcodeModal, setActiveBarcodeModal] = useState<MyVoucher | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filtered MSMEs
  const filteredMsmes = useMemo(() => {
    return msmes.filter((m) => {
      const matchCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const matchSepi = !onlySepi || m.crowdStatus === 'sepi';
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.products.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSepi && matchSearch;
    });
  }, [msmes, selectedCategory, onlySepi, searchQuery]);

  const selectedMsme = useMemo(() => {
    return msmes.find((m) => m.id === selectedMsmeId) || msmes[0];
  }, [msmes, selectedMsmeId]);

  // Redeem Voucher Action
  const redeemVoucher = (v: CoinVoucher, msme: MSME) => {
    if (coinBalance < v.cost) {
      showToast('Koin Anda tidak cukup untuk voucher ini!');
      return;
    }
    setCoinBalance((prev) => prev - v.cost);
    const newVoucher: MyVoucher = {
      id: 'v-' + Date.now(),
      title: v.title,
      msmeId: msme.id,
      msmeName: msme.name,
      perk: v.perk,
      code: `MAMPIR-${Math.floor(1000 + Math.random() * 9000)}`,
      acquiredAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isUsed: false
    };
    setMyVouchers((prev) => [newVoucher, ...prev]);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    showToast(`Voucher ${v.title} berhasil ditukar!`);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
    showToast(`Kode ${code} disalin ke clipboard!`);
  };

  const selectedTravel = estimateTravelTime(parseFloat(selectedMsme?.distanceKm || '1.0'));

  return (
    <div className="space-y-6 pb-12">
      {/* 1. GPS Status & Balance Card */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={requestGps}
            title="Deteksi Lokasi GPS Asli Anda"
            className="p-3 bg-[#1F2A6B] text-white rounded-2xl hover:bg-[#161f4f] transition shadow-md flex items-center justify-center"
          >
            <LocateFixed className={`w-5 h-5 ${gpsLoading ? 'animate-spin' : ''}`} />
          </button>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wide">
                GPS Terhubung {userCoords.isCustom ? '(Simulasi Peta)' : '(Perangkat)'}
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-slate-800">
              {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick preset to Pujon Center */}
          <button
            onClick={() => setUserCoords(PUJON_DEFAULT_COORDS)}
            className="text-[11px] font-bold text-[#1F2A6B] bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-2xl transition border border-slate-200"
          >
            Titik Wisata Pujon
          </button>

          {/* Coin Wallet Badge */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-2 rounded-2xl border border-amber-300 shadow-sm">
            <Coins className="w-5 h-5 text-[#E8A317]" />
            <div>
              <span className="text-[10px] text-amber-900 font-bold block uppercase leading-none">Dompet Koin</span>
              <span className="text-sm font-black text-[#1F2A6B]">{coinBalance} Koin</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Map Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#1B7A68]/10 text-[#1B7A68] rounded-xl">
              <Route className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Peta Wisata & Rute Garis Loop UMKM
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {filteredMsmes.length} UMKM terdeteksi
          </span>
        </div>

        {/* Live Leaflet Map */}
        <InteractiveMap
          userCoords={userCoords}
          msmes={filteredMsmes}
          selectedMsmeId={selectedMsmeId}
          onSelectMsme={(m) => setSelectedMsmeId(m.id)}
          onCheckInMsme={(m) => onOpenCheckIn(m)}
          onUpdateUserCoords={(coords) => setUserCoords(coords)}
        />
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ketan, susu, kopi, kerajinan, oleh-oleh..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F2A6B]"
            />
          </div>

          <button
            onClick={() => setOnlySepi(!onlySepi)}
            className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 border ${
              onlySepi
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8A317]" />
            <span>Hanya Sepi (+Koin)</span>
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'Semua Kategori', icon: '✨' },
            { id: 'kuliner', label: 'Kuliner', icon: '🍲' },
            { id: 'kopi', label: 'Kopi Tradisional', icon: '☕' },
            { id: 'kerajinan', label: 'Kriya & Kayu', icon: '🪵' },
            { id: 'oleh-oleh', label: 'Oleh-Oleh', icon: '🛍️' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center space-x-1 border ${
                selectedCategory === cat.id
                  ? 'bg-[#1F2A6B] text-white border-[#1F2A6B] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Selected MSME Spotlight Card */}
      {selectedMsme && (
        <div className="bg-white rounded-3xl p-5 border-2 border-[#1F2A6B]/20 shadow-lg space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="relative w-full sm:w-44 h-36 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
              <img
                src={selectedMsme.image}
                alt={selectedMsme.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {selectedMsme.crowdText}
              </span>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-[#1F2A6B] leading-tight">
                    {selectedMsme.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{selectedMsme.address}</span>
                  </p>
                </div>
                <div className="bg-[#E8A317]/15 text-[#1F2A6B] px-2.5 py-1 rounded-xl text-xs font-black">
                  ⭐ {selectedMsme.rating} ({selectedMsme.reviewCount})
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {selectedMsme.story}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="bg-emerald-50 text-emerald-800 text-[11px] font-extrabold px-2.5 py-1 rounded-xl border border-emerald-200">
                  📍 {selectedMsme.distanceKm} km dari GPS Anda
                </div>
                <div className="text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                  🚶 ~{selectedTravel.walkingMin} mnt • 🛵 ~{selectedTravel.drivingMin} mnt
                </div>
                {selectedMsme.openHours && (
                  <div className="text-[11px] text-slate-500 flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-xl">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{selectedMsme.openHours}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons for Selected */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => onOpenCheckIn(selectedMsme)}
                  className="bg-[#1F2A6B] hover:bg-[#161f4f] text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md shadow-[#1F2A6B]/20 transition"
                >
                  <QrCode className="w-4 h-4 text-[#E8A317]" />
                  <span>Check-in Lokasi (+{selectedMsme.bonusCoins || 10} Koin)</span>
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${selectedMsme.lat},${selectedMsme.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Buka Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Featured Products */}
          {selectedMsme.products.length > 0 && (
            <div className="border-t border-slate-100 pt-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Produk & Menu Andalan
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {selectedMsme.products.map((p) => (
                  <div key={p.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-xs">
                    <p className="font-bold text-slate-800">{p.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                    <p className="text-xs font-black text-[#1F2A6B] mt-1">{formatRupiah(p.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Coin Voucher Exchange Section */}
      <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 p-5 rounded-3xl border border-amber-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#E8A317] text-[#1F2A6B] rounded-xl">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#1F2A6B] text-sm">
                Tukarkan Koin MAMPIR di UMKM Sepi
              </h3>
              <p className="text-[11px] text-slate-600">
                Pariwisata adil: Wisatawan dapat diskon, UMKM sepi dapat kunjungan pembeli
              </p>
            </div>
          </div>
          <span className="bg-[#E8A317] text-[#1F2A6B] px-3 py-1 rounded-full text-xs font-black">
            {coinBalance} Koin Anda
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {msmes.map((m) => (
            <div
              key={m.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#1F2A6B]/40 transition space-y-2.5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {m.crowdText}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs mt-1">{m.name}</h4>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                  {m.distanceKm} km
                </span>
              </div>

              <div className="space-y-1.5">
                {m.coinVouchers.map((v) => (
                  <div
                    key={v.id}
                    className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-800 truncate">{v.title}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{v.perk}</p>
                    </div>
                    <button
                      onClick={() => redeemVoucher(v, m)}
                      className={`px-3 py-1.5 rounded-xl font-black text-[11px] whitespace-nowrap transition flex items-center space-x-1 ${
                        coinBalance >= v.cost
                          ? 'bg-[#1F2A6B] hover:bg-[#161f4f] text-white shadow-sm'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3 h-3 text-[#E8A317]" />
                      <span>{v.cost} Koin</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. My Active Vouchers Drawer */}
      {myVouchers.length > 0 && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs uppercase text-slate-500 flex items-center space-x-1.5 tracking-wider">
              <Ticket className="w-4 h-4 text-emerald-600" />
              <span>Voucher Saya Tersimpan ({myVouchers.length})</span>
            </h4>
            <span className="text-[10px] text-slate-400">Tunjukkan barcode ke kasir toko</span>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {myVouchers.map((v) => (
              <div
                key={v.id}
                className="bg-gradient-to-r from-emerald-50/80 to-white border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between shadow-xs"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] text-emerald-800 font-bold block">{v.msmeName}</span>
                  <p className="font-extrabold text-slate-900 text-xs">{v.title}</p>
                  <p className="text-[10px] text-slate-500">{v.perk}</p>
                  <p className="text-[9px] text-slate-400 mt-1">Diperoleh: {v.acquiredAt}</p>
                </div>

                <div className="text-right space-y-1.5">
                  <div
                    onClick={() => handleCopyCode(v.code)}
                    className="font-mono font-black text-xs bg-white text-[#1F2A6B] px-2.5 py-1 rounded-xl border border-emerald-300 shadow-inner flex items-center space-x-1 cursor-pointer hover:bg-emerald-50"
                    title="Klik untuk salin kode"
                  >
                    <span>{v.code}</span>
                    {copiedCode === v.code ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </div>

                  <button
                    onClick={() => setActiveBarcodeModal(v)}
                    className="text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg block w-full transition"
                  >
                    Buka Kasir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Full MSME List */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-slate-900 text-sm">
          Semua Titik UMKM Wisata Pujon ({filteredMsmes.length})
        </h3>
        <div className="space-y-3">
          {filteredMsmes.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMsmeId(m.id)}
              className={`bg-white p-4 rounded-3xl border transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                selectedMsmeId === m.id
                  ? 'border-[#1F2A6B] shadow-md ring-2 ring-[#1F2A6B]/20'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-100"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                      {m.crowdText}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      ⭐ {m.rating}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{m.name}</h4>
                  <p className="text-xs text-slate-500">{m.address} • <span className="font-bold text-emerald-700">{m.distanceKm} km</span></p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMsmeId(m.id);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-[#1F2A6B] bg-slate-100 hover:bg-slate-200 transition"
                >
                  Fokus Peta
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCheckIn(m);
                  }}
                  className="bg-[#1F2A6B] hover:bg-[#161f4f] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#E8A317]" />
                  <span>Check-in</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barcode Cashier Modal */}
      {activeBarcodeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center relative animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-slate-900 text-base">Tunjukkan ke Kasir UMKM</h3>
            <p className="text-xs text-slate-500">{activeBarcodeModal.msmeName}</p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <p className="font-bold text-xs text-emerald-800">{activeBarcodeModal.title}</p>
              
              {/* Simulated Barcode */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                <div className="h-14 w-full flex items-center justify-center space-x-1">
                  {[4, 2, 6, 2, 8, 3, 5, 2, 4, 3, 7, 2, 4, 5, 2, 6, 3, 4, 2, 5, 8, 2].map((w, idx) => (
                    <div
                      key={idx}
                      className="h-full bg-slate-900"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono font-bold text-sm text-[#1F2A6B] tracking-widest mt-2">
                  {activeBarcodeModal.code}
                </span>
              </div>

              <p className="text-[10px] text-slate-500">{activeBarcodeModal.perk}</p>
            </div>

            <button
              onClick={() => setActiveBarcodeModal(null)}
              className="w-full bg-[#1F2A6B] text-white py-2.5 rounded-xl text-xs font-bold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
