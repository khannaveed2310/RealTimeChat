import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "@/hooks/useSocket";
import ChatMessage from "./ChatMessage";
import OnlineUsers from "./OnlineUsers";

interface ChatInterfaceProps {
  username: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ username }) => {
  const { connected, message, sendMessage, users } = useSocket(username);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = message.map((msg) => ({
    id: msg.id,
    user: msg.user,
    text: msg.text,
    timeStamp: msg.timeStamp ?? new Date().toISOString(),
    roomId: msg.roomId,
  }));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <div className="flex-grow mr-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">WebSocket Chat Demo</h1>
        <div className={`mb-4 text-center ${connected ? "text-green-500" : "text-red-500"}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="mb-4 h-64 overflow-y-auto border border-gray-300 rounded p-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} isOwnMessage={msg.user === username} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            placeholder="Type Your Message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mr-2 p-2 border border-gray-200 rounded text-black"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!connected}
          >
            Send
          </button>
        </form>
      </div>
      <OnlineUsers users={users} currentUser={username} />
    </div>
  );
};

export default ChatInterface;
