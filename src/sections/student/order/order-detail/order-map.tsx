import React, { useState, useEffect } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography
} from '@mui/material';
import { MapboxsApi } from 'src/api/mapboxs';
import { AddressItem } from 'src/types/mapbox';

function OrderMap() {
  const [searchText, setSearchText] = useState('');
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (searchText.trim() === '') {
        setAddresses([]);
        return;
      }
      setLoading(true);
      try {
        const response = await MapboxsApi.getAddresses(searchText);
        setAddresses(response.suggestions || []);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchAddresses();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  return (
    <div className='p-4'>
      <TextField
        label='Search Address'
        variant='outlined'
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className='mb-4'
      />
      {loading && <CircularProgress className='mb-4' />}
      <List className='bg-white rounded-lg shadow-lg'>
        {addresses.map((address, index) => (
          <ListItem key={index} className='hover:bg-gray-100 cursor-pointer'>
            <ListItemText primary={<Typography>{address.full_address}</Typography>} />
          </ListItem>
        ))}
      </List>
      <>{JSON.stringify(addresses)}</>
    </div>
  );
}

export default OrderMap;
