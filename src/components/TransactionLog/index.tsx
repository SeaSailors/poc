import React from 'react';
import TransactionHeader from './TransactionHeader';
import TransactionItem from './TransactionItem';
import { Transaction } from '../../types/chat';

interface TransactionLogProps {
  transactions: Transaction[];
}

const TransactionLog: React.FC<TransactionLogProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full">
      <TransactionHeader />
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <TransactionItem key={index} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionLog;