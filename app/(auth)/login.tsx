import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/auth';
import { colors } from '@/constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, enterDemoMode } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }
    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Pioneer Nurse</Text>
          <Text style={styles.subtitle}>
            Your TWU nursing study companion
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="you@twu.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            containerStyle={{ marginTop: 16 }}
          />
          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={{ marginTop: 24 }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/signup">
            <Text style={styles.link}>Sign Up</Text>
          </Link>
        </View>

        <Button
          title="Try Demo"
          onPress={enterDemoMode}
          variant="ghost"
          fullWidth
          style={{ marginTop: 16 }}
        />

        <Text style={styles.free}>Always free. Built for TWU BSN students.</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary[500],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary[500],
  },
  free: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 32,
  },
});
