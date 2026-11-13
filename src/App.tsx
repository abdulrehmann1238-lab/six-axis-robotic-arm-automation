import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SimulationProvider } from './state/simulationContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoadingScreen } from './components/common/LoadingScreen';
import { LandingPage } from './pages/LandingPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { RoboticsPage } from './pages/RoboticsPage';
import { DispensingPage } from './pages/DispensingPage';
import { ControlRoomPage } from './pages/ControlRoomPage';
import { SimulationPage } from './pages/SimulationPage';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Route container managing layout
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isControlRoom = location.pathname === '/control-room';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/robotics" element={<RoboticsPage />} />
          <Route path="/dispensing" element={<DispensingPage />} />
          <Route path="/control-room" element={<ControlRoomPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>
      {!isControlRoom && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  const [hasLoaded, setHasLoaded] = useState<boolean>(() => {
    return sessionStorage.getItem('visited_robotics_demo') === 'true';
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('visited_robotics_demo', 'true');
    setHasLoaded(true);
  };

  return (
    <SimulationProvider>
      {!hasLoaded ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <BrowserRouter>
          <ScrollToTop />
          <AppLayout />
        </BrowserRouter>
      )}
    </SimulationProvider>
  );
};

export default App;

