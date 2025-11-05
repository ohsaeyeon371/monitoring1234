import React, { useEffect, useMemo, useState } from "react";
import SensorCard from "../components/SensorCard.jsx";

/**
 * 모니터링 페이지 (인라인 스타일)
 * - 회색 배경 + 4열 그리드 + 중앙 경고 카드
 */
export default function MonitoringPage() {
  const [tiles, setTiles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // mock 데이터 (서버 연동 전까지 임시)
    setTiles([
      { id: 1, name: "라인1", temp: 25, hum: 58, alert: false },
      { id: 2, name: "라인2", temp: 22, hum: 65, alert: true },  // 경고 예시
      { id: 3, name: "창고A", temp: 24, hum: 55, alert: false },
      { id: 4, name: "창고B", temp: 23, hum: 49, alert: false },
      { id: 5, name: "포장실", temp: 26, hum: 60, alert: false },
      { id: 6, name: "출하대기", temp: 21, hum: 52, alert: false },
      { id: 7, name: "검수실", temp: 25, hum: 57, alert: false },
    ]);
  }, []);

  const hasAlert = useMemo(() => tiles.some((t) => t.alert), [tiles]);
  useEffect(() => setShowAlert(hasAlert), [hasAlert]);

  const onAddTile = () => alert("타일 추가 모달/폼은 추후 구현합니다.");

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        모니터링
      </h1>

      {/* Navbar 아래 회색 배경 영역 */}
      <div
        style={{
          position: "relative",
          background: "#e5e7eb",
          borderRadius: 8,
          padding: 40,
          minHeight: 420,
        }}
      >
        {/* 타일 그리드 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 160px)", // 4열
            gap: 48,
            justifyContent: "center",
          }}
        >
          {tiles.map((t) => (
            <SensorCard key={t.id} item={t} />
          ))}

          {/* + 버튼 타일 */}
          <button
            onClick={onAddTile}
            title="타일 추가"
            style={{
              width: 160,
              height: 144,
              borderRadius: 8,
              background: "#fff",
              border: "2px dashed #111",
              fontSize: 28,
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>

        {/* 중앙 경고 카드 (있을 때만 표시) */}
        {showAlert && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              border: "1px solid #d1d5db",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              borderRadius: 8,
              padding: "20px 24px",
              textAlign: "center",
              whiteSpace: "pre-line",
              zIndex: 10,
            }}
          >
            <div style={{ color: "#dc2626", fontWeight: 800 }}>
              {"무연 냉장\n고 임계설\n정값 초과"}
            </div>
            <button
              onClick={() => setShowAlert(false)}
              style={{
                marginTop: 8,
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
