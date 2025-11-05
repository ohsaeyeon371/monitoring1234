import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

// 페이지(제목만 있는 플레이스홀더)
const Monitoring = () => <h1>모니터링</h1>;
const Sensors    = () => <h1>센서정보</h1>;
const Analytics  = () => <h1>데이터분석</h1>;
const Zones      = () => <h1>센서관리</h1>;
const Settings   = () => <h1>설정</h1>;

export default function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "16px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/monitoring" replace />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/sensors"    element={<Sensors />} />
          <Route path="/analytics"  element={<Analytics />} />
          <Route path="/zones"      element={<Zones />} />
          <Route path="/settings"   element={<Settings />} />
          <Route path="*"           element={<Navigate to="/monitoring" replace />} />
        </Routes>
      </div>
    </div>
  );
}
