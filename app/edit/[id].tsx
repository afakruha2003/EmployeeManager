// app/edit/[id].tsx
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { C, FONT, RADIUS, SHADOW, STATUS_META, StatusKey } from "@/constants/theme";
import { fetchEmployee, updateEmployee, deleteEmployee, toStr } from "@/lib/firebase";

export default function EditScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id     = toStr(params.id as string | string[]);

  const [name,     setName]     = useState("");
  const [phone,    setPhone]    = useState("");
  const [status,   setStatus]   = useState<StatusKey>("junior");
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors,   setErrors]   = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    if (!id) return;
    fetchEmployee(id)
      .then((emp) => {
        if (emp) {
          setName(emp.name);
          setPhone(emp.phone);
          setStatus(emp.statusLabel as StatusKey);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  function validate() {
    const e: typeof errors = {};
    if (!name.trim())  e.name  = "Name is required";
    if (!phone.trim()) e.phone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleUpdate() {
    if (!validate() || !id) return;
    setSaving(true);
    try {
      await updateEmployee(id, { name: name.trim(), phone: phone.trim(), statusLabel: status });
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not update. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function pressDelete() {
    Alert.alert(
      "Remove Employee",
      `Remove "${name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: doDelete },
      ],
      { cancelable: true }
    );
  }

  async function doDelete() {
    if (!id) { Alert.alert("Error", "ID not found."); return; }
    setDeleting(true);
    try {
      await deleteEmployee(id);
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not delete. Try again.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={C.accent} size="large" />
      </View>
    );
  }

  const preview = name.trim()
    ? name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <View style={[styles.avatar, { borderColor: STATUS_META[status].color, backgroundColor: STATUS_META[status].dim }]}>
          <Text style={[styles.avatarText, { color: STATUS_META[status].color }]}>{preview}</Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputErr]}
            placeholder="Full name"
            placeholderTextColor={C.textMuted}
            value={name}
            onChangeText={(t) => { setName(t); setErrors((p) => ({ ...p, name: undefined })); }}
            autoCapitalize="words"
          />
          {errors.name && <Text style={styles.err}>{errors.name}</Text>}
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputErr]}
            placeholder="Phone number"
            placeholderTextColor={C.textMuted}
            value={phone}
            onChangeText={(t) => { setPhone(t); setErrors((p) => ({ ...p, phone: undefined })); }}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.err}>{errors.phone}</Text>}
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {(["junior", "senior", "retired"] as StatusKey[]).map((s) => {
              const meta     = STATUS_META[s];
              const selected = status === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusCard, { borderColor: selected ? meta.color : C.border }, selected && { backgroundColor: meta.dim }]}
                  onPress={() => setStatus(s)}
                  activeOpacity={0.75}
                >
                  <Text style={{ fontSize: 22, marginBottom: 6 }}>{meta.icon}</Text>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: selected ? meta.color : C.textSub }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                  {selected && <View style={[styles.dot, { backgroundColor: meta.color }]} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleUpdate} disabled={saving} activeOpacity={0.8}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>Update Employee</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.delBtn, deleting && { opacity: 0.5 }]} onPress={pressDelete} disabled={deleting} activeOpacity={0.8}>
          {deleting ? <ActivityIndicator color={C.accent} /> : <Text style={styles.delTxt}>🗑  Remove Employee</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelTxt}>Cancel</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center:    { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: C.bg },
  container: { padding: 24, paddingBottom: 48, alignItems: "center" },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 2, alignItems: "center", justifyContent: "center", marginBottom: 28,
  },
  avatarText: { fontSize: 28, fontWeight: "800" },
  group:  { width: "100%", marginBottom: 20 },
  label:  { ...FONT.sub, marginBottom: 8 },
  input: {
    backgroundColor: C.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 16, paddingVertical: 13,
    color: C.text, fontSize: 15,
  },
  inputErr:   { borderColor: C.accent },
  err:        { color: C.accent, fontSize: 12, marginTop: 5 },
  statusRow:  { flexDirection: "row", gap: 10 },
  statusCard: {
    flex: 1, alignItems: "center", paddingVertical: 14,
    borderRadius: RADIUS.md, borderWidth: 1.5,
    backgroundColor: C.card, position: "relative",
  },
  dot: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4 },
  saveBtn: {
    width: "100%", backgroundColor: C.accent,
    borderRadius: RADIUS.full, paddingVertical: 15,
    alignItems: "center", marginTop: 8, ...SHADOW.card,
  },
  saveTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
  delBtn: {
    width: "100%",
    borderWidth: 1, borderColor: "rgba(230,57,70,0.4)",
    backgroundColor: "rgba(230,57,70,0.08)",
    borderRadius: RADIUS.full, paddingVertical: 14,
    alignItems: "center", marginTop: 12,
  },
  delTxt:    { color: C.accent, fontWeight: "600", fontSize: 15 },
  cancelBtn: { marginTop: 14, paddingVertical: 10 },
  cancelTxt: { color: C.textSub, fontSize: 14 },
});