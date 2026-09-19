import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Vehicle } from './types';
import { VEHICLES } from './data/inventory';
import { Navbar } from './components/Navbar';
import { HeroCanvas } from './components/HeroCanvas';
import { InventoryGrid } from './components/InventoryGrid';
import { SurveillanceHub } from './components/SurveillanceHub';
import { TelemetryHud } from './components/TelemetryHud';
import { AcquisitionTerminal } from './components/AcquisitionTerminal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { Footer } from './components/Footer';
import { CrazyMotionOverlay } from './components/CrazyMotionOverlay';

export default function App() {
  const [modalVehicle, setModalVehicle] = useState<Vehicle | null>(null);
  const [terminalVehicle, setTerminalVehicle] = useState<Vehicle>(VEHICLES[0]);

  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAcquisition = (vehicle?: Vehicle) => {
    if (vehicle) {
      setTerminalVehicle(vehicle);
    }
    const el = document.getElementById('acquisition-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#F4F4F5] selection:bg-[#FF2A00] selection:text-black flex flex-col relative">
      {/* High-Octane Interactive HUD Motion Overlay */}
      <CrazyMotionOverlay />

      {/* Agency Industrial Navbar */}
      <Navbar 
        onNavClick={handleNavClick} 
        onAcquireClick={() => handleOpenAcquisition()} 
      />

      {/* Hero Canvas with 300-Frame Vertical Scroll Scrubbing */}
      <HeroCanvas 
        onAcquireClick={() => handleOpenAcquisition()} 
        onExploreClick={() => handleNavClick('inventory-section')} 
      />

      {/* Curated Inventory Catalog with 3D Tilt Cards */}
      <InventoryGrid 
        onSelectVehicle={(v) => setModalVehicle(v)} 
        onAcquireVehicle={(v) => handleOpenAcquisition(v)} 
      />

      {/* 24/7 CCTV Surveillance Reconnaissance Hub with Live Glitch & PTZ */}
      <SurveillanceHub />

      {/* Drift Dynamics & Lateral G-Force Radar Telemetry */}
      <TelemetryHud />

      {/* VIP Acquisition Terminal & Escrow Enclave */}
      <AcquisitionTerminal 
        selectedVehicle={terminalVehicle} 
        onSelectVehicle={(v) => setTerminalVehicle(v)} 
      />

      {/* Tactical Footer */}
      <Footer />

      {/* Vehicle Technical Blueprint Inspection Modal with AnimatePresence */}
      <AnimatePresence>
        {modalVehicle && (
          <VehicleDetailModal 
            vehicle={modalVehicle} 
            onClose={() => setModalVehicle(null)} 
            onAcquire={(v) => {
              setModalVehicle(null);
              handleOpenAcquisition(v);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
