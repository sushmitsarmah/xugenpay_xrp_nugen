
import { Home, UserCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import WalletConnectModal from './WalletConnectModal';
import XummWallet from '@/web3/xumm';
import GemWallet from '@/web3/gemwallet';

const Header = () => {
  const location = useLocation();

  return (
    <>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-emerald-green rounded-lg cyber-glow"></div>
              <h1 className="text-2xl font-cyber font-bold text-electric-blue tracking-wider">
                Vortex Flow
              </h1>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/home"
                className={`flex items-center space-x-2 font-cyber tracking-wide transition-colors ${
                  location.pathname === '/home' 
                    ? 'text-electric-blue' 
                    : 'text-muted-foreground hover:text-electric-blue'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>TRANSFER</span>
              </Link>
              <Link
                to="/associate"
                className={`flex items-center space-x-2 font-cyber tracking-wide transition-colors ${
                  location.pathname === '/associate' 
                    ? 'text-electric-blue' 
                    : 'text-muted-foreground hover:text-electric-blue'
                }`}
              >
                <UserCheck className="h-4 w-4" />
                <span>IDENTITY</span>
              </Link>
            </nav>
          </div>

          <WalletConnectModal />
          {/* <GemWallet /> */}
          {/* <XummWallet /> */}
        </div>
      </header>
    </>
  );
};

export default Header;
