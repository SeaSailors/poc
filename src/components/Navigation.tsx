import React from 'react';
import WalletButton from './WalletButton';
import { WalletState } from '../types/wallet';

interface NavigationProps {
  wallet: WalletState;
  onConnectWallet: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ wallet, onConnectWallet }) => {
  return (
    <nav className="bg-indigo-600 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Oneshot Assistant Demo</h1>
        <WalletButton
          address={wallet.address}
          isConnecting={wallet.isConnecting}
          onConnect={onConnectWallet}
        />
      </div>
    </nav>
  );
};

export default Navigation;