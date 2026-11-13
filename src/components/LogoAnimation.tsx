import React from 'react';
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface LogoAnimationProps {
  size?: number;
  accentColor?: string;
  label?: string;
}

export const LogoAnimation: React.FC<LogoAnimationProps> = ({
  size = 130,
  accentColor = '#6366F1',
  label = 'REMOTION ENGINE',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mô phỏng vật lý với spring() cho chuyển động pop-up tự nhiên
  const scaleProgress = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 140,
      mass: 0.8,
    },
  });

  // Nội suy góc xoay từ -25 độ về 0 độ trong 25 frame đầu
  const rotateDeg = interpolate(frame, [0, 25], [-25, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Vòng hào quang (halo ring) giãn nở theo frame
  const ringScale = interpolate(frame % 60, [0, 60], [1, 1.45], {
    extrapolateRight: 'clamp',
  });
  const ringOpacity = interpolate(frame % 60, [0, 60], [0.55, 0], {
    extrapolateRight: 'clamp',
  });

  // Hiển thị nhãn bên dưới logo
  const labelOpacity = interpolate(frame, [12, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const labelTranslateY = interpolate(frame, [12, 28], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scaleProgress}) rotate(${rotateDeg}deg)`,
        }}
      >
        {/* Vòng sóng lan tỏa điều khiển hoàn toàn bằng toán học theo frame */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 32,
            border: `2px solid ${accentColor}`,
            transform: `scale(${ringScale})`,
            opacity: ringOpacity,
          }}
        />
        <Img
          src={staticFile('logo.svg')}
          style={{
            width: size,
            height: size,
            filter: `drop-shadow(0 16px 32px ${accentColor}66)`,
          }}
        />
      </div>

      {label ? (
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${labelTranslateY}px)`,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#CBD5E1',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: `1px solid ${accentColor}55`,
            padding: '6px 18px',
            borderRadius: 999,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

