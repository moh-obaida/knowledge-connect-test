import { useState } from "react";

export default function HostView() {
  const [roomCode, setRoomCode] = useState("");

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b1220", color: "#f8fafc", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 640, background: "#111827", border: "1px solid #1f2937", borderRadius: 16, padding: "1.5rem" }}>
        <h1 style={{ margin: 0, marginBottom: "0.75rem", fontSize: "1.5rem" }}>لوحة المضيف</h1>
        <p style={{ marginTop: 0, color: "#94a3b8" }}>تم تنظيف الملف المتضرر الذي كان يمنع البناء. يمكنك الآن المتابعة وإعادة إضافة الميزات تدريجيًا.</p>
        <label style={{ display: "block", marginBottom: 8 }}>رمز الغرفة</label>
        <input
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="مثال: 123456"
          style={{ width: "100%", padding: "0.75rem", borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "#f8fafc" }}
        />
      </div>
    </div>
  );
}
