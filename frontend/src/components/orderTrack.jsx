import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import io from 'socket.io-client';
import api from '../api';
import { GOOGLE_MAPS_LIBRARIES }           from '../../public/googleMaps';

export default function OrderTracker({ orderId }) {
  const [pos, setPos]       = useState(null);
  const [status, setStatus] = useState('');
  const socketRef           = useRef();
  const mapRef              = useRef();

  // 1) Load Maps + marker library
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDDXX_rlmBJNTpQaxrEtui0OreHE-WN0CA',
    libraries: GOOGLE_MAPS_LIBRARIES,   
  });

  // 2) Fetch initial status + location
  useEffect(() => {
    api.get(`/orders/status/${orderId}`)
       .then(res => {
         setStatus(res.data.status);
         setPos({ lat: res.data.current_lat, lng: res.data.current_lng });
       })
       .catch(console.error);
  }, [orderId]);

  // 3) WebSocket live updates
  useEffect(() => {
    socketRef.current = io('http://localhost:3007');
    socketRef.current.emit('joinRoom', `order_${orderId}`);
    socketRef.current.on('locationUpdate', data => {
      setPos({ lat: data.lat, lng: data.lng });
      setStatus(data.status || status);
    });
    return () => socketRef.current.disconnect();
  }, [orderId, status]);

  // 4) When map, position & API are ready, add an AdvancedMarkerElement
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !pos) return;

    // Use the new AdvancedMarkerElement API :contentReference[oaicite:3]{index=3}
    google.maps.importLibrary('marker').then(({ AdvancedMarkerElement }) => {
      new AdvancedMarkerElement({
        map: mapRef.current,
        position: pos,
        title: `Order ${orderId}`,
      });
    });
  }, [isLoaded, pos, orderId]);

  if (!isLoaded || !pos) return <p>Loading map…</p>;

  return (
    <div>
      <h2>Order #{orderId} is {status}</h2>
      <GoogleMap
        onLoad={map => (mapRef.current = map)}
        center={pos}
        zoom={14}
        mapContainerStyle={{ height: '400px', width: '100%' }}
        options={{ mapId: 'API key 2' }}  
      />
    </div>
  );
}
