"use client";

/**
 * Luxury Web Audio Synthesizer:
 * Subtle haptic feedback & gentle crystal chimes with zero external audio assets.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted(): boolean {
  if (typeof window === "undefined") return true;
  return (
    localStorage.getItem("linkface_sound_muted") === "true" ||
    localStorage.getItem("linklet_sound_muted") === "true" ||
    localStorage.getItem("aurum_sound_muted") === "true" ||
    localStorage.getItem("craftlink_sound_muted") === "true"
  );
}

export function toggleAudioMuted(): boolean {
  if (typeof window === "undefined") return true;
  const current = isAudioMuted();
  const next = !current;
  localStorage.setItem("linkface_sound_muted", next ? "true" : "false");
  localStorage.setItem("linklet_sound_muted", next ? "true" : "false");
  if (!next) {
    playLevelUpSound();
  }
  return next;
}

// 1. Refined Haptic Click (Soft subtle tap)
export function playClickSound() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.035);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.035);
}

// 2. Crystal Gold Chime (Subtle Luxury Tone)
export function playLevelUpSound() {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [880, 1318.51]; // A5 -> E6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.08);
    osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
  });
}
