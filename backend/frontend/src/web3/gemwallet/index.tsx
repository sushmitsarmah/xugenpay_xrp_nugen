import { useEffect, useState } from "react";
import { ChevronDown, Wallet, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { isInstalled, getAddress } from "@gemwallet/api";
import { truncateAddress } from '@/utils';

import { Button } from "@/components/ui/button";

const GemWallet = () => {
  const [gemInstalled, setGemInstalled] = useState(false)
  const [account, setAccount] = useState('')
  const [appName, setAppName] = useState('XUGENPAY')

  const getGemAddress = async () => {
    const addResp = await getAddress();
    const address = addResp.result?.address;
    if (address) {
      setAccount(address)
      console.log(`Your address: ${address}`);
    }
  };

  const checkGemInstalled = async () => {
    const resp = await isInstalled();
    setGemInstalled(resp.result.isInstalled);
    return resp.result.isInstalled;
  };

  const handleConnect = async () => {
    const isInstalled = await checkGemInstalled()
    if (isInstalled) {
      await getGemAddress();
    }
  };

  useEffect(() => {
    handleConnect();
  }, []);

  if (account === '') {
    return <Button onClick={handleConnect}>Login with GemWallet</Button>
  } else {
    return (
      <Button variant="outline" className="gap-3 px-4 py-2 h-auto">
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
    )
  }
}

export default GemWallet;