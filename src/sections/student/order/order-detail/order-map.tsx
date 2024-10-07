import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, Typography, Stack } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false
});
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

const DefaultIcon = L.icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function OrderMap() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant='h6'>Vị trí hiện tại của bạn</Typography>
      <Card className='p-4'>
        {position ? (
          <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>Bạn đang ở đây.</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <Typography variant='body2'>Đang xác định vị trí...</Typography>
        )}
      </Card>
    </Stack>
    // <></>
  );
}

export default OrderMap;
