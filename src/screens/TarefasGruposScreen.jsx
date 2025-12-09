import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import postagemService from "../services/postagemService";

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

    // Debug rápido no web: confirmar que o handler foi chamado e quais dados
    if (Platform.OS === 'web') {
      try {
        window.alert('Criando tarefa: ' + novaTarefa + '\nDescrição: ' + novoConteudo + '\nGrupoId: ' + grupoId);
      } catch (e) {
        console.log('Não foi possível exibir window.alert:', e);
      }
    }

    let timeoutId;
    try {
      setCriando(true);
      console.log('Criando postagem com:', { usuarioId: user.id, grupoId, titulo: novaTarefa, conteudo: novoConteudo });

      // watchdog para evitar loader infinito
      timeoutId = setTimeout(() => {
        console.warn('adicionarTarefa: requisição demorando mais de 15s, resetando estado criando');
        setCriando(false);
      }, 15000);

      const promise = postagemService.criarPostagem({
        usuarioId: user.id,
        grupoId: grupoId,
        titulo: novaTarefa,
        conteudo: novoConteudo,
      });

      console.log('adicionarTarefa: aguardando resposta do serviço...');
      const novaPostagem = await promise;
      console.log('Resposta do servidor ao criar postagem:', novaPostagem);

      setPostagens([...postagens, novaPostagem]);
      setNovaTarefa("");
      setNovoConteudo("");
      Alert.alert("Sucesso", "Tarefa criada com sucesso!");
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      const message = error.response?.data?.message || error.message || 'Não foi possível criar a tarefa.';
      Alert.alert('Erro ao criar tarefa', message);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setCriando(false);
      console.log('adicionarTarefa: setCriando(false) chamado no finally');
    }
  }

  async function deletarTarefa(id) {
    if (Platform.OS === 'web') {
      const ok = window.confirm('Deseja realmente excluir esta tarefa?');
      if (!ok) return;
      try {
        console.log('Tentando deletar postagem id=', id);
        await postagemService.deletarPostagem(id);
        const newPostagens = postagens.filter((p) => String(p.id) !== String(id));
        console.log('Postagens antes:', postagens);
        console.log('Postagens depois:', newPostagens);
        setPostagens(newPostagens);
        window.alert('Tarefa excluída.');
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        window.alert('Não foi possível excluir a tarefa.');
      }
      return;
    }

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
              console.log('Tentando deletar postagem id=', id);
              await postagemService.deletarPostagem(id);
              const newPostagens = postagens.filter((p) => String(p.id) !== String(id));
              console.log('Postagens antes:', postagens);
              console.log('Postagens depois:', newPostagens);
              setPostagens(newPostagens);
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
              disabled={criando}
              style={{
                flex: 1,
                backgroundColor: criando ? "#5a9bf5" : "#007bff",
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              {criando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Adicionar</Text>
              )}
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
