export const generateTransactionHash = (): string => {
  const characters = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += characters[Math.floor(Math.random() * characters.length)];
  }
  return hash;
};