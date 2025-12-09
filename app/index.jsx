import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GruposScreen from "../src/screens/GruposScreen.jsx";
import LoginScreen from "../src/screens/LoginScreen.jsx";
import TarefasGrupoScreen from "../src/screens/TarefasGruposScreen.jsx";
import { AuthProvider, useAuth } from "../src/context/AuthContext.jsx";

const Stack = createNativeStackNavigator();

function Routes() {
  const { signed, loading } = useAuth();

  if (loading) return null; // ou um Splash

  return (
    <Stack.Navigator initialRouteName={signed ? "Grupos" : "Login"} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Grupos" component={GruposScreen} />
      <Stack.Screen name="TarefasGrupo" component={TarefasGrupoScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
  <Routes />
    </AuthProvider>
  );
}
