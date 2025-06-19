import { Text, StyleSheet } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();

  const handleLogout = () => {
    logout(user!.email);
  };

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <Text style={styles.title}>Welcome, {user?.name || ''}!</Text>
      <Text style={styles.subtitle}>{user?.email || ''}</Text>

      <Button mode="contained" onPress={handleLogout} icon="logout" buttonColor={theme.colors.error}>
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
});
