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
import useAppSnackbar from 'src/hooks/use-app-snackbar';
import { useDialog } from '@hooks';
import { useRouter } from 'next/router';
import OrderDeliveryDialog from 'src/sections/mobile/student/order/order-delivery-dialog';
import OrderSucceedDialog from 'src/sections/mobile/student/order/order-succeed-dialog';
import { paths } from 'src/paths';

const OrderMap: React.FC<{ order: OrderDetail }> = ({ order }) => {
  const mapRef = useRef<MapRef>(null);
  const router = useRouter();
  const { showSnackbarSuccess } = useAppSnackbar();
  const [direction, setDirection] = useState<any>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [shipperCoordinate, setShipperCoordinate] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number>(-1);

  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { socket } = useSocketContext();
  const deliveryHistoryDialog = useDialog<OrderDetail>();
  const successDeliveryDialog = useDialog();

  const exactOrderLocation = useMemo(() => {
    const foundCoordinate = coordinateList.find((coordinate) => {
      return (
        order?.building === coordinate.address[0] && order?.dormitory === coordinate.address[1]
      );
    });
    return foundCoordinate?.value;
  }, [order, coordinateList]);

  const handleClickVerified = useCallback(() => {
    setVerified(true);
    successDeliveryDialog.handleClose();
  }, [successDeliveryDialog]);

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
    const intervalId: NodeJS.Timeout | null = null;

    if (socket && order?.shipperId) {
      socket.emit('subscribeToShipper', { shipperId: order?.shipperId });
      console.log(`Subscribed to shipper with ID ${order?.shipperId}`);

      const handleLocationUpdate = async (data: {
        shipperId?: string;
        latitude?: number;
        longitude?: number;
        isFinished: boolean;
      }) => {
        setShipperCoordinate([Number(data?.longitude), Number(data?.latitude)]);
        if (data.isFinished) {
          await showSnackbarSuccess('Đơn hàng đã được giao thành công');
          setTimeout(() => {
            router.push(paths.student.order.index);
          }, 2000);
        }
        console.log(`Received location update: ${JSON.stringify(data)}`);
      };

      socket.on('locationUpdate', handleLocationUpdate);

      // intervalId = setInterval(() => {
      //   socket.emit('requestLocationUpdate', { shipperId: order?.shipperId });
      // }, 5000);
    }

    // return () => {
    //   if (intervalId) {
    //     clearInterval(intervalId);
    //   }
    //   socket?.off('locationUpdate');
    // };
    return () => {
      socket?.off('locationUpdate');
      socket?.emit('unsubscribeFromShipper', { shipperId: order?.shipperId });
      console.log(`Unsubscribed to shipper with ID ${order?.shipperId}`);
    };
  }, [order?.shipperId, socket]);

  useEffect(() => {
    if (distance <= 100 && !verified && shipperCoordinate) {
      successDeliveryDialog.handleOpen();
    }
  }, [distance, verified]);

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
    <>
      <Box className='absolute top-10 left-10'>{distance >= 0 ? distance : 'Loading...'}</Box>
      <Box className='h-full'>
        <Box className='w-full h-full relative'>
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
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
              {(distance / 1000).toFixed(2).startsWith('-')
                ? (distance / 1000).toFixed(2).slice(1)
                : (distance / 1000).toFixed(2)}{' '}
              km
            </Typography>
          </Stack>
        </Box>
        <OrderDeliveryDialog
          order={order}
          open={deliveryHistoryDialog.open}
          onClose={deliveryHistoryDialog.handleClose}
        />
        {/* <OrderSucceedDialog
          open={successDeliveryDialog.open}
          onClose={successDeliveryDialog.handleClose}
          onConfirm={handleClickVerified}
        /> */}
      </Box>
    </>
  );
};

export default OrderMap;
