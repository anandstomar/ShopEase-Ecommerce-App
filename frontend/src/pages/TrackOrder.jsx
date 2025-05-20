import React, { useEffect, useState } from 'react';
import { useParams }            from 'react-router-dom';
import OrderTracker             from '../components/OrderTrack';
import EmbedMap                 from '../components/EmbedMaps';
import api                      from '../api';

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const [pos, setPos] = useState(null);

  // Fetch the “canonical” order location once
  useEffect(() => {
    async function fetchInitialPos() {
      try {
        const res = await api.get(`/orders/status/${orderId}`);
        console.log('Initial:', res.data);
        console.log('Initial position:', res.data.current_lat, res.data.current_lng);
        setPos({ lat: res.data.current_lat, lng: res.data.current_lng });
      } catch (err) {
        console.error('Failed to fetch initial position:', err);
      }
    }
    fetchInitialPos();
  }, [orderId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Track Order #{orderId}</h2>

      {/* Primary: real-time JS map
      <div className="h-96 mb-6">
        <OrderTracker orderId={orderId} />
      </div> */}

      {/* Fallback/Static Embed */}
      {pos && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick View</h3>
          <EmbedMap
            // No placeId: we’re using raw coordinates
            query={`${pos.lat},${pos.lng}`}
            zoom={15}
            height="300px"
          />
        </div>
      )}
    </div>
  );
}







// import React from 'react';
// import { useParams } from 'react-router-dom';
// import OrderTracker from '../components/OrderTrack';

// export default function TrackOrderPage() {
//   const { orderId } = useParams();

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Track Order #{orderId}</h2>
//       <div className="h-96">
//         <OrderTracker orderId={orderId} />
//       </div>
//     </div>
//   );
// }
