// // src/pages/AnalyticsPage.jsx
// import React, { useEffect, useState } from "react";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
// } from "recharts";

// /**
//  * 요구사항:
//  *  - 하드코딩 토큰을 Authorization 헤더에 실어서 MonitoringPage처럼 호출
//  *  - GET /api/v1/sensors 로 센서 목록 가져오기
//  *  - GET /api/v1/sensor-data?sensor_id=&from=&to=&bucket= 로 시계열 가져오기
//  *  - Recharts로 temp/hum 차트 표시
//  */

// const API_BASE = "http://localhost:3000";
// const DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29tcGFueV9pZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYyNzkwNDgwLCJleHAiOjE3NjI3OTIyODB9.zY-KGo7QrbX3mrhtYzgUowLO5yHSHPoMYALE54ZrqIs"; // ← 네 토큰을 여기에 그대로 넣어

// export default function AnalyticsPage() {
//   // 센서/선택
//   const [sensors, setSensors] = useState([]);
//   const [sensorId, setSensorId] = useState("");

//   // 폼 상태
//   const [metric, setMetric] = useState("temp"); // temp|hum|both
//   const [bucket, setBucket] = useState("10m");
//   const [fromDate, setFromDate] = useState(dateStr(0));       // 오늘
//   const [fromTime, setFromTime] = useState(timeMinusHours(24));// 지금-24h
//   const [toDate, setToDate] = useState(dateStr(0));           // 오늘
//   const [toTime, setToTime] = useState(nowHM());              // 지금

//   // 데이터/상태
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   // 공통 헤더(하드코딩 토큰)
//   const headers = {
//     "Content-Type": "application/json",
//     "Accept": "application/json",
//     "Authorization": `Bearer ${DEV_TOKEN}`,
//   };

//   // 센서 목록
//   async function fetchSensors() {
//     setErr("");
//     try {
//       const url = `${API_BASE}/api/v1/sensors?page=1&size=200&sort=created_at%20DESC`;
//       console.log("[GET] sensors:", url);
//       const res = await fetch(url, { method: "GET", headers });
//       if (!res.ok) {
//         const text = await res.text().catch(() => "");
//         throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text.slice(0,120)}`);
//       }
//       const json = await res.json();
//       console.log("[RESP sensors]", json);
//       if (!json?.is_sucsess) throw new Error(json?.message || "센서 목록 실패");

//       const list = Array.isArray(json.data) ? json.data : [];
//       setSensors(list);
//       if (!sensorId && list.length) setSensorId(String(list[0].id));
//     } catch (e) {
//       setErr(e.message || String(e));
//       setSensors([]);
//     }
//   }

//   // 시계열
//   async function fetchSeries() {
//     if (!sensorId) return;
//     setLoading(true);
//     setErr("");
//     try {
//       // 백엔드가 UTC를 기대하면 아래 두 줄을 toISOString()으로 바꿔봐
//       const from = `${fromDate}T${fromTime}:00`;
//       const to   = `${toDate}T${toTime}:00`;

//       const url = `${API_BASE}/api/v1/sensor-data?sensor_id=${encodeURIComponent(sensorId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&bucket=${encodeURIComponent(bucket)}`;
//       console.log("[GET] series:", url);

//       const res = await fetch(url, { method: "GET", headers });
//       if (!res.ok) {
//         const text = await res.text().catch(() => "");
//         throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text.slice(0,120)}`);
//       }
//       const json = await res.json();
//       console.log("[RESP series]", json);

//       if (!json?.is_sucsess) throw new Error(json?.message || "데이터 조회 실패");


//       // 1) 매핑 부분 교체

//       const data = (json.data || []).map((d) => {
//         const ts = d.ts ?? d.timestamp ?? d.time;
//         return {
//           label: safeTime(ts),
//           temp: toNum(d.temp ?? d.temperature ?? d.t),
//           hum:  toNum(d.hum  ?? d.humidity    ?? d.h),
//         };
//       });

//       setRows(data);
//     } catch (e) {
//       setErr(e.message || String(e));
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // 최초 로드: 센서
//   useEffect(() => { fetchSensors(); /* eslint-disable-line react-hooks/exhaustive-deps */ }, []);

//   return (
//     <div style={{ padding: 16 }}>
//       <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>데이터분석</h1>

//       {/* 컨트롤 바 */}
//       <div style={bar}>
//         <div style={row}>
//           <select value={sensorId} onChange={(e)=>setSensorId(e.target.value)} style={sel}>
//             {sensors.map(s => (
//               <option key={s.id} value={s.id}>
//                 {s.model ? `${s.model} (#${s.id})` : `센서 #${s.id}`}
//               </option>
//             ))}
//           </select>

//           <select value={metric} onChange={(e)=>setMetric(e.target.value)} style={sel}>
//             <option value="temp">항목 온도</option>
//             <option value="hum">항목 습도</option>
//             <option value="both">온도 + 습도</option>
//           </select>

//           <select value={bucket} onChange={(e)=>setBucket(e.target.value)} style={sel}>
//             <option value="5m">간격 5분</option>
//             <option value="10m">간격 10분</option>
//             <option value="30m">간격 30분</option>
//             <option value="1h">간격 1시간</option>
//           </select>
//         </div>

//         <div style={row}>
//           <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} style={inp}/>
//           <input type="time" value={fromTime} onChange={(e)=>setFromTime(e.target.value)} style={inp}/>
//           <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} style={inp}/>
//           <input type="time" value={toTime} onChange={(e)=>setToTime(e.target.value)} style={inp}/>
//           <button onClick={fetchSeries} disabled={loading || !sensorId} style={btnPrimary}>
//             {loading ? "조회중…" : "조회"}
//           </button>
//         </div>
//       </div>

//       {err && <div style={{ color: "#dc2626", marginTop: 8 }}>{err}</div>}

//       {/* 차트 */}
//       <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding: 12, marginTop: 12 }}>
//         <div style={{ color:"#475569", fontSize:14, marginBottom: 8 }}>
//           {labelRange(fromDate, fromTime, toDate, toTime)} · {bucket}
//         </div>
//         <div style={{ width: "100%", height: 420 }}>
//           <ResponsiveContainer>
//             <LineChart data={rows} margin={{ top: 12, right: 16, bottom: 12, left: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="label" minTickGap={20} />
//               <YAxis />
//               <Tooltip />
//               {(metric === "temp" || metric === "both") && (
//                 <Line type="monotone" dataKey="temp" dot={false} name="온도(°C)" />
//               )}
//               {(metric === "hum" || metric === "both") && (
//                 <Line type="monotone" dataKey="hum" dot={false} name="습도(%)" />
//               )}
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* 스타일 */
// const bar = { display: "grid", gridTemplateColumns: "1fr", gap: 8 };
// const row = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 };
// const sel = { height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" };
// const inp = { height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" };
// const btnPrimary = { padding: "8px 12px", borderRadius: 8, border: "1px solid #111827", background: "#111827", color: "#fff", cursor: "pointer" };

// /* 유틸 */
// function dateStr(deltaDays = 0) {
//   const d = new Date();
//   d.setDate(d.getDate() + deltaDays);
//   return d.toISOString().slice(0, 10);
// }
// function nowHM() {
//   const d = new Date();
//   const hh = String(d.getHours()).padStart(2, "0");
//   const mm = String(d.getMinutes()).padStart(2, "0");
//   return `${hh}:${mm}`;
// }
// function timeMinusHours(h=24) {
//   const d = new Date();
//   d.setHours(d.getHours() - h);
//   const hh = String(d.getHours()).padStart(2, "0");
//   const mm = String(d.getMinutes()).padStart(2, "0");
//   return `${hh}:${mm}`;
// }


// function safeTime(ts) {
//   try {
//     const d = new Date(ts);
//     const hh = String(d.getHours()).padStart(2, "0");
//     const mm = String(d.getMinutes()).padStart(2, "0");
//     return `${hh}:${mm}`;
//   } catch { return String(ts); }
// }
// function labelRange(fd, ft, td, tt) { return `${fd} ${ft} ~ ${td} ${tt}`; }
// function toNum(v){ const n = Number(v); return Number.isFinite(n) ? n : undefined; }




// src/pages/AnalyticsPage.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

/**
 * 백엔드 응답 형식
 * {
 *   is_sucsess: true,
 *   data: [{ sensor_id, upload_at, data_no, data_value, data_sum, data_num }, ...]
 * }
 *
 * 이 페이지는:
 *  - /api/v1/sensors 로 센서 목록을 가져와 선택 드롭다운 구성
 *  - /api/v1/sensor-data?sensor_id=&from=&to=&bucket= 로 시계열 가져와
 *    upload_at(UTC) → 시간축, data_value → Y값 으로 그립니다.
 */

const API_BASE = "http://localhost:3000";
// ↓ 개발 토큰을 여기 넣으세요 (또는 .env에서 읽어 써도 됩니다)
const DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29tcGFueV9pZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYyNzkxOTQwLCJleHAiOjE3NjI3OTM3NDB9.uZU3OL6_NB_2QMwgi-DnPlVyBhzy2A6D4_leyXmB9hY";

export default function AnalyticsPage() {
  const [sensors, setSensors] = useState([]);
  const [sensorId, setSensorId] = useState("");

  // 조회 조건 (최근 24시간)
  const [bucket, setBucket] = useState("10m");
  const [fromDate, setFromDate] = useState(dateStr(0));
  const [fromTime, setFromTime] = useState(timeMinusHours(24));
  const [toDate, setToDate] = useState(dateStr(0));
  const [toTime, setToTime] = useState(nowHM());

  const [rows, setRows] = useState([]);     // [{ tsMs, value }]
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    ...(DEV_TOKEN ? { "Authorization": `Bearer ${DEV_TOKEN}` } : {}),
  };

  // 1) 센서 목록
  async function fetchSensors() {
    setErr("");
    try {
      const url = `${API_BASE}/api/v1/sensors?page=1&size=200&sort=created_at%20DESC`;
      const res = await fetch(url, { method: "GET", headers });
      if (!res.ok) throw await httpErr(res);

      const json = await res.json();
      if (!json?.is_sucsess) throw new Error(json?.message || "센서 목록 실패");

      const list = Array.isArray(json.data) ? json.data : [];
      setSensors(list);
      if (!sensorId && list.length) setSensorId(String(list[0].id));
    } catch (e) {
      setErr(e.message || String(e));
      setSensors([]);
    }
  }

  // 2) 시계열 (upload_at → X, data_value → Y)
  async function fetchSeries() {
    if (!sensorId) return;
    setLoading(true);
    setErr("");
    try {
      // 백엔드가 UTC를 기대하면 .toISOString() 사용 권장
      const from = new Date(`${fromDate}T${fromTime}:00`);
      const to   = new Date(`${toDate}T${toTime}:00`);

      const url = `${API_BASE}/api/v1/sensor-data` +
        `?sensor_id=${encodeURIComponent(sensorId)}` +
        `&from=${encodeURIComponent(from.toISOString())}` +
        `&to=${encodeURIComponent(to.toISOString())}` +
        `&bucket=${encodeURIComponent(bucket)}`;

      const res = await fetch(url, { method: "GET", headers });
      if (!res.ok) throw await httpErr(res);

      const json = await res.json();
      if (!json?.is_sucsess) throw new Error(json?.message || "데이터 조회 실패");

      const data = (json.data || []).map((d, i) => {
        const dt = new Date(d.upload_at); // "2025-11-05T15:10:02.000Z"
        const val = toNumber(d.data_value);
        return {
          tsMs: Number.isFinite(dt.getTime()) ? dt.getTime() : i, // 시간축용 숫자(ms)
          value: val,                                            // Y값
        };
      });

      setRows(data);
    } catch (e) {
      setErr(e.message || String(e));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSensors(); /* eslint-disable-line */ }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>데이터분석</h1>

      {/* 컨트롤 바 */}
      <div style={bar}>
        <div style={row}>
          <select value={sensorId} onChange={(e)=>setSensorId(e.target.value)} style={sel}>
            {sensors.map(s => (
              <option key={s.id} value={s.id}>
                {s.model ? `${s.model} (#${s.id})` : `센서 #${s.id}`}
              </option>
            ))}
          </select>

          <select value={bucket} onChange={(e)=>setBucket(e.target.value)} style={sel}>
            <option value="5m">간격 5분</option>
            <option value="10m">간격 10분</option>
            <option value="30m">간격 30분</option>
            <option value="1h">간격 1시간</option>
          </select>
        </div>

        <div style={row}>
          <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} style={inp}/>
          <input type="time" value={fromTime} onChange={(e)=>setFromTime(e.target.value)} style={inp}/>
          <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} style={inp}/>
          <input type="time" value={toTime} onChange={(e)=>setToTime(e.target.value)} style={inp}/>
          <button onClick={fetchSeries} disabled={loading || !sensorId} style={btnPrimary}>
            {loading ? "조회중…" : "조회"}
          </button>
        </div>
      </div>

      {err && <div style={{ color: "#dc2626", marginTop: 8 }}>{err}</div>}

      {/* 차트 */}
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding: 12, marginTop: 12 }}>
        <div style={{ color:"#475569", fontSize:14, marginBottom: 8 }}>
          {labelRange(fromDate, fromTime, toDate, toTime)} · {bucket}
        </div>
        <div style={{ width: "100%", height: 420 }}>
          <ResponsiveContainer>
            <LineChart data={rows} margin={{ top: 12, right: 16, bottom: 12, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              {/* 숫자형 시간축 */}
              <XAxis
                dataKey="tsMs"
                type="number"
                scale="time"
                domain={["auto", "auto"]}
                tickFormatter={(v) => formatLabel(new Date(v))}
                minTickGap={20}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(v) => formatLabel(new Date(v))}
                formatter={(v) => [v, "값"]}
              />
              <Line type="monotone" dataKey="value" dot={false} name="데이터 값" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ----- 스타일 ----- */
const bar = { display: "grid", gridTemplateColumns: "1fr", gap: 8 };
const row = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 };
const sel = { height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" };
const inp = { height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" };
const btnPrimary = { padding: "8px 12px", borderRadius: 8, border: "1px solid #111827", background: "#111827", color: "#fff", cursor: "pointer" };

/* ----- 유틸 ----- */
function httpErr(res) {
  return res.text().then(t => new Error(`HTTP ${res.status} ${res.statusText} :: ${t.slice(0,200)}`));
}
function dateStr(deltaDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}
function nowHM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
function timeMinusHours(h=24) {
  const d = new Date();
  d.setHours(d.getHours() - h);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined; // NaN 방지
}
function formatLabel(d) {
  if (!(d instanceof Date) || isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  const hh = String(d.getHours()).padStart(2,"0");
  const mi = String(d.getMinutes()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}
function labelRange(fd, ft, td, tt) {
  return `${fd} ${ft} ~ ${td} ${tt}`;
}
