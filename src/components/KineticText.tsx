import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KineticTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  accentColor?: string;
  staggerFrames?: number;
  align?: 'left' | 'center' | 'right';
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  fontSize = 68,
  color = '#F8FAFC',
  accentColor = '#38BDF8',
  staggerFrames = 4,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.trim().split(/\s+/);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent:
          align === 'center'
            ? 'center'
            : align === 'right'
              ? 'flex-end'
              : 'flex-start',
        gap: `${Math.round(fontSize * 0.24)}px`,
        lineHeight: 1.15,
      }}
    >
      {words.map((word, index) => {
        const delay = index * staggerFrames;
        const wordSpring = spring({
          frame: frame - delay,
          fps,
          config: {
            damping: 14,
            stiffness: 160,
            mass: 0.7,
          },
        });

        const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const translateY = interpolate(wordSpring, [0, 1], [42, 0]);
        const scale = interpolate(wordSpring, [0, 1], [0.85, 1]);

        // Đánh dấu nổi bật từ khóa cuối hoặc từ chứa số/phần trăm
        const isHighlighted =
          index === words.length - 1 || /[0-9%+#]/.test(word);

        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: 'inline-block',
              fontSize,
              fontWeight: 800,
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: isHighlighted ? accentColor : color,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              textShadow: isHighlighted
                ? `0 8px 28px ${accentColor}55`
                : '0 4px 16px rgba(0,0,0,0.45)',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

