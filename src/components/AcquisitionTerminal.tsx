import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle } from '../types';
import { VEHICLES } from '../data/inventory';
import { soundEngine } from '../utils/audio';
import { 
  Terminal, 
  ShieldCheck, 
  CreditCard, 
  Coins, 
  Truck, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Calculator, 
  ArrowRight, 
  Lock 
} from 'lucide-react';

interface AcquisitionTerminalProps {
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (v: Vehicle) => void;
}

export const AcquisitionTerminal: React.FC<AcquisitionTerminalProps> = ({ 
  selectedVehicle,
  onSelectVehicle 
}) => {
  const [activeTab, setActiveTab] = useState<'escrow' | 'finance' | 'circuit'>('escrow');
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>(selectedVehicle || VEHICLES[0]);

  // If selectedVehicle changes from parent, sync it
  React.useEffect(() => {
    if (selectedVehicle) {
      setCurrentVehicle(selectedVehicle);
    }
  }, [selectedVehicle]);

  // Escrow Form State
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'fiat' | 'btc' | 'eth' | 'usdt'>('fiat');
  const [deliveryType, setDeliveryType] = useState<string>('vault-handover');
  const [notes, setNotes] = useState<string>('');
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    tokenId: string;
    timestamp: string;
    vehicleName: string;
    amount: number;
  } | null>(null);

  // Finance Calculator State
  const [downPaymentPct, setDownPaymentPct] = useState<number>(25); // %
  const [loanTermMonths, setLoanTermMonths] = useState<number>(36); // 24, 36, 48, 60
  const interestRateApr = 0.059; // 5.9% APR

  // Circuit Booking State
  const [circuitDate, setCircuitDate] = useState<string>('2026-10-14');
  const [timeSlot, setTimeSlot] = useState<string>('22:00 - 02:00 (Midnight Nocturne)');
  const [driftCoachIncluded, setDriftCoachIncluded] = useState<boolean>(true);
  const [tireSet, setTireSet] = useState<string>('Toyo Proxes R888R (2 Fresh Sets)');

  // Calculations
  const downPaymentAmount = (currentVehicle.price * downPaymentPct) / 100;
  const principal = currentVehicle.price - downPaymentAmount;
  const monthlyRate = interestRateApr / 12;
  const monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths))) / 
    (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

  const handleSubmitEscrow = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick(1300);
    const token = `VIP-EMP-${Math.floor(1000 + Math.random() * 9000)}-${currentVehicle.make.slice(0, 3).toUpperCase()}`;
    const receipt = {
      tokenId: token,
      timestamp: new Date().toISOString(),
      vehicleName: currentVehicle.name,
      amount: currentVehicle.price
    };
    setSubmissionReceipt(receipt);
  };

  return (
    <section id="acquisition-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#050506] border-b border-[#18181b] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#18181b] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 mb-2 bg-[#FF2A00]/10 border border-[#FF2A00]/30 text-[#FF2A00] text-[11px] font-tech uppercase tracking-widest">
              <Terminal className="w-3 h-3 text-[#FF2A00]" />
              <span>TRANSACTION GATEWAY // SECURE ESCROW ENCLAVE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight text-white">
              VIP ACQUISITION <span className="text-[#FF2A00]">TERMINAL</span>
            </h2>
            <p className="mt-1 text-sm font-body text-[#a1a1aa] max-w-xl">
              Encrypted institutional escrow settlement, custom bespoke financing structures, and private circuit test session allocations.
            </p>
          </div>

          {/* Active Spec Selector */}
          <div className="flex flex-col items-start md:items-end font-tech text-xs">
            <span className="text-[#71717a] mb-1">TARGET SPECIMEN ALLOCATION:</span>
            <select
              value={currentVehicle.id}
              onChange={(e) => {
                const found = VEHICLES.find(v => v.id === e.target.value);
                if (found) {
                  soundEngine.playClick(1000);
                  setCurrentVehicle(found);
                  onSelectVehicle(found);
                }
              }}
              className="px-3 py-1.5 bg-[#121214] border border-[#FF2A00]/50 rounded text-xs font-tech text-white focus:outline-none"
            >
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (${v.price.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#18181b] mb-8 pb-3 relative">
          {[
            { id: 'escrow', label: 'DIRECT ESCROW PURCHASE', icon: ShieldCheck },
            { id: 'finance', label: 'FINANCING & LEASE CALCULATOR', icon: Calculator },
            { id: 'circuit', label: 'PRIVATE CIRCUIT TEST DRIVE', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick(1050);
                  setActiveTab(tab.id as any);
                }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded text-xs font-tech uppercase tracking-wider transition-colors ${
                  isActive 
                    ? 'text-black font-bold' 
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#121214] border border-transparent'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTerminalTab"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="absolute inset-0 bg-[#FF2A00] rounded shadow-[0_0_15px_rgba(255,42,0,0.35)] z-0"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DIRECT ESCROW FORM */}
        {activeTab === 'escrow' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Inputs */}
            <div className="lg:col-span-2 bg-[#09090b] p-6 rounded border border-[#18181b] space-y-6">
              <form onSubmit={handleSubmitEscrow} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-tech text-xs">
                  <div>
                    <label className="block text-[#71717a] mb-1.5 uppercase">CLIENT FULL NAME / ENTITY *</label>
                    <input
                      type="text"
                      required
                      placeholder="Lord Sterling Croft"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121214] border border-[#27272a] focus:border-[#FF2A00] rounded text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#71717a] mb-1.5 uppercase">ENCRYPTED EMAIL *</label>
                    <input
                      type="email"
                      required
                      placeholder="sc@atelier-vault.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121214] border border-[#27272a] focus:border-[#FF2A00] rounded text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#71717a] mb-1.5 uppercase">PHONE / SIGNAL NUMBER *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2831"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121214] border border-[#27272a] focus:border-[#FF2A00] rounded text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Settlement Currency & Escrow Vehicle */}
                <div className="space-y-2">
                  <label className="block font-tech text-xs text-[#71717a] uppercase">SETTLEMENT METHOD</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-tech text-xs">
                    {[
                      { id: 'fiat', label: 'SWIFT / FEDWIRE', desc: 'USD / EUR / JPY Fiat Wire' },
                      { id: 'btc', label: 'BITCOIN (BTC)', desc: 'Multisig On-Chain Escrow' },
                      { id: 'eth', label: 'ETHEREUM (ETH)', desc: 'Smart Contract Vault' },
                      { id: 'usdt', label: 'USDT (ERC-20)', desc: 'Instant Stablecoin Lock' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick(1000);
                          setPaymentMethod(m.id as any);
                        }}
                        className={`p-3 text-left border rounded transition-all ${
                          paymentMethod === m.id
                            ? 'bg-[#18181b] border-[#FF2A00] text-white'
                            : 'bg-[#121214] border-[#27272a] text-[#71717a] hover:border-[#3f3f46]'
                        }`}
                      >
                        <div className={`font-bold ${paymentMethod === m.id ? 'text-[#FF2A00]' : 'text-white'}`}>
                          {m.label}
                        </div>
                        <div className="text-[10px] mt-0.5 text-[#a1a1aa]">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Logistics */}
                <div className="space-y-2">
                  <label className="block font-tech text-xs text-[#71717a] uppercase">DELIVERY LOGISTICS</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-tech text-xs">
                    {[
                      { id: 'vault-handover', label: 'SUB-TERRA VAULT HANDOVER', desc: 'Personal collection at Atelier Hangar 4' },
                      { id: 'air-freight', label: 'ENCLOSED AIR FREIGHT', desc: 'Worldwide climate-controlled air transport' },
                      { id: 'track-delivery', label: 'CIRCUIT TRACK-DAY STAGING', desc: 'Delivered directly to private pit box' }
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick(1000);
                          setDeliveryType(d.id);
                        }}
                        className={`p-3 text-left border rounded transition-all ${
                          deliveryType === d.id
                            ? 'bg-[#18181b] border-[#FF2A00] text-white'
                            : 'bg-[#121214] border-[#27272a] text-[#71717a] hover:border-[#3f3f46]'
                        }`}
                      >
                        <div className="font-bold text-white text-[11px]">{d.label}</div>
                        <div className="text-[10px] text-[#71717a] mt-0.5">{d.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Directives */}
                <div>
                  <label className="block font-tech text-xs text-[#71717a] mb-1.5 uppercase">
                    SPECIAL ATELIER DIRECTIVES // EXHAUST TUNING / REGISTRATION
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specify custom telemetry calibrations, export documentation, or track tire allocation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121214] border border-[#27272a] focus:border-[#FF2A00] rounded text-white text-xs font-tech focus:outline-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  id="btn-submit-escrow"
                  type="submit"
                  className="w-full py-3.5 bg-[#FF2A00] hover:bg-[#e02600] text-black font-tech font-bold text-sm uppercase tracking-wider rounded transition-transform active:scale-98 shadow-[0_0_20px_rgba(255,42,0,0.3)] flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>TRANSMIT ENCRYPTED ESCROW DOSSIER (${currentVehicle.price.toLocaleString()})</span>
                </button>
              </form>
            </div>

            {/* Specimen Summary Card */}
            <div className="bg-[#09090b] p-6 rounded border border-[#18181b] flex flex-col justify-between space-y-6">
              <div>
                <div className="aspect-16/10 rounded overflow-hidden mb-4 border border-[#27272a]">
                  <img src={currentVehicle.images.main} alt={currentVehicle.name} className="w-full h-full object-cover" />
                </div>

                <div className="font-tech text-xs text-[#FF2A00] uppercase tracking-wider">
                  {currentVehicle.badge}
                </div>
                <h3 className="font-display font-bold text-2xl text-white mt-1">
                  {currentVehicle.name}
                </h3>
                <div className="text-xl font-display font-bold text-white mt-1">
                  ${currentVehicle.price.toLocaleString()}
                </div>

                <div className="mt-4 pt-4 border-t border-[#18181b] space-y-2 font-tech text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">CHASSIS VIN:</span>
                    <span className="text-white font-bold">{currentVehicle.vinNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">POWER:</span>
                    <span className="text-white font-bold">{currentVehicle.specs.powerHp} HP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">DRIVETRAIN:</span>
                    <span className="text-white font-bold">{currentVehicle.specs.drivetrain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">VAULT LOCATION:</span>
                    <span className="text-[#00FF66] font-bold">{currentVehicle.locationStatus}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#121214] border border-[#18181b] rounded font-tech text-xs text-[#71717a] space-y-1">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#FF2A00]" />
                  <span>EMPATHON ESCROW PROTOCOL</span>
                </div>
                <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                  Funds held in tri-party institutional escrow until full physical verification and optical laser inspection is signed off by buyer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINANCING & LEASE CALCULATOR */}
        {activeTab === 'finance' && (
          <div className="bg-[#09090b] p-6 rounded border border-[#18181b] grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 font-tech">
              <div>
                <h3 className="text-xl font-display font-bold text-white uppercase">
                  BESPOKE ATELIER CAPITAL ALLOCATION
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-1">
                  Structured high-asset portfolio financing with zero prepayment penalty and flexible trade-in credit roll-over.
                </p>
              </div>

              {/* Down Payment Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717a]">INITIAL CAPITAL COMMITMENT (DOWN PAYMENT)</span>
                  <span className="text-[#FF2A00] font-bold">{downPaymentPct}% (${downPaymentAmount.toLocaleString()})</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(parseInt(e.target.value, 10))}
                  className="w-full accent-[#FF2A00]"
                />
                <div className="flex justify-between text-[10px] text-[#71717a]">
                  <span>10% MINIMUM</span>
                  <span>50% CONSERVATIVE</span>
                </div>
              </div>

              {/* Loan Term Selector */}
              <div className="space-y-2">
                <span className="text-xs text-[#71717a] block">TERM COMMITMENT (MONTHS)</span>
                <div className="grid grid-cols-4 gap-2">
                  {[24, 36, 48, 60].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(1000);
                        setLoanTermMonths(term);
                      }}
                      className={`py-2 text-xs font-bold rounded border transition-colors ${
                        loanTermMonths === term 
                          ? 'bg-[#FF2A00] text-black border-[#FF2A00]' 
                          : 'bg-[#121214] text-white border-[#27272a]'
                      }`}
                    >
                      {term} MO
                    </button>
                  ))}
                </div>
              </div>

              {/* Trade-In Estimator Box */}
              <div className="p-4 bg-[#121214] border border-[#18181b] rounded space-y-3">
                <span className="text-xs text-white font-bold uppercase block">
                  ASSET TRADE-IN VALUATION CREDIT
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Existing Vehicle Make / Model"
                    className="p-2 bg-black border border-[#27272a] rounded text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Mileage / Mileage km"
                    className="p-2 bg-black border border-[#27272a] rounded text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Monthly Breakdown */}
            <div className="bg-[#121214] p-6 rounded border border-[#27272a] flex flex-col justify-between space-y-6">
              <div>
                <div className="font-tech text-xs text-[#71717a] uppercase tracking-wider">
                  PROJECTED MONTHLY ALLOCATION
                </div>
                <div className="font-display font-bold text-4xl sm:text-5xl text-white mt-2">
                  ${Math.round(monthlyPayment).toLocaleString()} <span className="text-sm font-tech text-[#71717a]">/ MONTH</span>
                </div>
                <div className="text-xs font-tech text-[#00FF66] mt-1">
                  PRE-APPROVED TIER-1 ATELIER LEASE // 5.9% FIXED APR
                </div>

                <div className="mt-6 pt-6 border-t border-[#18181b] space-y-3 font-tech text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">VEHICLE CAPITAL BASE:</span>
                    <span className="text-white font-bold">${currentVehicle.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">DOWN PAYMENT ({downPaymentPct}%):</span>
                    <span className="text-[#FF2A00] font-bold">${downPaymentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">FINANCED PRINCIPAL:</span>
                    <span className="text-white font-bold">${principal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">DURATION:</span>
                    <span className="text-white font-bold">{loanTermMonths} MONTHS</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(1100);
                  setActiveTab('escrow');
                }}
                className="w-full py-3 bg-[#FF2A00] hover:bg-[#e02600] text-black font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors"
              >
                APPLY FOR THIS FINANCIAL STRUCTURE
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PRIVATE CIRCUIT TEST DRIVE */}
        {activeTab === 'circuit' && (
          <div className="bg-[#09090b] p-6 rounded border border-[#18181b] grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5 font-tech text-xs">
              <div>
                <h3 className="text-xl font-display font-bold text-white uppercase">
                  PRIVATE TRACK-DAY &amp; DRIFT EVALUATION
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-1 font-body">
                  Experience full telemetry logging, limitless skidpad entries, and high-speed circuit evaluation at our private nocturnal test track.
                </p>
              </div>

              <div>
                <label className="block text-[#71717a] mb-1.5 uppercase">PREFERRED TEST DATE</label>
                <input
                  type="date"
                  value={circuitDate}
                  onChange={(e) => setCircuitDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121214] border border-[#27272a] rounded text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#71717a] mb-1.5 uppercase">CIRCUIT WINDOW</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    '20:00 - 23:00 (Twilight Attack)',
                    '23:00 - 03:00 (Midnight Nocturne)'
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(1000);
                        setTimeSlot(slot);
                      }}
                      className={`p-2.5 text-left rounded border transition-colors ${
                        timeSlot === slot ? 'bg-[#FF2A00] text-black font-bold border-[#FF2A00]' : 'bg-[#121214] text-white border-[#27272a]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#121214] border border-[#18181b] rounded space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">FORMULA DRIFT MASTER INSTRUCTOR</span>
                    <span className="text-[11px] text-[#71717a]">Dedicated 1-on-1 backward drift &amp; telemetry coaching</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={driftCoachIncluded}
                    onChange={(e) => setDriftCoachIncluded(e.target.checked)}
                    className="w-4 h-4 accent-[#FF2A00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#71717a] mb-1.5 uppercase">TIRE ALLOCATION PACKAGE</label>
                <select
                  value={tireSet}
                  onChange={(e) => setTireSet(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121214] border border-[#27272a] rounded text-white focus:outline-none"
                >
                  <option value="Toyo Proxes R888R (2 Fresh Sets)">Toyo Proxes R888R (2 Fresh Sets Included)</option>
                  <option value="Michelin Pilot Sport Cup 2 R">Michelin Pilot Sport Cup 2 R (Grip Telemetry)</option>
                  <option value="Valino Pergea 08R Drift Spec">Valino Pergea 08R Drift Spec (Maximum Smoke)</option>
                </select>
              </div>
            </div>

            {/* Test Drive Confirmation Box */}
            <div className="bg-[#121214] p-6 rounded border border-[#27272a] flex flex-col justify-between space-y-6 font-tech">
              <div>
                <span className="text-xs text-[#FF2A00] uppercase tracking-wider block">
                  EXPERIENCE ALLOCATION // SECTOR 7 CIRCUIT
                </span>
                <div className="font-display font-bold text-3xl text-white mt-1">
                  NOCTURNE VIP PASS
                </div>

                <div className="mt-4 space-y-2 text-xs text-[#a1a1aa] border-t border-[#18181b] pt-4">
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">ASSIGNED SPECIMEN:</span>
                    <span className="text-white font-bold">{currentVehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">SCHEDULED DATE:</span>
                    <span className="text-white font-bold">{circuitDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">SESSION WINDOW:</span>
                    <span className="text-white font-bold">{timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">TIRE CARTRIDGE:</span>
                    <span className="text-white font-bold">{tireSet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717a]">COACHING:</span>
                    <span className="text-[#00FF66] font-bold">{driftCoachIncluded ? 'CONFIRMED' : 'SELF-DIRECTED'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(1300);
                  setSubmissionReceipt({
                    tokenId: `TRACK-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
                    timestamp: new Date().toISOString(),
                    vehicleName: currentVehicle.name,
                    amount: 0
                  });
                }}
                className="w-full py-3.5 bg-[#FF2A00] hover:bg-[#e02600] text-black font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-[0_0_15px_rgba(255,42,0,0.3)]"
              >
                CONFIRM CIRCUIT SLOT RESERVATION
              </button>
            </div>
          </div>
        )}

        {/* Cryptographic Confirmation Modal / Receipt Overlay */}
        {submissionReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-[#0c0c0e] border border-[#00FF66] p-6 sm:p-8 rounded max-w-lg w-full font-tech space-y-4 shadow-[0_0_30px_rgba(0,255,102,0.2)]">
              <div className="flex items-center gap-2 text-[#00FF66]">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-bold tracking-wider text-sm">TRANSMISSION CONFIRMED // ESCROW LOCKED</span>
              </div>

              <div className="bg-black p-4 rounded border border-[#27272a] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#71717a]">DOSSIER TOKEN:</span>
                  <span className="text-[#FF2A00] font-bold">{submissionReceipt.tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717a]">SPECIMEN ALLOCATED:</span>
                  <span className="text-white font-bold">{submissionReceipt.vehicleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717a]">TIMESTAMP:</span>
                  <span className="text-[#a1a1aa]">{submissionReceipt.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                Your private concierge has received the encrypted dossier. You will receive an authenticated GPG-signed wire packet within 60 minutes.
              </p>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(900);
                  setSubmissionReceipt(null);
                }}
                className="w-full py-2.5 bg-[#18181b] hover:bg-[#27272a] text-white border border-[#27272a] rounded text-xs tracking-wider uppercase transition-colors"
              >
                DISMISS RECEIPT
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
