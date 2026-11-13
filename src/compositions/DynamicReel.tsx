import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { z } from 'zod';
import { LogoAnimation } from '../components/LogoAnimation';
import { KineticText } from '../components/KineticText';
import { AudioWaveform } from '../components/AudioWaveform';

export interface ScenarioData {
  id: string;
  category: string;
  headline: string;
  subheadline: string;
  metricLabel: string;
  metricValue: string;
  accentColor: string;
  secondaryColor: string;
  highlights: string[];
}

export const dynamicReelSchema = z.object({
  scenarioId: z.enum(['finance-report', 'sports-match', 'birthday-greeting']),
  customHeadline: z.string().optional(),
  customMetricValue: z.string().optional(),
  apiEndpoint: z.string().optional(),
});

export type DynamicReelProps = z.infer<typeof dynamicReelSchema>;

export const defaultDynamicReelProps: DynamicReelProps = {
  scenarioId: 'finance-report',
  customHeadline: '',
  customMetricValue: '',
  apiEndpoint: '',
};

const FALLBACK_SCENARIO: ScenarioData = {
  id: 'finance-report',
  category: 'FINANCE REPORT',
  headline: 'Báo Cáo Tài Chính Q4',
  subheadline: 'Doanh thu tăng trưởng vượt bậc nhờ tự động hóa AI Video',
  metricLabel: 'Tăng trưởng ARR',
  metricValue: '+184%',
  accentColor: '#10B981',
  secondaryColor: '#0EA5E9',
  highlights: [
    '12,500+ Video tự động xuất bản',
    'Tiết kiệm 92% thời gian dựng hậu kỳ',
    'Đồng bộ 60 FPS chuẩn xác từng frame',
  ],
};

export const DynamicReel: React.FC<DynamicReelProps> = ({
  scenarioId,
  customHeadline,
  customMetricValue,
  apiEndpoint,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Giai đoạn 4: Sử dụng delayRender() để khóa tiến trình chụp frame cho tới khi fetch xong dữ liệu
  const [handle] = useState(() =>
    delayRender(`Fetching scenario data for ${scenarioId}`)
  );
  const [scenario, setScenario] = useState<ScenarioData | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const url =
          apiEndpoint && apiEndpoint.trim().length > 0
            ? apiEndpoint
            : staticFile('data/scenarios.json');

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = (await response.json()) as { scenarios: ScenarioData[] };
        const matched =
          json.scenarios.find((item) => item.id === scenarioId) ??
          json.scenarios[0] ??
          FALLBACK_SCENARIO;

        if (isMounted) {
          setScenario({
            ...matched,
            headline:
              customHeadline && customHeadline.trim().length > 0
                ? customHeadline
                : matched.headline,
            metricValue:
              customMetricValue && customMetricValue.trim().length > 0
                ? customMetricValue
                : matched.metricValue,
          });
          continueRender(handle);
        }
      } catch (err) {
        // Nếu môi trường mạng bị giới hạn, sử dụng fallback an toàn và mở khóa render
        console.warn('Using fallback scenario data:', err);
        if (isMounted) {
          setScenario(FALLBACK_SCENARIO);
          continueRender(handle);
        } else {
          cancelRender(err);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiEndpoint, customHeadline, customMetricValue, handle, scenarioId]);

  if (!scenario) {
    return null;
  }

  // Tính toán hiệu ứng spring cho thẻ KPI chính
  const metricSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 11, stiffness: 140 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#050814',
        color: '#FFFFFF',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Nền lưới tĩnh + Gradient theo màu chủ đạo của dữ liệu */}
      <AbsoluteFill style={{ opacity: 0.5 }}>
        <Img
          src={staticFile('bg-grid.svg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 22%, ${scenario.accentColor}44 0%, ${scenario.secondaryColor}22 45%, transparent 78%)`,
        }}
      />

      {/* Sequence 1: Header & Logo */}
      <Sequence from={0} durationInFrames={durationInFrames}>
        <AbsoluteFill
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 110,
          }}
        >
          <LogoAnimation
            size={120}
            accentColor={scenario.accentColor}
            label={scenario.category}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 2: Tiêu đề động từ API */}
      <Sequence from={15} durationInFrames={durationInFrames - 15}>
        <AbsoluteFill
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '380px 72px 0 72px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <KineticText
              text={scenario.headline}
              fontSize={76}
              color="#FFFFFF"
              accentColor={scenario.accentColor}
              staggerFrames={4}
            />
            <p
              style={{
                margin: 0,
                fontSize: 32,
                color: '#CBD5E1',
                textAlign: 'center',
                lineHeight: 1.4,
                opacity: interpolate(frame, [28, 45], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              {scenario.subheadline}
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 3: Khối Metric nổi bật */}
      <Sequence from={35} durationInFrames={durationInFrames - 35}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 140,
          }}
        >
          <div
            style={{
              transform: `scale(${metricSpring})`,
              opacity: metricSpring,
              background: 'rgba(15, 23, 42, 0.85)',
              border: `2px solid ${scenario.accentColor}`,
              borderRadius: 36,
              padding: '36px 64px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              boxShadow: `0 24px 60px ${scenario.accentColor}33`,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#94A3B8',
              }}
            >
              {scenario.metricLabel}
            </span>
            <span
              style={{
                fontSize: 96,
                fontWeight: 900,
                color: scenario.accentColor,
                lineHeight: 1.05,
              }}
            >
              {scenario.metricValue}
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 4: Danh sách Highlights trượt tuần tự */}
      <Sequence from={65} durationInFrames={durationInFrames - 65}>
        <AbsoluteFill
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 76px 260px 76px',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {scenario.highlights.map((item, idx) => {
              const itemProgress = spring({
                frame: frame - 65 - idx * 8,
                fps,
                config: { damping: 14, stiffness: 150 },
              });
              const translateX = interpolate(itemProgress, [0, 1], [-60, 0]);

              return (
                <div
                  key={item}
                  style={{
                    opacity: itemProgress,
                    transform: `translateX(${translateX}px)`,
                    background: 'rgba(30, 41, 59, 0.72)',
                    borderLeft: `6px solid ${scenario.accentColor}`,
                    borderRadius: 18,
                    padding: '22px 28px',
                    fontSize: 28,
                    fontWeight: 600,
                    color: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 999,
                      backgroundColor: scenario.accentColor,
                      display: 'inline-block',
                    }}
                  />
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence 5: Sóng âm chân trang */}
      <Sequence from={80} durationInFrames={durationInFrames - 80}>
        <AbsoluteFill
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 90,
          }}
        >
          <AudioWaveform
            barsCount={32}
            primaryColor={scenario.accentColor}
            secondaryColor={scenario.secondaryColor}
            height={88}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

