import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';
import { LogoAnimation } from '../components/LogoAnimation';
import { KineticText } from '../components/KineticText';
import { AudioWaveform } from '../components/AudioWaveform';

export const promoVideoSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  badgeText: z.string(),
  primaryColor: zColor(),
  secondaryColor: zColor(),
  stats: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  ctaText: z.string(),
});

export type PromoVideoProps = z.infer<typeof promoVideoSchema>;

export const defaultPromoProps: PromoVideoProps = {
  title: 'Biến Đồ Họa Video Thành Lập Trình React',
  subtitle:
    'Tự động hóa hàng loạt video chất lượng cao thông qua dữ liệu API và hệ sinh thái TypeScript',
  badgeText: 'DECLARATIVE VIDEO ENGINE',
  primaryColor: '#6366F1',
  secondaryColor: '#EC4899',
  stats: [
    { label: 'Kiến trúc', value: 'React + TypeScript' },
    { label: 'Chuyển động', value: 'Spring & Interpolate' },
    { label: 'Tự động hóa', value: 'Data-Driven 100%' },
  ],
  ctaText: 'Sẵn sàng mở rộng cùng Remotion Studio & Cloud Render',
};

export const PromoVideo: React.FC<PromoVideoProps> = ({
  title,
  subtitle,
  badgeText,
  primaryColor,
  secondaryColor,
  stats,
  ctaText,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Chuyển động nền ánh sáng (ambient glow) theo frame
  const glowShiftX = interpolate(frame, [0, durationInFrames], [-120, 120]);
  const subtitleOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleY = interpolate(frame, [35, 55], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out mượt mà ở 15 frame cuối
  const masterOpacity = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#070B19',
        color: '#F8FAFC',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        opacity: masterOpacity,
      }}
    >
      {/* Layer 1: Lưới nền tĩnh từ thư mục public/ thông qua staticFile() */}
      <AbsoluteFill style={{ opacity: 0.55 }}>
        <Img
          src={staticFile('bg-grid.svg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {/* Layer 2: Quầng sáng Gradient động */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + glowShiftX * 0.08}% 32%, ${primaryColor}38 0%, ${secondaryColor}18 38%, transparent 72%)`,
        }}
      />

      {/* Sequence 1 (Frame 0 -> hết): Logo & Badge khởi động */}
      <Sequence from={0} durationInFrames={durationInFrames}>
        <AbsoluteFill
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 72,
          }}
        >
          <LogoAnimation
            size={112}
            accentColor={primaryColor}
            label={badgeText}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 2 (Frame 18 -> hết): Tiêu đề Kinetic Text & Phụ đề */}
      <Sequence from={18} durationInFrames={durationInFrames - 18}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 140px 0 140px',
          }}
        >
          <div
            style={{
              maxWidth: 1380,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              marginTop: -20,
            }}
          >
            <KineticText
              text={title}
              fontSize={72}
              color="#FFFFFF"
              accentColor={secondaryColor}
              staggerFrames={4}
            />
            <p
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 500,
                color: '#94A3B8',
                textAlign: 'center',
                maxWidth: 1050,
                lineHeight: 1.45,
                opacity: subtitleOpacity,
                transform: `translateY(${subtitleY}px)`,
              }}
            >
              {subtitle}
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 3 (Frame 50 -> hết): Thẻ thông số kỹ thuật (Stats Cards) */}
      <Sequence from={50} durationInFrames={durationInFrames - 50}>
        <AbsoluteFill
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 195,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 32,
              justifyContent: 'center',
              width: '100%',
              padding: '0 120px',
            }}
          >
            {stats.map((stat, idx) => {
              const cardSpring = spring({
                frame: frame - 50 - idx * 7,
                fps,
                config: { damping: 13, stiffness: 150 },
              });
              const translateY = interpolate(cardSpring, [0, 1], [50, 0]);

              return (
                <div
                  key={stat.label}
                  style={{
                    flex: 1,
                    maxWidth: 420,
                    background: 'rgba(15, 23, 42, 0.78)',
                    border: `1px solid ${primaryColor}55`,
                    borderRadius: 24,
                    padding: '24px 32px',
                    transform: `translateY(${translateY}px) scale(${cardSpring})`,
                    opacity: cardSpring,
                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 2,
                      color: '#94A3B8',
                    }}
                  >
                    {stat.label}
                  </span>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: '#F8FAFC',
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 4 (Frame 75 -> hết): Sóng âm AudioWaveform & CTA Footer */}
      <Sequence from={75} durationInFrames={durationInFrames - 75}>
        <AbsoluteFill
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 44,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <AudioWaveform
              barsCount={42}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              height={64}
            />
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#E2E8F0',
                letterSpacing: 1,
              }}
            >
              {ctaText}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

