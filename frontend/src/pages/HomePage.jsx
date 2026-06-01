import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVideos } from "../services/api";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getVideos()
      .then((res) => setVideos(res.data.data || []))
      .catch(() => setError("Gagal memuat video"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0 }}>候補 Kouho</h1>
        <button
          onClick={() => navigate("/upload")}
          style={{ padding: "10px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
        >
          + Upload Klip
        </button>
      </div>

      {loading && <p>Memuat video...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && videos.length === 0 && <p>Belum ada klip. Upload yang pertama!</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => navigate(`/watch/${video.id}`)}
            style={{ background: "#1e1e2e", borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ width: "100%", aspectRatio: "16/9", background: "#2a2a3e", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {video.thumbnail_key ? (
                <img src={video.thumbnail_url} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "48px" }}>🎬</span>
              )}
            </div>
            <div style={{ padding: "14px" }}>
              <h3 style={{ margin: "0 0 6px", color: "#fff", fontSize: "15px" }}>{video.title}</h3>
              <p style={{ margin: "0 0 4px", color: "#888", fontSize: "13px" }}>{video.source || "Sumber tidak diketahui"}</p>
              <span style={{ background: "#6366f1", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>
                {video.language || "JA"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}