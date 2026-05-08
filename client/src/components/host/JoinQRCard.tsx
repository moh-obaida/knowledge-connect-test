import { t } from "../../lib/i18n";
import QRCode from "../QRCode";

type Props = {
  roomCode: string;
  joinLink: string;
  onCopy: (text: string, label: string) => void;
  onShowDisplay?: () => void;
  onOpenJoin?: () => void;
  size?: number;
  variant?: "card" | "compact" | "display";
};

export default function JoinQRCard({ roomCode, joinLink, onCopy, onShowDisplay, onOpenJoin, size = 180, variant = "card" }: Props) {
  if (variant === "compact") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <QRCode value={joinLink} size={size} ariaLabel={`${t('joinQr.qrAria')} ${roomCode}`} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", minWidth: 0 }}>
          <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{t('joinQr.roomCode')}</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f59e0b", letterSpacing: "0.18em" }}>{roomCode}</div>
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            <button className="btn-secondary" style={{ fontSize: "0.72rem" }} onClick={() => onCopy(joinLink, t('hostHeader.joinLink'))}>{t('joinQr.copyJoinLink')}</button>
            {onOpenJoin && <button className="btn-secondary" style={{ fontSize: "0.72rem" }} onClick={onOpenJoin}>{t('joinQr.openJoinPage')}</button>}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "display") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <QRCode value={joinLink} size={size} ariaLabel={`${t('joinQr.qrAria')} ${roomCode}`} />
        <div style={{ fontSize: "0.95rem", color: "#cbd5e1" }}>{t('joinQr.scanToJoin')}</div>
        <div style={{ fontSize: "0.85rem", color: "#94a3b8", direction: "ltr" }}>{joinLink}</div>
      </div>
    );
  }

  return (
    <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <div className="section-title">{t('joinQr.qrJoinTitle')}</div>
      <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{t('joinQr.scanToJoin')}.</div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <QRCode value={joinLink} size={size} ariaLabel={`${t('joinQr.qrAria')} ${roomCode}`} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", minWidth: 0 }}>
          <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{t('joinQr.roomCode')}</div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#f59e0b", letterSpacing: "0.18em" }}>{roomCode}</div>
          <div style={{ fontSize: "0.78rem", color: "#cbd5e1", direction: "ltr", wordBreak: "break-all" }}>{joinLink}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <button className="btn-gold" style={{ fontSize: "0.8rem" }} onClick={() => onCopy(joinLink, t('hostHeader.joinLink'))}>{t('joinQr.copyJoinLink')}</button>
        {onOpenJoin && <button className="btn-secondary" style={{ fontSize: "0.8rem" }} onClick={onOpenJoin}>{t('joinQr.openJoinPage')}</button>}
        {onShowDisplay && <button className="btn-secondary" style={{ fontSize: "0.8rem" }} onClick={onShowDisplay}>{t('joinQr.showOnDisplay')}</button>}
      </div>
    </div>
  );
}
