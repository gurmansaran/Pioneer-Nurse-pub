import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/Colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface BriefSectionProps {
  number: number;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function BriefSection({ number, title, children, defaultOpen = false }: BriefSectionProps) {
  const [expanded, setExpanded] = useState(defaultOpen);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <Card style={styles.card} padding={0}>
      <TouchableOpacity
        onPress={toggle}
        style={styles.header}
        activeOpacity={0.7}
      >
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{number}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.chevron}>{expanded ? '\u25B2' : '\u25BC'}</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.body}>{children}</View>}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  chevron: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
});
