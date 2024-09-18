import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment } from '@mui/material';
import { DocumentUpload } from 'iconsax-react';
import { ProofImage } from 'src/types/report';

interface ReportProofComponentProps {
  label: string;
  value: string | ProofImage;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ReportProofComponent = ({ label, value, onChange }: ReportProofComponentProps) => {
  const [inputValue, setInputValue] = useState<string | ProofImage>(value);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setImagePreview(null);
    onChange(event);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setInputValue('');
        onChange({
          target: {
            name: 'proof',
            value: reader.result as string
          }
        } as React.ChangeEvent<HTMLInputElement>);
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
