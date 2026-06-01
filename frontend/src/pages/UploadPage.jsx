import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../services/api";

export default function UploadPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", source: "", language: "JA" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!form.title || !videoFile) {
      setError("Judul dan file video wajib diisi");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("source", form.source);
      formData.append("language", form.language);
      formData.append("video", videoFile);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
      await uploadVideo(formData);
      navigate("/");
    } catch {
      setError("Gagal upload video. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", background: "#2a2a3e",
    border: "1px solid #444", borderRadius: "8px", color: "#fff",
    fontSize: "14px", boxSizing: "border-box",
  };

  const labelStyle = { display: "block", color: "#aaa", marginBottom: "6px", fontSize: "14px" };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px" }}>
      <button
        onClick={() => navigate("/")}
        style={{ marginBottom: "20px", background: "none", border: "1px solid #444", color: "#ccc", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}
      >
        ← Kembali
      </button>

      <div style={{ background: "#1e1e2e", borderRadius: "12px", padding: "28px" }}>
        <h2 style={{ margin: "0 0 24px", color: "#fff" }}>Upload Klip</h2>

        {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Judul *</label>
          <input style={inputStyle} value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Judul klip" />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Deskripsi</label>
          <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Deskripsi singkat klip" />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Sumber (nama VTuber / channel)</label>
          <input style={inputStyle} value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="Contoh: Korone Ch." />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Bahasa Subtitle</label>
          <select style={inputStyle} value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}>
            <option value="JA">Japanese (JA)</option>
            <option value="ID">Indonesia (ID)</option>
            <option value="EN">English (EN)</option>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>File Video * (MP4)</label>
          <input type="file" accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            style={{ color: "#aaa", fontSize: "14px" }} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Thumbnail (opsional)</label>
          <input type="file" accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            style={{ color: "#aaa", fontSize: "14px" }} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", padding: "12px", background: loading ? "#444" : "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "15px" }}
        >
          {loading ? "Mengupload..." : "Upload Klip"}
        </button>
      </div>
    </div>
  );
}