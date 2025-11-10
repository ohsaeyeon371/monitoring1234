import React, { useEffect, useMemo, useState } from "react";
import SensorCard from "../components/SensorCard.jsx";
import Modal from "../components/Modal.jsx";

/**
 * 모니터링 페이지 (인라인 스타일)
 * - 회색 배경 + 4열 그리드 + 중앙 경고 카드
 * - + 버튼 → 타일 추가 모달
 */
export default function MonitoringPage() {
  const [tiles, setTiles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // 모달 상태 & 폼 상태
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    temp: "",
    hum: "",
    alert: false,
  });
  const resetForm = () =>
    setForm({ name: "", temp: "", hum: "", alert: false });

  useEffect(() => {
    // mock 데이터
    setTiles([
      { id: 1, name: "라인1", temp: 25, hum: 58, alert: false },
      { id: 2, name: "라인2", temp: 22, hum: 65, alert: true }, // 경고 예시
      { id: 3, name: "창고A", temp: 24, hum: 55, alert: false },
      { id: 4, name: "창고B", temp: 23, hum: 49, alert: false },
      { id: 5, name: "포장실", temp: 26, hum: 60, alert: false },
      { id: 6, name: "출하대기", temp: 21, hum: 52, alert: false },
      { id: 7, name: "검수실", temp: 25, hum: 57, alert: false },
    ]);
  }, []);

  const hasAlert = useMemo(() => tiles.some((t) => t.alert), [tiles]);
  useEffect(() => setShowAlert(hasAlert), [hasAlert]);

  const openAddModal = () => {
    resetForm();
    setOpenAdd(true);
  };

  const onAddSubmit = (e) => {
    e.preventDefault();
    // 간단 유효성 검사
    if (!form.name.trim()) {
      alert("이름을 입력하세요.");
      return;
    }
    const temp = Number(form.temp);
    const hum = Number(form.hum);
    if (Number.isNaN(temp) || Number.isNaN(hum)) {
      alert("온도/습도는 숫자로 입력하세요.");
      return;
    }

    const newTile = {
      id: Date.now(), // 간단한 고유값
      name: form.name.trim(),
      temp,
      hum,
      alert: !!form.alert,
    };
    setTiles((prev) => [...prev, newTile]);
    setOpenAdd(false);
    // 중앙 경고는 useEffect에서 자동 반영됨
  };

  const onAddTile = () => openAddModal();

  // 입력 공용 스타일
  const input = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    boxSizing: "border-box",
  };
  const label = { fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" };
  const row = { marginBottom: 12 };

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

      {/* ===== 타일 추가 모달 ===== */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)} title="타일 추가">
        <form onSubmit={onAddSubmit}>
          <div style={row}>
            <label style={label}>이름</label>
            <input
              type="text"
              placeholder="예) 라인3"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              style={input}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={row}>
              <label style={label}>온도(°C)</label>
              <input
                type="number"
                step="0.1"
                placeholder="예) 24.5"
                value={form.temp}
                onChange={(e) => setForm((s) => ({ ...s, temp: e.target.value }))}
                style={input}
                required
              />
            </div>
            <div style={row}>
              <label style={label}>습도(%)</label>
              <input
                type="number"
                step="1"
                placeholder="예) 55"
                value={form.hum}
                onChange={(e) => setForm((s) => ({ ...s, hum: e.target.value }))}
                style={input}
                required
              />
            </div>
          </div>

          <div style={{ ...row, display: "flex", alignItems: "center", gap: 8 }}>
            <input
              id="alert"
              type="checkbox"
              checked={form.alert}
              onChange={(e) => setForm((s) => ({ ...s, alert: e.target.checked }))}
            />
            <label htmlFor="alert" style={{ fontSize: 13 }}>
              경고 상태로 추가
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => setOpenAdd(false)}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              취소
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              추가
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
