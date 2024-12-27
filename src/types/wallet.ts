export interface WalletState {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
}