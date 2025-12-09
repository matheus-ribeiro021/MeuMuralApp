import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn, signUp } = useAuth();
  
  const [aba, setAba] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEntrar = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }

    setLoading(true);
    
    try {
      const result = await signIn(email, senha);
      
      if (result.success) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          navigation.replace("Grupos");
        });
      } else {
        Alert.alert("Erro", result.error || "Não foi possível fazer login.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    
    try {

      const request = {
        nome: nome,
        email: email,
        senha:senha,
        status: 1
      }
      const result = await signUp(request);
      
      if (result.success) {
        Alert.alert("Sucesso!", "Conta criada com sucesso! Faça login para continuar.");
        setAba("login");
        setNome("");
        setSenha("");
      } else {
        Alert.alert("Erro", result.error || "Não foi possível criar a conta.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar criar a conta.");
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
        >
          <Text style={aba === "login" ? styles.activeText : styles.inactiveText}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchButton, aba === "registro" && styles.activeButton]}
          onPress={() => setAba("registro")}
          disabled={loading}
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
            editable={!loading}
          />
        </>
      )}

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="seu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="senha ******"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.botao, loading && styles.botaoDisabled]}
        onPress={aba === "login" ? handleEntrar : handleRegistro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>
            {aba === "login" ? "Entrar" : "Criar Conta"}
          </Text>
        )}
      </TouchableOpacity>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fff",
    padding: 20,
  },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logo: { width: 60, height: 60, backgroundColor: "#000", borderRadius: 10 },
  titulo: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  subtitulo: { fontSize: 13, color: "#777", marginTop: 4 },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 20,
    marginBottom: 20,
  },
  switchButton: { paddingVertical: 8, paddingHorizontal: 30 },
  activeButton: { 
    backgroundColor: "#fff", 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 20 
  },
  activeText: { color: "#000", fontWeight: "bold" },
  inactiveText: { color: "#777" },
  label: { 
    alignSelf: "flex-start", 
    marginLeft: 40,
    marginBottom: 5,
    fontWeight: "500",
  },
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
  botaoDisabled: {
    opacity: 0.6,
  },
  textoBotao: { color: "#fff", fontWeight: "bold" },
});
