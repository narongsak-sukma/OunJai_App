import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import { Coordinates, RiskZone } from '../types';
import { Settings } from 'lucide-react';

interface ThreatMapProps {
  userLocation: Coordinates | null;
  riskZones: RiskZone[];
  radius: number;
  onOpenSettings: () => void;
}

const ThreatMap: React.FC<ThreatMapProps> = ({ userLocation, riskZones, radius, onOpenSettings }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const initialLat = userLocation ? userLocation.lat : 13.7563;
      const initialLng = userLocation ? userLocation.lng : 100.5018;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([initialLat, initialLng], 15);

      // Light Mode Tiles (OpenStreetMap Standard) - White background for clear visibility
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '© OpenStreetMap'
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Update Markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;

    const map = mapInstanceRef.current;
    const markers = markersRef.current;

    markers.clearLayers();

    if (userLocation) {
      // 1. User Marker (Pulse Effect)
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div class="relative flex items-center justify-center">
                <div class="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white z-10"></div>
                <div class="absolute w-12 h-12 bg-blue-500/30 rounded-full animate-ping"></div>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(markers);

      // 2. Detection Radius Circle
      L.circle([userLocation.lat, userLocation.lng], {
        color: '#0057B8',
        fillColor: '#0057B8',
        fillOpacity: 0.1,
        weight: 1,
        radius: radius
      }).addTo(markers);

      // Pan to user smoothly
      map.panTo([userLocation.lat, userLocation.lng], { animate: true });
    }

    // 3. Risk Zones (ATMs/Banks)
    riskZones.forEach(zone => {
      const zoneIcon = L.divIcon({
        className: 'risk-marker',
        html: `<div class="flex items-center justify-center w-6 h-6 bg-[#ff3b30] rounded-full text-white text-[10px] font-bold shadow-lg shadow-red-900/50 border border-red-400">
                ATM
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const popupContent = `
        <div class="p-1">
          <div class="text-slate-900 font-bold">${zone.name}</div>
          ${zone.address ? `<div class="text-slate-600 text-xs mt-1">${zone.address}</div>` : ''}
          <div class="text-red-500 text-[10px] font-semibold mt-1 uppercase tracking-wider">High Risk Area</div>
        </div>
      `;

      const marker = L.marker([zone.lat, zone.lng], { icon: zoneIcon })
        .bindPopup(popupContent);

      marker.addTo(markers);
    });

  }, [userLocation, riskZones, radius]);

  return (
    <div className="w-full relative group">
      <div className="absolute top-4 left-4 z-[40]">
        <h3 className="text-white font-medium text-lg drop-shadow-md">แผนที่ความอุ่นใจ</h3>
        <p className="text-xs text-blue-200 drop-shadow-md">Live Real-time Safety Map</p>
      </div>

      <button
        onClick={onOpenSettings}
        className="absolute top-4 right-4 z-[40] bg-[#0f2445]/90 border border-blue-500/30 p-2 rounded-xl text-blue-200 hover:text-white shadow-lg backdrop-blur-sm transition-all active:scale-95"
      >
        <Settings className="w-5 h-5" />
      </button>

      <div
        ref={mapContainerRef}
        className="w-full h-64 rounded-[2rem] border border-blue-900/30 overflow-hidden shadow-inner bg-white"
      />

      {/* Footer status */}
      <div className="flex gap-4 text-xs mt-3 px-2">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ff3b30]"></span> จุดเสี่ยง (ATM/Bank)</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0057B8]"></span> ตำแหน่งของคุณ</div>
        <div className="ml-auto text-blue-200/50">{radius}m Radius</div>
      </div>
    </div>
  );
};

export default ThreatMap;