// import React from "react";

// /**
//  * 센서 타일 카드 (가시성 보장)
//  * - 진한 배경 + 흰 텍스트
//  * - 부모 크기 없어도 보이도록 기본 크기 포함
//  */
// export default function SensorCard({ item, width = 160, height = 144 }) {
//   const t = item ?? {};
//   const isAlert = !!t.alert;

//   return (
//     <div
//       style={{
//         width,
//         height,
//         boxSizing: "border-box",
//         borderRadius: 8,
//         background: "#111",
//         border: "1px solid #444",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <div style={{ textAlign: "center", lineHeight: 1.6, color: "#fff" }}>
//         <div style={{ fontSize: 20, fontWeight: isAlert ? 800 : 600 }}>
//           {t.temp}°C
//         </div>
//         <div style={{ fontSize: 20, fontWeight: isAlert ? 800 : 600 }}>
//           {t.hum}%
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";

export default function SensorCard({ item, onClick, onDelete, editMode = false }) {
  const isAlert = !!item.alert;

  return (
    <div
      onClick={onClick}
      style={{
        width: 160,
        height: 144,
        borderRadius: 8,
        background: "#fff",
        border: isAlert ? "2px solid #ef4444" : "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        cursor: "pointer",
        boxShadow: isAlert ? "0 0 0 3px rgba(239,68,68,0.15)" : "none",
      }}
      title={`${item.name} — ${item.temp}℃ / ${item.hum}%`}
    >
      {/* 삭제 버튼 (편집모드일 때만 노출) */}
      {editMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          title="타일 삭제"
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            width: 26,
            height: 26,
            borderRadius: 999,
            border: "1px solid #e5e7eb",
            background: "#fff",
            fontSize: 16,
            lineHeight: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      )}

      <div style={{ textAlign: "center", lineHeight: 1.6 }}>
        <div style={{ fontSize: 18, fontWeight: isAlert ? 800 : 600 }}>{item.temp}°C</div>
        <div style={{ fontSize: 18, fontWeight: isAlert ? 800 : 600 }}>{item.hum}%</div>
      </div>
    </div>
  );
}
