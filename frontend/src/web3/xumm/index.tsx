import { useEffect, useState } from 'react'
import './index.css'

import { ChevronDown, Wallet, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { truncateAddress } from '@/utils';

import { xumm } from '@/web3/xumm/client';

const XummWallet = () => {
  const [account, setAccount] = useState('')
  const [payloadUuid, setPayloadUuid] = useState('')
  const [lastPayloadUpdate, setLastPayloadUpdate] = useState('')
  const [openPayloadUrl, setOpenPayloadUrl] = useState('')
  const [appName, setAppName] = useState('')

  xumm.user.account.then(a => setAccount(a ?? ''))
  xumm.environment.jwt?.then(j => setAppName(j?.app_name ?? ''))

  const handleLogout = () => {
    xumm.logout()
    setAccount('')
  }

  const handleMakePayment = () => {
    console.log('Make Payment clicked')
  }

  const handleSignIn = () => {
    if (xumm.authorize) {
      xumm.authorize();
    }
  };

  useEffect(() => {
    if (account) {
      localStorage.setItem('xummAccount', account)
    }
  }, [account])

  // Not logged in state
  if (account === '' && (!xumm.runtime || !xumm.runtime.xapp)) {
    return (
      <Button onClick={handleSignIn} className="gap-2">
        <Wallet className="w-4 h-4" />
        Sign in with Xaman
      </Button>
    );
  }

  // Logged in state
  if (account !== '') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="start" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{appName}</p>
                <p className="text-xs leading-none text-muted-foreground font-mono">
                  {account}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleMakePayment} className="gap-3 cursor-pointer">
            <Wallet className="w-4 h-4" />
            Make a Payment
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleLogout} 
            className="gap-3 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}

export default XummWallet