import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TarefasGrupoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { grupoNome } = route.params;

  const pendentes = [
    { id: 1, tarefa: "Comprar maçã", autor: "Maria Silva" },
    { id: 2, tarefa: "Limpar banheiro", autor: "Ana Costa" },
    { id: 3, tarefa: "Regar plantas", autor: "Maria Silva" },
  ];

  const concluidas = [
    { id: 4, tarefa: "Tirar lixo", autor: "João Santos" },
    { id: 5, tarefa: "Lavar louça", autor: "Pedro Lima" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      {/* Cabeçalho */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{grupoNome}</Text>
          <Text style={{ color: "#777" }}>Tarefas da semana</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8,
            marginLeft: "auto",
          }}
        >
          <Text style={{ color: "#fff" }}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Pendentes</Text>
        {pendentes.map((t) => (
          <View
            key={t.id}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Text>{t.tarefa}</Text>
            <Text style={{ color: "#777", marginTop: 4 }}>{t.autor}</Text>
          </View>
        ))}

        <Text style={{ fontWeight: "bold", marginVertical: 8 }}>Concluídas</Text>
        {concluidas.map((t) => (
          <View
            key={t.id}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              padding: 12,
              marginBottom: 10,
              backgroundColor: "#f3f3f3",
            }}
          >
            <Text style={{ textDecorationLine: "line-through" }}>{t.tarefa}</Text>
            <Text style={{ color: "#777", marginTop: 4 }}>{t.autor}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
