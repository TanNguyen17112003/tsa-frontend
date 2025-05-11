import { Dialog, DialogTitle, DialogActions, Button, DialogProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useRef } from 'react';
import Map, { Marker, Source, Layer, MapRef } from 'react-map-gl';

function MapDialog({
  onConfirm,
  longitude,
  latitude,
  ...dialogProps
}: DialogProps & {
  onConfirm?: () => Promise<void>;
  longitude: number;
  latitude: number;
}) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<MapRef | null>(null);

  return (
    <Dialog fullWidth maxWidth='md' {...dialogProps}>
      <DialogTitle>
        <Typography variant='h6'>Map Location</Typography>
      </DialogTitle>

      <Box sx={{ height: '400px', width: '100%' }}>
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: longitude,
            latitude: latitude,
            zoom: 17,
            pitch: 60,
            bearing: -60
          }}
          attributionControl={false}
          style={{ width: '100%', height: '100%' }}
          mapStyle='mapbox://styles/quancao2310/cm2zqn7lb000a01o25jafeyvq'
          onLoad={() => setMapLoaded(true)}
        ></Map>
      </Box>

      <DialogActions className='flex justify-center'>
        <Button
          variant='contained'
          color='error'
          onClick={(e: React.MouseEvent) => {
            dialogProps.onClose?.(e, 'escapeKeyDown');
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MapDialog;
