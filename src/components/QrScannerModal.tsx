import React, { useState } from 'react';
import { MSME, UserCoords } from '../types';
import { X, QrCode, Sparkles, MapPin, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateDistanceKm } from '../data/msmeData';

interface QrScannerModalProps {
  msme: MSME;
  userCoords: UserCoords;
  onClose: () => void;
  onSuccessCheckIn: (earnedCoins: number) => void;
}

export default function QrScannerModal({
  msme,
  userCoords,
  onClose,
  onSuccessCheckIn
}: QrScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const realDistance = calculateDistanceKm(userCoords.lat, userCoords.lng, msme.lat, msme.lng);
  const bonus = msme.crowdStatus === 'sepi' ? (msme.bonusCoins || 15) : 10;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      onSuccessCheckIn(bonus);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div className="p-6 space-y-5 text-center">
            {/* Header Badge */}
            <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>QRIS Check-In Terverifikasi GPS</span>
            </div>

            {/* Merchant Info */}
            <div>
              <h3 className="font-extrabold text-xl text-[#1F2A6B] leading-snug">{msme.name}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center justify-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{msme.address}</span>
              </p>
            </div>

            {/* Simulated QR Box / Scanner Viewfinder */}
            <div className="relative mx-auto w-48 h-48 bg-slate-900 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-4 border-[#1F2A6B]/20 shadow-inner">
              {/* Corner guides */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#E8A317]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#E8A317]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#E8A317]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#E8A317]" />

              {/* QR Image Mock */}
              <div className="bg-white p-2.5 rounded-xl shadow-lg">
                <QrCode className="w-28 h-28 text-slate-900" />
              </div>

              {/* Laser beam during scan */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce top-10" />
              )}
            </div>

            {/* Distance & Reward Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-left flex items-center justify-between">
              <div>
                <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Hadiah Check-in</p>
                <p className="text-xs font-bold text-[#1F2A6B]">
                  {msme.crowdStatus === 'sepi' ? 'Bonus UMKM Tenang (+15 Koin)' : 'Poin Kunjungan (+10 Koin)'}
                </p>
              </div>
              <div className="bg-[#E8A317] text-[#1F2A6B] font-black px-2.5 py-1 rounded-xl text-xs flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{bonus}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Jarak GPS Anda saat ini ke toko: <span className="font-bold text-slate-700">{realDistance} km</span>.
            </p>

            {/* Action Button */}
            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="w-full bg-[#1F2A6B] hover:bg-[#161f4f] text-white py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-[#1F2A6B]/20 transition disabled:opacity-50"
            >
              {isScanning ? (
                <span>Memverifikasi Lokasi & Pindai...</span>
              ) : (
                <>
                  <QrCode className="w-4 h-4 text-[#E8A317]" />
                  <span>Pindai QR / Check-in Sekarang</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-2xl text-[#1F2A6B]">Check-in Berhasil!</h3>
              <p className="text-xs text-slate-600">Terima kasih telah berkunjung ke {msme.name}</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <span className="text-xs font-bold text-emerald-800">Saldo Bertambah</span>
              <div className="text-3xl font-black text-emerald-700 mt-1 flex items-center justify-center space-x-1">
                <Sparkles className="w-6 h-6 text-[#E8A317]" />
                <span>+{bonus} Koin MAMPIR</span>
              </div>
              <p className="text-[10px] text-emerald-600 mt-1">Dapat langsung ditukarkan ke diskon & oleh-oleh lokal!</p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#1F2A6B] text-white py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-1 hover:bg-[#161f4f] transition"
            >
              <span>Selesai & Jelajahi UMKM Lain</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
