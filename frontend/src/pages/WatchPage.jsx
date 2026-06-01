import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVideo } from "../services/api";

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVideo(id)
      .then((res) => {
        setVideo(res.data.data);
        setVideoUrl(res.data.video_url);
      })
      .catch(() => setError("Video tidak ditemukan"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: "24px" }}>Memuat video...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <button
        onClick={() => navigate("/")}
        style={{ marginBottom: "16px", background: "none", border: "1px solid #444", color: "#ccc", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}
      >
        ← Kembali
      </button>

      <div style={{ background: "#000", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
        <video
          src={videoUrl}
          controls
          autoPlay
          style={{ width: "100%", maxHeight: "500px" }}
        />
      </div>

      <div style={{ background: "#1e1e2e", borderRadius: "12px", padding: "20px" }}>
        <h2 style={{ margin: "0 0 8px", color: "#fff" }}>{video.title}</h2>
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <span style={{ background: "#6366f1", color: "#fff", padding: "2px 10px", borderRadius: "4px", fontSize: "13px" }}>
            {video.language || "JA"}
          </span>
          {video.source && (
            <span style={{ color: "#888", fontSize: "13px", alignSelf: "center" }}>
              Sumber: {video.source}
            </span>
          )}
        </div>
        {video.description && (
          <p style={{ color: "#aaa", margin: 0, lineHeight: "1.6" }}>{video.description}</p>
        )}
      </div>
    </div>
  );
}