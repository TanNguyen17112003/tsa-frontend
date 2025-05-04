import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
  useContext,
  useMemo
} from 'react';
import { io, Socket } from 'socket.io-client';
import CookieHelper, { CookieKeys } from 'src/utils/cookie-helper';

// const SOCKET_SERVER_URL = 'https://2nzxg168-8000.asse.devtunnels.ms';
const SOCKET_SERVER_URL = 'https://api.transportsupport.systems';

interface ContextValue {
  socket: Socket | null;
  sendMessage: (message: string) => void;
}

export const SocketContext = createContext<ContextValue>({
  socket: null,
  sendMessage: () => {}
});

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const accessToken = useMemo(() => {
    return CookieHelper.getItem(CookieKeys.TOKEN);
  }, []);

  useEffect(() => {
    console.log(accessToken);
    const newSocket = io(SOCKET_SERVER_URL, {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [accessToken]);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error.message);
      if (error.status === 401) {
        alert('Session expired or unauthorized. Please log in again.');
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
    };
  }, [socket]);

  const sendMessage = useCallback(
    (message: string) => {
      if (socket) {
        socket.emit('message', message);
      }
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        sendMessage
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);

export default SocketProvider;
