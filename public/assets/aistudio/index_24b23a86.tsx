import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, Store, QrCode, Coins, ArrowRight, X, Sparkles, LocateFixed, Route, Ticket
} from 'lucide-react';

const INITIAL_MSMES = [
  {
    id: 'msme-1',
    name: 'Warung Ketan Legendaris Coban',
    category: 'kuliner',
    lat: -7.8385,
    lng: 112.4782,
    address: 'Jl. Coban Rondo No. 12, Pujon',
    crowdStatus: 'sepi',
    crowdText: '🟢 Sepi (Tanpa antre)',
    distanceKm: '0.4',
    story: 'Berdiri sejak 1998, menyajikan ketan tradisional dengan taburan kelapa gurih.',
    products: [
      { id: 'p1', name: 'Ketan Susu Gula Aren', price: 12000 },
      { id: 'p2', name: 'Ketan Durian Spesial', price: 20000 }
    ],
    coinVouchers: [
      { id: 'v1', title: 'Voucher Potongan Rp 5.000', cost: 15, perk: 'Potongan Rp 5.000 min. belanja 15rb' }
    ]
  },
  {
    id: 'msme-2',
    name: 'Kerajinan Kayu Jati Pujon Indah',
    category: 'kerajinan',
    lat: -7.8402,
    lng: 112.4750,
    address: 'Desa Wisata Pandesari, Pujon',
    crowdStatus: 'sepi',
    crowdText: '🟢 Sepi (Nyaman)',
    distanceKm: '1.2',
    story: 'Pusat kriya kayu sisa jati perhutani yang diukir langsung oleh perajin lokal.',
    products: [
      { id: 'p3', name: 'Talenan Kayu Jati Minimalis', price: 45000 },
      { id: 'p4', name: 'Mangkok Buah Kayu', price: 85000 }
    ],
    coinVouchers: [
      { id: 'v2', title: 'Diskon 15% Souvenir Kayu', cost: 25, perk: 'Diskon 15% semua kerajinan kayu' }
    ]
  },
  {
    id: 'msme-3',
    name: 'Kopi Lesung Tradisional Desa',
    category: 'kuliner',
    lat: -7.8420,
    lng: 112.4800,
    address: 'Sentra Kopi Pujon',
    crowdStatus: 'sepi',
    crowdText: '🟢 Sepi (Sangat Tenang)',
    distanceKm: '1.8',
    story: 'Menyangrai biji kopi lokal Robusta lereng Gunung Kawi dengan cara tradisional.',
    products: [
      { id: 'p5', name: 'Kopi Tubruk Lesung Hitam', price: 10000 }
    ],
    coinVouchers: [
      { id: 'v3', title: 'Buy 1 Get 1 Kopi Tubruk', cost: 12, perk: 'Beli 1 Kopi Tubruk Gratis 1 cangkir' }
    ]
  }
];

export default function App() {
  const [currentDoor, setCurrentDoor] = useState('home'); 
  const [userCoords, setUserCoords] = useState({ lat: -7.8375, lng: 112.4765 }); 
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coinBalance, setCoinBalance] = useState(65);
  const [myVouchers, setMyVouchers] = useState([]);
  const [qrModalMsme, setQrModalMsme] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const requestGps = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsLoading(false);
        },
        () => setGpsLoading(false)
      );
    } else {
      setGpsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F2A6B] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 border border-[#E8A317]">
          <Sparkles className="w-4 h-4 text-[#E8A317]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-[#1F2A6B] text-white px-5 py-3 shadow flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentDoor('home')}>
          <div className="bg-[#E8A317] text-[#1F2A6B] p-1.5 rounded-xl font-black text-base">M</div>
          <span className="font-bold text-base font-['Bricolage_Grotesque']">MAMPIR Simpel</span>
        </div>
        {currentDoor !== 'home' && (
          <button 
            onClick={() => setCurrentDoor('home')}
            className="bg-[#E8A317] text-[#1F2A6B] px-3 py-1 rounded-full text-xs font-bold"
          >
            Beranda
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-4">
        {currentDoor === 'home' ? (
          <div className="py-12 text-center space-y-8">
            <div>
              <span className="bg-[#E8A317]/20 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                MAMPIR, Make it clear.
              </span>
              <h1 className="text-3xl font-extrabold text-[#1F2A6B] mt-3 font-['Bricolage_Grotesque']">
                Pariwisata Adil & Merata
              </h1>
              <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
                Deteksi lokasi GPS Anda dan ikuti rute garis peta langsung ke UMKM terdekat disekitar Anda.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => { requestGps(); setCurrentDoor('tourist'); }}
                className="bg-white p-6 rounded-3xl shadow-md border-2 border-slate-200 hover:border-[#1F2A6B] transition text-left flex flex-col justify-between"
              >
                <div>
                  <Compass className="w-8 h-8 text-[#1F2A6B] mb-3" />
                  <h3 className="font-bold text-lg text-slate-900">Pintu Wisatawan</h3>
                  <p className="text-xs text-slate-500 mt-1">Aktifkan GPS & jelajahi rute garis UMKM sekitar.</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#1F2A6B]">
                  <span>Mulai Cari Loop</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => setCurrentDoor('partner')}
                className="bg-white p-6 rounded-3xl shadow-md border-2 border-slate-200 hover:border-[#E8A317] transition text-left flex flex-col justify-between"
              >
                <div>
                  <Store className="w-8 h-8 text-[#E8A317] mb-3" />
                  <h3 className="font-bold text-lg text-slate-900">Pintu Mitra UMKM</h3>
                  <p className="text-xs text-slate-500 mt-1">Kelola keramaian & lihat statistik kunjungan toko.</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#1F2A6B]">
                  <span>Masuk Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        ) : currentDoor === 'tourist' ? (
          <TouristView 
            userCoords={userCoords}
            requestGps={requestGps}
            gpsLoading={gpsLoading}
            coinBalance={coinBalance}
            setCoinBalance={setCoinBalance}
            myVouchers={myVouchers}
            setMyVouchers={setMyVouchers}
            setQrModalMsme={setQrModalMsme}
            showToast={showToast}
          />
        ) : (
          <PartnerView />
        )}
      </main>

      {/* QR Modal Simpel */}
      {qrModalMsme && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full space-y-4 text-center relative">
            <button 
              onClick={() => setQrModalMsme(null)} 
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <QrCode className="w-12 h-12 text-[#1F2A6B] mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">{qrModalMsme.name}</h3>
            <p className="text-xs text-slate-500">Pindai QRIS untuk check-in & bertransaksi di lokasi.</p>
            <button 
              onClick={() => {
                setCoinBalance(prev => prev + 10);
                showToast("Check-in Berhasil! +10 Koin diperoleh");
                setQrModalMsme(null);
              }}
              className="w-full bg-[#1F2A6B] text-white py-2.5 rounded-xl text-xs font-bold"
            >
              Simulasikan Check-In (+10 Koin)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TouristView({ userCoords, requestGps, gpsLoading, coinBalance, setCoinBalance, myVouchers, setMyVouchers, setQrModalMsme, showToast }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (window.L && mapRef.current && !mapInstanceRef.current) {
      const map = window.L.map(mapRef.current, { zoomControl: false }).setView([userCoords.lat, userCoords.lng], 14);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Marker GPS User
      window.L.marker([userCoords.lat, userCoords.lng]).addTo(map).bindPopup("<b>Lokasi Anda (GPS)</b>").openPopup();

      // Marker UMKM & Garis Putus-Putus Rute
      INITIAL_MSMES.forEach(m => {
        window.L.marker([m.lat, m.lng]).addTo(map).bindPopup(`<b>${m.name}</b><br/>${m.distanceKm} km dari GPS`);
        window.L.polyline([[userCoords.lat, userCoords.lng], [m.lat, m.lng]], {
          color: '#1B7A68',
          dashArray: '6, 8',
          weight: 3
        }).addTo(map);
      });

      mapInstanceRef.current = map;
    }
  }, [userCoords]);

  const redeemVoucher = (v, msme) => {
    if (coinBalance < v.cost) {
      showToast("Koin Anda tidak cukup!");
      return;
    }
    setCoinBalance(prev => prev - v.cost);
    setMyVouchers(prev => [...prev, { title: v.title, msme: msme.name, code: `MAMPIR-${Math.floor(1000 + Math.random() * 9000)}` }]);
    showToast(`Voucher ${v.title} berhasil ditukar!`);
  };

  return (
    <div className="space-y-6">
      {/* Info Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={requestGps} className="p-2 bg-blue-600 text-white rounded-xl">
            <LocateFixed className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
          </button>
          <div>
            <span className="text-[10px] text-emerald-600 font-bold uppercase">GPS Terhubung</span>
            <p className="text-xs font-bold text-slate-800">Lat: {userCoords.lat.toFixed(3)}, Lng: {userCoords.lng.toFixed(3)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <Coins className="w-4 h-4 text-[#E8A317]" />
          <span className="text-xs font-extrabold text-[#1F2A6B]">{coinBalance} Koin</span>
        </div>
      </div>

      {/* Peta Simpel */}
      <div className="space-y-2">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
          <Route className="w-4 h-4 text-[#1B7A68]" />
          <span>Garis Rute GPS ke UMKM Sekitar</span>
        </h3>
        <div className="w-full h-64 bg-slate-200 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>

      {/* Penukaran Koin Mampir */}
      <div className="bg-gradient-to-r from-amber-50 to-emerald-50 p-5 rounded-2xl border border-amber-200 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1">
          <Coins className="w-4 h-4 text-[#E8A317]" />
          <span>Tukarkan Koin Mampir di UMKM Sepi</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {INITIAL_MSMES.map(m => (
            <div key={m.id} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">{m.name}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">{m.distanceKm} km</span>
              </div>
              {m.coinVouchers.map(v => (
                <div key={v.id} className="bg-slate-50 p-2 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{v.title}</p>
                    <p className="text-[10px] text-slate-500">{v.perk}</p>
                  </div>
                  <button 
                    onClick={() => redeemVoucher(v, m)}
                    className="bg-[#1F2A6B] text-white px-2.5 py-1 rounded-lg font-bold text-[10px]"
                  >
                    Tukar ({v.cost} Koin)
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* List Voucher Saya */}
      {myVouchers.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
          <h4 className="font-bold text-xs uppercase text-slate-500 flex items-center space-x-1">
            <Ticket className="w-3.5 h-3.5 text-emerald-600" />
            <span>Voucher Saya ({myVouchers.length})</span>
          </h4>
          <div className="grid md:grid-cols-2 gap-2">
            {myVouchers.map((v, i) => (
              <div key={i} className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{v.title}</p>
                  <p className="text-[10px] text-slate-500">{v.msme}</p>
                </div>
                <span className="font-mono font-bold text-[#1F2A6B] text-[10px]">{v.code}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daftar UMKM */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Daftar UMKM Terdekat</h3>
        <div className="space-y-3">
          {INITIAL_MSMES.map(m => (
            <div key={m.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">{m.crowdText}</span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{m.name}</h4>
                <p className="text-xs text-slate-500">{m.address} • {m.distanceKm} km</p>
              </div>
              <button 
                onClick={() => setQrModalMsme(m)}
                className="bg-[#1F2A6B] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Check-in</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PartnerView() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto my-8">
      <Store className="w-10 h-10 text-[#E8A317] mx-auto" />
      <h3 className="font-bold text-lg text-slate-900">Dasbor Ringkas Mitra</h3>
      <p className="text-xs text-slate-500">Fitur dasbor mitra aktif dalam mode simpel.</p>
      <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2 text-xs">
        <p className="font-bold text-slate-700">Status Keramaian Hari Ini:</p>
        <div className="flex space-x-2">
          <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-bold">🟢 Sepi</span>
          <span className="bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg">🟡 Sedang</span>
          <span className="bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg">🔴 Ramai</span>
        </div>
      </div>
    </div>
  );
}