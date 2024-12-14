import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Box, Typography, Stack, Tooltip, IconButton } from '@mui/material';
import { MapboxsApi } from 'src/api/mapboxs';
import Map, { Marker, Source, Layer, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import shipperImage from 'public/ui/background-auth.png';
import studentImage from 'public/ui/student-location.png';
import { OrderDetail } from 'src/types/order';
import { coordinateList } from 'src/utils/coordinate-list';
import { useSocketContext } from 'src/contexts/socket-client/socket-client-context';
import { GpsFixed } from '@mui/icons-material';
import { InfoCircle } from 'iconsax-react';
import { useDialog } from '@hooks';
import OrderDeliveryDialog from 'src/sections/mobile/student/order/order-delivery-dialog';
const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoicXVhbmNhbzIzMTAiLCJhIjoiY20yNXMxZ3BlMGRpMjJ3cWR5ZTMyNjh2MCJ9.ILNCWFtulso1GeCR7OBz-w';

const OrderMap: React.FC<{ order: OrderDetail }> = ({ order }) => {
  const mapRef = useRef<MapRef>(null);
  const [direction, setDirection] = useState<any>(null);
  const [shipperCoordinate, setShipperCoordinate] = useState<[number, number] | null>([
    106.806709613827, 10.877568988757174
  ]);
  const [distance, setDistance] = useState<number>(0);

  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { socket } = useSocketContext();
  const deliveryHistoryDialog = useDialog<OrderDetail>();

  const exactOrderLocation = useMemo(() => {
    const foundCoordinate = coordinateList.find((coordinate) => {
      return (
        order?.building === coordinate.address[0] && order?.dormitory === coordinate.address[1]
      );
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
          setDistance(Math.round(direction.routes[0].distance));
        }
      } catch (error) {
        console.error('Error fetching direction:', error);
      }
    };

    if (shipperCoordinate && exactOrderLocation) {
      fetchDirection();
    }
  }, [shipperCoordinate, exactOrderLocation, setDistance, setDirection, setRouteCoordinates]);

  useEffect(() => {
    if (socket && order?.shipperId) {
      socket.emit('subscribeToShipper', { shipperId: order?.shipperId });
      console.log(`Subscribed to shipper with ID ${order?.shipperId}`);

      socket.on(
        'locationUpdate',
        (data: { shipperId: string; latitude: number; longitude: number }) => {
          setShipperCoordinate([Number(data.latitude), Number(data.longitude)]);
          console.log(`Received location update: ${JSON.stringify(data)}`);
        }
      );
    }
  }, [order?.shipperId, socket]);

  useEffect(() => {
    if (mapRef.current && exactOrderLocation && shipperCoordinate) {
      const bounds: [number, number, number, number] = [
        Math.min(shipperCoordinate[0], exactOrderLocation[1]),
        Math.min(shipperCoordinate[1], exactOrderLocation[0]),
        Math.max(shipperCoordinate[0], exactOrderLocation[1]),
        Math.max(shipperCoordinate[1], exactOrderLocation[0])
      ];
      mapRef.current.fitBounds(bounds, { padding: 50, duration: 1000 });
    }
  }, [exactOrderLocation, shipperCoordinate]);

  useEffect(() => {
    console.log('shipperCoordinate:', shipperCoordinate);
  }, [shipperCoordinate]);

  const directionCoordinates = useMemo(
    () => direction?.routes[0]?.geometry?.coordinates,
    [direction]
  );

  const handleRecenter = () => {
    if (mapRef.current && exactOrderLocation) {
      mapRef.current.flyTo({
        center: [exactOrderLocation[1], exactOrderLocation[0]],
        zoom: 17,
        pitch: 60,
        bearing: -60,
        essential: true
      });
    }
  };

  const handleViewHistoryDialog = useCallback(() => {
    deliveryHistoryDialog.handleOpen(order);
  }, [order, deliveryHistoryDialog]);
  return (
    <Box className='h-full'>
      <Box className='w-full h-full relative'>
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: exactOrderLocation ? exactOrderLocation[1] : 106.80703872956525,
            latitude: exactOrderLocation ? exactOrderLocation[0] : 10.878102666077439,
            zoom: 17,
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
        <Stack className='absolute top-3 left-3' direction={'row'} gap={1}>
          <Tooltip title='Quay trở lại vị trí đơn hàng'>
            <IconButton className=' bg-white rounded-full shadow-md' onClick={handleRecenter}>
              <GpsFixed color='primary' fontSize='large' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Theo dõi lịch sử đơn hàng'>
            <IconButton
              className=' bg-white rounded-full shadow-md'
              onClick={handleViewHistoryDialog}
            >
              <InfoCircle color='blue' size={32} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack
          direction={'row'}
          alignItems={'center'}
          gap={0.5}
          marginBottom={1}
          className='absolute right-3 top-3 bg-orange-500 px-3 py-2 rounded-lg'
        >
          <Typography color='white'>Khoảng cách:</Typography>
          <Typography fontWeight={'bold'} color='white'>
            {(distance / 1000).toFixed(2)} km
          </Typography>
        </Stack>
      </Box>
      <OrderDeliveryDialog
        order={order}
        open={deliveryHistoryDialog.open}
        onClose={deliveryHistoryDialog.handleClose}
      />
    </Box>
  );
};

export default OrderMap;
