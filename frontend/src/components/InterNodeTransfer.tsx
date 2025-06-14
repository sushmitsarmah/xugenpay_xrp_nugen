/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Send, CheckCircle, AlertCircle } from 'lucide-react';

import { searchUsers } from '@/services/users';
import { initPayment, paymentStatus } from '@/services/xumm';

const InterNodeTransfer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resolvedUser, setResolvedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);
  const [myWallet, setMyWallet] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchQuery) return;

    const addr = localStorage.getItem('xummAccount')
    setMyWallet(addr)

    setIsSearching(true);
    // Simulate search
    const searchedUsers = await searchUsers(searchQuery);

    const filtered = searchedUsers.filter((user: any) => user.wallet_address !== addr)

    console.log(filtered)

    setUsers(filtered)

    // Mock resolved user
    // setResolvedUser({
    //   username: searchQuery,
    //   address: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH'
    // });
    setIsSearching(false);
  };

  const handleSendPayment = async () => {
    if (!resolvedUser || !amount) return;

    setIsSending(true);
    // Simulate transaction

    const payloadResp = initPayment({
      destination: resolvedUser.wallet_address,
      amount: amount,
      account: myWallet,
    })

    setPayload(payloadResp)

    const txId = '0x' + Math.random().toString(16).substr(2, 8).toUpperCase();
    setLastTransaction(txId);
    setIsSending(false);

    // Reset form
    setAmount('');
    setMessage('');
  };

  useEffect(() => {
    if (!payload) return;

    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    let isCompleted = false;

    const pollStatus = async () => {
      try {
        const status = await paymentStatus(payload);
        // You may need to adjust the condition based on your API's response
        if (status?.completed || status?.success) {
          isCompleted = true;
          setLastTransaction(status.txid || status.hash || 'COMPLETED');
          setIsSending(false);
          setPayload(null);
        }
      } catch (err) {
        // Optionally handle error
      }
    };

    // Start polling every 3 seconds
    intervalId = setInterval(pollStatus, 3000);

    // Optional: stop polling after 60 seconds
    timeoutId = setTimeout(() => {
      if (!isCompleted) {
        clearInterval(intervalId);
        setIsSending(false);
        setPayload(null);
      }
    }, 60000);

    // Cleanup on unmount or when payload changes
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [payload]);

  return (
    <Card className="cyber-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="font-cyber text-xl text-electric-blue tracking-wider flex items-center">
          <Send className="mr-2 h-5 w-5" />
          INTER-NODE TRANSFER
        </CardTitle>
        <p className="text-sm text-muted-foreground font-mono-cyber">
          Execute quantum transfers across the network
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="font-cyber text-foreground">
              Target Node Resolution
            </Label>
            <div className="flex space-x-2">
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search network node by handle..."
                className="cyber-border bg-input font-mono-cyber focus:cyber-glow transition-all duration-300"
              />
              <Button
                onClick={handleSearch}
                disabled={!searchQuery || isSearching}
                className="bg-electric-blue hover:bg-electric-blue/80 font-cyber cyber-glow"
              >
                <Search className="h-4 w-4 mr-1" />
                {isSearching ? 'RESOLVING...' : 'LOCATE'}
              </Button>
            </div>
          </div>

          {/* User List */}
          {users && users.length > 0 && (
            <div className="max-h-48 overflow-y-auto border border-border rounded-lg bg-muted/20 my-2">
              {users.map((user) => (
                <div
                  key={user.wallet_address}
                  className={`p-3 cursor-pointer hover:bg-electric-blue/10 font-mono-cyber transition-all ${resolvedUser?.wallet_address === user.wallet_address ? 'bg-electric-blue/20' : ''
                    }`}
                  onClick={() => setResolvedUser(user)}
                >
                  <div className="font-semibold">{user.username}</div>
                  <div className="text-xs text-muted-foreground break-all">{user.wallet_address}</div>
                </div>
              ))}
            </div>
          )}

          {/* Resolved User Display */}
          {resolvedUser && (
            <div className="scanline bg-muted/30 p-4 rounded-lg border border-emerald-green/30">
              <div className="flex items-center text-emerald-green mb-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="font-cyber font-semibold">User Selected - {resolvedUser.username}</span>
              </div>
              <div className="space-y-1">
                <p className="font-mono-cyber text-sm">
                  <span className="text-muted-foreground">Handle:</span> {resolvedUser.username}
                </p>
                <p className="font-mono-cyber text-sm break-all">
                  <span className="text-muted-foreground">Address:</span> {resolvedUser.wallet_address}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Payment Form */}
        {resolvedUser && (
          <div className="space-y-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="font-cyber text-foreground">
                Transfer Quantum (XRP)
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter transfer quantum..."
                className="cyber-border bg-input font-mono-cyber focus:cyber-glow transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="font-cyber text-foreground">
                Encrypted Transmission (Optional)
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Encrypted transmission (optional)..."
                className="cyber-border bg-input font-mono-cyber focus:cyber-glow transition-all duration-300 min-h-[80px]"
              />
            </div>

            <Button
              onClick={handleSendPayment}
              disabled={!amount || isSending}
              className="w-full bg-crimson-red hover:bg-crimson-red/80 text-white font-cyber font-semibold tracking-wider py-3 transition-all duration-300"
              style={{ boxShadow: '0 0 15px hsl(var(--crimson-red) / 0.4)' }}
            >
              {isSending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  EXECUTING TRANSFER...
                </div>
              ) : (
                'INITIATE TRANSFER'
              )}
            </Button>
          </div>
        )}

        {/* Transaction Status */}
        {lastTransaction && (
          <div className="bg-emerald-green/10 border border-emerald-green/30 p-4 rounded-lg">
            <div className="flex items-center text-emerald-green mb-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="font-cyber font-semibold">TRANSFER COMPLETE</span>
            </div>
            <p className="font-mono-cyber text-sm">
              TxId: {lastTransaction}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterNodeTransfer;
