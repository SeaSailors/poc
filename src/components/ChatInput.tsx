import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const maxLength = 120;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 border-t">
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={maxLength}
          placeholder="Type your message..."
          className="w-full px-4 py-3 pr-24 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
        />
        <div className="absolute right-2 top-2 flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {message.length}/{maxLength}
          </span>
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;