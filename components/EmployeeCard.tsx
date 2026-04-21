// components/EmployeeCard.tsx
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { C, FONT, RADIUS, SHADOW, STATUS_META, StatusKey } from "@/constants/theme";
import { Employee, deleteEmployee } from "@/lib/firebase";
import StatusBadge from "./StatusBadge";

interface Props {
  employee:  Employee;
  onDeleted: (id: string) => void;
}

export default function EmployeeCard({ employee, onDeleted }: Props) {
  const router       = useRouter();
  const meta         = STATUS_META[employee.statusLabel as StatusKey];
  const [busy, setBusy] = useState(false);

  const initials = employee.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  function pressDelete() {
    Alert.alert(
      "Remove Employee",
      `Remove "${employee.name}"?`,
      [
        { text: "Cancel",  style: "cancel" },
        { text: "Remove",  style: "destructive", onPress: doDelete },
      ],
      { cancelable: true }
    );
  }

  async function doDelete() {
    setBusy(true);
    try {
      await deleteEmployee(employee.id);
      onDeleted(employee.id);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not delete. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.card, SHADOW.card]}>
      <View style={[styles.bar, { backgroundColor: meta.color }]} />

      <View style={[styles.avatar, { backgroundColor: meta.dim, borderColor: meta.color }]}>
        <Text style={[styles.initials, { color: meta.color }]}>{initials}</Text>
      </View>

      <TouchableOpacity
        style={styles.info}
        activeOpacity={0.6}
        onPress={() => router.push(`/edit/${employee.id}`)}
      >
        <Text style={styles.name} numberOfLines={1}>{employee.name}</Text>
        <Text style={styles.phone}>{employee.phone}</Text>
        <View style={{ marginTop: 6 }}>
          <StatusBadge status={employee.statusLabel as StatusKey} size="sm" />
        </View>
      </TouchableOpacity>

      <View style={styles.btns}>
        <TouchableOpacity
          style={[styles.btn, styles.editBtn]}
          activeOpacity={0.7}
          onPress={() => router.push(`/edit/${employee.id}`)}
        >
          <Text style={styles.btnIcon}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.delBtn, busy && { opacity: 0.4 }]}
          activeOpacity={0.7}
          onPress={pressDelete}
          disabled={busy}
        >
          {busy
            ? <ActivityIndicator size="small" color={C.accent} />
            : <Text style={styles.btnIcon}>🗑</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection:  "row",
    alignItems:     "center",
    backgroundColor: C.card,
    borderRadius:   RADIUS.md,
    marginBottom:   12,
  },
  bar: {
    width:                   4,
    alignSelf:               "stretch",
    borderTopLeftRadius:     RADIUS.md,
    borderBottomLeftRadius:  RADIUS.md,
  },
  avatar: {
    width:          46,
    height:         46,
    borderRadius:   RADIUS.full,
    borderWidth:    1.5,
    alignItems:     "center",
    justifyContent: "center",
    marginLeft:     12,
  },
  initials: { fontSize: 15, fontWeight: "700" },
  info: {
    flex:            1,
    paddingVertical: 14,
    paddingLeft:     12,
    paddingRight:    4,
  },
  name:  { ...FONT.label, marginBottom: 2 },
  phone: { fontSize: 13, color: C.textSub },
  btns: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            8,
    paddingRight:   12,
  },
  btn: {
    width:          38,
    height:         38,
    borderRadius:   RADIUS.sm,
    alignItems:     "center",
    justifyContent: "center",
  },
  editBtn: {
    backgroundColor: "rgba(58,134,255,0.12)",
    borderWidth:     1,
    borderColor:     "rgba(58,134,255,0.35)",
  },
  delBtn: {
    backgroundColor: "rgba(230,57,70,0.10)",
    borderWidth:     1,
    borderColor:     "rgba(230,57,70,0.30)",
  },
  btnIcon: { fontSize: 16 },
});