import React from 'react';
import { History } from 'lucide-react';

const TransactionHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <History className="text-indigo-600" />
      <h2 className="text-xl font-semibold">Transaction Log</h2>
    </div>
  );
};

export default TransactionHeader;