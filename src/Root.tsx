import React from 'react';
import { Composition, Folder, registerRoot } from 'remotion';
import {
  PromoVideo,
  defaultPromoProps,
  promoVideoSchema,
} from './compositions/PromoVideo';
import {
  DynamicReel,
  defaultDynamicReelProps,
  dynamicReelSchema,
} from './compositions/DynamicReel';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1. Landscape Promo Video (16:9 - 1920x1080 @ 30fps, 5 giây = 150 frames) */}
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={promoVideoSchema}
        defaultProps={defaultPromoProps}
      />

      {/* 2. Vertical Dynamic Reel (9:16 - 1080x1920 @ 30fps, 5 giây = 150 frames) */}
      <Composition
        id="DynamicReel"
        component={DynamicReel}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        schema={dynamicReelSchema}
        defaultProps={defaultDynamicReelProps}
      />

      {/* Thư mục kịch bản Data-Driven sẵn sàng chạy hàng loạt bằng inputProps */}
      <Folder name="DataDrivenScenarios">
        <Composition
          id="DynamicReel-Sports"
          component={DynamicReel}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          schema={dynamicReelSchema}
          defaultProps={{
            scenarioId: 'sports-match',
            customHeadline: '',
            customMetricValue: '',
            apiEndpoint: '',
          }}
        />
        <Composition
          id="DynamicReel-Birthday"
          component={DynamicReel}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          schema={dynamicReelSchema}
          defaultProps={{
            scenarioId: 'birthday-greeting',
            customHeadline: '',
            customMetricValue: '',
            apiEndpoint: '',
          }}
        />
      </Folder>
    </>
  );
};

registerRoot(RemotionRoot);

