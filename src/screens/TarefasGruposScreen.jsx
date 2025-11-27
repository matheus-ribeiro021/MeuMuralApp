import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import postagemService from "../services/postagemService";
import { useAuth } from "../context/AuthContext";

export default function TarefasGrupoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  const { grupoId, grupoNome, grupoDescricao } = route.params;

  const [postagens, setPostagens] = useState([]);
  const [criando, setCriando] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [novoConteudo, setNovoConteudo] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarPostagens();
  }, []);

  async function carregarPostagens() {
    try {
      setLoading(true);
      const postagensData = await postagemService.listarPorGrupo(grupoId);
      setPostagens(postagensData);
    } catch (error) {
      console.error('Erro ao carregar postagens:', error);
      Alert.alert("Erro", "Não foi possível carregar as postagens.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await carregarPostagens();
  }

  async function adicionarTarefa() {
    if (novaTarefa.trim() === "") {
      Alert.alert("Atenção", "Digite o título da tarefa.");
      return;
    }

    if (!user || !user.id) {
      Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
      return;
    }

    try {
      const novaPostagem = await postagemService.criarPostagem({
        usuarioId: user.id,
        grupoId: grupoId,
        titulo: novaTarefa,
        conteudo: novoConteudo,
      });

      setPostagens([...postagens, novaPostagem]);
      setNovaTarefa("");
      setNovoConteudo("");
      setCriando(false);
      Alert.alert("Sucesso", "Tarefa criada com sucesso!");
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      Alert.alert("Erro", "Não foi possível criar a tarefa.");
    }
  }

  async function deletarTarefa(id) {
    Alert.alert(
      "Confirmar",
      "Deseja realmente excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await postagemService.deletarPostagem(id);
              setPostagens(postagens.filter((p) => p.id !== id));
              Alert.alert("Sucesso", "Tarefa excluída.");
            } catch (error) {
              console.error('Erro ao deletar tarefa:', error);
              Alert.alert("Erro", "Não foi possível excluir a tarefa.");
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10, color: "#777" }}>Carregando tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{grupoNome}</Text>
          {grupoDescricao && (
            <Text style={{ color: "#777", fontSize: 12 }}>{grupoDescricao}</Text>
          )}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          onPress={() => setCriando(!criando)}
        >
          <Text style={{ color: "#fff" }}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {criando && (
        <View style={{ marginBottom: 15, backgroundColor: "#f9f9f9", padding: 12, borderRadius: 8 }}>
          <TextInput
            placeholder="Título da tarefa"
            value={novaTarefa}
            onChangeText={setNovaTarefa}
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          />

          <TextInput
            placeholder="Descrição (opcional)"
            value={novoConteudo}
            onChangeText={setNovoConteudo}
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: "#ddd",
              textAlignVertical: "top",
            }}
          />

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={adicionarTarefa}
              style={{
                flex: 1,
                backgroundColor: "#007bff",
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setCriando(false);
                setNovaTarefa("");
                setNovoConteudo("");
              }}
              style={{
                flex: 1,
                backgroundColor: "#ccc",
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#333", fontWeight: "bold" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Tarefas</Text>
          <Text style={{ color: "#777", fontSize: 12 }}>
            {postagens.length} {postagens.length === 1 ? 'tarefa' : 'tarefas'}
          </Text>
        </View>

        {postagens.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: "#777", fontSize: 16 }}>Nenhuma tarefa encontrada</Text>
            <Text style={{ color: "#999", fontSize: 14, marginTop: 8 }}>
              Crie a primeira tarefa deste grupo!
            </Text>
          </View>
        ) : (
          postagens.map((postagem) => (
            <View
              key={postagem.id}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
                backgroundColor: "#fafafa",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>{postagem.titulo}</Text>
                  {postagem.conteudo && (
                    <Text style={{ color: "#555", marginTop: 4, fontSize: 13 }}>
                      {postagem.conteudo}
                    </Text>
                  )}
                  <Text style={{ color: "#999", marginTop: 6, fontSize: 11 }}>
                    Criado em: {new Date(postagem.dataCriacao).toLocaleDateString('pt-BR')}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => deletarTarefa(postagem.id)}
                  style={{
                    backgroundColor: "#ff4444",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 6,
                    marginLeft: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12 }}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
