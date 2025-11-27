import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import grupoService from "../services/grupoService";
import postagemService from "../services/postagemService";
import { useAuth } from "../context/AuthContext";

export default function GruposScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

  const [grupos, setGrupos] = useState([]);
  const [criando, setCriando] = useState(false);
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
      const novoGrupoData = await grupoService.criarGrupo({
        nome: novoGrupo,
        descricao: descricaoGrupo,
      });

      setGrupos([...grupos, { ...novoGrupoData, quantidadePostagens: 0, postagens: [] }]);
      setNovoGrupo("");
      setDescricaoGrupo("");
      setCriando(false);
      Alert.alert("Sucesso", "Grupo criado com sucesso!");
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      Alert.alert("Erro", "Não foi possível criar o grupo.");
    }
  }

  async function sairDoGrupo(id) {
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
              await grupoService.deletarGrupo(id);
              setGrupos(grupos.filter((g) => g.id !== id));
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
              style={{
                flex: 1,
                backgroundColor: "#007bff",
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Criar</Text>
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
              onPress={() =>
                navigation.navigate("TarefasGrupo", {
                  grupoId: g.id,
                  grupoNome: g.nome,
                  grupoDescricao: g.descricao,
                })
              }
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
