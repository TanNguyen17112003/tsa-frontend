import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { MapboxsApi } from 'src/api/mapboxs';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import shipperImage from 'public/ui/background-auth.png';
import studentImage from 'public/ui/student-location.png';
import { OrderDetail } from 'src/types/order';
import { coordinateList } from 'src/utils/coordinate-list';
import { useSocketContext } from 'src/contexts/socket-client/socket-client-context';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoicXVhbmNhbzIzMTAiLCJhIjoiY20yNXMxZ3BlMGRpMjJ3cWR5ZTMyNjh2MCJ9.ILNCWFtulso1GeCR7OBz-w';

const OrderMap: React.FC<{ order: OrderDetail }> = ({ order }) => {
  const [direction, setDirection] = useState<any>(null);
  const [shipperCoordinate, setShipperCoordinate] = useState<[number, number]>([
    106.80712035274313, 10.878177113714147
  ]);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { socket } = useSocketContext();

  const exactOrderLocation = useMemo(() => {
    const foundCoordinate = coordinateList.find((coordinate) => {
      return order.building === coordinate.address[0] && order.dormitory === coordinate.address[1];
    });
    return foundCoordinate?.value;
  }, [order, coordinateList]);

  useEffect(() => {
    const fetchDirection = async () => {
      try {
        if (shipperCoordinate && exactOrderLocation) {
          const direction = await MapboxsApi.getDirection(
            { latitude: shipperCoordinate[1], longitude: shipperCoordinate[0] },
            { latitude: exactOrderLocation[0], longitude: exactOrderLocation[1] }
          );
          setDirection(direction);
          setRouteCoordinates(direction.routes[0].geometry.coordinates);
        }
      } catch (error) {
        console.error('Error fetching direction:', error);
      }
    };

    if (shipperCoordinate && exactOrderLocation) {
      fetchDirection();
    }
  }, [shipperCoordinate, exactOrderLocation]);

  useEffect(() => {
    if (socket && order.shipperId) {
      socket.emit('subscribeToShipper', { shipperId: order.shipperId });
      console.log(`Subscribed to shipper with ID ${order.shipperId}`);

      socket.on(
        'locationUpdate',
        (data: { shipperId: string; latitude: number; longitude: number }) => {
          setShipperCoordinate([Number(data.latitude), Number(data.longitude)]);
          console.log(`Received location update: ${JSON.stringify(data)}`);
        }
      );
    }
  }, [socket, order.shipperId]);

  const directionCoordinates = useMemo(
    () => direction?.routes[0]?.geometry?.coordinates,
    [direction]
  );

  return (
    <Box className='p-4'>
      <Stack direction={'row'} alignItems={'center'} gap={1} marginBottom={1}>
        <Typography>Địa chỉ đơn hàng #{order.checkCode}:</Typography>
        <Typography fontWeight={'bold'}>
          Phòng {order.room}, Tòa {order.building}, Kí túc xá khu {order.dormitory}
        </Typography>
      </Stack>
      <Box className='w-full h-96'>
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: exactOrderLocation ? exactOrderLocation[1] : 106.80703872956525,
            latitude: exactOrderLocation ? exactOrderLocation[0] : 10.878102666077439,
            zoom: 14,
            pitch: 60,
            bearing: -60
          }}
          attributionControl={false}
          style={{ width: '100%', height: '100%' }}
          mapStyle='mapbox://styles/quancao2310/cm2zqn7lb000a01o25jafeyvq'
          onLoad={() => setMapLoaded(true)}
        >
          {mapLoaded && directionCoordinates && (
            <Source
              id='routeSource'
              type='geojson'
              data={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: directionCoordinates
                },
                properties: {}
              }}
            >
              <Layer
                id='routeLayer'
                type='line'
                paint={{
                  'line-color': 'blue',
                  'line-width': 3
                }}
              />
            </Source>
          )}
          {mapLoaded && (
            <>
              <Source id='terrainSource' type='raster-dem' url='mapbox://mapbox.terrain-rgb' />
              <Layer
                id='terrainLayer'
                type='hillshade'
                source='terrainSource'
                paint={{
                  'hillshade-exaggeration': 0.5
                }}
              />
              <Layer
                id='skyLayer'
                type='sky'
                paint={{
                  'sky-type': 'atmosphere',
                  'sky-atmosphere-sun': [0.0, 0.0],
                  'sky-atmosphere-sun-intensity': 15
                }}
              />
              {shipperCoordinate && (
                <Marker longitude={shipperCoordinate[0]} latitude={shipperCoordinate[1]}>
                  <div className='marker'>
                    <img src={shipperImage.src} alt='Shipper' className='w-12 h-12' />
                  </div>
                </Marker>
              )}
              {exactOrderLocation && (
                <Marker longitude={exactOrderLocation[1]} latitude={exactOrderLocation[0]}>
                  <div className='marker'>
                    <img src={studentImage.src} alt='Order' className='w-12 h-12' />
                  </div>
                </Marker>
              )}
            </>
          )}
        </Map>
      </Box>
    </Box>
  );
};

export default OrderMap;
