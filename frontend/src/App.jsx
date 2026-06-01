import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WatchPage from "./pages/WatchPage";
import UploadPage from "./pages/UploadPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#13131f", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}