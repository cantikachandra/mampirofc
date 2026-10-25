import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MSME, UserCoords } from '../types';
import { Layers, Maximize2, Minimize2, Navigation, Crosshair, Route, Sparkles, ExternalLink, QrCode } from 'lucide-react';
import { estimateTravelTime } from '../data/msmeData';

interface InteractiveMapProps {
  userCoords: UserCoords;
  msmes: MSME[];
  selectedMsmeId: string | null;
  onSelectMsme: (msme: MSME) => void;
  onCheckInMsme: (msme: MSME) => void;
  onUpdateUserCoords?: (coords: UserCoords) => void;
}

type TileLayerType = 'voyager' | 'osm' | 'satellite';

const TILE_SERVERS: Record<TileLayerType, { url: string; attribution: string; maxZoom: number }> = {
  voyager: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  }
};

export default function InteractiveMap({
  userCoords,
  msmes,
  selectedMsmeId,
  onSelectMsme,
  onCheckInMsme,
  onUpdateUserCoords
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const msmeMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const polylinesRef = useRef<Map<string, L.Polyline>>(new Map());

  const [activeTile, setActiveTile] = useState<TileLayerType>('voyager');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSimulateMoveMode, setIsSimulateMoveMode] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        center: [userCoords.lat, userCoords.lng],
        zoom: 14
      });

      // Add Attribution at bottom-right small
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      // Tile layer
      const config = TILE_SERVERS[activeTile];
      const tile = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom
      }).addTo(map);

      tileLayerRef.current = tile;
      mapInstanceRef.current = map;

      // Handle map click when in move/simulate mode
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (isSimulateMoveMode && onUpdateUserCoords) {
          onUpdateUserCoords({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            accuracy: 15,
            isCustom: true
          });
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = TILE_SERVERS[activeTile];
    const tile = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom
    }).addTo(map);

    tileLayerRef.current = tile;
  }, [activeTile]);

  // Update User Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const userIconHtml = `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 gps-pulse-marker"></div>
        <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
      </div>
    `;

    const customUserIcon = L.divIcon({
      className: 'user-gps-icon',
      html: userIconHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (!userMarkerRef.current) {
      const marker = L.marker([userCoords.lat, userCoords.lng], {
        icon: customUserIcon,
        draggable: isSimulateMoveMode,
        zIndexOffset: 1000
      }).addTo(map);

      marker.on('dragend', (e) => {
        const marker = e.target as L.Marker;
        const pos = marker.getLatLng();
        if (onUpdateUserCoords) {
          onUpdateUserCoords({
            lat: pos.lat,
            lng: pos.lng,
            accuracy: 10,
            isCustom: true
          });
        }
      });

      marker.bindPopup(`
        <div class="p-3 text-xs min-w-[180px]">
          <div class="flex items-center space-x-1.5 text-blue-700 font-bold mb-1">
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Lokasi GPS Anda</span>
          </div>
          <p class="text-slate-600 text-[11px]">Lat: ${userCoords.lat.toFixed(4)}, Lng: ${userCoords.lng.toFixed(4)}</p>
          <p class="text-[10px] text-slate-400 mt-1">Pusat rute loop ke UMKM terdekat</p>
        </div>
      `);

      userMarkerRef.current = marker;
    } else {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      userMarkerRef.current.dragging?.enabled();
      if (isSimulateMoveMode) {
        userMarkerRef.current.dragging?.enable();
      } else {
        userMarkerRef.current.dragging?.disable();
      }
    }

    // Accuracy circle
    if (!accuracyCircleRef.current) {
      accuracyCircleRef.current = L.circle([userCoords.lat, userCoords.lng], {
        radius: userCoords.accuracy || 35,
        color: '#3b82f6',
        fillColor: '#93c5fd',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '3, 6'
      }).addTo(map);
    } else {
      accuracyCircleRef.current.setLatLng([userCoords.lat, userCoords.lng]);
      accuracyCircleRef.current.setRadius(userCoords.accuracy || 35);
    }
  }, [userCoords, isSimulateMoveMode]);

  // Update MSME Markers & Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers that no longer exist
    msmeMarkersRef.current.forEach((marker, id) => {
      if (!msmes.some((m) => m.id === id)) {
        map.removeLayer(marker);
        msmeMarkersRef.current.delete(id);
      }
    });

    // Clear old polylines
    polylinesRef.current.forEach((line) => {
      map.removeLayer(line);
    });
    polylinesRef.current.clear();

    msmes.forEach((m) => {
      const isSelected = selectedMsmeId === m.id;
      const isSepi = m.crowdStatus === 'sepi';
      const statusColor = isSepi ? '#10b981' : m.crowdStatus === 'sedang' ? '#f59e0b' : '#ef4444';
      const categoryEmoji =
        m.category === 'kuliner' ? '🍲' :
        m.category === 'kopi' ? '☕' :
        m.category === 'kerajinan' ? '🪵' :
        m.category === 'oleh-oleh' ? '🛍️' : '🌿';

      const markerHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          <div class="flex items-center justify-center w-10 h-10 rounded-2xl bg-white shadow-xl border-2 transition-colors"
               style="border-color: ${isSelected ? '#1F2A6B' : statusColor}">
            <span class="text-base leading-none">${categoryEmoji}</span>
          </div>
          <!-- Crowd Status Pill Badge -->
          <div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow"
               style="background-color: ${statusColor}"></div>
          ${isSepi ? `
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1B7A68] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow whitespace-nowrap">
              +${m.bonusCoins || 10}
            </div>
          ` : ''}
        </div>
      `;

      const msmeIcon = L.divIcon({
        className: 'msme-map-marker',
        html: markerHtml,
        iconSize: [40, 44],
        iconAnchor: [20, 22]
      });

      let marker = msmeMarkersRef.current.get(m.id);
      if (!marker) {
        marker = L.marker([m.lat, m.lng], { icon: msmeIcon }).addTo(map);
        msmeMarkersRef.current.set(m.id, marker);
      } else {
        marker.setIcon(msmeIcon);
        marker.setLatLng([m.lat, m.lng]);
      }

      // Attach Popup
      const travel = estimateTravelTime(parseFloat(m.distanceKm || '1.0'));
      const popupHtml = `
        <div class="w-64 overflow-hidden rounded-2xl bg-white text-slate-800">
          <div class="relative h-28 w-full bg-slate-100 overflow-hidden">
            <img src="${m.image}" alt="${m.name}" class="w-full h-full object-cover" />
            <div class="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              ${m.crowdText}
            </div>
            <div class="absolute top-2 right-2 bg-[#E8A317] text-[#1F2A6B] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
              ⭐ ${m.rating}
            </div>
          </div>
          <div class="p-3 space-y-2">
            <div>
              <h4 class="font-extrabold text-sm text-[#1F2A6B] leading-tight">${m.name}</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">${m.address}</p>
            </div>
            
            <div class="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span class="font-bold text-emerald-800">📍 ${m.distanceKm} km</span>
              <span class="text-slate-500">🚶 ~${travel.walkingMin} mnt • 🛵 ~${travel.drivingMin} mnt</span>
            </div>

            ${m.coinVouchers?.[0] ? `
              <div class="bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-xl text-[10px] flex items-center justify-between">
                <span class="font-bold truncate pr-1">🎁 ${m.coinVouchers[0].title}</span>
                <span class="bg-[#E8A317] text-[#1F2A6B] font-black px-1.5 py-0.5 rounded-md whitespace-nowrap">${m.coinVouchers[0].cost} Koin</span>
              </div>
            ` : ''}

            <div class="grid grid-cols-2 gap-1.5 pt-1">
              <button id="popup-select-${m.id}" class="w-full bg-[#1F2A6B] hover:bg-[#161f4f] text-white py-1.5 rounded-xl text-xs font-bold text-center transition">
                Pilih Rute
              </button>
              <button id="popup-checkin-${m.id}" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1 transition">
                <span>Check-in</span>
              </button>
            </div>

            <a href="https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${m.lat},${m.lng}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="block text-center text-[10px] text-slate-500 hover:text-blue-600 underline pt-0.5">
              Buka Google Maps Navigator ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });

      marker.on('popupopen', () => {
        const selectBtn = document.getElementById(`popup-select-${m.id}`);
        if (selectBtn) {
          selectBtn.onclick = () => {
            onSelectMsme(m);
            marker?.closePopup();
          };
        }
        const checkinBtn = document.getElementById(`popup-checkin-${m.id}`);
        if (checkinBtn) {
          checkinBtn.onclick = () => {
            onCheckInMsme(m);
            marker?.closePopup();
          };
        }
      });

      marker.on('click', () => {
        onSelectMsme(m);
      });

      // Draw Polyline from User to MSME
      const polyline = L.polyline(
        [
          [userCoords.lat, userCoords.lng],
          [m.lat, m.lng]
        ],
        {
          color: isSelected ? '#1F2A6B' : isSepi ? '#1B7A68' : '#94a3b8',
          dashArray: isSelected ? undefined : '5, 8',
          weight: isSelected ? 4 : 2,
          opacity: isSelected ? 0.95 : 0.6
        }
      ).addTo(map);

      polylinesRef.current.set(m.id, polyline);
    });
  }, [msmes, userCoords, selectedMsmeId]);

  // If selectedMsmeId changed, fly to it
  useEffect(() => {
    if (!selectedMsmeId || !mapInstanceRef.current) return;
    const target = msmes.find((m) => m.id === selectedMsmeId);
    if (target) {
      mapInstanceRef.current.flyTo([target.lat, target.lng], 16, {
        animate: true,
        duration: 1
      });
      const marker = msmeMarkersRef.current.get(target.id);
      if (marker && !marker.isPopupOpen()) {
        marker.openPopup();
      }
    }
  }, [selectedMsmeId]);

  // Center to user
  const handleCenterUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 15, {
        animate: true,
        duration: 0.8
      });
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup();
      }
    }
  };

  // Fit all markers
  const handleFitAll = () => {
    if (!mapInstanceRef.current) return;
    const allCoords: [number, number][] = [
      [userCoords.lat, userCoords.lng],
      ...msmes.map((m): [number, number] => [m.lat, m.lng])
    ];
    const bounds = L.latLngBounds(allCoords);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden shadow-md border border-slate-200 transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'h-[360px] md:h-[420px]'
    }`}>
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Header Controls */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none">
        {/* Layer Switcher */}
        <div className="pointer-events-auto flex items-center space-x-1 bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-md border border-slate-200/80 text-[11px]">
          <button
            onClick={() => setActiveTile('voyager')}
            className={`px-2.5 py-1 rounded-xl font-bold transition ${
              activeTile === 'voyager'
                ? 'bg-[#1F2A6B] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Voyager
          </button>
          <button
            onClick={() => setActiveTile('osm')}
            className={`px-2.5 py-1 rounded-xl font-bold transition ${
              activeTile === 'osm'
                ? 'bg-[#1F2A6B] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            OSM
          </button>
          <button
            onClick={() => setActiveTile('satellite')}
            className={`px-2.5 py-1 rounded-xl font-bold transition ${
              activeTile === 'satellite'
                ? 'bg-[#1F2A6B] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Satelit
          </button>
        </div>

        {/* Quick Tools */}
        <div className="pointer-events-auto flex items-center space-x-1.5">
          {/* Drag GPS Simulation Toggle */}
          <button
            onClick={() => setIsSimulateMoveMode(!isSimulateMoveMode)}
            title="Klik peta atau geser pin biru untuk mensimulasikan gerak GPS"
            className={`px-2.5 py-1.5 rounded-2xl shadow-md border text-[11px] font-bold flex items-center space-x-1 transition backdrop-blur-md ${
              isSimulateMoveMode
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                : 'bg-white/90 text-slate-700 border-slate-200/80 hover:bg-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSimulateMoveMode ? 'Mode Geser GPS Aktif' : 'Simulasi Geser GPS'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-2xl bg-white/90 backdrop-blur-md shadow-md border border-slate-200/80 text-slate-700 hover:bg-white transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Bottom Left Controls */}
      <div className="absolute bottom-4 left-4 z-[400] flex flex-col space-y-2 pointer-events-auto">
        <button
          onClick={handleCenterUser}
          className="p-2.5 bg-white text-[#1F2A6B] rounded-2xl shadow-lg border border-slate-200 hover:bg-slate-50 transition flex items-center space-x-1.5 text-xs font-bold"
          title="Kembali ke lokasi GPS saya"
        >
          <Navigation className="w-4 h-4 text-blue-600 fill-blue-600" />
          <span className="hidden sm:inline">Lokasi Saya</span>
        </button>

        <button
          onClick={handleFitAll}
          className="p-2.5 bg-white text-[#1F2A6B] rounded-2xl shadow-lg border border-slate-200 hover:bg-slate-50 transition flex items-center space-x-1.5 text-xs font-bold"
          title="Tampilkan semua UMKM dan saya"
        >
          <Route className="w-4 h-4 text-[#1B7A68]" />
          <span className="hidden sm:inline">Lihat Semua UMKM</span>
        </button>
      </div>

      {/* Floating Legend / Hint */}
      <div className="absolute bottom-4 right-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-md border border-slate-200/80 text-[10px] hidden md:flex items-center space-x-3 text-slate-600">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Sepi (+Koin)</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Sedang</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Ramai</span>
        </div>
      </div>

      {/* Mode hint if active */}
      {isSimulateMoveMode && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[400] bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>Klik titik mana saja di peta atau geser pin biru untuk pindah posisi</span>
        </div>
      )}
    </div>
  );
}
