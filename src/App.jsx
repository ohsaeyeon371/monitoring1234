// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar.jsx";
// import MonitoringPage from "./pages/MonitoringPage.jsx";

// const box = { maxWidth: 1200, margin: "0 auto", padding: 24 };
// const Sensors   = () => <div style={box}>센서정보</div>;
// const Analytics = () => <div style={box}>데이터분석</div>;
// const Zones     = () => <div style={box}>구역</div>;
// const Settings  = () => <div style={box}>설정</div>;

// export default function App() {
//   return (
//     <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//       <Navbar />
//       {/* 아래 영역 전체 회색 배경 */}
//       <main style={{ flex: 1, background: "#e5e7eb" }}>
//         <Routes>
//           <Route path="/" element={<Navigate to="/monitoring" replace />} />
//           <Route path="/monitoring" element={<MonitoringPage />} />
//           <Route path="/sensors"    element={<Sensors />} />
//           <Route path="/analytics"  element={<Analytics />} />
//           <Route path="/zones"      element={<Zones />} />
//           <Route path="/settings"   element={<Settings />} />
//           <Route path="*"           element={<Navigate to="/monitoring" replace />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import MonitoringPage from "./pages/MonitoringPage.jsx";
import SensorsPage from "./pages/SensorsPage.jsx";

const box = { maxWidth: 1200, margin: "0 auto", padding: 24 };
const Analytics = () => <div style={box}>데이터분석</div>;
const Zones     = () => <div style={box}>구역</div>;
const Settings  = () => <div style={box}>설정</div>;

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, background: "#e5e7eb" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/monitoring" replace />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/sensors"    element={<SensorsPage />} />
          <Route path="/analytics"  element={<Analytics />} />
          <Route path="/zones"      element={<Zones />} />
          <Route path="/settings"   element={<Settings />} />
          <Route path="*"           element={<Navigate to="/monitoring" replace />} />
        </Routes>
      </main>
    </div>
  );
}
