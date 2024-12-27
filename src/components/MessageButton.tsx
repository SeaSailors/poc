import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface MessageButtonProps {
  onClick: () => void;
  isHidden: boolean;
  isDark?: boolean;
}

const MessageButton: React.FC<MessageButtonProps> = ({ onClick, isHidden, isDark = false }) => {
  const Icon = isHidden ? Eye : EyeOff;
  
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded-full transition-colors ${
        isDark 
          ? 'hover:bg-indigo-500 text-white' 
          : 'hover:bg-indigo-100 text-indigo-600'
      }`}
      title={isHidden ? 'Show message' : 'Hide message'}
    >
      <Icon size={16} />
    </button>
  );
};

export default MessageButton;