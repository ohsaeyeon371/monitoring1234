// import React, { useEffect, useMemo, useState } from "react";

// /**
//  * 데이터분석 (반응형 + 컴팩트 버튼)
//  * - 좁은 화면에서 1열 스택, 컨트롤 간 여백 보장
//  * - 조회 버튼: width:auto 로 축소, 작은 패딩
//  * - 차트는 창폭에 따라 디시메이션 간격 조정
//  */
// export default function AnalyticsPage() {
//   const width = useWindowWidth();
//   const compact = width < 900;
//   const veryNarrow = width < 520;

//   // 필터 상태
//   const [zone, setZone] = useState("무연 냉장고");
//   const [device, setDevice] = useState("SHT31(#02)");
//   const [metric, setMetric] = useState("온도");
//   const [fromDate, setFromDate] = useState(dayOffset(-1));
//   const [toDate, setToDate] = useState(dayOffset(0));
//   const [fromTime, setFromTime] = useState("09:00");
//   const [toTime, setToTime] = useState("23:59");
//   const [stepMin, setStepMin] = useState(10);

//   const [series, setSeries] = useState([]);

//   useEffect(() => {
//     onQuery();
//     // eslint-disable-next-line
//   }, []);

//   function onQuery() {
//     const start = new Date(`${fromDate}T${fromTime}:00`);
//     const end = new Date(`${toDate}T${toTime}:59`);
//     const data = generateSeries(start, end, stepMin, metric);
//     setSeries(data);
//   }

//   // 차트 계산
//   const chart = useMemo(() => {
//     if (!series.length) return null;
//     const w = 1100, h = compact ? 320 : 360;
//     const m = { top: 24, right: 24, bottom: 44, left: 56 };
//     const innerW = w - m.left - m.right;
//     const innerH = h - m.top - m.bottom;

//     const xMin = +series[0].ts, xMax = +series[series.length - 1].ts;
//     const yMin0 = Math.min(...series.map((d) => d.v));
//     const yMax0 = Math.max(...series.map((d) => d.v));
//     const pad = (yMax0 - yMin0) * 0.15 || (metric === "온도" ? 2 : 5);
//     const yMin = Math.floor((yMin0 - pad) * 10) / 10;
//     const yMax = Math.ceil((yMax0 + pad) * 10) / 10;

//     const x = (t) => ((+t - xMin) / (xMax - xMin || 1)) * innerW;
//     const y = (v) => innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;

//     // 컨테이너 폭에 따른 최소 픽셀 간격
//     const renderW = Math.max(320, Math.min(1200, width - 64));
//     const minPxGap = clamp(Math.round((renderW / 1200) * 9), 6, 10);

//     const display = [];
//     let lastX = -Infinity;
//     for (const d of series) {
//       const xx = x(d.ts);
//       if (xx - lastX >= minPxGap) {
//         display.push(d);
//         lastX = xx;
//       }
//     }

//     const yTicks = niceTicks(yMin, yMax, 5);
//     const xTicks = timeTicks(new Date(xMin), new Date(xMax), compact ? 4 : 6);

//     return { w, h, m, innerW, innerH, x, y, yTicks, xTicks, display };
//   }, [series, metric, width, compact]);

//   // 스타일
//   const wrap = { maxWidth: 1200, margin: "0 auto", padding: compact ? 12 : 16 };

//   // 공통 입력 스타일
//   const select = fieldStyle(veryNarrow);
//   const input = fieldStyle(veryNarrow);

//   // ✅ 컨트롤 영역 레이아웃 (붙지 않게)
//   const controls = {
//     display: "grid",
//     gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
//     columnGap: 12,
//     rowGap: 12, // 세로 여백 충분히
//     alignItems: "center",
//     marginBottom: 10,
//   };

//   // 날짜/시간 페어
//   const pair = {
//     display: "grid",
//     gridTemplateColumns: compact ? "1fr" : "1fr 1fr",
//     gap: 8,
//   };

//   // ✅ 조회 버튼: 작게 + 자동폭
//   const btn = {
//     padding: veryNarrow ? "7px 12px" : "8px 14px",
//     borderRadius: 10,
//     border: "1px solid #111",
//     background: "#111",
//     color: "#fff",
//     cursor: "pointer",
//     width: "auto",              // <-- 자동폭
//     justifySelf: compact ? "start" : "end", // 작은 화면에선 왼쪽 정렬
//   };

//   const rangeText = `${fromDate} ${fromTime} ~ ${toDate} ${toTime} · 간격 ${stepMin}분`;

//   return (
//     <div style={{ padding: compact ? 8 : 16 }}>
//       <div style={wrap}>
//         <h1 style={{ fontSize: compact ? 18 : 20, fontWeight: 800, marginBottom: compact ? 8 : 10 }}>
//           데이터분석
//         </h1>

//         {/* 컨트롤: 1개의 grid에서 각 아이템을 독립 래퍼로 배치 */}
//         <div style={controls}>
//           <div><select value={zone} onChange={(e) => setZone(e.target.value)} style={select}>
//             {["무연 냉장고", "수입검사실", "SP9", "SP8"].map((z) => <option key={z} value={z}>{`위치 ${z}`}</option>)}
//           </select></div>

//           <div><select value={device} onChange={(e) => setDevice(e.target.value)} style={select}>
//             {["SHT31(#01)", "SHT31(#02)", "DHT22(#03)"].map((d) => <option key={d} value={d}>{`장비 ${d}`}</option>)}
//           </select></div>

//           <div><select value={metric} onChange={(e) => setMetric(e.target.value)} style={select}>
//             {["온도", "습도"].map((m) => <option key={m} value={m}>{`항목 ${m}`}</option>)}
//           </select></div>

//           <div><select value={stepMin} onChange={(e) => setStepMin(Number(e.target.value))} style={select}>
//             {[5, 10, 15, 30, 60].map((m) => <option key={m} value={m}>{`간격 ${m}분`}</option>)}
//           </select></div>

//           <div style={pair}>
//             <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={input} />
//             <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} style={input} />
//           </div>

//           <div style={pair}>
//             <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={input} />
//             <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} style={input} />
//           </div>

//           {/* 버튼을 그리드의 마지막 칸으로, 작은 화면에선 다음 줄로 자연스럽게 내려감 */}
//           <div><button onClick={onQuery} style={btn}>조회</button></div>
//         </div>

//         {/* 기간 요약 */}
//         <div
//           style={{
//             display: "inline-block",
//             fontSize: 13,
//             color: "#334155",
//             background: "#f1f5f9",
//             border: "1px solid #e2e8f0",
//             padding: veryNarrow ? "5px 8px" : "6px 10px",
//             borderRadius: 999,
//             marginBottom: compact ? 8 : 10,
//           }}
//         >
//           {rangeText}
//         </div>

//         {/* 차트 */}
//         <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 10 }}>
//           {chart && (
//             <svg viewBox={`0 0 ${chart.w} ${chart.h}`} style={{ width: "100%", height: chart.h }}>
//               <rect x="0" y="0" width={chart.w} height={chart.h} fill="white" rx="12" />

//               {/* Y 그리드/눈금 */}
//               {chart.yTicks.map((t, i) => {
//                 const yy = chart.m.top + chart.y(t);
//                 return (
//                   <g key={`y-${i}`}>
//                     <line x1={chart.m.left} y1={yy} x2={chart.w - chart.m.right} y2={yy} stroke="#eef2f7" />
//                     <text x={chart.m.left - 10} y={yy + 4} fontSize="12" fill="#475569" textAnchor="end">
//                       {t}{metric === "온도" ? "°C" : "%"}
//                     </text>
//                   </g>
//                 );
//               })}

//               {/* X 그리드/눈금 */}
//               {chart.xTicks.map((t, i) => {
//                 const xx = chart.m.left + chart.x(t);
//                 return (
//                   <g key={`x-${i}`}>
//                     <line x1={xx} y1={chart.m.top} x2={xx} y2={chart.h - chart.m.bottom} stroke="#eef2f7" />
//                     <text
//                       x={xx}
//                       y={chart.h - chart.m.bottom + (compact ? 20 : 24)}
//                       fontSize="12"
//                       fill="#475569"
//                       textAnchor="middle"
//                     >
//                       {fmtTime(t)}
//                     </text>
//                   </g>
//                 );
//               })}

//               {/* 데이터: 점선(—) 길이도 좁을수록 더 짧게 */}
//               {chart.display.map((d, i) => {
//                 const xx = chart.m.left + chart.x(d.ts);
//                 const yy = chart.m.top + chart.y(d.v);
//                 const half = compact ? 1.5 : 2;
//                 return <line key={i} x1={xx - half} y1={yy} x2={xx + half} y2={yy} stroke="#111" strokeWidth="2" />;
//               })}

//               {/* 축선 */}
//               <line x1={chart.m.left} y1={chart.h - chart.m.bottom} x2={chart.w - chart.m.right} y2={chart.h - chart.m.bottom} stroke="#cbd5e1" />
//               <line x1={chart.m.left} y1={chart.m.top} x2={chart.m.left} y2={chart.h - chart.m.bottom} stroke="#cbd5e1" />

//               {/* 제목 */}
//               <text x={chart.w / 2} y={chart.m.top - 6} textAnchor="middle" fontSize="12" fill="#64748b">
//                 {device} — {metric}
//               </text>
//             </svg>
//           )}
//           {!series.length && <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>조회 결과가 없습니다.</div>}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------- Hooks/Utils ---------------- */

// function useWindowWidth() {
//   const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
//   useEffect(() => {
//     const on = () => setW(window.innerWidth);
//     window.addEventListener("resize", on);
//     return () => window.removeEventListener("resize", on);
//   }, []);
//   return w;
// }

// function fieldStyle(veryNarrow) {
//   return {
//     width: "100%",
//     padding: veryNarrow ? "9px 10px" : "10px 12px",
//     borderRadius: 10,
//     border: "1px solid #d1d5db",
//     background: "#fff",
//     fontSize: 14,
//     boxSizing: "border-box",
//   };
// }

// function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
// function dayOffset(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }

// /** 의사 시계열 생성 */
// function generateSeries(start, end, stepMin, metric) {
//   const out = [];
//   const ms = stepMin * 60 * 1000;
//   const span = +end - +start;
//   if (span <= 0) return out;

//   const N = Math.floor(span / ms) + 1;
//   for (let i = 0; i < N; i++) {
//     const t = new Date(+start + i * ms);
//     const x = i / Math.max(1, N - 1);
//     const base =
//       metric === "온도"
//         ? 23.5 + 1.8 * Math.sin(2 * Math.PI * (x * 1.05))
//         : 52 + 10 * Math.sin(2 * Math.PI * (x * 0.9) + 0.5);
//     const noise = (metric === "온도" ? 0.25 : 1.5) * (Math.random() - 0.5);
//     out.push({ ts: t, v: +(base + noise).toFixed(2) });
//   }
//   return out;
// }

// /** y축 눈금 */
// function niceTicks(min, max, count = 5) {
//   const span = max - min;
//   const step = niceNum(span / Math.max(1, count - 1), true);
//   const niceMin = Math.floor(min / step) * step;
//   const niceMax = Math.ceil(max / step) * step;
//   const ticks = [];
//   for (let v = niceMin; v <= niceMax + 1e-9; v += step) ticks.push(Math.round(v * 10) / 10);
//   return ticks;
// }
// function niceNum(range, round) {
//   const exp = Math.floor(Math.log10(range));
//   const f = range / Math.pow(10, exp);
//   let nf;
//   if (round) {
//     if (f < 1.5) nf = 1;
//     else if (f < 3) nf = 2;
//     else if (f < 7) nf = 5;
//     else nf = 10;
//   } else {
//     if (f <= 1) nf = 1;
//     else if (f <= 2) nf = 2;
//     else if (f <= 5) nf = 5;
//     else nf = 10;
//   }
//   return nf * Math.pow(10, exp);
// }

// /** x축 시간 눈금 */
// function timeTicks(start, end, count = 6) {
//   const out = [];
//   const span = +end - +start;
//   if (span <= 0) return [start];
//   const step = Math.round(span / Math.max(1, count - 1));
//   for (let i = 0; i < count; i++) out.push(new Date(+start + i * step));
//   return out;
// }
// function fmtTime(d) {
//   const h = d.getHours().toString().padStart(2, "0");
//   const m = d.getMinutes().toString().padStart(2, "0");
//   return `${h}:${m}`;
// }


import React, { useEffect, useMemo, useState } from "react";

/**
 * SensorsPage (반응형 컨트롤 · 컴팩트 조회 버튼)
 * - 작은 화면: 컨트롤이 1~2열로 자동 줄바꿈, 각 입력박스는 pill 스타일
 * - 큰 화면: 가로 한 줄 배치
 * - 데이터는 목(JSON) 사용; 나중에 API로 교체 가능
 */
export default function SensorsPage() {
  const width = useWindowWidth();
  const compact = width < 900;         // 좁은 화면
  const veryNarrow = width < 560;      // 더 좁은 화면

  // --- 필터 상태 ---
  const [site, setSite] = useState("ALL");
  const [type, setType] = useState("ALL"); // 센서종류/상태 등
  const [fromDate, setFromDate] = useState(dayOffset(-1));
  const [toDate, setToDate] = useState(dayOffset(0));
  const [fromTime, setFromTime] = useState("09:00");
  const [toTime, setToTime] = useState("23:59");

  // --- 데이터 ---
  const [rows, setRows] = useState([]);

  useEffect(() => { onQuery(); }, []); // 최초 1회

  function onQuery() {
    // 여기서는 목 데이터 생성 (나중에 API 교체)
    const mock = makeMockRows();
    // 필터 예시
    const filtered = mock.filter(r =>
      (site === "ALL" || r.site === site) &&
      (type === "ALL" || r.kind === type)
    );
    setRows(filtered);
  }

  // --- 스타일 ---
  const wrap = { maxWidth: 1200, margin: "0 auto", padding: compact ? 12 : 16 };

  // 컨트롤 바: 캡처 느낌 (pill + 아이콘 공간)
  const controls = {
    display: "grid",
    gridTemplateColumns: compact
      ? "repeat(auto-fit, minmax(160px, 1fr))"
      : "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  };

  const pill = {
    width: "100%",
    padding: veryNarrow ? "10px 12px" : "12px 14px",
    borderRadius: 999,
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: 14,
    boxSizing: "border-box",
  };

  const timePill = { ...pill, minWidth: 140 };
  const datePill = { ...pill, minWidth: 160 };

  const queryBtn = {
    padding: veryNarrow ? "8px 14px" : "10px 18px",
    borderRadius: 999,
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    width: "auto",
    justifySelf: compact ? "start" : "end",
  };

  // --- 테이블 계산 / 가독성 ---
  const cols = useMemo(
    () => [
      { key: "name", label: "장치" },
      { key: "sensor", label: "센서코드" },
      { key: "site", label: "위치" },
      { key: "kind", label: "센서종류" },
      { key: "fail", label: "에러(%)" },
      { key: "uptime", label: "가동율(%)" },
      { key: "value", label: "실측값" },
      { key: "unit", label: "단위" },
    ],
    []
  );

  return (
    <div style={{ padding: compact ? 8 : 16 }}>
      <div style={wrap}>
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>센서정보</h1>

        {/* 컨트롤 바: 캡처처럼 둥근 박스 + 작은 조회 버튼 */}
        <div style={controls}>
          <select value={site} onChange={(e) => setSite(e.target.value)} style={pill}>
            {["ALL", "무연 냉장고", "수입검사실", "SP9", "SP8"].map((v) => (
              <option key={v} value={v}>{v === "ALL" ? "위치 ALL" : `위치 ${v}`}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)} style={pill}>
            {["ALL", "온도", "습도", "압력"].map((v) => (
              <option key={v} value={v}>{v === "ALL" ? "센서 ALL" : `센서 ${v}`}</option>
            ))}
          </select>

          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={datePill} />
          <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} style={timePill} />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={datePill} />
          <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} style={timePill} />

          <div>
            <button onClick={onQuery} style={queryBtn}>조회</button>
          </div>
        </div>

        {/* 표 카드 */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 10 }}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                minWidth: 760,
              }}
            >
              <thead>
                <tr>
                  {cols.map((c, i) => (
                    <th
                      key={c.key}
                      style={{
                        textAlign: "left",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#334155",
                        padding: "10px 12px",
                        borderBottom: "1px solid #e5e7eb",
                        position: "sticky",
                        top: 0,
                        background: "#fff",
                        zIndex: 1,
                      }}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {cols.map((c) => (
                      <td key={c.key} style={{ padding: "10px 12px", fontSize: 13 }}>
                        {r[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={cols.length} style={{ padding: 20, color: "#64748b", textAlign: "center" }}>
                      데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- utils ---------------- */
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w;
}

function dayOffset(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function makeMockRows() {
  // 간단한 목
  const base = [
    { name: "무연 냉장고", sensor: "SHT31-01", site: "무연 냉장고", kind: "온도", fail: "0.0%", uptime: "99.9%", value: "25.1", unit: "℃" },
    { name: "무연 냉장고", sensor: "SHT31-02", site: "무연 냉장고", kind: "습도", fail: "0.4%", uptime: "98.5%", value: "58.9", unit: "%" },
    { name: "수입검사실", sensor: "DHT22-03", site: "수입검사실", kind: "온도", fail: "1.1%", uptime: "96.7%", value: "24.2", unit: "℃" },
    { name: "SP9", sensor: "SHT31-13", site: "SP9", kind: "온도", fail: "0.0%", uptime: "100%", value: "23.7", unit: "℃" },
    { name: "SP8", sensor: "SHT31-19", site: "SP8", kind: "습도", fail: "0.2%", uptime: "99.2%", value: "61.0", unit: "%" },
  ];
  // 행 늘려보기
  const more = [];
  for (let i = 0; i < 20; i++) {
    more.push({
      name: "SP9",
      sensor: `SHT31-${20 + i}`,
      site: i % 2 ? "SP9" : "SP8",
      kind: i % 3 ? "온도" : "습도",
      fail: (Math.random() * 1.5).toFixed(1) + "%",
      uptime: (97 + Math.random() * 3).toFixed(1) + "%",
      value: (i % 3 ? (22 + Math.random() * 5).toFixed(1) : (50 + Math.random() * 15).toFixed(1)),
      unit: i % 3 ? "℃" : "%",
    });
  }
  return [...base, ...more];
}
