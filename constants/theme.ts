export const C = {
  bg:         "#0B0C10",
  surface:    "#13141A",
  card:       "#1C1D26",
  border:     "#2A2B38",
  accent:     "#E63946",
  accentDim:  "rgba(230,57,70,0.15)",
  junior:     "#06D6A0",
  juniorDim:  "rgba(6,214,160,0.13)",
  senior:     "#3A86FF",
  seniorDim:  "rgba(58,134,255,0.13)",
  retired:    "#8D8FA8",
  retiredDim: "rgba(141,143,168,0.13)",
  text:       "#F0EFF4",
  textSub:    "#8D8FA8",
  textMuted:  "#44455A",
} as const;

export const FONT = {
  heading: { fontSize: 28, fontWeight: "700" as const, color: "#F0EFF4", letterSpacing: -0.5 },
  sub:     { fontSize: 12, fontWeight: "600" as const, color: "#8D8FA8", letterSpacing: 0.8, textTransform: "uppercase" as const },
  label:   { fontSize: 15, fontWeight: "600" as const, color: "#F0EFF4" },
  body:    { fontSize: 14, fontWeight: "400" as const, color: "#8D8FA8" },
};

export const RADIUS = { sm: 8, md: 14, lg: 20, full: 999 };

export const SHADOW = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export type StatusKey = "junior" | "senior" | "retired";

export const STATUS_META: Record<StatusKey, { color: string; dim: string; icon: string }> = {
  junior:  { color: "#06D6A0", dim: "rgba(6,214,160,0.13)",   icon: "🌱" },
  senior:  { color: "#3A86FF", dim: "rgba(58,134,255,0.13)",  icon: "⭐" },
  retired: { color: "#8D8FA8", dim: "rgba(141,143,168,0.13)", icon: "🏅" },
};