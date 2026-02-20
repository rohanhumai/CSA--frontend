import { AuthProvider } from "@/context/AuthContext";
import {
  WalletProvider,
  WalletModalProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import { Button as WalletButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../globals.css";

export const metadata = {
  title: "CourseChain — Learn. Build. Earn.",
  description: "Web3-powered learning platform",
};

const network = "devnet";
const endpoint = clusterApiUrl(network);
const wallets = [new PhantomWalletAdapter()];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <Navbar />
              <main className="min-h-screen flex flex-col">{children}</main>
              <Footer />
            </WalletModalProvider>
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
