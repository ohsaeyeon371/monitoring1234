import React from "react";

/**
 * 센서 타일 카드 (가시성 보장)
 * - 진한 배경 + 흰 텍스트
 * - 부모 크기 없어도 보이도록 기본 크기 포함
 */
export default function SensorCard({ item, width = 160, height = 144 }) {
  const t = item ?? {};
  const isAlert = !!t.alert;

  return (
    <div
      style={{
        width,
        height,
        boxSizing: "border-box",
        borderRadius: 8,
        background: "#111",
        border: "1px solid #444",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", lineHeight: 1.6, color: "#fff" }}>
        <div style={{ fontSize: 20, fontWeight: isAlert ? 800 : 600 }}>
          {t.temp}°C
        </div>
        <div style={{ fontSize: 20, fontWeight: isAlert ? 800 : 600 }}>
          {t.hum}%
        </div>
      </div>
    </div>
  );
}
