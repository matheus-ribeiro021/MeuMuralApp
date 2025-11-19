import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TarefasGrupoScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { 
    grupoNome, 
    tarefasPendentes: tarefasInicialPendentes,
    tarefasConcluidas: tarefasInicialConcluidas
  } = route.params;

  const [pendentes, setPendentes] = useState(tarefasInicialPendentes);
  const [concluidas, setConcluidas] = useState(tarefasInicialConcluidas);

  const [criando, setCriando] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState("");

  function adicionarTarefa() {
    if (novaTarefa.trim() === "") return;

    const nova = {
      id: Date.now(),
      tarefa: novaTarefa,
      autor: "Você",
    };

    setPendentes([...pendentes, nova]);
    setNovaTarefa("");
    setCriando(false);
  }

  function marcarComoConcluida(id) {
    const tarefa = pendentes.find((t) => t.id === id);
    if (!tarefa) return;

    setPendentes(pendentes.filter((t) => t.id !== id));
    setConcluidas([...concluidas, tarefa]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
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
          onPress={() => setCriando(!criando)}
        >
          <Text style={{ color: "#fff" }}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {criando && (
        <View style={{ marginBottom: 15 }}>
          <TextInput
            placeholder="Digite a tarefa"
            value={novaTarefa}
            onChangeText={setNovaTarefa}
            style={{
              backgroundColor: "#f1f1f1",
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
            }}
          />

          <TouchableOpacity
            onPress={adicionarTarefa}
            style={{
              backgroundColor: "#007bff",
              padding: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Pendentes</Text>

        {pendentes.map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => marcarComoConcluida(t.id)}
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
          </TouchableOpacity>
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
            <Text style={{ textDecorationLine: "line-through" }}>
              {t.tarefa}
            </Text>
            <Text style={{ color: "#777", marginTop: 4 }}>{t.autor}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
