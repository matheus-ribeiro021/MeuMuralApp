import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MeusGruposScreen() {
  const [busca, setBusca] = useState("");

  
  const [grupos, setGrupos] = useState([
    { id: 1, nome: "Casa", membros: 4, pendentes: 5 },
    { id: 2, nome: "Escritório", membros: 8, pendentes: 12 },
    { id: 3, nome: "Projeto X", membros: 6, pendentes: 3 },
  ]);

  // filtragem simples
  const gruposFiltrados = grupos.filter((g) =>
    g.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.titulo}>Meus Grupos</Text>
        <TouchableOpacity style={styles.botaoCriar}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.textoBotaoCriar}>Criar Grupo</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.caixaBusca}>
        <Ionicons name="search" size={18} color="#777" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Buscar grupos..."
          placeholderTextColor="#999"
          style={styles.inputBusca}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      
      <FlatList
        data={gruposFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardGrupo}>
            <View style={styles.linha}>
              <Text style={styles.nomeGrupo}>{item.nome}</Text>
              <Ionicons name="lock-closed-outline" size={16} color="#444" />
            </View>
            <View style={styles.infoLinha}>
              <Ionicons name="people-outline" size={16} color="#444" />
              <Text style={styles.textoInfo}>{item.membros} membros</Text>
              <Text style={styles.textoPendentes}>{item.pendentes} pendentes</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  botaoCriar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A0A23",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  textoBotaoCriar: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  caixaBusca: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  inputBusca: {
    flex: 1,
    color: "#000",
  },
  cardGrupo: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  nomeGrupo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  infoLinha: {
    flexDirection: "row",
    alignItems: "center",
  },
  textoInfo: {
    marginLeft: 5,
    color: "#555",
  },
  textoPendentes: {
    marginLeft: 15,
    color: "#777",
  },
});
