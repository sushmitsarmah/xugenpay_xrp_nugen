
import Header from '@/components/Header';
import IdentitySynapse from '@/components/IdentitySynapse';
// import SquidSwap from '@/web3/squid_router';

const Associate = () => {
  return (
    <div className="min-h-screen bg-background grid-overlay">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-cyber font-bold text-electric-blue tracking-wider mb-2">
              IDENTITY BINDING
            </h1>
            <p className="text-muted-foreground font-mono-cyber">
              Associate your network identifier with wallet protocol
            </p>
          </div>
          
          <IdentitySynapse />

          {/* <SquidSwap /> */}

        </div>
        
        {/* Status Footer */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-muted/30 px-6 py-3 rounded-lg border border-border">
            <p className="font-mono-cyber text-sm text-muted-foreground">
              <span className="text-electric-blue">SYSTEM STATUS:</span> NEXUS OPERATIONAL
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Associate;
