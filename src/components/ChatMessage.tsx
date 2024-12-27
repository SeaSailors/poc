import React from 'react';
import { Bot } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, timestamp }) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex ${isBot ? 'flex-row' : 'flex-row-reverse'} max-w-[70%] gap-2`}>
        <div className={`flex-shrink-0 ${isBot ? 'mr-2' : 'ml-2'}`}>
          {isBot ? (
            <div className="bg-indigo-100 p-2 rounded-full">
              <Bot size={24} className="text-indigo-600" />
            </div>
          ) : (
            <div className="bg-green-100 p-2 rounded-full">
              <div className="w-6 h-6 rounded-full bg-green-500" />
            </div>
          )}
        </div>
        <div>
          <div
            className={`p-4 rounded-2xl ${
              isBot
                ? 'bg-gray-100 text-gray-800'
                : 'bg-indigo-600 text-white'
            }`}
          >
            {message}
          </div>
          <div className={`text-xs text-gray-500 mt-1 ${isBot ? 'text-left' : 'text-right'}`}>
            {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;