'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Search, Navigation, Star, Coffee, Hotel, Landmark, ExternalLink } from 'lucide-react';

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const PLACE_TYPES = [
  { key: 'tourist_attraction', label: 'Attractions', icon: Landmark, color: '#00ff87' },
  { key: 'restaurant', label: 'Restaurants', icon: Coffee, color: '#00d4ff' },
  { key: 'lodging', label: 'Hotels', icon: Hotel, color: '#8b5cf6' },
];

export default function MapPage() {
  const [destination, setDestination] = useState('Tokyo, Japan');
  const [search, setSearch] = useState('Tokyo, Japan');
  const [activeType, setActiveType] = useState('tourist_attraction');
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const loadMap = useCallback(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'your_google_maps_api_key') {
      setMapError(true);
      return;
    }
    if (window.google) { initializeMap(); return; }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initializeMap;
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);
  }, []);

  function initializeMap() {
    setMapsLoaded(true);
    const mapEl = document.getElementById('google-map');
    if (!mapEl || !window.google) return;
    const map = new window.google.maps.Map(mapEl, {
      center: { lat: 35.6762, lng: 139.6503 },
      zoom: 12,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0a1628' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#0f2040' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020408' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0f2040' }] },
      ],
    });
    const service = new window.google.maps.places.PlacesService(map);
    service.textSearch({ query: destination, type: activeType as google.maps.places.SearchByTextRankPreference }, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        results.slice(0, 10).forEach(place => {
          if (!place.geometry?.location) return;
          new window.google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
            icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#00ff87', fillOpacity: 0.9, strokeColor: '#020408', strokeWeight: 2 },
          });
        });
      }
    });
  }

  useEffect(() => { loadMap(); }, [loadMap]);

  return (
    <main className="h-screen animated-gradient flex flex-col overflow-hidden">
      {/* Header */}
      <header className="glass-card border-b border-white/5 px-4 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-white/50 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <div className="flex items-center gap-2 flex-1">
            <MapPin size={18} className="text-[#00ff87]" />
            <h1 className="font-display font-bold text-lg gradient-text">Explore Map</h1>
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input id="map-search" value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { setDestination(search); setTimeout(() => { if (window.google) initializeMap(); }, 100); } }}
                placeholder="Search destination..."
                className="input-dark pl-9 py-2 text-sm" aria-label="Search destination" />
            </div>
            <button onClick={() => { setDestination(search); setTimeout(() => { if (window.google) initializeMap(); }, 100); }}
              className="btn-neon py-2 px-4 text-sm flex items-center gap-1">
              <Navigation size={14} /> Go
            </button>
          </div>
        </div>
      </header>

      {/* Type Filters */}
      <div className="glass-card border-b border-white/5 px-4 py-2 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex gap-3">
          {PLACE_TYPES.map(type => (
            <button key={type.key} onClick={() => setActiveType(type.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeType === type.key ? 'text-[#020408]' : 'text-white/50 hover:text-white bg-white/5'}`}
              style={activeType === type.key ? { background: type.color } : {}}>
              <type.icon size={14} /> {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        {mapError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
            <div className="glass-card p-8 border border-[#00ff87]/20 max-w-md text-center">
              <MapPin size={48} className="text-[#00ff87] mx-auto mb-4" />
              <h2 className="font-display font-bold text-2xl mb-2">Google Maps</h2>
              <p className="text-white/60 text-sm mb-4">
                Add your Google Maps API key to <code className="text-[#00ff87] bg-[#00ff87]/10 px-2 py-0.5 rounded text-xs">.env.local</code> to enable the interactive map.
              </p>
              <div className="glass-card p-3 border border-white/10 text-left text-xs font-mono text-[#00ff87] mb-4">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
              </div>
              <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer"
                className="btn-ghost text-sm py-2 px-4 flex items-center gap-2 justify-center">
                <ExternalLink size={14} /> Get Maps API Key
              </a>
            </div>

            {/* Fallback visual map */}
            <div className="glass-card p-6 border border-white/8 max-w-2xl w-full">
              <h3 className="font-display font-bold text-lg mb-4 text-center">📍 Top Attractions — {destination}</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { name: 'Senso-ji Temple', rating: 4.8, type: 'Attraction' },
                  { name: 'Shibuya Crossing', rating: 4.7, type: 'Landmark' },
                  { name: 'Tsukiji Market', rating: 4.6, type: 'Food Market' },
                  { name: 'Shinjuku Gyoen', rating: 4.7, type: 'Park' },
                ].map(place => (
                  <div key={place.name} className="glass-card p-4 border border-white/8 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00ff87]/10 border border-[#00ff87]/20 flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="text-[#00ff87]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{place.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-white/50 text-xs">{place.rating} · {place.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div id="google-map" className="w-full h-full" aria-label="Interactive Google Map" role="application" />
        )}

        {!mapsLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center glass-card">
            <div className="text-center">
              <div className="typing-dots mb-4"><span /><span /><span /></div>
              <p className="text-white/50 text-sm">Loading Google Maps...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
