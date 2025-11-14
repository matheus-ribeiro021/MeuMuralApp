import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GruposScreen from "../src/screens/GruposScreen.jsx";
import LoginScreen from "../src/screens/LoginScreen.jsx";
import TarefasGrupoScreen from "../src/screens/TarefasGruposScreen.jsx";

const Stack = createNativeStackNavigator();

export default function index() {
  return (
    
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Grupos" component={GruposScreen} />
        <Stack.Screen name="TarefasGrupo" component={TarefasGrupoScreen} />
      </Stack.Navigator>
    
  );
}
