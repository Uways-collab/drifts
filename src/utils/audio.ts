/**
 * Web Audio API procedural engine synthesizer and industrial audio manager.
 * Operates purely client-side with zero external assets for instant, reliable response.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private idleOsc1: OscillatorNode | null = null;
  private idleOsc2: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;
  private isEngineRunning: boolean = false;
  private currentRpm: number = 900;
  private targetRpm: number = 900;
  private rpmInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopEngine();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playClick(freq = 1200, duration = 0.03) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext auto-play policy guard
    }
  }

  public playGlitch() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      filter.Q.value = 3.5;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // ignore
    }
  }

  public startEngine() {
    if (this.isMuted || this.isEngineRunning) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      this.isEngineRunning = true;
      const now = this.ctx.currentTime;

      // Engine Master Gain
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.001, now);
      this.engineGain.gain.linearRampToValueAtTime(0.15, now + 0.5);

      // Lowpass filter simulating exhaust manifold & muffler
      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(240, now);
      this.engineFilter.Q.setValueAtTime(4.0, now);

      // Primary Cylinder firing frequency (sawtooth)
      this.idleOsc1 = this.ctx.createOscillator();
      this.idleOsc1.type = 'sawtooth';
      this.idleOsc1.frequency.setValueAtTime(32, now); // ~960 RPM (for 6 cyl: 32Hz * 30)

      // Harmonic secondary (triangle)
      this.idleOsc2 = this.ctx.createOscillator();
      this.idleOsc2.type = 'triangle';
      this.idleOsc2.frequency.setValueAtTime(64, now);

      // Sub-bass thump
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.setValueAtTime(42, now);

      this.idleOsc1.connect(this.engineFilter);
      this.idleOsc2.connect(this.engineFilter);
      this.subOsc.connect(this.engineFilter);

      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.idleOsc1.start();
      this.idleOsc2.start();
      this.subOsc.start();

      this.startRpmLoop();
    } catch {
      this.isEngineRunning = false;
    }
  }

  public stopEngine() {
    if (!this.isEngineRunning) return;
    try {
      if (this.engineGain && this.ctx) {
        this.engineGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          this.idleOsc1?.stop();
          this.idleOsc2?.stop();
          this.subOsc?.stop();
          this.idleOsc1?.disconnect();
          this.idleOsc2?.disconnect();
          this.subOsc?.disconnect();
          this.idleOsc1 = null;
          this.idleOsc2 = null;
          this.subOsc = null;
          this.engineFilter = null;
          this.engineGain = null;
          this.isEngineRunning = false;
        }, 300);
      }
      if (this.rpmInterval) {
        clearInterval(this.rpmInterval);
        this.rpmInterval = null;
      }
    } catch {
      this.isEngineRunning = false;
    }
  }

  public isRunning(): boolean {
    return this.isEngineRunning;
  }

  public revEngine(targetRpm: number = 8200) {
    if (this.isMuted) return;
    if (!this.isEngineRunning) {
      this.startEngine();
    }
    this.targetRpm = targetRpm;

    // Turbo spool whistle
    this.playTurboSpool();

    // Trigger backfire pop after rev peak
    setTimeout(() => {
      this.targetRpm = 950;
      this.playBlowOff();
      this.playBackfire();
    }, 1100);
  }

  private startRpmLoop() {
    if (this.rpmInterval) clearInterval(this.rpmInterval);
    this.rpmInterval = window.setInterval(() => {
      if (!this.isEngineRunning || !this.ctx || !this.engineFilter || !this.idleOsc1 || !this.idleOsc2 || !this.subOsc) return;

      // Smooth interpolation to target RPM
      this.currentRpm += (this.targetRpm - this.currentRpm) * 0.14;

      // Calculate base cylinder pulse frequency for a flat-6 engine: (RPM / 60) * 3
      const baseFreq = (this.currentRpm / 60) * 2.5;
      const now = this.ctx.currentTime;

      this.idleOsc1.frequency.setTargetAtTime(baseFreq, now, 0.05);
      this.idleOsc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.05);
      this.subOsc.frequency.setTargetAtTime(baseFreq * 0.75, now, 0.05);

      // Filter opens up as RPM climbs for that visceral roar
      const filterFreq = 180 + (this.currentRpm / 9000) * 2200;
      this.engineFilter.frequency.setTargetAtTime(filterFreq, now, 0.05);
    }, 40);
  }

  public getCurrentRpm(): number {
    return Math.round(this.currentRpm);
  }

  private playTurboSpool() {
    if (this.isMuted || !this.ctx) return;
    try {
      const spoolOsc = this.ctx.createOscillator();
      const spoolGain = this.ctx.createGain();

      spoolOsc.type = 'sine';
      spoolOsc.frequency.setValueAtTime(800, this.ctx.currentTime);
      spoolOsc.frequency.exponentialRampToValueAtTime(4200, this.ctx.currentTime + 0.9);

      spoolGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      spoolGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.6);
      spoolGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.1);

      spoolOsc.connect(spoolGain);
      spoolGain.connect(this.ctx.destination);

      spoolOsc.start();
      spoolOsc.stop(this.ctx.currentTime + 1.1);
    } catch {
      // ignore
    }
  }

  private playBlowOff() {
    if (this.isMuted || !this.ctx) return;
    try {
      // Blow-off valve flutter (white noise gated in pulses)
      const duration = 0.45;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Flutter modulation: 24Hz wave
        const flutter = Math.sin((i / this.ctx.sampleRate) * Math.PI * 2 * 28);
        const env = Math.exp(-i / (bufferSize * 0.35));
        data[i] = (Math.random() * 2 - 1) * env * (0.6 + 0.4 * flutter);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3200;
      filter.Q.value = 2.5;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // ignore
    }
  }

  private playBackfire() {
    if (this.isMuted || !this.ctx) return;
    try {
      // Crisp 2-step flame pop
      setTimeout(() => {
        if (!this.ctx) return;
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();

        popOsc.type = 'square';
        popOsc.frequency.setValueAtTime(140, this.ctx.currentTime);
        popOsc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.12);

        popGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        popOsc.connect(popGain);
        popGain.connect(this.ctx.destination);

        popOsc.start();
        popOsc.stop(this.ctx.currentTime + 0.12);
      }, 180);
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine();
