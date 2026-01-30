import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { throttle } from 'lodash'; 
import api from '../api';
import 'leaflet/dist/leaflet.css';

// --- ICONS ---
// (Using your existing imports or CDNs)
const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/75/75780.png', // Red Sports Car
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1.5 }); // Smooth flight
  }, [lat, lng, map]);
  return null;
}

export default function ComplexDriverTracker() {
  const driverId = localStorage.getItem('driverId') || '1';
  const [position, setPosition] = useState({ lat: 22.6017, lng: 75.6834 });
  const [status, setStatus] = useState('offline');
  const [isManualMode, setIsManualMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 

  // --- API LOGIC ---
  const saveToDb = async (lat, lng) => {
    setIsSaving(true);
    try {
      await api.post(`drivers/location/${driverId}`, { lat, lng, status: 'online' });
      console.log('✅ DB Updated:', lat, lng);
      // Small delay just to show the spinner effect
      setTimeout(() => setIsSaving(false), 500); 
    } catch (err) {
      console.error('Save failed', err);
      setIsSaving(false);
    }
  };

  // Throttled version for continuous GPS
  const throttledSave = useRef(throttle(saveToDb, 2000)).current;

  // 1. GPS Tracking
  useEffect(() => {
    if (!driverId || isManualMode) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        setStatus('GPS Active');
        throttledSave(latitude, longitude);
      },
      err => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [driverId, isManualMode]);

  // 2. Manual Drive Logic
  const moveCar = (dLat, dLng) => {
    const newPos = { lat: position.lat + dLat, lng: position.lng + dLng };
    setPosition(newPos);
    setStatus('Manual Mode');
    // We auto-save on move, but we also have the button below
    throttledSave(newPos.lat, newPos.lng);
  };

  const handleManualPush = () => {
    // Force immediate save without throttling
    saveToDb(position.lat, position.lng);
    alert("Location pushed to Database!");
  };

  return (
    <div className="relative h-screen w-full bg-gray-100 flex flex-col">
      
      {/* --- TOP HEADER (Glassmorphism) --- */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-center pointer-events-none">
         {/* Title */}
         <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-6 py-3 pointer-events-auto border border-gray-200">
            <h2 className="text-gray-800 font-bold text-lg flex items-center gap-2">
              🚗 Driver Console
              {isSaving && <span className="text-xs text-blue-500 animate-pulse">• Saving...</span>}
            </h2>
         </div>

         {/* Toggle Switch */}
         <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-4 py-2 pointer-events-auto border border-gray-200 flex items-center gap-3">
             <span className={`text-xs font-bold ${isManualMode ? 'text-gray-400' : 'text-green-600'}`}>GPS</span>
             
             {/* Custom Toggle UI */}
             <div 
               onClick={() => setIsManualMode(!isManualMode)}
               className={`w-12 h-6 rounded-full cursor-pointer p-1 transition-colors duration-300 ${isManualMode ? 'bg-blue-600' : 'bg-gray-300'}`}
             >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${isManualMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </div>

             <span className={`text-xs font-bold ${isManualMode ? 'text-blue-600' : 'text-gray-400'}`}>TEST</span>
         </div>
      </div>

      {/* --- BOTTOM CONTROLS (Only in Manual Mode) --- */}
      {isManualMode && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[1000] animate-in slide-in-from-bottom-5 fade-in duration-300">
            {/* The Gamepad Container */}
            <div className="bg-gray-900/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-gray-700 flex flex-col items-center gap-4">
                
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Manual Override</p>

                <div className="grid grid-cols-3 gap-3">
                    {/* UP */}
                    <div className="col-start-2">
                        <button onClick={() => moveCar(0.001, 0)} className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-all active:scale-95 text-xl">
                            ⬆️
                        </button>
                    </div>

                    {/* LEFT */}
                    <div className="col-start-1 row-start-2">
                        <button onClick={() => moveCar(0, -0.001)} className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-all active:scale-95 text-xl">
                            ⬅️
                        </button>
                    </div>

                    {/* CENTER (SAVE BUTTON) */}
                    <div className="col-start-2 row-start-2">
                        <button 
                            onClick={handleManualPush}
                            className="w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-blue-500/50 shadow-lg transition-all active:scale-90 border-2 border-blue-400"
                            title="Push Location to DB"
                        >
                            💾
                        </button>
                    </div>

                    {/* RIGHT */}
                    <div className="col-start-3 row-start-2">
                        <button onClick={() => moveCar(0, 0.001)} className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-all active:scale-95 text-xl">
                            ➡️
                        </button>
                    </div>

                    {/* DOWN */}
                    <div className="col-start-2 row-start-3">
                        <button onClick={() => moveCar(-0.001, 0)} className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-all active:scale-95 text-xl">
                            ⬇️
                        </button>
                    </div>
                </div>
                
                <div className="text-xs text-gray-500 font-mono">
                    Lat: {position.lat.toFixed(4)} | Lng: {position.lng.toFixed(4)}
                </div>
            </div>
        </div>
      )}

      {/* --- MAP --- */}
      <MapContainer 
        center={[position.lat, position.lng]} 
        zoom={15} 
        zoomControl={false} // We hid the default zoom buttons for a cleaner look
        style={{ height: "100%", width: "100%", zIndex: 0 }} 
      >
        <TileLayer
          // Use a cleaner, high-contrast map style (CartoDB Voyager)
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[position.lat, position.lng]} icon={carIcon}>
           <Popup className="custom-popup">Driver Location</Popup>
        </Marker>
        <RecenterMap lat={position.lat} lng={position.lng} />
      </MapContainer>
    </div>
  );
}


// // src/pages/DriverTracker.jsx
// import React, { useEffect, useState } from 'react';
// import api from '../api';

// export default function DriverTracker() {
//   // Read driverId once from localStorage
//   const driverId = localStorage.getItem('driverId');
//   const [position, setPosition] = useState({ lat: null, lng: null });
//   const [error, setError]       = useState(null);

//   useEffect(() => {
//     if (!driverId) {
//       setError('No driverId in localStorage');
//       return;
//     }

//     // Single-shot location fetch
//     navigator.geolocation.getCurrentPosition(
//       async ({ coords }) => {
//         const { latitude: lat, longitude: lng } = coords;
//         console.log('Got coords:', lat, lng);
//         setPosition({ lat, lng });

//         try {
//           // POST to your backend
//           await api.post(`/drivers/location/${driverId}`, { lat, lng });
//           console.log('Location saved successfully');
//         } catch (err) {
//           console.error('Failed to save location:', err);
//           setError('Network error: ' + err.message);
//         }
//       },
//       err => {
//         console.error('Geolocation error:', err);
//         setError('Geolocation error: ' + err.message);
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   }, [driverId]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Driver Tracker</h1>
//       {error && <p className="text-red-600">Error: {error}</p>}
//       {position.lat != null ? (
//         <div>
//           <p><strong>Latitude:</strong> {position.lat.toFixed(6)}</p>
//           <p><strong>Longitude:</strong> {position.lng.toFixed(6)}</p>
//         </div>
//       ) : (
//         <p>Obtaining location…</p>
//       )}
//     </div>
//   );
// }
