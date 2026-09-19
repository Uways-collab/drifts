import { Vehicle, SurveillanceCam } from '../types';

export const VEHICLES: Vehicle[] = [
  {
    id: 'porsche-992-gt3rs-clubsport',
    name: 'Porsche 911 GT3 RS Clubsport',
    make: 'Porsche',
    model: '911 GT3 RS (992)',
    year: 2024,
    category: 'gt-track',
    price: 425000,
    badge: 'STAGE III TRACK SPEC',
    tagline: 'Pure Atmospheric Violence. 9,000 RPM Active Aero Monster.',
    description: 'Bespoke Weissach Package chassis with full dry carbon aero package, DRS drag reduction system, active front diffuser, and titanium roll cage. Tuned for aggressive midnight circuit assault and razor-sharp drift transitions.',
    specs: {
      engine: '4.0L Naturally Aspirated Flat-6',
      displacement: '3,996 cc',
      powerHp: 525,
      torqueNm: 465,
      topSpeedMph: 184,
      zeroToSixtySec: 3.0,
      weightKg: 1450,
      drivetrain: 'RWD',
      transmission: '7-Speed PDK Sport',
      redlineRpm: 9000
    },
    driftSetup: {
      steeringLockAngle: 62,
      lsdLockPct: 88,
      downforceKgAt200: 409,
      tireCompound: 'Michelin Pilot Sport Cup 2 R',
      weightDistribution: '47:53',
      boostPressureBar: 0.0,
      camberFront: '-3.8°',
      camberRear: '-2.4°'
    },
    chassisCode: 'WP0ZZZ99ZPS29',
    vinNumber: 'WP0AF2A97RS198421',
    locationStatus: 'PADDOCK BAY 01',
    color: '#0D0D0E (Matte Black / Acid Red)',
    inStock: true,
    images: {
      main: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1400&auto=format&fit=crop',
      side: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop',
      cockpit: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1400&auto=format&fit=crop',
      engine: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1400&auto=format&fit=crop'
    },
    dynoCurve: [
      { rpm: 2000, hp: 120, torque: 340 },
      { rpm: 3500, hp: 215, torque: 410 },
      { rpm: 5000, hp: 320, torque: 445 },
      { rpm: 6500, hp: 420, torque: 465 },
      { rpm: 8000, hp: 505, torque: 450 },
      { rpm: 9000, hp: 525, torque: 420 }
    ]
  },
  {
    id: 'nissan-skyline-gtr-r34-vspec-ii-nur',
    name: 'Nissan Skyline GT-R R34 V-Spec II Nür',
    make: 'Nissan',
    model: 'Skyline GT-R (BNR34)',
    year: 2002,
    category: 'jdm-legend',
    price: 390000,
    badge: 'MIDNIGHT PURPLE III // NUR SPEC',
    tagline: 'The Legendary God of the Wangan. 1 of 718 Ever Manufactured.',
    description: 'Fully restored and blueprinted N1-spec RB26 block with HKS Step 2 twin GTIII turbochargers, dry sump oiling, ATTESA E-TS Pro AWD with custom drift-mode torque transfer selector, and RAYS Volk Racing TE37RT forged wheels.',
    specs: {
      engine: '2.6L RB26DETT N1 Twin-Turbo Inline-6',
      displacement: '2,568 cc',
      powerHp: 680,
      torqueNm: 710,
      topSpeedMph: 208,
      zeroToSixtySec: 2.9,
      weightKg: 1540,
      drivetrain: 'AWD',
      transmission: 'Getrag 6-Speed Manual',
      redlineRpm: 8800
    },
    driftSetup: {
      steeringLockAngle: 68,
      lsdLockPct: 90,
      downforceKgAt200: 280,
      tireCompound: 'Toyo Proxes R888R',
      weightDistribution: '54:46',
      boostPressureBar: 2.1,
      camberFront: '-4.2°',
      camberRear: '-1.8°'
    },
    chassisCode: 'BNR34-403918',
    vinNumber: 'BNR340403918NUR',
    locationStatus: 'SUB-TERRA VAULT',
    color: '#1C152B (Midnight Purple III)',
    inStock: true,
    images: {
      main: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1400&auto=format&fit=crop',
      side: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1400&auto=format&fit=crop',
      cockpit: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1400&auto=format&fit=crop',
      engine: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1400&auto=format&fit=crop'
    },
    dynoCurve: [
      { rpm: 2500, hp: 160, torque: 380 },
      { rpm: 4000, hp: 310, torque: 560 },
      { rpm: 5500, hp: 510, torque: 690 },
      { rpm: 7000, hp: 660, torque: 710 },
      { rpm: 8200, hp: 680, torque: 670 },
      { rpm: 8800, hp: 650, torque: 620 }
    ]
  },
  {
    id: 'ferrari-296-gtb-assetto-fiorano',
    name: 'Ferrari 296 GTB Assetto Fiorano',
    make: 'Ferrari',
    model: '296 GTB Hybrid',
    year: 2024,
    category: 'hypercar',
    price: 460000,
    badge: 'MARANELLO HYBRID HYPER-GT',
    tagline: '120° Hot-V Twin Turbo + MGU-K Electric Kinetic Boost.',
    description: 'Assetto Fiorano lightweight competition package with Multimatic racing dampers, high-downforce carbon front splitter, Lexan rear screen, and carbon fiber five-spoke wheels. Instant electric torque paired with high-frequency V6 symphony.',
    specs: {
      engine: '3.0L 120° Twin-Turbo V6 + Electric Motor',
      displacement: '2,992 cc',
      powerHp: 830,
      torqueNm: 740,
      topSpeedMph: 205,
      zeroToSixtySec: 2.7,
      weightKg: 1470,
      drivetrain: 'RWD',
      transmission: '8-Speed Dual-Clutch F1',
      redlineRpm: 8500
    },
    driftSetup: {
      steeringLockAngle: 58,
      lsdLockPct: 82,
      downforceKgAt200: 360,
      tireCompound: 'Michelin Pilot Sport Cup 2 R',
      weightDistribution: '40:60',
      boostPressureBar: 2.4,
      camberFront: '-3.2°',
      camberRear: '-2.1°'
    },
    chassisCode: 'ZFF96LH0000281',
    vinNumber: 'ZFF96LH0000281994',
    locationStatus: 'DYNO CELL',
    color: '#080808 (Nero Daytona / Rosso Corsa Stripe)',
    inStock: true,
    images: {
      main: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1400&auto=format&fit=crop',
      side: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1400&auto=format&fit=crop',
      cockpit: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1400&auto=format&fit=crop',
      engine: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1400&auto=format&fit=crop'
    },
    dynoCurve: [
      { rpm: 2000, hp: 280, torque: 600 },
      { rpm: 3500, hp: 460, torque: 720 },
      { rpm: 5000, hp: 640, torque: 740 },
      { rpm: 6500, hp: 770, torque: 730 },
      { rpm: 8000, hp: 830, torque: 700 },
      { rpm: 8500, hp: 820, torque: 670 }
    ]
  },
  {
    id: 'mclaren-765lt-spider-carbon',
    name: 'McLaren 765LT Spider Blackout',
    make: 'McLaren',
    model: '765LT Spider',
    year: 2023,
    category: 'hypercar',
    price: 515000,
    badge: '1 OF 765 WORLDWIDE // LONGTAIL',
    tagline: 'Relentless Carbon Monocoque. 765 PS of Unfiltered Adrenaline.',
    description: 'MSO Bespoke Sarthe Black with satin exposed carbon weave. Active longtail rear airbrake, quad-exit full titanium exhaust system that glows bright violet under full throttle, and ultra-lightweight forged alloy wheels with Pirelli Trofeo R rubber.',
    specs: {
      engine: '4.0L M840T Twin-Turbocharged V8',
      displacement: '3,994 cc',
      powerHp: 765,
      torqueNm: 800,
      topSpeedMph: 205,
      zeroToSixtySec: 2.6,
      weightKg: 1388,
      drivetrain: 'RWD',
      transmission: '7-Speed SSG Sequential Seamless',
      redlineRpm: 8500
    },
    driftSetup: {
      steeringLockAngle: 60,
      lsdLockPct: 86,
      downforceKgAt200: 420,
      tireCompound: 'Pirelli P Zero Trofeo R',
      weightDistribution: '42:58',
      boostPressureBar: 2.2,
      camberFront: '-3.5°',
      camberRear: '-2.0°'
    },
    chassisCode: 'SBM11TDA9NW00',
    vinNumber: 'SBM11TDA9NW007651',
    locationStatus: 'PADDOCK BAY 01',
    color: '#0A0A0C (Sarthe Black / Exposed Carbon)',
    inStock: true,
    images: {
      main: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1400&auto=format&fit=crop',
      side: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1400&auto=format&fit=crop',
      cockpit: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop',
      engine: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1400&auto=format&fit=crop'
    },
    dynoCurve: [
      { rpm: 2500, hp: 260, torque: 580 },
      { rpm: 4000, hp: 480, torque: 750 },
      { rpm: 5500, hp: 670, torque: 800 },
      { rpm: 7000, hp: 755, torque: 770 },
      { rpm: 8000, hp: 765, torque: 730 },
      { rpm: 8500, hp: 740, torque: 680 }
    ]
  },
  {
    id: 'mazda-rx7-fd3s-spirit-r',
    name: 'Mazda RX-7 Spirit R Type-A',
    make: 'Mazda',
    model: 'RX-7 (FD3S)',
    year: 2002,
    category: 'street-drift',
    price: 198000,
    badge: 'SERIES 8 // ROTARY DRIFT SPEC',
    tagline: 'Twin-Rotor 13B-REW Symphony. Lightweight Drift Weaponry.',
    description: 'Factory lightweight Recaro red carbon kevlar buckets, Bilstein suspension, bridge-ported 13B twin-rotary with BorgWarner EFR 8374 single turbo conversion, custom Wisefab 68-degree steering angle kit, and hydraulic handbrake.',
    specs: {
      engine: '1.3L 13B-REW Turbo Rotary (Bridge-Ported)',
      displacement: '1,308 cc',
      powerHp: 440,
      torqueNm: 480,
      topSpeedMph: 186,
      zeroToSixtySec: 3.6,
      weightKg: 1220,
      drivetrain: 'RWD',
      transmission: '5-Speed Close-Ratio Manual',
      redlineRpm: 8600
    },
    driftSetup: {
      steeringLockAngle: 68,
      lsdLockPct: 95,
      downforceKgAt200: 210,
      tireCompound: 'Valino Pergea 08R Drift Spec',
      weightDistribution: '50:50',
      boostPressureBar: 1.65,
      camberFront: '-4.8°',
      camberRear: '-1.2°'
    },
    chassisCode: 'FD3S-604219',
    vinNumber: 'FD3S604219SPRITA',
    locationStatus: 'DRIFT SKIDPAD',
    color: '#050505 (Pitch Black / Red Calipers)',
    inStock: true,
    images: {
      main: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1400&auto=format&fit=crop',
      side: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1400&auto=format&fit=crop',
      cockpit: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop',
      engine: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1400&auto=format&fit=crop'
    },
    dynoCurve: [
      { rpm: 2500, hp: 120, torque: 260 },
      { rpm: 4000, hp: 240, torque: 390 },
      { rpm: 5500, hp: 350, torque: 460 },
      { rpm: 7000, hp: 425, torque: 480 },
      { rpm: 8000, hp: 440, torque: 460 },
      { rpm: 8600, hp: 430, torque: 420 }
    ]
  },
  {
    id: 'koenigsegg-jesko-attack-nocturne',
    name: 'Koenigsegg Jesko Attack Stealth',
    make: 'Koenigsegg',
    model: 'Jesko Attack',
    year: 2024,
    category: 'hypercar',
    price: 3650000,
    badge: '1600 BHP // E85 APEX PREDATOR',
    tagline: '1,400 kg Downforce. The Fastest Production V8 on Earth.',
    description: 'Full unpainted tinted matte carbon fiber monocoque with flame-red anodized accents. 9-speed Light Speed Transmission (LST) with Ultimate Power On Demand (UPOD), twin ceramic-bearing turbochargers with air injection spool spooling system.',
    specs: {
      engine: '5.0L Flat-Plane Crank Twin-Turbo V8',
      displacement: '5,000 cc',
      powerHp: 1600,
      torqueNm: 1500,
      topSpeedMph: 310,
      zeroToSixtySec: 2.4,
      weightKg: 1420,
      drivetrain: 'RWD',
      transmission: '9-Speed Light Speed Transmission (LST)',
      redlineRpm: 8500
    },
    driftSetup: {
      steeringLockAngle: 54,
      lsdLockPct: 80,
      downforceKgAt200: 800,
      tireCompound: 'Michelin Pilot Sport Cup 2 R Custom',
      weightDistribution: '44:56',
      boostPressureBar: 2.2,
      camberFront: '-3.0°',
      camberRear: '-2.0°'
    },
    chassisCode: 'YS9A197410007',
    vinNumber: 'YS9A197410007JESKO',
    locationStatus: 'SUB-TERRA VAULT',
    color: '#080809 (Exposed Twill Matte Carbon)',
    inStock: true,
    images: {
      main: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1400&auto=format&fit=crop',
      side: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1400&auto=format&fit=crop',
      cockpit: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1400&auto=format&fit=crop',
      engine: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1400&auto=format&fit=crop'
    },
    dynoCurve: [
      { rpm: 2500, hp: 450, torque: 980 },
      { rpm: 4000, hp: 890, torque: 1350 },
      { rpm: 5500, hp: 1320, torque: 1500 },
      { rpm: 7000, hp: 1560, torque: 1480 },
      { rpm: 8000, hp: 1600, torque: 1420 },
      { rpm: 8500, hp: 1580, torque: 1340 }
    ]
  }
];

export const SURVEILLANCE_CAMS: SurveillanceCam[] = [
  {
    id: 'cam-01',
    name: 'PADDOCK BAY 01 // STAGING',
    code: 'SEC-CAM-01-NIGHT',
    status: 'RECORDING',
    location: 'Atelier North Wing • Hangar 4',
    focalLength: '35mm ƒ/1.4 IR-Illuminated',
    fps: 60,
    bitrate: '52.4 Mbps 4K H.265 RAW',
    description: 'Real-time surveillance over active vehicle staging and laser wheel alignment bay.',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'cam-02',
    name: 'DYNO TEST CELL // HIGH LOAD',
    code: 'SEC-CAM-02-THERM',
    status: 'RECORDING',
    location: 'Acoustic Dyno Chamber • Cell B',
    focalLength: '50mm ƒ/1.2 Telemetry Linked',
    fps: 120,
    bitrate: '68.0 Mbps High-Speed FLIR',
    description: 'Acoustically insulated twin-roller dynamometer cell with exhaust gas evacuation and FLIR heat sensors.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'cam-03',
    name: 'NOCTURNAL DRIFT SKIDPAD',
    code: 'SEC-CAM-03-PZM',
    status: 'ONLINE',
    location: 'Asphalt Compound • Sector 7 Track',
    focalLength: '85mm ƒ/1.8 Low-Light High-Contrast',
    fps: 60,
    bitrate: '45.1 Mbps Broadcast Stream',
    description: 'High-grip polished asphalt circular pad with dynamic water wetting jets for drift angle calibration.',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'cam-04',
    name: 'SUB-TERRA COLLECTOR VAULT',
    code: 'SEC-CAM-04-CRYPTO',
    status: 'SECURE',
    location: 'Level -2 Reinforced Bunker Vault',
    focalLength: '24mm ƒ/2.8 Ultra-Wide Night Vision',
    fps: 30,
    bitrate: '34.8 Mbps Vault Feed',
    description: 'Hermetically sealed, climate and humidity controlled underground vault for ultra-rare hypercars.',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop'
  }
];
