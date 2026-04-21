// app/add.tsx
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
import { useRouter } from "expo-router";
import { useState } from "react";
import { C, FONT, RADIUS, SHADOW, STATUS_META, StatusKey } from "@/constants/theme";
import { createEmployee } from "@/lib/firebase";

export default function AddScreen() {
  const router = useRouter();
  const [name,   setName]   = useState("");
  const [phone,  setPhone]  = useState("");
  const [status, setStatus] = useState<StatusKey>("junior");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim())  e.name  = "Name is required";
    if (!phone.trim()) e.phone = "Phone is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      await createEmployee({ name: name.trim(), phone: phone.trim(), statusLabel: status });
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Could not save. Try again.");
    } finally {
      setSaving(false);
    }
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
            placeholder="e.g. Sarah Johnson"
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
            placeholder="e.g. +1 555 000 0000"
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

        <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveTxt}>Save Employee</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelTxt}>Cancel</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  saveTxt:   { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancelBtn: { marginTop: 14, paddingVertical: 10 },
  cancelTxt: { color: C.textSub, fontSize: 14 },
});