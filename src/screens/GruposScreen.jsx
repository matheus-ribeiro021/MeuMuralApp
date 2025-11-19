import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export default function GruposScreen() {
  const navigation = useNavigation();

  const [grupos, setGrupos] = useState([
    { 
      id: 1, 
      nome: "Casa", 
      pendentes: 3,
      tarefasPendentes: [
        { id: 1, tarefa: "Limpar banheiro", autor: "Ana" },
        { id: 2, tarefa: "Regar plantas", autor: "Maria" },
        { id: 3, tarefa: "Comprar frutas", autor: "Você" }
      ],
      tarefasConcluidas: [
        { id: 4, tarefa: "Tirar lixo", autor: "João" }
      ]
    },

    { 
      id: 2, 
      nome: "Escritório", 
      pendentes: 2,
      tarefasPendentes: [
        { id: 11, tarefa: "Enviar relatório", autor: "Pedro" },
        { id: 12, tarefa: "Organizar planilha", autor: "Carla" },
      ],
      tarefasConcluidas: []
    },

    { 
      id: 3, 
      nome: "Projeto X", 
      pendentes: 1,
      tarefasPendentes: [
        { id: 21, tarefa: "Testar API", autor: "Você" }
      ],
      tarefasConcluidas: [
        { id: 22, tarefa: "Criar layout", autor: "João" }
      ]
    },
  ]);

  const [criando, setCriando] = useState(false);
  const [novoGrupo, setNovoGrupo] = useState("");

  function criarGrupo() {
    if (novoGrupo.trim() === "") return;

    const novo = {
      id: Date.now(),
      nome: novoGrupo,
      pendentes: 0,
      tarefasPendentes: [],
      tarefasConcluidas: []
    };

    setGrupos([...grupos, novo]);
    setNovoGrupo("");
    setCriando(false);
  }

  function sairDoGrupo(id) {
    setGrupos(grupos.filter((g) => g.id !== id));
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Meus Grupos</Text>

        <TouchableOpacity
          onPress={() => setCriando(!criando)}
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

      {criando && (
        <View style={{ marginBottom: 15 }}>
          <TextInput
            placeholder="Nome do grupo"
            value={novoGrupo}
            onChangeText={setNovoGrupo}
            style={{
              backgroundColor: "#f1f1f1",
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
            }}
          />

          <TouchableOpacity
            onPress={criarGrupo}
            style={{
              backgroundColor: "#007bff",
              padding: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Criar</Text>
          </TouchableOpacity>
        </View>
      )}

      {grupos.map((g) => (
        <View
          key={g.id}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 16,
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TarefasGrupo", {
                grupoId: g.id,
                grupoNome: g.nome,
                tarefasPendentes: g.tarefasPendentes,
                tarefasConcluidas: g.tarefasConcluidas,
              })
            }
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>{g.nome}</Text>
            <Text style={{ color: "#777", marginTop: 4 }}>
              {g.tarefasPendentes.length} pendentes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => sairDoGrupo(g.id)}
            style={{
              marginTop: 10,
              backgroundColor: "#ff4444",
              paddingVertical: 6,
              borderRadius: 6,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Sair</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
