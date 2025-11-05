import React from "react";

export default function SensorCard({ item, width = 160, height = 144 }) {
  const isAlert = item?.alert;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 8,
        background: "#fff",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", lineHeight: 1.6 }}>
        <div style={{ fontSize: 18, fontWeight: isAlert ? 800 : 500 }}>
          {item?.temp}°C
        </div>
        <div style={{ fontSize: 18, fontWeight: isAlert ? 800 : 500 }}>
          {item?.hum}%
        </div>
      </div>
    </div>
  );
}
