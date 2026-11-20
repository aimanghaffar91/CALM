// Web Audio API procedural sound engine - zero external asset dependencies
class CalmingAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.currentMode = null;
    this.activeNodes = [];
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stop() {
    if (!this.ctx || !this.isPlaying) return;
    
    // Smooth ramp down to avoid audio pop
    const now = this.ctx.currentTime;
    this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.3);

    setTimeout(() => {
      this.activeNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch {
          // ignore already stopped
        }
      });
      this.activeNodes = [];
      this.isPlaying = false;
      this.currentMode = null;
    }, 350);
  }

  setVolume(val) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, val));
      this.masterGain.gain.setValueAtTime(clamped * 0.25, this.ctx.currentTime);
    }
  }

  play(mode = 'theta') {
    this.init();
    if (this.isPlaying && this.currentMode === mode) {
      this.stop();
      return false;
    }

    if (this.isPlaying) {
      this.stop();
      setTimeout(() => this._startMode(mode), 400);
    } else {
      this._startMode(mode);
    }
    return true;
  }

  _startMode(mode) {
    this.init();
    const now = this.ctx.currentTime;
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.linearRampToValueAtTime(0.18, now + 1.2);
    this.isPlaying = true;
    this.currentMode = mode;

    if (mode === 'theta') {
      // 6 Hz Binaural Theta Beat (Deep relaxation & vagal soothing)
      const merger = this.ctx.createChannelMerger(2);

      const oscLeft = this.ctx.createOscillator();
      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(200, now); // Left ear: 200 Hz

      const oscRight = this.ctx.createOscillator();
      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(206, now); // Right ear: 206 Hz -> 6 Hz Theta differential

      oscLeft.connect(merger, 0, 0);
      oscRight.connect(merger, 0, 1);
      merger.connect(this.masterGain);

      oscLeft.start(now);
      oscRight.start(now);
      this.activeNodes = [oscLeft, oscRight, merger];

    } else if (mode === 'rainfall') {
      // Procedural soft rain / pink noise generator
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(800, now);

      whiteNoise.connect(lowpass);
      lowpass.connect(this.masterGain);
      whiteNoise.start(now);
      this.activeNodes = [whiteNoise, lowpass];

    } else if (mode === 'solfeggio432') {
      // 432 Hz Healing Resonance Tone with soft tremolo
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now);

      const tremolo = this.ctx.createOscillator();
      tremolo.frequency.setValueAtTime(0.2, now); // Gentle 0.2 Hz slow breath wave
      const tremoloGain = this.ctx.createGain();
      tremoloGain.gain.setValueAtTime(0.04, now);

      tremolo.connect(tremoloGain);
      osc.connect(this.masterGain);

      osc.start(now);
      tremolo.start(now);
      this.activeNodes = [osc, tremolo, tremoloGain];
    }
  }

  // Gentle haptic chime for breath transitions
  playBreathChime(type = 'inhale') {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      const freq = type === 'inhale' ? 320 : type === 'hold' ? 360 : 280;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.4);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Audio might be suspended or inactive
    }
  }
}

export const soundEngine = new CalmingAudioEngine();
