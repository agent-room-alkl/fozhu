/**
 * Pure Tibetan Singing Bowl Acoustic Synthesizer using Web Audio API.
 * Emulates the warm resonance, metallic overtone harmonics, and slow meditative decay
 * of an antique Himalayan hand-hammered singing bowl.
 */
class TibetanBowlAudio {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Strike the singing bowl with a soft mallet.
   * Fundamental frequency defaults to 432 Hz (Verdi tuning for heart resonance).
   */
  public strike(fundamental: number = 432, duration: number = 6.0) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.3, now);
      masterGain.connect(this.ctx.destination);

      // Overtones for a traditional 7-metal singing bowl: fundamental, harmonic 2.76, 5.4, 8.9
      const partials = [
        { mult: 1.0, gain: 0.6, decay: duration },
        { mult: 2.76, gain: 0.35, decay: duration * 0.75 },
        { mult: 5.40, gain: 0.15, decay: duration * 0.5 },
        { mult: 8.91, gain: 0.08, decay: duration * 0.35 },
      ];

      partials.forEach(partial => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();

        // Sine wave with slight vibrato
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * partial.mult, now);

        // Soft mallet strike envelope: fast attack (0.04s) and exponential decay
        pGain.gain.setValueAtTime(0.001, now);
        pGain.gain.linearRampToValueAtTime(partial.gain, now + 0.04);
        pGain.gain.exponentialRampToValueAtTime(0.0001, now + partial.decay);

        osc.connect(pGain);
        pGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + partial.decay);
      });
    } catch {
      // AudioContext not allowed before user gesture or unsupported
    }
  }

  /**
   * Continuous gentle singing bowl rim rub resonance loop (e.g. for meditation timer)
   */
  public toggleChantTone(onStateChange?: (playing: boolean) => void) {
    if (this.isPlaying) {
      this.isPlaying = false;
      if (onStateChange) onStateChange(false);
      return;
    }
    this.strike(432, 5.0);
    this.isPlaying = true;
    if (onStateChange) onStateChange(true);

    const interval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(interval);
        return;
      }
      this.strike(432, 5.0);
    }, 4500);
  }
}

export const singingBowl = new TibetanBowlAudio();
