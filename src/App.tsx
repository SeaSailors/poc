import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TransactionLog from './components/TransactionLog/index';
import { Message, Transaction } from './types/chat';
import { WalletState } from './types/wallet';
import { connectWallet, isMetaMaskInstalled } from './utils/wallet';
import { getPromptReply, sendPrompt } from './utils/prompt';
import { defaultChain } from './contracts/chain';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Oneshot Assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnecting: false,
    error: null
  });

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const address = await connectWallet();
      setWallet((prev) => ({ ...prev, address, isConnecting: false }));
    } catch (error: any) {
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message
      }));
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!wallet.address) {
      alert('Please connect your wallet first');
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      // Send actual Ethereum transaction
      const { txHash, taskId, reqSk } = await sendPrompt(text);

      const requestTransaction: Transaction = {
        hash: txHash,
        timestamp: new Date().toLocaleTimeString(),
        type: 'request',
        etherscanUrl: `${defaultChain.blockExplorers.default.url}/tx/${txHash}`
      };
      setTransactions((prev) => [requestTransaction, ...prev]);

      // Get reply from smart contract
      const promptReply = await getPromptReply(taskId, reqSk);

      const botResponse: Message = {
        id: messages.length + 2,
        text: promptReply.output,
        isBot: true,
        timestamp: new Date().toLocaleTimeString()
      };

      const replyTransaction: Transaction = {
        hash: promptReply.txHash,
        timestamp: new Date().toLocaleTimeString(),
        type: 'reply',
        etherscanUrl: `${defaultChain.blockExplorers.default.url}/tx/${promptReply.txHash}`
      };

      setMessages((prev) => [...prev, botResponse]);
      setTransactions((prev) => [replyTransaction, ...prev]);
    } catch (error: any) {
      alert(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation wallet={wallet} onConnectWallet={handleConnectWallet} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-8rem)]">
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message.text}
                      isBot={message.isBot}
                      timestamp={message.timestamp}
                    />
                  ))}
                </div>
                <ChatInput onSendMessage={handleSendMessage} />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <TransactionLog transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
