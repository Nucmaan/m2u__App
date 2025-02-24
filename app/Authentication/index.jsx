import { useNavigation } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MyHome2U</Text>
      <Text style={styles.subtitle}>
        Find your dream home easily. Login or Register to get started!
      </Text>

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('signup')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9', 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A3B5D', 
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7A7A7A', 
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#1A3B5D', 
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#F47C48', 
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});
