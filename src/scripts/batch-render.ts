/**
 * Giai đoạn 4 & 5: Kịch bản Tự động hóa Render Hàng loạt (Batch Automation)
 * Chạy lệnh: npx tsx src/scripts/batch-render.ts (hoặc dùng CLI trực tiếp)
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

interface ScenarioItem {
  id: string;
  headline: string;
  metricValue: string;
}

const scenariosPath = path.resolve(process.cwd(), 'public/data/scenarios.json');
const rawData = fs.readFileSync(scenariosPath, 'utf-8');
const { scenarios } = JSON.parse(rawData) as { scenarios: ScenarioItem[] };

console.log(`Bắt đầu tự động hóa render ${scenarios.length} kịch bản video...`);

for (const item of scenarios) {
  const outputPath = `out/DynamicReel-${item.id}.mp4`;
  const propsJson = JSON.stringify({
    scenarioId: item.id,
    customHeadline: item.headline,
    customMetricValue: item.metricValue,
  });

  console.log(`\n-> Đang xuất video [${item.id}] ra file: ${outputPath}`);
  execSync(
    `npx remotion render src/Root.tsx DynamicReel ${outputPath} --props='${propsJson}'`,
    { stdio: 'inherit' }
  );
}

console.log('\nHoàn tất xuất toàn bộ video tự động!');

