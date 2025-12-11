import { useNavigation } from "@react-navigation/native";
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
import grupoService from "../services/grupoService";
import postagemService from "../services/postagemService";

export default function GruposScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

  const [grupos, setGrupos] = useState([]);
  const [criando, setCriando] = useState(false);
  const [creating, setCreating] = useState(false);
  const [novoGrupo, setNovoGrupo] = useState("");
  const [descricaoGrupo, setDescricaoGrupo] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarGrupos();
  }, []);

  async function carregarGrupos() {
    try {
      setLoading(true);
      const gruposData = await grupoService.listarGrupos();
      
      // Para cada grupo, buscar a quantidade de postagens
      const gruposComPostagens = await Promise.all(
        gruposData.map(async (grupo) => {
          try {
            const postagens = await postagemService.listarPorGrupo(grupo.id);
            return {
              ...grupo,
              quantidadePostagens: postagens.length,
              postagens: postagens,
            };
          } catch (error) {
            console.error(`Erro ao carregar postagens do grupo ${grupo.id}:`, error);
            return {
              ...grupo,
              quantidadePostagens: 0,
              postagens: [],
            };
          }
        })
      );

      setGrupos(gruposComPostagens);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      Alert.alert("Erro", "Não foi possível carregar os grupos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await carregarGrupos();
  }

  async function criarGrupo() {
    if (novoGrupo.trim() === "") {
      Alert.alert("Atenção", "Digite o nome do grupo.");
      return;
    }

    try {
      setCreating(true);
      console.log('Criando grupo com:', { nome: novoGrupo, descricao: descricaoGrupo });
      const novoGrupoData = await grupoService.criarGrupo({
        nome: novoGrupo,
        descricao: descricaoGrupo,
      });

      console.log('Resposta do servidor ao criar grupo:', novoGrupoData);

      // Se servidor retornou o novo grupo com id, adiciona à lista
      if (novoGrupoData && (novoGrupoData.id || novoGrupoData.id === 0)) {
        setGrupos([...grupos, { ...novoGrupoData, quantidadePostagens: 0, postagens: [] }]);
        setNovoGrupo("");
        setDescricaoGrupo("");
        setCriando(false);
        Alert.alert("Sucesso", "Grupo criado com sucesso!");
      } else {
        // Resposta inesperada: mostrar ao usuário para diagnóstico
        setNovoGrupo("");
        setDescricaoGrupo("");
        setCriando(false);
        Alert.alert('Aviso', 'Grupo criado, mas resposta inesperada do servidor: ' + JSON.stringify(novoGrupoData));
      }
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      const message = error.response?.data?.message || error.message || 'Não foi possível criar o grupo.';
      Alert.alert('Erro ao criar grupo', message);
    } finally {
      setCreating(false);
    }
  }

  async function sairDoGrupo(id) {
    // Alert.alert com callbacks não funciona bem no web; usar window.confirm no web
    if (Platform.OS === 'web') {
      const ok = window.confirm('Deseja realmente sair deste grupo?');
      if (!ok) return;
      try {
        console.log('Tentando deletar grupo id=', id);
        await grupoService.deletarGrupo(id);
        const newGrupos = grupos.filter((g) => String(g.id) !== String(id));
        console.log('Grupos antes:', grupos);
        console.log('Grupos depois:', newGrupos);
        setGrupos(newGrupos);
        window.alert('Você saiu do grupo.');
      } catch (error) {
        console.error('Erro ao sair do grupo:', error);
        window.alert('Não foi possível sair do grupo.');
      }
      return;
    }

    Alert.alert(
      "Confirmar",
      "Deseja realmente sair deste grupo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              console.log('Tentando deletar grupo id=', id);
              await grupoService.deletarGrupo(id);
              // Normaliza tipos antes de filtrar
              const newGrupos = grupos.filter((g) => String(g.id) !== String(id));
              console.log('Grupos antes:', grupos);
              console.log('Grupos depois:', newGrupos);
              setGrupos(newGrupos);
              Alert.alert("Sucesso", "Você saiu do grupo.");
            } catch (error) {
              console.error('Erro ao sair do grupo:', error);
              Alert.alert("Erro", "Não foi possível sair do grupo.");
            }
          },
        },
      ]
    );
  }

  function handleLogout() {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await signOut();
            navigation.replace("Login");
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10, color: "#777" }}>Carregando grupos...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Meus Grupos</Text>
          {user && (
            <Text style={{ fontSize: 12, color: "#777", marginTop: 2 }}>
              Olá, {user.nome}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={() => setCriando(!criando)}
            style={{
              backgroundColor: "#000",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff" }}>+ Criar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "#ff4444",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff" }}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {criando && (
        <View style={{ marginBottom: 15, backgroundColor: "#f9f9f9", padding: 12, borderRadius: 8 }}>
          <TextInput
            placeholder="Nome do grupo"
            value={novoGrupo}
            onChangeText={setNovoGrupo}
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
            value={descricaoGrupo}
            onChangeText={setDescricaoGrupo}
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
              onPress={criarGrupo}
              disabled={creating}
              style={{
                flex: 1,
                backgroundColor: creating ? "#5a9bf5" : "#007bff",
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              {creating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Criar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setCriando(false);
                setNovoGrupo("");
                setDescricaoGrupo("");
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

      {grupos.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: "#777", fontSize: 16 }}>Nenhum grupo encontrado</Text>
          <Text style={{ color: "#999", fontSize: 14, marginTop: 8 }}>
            Crie seu primeiro grupo!
          </Text>
        </View>
      ) : (
        grupos.map((g) => (
          <View
            key={g.id}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 16,
              borderRadius: 10,
              marginBottom: 12,
              backgroundColor: "#fafafa",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                console.log('Navegando para TarefasGrupo com id=', g.id);
                navigation.navigate("TarefasGrupo", {
                  grupoId: g.id,
                  grupoNome: g.nome,
                  grupoDescricao: g.descricao,
                });
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>{g.nome}</Text>
              {g.descricao && (
                <Text style={{ color: "#555", marginTop: 4, fontSize: 13 }}>
                  {g.descricao}
                </Text>
              )}
              <Text style={{ color: "#777", marginTop: 6, fontSize: 12 }}>
                {g.quantidadePostagens} {g.quantidadePostagens === 1 ? 'postagem' : 'postagens'}
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
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Sair do Grupo</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}
