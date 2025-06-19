import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth, AuthProvider } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SignupScreen from './src/screens/SignupScreen';

type Props = {
  navigation: any;
  route: any;
};

const LoginScreenComponent: React.FC<Props> = LoginScreen;
const HomeScreenComponent: React.FC<Props> = HomeScreen;
const SignupScreenComponent: React.FC<Props> = SignupScreen;

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      { user ? (
        <Stack.Screen name="Home" component={HomeScreenComponent} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreenComponent} />
          <Stack.Screen name="Signup" component={SignupScreenComponent} />
        </>
      )}
    </Stack.Navigator>  
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#a583e6" />
        <AppNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
