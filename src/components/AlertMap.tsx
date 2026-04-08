"use client";

import { useEffect, useState } from "react";
import { AlertItem, Institution } from "@/lib/api";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface AlertMapProps {
  institution: Institution;
  alerts: AlertItem[];
}

export default function AlertMap({ institution, alerts }: AlertMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Fix Leaflet Default Icon paths
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const blueIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Fallback to Lagos coords if institution lacks geolocation
  const lat = institution.latitude || 6.5244;
  const lng = institution.longitude || 3.3792;
  const position: [number, number] = [lat, lng];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 relative z-0">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Centre - Institution */}
        <Marker position={position} icon={blueIcon}>
          <Popup>
            <div className="font-semibold text-lg text-emerald-800">{institution.name}</div>
            <div className="text-sm text-gray-500 mt-1">{institution.address || "Adresse non définie"}</div>
            {institution.opening_hours && <div className="text-sm mt-1">🕒 {institution.opening_hours}</div>}
          </Popup>
        </Marker>

        {/* 1km Radius Zone */}
        <Circle center={position} radius={1000} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1 }} />

        {/* Alerts within Zone */}
        {alerts.map(alert => {
          if (!alert.latitude || !alert.longitude) return null;
          return (
            <Marker key={alert.id} position={[alert.latitude, alert.longitude]} icon={redIcon}>
              <Popup>
                <div className="font-bold text-red-600">🚨 Alerte L{alert.alert_level}</div>
                <div className="text-sm mt-1">📞 {alert.phone_caller}</div>
                <div className="text-sm">⚡ Score BEFAST: {alert.fast_score}/5</div>
                <div className="text-xs text-gray-500 mt-1">📍 {alert.location_text}</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
