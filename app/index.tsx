// app/index.tsx
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { C, FONT, RADIUS, SHADOW, STATUS_META, StatusKey } from "@/constants/theme";
import { Employee, fetchEmployees } from "@/lib/firebase";
import EmployeeCard from "@/components/EmployeeCard";

type Filter = "all" | StatusKey;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",     label: "All"        },
  { key: "junior",  label: "🌱 Junior"  },
  { key: "senior",  label: "⭐ Senior"  },
  { key: "retired", label: "🏅 Retired" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState<Filter>("all");

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      fetchEmployees()
        .then((data) => { if (active) setEmployees(data); })
        .catch(console.error)
        .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }, [])
  );

  function handleDeleted(deletedId: string) {
    setEmployees((prev) => prev.filter((e) => e.id !== deletedId));
  }

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.phone.includes(search);
    const matchFilter = filter === "all" || e.statusLabel === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:     employees.length,
    junior:  employees.filter((e) => e.statusLabel === "junior").length,
    senior:  employees.filter((e) => e.statusLabel === "senior").length,
    retired: employees.filter((e) => e.statusLabel === "retired").length,
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Employees</Text>
          <Text style={styles.subtitle}>{counts.all} members</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/add")}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Stat pills */}
      <View style={styles.statsRow}>
        {(["junior", "senior", "retired"] as StatusKey[]).map((s) => (
          <View key={s} style={[styles.pill, { borderColor: STATUS_META[s].color, backgroundColor: STATUS_META[s].dim }]}>
            <Text style={[styles.pillNum,   { color: STATUS_META[s].color }]}>{counts[s]}</Text>
            <Text style={[styles.pillLabel, { color: STATUS_META[s].color }]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone…"
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.tab, filter === f.key && styles.tabActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.tabLabel, filter === f.key && styles.tabLabelActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={C.accent} size="large" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>No employees found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EmployeeCard employee={item} onDeleted={handleDeleted} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection:     "row",
    justifyContent:    "space-between",
    alignItems:        "center",
    paddingHorizontal: 20,
    paddingTop:        16,
    paddingBottom:     12,
  },
  title:    { ...FONT.heading },
  subtitle: { ...FONT.body, marginTop: 2 },
  addBtn: {
    backgroundColor:  C.accent,
    paddingHorizontal: 18,
    paddingVertical:   10,
    borderRadius:      RADIUS.full,
    ...SHADOW.card,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  pill: {
    flex:            1,
    alignItems:      "center",
    paddingVertical: 10,
    borderRadius:    RADIUS.md,
    borderWidth:     1,
  },
  pillNum:   { fontSize: 20, fontWeight: "800" },
  pillLabel: { fontSize: 11, fontWeight: "600", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  searchBox: {
    flexDirection:     "row",
    alignItems:        "center",
    backgroundColor:   C.card,
    borderRadius:      RADIUS.md,
    marginHorizontal:  20,
    marginBottom:      12,
    paddingHorizontal: 12,
    borderWidth:       1,
    borderColor:       C.border,
  },
  searchIcon:  { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, height: 44, color: C.text, fontSize: 14 },
  filterRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  tab: {
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      RADIUS.full,
    backgroundColor:   C.card,
    borderWidth:       1,
    borderColor:       C.border,
  },
  tabActive:      { backgroundColor: C.accentDim, borderColor: C.accent },
  tabLabel:       { color: C.textSub, fontSize: 12, fontWeight: "600" },
  tabLabelActive: { color: C.accent },
  list:   { paddingHorizontal: 20, paddingBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty:  { ...FONT.body, marginTop: 12 },
});