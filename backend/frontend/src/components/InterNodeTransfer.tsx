
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Send, CheckCircle, AlertCircle } from 'lucide-react';

const InterNodeTransfer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resolvedUser, setResolvedUser] = useState<{username: string, address: string} | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    setIsSearching(true);
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock resolved user
    setResolvedUser({
      username: searchQuery,
      address: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH'
    });
    setIsSearching(false);
  };

  const handleSendPayment = async () => {
    if (!resolvedUser || !amount) return;
    
    setIsSending(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const txId = '0x' + Math.random().toString(16).substr(2, 8).toUpperCase();
    setLastTransaction(txId);
    setIsSending(false);
    
    // Reset form
    setAmount('');
    setMessage('');
  };

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

          {/* Resolved User Display */}
          {resolvedUser && (
            <div className="scanline bg-muted/30 p-4 rounded-lg border border-emerald-green/30">
              <div className="flex items-center text-emerald-green mb-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="font-cyber font-semibold">NODE RESOLVED</span>
              </div>
              <div className="space-y-1">
                <p className="font-mono-cyber text-sm">
                  <span className="text-muted-foreground">Handle:</span> {resolvedUser.username}
                </p>
                <p className="font-mono-cyber text-sm break-all">
                  <span className="text-muted-foreground">Address:</span> {resolvedUser.address}
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
