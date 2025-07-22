    import { useCallback, useEffect, useState} from 'react';
    import io, { Socket } from 'socket.io-client';
    import { v4 as uuidv4} from 'uuid'

    interface Message {
        id: string;
        user: string;
        text: string;
        timeStamp: string;
        roomId?: string;
        system?: boolean;
    }

    export const useSocket = (username: string) => {
        const [socket , setSocket] = useState<Socket | null>(null);
        const [connected, setConnected] = useState(false);
        const [message, setMessage] = useState<Message[]>([]) 
        const [users, setUsers] = useState<string[]>([])

        const addSystemMessage = useCallback((text: string, roomId?: string) => {
            setMessage((prevMessage) => [
                ...prevMessage,
                {
                    id: uuidv4(),
                    user: 'System',
                    text,
                    timeStamp: new Date().toISOString(),
                    roomId,
                    system: true,
                }
            ]);
        }, []);



        useEffect(() => {
            const socketIo = io();

            socketIo.on('connect', () => {
                setConnected(true);
                socketIo.emit('user joined', username)
            });

            socketIo.on('disconnect',()=> {
                setConnected(false)
            })

            socketIo.on('chat message', (msg: Message) => {
                setMessage((prevMessages) => [...prevMessages, msg]);
            })

            socketIo.on('update users', (updatedUsers: string[]) => {
                setUsers(updatedUsers)
            })

            socketIo.on('user joined',(joinedUsername: string) => {
                addSystemMessage(`${joinedUsername} has joined the chat`)
            })

            socketIo.on('user left', (leftUsername: string) => {
                addSystemMessage(`${leftUsername} has left the chat`)
            })

            setSocket(socketIo);

            return () => {
                socketIo.disconnect();
            }
        },[username, addSystemMessage])

        const sendMessage = (text: string, roomId?: string) => {
            if(socket) {
                const message: Message = {
                    id: uuidv4(),
                    user: username,
                    timeStamp: new Date().toISOString(),
                    text,
                }
                socket.emit('chat message', message);
            }
        }

        return {connected, message, sendMessage, users}

    }