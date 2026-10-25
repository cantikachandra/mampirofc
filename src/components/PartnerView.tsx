import React, { useState } from 'react';
import { MSME, CrowdStatus, Category } from '../types';
import { 
  Store, Users, Sparkles, TrendingUp, PlusCircle, CheckCircle, 
  MapPin, Clock, Tag, Save, Eye, ArrowUpRight
} from 'lucide-react';
import { formatRupiah } from '../data/msmeData';

interface PartnerViewProps {
  msmes: MSME[];
  onUpdateMsmeStatus: (msmeId: string, newStatus: CrowdStatus) => void;
  onAddNewMsme: (newMsme: MSME) => void;
  showToast: (msg: string) => void;
  onSwitchToTourist: () => void;
}

export default function PartnerView({
  msmes,
  onUpdateMsmeStatus,
  onAddNewMsme,
  showToast,
  onSwitchToTourist
}: PartnerViewProps) {
  const [selectedShopId, setSelectedShopId] = useState<string>(msmes[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);

  // New MSME form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('kuliner');
  const [newAddress, setNewAddress] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newLat, setNewLat] = useState(-7.8410);
  const [newLng, setNewLng] = useState(112.4760);

  const currentShop = msmes.find((m) => m.id === selectedShopId) || msmes[0];

  const handleStatusChange = (status: CrowdStatus) => {
    onUpdateMsmeStatus(currentShop.id, status);
    const statusLabel =
      status === 'sepi'
        ? 'Sepi (Bonus Koin Diaktifkan!)'
        : status === 'sedang'
        ? 'Sedang'
        : 'Ramai';
    showToast(`Status keramaian ${currentShop.name} diubah ke: ${statusLabel}`);
  };

  const handleCreateNewShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) {
      showToast('Mohon lengkapi nama dan alamat UMKM');
      return;
    }

    const created: MSME = {
      id: 'msme-' + Date.now(),
      name: newName,
      category: newCategory,
      lat: newLat,
      lng: newLng,
      address: newAddress,
      crowdStatus: 'sepi',
      crowdText: '🟢 Sepi (Baru Terdaftar)',
      story: newStory || 'UMKM lokal pilihan warga desa Pujon.',
      image:
        newCategory === 'kuliner'
          ? 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80'
          : newCategory === 'kopi'
          ? 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
      rating: 5.0,
      reviewCount: 1,
      bonusCoins: 20,
      todayVisitors: 0,
      products: [
        { id: 'pn-1', name: 'Paket Spesial Pengunjung MAMPIR', price: 25000, description: 'Menu/produk promo untuk wisatawan' }
      ],
      coinVouchers: [
        { id: 'vn-1', title: 'Diskon Spesial 10%', cost: 15, perk: 'Diskon 10% untuk pembeli via aplikasi MAMPIR' }
      ]
    };

    onAddNewMsme(created);
    setSelectedShopId(created.id);
    setShowAddModal(false);
    showToast(`UMKM "${newName}" berhasil didaftarkan ke Peta!`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Partner Banner */}
      <div className="bg-gradient-to-r from-[#1F2A6B] to-[#161f4f] text-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-[#E8A317]" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#E8A317]">
              Portal Mitra UMKM MAMPIR
            </span>
          </div>
          <h2 className="text-2xl font-black font-['Bricolage_Grotesque']">
            Kelola Kunjungan Toko Anda
          </h2>
          <p className="text-xs text-slate-300 max-w-md">
            Atur status keramaian secara real-time. Toko dengan status "Sepi" secara otomatis dipromosikan ke peta wisatawan dengan bonus koin ekstra!
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#E8A317] hover:bg-amber-400 text-[#1F2A6B] px-4 py-2.5 rounded-2xl text-xs font-black shadow-md flex items-center space-x-1.5 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Daftarkan UMKM Baru</span>
        </button>
      </div>

      {/* Select Shop */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
          Pilih Toko Yang Dikelola
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {msmes.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedShopId(m.id)}
              className={`p-3 rounded-2xl border text-left transition ${
                selectedShopId === m.id
                  ? 'border-[#1F2A6B] bg-blue-50/50 shadow-sm ring-2 ring-[#1F2A6B]/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                  {m.category.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold">
                  {m.crowdStatus === 'sepi' ? '🟢 Sepi' : m.crowdStatus === 'sedang' ? '🟡 Sedang' : '🔴 Ramai'}
                </span>
              </div>
              <p className="font-extrabold text-xs text-slate-900 mt-1 truncate">{m.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Crowd Management Card */}
      {currentShop && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400">Toko Aktif</span>
              <h3 className="text-xl font-extrabold text-[#1F2A6B]">{currentShop.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentShop.address}</p>
            </div>
            <button
              onClick={onSwitchToTourist}
              className="text-xs font-bold text-[#1F2A6B] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat di Peta Wisata</span>
            </button>
          </div>

          {/* Interactive Crowd Status Buttons */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">
                Pilih Status Keramaian Saat Ini:
              </span>
              <span className="text-[11px] text-slate-500">
                Otomatis sinkron ke GPS wisatawan
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Sepi */}
              <button
                onClick={() => handleStatusChange('sepi')}
                className={`p-3.5 rounded-2xl border-2 transition text-center flex flex-col items-center justify-center space-y-1 ${
                  currentShop.crowdStatus === 'sepi'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102 font-extrabold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <span className="text-xl">🟢</span>
                <span className="text-xs font-extrabold">Sepi (Tenang)</span>
                <span className={`text-[10px] ${currentShop.crowdStatus === 'sepi' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  Bonus +{currentShop.bonusCoins || 15} Koin aktif
                </span>
              </button>

              {/* Sedang */}
              <button
                onClick={() => handleStatusChange('sedang')}
                className={`p-3.5 rounded-2xl border-2 transition text-center flex flex-col items-center justify-center space-y-1 ${
                  currentShop.crowdStatus === 'sedang'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102 font-extrabold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                }`}
              >
                <span className="text-xl">🟡</span>
                <span className="text-xs font-extrabold">Sedang</span>
                <span className={`text-[10px] ${currentShop.crowdStatus === 'sedang' ? 'text-amber-100' : 'text-slate-400'}`}>
                  Kunjungan stabil
                </span>
              </button>

              {/* Ramai */}
              <button
                onClick={() => handleStatusChange('ramai')}
                className={`p-3.5 rounded-2xl border-2 transition text-center flex flex-col items-center justify-center space-y-1 ${
                  currentShop.crowdStatus === 'ramai'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-102 font-extrabold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
                }`}
              >
                <span className="text-xl">🔴</span>
                <span className="text-xs font-extrabold">Ramai (Padat)</span>
                <span className={`text-[10px] ${currentShop.crowdStatus === 'ramai' ? 'text-rose-100' : 'text-slate-400'}`}>
                  Mengarahkan ke mitra lain
                </span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Wisatawan Check-in</span>
              <p className="text-xl font-black text-[#1F2A6B] mt-1">{currentShop.todayVisitors || 28} Orang</p>
              <span className="text-[10px] text-emerald-600 font-bold">Hari ini</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Rating Kepuasan</span>
              <p className="text-xl font-black text-[#1F2A6B] mt-1">⭐ {currentShop.rating}</p>
              <span className="text-[10px] text-slate-500">{currentShop.reviewCount} ulasan</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Voucher Aktif</span>
              <p className="text-xl font-black text-[#1F2A6B] mt-1">{currentShop.coinVouchers.length} Promo</p>
              <span className="text-[10px] text-amber-600 font-bold">Tersedia di app</span>
            </div>
          </div>

          {/* Active Vouchers & Perks List */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase text-slate-500 tracking-wider">
              Voucher Promo Toko Yang Ditawarkan
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {currentShop.coinVouchers.map((v) => (
                <div key={v.id} className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-xs text-slate-900">{v.title}</p>
                    <p className="text-[10px] text-slate-500">{v.perk}</p>
                  </div>
                  <span className="bg-[#E8A317] text-[#1F2A6B] font-black px-2 py-1 rounded-xl text-xs whitespace-nowrap">
                    {v.cost} Koin
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New UMKM */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-lg text-[#1F2A6B]">Daftarkan UMKM Baru ke Peta</h3>
            <p className="text-xs text-slate-500">
              Bantu perajin, warung, atau petani lokal mendapatkan wisatawan secara adil dan merata.
            </p>

            <form onSubmit={handleCreateNewShop} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama UMKM / Usaha</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Madu Hutan Murni Pujon"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1F2A6B]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kategori</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1F2A6B]"
                >
                  <option value="kuliner">🍲 Kuliner Tradisional</option>
                  <option value="kopi">☕ Kedai Kopi Lokal</option>
                  <option value="kerajinan">🪵 Kriya & Kerajinan Kayu</option>
                  <option value="oleh-oleh">🛍️ Oleh-Oleh & Keripik</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jl. Coban Rondo Dusun Sebaluh, Pujon"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1F2A6B]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cerita Singkat / Keunikan</label>
                <textarea
                  rows={2}
                  placeholder="Cerita asal-usul usaha, bahan baku lokal, atau keahlian tradisi perajin..."
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1F2A6B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLat}
                    onChange={(e) => setNewLat(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLng}
                    onChange={(e) => setNewLng(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#1F2A6B] hover:bg-[#161f4f] text-white py-2.5 rounded-xl font-bold shadow-md"
                >
                  Simpan & Tampilkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
