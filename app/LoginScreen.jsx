import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [aba, setAba] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleEntrar = () => {
    console.log("Login:", { email, senha });

     router.push("/MeusGruposScreen");
  };


  const handleRegistro = () => {
    console.log("Registro:", { nome, email, senha });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}></View>
        <Text style={styles.titulo}>Meu Mural</Text>
        <Text style={styles.subtitulo}>Organize tarefas colaborativas em grupos</Text>
      </View>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, aba === "login" && styles.activeButton]}
          onPress={() => setAba("login")}
        >
          <Text style={aba === "login" ? styles.activeText : styles.inactiveText}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton, aba === "registro" && styles.activeButton]}
          onPress={() => setAba("registro")}
        >
          <Text style={aba === "registro" ? styles.activeText : styles.inactiveText}>
            Registro
          </Text>
        </TouchableOpacity>
      </View>

      {aba === "registro" && (
        <>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#B0B0B0"
            value={nome}
            onChangeText={setNome}
          />
        </>
      )}

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="seu@email.com"
        placeholderTextColor="#B0B0B0"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="senha ******"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={aba === "login" ? handleEntrar : handleRegistro}
      >
        <Text style={styles.textoBotao}>
          {aba === "login" ? "Entrar" : "Criar Conta"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: "#0A0A23",
    borderRadius: 10,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0A0A23",
  },
  subtitulo: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f4f4f4",
    borderRadius: 25,
  },
  switchButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  activeButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
  },
  inactiveText: {
    color: "#7a7a7a",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 40,
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    width: "80%",
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: "#000",
  },
  botao: {
    backgroundColor: "#0A0A23",
    width: "80%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
});
