import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AudioWaveformProps {
  barsCount?: number;
  primaryColor?: string;
  secondaryColor?: string;
  height?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  barsCount = 36,
  primaryColor = '#6366F1',
  secondaryColor = '#EC4899',
  height = 96,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Hiệu ứng xuất hiện mượt ở đầu và thu nhỏ ở cuối timeline
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const exitEnvelope = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height,
        padding: '0 24px',
        opacity: enterProgress * exitEnvelope,
      }}
    >
      {Array.from({ length: barsCount }).map((_, index) => {
        // Tính toán biên độ sóng âm tất định (deterministic) theo frame & vị trí cột
        const centerDistance =
          1 - Math.abs(index - (barsCount - 1) / 2) / ((barsCount - 1) / 2);
        const waveA = Math.sin(frame * 0.22 + index * 0.45);
        const waveB = Math.cos(frame * 0.14 - index * 0.28);
        const normalizedAmplitude = (waveA * 0.55 + waveB * 0.45 + 1) / 2;

        const barHeight = interpolate(
          normalizedAmplitude * (0.35 + centerDistance * 0.65),
          [0, 1],
          [12, height]
        );

        return (
          <div
            key={index}
            style={{
              width: 6,
              height: Math.round(barHeight * enterProgress),
              borderRadius: 999,
              background: `linear-gradient(180deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              boxShadow: `0 0 12px ${primaryColor}55`,
            }}
          />
        );
      })}
    </div>
  );
};

