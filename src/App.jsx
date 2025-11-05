// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar.jsx";

// // 페이지(제목만 있는 플레이스홀더)
// const Monitoring = () => <h1>모니터링</h1>;
// const Sensors    = () => <h1>센서정보</h1>;
// const Analytics  = () => <h1>데이터분석</h1>;
// const Zones      = () => <h1>센서관리</h1>;
// const Settings   = () => <h1>설정</h1>;

// export default function App() {
//   return (
//     <div>
//       <Navbar />
//       <div style={{ padding: "16px" }}>
//         <Routes>
//           <Route path="/" element={<Navigate to="/monitoring" replace />} />
//           <Route path="/monitoring" element={<Monitoring />} />
//           <Route path="/sensors"    element={<Sensors />} />
//           <Route path="/analytics"  element={<Analytics />} />
//           <Route path="/zones"      element={<Zones />} />
//           <Route path="/settings"   element={<Settings />} />
//           <Route path="*"           element={<Navigate to="/monitoring" replace />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

const box = { maxWidth: 1200, margin: "0 auto", padding: 24 };

const Monitoring = () => <div style={box}>모니터링</div>;
const Sensors    = () => <div style={box}>센서정보</div>;
const Analytics  = () => <div style={box}>데이터분석</div>;
const Zones      = () => <div style={box}>구역</div>;
const Settings   = () => <div style={box}>설정</div>;

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* ⬇️ 여기서부터 회색 배경 */}
      <main style={{ flex: 1, background: "#e5e7eb" /* gray-200 */ }}>
        <Routes>
          <Route path="/" element={<Navigate to="/monitoring" replace />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/sensors"    element={<Sensors />} />
          <Route path="/analytics"  element={<Analytics />} />
          <Route path="/zones"      element={<Zones />} />
          <Route path="/settings"   element={<Settings />} />
          <Route path="*"           element={<Navigate to="/monitoring" replace />} />
        </Routes>
      </main>
    </div>
  );
}
