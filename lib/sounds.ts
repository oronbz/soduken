let ctx: AudioContext | null = null;
let warmedUp = false;

function getCtx(): AudioContext | null {
  if (!ctx || !warmedUp) return null;
  return ctx;
}

/** Must be called from a direct user gesture (click/touch) to unlock audio on mobile. */
export function warmUpAudio() {
  if (warmedUp) return;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  // Play a silent buffer to fully unlock on iOS Safari
  const buffer = ctx.createBuffer(1, 1, 22050);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
  warmedUp = true;
}

function tone(
  freq: number,
  duration: number,
  vol: number = 0.12,
  type: OscillatorType = 'sine',
  delay: number = 0,
) {
  const c = getCtx();
  if (!c) return;
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
  if (!c) return;
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
  tap() {
    tone(480, 0.06, 0.08);
  },

  place() {
    tone(520, 0.09, 0.1);
    tone(700, 0.07, 0.06, 'sine', 0.03);
  },

  pencil() {
    tone(880, 0.04, 0.06, 'triangle');
  },

  erase() {
    sweep(440, 280, 0.12, 0.08);
  },

  undo() {
    sweep(500, 350, 0.1, 0.07);
  },

  hint() {
    tone(660, 0.2, 0.1);
    tone(880, 0.15, 0.07, 'sine', 0.08);
  },

  error() {
    tone(220, 0.18, 0.1, 'triangle');
    tone(200, 0.15, 0.07, 'triangle', 0.04);
  },

  complete() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      tone(freq, 0.35, 0.1, 'sine', i * 0.12);
    });
  },

  toggle() {
    tone(640, 0.04, 0.07);
  },
};
