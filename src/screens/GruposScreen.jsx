import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function GruposScreen() {
  const navigation = useNavigation();

  const grupos = [
    { id: 1, nome: "Casa", pendentes: 5 },
    { id: 2, nome: "Escritório", pendentes: 12 },
    { id: 3, nome: "Projeto X", pendentes: 3 },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Meus Grupos</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff" }}>+ Criar Grupo</Text>
        </TouchableOpacity>
      </View>

      {grupos.map((g) => (
        <TouchableOpacity
          key={g.id}
          onPress={() => navigation.navigate("TarefasGrupo", { grupoNome: g.nome })}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 16,
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{g.nome}</Text>
          <Text style={{ color: "#777", marginTop: 4 }}>{g.pendentes} pendentes</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
