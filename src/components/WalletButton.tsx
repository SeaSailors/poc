import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletButtonProps {
  address: string | null;
  isConnecting: boolean;
  onConnect: () => void;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  address,
  isConnecting,
  onConnect,
}) => {
  const formatAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnecting) {
    return (
      <button
        disabled
        className="flex items-center gap-2 bg-indigo-500 px-4 py-2 rounded-lg cursor-wait"
      >
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        <span>Connecting...</span>
      </button>
    );
  }

  if (address) {
    return (
      <div className="flex items-center gap-2 bg-indigo-500 px-4 py-2 rounded-lg">
        <Wallet size={20} />
        <span>{formatAddress(address)}</span>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
    >
      <Wallet size={20} />
      <span>Connect Wallet</span>
    </button>
  );
};

export default WalletButton;