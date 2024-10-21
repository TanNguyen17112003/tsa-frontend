import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment } from '@mui/material';
import { DocumentUpload } from 'iconsax-react';
import { ProofImage } from 'src/types/report';

interface ReportProofComponentProps {
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, file?: File) => void;
  defaultValue?: string | ProofImage;
}

const ReportProofComponent = ({ label, onChange, defaultValue }: ReportProofComponentProps) => {
  const [inputValue, setInputValue] = useState<string | ProofImage>(defaultValue || '');
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof defaultValue === 'string' ? defaultValue : null
  );

  useEffect(() => {
    setInputValue(defaultValue || '');
    setImagePreview(typeof defaultValue === 'string' ? defaultValue : null);
  }, [defaultValue]);

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
        setInputValue(file.name);
        onChange(
          {
            target: {
              name: 'proof',
              value: reader.result as string
            }
          } as React.ChangeEvent<HTMLInputElement>,
          file
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Typography variant='h6'>{label}</Typography>
      <TextField
        type='text'
        value={typeof inputValue === 'string' ? inputValue : ''}
        onChange={handleInputChange}
        className='w-full rounded-lg'
        placeholder='Nhập đường link đến ảnh của bạn hoặc tải lên ảnh minh chứng'
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
