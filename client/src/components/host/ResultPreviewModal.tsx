import type { GameResult } from "../../lib/gameResults";
import { summarizeResult } from "../../lib/gameResults";

type Props = {
  result: GameResult;
  onClose: () => void;
  onCopySummary: (text: string) => void;
  onExportJSON: (r: GameResult) => void;
  onDelete: (id: string) => void;
};

export default function ResultPreviewModal({ result, onClose, onCopySummary, onExportJSON, onDelete }: Props) {
  const date = new Date(result.finishedAt).toLocaleString("ar");
  const winnerColor = result.winnerTeam === 1 ? result.team1.color : result.winnerTeam === 2 ? result.team2.color : "#94a3b8";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 540, width: "min(540px, 92vw)", maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
          <div style={{ fontWeight: 800, color: "#f59e0b" }}>تفاصيل النتيجة</div>
          <button aria-label="إغلاق" onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.1rem" }}>✕</button>
        </div>

        <div style={{ fontWeight: 800, color: "#f0ede8", fontSize: "1.05rem" }}>{result.gameTitle}</div>
        <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.7rem" }}>
          الرمز: <strong style={{ color: "#cbd5e1" }}>{result.roomCode}</strong> • التاريخ: {date}
        </div>

        <div style={{ background: "#141e2d", border: `2px solid ${winnerColor}`, borderRadius: 12, padding: "0.85rem", textAlign: "center", marginBottom: "0.85rem" }}>
          <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>الفائز</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 900, color: winnerColor }}>{result.winnerName}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.85rem" }}>
          <div style={{ background: "#141e2d", borderRadius: 10, padding: "0.6rem", border: `1.5px solid ${result.team1.color}55` }}>
            <div style={{ fontSize: "0.74rem", color: result.team1.color, fontWeight: 700 }}>{result.team1.name}</div>
            <div style={{ fontWeight: 900, color: "#f0ede8", fontSize: "1.4rem" }}>{result.team1.score}</div>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>الحروف: {result.team1.cells}</div>
          </div>
          <div style={{ background: "#141e2d", borderRadius: 10, padding: "0.6rem", border: `1.5px solid ${result.team2.color}55` }}>
            <div style={{ fontSize: "0.74rem", color: result.team2.color, fontWeight: 700 }}>{result.team2.name}</div>
            <div style={{ fontWeight: 900, color: "#f0ede8", fontSize: "1.4rem" }}>{result.team2.score}</div>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>الحروف: {result.team2.cells}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.45rem", marginBottom: "0.85rem" }}>
          <Stat label="عدد الأسئلة" value={String(result.totalQuestions || "غير متوفر حالياً")} />
          <Stat label="عدد الحروف الكلية" value={String(result.totalCells)} />
          <Stat label="حروف لم تُستخدم" value={String(result.unansweredQuestions)} />
          <Stat label="عدد المشاركين" value={String(result.participants)} />
        </div>

        {result.participantNames.length > 0 && (
          <div style={{ marginBottom: "0.85rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.3rem" }}>المشاركون</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", maxHeight: 130, overflowY: "auto" }}>
              {result.participantNames.map((n, i) => (
                <span key={i} className="badge-chip" style={{ fontSize: "0.72rem", color: "#cbd5e1", background: "#0f1623" }}>{n}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <button className="btn-gold" onClick={() => onCopySummary(summarizeResult(result))}>نسخ الملخص</button>
          <button className="btn-secondary" onClick={() => onExportJSON(result)}>تصدير النتيجة</button>
          <button className="btn-danger" onClick={() => onDelete(result.id)}>حذف النتيجة</button>
          <button className="btn-secondary" style={{ marginInlineStart: "auto" }} onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#141e2d", borderRadius: 10, padding: "0.45rem 0.6rem", border: "1px solid #1a2332" }}>
      <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{label}</div>
      <div style={{ fontWeight: 800, color: "#f0ede8", fontSize: "0.95rem" }}>{value}</div>
    </div>
  );
}
