import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material';
import { MapboxsApi } from 'src/api/mapboxs';
import { AddressItem } from 'src/types/mapbox';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import shipperImage from 'public/ui/background-auth.png';
import studentImage from 'public/ui/student-location.png';
import { color } from '@mui/system';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoicXVhbmNhbzIzMTAiLCJhIjoiY20yNXMxZ3BlMGRpMjJ3cWR5ZTMyNjh2MCJ9.ILNCWFtulso1GeCR7OBz-w';

function OrderMap() {
  const [direction, setDirection] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  const shipperCoordinate = [106.80660217405375, 10.877388183554231];

  useEffect(() => {
    const fetchCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation([longitude, latitude]);
          },
          (error) => {
            console.error('Error fetching current location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchDirection = async () => {
      try {
        if (currentLocation) {
          const direction = await MapboxsApi.getDirection(
            { latitude: currentLocation[1], longitude: currentLocation[0] },
            { latitude: shipperCoordinate[1], longitude: shipperCoordinate[0] }
          );
          setDirection(direction);
        }
      } catch (error) {
        console.error('Error fetching direction:', error);
      }
    };

    if (currentLocation) {
      fetchDirection();
    }
  }, [currentLocation, shipperCoordinate]);

  const directionCoordinates = direction?.routes[0]?.geometry?.coordinates;

  return (
    <Box className='p-4'>
      <Box className='w-full h-96'>
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: currentLocation ? currentLocation[0] : 106.80703872956525,
            latitude: currentLocation ? currentLocation[1] : 10.878102666077439,
            zoom: 14,
            pitch: 60,
            bearing: -60
          }}
          attributionControl={false}
          style={{ width: '100%', height: '100%' }}
          mapStyle='mapbox://styles/quancao2310/cm2zqn7lb000a01o25jafeyvq'
        >
          {directionCoordinates && (
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
          {currentLocation && (
            <Marker longitude={currentLocation[0]} latitude={currentLocation[1]}>
              <div className='marker'>
                <img src={studentImage.src} alt='Student' className='w-12 h-12' />
              </div>
            </Marker>
          )}
          <Marker longitude={shipperCoordinate[0]} latitude={shipperCoordinate[1]}>
            <div className='marker'>
              <img src={shipperImage.src} alt='Shipper' className='w-12 h-12' />
            </div>
          </Marker>
        </Map>
      </Box>
    </Box>
  );
}

export default OrderMap;
