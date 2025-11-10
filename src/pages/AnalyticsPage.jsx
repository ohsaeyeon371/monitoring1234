import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

/**
 * AnalyticsPage
 * - 센서 목록: GET /api/v1/sensors?page=1&size=200 (모니터링과 동일 패턴)
 * - 시계열:    GET /api/v1/sensor-data?sensor_id=&from=&to=&bucket=
 *   응답 가정: { is_sucsess: true, data: [{ ts, temp, hum }, ...] }
 * - Recharts로 라인 차트 렌더
 */

const DATA_PATH = "/api/v1/sensor-data"; // ← 필요 시 실제 경로로 교체

export default function AnalyticsPage() {
  // 센서 옵션
  const [sensors, setSensors] = useState([]);
  const [sensorId, setSensorId] = useState(""); // 선택된 센서

  // 폼 상태
  const [metric, setMetric] = useState("temp"); // temp | hum | both
  const [bucket, setBucket] = useState("10m");  // 5m / 10m / 30m / 1h 등
  const [fromDate, setFromDate] = useState(dateStr(-1));   // 어제
  const [fromTime, setFromTime] = useState("09:00");
  const [toDate, setToDate] = useState(dateStr(0));        // 오늘
  const [toTime, setToTime] = useState("23:59");

  // 데이터
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const baseHost = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";
  const DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29tcGFueV9pZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYyNzg2NTUwLCJleHAiOjE3NjI3ODc0NTB9.XnTncz6OevEWn5z_hSg6C3td4tqeUcM_K5pTbeWxih4"
  // 센서 목록 URL
  const sensorsUrl = useMemo(() => {
    const qs = new URLSearchParams({ page: "1", size: "200", sort: "created_at DESC" });
    return `${baseHost}/api/v1/sensors?${qs.toString()}`;
  }, [baseHost]);

  // 시계열 URL
  const seriesUrl = useMemo(() => {
    const from = toISO(fromDate, fromTime);
    const to = toISO(toDate, toTime);
    const qs = new URLSearchParams({
      sensor_id: String(sensorId || ""),
      from, to, bucket,
    });
    return `${baseHost}${DATA_PATH}?${qs.toString()}`;
  }, [baseHost, sensorId, fromDate, fromTime, toDate, toTime, bucket]);

  // 공통 헤더
  const headers = useMemo(() => {
    const h = { Accept: "application/json" };
    if (DEV_TOKEN) h["Authorization"] = `Bearer ${DEV_TOKEN}`;
    return h;
  }, [DEV_TOKEN]);

  // 센서 목록 로드
  async function loadSensors() {
    try {
      const res = await fetch(sensorsUrl, { headers, credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) throw new Error(`Non-JSON response: ${ct}`);
      const json = await res.json();
      if (!json?.is_sucsess) throw new Error(json?.message || "센서 목록 실패");
      const list = Array.isArray(json.data) ? json.data : [];
      setSensors(list);
      // 기본 선택: 첫 번째
      if (!sensorId && list.length) setSensorId(String(list[0].id));
    } catch (e) {
      setErr(e.message || String(e));
    }
  }

  // 시계열 로드
  async function loadSeries() {
    if (!sensorId) return;
    setLoading(true); setErr("");
    try {
      const res = await fetch(seriesUrl, { headers, credentials: "include" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text.slice(0, 120)}`);
      }
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text().catch(() => "");
        throw new Error(`Non-JSON response: ${ct} :: ${text.slice(0, 120)}`);
      }
      const json = await res.json(); // { is_sucsess, data: [{ ts, temp, hum }] }
      if (!json?.is_sucsess) throw new Error(json?.message || "데이터 조회 실패");

      // ts를 사람이 읽을 수 있는 라벨로 가공
      const data = (json.data || []).map(d => ({
        ...d,
        label: safeTime(d.ts),
      }));
      setRows(data);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // 최초 센서 목록
  useEffect(() => { loadSensors(); /* eslint-disable-next-line */ }, [sensorsUrl]);

  return (
    <div style={{ padding: 16 }}>
      {/* 헤더 */}
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>데이터분석</h1>

      {/* 컨트롤 바: 작은 화면에서 줄바꿈 */}
      <div style={bar}>
        <div style={row}>
          <select value={sensorId} onChange={(e)=>setSensorId(e.target.value)} style={sel}>
            {sensors.map(s => (
              <option key={s.id} value={s.id}>
                {s.model ? `${s.model} (#${s.id})` : `센서 #${s.id}`}
              </option>
            ))}
          </select>

          <select value={metric} onChange={(e)=>setMetric(e.target.value)} style={sel}>
            <option value="temp">항목 온도</option>
            <option value="hum">항목 습도</option>
            <option value="both">온도 + 습도</option>
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
          <button onClick={loadSeries} disabled={loading || !sensorId} style={btnPrimary}>
            {loading ? "조회중…" : "조회"}
          </button>
        </div>
      </div>

      {err && <div style={{ color: "#dc2626", marginTop: 8 }}>{err}</div>}

      {/* 차트 카드 */}
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding: 12, marginTop: 12 }}>
        <div style={{ color:"#475569", fontSize:14, marginBottom: 8 }}>
          {labelRange(fromDate, fromTime, toDate, toTime)} · {bucket}
        </div>

        <div style={{ width: "100%", height: 420 }}>
          <ResponsiveContainer>
            <LineChart data={rows} margin={{ top: 12, right: 16, bottom: 12, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" minTickGap={20} />
              <YAxis />
              <Tooltip />
              {(metric === "temp" || metric === "both") && (
                <Line type="monotone" dataKey="temp" dot={false} name="온도(°C)" />
              )}
              {(metric === "hum" || metric === "both") && (
                <Line type="monotone" dataKey="hum" dot={false} name="습도(%)" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ---- 스타일 / 유틸 ---- */
const bar = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 8,
};
const row = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 8,
};
const sel = { height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" };
const inp = { height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" };
const btnPrimary = { padding: "8px 12px", borderRadius: 8, border: "1px solid #111827", background: "#111827", color: "#fff", cursor: "pointer" };

function dateStr(deltaDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}
function toISO(d, t) {
  // 'YYYY-MM-DD' + 'HH:mm' → ISO 문자열
  return new Date(`${d}T${t}:00`).toISOString();
}
function safeTime(ts) {
  try {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  } catch {
    return String(ts);
  }
}
function labelRange(fd, ft, td, tt) {
  return `${fd} ${ft} ~ ${td} ${tt}`;
}
