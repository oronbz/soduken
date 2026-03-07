let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  vol: number = 0.12,
  type: OscillatorType = 'sine',
  delay: number = 0,
) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, c.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + duration);
}

function sweep(from: number, to: number, duration: number, vol: number = 0.1, delay: number = 0) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(from, c.currentTime + delay);
  osc.frequency.exponentialRampToValueAtTime(to, c.currentTime + delay + duration);
  gain.gain.setValueAtTime(vol, c.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + duration);
}

export const sounds = {
  /** Soft tap when selecting a cell */
  tap() {
    tone(480, 0.06, 0.08);
  },

  /** Warm plop when placing a number */
  place() {
    tone(520, 0.09, 0.1);
    tone(700, 0.07, 0.06, 'sine', 0.03);
  },

  /** Light tick for pencil marks */
  pencil() {
    tone(880, 0.04, 0.06, 'triangle');
  },

  /** Soft descending tone for erase */
  erase() {
    sweep(440, 280, 0.12, 0.08);
  },

  /** Gentle reverse for undo */
  undo() {
    sweep(500, 350, 0.1, 0.07);
  },

  /** Pleasant ding for hint */
  hint() {
    tone(660, 0.2, 0.1);
    tone(880, 0.15, 0.07, 'sine', 0.08);
  },

  /** Gentle low wobble for error */
  error() {
    tone(220, 0.18, 0.1, 'triangle');
    tone(200, 0.15, 0.07, 'triangle', 0.04);
  },

  /** Warm ascending chime for completion */
  complete() {
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      tone(freq, 0.35, 0.1, 'sine', i * 0.12);
    });
  },

  /** Quick click for pencil mode toggle */
  toggle() {
    tone(640, 0.04, 0.07);
  },
};
