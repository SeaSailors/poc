export interface Message {
  id: number;
  text: string;
  cipherText: string;
  isBot: boolean;
  timestamp: string;
}

export type TransactionType = "request" | "reply";

export interface Transaction {
  hash: string;
  timestamp: string;
  type: TransactionType;
  etherscanUrl?: string;
}

