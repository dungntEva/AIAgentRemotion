# AI Agent Remotion — Declarative Data-Driven Video Engine

Dự án sản xuất video tự động hóa bằng **Remotion + React + TypeScript**, biến quy trình chỉnh sửa đồ họa truyền thống thành lập trình khai báo (declarative) và kết xuất hàng loạt từ dữ liệu API (`inputProps` + `delayRender`).

---

## Kiến trúc Thư mục (Giai đoạn 2)

```text
├── public/
│   ├── bg-grid.svg               # Lưới vector nền ánh xạ qua staticFile()
│   ├── logo.svg                  # Logo vector tĩnh
│   └── data/
│       ├── scenarios.json        # Dữ liệu kịch bản API mẫu (Finance, Sports, Birthday)
│       └── sample-props.json     # File inputProps mẫu dùng khi render CLI
├── src/
│   ├── Root.tsx                  # Đầu não đăng ký tất cả Compositions, FPS & độ phân giải
│   ├── index.ts                  # Entry point re-export Root
│   ├── components/
│   │   ├── AudioWaveform.tsx     # Sóng âm đồng bộ toán học theo từng frame
│   │   ├── KineticText.tsx       # Chữ động Kinetic Typography (spring + interpolate)
│   │   └── LogoAnimation.tsx     # Hoạt ảnh Logo vật lý (spring + halo ring)
│   └── compositions/
│       ├── PromoVideo.tsx        # Video ngang 16:9 (1920x1080 @ 30fps)
│       └── DynamicReel.tsx       # Video dọc 9:16 (1080x1920 @ 30fps) tích hợp delayRender
└── remotion.config.ts            # Cấu hình CLI & Entry Point
```

---

## Hướng dẫn Sử dụng Nhanh

### 1. Khởi chạy Remotion Studio (Preview thời gian thực)
```bash
npm run dev
```

### 2. Kiểm tra kiểu dữ liệu TypeScript
```bash
npm run typecheck
```

### 3. Render Video MP4 cục bộ (Giai đoạn 5)
Xuất bản dựng `PromoVideo` (1920x1080):
```bash
npx remotion render src/Root.tsx PromoVideo out/PromoVideo.mp4
```

Xuất bản dựng `DynamicReel` (1080x1920) sử dụng `delayRender()` nạp dữ liệu:
```bash
npx remotion render src/Root.tsx DynamicReel out/DynamicReel.mp4
```

Xuất video tùy biến hàng loạt thông qua `inputProps`:
```bash
npx remotion render src/Root.tsx PromoVideo out/PromoCustom.mp4 --props=./public/data/sample-props.json
```

