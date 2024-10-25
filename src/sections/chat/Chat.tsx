import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const socket = io('http://localhost:8000'); // Replace with your backend URL

const Chat = () => {
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');

  useEffect(() => {
    socket.on('receiveMessage', (payload) => {
      setMessages((prevMessages) => [...prevMessages, payload]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && sender.trim()) {
      const payload = { sender, message };
      socket.emit('sendMessage', payload);
      setMessage('');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant='h4' gutterBottom>
        Chat
      </Typography>
      <Paper sx={{ p: 2, mb: 2, maxHeight: '400px', overflow: 'auto' }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText primary={msg.message} secondary={msg.sender} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <TextField
        label='Your name'
        variant='outlined'
        fullWidth
        value={sender}
        onChange={(e) => setSender(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label='Your message'
        variant='outlined'
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant='contained' color='primary' onClick={handleSendMessage}>
        Send
      </Button>
    </Box>
  );
};

export default Chat;
