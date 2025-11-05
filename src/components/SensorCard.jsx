import React from "react";

export default function SensorCard({ item }) {
  const isAlert = item.alert;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 8,
        background: "#fff",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", lineHeight: 1.6 }}>
        <div style={{ fontSize: 18, fontWeight: isAlert ? 800 : 500 }}>
          {item.temp}°C
        </div>
        <div style={{ fontSize: 18, fontWeight: isAlert ? 800 : 500 }}>
          {item.hum}%
        </div>
      </div>
    </div>
  );
}
