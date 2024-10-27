import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

interface UploadImageDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadImageDialog: React.FC<UploadImageDialogProps> = ({ open, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tải hình ảnh mới</DialogTitle>
      <DialogContent>
        <input type='file' onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleUpload} color='primary'>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadImageDialog;
