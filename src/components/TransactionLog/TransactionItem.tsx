import React from 'react';
import { SendHorizontal, Reply, ExternalLink } from 'lucide-react';
import { Transaction } from '../../types/chat';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { type, hash, timestamp, etherscanUrl } = transaction;

  const isRequest = type === 'request';
  const styles = {
    container: `p-4 rounded-lg border-l-4 ${
      isRequest
        ? 'bg-orange-50 border-orange-500'
        : 'bg-green-50 border-green-500'
    }`,
    icon: isRequest ? 'text-orange-500' : 'text-green-500',
    label: isRequest ? 'text-orange-700' : 'text-green-700'
  };

  return (
    <div className={styles.container}>
      <div className="flex items-center gap-2 mb-2">
        {isRequest ? (
          <>
            <SendHorizontal size={16} className={styles.icon} />
            <span className={`text-sm font-medium ${styles.label}`}>
              Request
            </span>
          </>
        ) : (
          <>
            <Reply size={16} className={styles.icon} />
            <span className={`text-sm font-medium ${styles.label}`}>Reply</span>
          </>
        )}
      </div>
      <div className="text-sm font-mono text-gray-600 break-all">
        {etherscanUrl ? (
          <a
            href={etherscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
          >
            {hash}
            <ExternalLink size={14} />
          </a>
        ) : (
          hash
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
    </div>
  );
};

export default TransactionItem;

