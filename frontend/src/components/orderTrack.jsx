import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

// --- 1. DEFINE DISTINCT ICONS ---

// 🚗 Red Sports Car for Driver
const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097136.png', // Or your preferred car image
  iconSize: [50, 50],
  iconAnchor: [25, 25], // Center of the image
  popupAnchor: [0, -20]
});

// 🏠 Blue House for Customer
const homeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1946/1946436.png', // Blue House Icon
  iconSize: [45, 45],
  iconAnchor: [22, 45], // Bottom center (pin point)
  popupAnchor: [0, -45]
});

// --- Helper: Smoothly Fly to Driver ---
function MapRecenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    // Only fly if the distance is significant to avoid jitter
    map.flyTo([lat, lng], 15, { duration: 1.5 });
  }, [lat, lng, map]);
  return null;
}

export default function OrderTracker({ driverId, customerLocation, initialDriverPos }) {
  // Initialize driver position from props if available
  const [driverPos, setDriverPos] = useState(initialDriverPos);
  const [eta, setEta] = useState('Calculating...');
  const socketRef = useRef();

  useEffect(() => {
    if (!driverId) return;

    // Connect to Socket
    socketRef.current = io('http://localhost:3007'); // Update with your backend URL
    socketRef.current.emit('joinDriverRoom', `driver_${driverId}`);

    // Listen for live updates
    // Listen for live updates
    socketRef.current.on('driverLocation', (data) => {
        console.log("🚗 Socket received location:", data);
        setDriverPos({ lat: data.lat, lng: data.lng });
        
        // Simple ETA calculation (Euclidean distance for demo)
        const dist = Math.sqrt(
          Math.pow(data.lat - customerLocation.lat, 2) + 
          Math.pow(data.lng - customerLocation.lng, 2)
        );
        // Rough estimate: 1 degree ~ 111km. Assuming 30km/h speed. 
        // This is just a visual mock for now.
        const mins = Math.ceil(dist * 1000); 
        setEta(`${mins} min`);
    });

    return () => socketRef.current.disconnect();
  }, [driverId, customerLocation]);

  return (
    <div className="relative h-full w-full bg-gray-50">
      <MapContainer 
        // Center on driver if we have them, otherwise center on house
        center={driverPos ? [driverPos.lat, driverPos.lng] : [customerLocation.lat, customerLocation.lng]} 
        zoom={13} 
        zoomControl={false}
        className="h-full w-full z-0"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {/* 🏠 STATIC MARKER: Customer House */}
        <Marker position={[customerLocation.lat, customerLocation.lng]} icon={homeIcon}>
          <Popup>
            <div className="text-center">
              <span className="font-bold">Destination</span><br/>
              Your Dropoff Point
            </div>
          </Popup>
        </Marker>

        {/* 🚗 DYNAMIC MARKER: Driver Car */}
        {driverPos && (
          <>
            <Marker position={[driverPos.lat, driverPos.lng]} icon={carIcon}>
                <Popup>Driver is here</Popup>
            </Marker>
            {/* Auto-follow the driver */}
            <MapRecenter lat={driverPos.lat} lng={driverPos.lng} />
          </>
        )}
      </MapContainer>

      {/* Info Card */}
      <div className="absolute bottom-6 left-4 right-4 z-[999]">
          <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                    ⏱️
                  </div>
                  <div>
                      <h3 className="font-bold text-gray-800 text-sm">
                        {driverPos ? `Arriving in ~${eta}` : "Waiting for location..."}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Map updates live
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}










// import React, { useEffect, useState, useRef } from 'react';
// import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
// import io from 'socket.io-client';
// import api from '../api';
// import { GOOGLE_MAPS_LIBRARIES }           from './googleMaps';

// export default function OrderTracker({ orderId }) {
//   const [pos, setPos]       = useState(null);
//   const [status, setStatus] = useState('');
//   const socketRef           = useRef();
//   const mapRef              = useRef();

//   // 1) Load Maps + marker library
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: 'AIzaSyDDXX_rlmBJNTpQaxrEtui0OreHE-WN0CA',
//     libraries: GOOGLE_MAPS_LIBRARIES,   
//   });

//   // 2) Fetch initial status + location
//   useEffect(() => {
//     api.get(`/orders/status/${orderId}`)
//        .then(res => {
//          setStatus(res.data.status);
//          setPos({ lat: res.data.current_lat, lng: res.data.current_lng });
//        })
//        .catch(console.error);
//   }, [orderId]);

//   // 3) WebSocket live updates
//   useEffect(() => {
//     socketRef.current = io('https://shopease-ecommerce-app-jv4u.onrender.com');
//     socketRef.current.emit('joinRoom', `order_${orderId}`);
//     socketRef.current.on('locationUpdate', data => {
//       setPos({ lat: data.lat, lng: data.lng });
//       setStatus(data.status || status);
//     });
//     return () => socketRef.current.disconnect();
//   }, [orderId, status]);

//   // 4) When map, position & API are ready, add an AdvancedMarkerElement
//   useEffect(() => {
//     if (!isLoaded || !mapRef.current || !pos) return;

//     // Use the new AdvancedMarkerElement API :contentReference[oaicite:3]{index=3}
//     google.maps.importLibrary('marker').then(({ AdvancedMarkerElement }) => {
//       new AdvancedMarkerElement({
//         map: mapRef.current,
//         position: pos,
//         title: `Order ${orderId}`,
//       });
//     });
//   }, [isLoaded, pos, orderId]);

//   if (!isLoaded || !pos) return <p>Loading map…</p>;

//   return (
//     <div>
//       <h2>Order #{orderId} is {status}</h2>
//       <GoogleMap
//         onLoad={map => (mapRef.current = map)}
//         center={pos}
//         zoom={14}
//         mapContainerStyle={{ height: '400px', width: '100%' }}
//         options={{ mapId: 'API key 2' }}  
//       />
//     </div>
//   );
// }
