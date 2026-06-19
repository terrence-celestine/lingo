const audioCtx = new (
  window.AudioContext || (window as any).webkitAudioContext
)();

function playTone(
  frequency: number,
  type: OscillatorType,
  duration: number,
  volume: number = 0.3,
  delay: number = 0,
) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay);

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(
    volume,
    audioCtx.currentTime + delay + 0.01,
  );
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + delay + duration,
  );

  oscillator.start(audioCtx.currentTime + delay);
  oscillator.stop(audioCtx.currentTime + delay + duration);
}

export function playCorrect() {
  // Pleasant ascending two-tone chime
  playTone(523, "sine", 0.15, 0.25); // C5
  playTone(659, "sine", 0.2, 0.25, 0.12); // E5
  playTone(784, "sine", 0.25, 0.25, 0.22); // G5
}

export function playWrong() {
  // Low dull thud
  playTone(180, "square", 0.15, 0.15);
  playTone(150, "square", 0.2, 0.15, 0.1);
}

export function playLevelUp() {
  // Celebratory ascending run
  playTone(523, "sine", 0.1, 0.2);
  playTone(659, "sine", 0.1, 0.2, 0.1);
  playTone(784, "sine", 0.1, 0.2, 0.2);
  playTone(1046, "sine", 0.3, 0.25, 0.3);
}

export function playComplete() {
  // Warm resolution chord
  playTone(523, "sine", 0.4, 0.15);
  playTone(659, "sine", 0.4, 0.15, 0.05);
  playTone(784, "sine", 0.4, 0.15, 0.1);
}
