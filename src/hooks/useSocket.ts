import { useEffect, useState} from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = () => {
    const [socket , setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState<string[]>([]) 

    useEffect(() => {
        const socketIo = io();

        socketIo.on('connect', () => {
            setConnected(true);
        });

        socketIo.on('disconnect',()=> {
            setConnected(false)
        })

        socketIo.on('chat message', (msg:string) => {
            setMessage((prevMessages) => [...prevMessages, msg]);
        })

        setSocket(socketIo);

        return () => {
            socketIo.disconnect();
        }
    },[])

    const sendMessage = (msg: string) => {
        if(socket) {
            socket.emit('chat message', msg);
        }
    }

    return {connected, message, sendMessage}

}