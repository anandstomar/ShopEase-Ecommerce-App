
import React from 'react';

const EmbedMap = ({ query = '', placeId, zoom = 14, width = '100%', height = '400px' }) => {
  const apiKey = "AIzaSyDDXX_rlmBJNTpQaxrEtui0OreHE-WN0CA"; // set in your .env
  let src = 'https://www.google.com/maps/embed/v1/';

  if (placeId) {
    src += `place?key=${apiKey}&q=place_id:${placeId}&zoom=${zoom}`;
  } else {
    src += `search?key=${apiKey}&q=${encodeURIComponent(query)}&zoom=${zoom}`;
  }

  return (
    <iframe
      title="Embedded map"
      width={width}
      height={height}
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={src}
    ></iframe>
  );
};

export default EmbedMap;
