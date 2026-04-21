// components/StatusBadge.tsx
import { StyleSheet, Text, View } from "react-native";
import { RADIUS, STATUS_META, StatusKey } from "@/constants/theme";

interface Props {
  status: StatusKey;
  size?:  "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: Props) {
  const meta  = STATUS_META[status];
  const small = size === "sm";

  return (
    <View style={[
      styles.badge,
      { backgroundColor: meta.dim, borderColor: meta.color },
      small && styles.sm,
    ]}>
      <Text style={[styles.icon, small && styles.iconSm]}>{meta.icon}</Text>
      <Text style={[styles.label, { color: meta.color }, small && styles.labelSm]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            5,
    paddingHorizontal: 11,
    paddingVertical:   5,
    borderRadius:   RADIUS.full,
    borderWidth:    1,
    alignSelf:      "flex-start",
  },
  sm:      { paddingHorizontal: 8, paddingVertical: 3 },
  icon:    { fontSize: 13 },
  iconSm:  { fontSize: 10 },
  label:   { fontSize: 13, fontWeight: "600", letterSpacing: 0.3 },
  labelSm: { fontSize: 11 },
});