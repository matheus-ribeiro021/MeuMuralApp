import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [aba, setAba] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEntrar = () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace("Grupos"); // ← AGORA FUNCIONA
    });
  };

  const handleRegistro = () => {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    Alert.alert("Conta criada!", "Faça login para continuar.");
    setAba("login");
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

      <View style={styles.logoContainer}>
        <View style={styles.logo}></View>
        <Text style={styles.titulo}>Meu Mural</Text>
        <Text style={styles.subtitulo}>Organize suas tarefas em grupo</Text>
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
            value={nome}
            onChangeText={setNome}
          />
        </>
      )}

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="senha ******"
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

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logo: { width: 60, height: 60, backgroundColor: "#000", borderRadius: 10 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  subtitulo: { fontSize: 13, color: "#777", marginTop: 4 },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 20,
    marginBottom: 20,
  },
  switchButton: { paddingVertical: 8, paddingHorizontal: 30 },
  activeButton: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", borderRadius: 20 },
  activeText: { color: "#000", fontWeight: "bold" },
  inactiveText: { color: "#777" },
  label: { alignSelf: "flex-start", marginLeft: 40 },
  input: {
    width: "80%",
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  botao: {
    width: "80%",
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
});
