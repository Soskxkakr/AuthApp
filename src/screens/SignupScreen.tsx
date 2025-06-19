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

type SignupScreenProps = {
  route: RouteProp<MainStackParamList, 'Signup'>;
  navigation: NavigationProp<MainStackParamList, 'Signup'>;
};

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const { signup } = useAuth();
  const theme = useTheme();
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    const { success, errors } = await signup(userDetails.name, userDetails.email, userDetails.password);
    
    if (!success) {
      setErrors(errors!);
      return;
    }

    setErrors([]);
    setUserDetails({
        name: '',
        email: '',
        password: '',
    })
  };

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <Text style={styles.title}>Sign Up</Text>

      <PaperTextInput 
        mode="outlined"
        style={styles.input}
        label="Name"
        value={userDetails.name}
        onChangeText={(name) => setUserDetails({ ...userDetails, name })}
      />
      <PaperTextInput 
        mode="outlined"
        style={styles.input}
        label="Email"
        value={userDetails.email}
        onChangeText={(email) => setUserDetails({ ...userDetails, email })}
      />
      <PaperTextInput
        mode="outlined"
        style={styles.input}
        label="Password"
        secureTextEntry={!showPassword}
        value={userDetails.password}
        onChangeText={(password) => setUserDetails({ ...userDetails, password })}
        right={<PaperTextInput.Icon icon={showPassword ? "eye" : "eye-off"} onPress={() => setShowPassword(!showPassword)} />}
      />

      {errors.length > 0 && errors.map((error, idx) => <Text key={idx} style={styles.error}>{error}</Text>)}

      <Button mode="contained" onPress={handleSignup} icon="account-plus" buttonColor="#a583e6">
        Sign Up
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate({ name: 'Login', params: {} })}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#a583e6' },
  input: { marginBottom: 12 },
  error: { color: 'red', marginBottom: 12, marginStart: 12 },
  link: { marginTop: 12, textAlign: 'center', color: '#a583e6' },
});
