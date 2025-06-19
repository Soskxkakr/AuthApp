import { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, TextInput as PaperTextInput, Button } from 'react-native-paper';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

type MainStackParamList = {
  Login: {};
  Signup: {};
  Home: {};
};

type LoginScreenProps = {
  route: RouteProp<MainStackParamList, 'Login'>;
  navigation: NavigationProp<MainStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { login } = useAuth();
  const theme = useTheme();
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | undefined>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const { success, error } = await login(userDetails.email, userDetails.password);

    if (!success) {
      setError(error);
      return;
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <Text style={styles.title}>Login</Text>

      <PaperTextInput
        style={styles.input}
        mode="outlined"
        label="Email"
        value={userDetails.email}
        onChangeText={(email) => setUserDetails({ ...userDetails, email })}
      />
      <PaperTextInput
        style={styles.input}
        mode="outlined"
        label="Password"
        secureTextEntry={!showPassword}
        value={userDetails.password}
        onChangeText={(password) => setUserDetails({ ...userDetails, password })}
        right={<PaperTextInput.Icon icon={showPassword ? "eye" : "eye-off"} onPress={() => setShowPassword(!showPassword)} />}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Button mode="contained" onPress={handleLogin} icon="login" buttonColor="#a583e6">
        Login
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate({ name: 'Signup', params: {} })}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#a583e6' },
  input: { marginBottom: 12 },
  link: { marginTop: 12, textAlign: 'center', color: '#a583e6' },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});
