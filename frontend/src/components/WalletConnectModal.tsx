
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronDown, Wallet, Copy, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { initXummSignin, getXummSigninStatus } from '@/services/xumm';

import type { XummSigninResult } from '@/types';
import { truncateAddress } from '@/utils';

const WalletConnectModal = () => {
  const [copied, setCopied] = useState(false);
  const [qrcodeValue, setQRCodeValue] = useState('');
  const [uuid, setUUID] = useState('');
  const [account, setAccount] = useState('');
  const [appName, setAppName] = useState('XUGENPAY');

  const [isConnected, setIsConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated wallet connection URI - in real app this would be dynamic

  const handleCopyUri = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async () => {
    const result = await initXummSignin();
    console.log('Xumm Signin Result:', result);
    setQRCodeValue(result.qr || '');
    setUUID(result.uuid || '');
  };

  const handleConnectWallet = () => {
    if (isConnected) {
      // If already connected, disconnect
      setIsConnected(false);
    } else {
      // If not connected, show modal
      setShowWalletModal(true);
    }
  };

  const onClose = () => {
    setShowWalletModal(false)
  };

  const logout = () => {
    setAccount('');
    localStorage.removeItem('xummAccount')
    setShowWalletModal(false)
  };

  useEffect(() => {
    if (uuid && qrcodeValue) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(async () => {
        try {
          console.log('interval set')
          const resp: XummSigninResult = await getXummSigninStatus(uuid);
          console.log('Polling status:', resp);
          // Check if address is available and stop polling
          if (resp?.r_account) {
            clearInterval(pollingRef.current!);
            // onConnect(); // or pass address if needed
            // onClose();
            console.log('Wallet connected:', resp.r_account);
            setAccount(resp.r_account);
            localStorage.setItem('xummAccount', resp.r_account);
            localStorage.setItem('xummAppName', resp.appName);
            localStorage.setItem('xummStatus', resp.status);
          }
        } catch (err) {
          // Optionally handle error
          clearInterval(pollingRef.current!);
          console.log(err)
        }
      }, 2000); // Poll every 2 seconds
    }
  }, [uuid, qrcodeValue]);

  useEffect(() => {
    const acc = localStorage.getItem('xummAccount')
    if (acc) {
      setAccount(acc)
      setIsConnected(true)
    }
    if (showWalletModal && !account && !acc) {
      console.log('fetch qr')
      handleConnect()
    }
  }, [showWalletModal, account])

  if (account) {
    return (
      <>
        <Button onClick={handleConnectWallet} variant="outline" className="gap-3 px-4 py-2 h-auto">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Wallet className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{appName}</span>
            <span className="text-xs text-muted-foreground">{truncateAddress(account)}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>

        <Dialog open={showWalletModal} onOpenChange={onClose}>
          <DialogContent className="max-w-xl bg-card/95 backdrop-blur-sm border border-electric-blue/20 cyber-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-cyber font-bold text-electric-blue tracking-wider text-center">
                XAMAN WALLET CONNECTED TO XUGENPAY
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 space-y-6 p-4">
              <div className="text-left space-y-4">

                <div className='flex flex-row gap-4'>
                  <img src="/logo.jpeg" className='size-20' />
                  <div>
                    <p className='font-bold text-2xl'>XUGENPAY</p>
                    <p>Pay each other with ease </p>
                  </div>
                </div>

                {/* URI Display */}
                <div className="space-y-2">
                  <p className="text-xs font-mono-cyber text-muted-foreground">
                    Connection URI:
                  </p>
                  <div className="flex items-center space-x-2 p-2 bg-muted/20 rounded border border-border">
                    <code className="flex-1 text-xs w-20 font-mono-cyber text-electric-blue truncate">
                      {account}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyUri}
                      className="h-6 w-6 p-0 hover:bg-electric-blue/10"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-xs text-emerald-green font-mono-cyber">
                      URI copied to clipboard!
                    </p>
                  )}
                </div>

                <Button
                  onClick={logout}
                  className="w-full text-white bg-red-600 hover:bg-red-700 text-background font-cyber font-semibold tracking-wider red-glow"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Logout
                </Button>

              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <Button
        onClick={handleConnectWallet}
        className={`font-cyber font-semibold tracking-wide px-6 py-2 transition-all duration-300 ${isConnected
          ? 'bg-emerald-green hover:bg-emerald-green/80 text-background emerald-glow'
          : 'bg-electric-blue hover:bg-electric-blue/80 cyber-glow'
          }`}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnected ? 'WALLET CONNECTED' : 'CONNECT WALLET'}
      </Button>

      <Dialog open={showWalletModal} onOpenChange={onClose}>
        <DialogContent className="max-w-xl bg-card/95 backdrop-blur-sm border border-electric-blue/20 cyber-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-cyber font-bold text-electric-blue tracking-wider text-center">
              CONNECT XAMAN WALLET
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 space-y-6 p-4">
            <div className="text-left space-y-4">

              <div className='flex flex-row gap-4'>
                <img src="/logo.jpeg" className='size-20' />
                <div>
                  <p className='font-bold text-2xl'>XUGENPAY</p>
                  <p>Pay each other with ease </p>
                </div>
              </div>

              <Button
                className="w-full bg-emerald-green hover:bg-emerald-green/80 text-background font-cyber font-semibold tracking-wider emerald-glow"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Scan & Connect to XUGENPAY
              </Button>

              {/* QR Code */}
              <div className='flex flex-row gap-4'>
                <img src={qrcodeValue} className='size-100' />
                <div className='flex flex-col gap-4'>
                  <p className="text-xl font-cyber font-bold text-electric-blue">
                    Scan this with Xaman
                  </p>
                  <p>Request details will be visible in the Xaman app after scanning the QR code. </p>
                  <p>
                    Waiting for you to scan the <span>"SignIn"</span> request with the Xaman app.
                  </p>
                </div>
              </div>

              {/* URI Display */}
              <div className="space-y-2">
                <p className="text-xs font-mono-cyber text-muted-foreground">
                  Connection URI:
                </p>
                <div className="flex items-center space-x-2 p-2 bg-muted/20 rounded border border-border">
                  <code className="flex-1 text-xs w-20 font-mono-cyber text-electric-blue truncate">
                    {account}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyUri}
                    className="h-6 w-6 p-0 hover:bg-electric-blue/10"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-emerald-green font-mono-cyber">
                    URI copied to clipboard!
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnectModal;
