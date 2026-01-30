import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import OrderTracker from '../components/orderTrack';

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const res = await api.get(`/orders/status/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div className="p-10 text-center">Loading Order...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">Order not found</div>;

  // 1. STRICTLY define the Customer's Home (Dropoff Location)
  // If dropoff is null (testing), use a fixed fallback location (e.g. City Center)
  // DO NOT use current_lat here, or the house will move!
  const customerLat = order.dropoff_lat ? parseFloat(order.dropoff_lat) : 22.6017; 
  const customerLng = order.dropoff_lng ? parseFloat(order.dropoff_lng) : 75.6834;

  // 2. Define Driver's Initial Position (if they have one)
  const initialDriverLat = order.current_lat ? parseFloat(order.current_lat) : null;
  const initialDriverLng = order.current_lng ? parseFloat(order.current_lng) : null;

  return (
    <div className="h-screen w-full relative">
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full z-20 bg-gradient-to-b from-black/60 to-transparent p-4 text-white pointer-events-none">
            <h1 className="text-2xl font-bold">Order #{orderId}</h1>
            <p className="text-sm opacity-90">
               {order.driver_id ? "Driver is on the way" : "Looking for a driver..."}
            </p>
        </div>

        {/* The Map */}
        <div className="h-full w-full">
            <OrderTracker 
                driverId={order.driver_id} 
                customerLocation={{ lat: customerLat, lng: customerLng }}
                initialDriverPos={initialDriverLat ? { lat: initialDriverLat, lng: initialDriverLng } : null}
            />
        </div>
    </div>
  );
}








// import React, { useEffect, useState } from 'react';
// import { useParams }            from 'react-router-dom';
// import OrderTracker             from '../components/orderTrack';
// import EmbedMap                 from '../components/EmbedMaps';
// import api                      from '../api';

// export default function TrackOrderPage() {
//   const { orderId } = useParams();
//   const [pos, setPos] = useState(null);

//   // Fetch the “canonical” order location once
//   useEffect(() => {
//     async function fetchInitialPos() {
//       try {
//         const res = await api.get(`/orders/status/${orderId}`);
//         console.log('Initial:', res.data);
//         console.log('Initial position:', res.data.current_lat, res.data.current_lng);
//         setPos({ lat: res.data.current_lat, lng: res.data.current_lng });
//       } catch (err) {
//         console.error('Failed to fetch initial position:', err);
//       }
//     }
//     fetchInitialPos();
//   }, [orderId]);

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Track Order #{orderId}</h2>

//       {/* Primary: real-time JS map
//       <div className="h-96 mb-6">
//         <OrderTracker orderId={orderId} />
//       </div> */}

//       {/* Fallback/Static Embed */}
//       {pos && (
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Quick View</h3>
//           <EmbedMap
//             // No placeId: we’re using raw coordinates
//             query={`${pos.lat},${pos.lng}`}
//             zoom={15}
//             height="300px"
//           />
//         </div>
//       )}
//     </div>
//   );
// }







// // import React from 'react';
// // import { useParams } from 'react-router-dom';
// // import OrderTracker from '../components/OrderTrack';

// // export default function TrackOrderPage() {
// //   const { orderId } = useParams();

// //   return (
// //     <div className="p-6 max-w-3xl mx-auto">
// //       <h2 className="text-2xl font-bold mb-4">Track Order #{orderId}</h2>
// //       <div className="h-96">
// //         <OrderTracker orderId={orderId} />
// //       </div>
// //     </div>
// //   );
// // }
