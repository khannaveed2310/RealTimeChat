import React from "react";

interface Message {
  id: string;
  user: string;
  text: string;
  timeStamp: Date | string;
  roomId?: string;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  const date =
    typeof message.timeStamp === "string"
      ? new Date(message.timeStamp)
      : message.timeStamp;

  return (
    <div className={`mb-2 ${isOwnMessage ? "text-right" : "text-left"}`}>
      <div
        className={`inline-block max-w-xs p-2 rounded-lg break-words text-left ${
          isOwnMessage ? "bg-green-200 text-gray-800" : "bg-blue-200 text-gray-800"
        }`}
      >
        <div className="text-sm font-semibold mb-1 text-black">{message.user}</div>
        <div>{message.text}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {date.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ChatMessage;
