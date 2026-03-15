import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/Colors';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pioneer Nurse</Text>
      <Text style={styles.subtitle}>v1.0.0</Text>
      <Text style={styles.info}>
        Built with love for TWU BSN students.{'\n'}
        Always free. No ads. No subscriptions.
      </Text>
      <Text style={styles.credit}>Built by Gurman</Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary[500],
  },
  subtitle: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 4,
  },
  info: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 22,
  },
  credit: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 24,
  },
});
