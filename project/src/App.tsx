import { useHashRoute } from '@/lib/router';
import { Navbar, Footer } from '@/components/Nav';
import { ToastContainer } from '@/components/ui';
import { Home } from '@/pages/Home';
import { BusinessPlanning } from '@/pages/BusinessPlanning';
import { MarketPrices } from '@/pages/MarketPrices';
import { FarmSetup } from '@/pages/FarmSetup';
import { ProfitCalculator } from '@/pages/ProfitCalculator';
import { FindBuyers } from '@/pages/FindBuyers';
import { Admin } from '@/pages/Admin';

function App() {
  const [route, navigate] = useHashRoute();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar route={route} navigate={navigate} />
      <main className="flex-1">
        {route === '/' && <Home navigate={navigate} />}
        {route === '/planning' && <BusinessPlanning navigate={navigate} />}
        {route === '/prices' && <MarketPrices />}
        {route === '/setup' && <FarmSetup navigate={navigate} />}
        {route === '/calculator' && <ProfitCalculator />}
        {route === '/buyers' && <FindBuyers />}
        {route === '/admin' && <Admin />}
      </main>
      <Footer navigate={navigate} />
      <ToastContainer />
    </div>
  );
}

export default App;
