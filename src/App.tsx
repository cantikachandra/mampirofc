import React, { useState, useEffect } from 'react';
import { 
  Compass, Store, Coins, ArrowRight, Sparkles, MapPin, 
  HelpCircle, ShieldCheck, Heart, Info, CheckCircle2, Navigation
} from 'lucide-react';
import { MSME, UserCoords, MyVoucher, CrowdStatus } from './types';
import { INITIAL_MSMES, PUJON_DEFAULT_COORDS, calculateDistanceKm } from './data/msmeData';
import TouristView from './components/TouristView';
import PartnerView from './components/PartnerView';
import QrScannerModal from './components/QrScannerModal';

export default function App() {
  const [currentDoor, setCurrentDoor] = useState<'home' | 'tourist' | 'partner'>('home');
  const [userCoords, setUserCoords] = useState<UserCoords>(PUJON_DEFAULT_COORDS);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coinBalance, setCoinBalance] = useState<number>(65);
  const [myVouchers, setMyVouchers] = useState<MyVoucher[]>([
    {
      id: 'demo-v1',
      title: 'Voucher Potongan Rp 5.000',
      msmeId: 'msme-1',
      msmeName: 'Warung Ketan Legendaris Coban',
      perk: 'Potongan Rp 5.000 min. belanja 15rb',
      code: 'MAMPIR-7721',
      acquiredAt: '10:15 WIB',
      isUsed: false
    }
  ]);
  const [qrModalMsme, setQrModalMsme] = useState<MSME | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [msmes, setMsmes] = useState<MSME[]>(INITIAL_MSMES);

  // Recalculate distances whenever userCoords or msmes change
  useEffect(() => {
    setMsmes((prevMsmes) =>
      prevMsmes.map((m) => {
        const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, m.lat, m.lng);
        return {
          ...m,
          distanceKm: dist.toFixed(1)
        };
      })
    );
  }, [userCoords.lat, userCoords.lng]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const requestGps = () => {
    setGpsLoading(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy || 20,
            isCustom: false
          });
          setGpsLoading(false);
          showToast('GPS Berhasil Disinkronkan dengan Perangkat Anda!');
        },
        (err) => {
          console.warn('Geolocation error or denied:', err);
          setGpsLoading(false);
          showToast('Menggunakan titik sentral wisata Pujon (GPS Default)');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGpsLoading(false);
      showToast('Geolocation tidak didukung browser ini, menggunakan default');
    }
  };

  // Partner updates MSME crowd status
  const handleUpdateMsmeStatus = (msmeId: string, newStatus: CrowdStatus) => {
    setMsmes((prev) =>
      prev.map((m) => {
        if (m.id === msmeId) {
          const text =
            newStatus === 'sepi'
              ? '🟢 Sepi (Tanpa Antre)'
              : newStatus === 'sedang'
              ? '🟡 Sedang (Sedikit Antre)'
              : '🔴 Ramai (Padat)';
          return {
            ...m,
            crowdStatus: newStatus,
            crowdText: text
          };
        }
        return m;
      })
    );
  };

  // Partner adds new MSME
  const handleAddNewMsme = (newMsme: MSME) => {
    const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, newMsme.lat, newMsme.lng);
    setMsmes((prev) => [{ ...newMsme, distanceKm: dist.toFixed(1) }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F2A6B] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 border border-[#E8A317] animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-[#E8A317] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-[#1F2A6B] text-white px-5 py-3.5 shadow-md flex justify-between items-center sticky top-0 z-40 border-b border-[#161f4f]">
        <div 
          className="flex items-center space-x-2.5 cursor-pointer select-none group" 
          onClick={() => setCurrentDoor('home')}
        >
          <div className="bg-[#E8A317] text-[#1F2A6B] w-8 h-8 rounded-xl font-black text-lg flex items-center justify-center shadow group-hover:scale-105 transition-transform">
            M
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight font-heading block leading-none">
              MAMPIR
            </span>
            <span className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase block mt-0.5">
              Pariwisata Adil & Merata
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentDoor !== 'home' ? (
            <div className="flex items-center space-x-1.5 bg-white/10 p-1 rounded-2xl">
              <button
                onClick={() => setCurrentDoor('tourist')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  currentDoor === 'tourist'
                    ? 'bg-[#E8A317] text-[#1F2A6B] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Wisatawan
              </button>
              <button
                onClick={() => setCurrentDoor('partner')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  currentDoor === 'partner'
                    ? 'bg-[#E8A317] text-[#1F2A6B] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Mitra UMKM
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A317]" />
              <span>Pujon &bull; Malang</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
        {currentDoor === 'home' ? (
          <div className="py-8 sm:py-12 text-center space-y-8 animate-in fade-in duration-300">
            {/* Hero Badge */}
            <div className="space-y-3">
              <span className="inline-flex items-center space-x-1.5 bg-[#E8A317]/15 text-amber-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-[#E8A317]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#E8A317]" />
                <span>MAMPIR: Make it clear, Adil & Merata</span>
              </span>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2A6B] font-heading tracking-tight max-w-xl mx-auto leading-tight">
                Peta Cerdas Distribusi Wisatawan ke UMKM Lokal
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Peta interaktif berbasis GPS yang memandu wisatawan menjelajahi kuliner, kopi, dan kerajinan lokal yang tenang (tanpa antre), sambil mengumpulkan Koin Mampir dan diskon belanja.
              </p>
            </div>

            {/* Door Navigation Cards */}
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
              {/* Pintu Wisatawan */}
              <button
                onClick={() => {
                  requestGps();
                  setCurrentDoor('tourist');
                }}
                className="group bg-white p-6 rounded-3xl shadow-md border-2 border-slate-200 hover:border-[#1F2A6B] hover:shadow-xl transition-all text-left flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1F2A6B] flex items-center justify-center mb-4 group-hover:bg-[#1F2A6B] group-hover:text-white transition-colors">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-900 font-heading">
                    Pintu Wisatawan
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-normal">
                    Peta rute garis GPS real-time, temukan toko sepi tanpa antre, tukar koin reward, dan check-in QRIS.
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#1F2A6B] relative z-10">
                  <span>Mulai Cari Loop UMKM</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Pintu Mitra UMKM */}
              <button
                onClick={() => setCurrentDoor('partner')}
                className="group bg-white p-6 rounded-3xl shadow-md border-2 border-slate-200 hover:border-[#E8A317] hover:shadow-xl transition-all text-left flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#E8A317] flex items-center justify-center mb-4 group-hover:bg-[#E8A317] group-hover:text-[#1F2A6B] transition-colors">
                    <Store className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-900 font-heading">
                    Pintu Mitra UMKM
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-normal">
                    Kelola status keramaian tokomu (Sepi/Sedang/Ramai), tawarkan voucher promo koin, dan pantau kunjungan.
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#1F2A6B] relative z-10">
                  <span>Masuk Portal Mitra</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Key Pillars */}
            <div className="max-w-2xl mx-auto pt-4 grid grid-cols-3 gap-3 text-left">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-emerald-700 font-bold text-xs flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Peta Interaktif</span>
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Multi-layer: Voyager, Satelit, & OpenStreetMap dengan rute dinamis.</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-amber-700 font-bold text-xs flex items-center space-x-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Koin & Voucher</span>
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Dapat koin dari kunjungan sepi, tukar voucher diskon langsung.</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-[#1F2A6B] font-bold text-xs flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Ekonomi Adil</span>
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Cegah overtourism di satu titik, sebar rezeki ke semua UMKM warga.</p>
              </div>
            </div>
          </div>
        ) : currentDoor === 'tourist' ? (
          <TouristView
            userCoords={userCoords}
            requestGps={requestGps}
            gpsLoading={gpsLoading}
            setUserCoords={setUserCoords}
            coinBalance={coinBalance}
            setCoinBalance={setCoinBalance}
            myVouchers={myVouchers}
            setMyVouchers={setMyVouchers}
            onOpenCheckIn={(m) => setQrModalMsme(m)}
            showToast={showToast}
            msmes={msmes}
          />
        ) : (
          <PartnerView
            msmes={msmes}
            onUpdateMsmeStatus={handleUpdateMsmeStatus}
            onAddNewMsme={handleAddNewMsme}
            showToast={showToast}
            onSwitchToTourist={() => setCurrentDoor('tourist')}
          />
        )}
      </main>

      {/* QR Check-In Modal */}
      {qrModalMsme && (
        <QrScannerModal
          msme={qrModalMsme}
          userCoords={userCoords}
          onClose={() => setQrModalMsme(null)}
          onSuccessCheckIn={(bonus) => {
            setCoinBalance((prev) => prev + bonus);
            showToast(`Check-in Berhasil! +${bonus} Koin MAMPIR ditambahkan ke dompet.`);
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400">
        <p className="flex items-center justify-center space-x-1">
          <span>&copy; {new Date().getFullYear()} MAMPIR • Inisiatif Pariwisata Berkelanjutan & Adil Pujon</span>
        </p>
      </footer>
    </div>
  );
}
