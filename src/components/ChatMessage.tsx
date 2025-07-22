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
      <span
        className={`inline-block p-2 rounded-lg ${
          isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <strong>{message.user}: </strong>
        {message.text}
      </span>
      <div className="text-xs text-gray-500 mt-1">
        {date.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ChatMessage;
