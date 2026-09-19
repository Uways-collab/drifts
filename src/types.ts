export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  category: 'hypercar' | 'gt-track' | 'jdm-legend' | 'street-drift';
  price: number;
  badge: string;
  tagline: string;
  description: string;
  specs: {
    engine: string;
    displacement: string;
    powerHp: number;
    torqueNm: number;
    topSpeedMph: number;
    zeroToSixtySec: number;
    weightKg: number;
    drivetrain: 'RWD' | 'AWD' | '4WD';
    transmission: string;
    redlineRpm: number;
  };
  driftSetup: {
    steeringLockAngle: number; // e.g. 65 deg
    lsdLockPct: number; // e.g. 85%
    downforceKgAt200: number; // e.g. 450 kg
    tireCompound: string; // e.g. "Michelin Pilot Sport Cup 2 R"
    weightDistribution: string; // e.g. "48:52"
    boostPressureBar: number; // e.g. 1.95 bar
    camberFront: string; // e.g. "-3.8°"
    camberRear: string; // e.g. "-1.5°"
  };
  chassisCode: string;
  vinNumber: string;
  locationStatus: 'PADDOCK BAY 01' | 'DYNO CELL' | 'DRIFT SKIDPAD' | 'SUB-TERRA VAULT';
  images: {
    main: string;
    side: string;
    cockpit: string;
    engine: string;
  };
  dynoCurve: { rpm: number; hp: number; torque: number }[];
  color: string;
  inStock: boolean;
}

export type CanvasRenderMode = 'standard' | 'wireframe' | 'flir' | 'surveillance';

export interface SurveillanceCam {
  id: string;
  name: string;
  code: string;
  status: 'ONLINE' | 'RECORDING' | 'SECURE';
  location: string;
  focalLength: string;
  fps: number;
  bitrate: string;
  description: string;
  image: string;
}

export interface DriftTelemetry {
  gForceX: number;
  gForceY: number;
  slipAngle: number;
  steeringAngle: number;
  rpm: number;
  speedMph: number;
  gear: number;
  boostBar: number;
  tireTemps: {
    fl: number;
    fr: number;
    rl: number;
    rr: number;
  };
  tirePressures: {
    fl: number;
    fr: number;
    rl: number;
    rr: number;
  };
}

export interface InquiryFormData {
  vehicleId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  paymentMethod: 'fiat-wire' | 'crypto-btc' | 'crypto-eth' | 'crypto-usdt';
  deliveryType: 'private-vault-handover' | 'track-day-delivery' | 'enclosed-air-freight';
  requestedDate: string;
  circuitTrackPass: boolean;
  dedicatedInstructor: boolean;
  notes: string;
}
