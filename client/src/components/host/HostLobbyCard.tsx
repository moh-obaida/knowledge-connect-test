import type { RoomState } from "../../lib/store";
import { t } from "../../lib/i18n";
import JoinQRCard from "./JoinQRCard";

type Props = {
  room: RoomState;
  roomCode: string;
  joinLink: string;
  onCopy: (text: string, label: string) => void;
  onStartGame: () => void;
  onBackToDashboard: () => void;
};

export default function HostLobbyCard({ room, roomCode, joinLink, onCopy, onStartGame, onBackToDashboard }: Props) {
  const players = Object.values(room.players || {});
  const t1 = players.filter((p) => p.team === 1);
  const t2 = players.filter((p) => p.team === 2);
  const noTeam = players.filter((p) => p.team === 0);
  const openDisplay = () => { if (typeof window !== "undefined") window.open(`/display?room=${roomCode}`, "_blank", "noopener"); };
  return <div className="kc-card" style={{ marginBottom: "1rem" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.6rem" }}>
      <div><div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f59e0b" }}>{t('hostLobby.title')}</div><div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.2rem", maxWidth: 560 }}>{t('hostLobby.subtitle')}</div></div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <button className="btn-gold" onClick={onStartGame}>{t('hostLobby.startChallenge')}</button>
        <button className="btn-secondary" onClick={() => onCopy(joinLink, t('hostHeader.joinLink'))}>{t('hostLobby.copyJoinLink')}</button>
        <button className="btn-secondary" onClick={openDisplay}>{t('hostLobby.displayMode')}</button>
        <button className="btn-secondary" onClick={onBackToDashboard}>{t('hostLobby.backToDashboard')}</button>
      </div></div>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 1fr) minmax(220px, 1fr)", gap: "1rem" }} className="responsive-two-col">
      <div style={{ background: "#141e2d", border: "1px solid #1a2332", borderRadius: 12, padding: "0.85rem" }}><JoinQRCard roomCode={roomCode} joinLink={joinLink} onCopy={onCopy} variant="compact" size={150} onOpenJoin={() => window.open(`/join?room=${roomCode}`, "_blank", "noopener")} /></div>
      <div style={{ background: "#141e2d", border: "1px solid #1a2332", borderRadius: 12, padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem", minHeight: 180 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 700 }}>{t('hostLobby.participantsJoined')}</div><span className="badge-chip" style={{ background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.4)", color: "#f59e0b" }}>{players.length}</span></div>
        {players.length===0 ? <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", textAlign:"center", color:"#94a3b8", fontSize:"0.85rem", lineHeight:1.9 }}><div style={{ fontSize:"1.6rem", marginBottom:"0.25rem" }}>👥</div><div>{t('hostLobby.noParticipants')}</div><div style={{ fontSize:"0.78rem", color:"#64748b" }}>{t('hostLobby.noParticipantsHint')}</div></div> : <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem", maxHeight:220, overflowY:"auto" }}>{[{label:room.team1.name,color:room.team1.color,list:t1},{label:room.team2.name,color:room.team2.color,list:t2},{label:t('hostLobby.noTeam'),color:"#64748b",list:noTeam}].filter((g)=>g.list.length>0).map((g)=><div key={g.label}><div style={{ fontSize:"0.74rem", color:g.color, fontWeight:700, marginBottom:"0.2rem" }}>{g.label} • {g.list.length}</div><div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>{g.list.map((p)=><span key={p.id} className="badge-chip" style={{ fontSize:"0.72rem", color:"#cbd5e1", background:"#0f1623" }}>{p.name}</span>)}</div></div>)}</div>}
      </div>
    </div>
  </div>
}
