import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');

export default function App({ Component, pageProps }: AppProps) {
  const network = 'https://mainnet.helius-rpc.com/?api-key=c606f118-a4bf-4739-b1a1-c6c2dc4675c7';

  const wallets = useMemo(
      () => [
      ],
      [network]
  );

  return (
      <ConnectionProvider endpoint={network}>
          <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                  <Component {...pageProps} />
              </WalletModalProvider>
          </WalletProvider>
      </ConnectionProvider>
  );

}
