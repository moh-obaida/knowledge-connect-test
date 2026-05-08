import { useEffect, useRef, useState } from "react";
import QRCodeLib from "qrcode";

type Props = {
  value: string;
  size?: number;
  margin?: number;
  bg?: string;
  fg?: string;
  ariaLabel?: string;
};

export default function QRCode({ value, size = 180, margin = 1, bg = "#ffffff", fg = "#090d18", ariaLabel }: Props) {
  const [svg, setSvg] = useState<string>("");
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!value) { setSvg(""); return; }
    QRCodeLib.toString(value, {
      type: "svg",
      margin,
      color: { dark: fg, light: bg },
      errorCorrectionLevel: "M",
      width: size,
    })
      .then((s) => { if (mounted.current) setSvg(s); })
      .catch(() => { if (mounted.current) setSvg(""); });
    return () => { mounted.current = false; };
  }, [value, size, margin, bg, fg]);

  if (!svg) {
    return (
      <div
        aria-label={ariaLabel || "QR code"}
        style={{ width: size, height: size, background: bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: fg, fontSize: "0.75rem" }}
      >
        ...
      </div>
    );
  }

  return (
    <div
      aria-label={ariaLabel || "QR code"}
      role="img"
      style={{ width: size, height: size, background: bg, borderRadius: 8, padding: 4, display: "inline-block", lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
