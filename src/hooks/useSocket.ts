import { useCallback, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  user: string;
  text: string;
  timeStamp: string;
  system?: boolean;
}

export const useSocket = (username: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  const addSystemMessage = useCallback((text: string) => {
    setMessage((prev) => [
      ...prev,
      {
        id: uuidv4(),
        user: 'System',
        text,
        timeStamp: new Date().toISOString(),
        system: true,
      },
    ]);
  }, []);

  useEffect(() => {
    const socketIo = io();

    socketIo.on('connect', () => {
      setConnected(true);
      socketIo.emit('user joined', username);
    });

    socketIo.on('disconnect', () => {
      setConnected(false);
    });

    socketIo.on('chat-message', (msg: Message) => {
      setMessage((prev) => [...prev, msg]);

      if (Notification.permission === 'granted' && msg.user !== username) {
        new Notification(`New Message From ${msg.user}:`, {
          body: msg.text,
        });
      }
    });

    socketIo.on('update users', (updatedUsers: string[]) => {
      setUsers(updatedUsers);
    });

    socketIo.on('user joined', (name: string) => {
      addSystemMessage(`${name} has joined the chat`);
    });

    socketIo.on('user left', (name: string) => {
      addSystemMessage(`${name} has left the chat`);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [username, addSystemMessage]);

  const sendMessage = (text: string) => {
    if (socket) {
      socket.emit('send-message', {
        message: text,
        sender: username,
      });
    }
  };

  return { connected, message, sendMessage, users };
};
