import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment } from '@mui/material';
import { DocumentUpload } from 'iconsax-react';

const ReportProofComponent = ({ label }: { label: string }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setImagePreview(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setInputValue('');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Typography variant='h6'>{label}</Typography>
      <TextField
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        className='w-full rounded-lg'
        placeholder='Nhập đường link hoặc tải lên ảnh minh chứng'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton component='label'>
                <DocumentUpload variant='Bold' />
                <input type='file' accept='image/*' hidden onChange={handleFileChange} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {imagePreview && (
        <Box mt={2}>
          <img src={imagePreview} alt='Preview' style={{ maxWidth: '100%' }} />
        </Box>
      )}
    </>
  );
};

export default ReportProofComponent;
