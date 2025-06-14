/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react'; // Eye and EyeOff are no longer needed as privateKey is removed

import {
  createUpdateUser,
  getUserByAddress
} from '@/services/users'

const IdentitySynapse = () => {
  const [username, setUsername] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  // New states for the requested fields
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [preferredCurrency, setPreferredCurrency] = useState<string>('XRP'); // Defaulting as per example
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const [isBinding, setIsBinding] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleBindIdentity = async () => {
    setIsBinding(true);
    setMessage('');
    setError('');

    const payload = {
      wallet_address: walletAddress,
      username: username,
      first_name: firstName,
      last_name: lastName,
      preferred_currency: preferredCurrency,
      is_verified: isVerified,
    };

    console.log('Attempting to bind identity with payload:', payload);

    try {
      const data = await createUpdateUser(payload)

      console.log("API Response:", data);
      setMessage('Identity successfully bound!');
      // Optionally reset form fields or redirect
      // setUsername('');
      // setWalletAddress('');
      // setFirstName('');
      // setLastName('');
      // setPreferredCurrency('XRP');
      // setIsVerified(false);
      
      setMessage('Identity successfully bound! Check console for simulated API payload.');

    } catch (err: any) {
      console.error('Identity binding error:', err);
      setError(err.message || 'An unexpected error occurred during binding.');
    } finally {
      setIsBinding(false);
    }
  };

  const fetchUserByWallet = async () => {
    const user = await getUserByAddress(walletAddress);
    if (user) {
      setUsername(user.username);
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPreferredCurrency(user.preferred_currency);
      setIsVerified(user.is_verified);
    }
  };

  useEffect(() => {
    const account = localStorage.getItem('xummAccount');
    console.log(account)
    if (account) {
      setWalletAddress(account);
      fetchUserByWallet();
    }
  }, [walletAddress])

  return (
    <Card className="cyber-border bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="font-cyber text-xl text-electric-blue tracking-wider flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          IDENTITY SYNAPSE
        </CardTitle>
        <p className="text-sm text-muted-foreground font-mono-cyber">
          Bind your network identifier to wallet protocol
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="font-cyber text-foreground">
            Network Identifier / UserName <span className="text-crimson-red">*</span>
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your unique network identifier..."
            className="cyber-border bg-input font-mono-cyber focus:cyber-glow transition-all duration-300"
            required // Mark as required
          />
        </div>

        {/* Wallet Address */}
        <div className="space-y-2">
          <Label htmlFor="wallet" className="font-cyber text-foreground">
            Wallet Address <span className="text-crimson-red">*</span>
          </Label>
          <Input
            disabled
            id="wallet"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX..."
            className="cyber-border bg-input font-mono-cyber focus:cyber-glow transition-all duration-300"
            required // Mark as required
          />
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="font-cyber text-foreground">
            First Name
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g., Sushmit"
            className="cyber-border bg-input font-mono-cyber focus:cyber-glow transition-all duration-300"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="font-cyber text-foreground">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="e.g., Test"
            className="cyber-border bg-input font-mono-cyber focus:cyber-glow transition-all duration-300"
          />
        </div>

        {/* Preferred Currency */}
        <div className="space-y-2">
          <Label htmlFor="preferredCurrency" className="font-cyber text-foreground">
            Preferred Currency
          </Label>
          <Input
            id="preferredCurrency"
            value={preferredCurrency}
            onChange={(e) => setPreferredCurrency(e.target.value)}
            placeholder="e.g., XRP, USD, ETH"
            className="cyber-border bg-input font-mono-cyber focus:cyber-glow transition-all duration-300"
          />
        </div>

        {/* Is Verified Checkbox */}
        <div className="flex items-center space-x-3 mt-4">
          <input
            type="checkbox"
            id="isVerified"
            checked={isVerified}
            onChange={(e) => setIsVerified(e.target.checked)}
            className="h-5 w-5 rounded border border-border bg-muted/20 text-electric-blue focus:ring-electric-blue focus:ring-offset-background"
            // You might need to adjust specific styling for the checkbox itself based on your project's CSS setup (e.g., global styles for input[type="checkbox"])
          />
          <Label htmlFor="isVerified" className="font-cyber text-foreground text-sm cursor-pointer">
            Mark as Verified
          </Label>
        </div>

        {/* Submission Button */}
        <Button
          onClick={handleBindIdentity}
          disabled={!username || !walletAddress || isBinding}
          className="w-full bg-emerald-green hover:bg-emerald-green/80 text-background font-cyber font-semibold tracking-wider py-3 emerald-glow transition-all duration-300"
        >
          {isBinding ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
              BINDING IDENTITY...
            </div>
          ) : (
            'ACTIVATE NEXUS'
          )}
        </Button>

        {/* Status Messages */}
        {message && (
          <p className="mt-4 text-center font-mono-cyber text-sm text-green-400">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-center font-mono-cyber text-sm text-red-400">
            ERROR: {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default IdentitySynapse;