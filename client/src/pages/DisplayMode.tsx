import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { subscribeToRoom } from "../lib/roomOps";
import { isFirebaseConfigured } from "../lib/firebase";
import type { RoomState } from "../lib/store";
import QRCode from "../components/QRCode";

function getParam(key: string): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(key) || "";
}

export default function DisplayMode() {
  const [, setLocation] = useLocation();
  const roomCode = getParam("room");
  const [room, setRoom] = useState<RoomState | null>(null);
  const [notFound, setNotFound] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!roomCode) { setLocation("/host"); return; }
    if (!isFirebaseConfigured()) return;
    try {
      const unsub = subscribeToRoom(roomCode, (s) => {
        if (s === null) setNotFound(true);
        else { setRoom(s); setNotFound(false); }
      });
      unsubRef.current = unsub;
    } catch (e) { console.error(e); }
    return () => { unsubRef.current?.(); };
  }, [roomCode, setLocation]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const joinLink = `${origin}/join?room=${roomCode}`;
  const participants = room ? Object.values(room.players || {}).length : 0;

  if (notFound) {
    return (
      <div style={pageBg}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>الغرفة غير موجودة</div>
          <div style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>تأكد من رمز الغرفة وحاول مرة أخرى.</div>
          <a href="/host" style={linkBack}>العودة إلى لوحة المضيف</a>
        </div>
      </div>
    );
  }

  return (
    <div style={pageBg}>
      <div style={{ position: "fixed", top: "0.75rem", insetInlineStart: "0.75rem", zIndex: 50 }}>
        <a href="/host" style={{ ...linkBack, fontSize: "0.78rem", padding: "0.4rem 0.8rem" }}>العودة إلى لوحة المضيف</a>
      </div>

      <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding: "2rem 1rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#f59e0b", lineHeight: 1.1 }}>
            وصلة المعرفة
          </div>
          {room?.gameTitle && room.gameTitle !== "وصلة المعرفة" && (
            <div style={{ fontSize: "1.1rem", color: "#cbd5e1", marginTop: "0.5rem" }}>{room.gameTitle}</div>
          )}
          <div style={{ fontSize: "1rem", color: "#94a3b8", marginTop: "0.4rem" }}>وضع العرض للفصل</div>
        </div>

        <div className="kc-card" style={{ width: "100%", maxWidth: 760, display: "grid", gridTemplateColumns: "minmax(260px, 1fr) minmax(260px, 1fr)", gap: "1.5rem", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.95rem", color: "#94a3b8", marginBottom: "0.5rem" }}>رمز الغرفة</div>
            <div style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 900, color: "#f59e0b", letterSpacing: "0.22em", fontVariantNumeric: "tabular-nums" }}>
              {roomCode}
            </div>
            <div style={{ fontSize: "0.95rem", color: "#cbd5e1", marginTop: "0.5rem" }}>المشاركون: <strong style={{ color: "#f0ede8" }}>{participants}</strong></div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: "#fff", padding: "0.6rem", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
              <QRCode value={joinLink} size={260} margin={1} ariaLabel={`رمز QR للانضمام إلى الغرفة ${roomCode}`} />
            </div>
          </div>
        </div>

        <div className="kc-card" style={{ width: "100%", maxWidth: 760 }}>
          <div className="section-title">كيف تنضم؟</div>
          <ol style={{ listStyle: "decimal", color: "#cbd5e1", fontSize: "1rem", lineHeight: 2.1, paddingInlineStart: "1.4rem" }}>
            <li>افتح صفحة الانضمام أو امسح رمز QR</li>
            <li>أدخل رمز الغرفة <strong style={{ color: "#f59e0b" }}>{roomCode}</strong></li>
            <li>اكتب اسمك</li>
            <li>انتظر بدء التحدي</li>
          </ol>
          <div style={{ marginTop: "0.85rem", padding: "0.6rem 0.85rem", background: "#141e2d", border: "1px solid #1a2332", borderRadius: 10, color: "#94a3b8", fontSize: "0.85rem", direction: "ltr", textAlign: "center", wordBreak: "break-all" }}>
            {joinLink}
          </div>
        </div>

        {room && room.gameStatus === "active" && (
          <div className="kc-card" style={{ width: "100%", maxWidth: 760, textAlign: "center" }}>
            <div style={{ color: "#22c55e", fontWeight: 700 }}>التحدي مفعّل الآن</div>
            <div style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.35rem" }}>يمكن للطلاب الذين لم ينضموا بعد أن يستخدموا الرمز للانضمام في أي لحظة.</div>
          </div>
        )}
      </div>
    </div>
  );
}

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #15243a 0%, #090d18 60%)",
  padding: "1rem",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
};

const linkBack: React.CSSProperties = {
  display: "inline-block",
  padding: "0.5rem 1rem",
  background: "#141e2d",
  border: "1px solid #1a2332",
  borderRadius: 10,
  color: "#cbd5e1",
  fontWeight: 600,
  textDecoration: "none",
  fontFamily: "Cairo,sans-serif",
};
