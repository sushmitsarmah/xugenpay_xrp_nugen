
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Send, Shield, Zap, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background grid-overlay">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-emerald-green rounded-lg cyber-glow"></div>
            <h1 className="text-2xl font-cyber font-bold text-electric-blue tracking-wider">
              XUGENPAY
            </h1>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/home">
              <Button className="bg-electric-blue hover:bg-electric-blue/80 font-cyber cyber-glow">
                LAUNCH APP
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-cyber font-bold text-electric-blue mb-6 tracking-wider">
            THE FUTURE OF
            <br />
            <span className="text-emerald-green">P2P PAYMENTS</span>
          </h1>
          <p className="text-xl text-muted-foreground font-mono-cyber max-w-2xl mx-auto mb-8">
            Send XRP instantly using simple network identifiers. No more complex wallet addresses - 
            just search, verify, and transfer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/home">
              <Button className="bg-emerald-green hover:bg-emerald-green/80 text-background font-cyber font-semibold tracking-wider px-8 py-3 emerald-glow">
                START TRANSFERRING
              </Button>
            </Link>
            <Link to="/associate">
              <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue/10 font-cyber font-semibold tracking-wider px-8 py-3">
                BIND IDENTITY
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="cyber-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Search className="h-12 w-12 text-electric-blue mx-auto mb-4" />
              <h3 className="text-xl font-cyber font-semibold text-electric-blue mb-2">
                INSTANT SEARCH
              </h3>
              <p className="text-muted-foreground font-mono-cyber text-sm">
                Find anyone on the network using their unique identifier. No more copying long wallet addresses.
              </p>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Send className="h-12 w-12 text-emerald-green mx-auto mb-4" />
              <h3 className="text-xl font-cyber font-semibold text-emerald-green mb-2">
                QUANTUM TRANSFER
              </h3>
              <p className="text-muted-foreground font-mono-cyber text-sm">
                Execute lightning-fast XRP transfers with military-grade security and real-time verification.
              </p>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-crimson-red mx-auto mb-4" />
              <h3 className="text-xl font-cyber font-semibold text-crimson-red mb-2">
                SECURE PROTOCOL
              </h3>
              <p className="text-muted-foreground font-mono-cyber text-sm">
                Your identity and transactions are protected by advanced cryptographic protocols.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-cyber font-bold text-electric-blue mb-12 tracking-wider">
            HOW THE NEXUS WORKS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-emerald-green rounded-full flex items-center justify-center mx-auto cyber-glow">
                <span className="text-2xl font-cyber font-bold text-background">1</span>
              </div>
              <h3 className="text-xl font-cyber font-semibold text-electric-blue">
                BIND IDENTITY
              </h3>
              <p className="text-muted-foreground font-mono-cyber text-sm">
                Associate your unique network identifier with your XRP wallet address.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-green to-electric-blue rounded-full flex items-center justify-center mx-auto emerald-glow">
                <span className="text-2xl font-cyber font-bold text-background">2</span>
              </div>
              <h3 className="text-xl font-cyber font-semibold text-emerald-green">
                SEARCH & VERIFY
              </h3>
              <p className="text-muted-foreground font-mono-cyber text-sm">
                Find recipients by their network handle and verify their wallet address instantly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-crimson-red to-deep-violet rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-cyber font-bold text-background">3</span>
              </div>
              <h3 className="text-xl font-cyber font-semibold text-crimson-red">
                EXECUTE TRANSFER
              </h3>
              <p className="text-muted-foreground font-mono-cyber text-sm">
                Send XRP with optional encrypted messages in seconds, not minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-cyber font-bold text-electric-blue mb-2">
              &lt; 3s
            </div>
            <p className="text-muted-foreground font-mono-cyber text-sm">
              Average Transfer Time
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-cyber font-bold text-emerald-green mb-2">
              99.9%
            </div>
            <p className="text-muted-foreground font-mono-cyber text-sm">
              Network Uptime
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-cyber font-bold text-crimson-red mb-2">
              0.1%
            </div>
            <p className="text-muted-foreground font-mono-cyber text-sm">
              Transaction Fee
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-cyber font-bold text-deep-violet mb-2">
              24/7
            </div>
            <p className="text-muted-foreground font-mono-cyber text-sm">
              Global Operations
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/30 p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-cyber font-bold text-electric-blue mb-4 tracking-wider">
            READY TO JOIN THE NEXUS?
          </h2>
          <p className="text-muted-foreground font-mono-cyber mb-6">
            Experience the future of peer-to-peer payments on the XRP Ledger.
          </p>
          <Link to="/home">
            <Button className="bg-electric-blue hover:bg-electric-blue/80 font-cyber font-semibold tracking-wider px-8 py-3 cyber-glow">
              ENTER THE NEXUS
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Landing;
