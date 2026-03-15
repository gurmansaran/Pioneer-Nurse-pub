import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { colors } from '@/constants/Colors';
import type { StudyGroup } from '@/types';

export default function StudyGroupsScreen() {
  const { user } = useAuthStore();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('study_group_members')
      .select('study_groups(*)')
      .eq('user_id', user.id);
    if (data) {
      setGroups(data.map((d: any) => d.study_groups).filter(Boolean));
    }
  };

  const joinGroup = async () => {
    if (!inviteCode.trim() || !user) return;
    const { data: group, error: findErr } = await supabase
      .from('study_groups')
      .select('id')
      .eq('invite_code', inviteCode.trim())
      .single();

    if (findErr || !group) {
      Alert.alert('Not Found', 'No group with that invite code.');
      return;
    }

    const { error } = await supabase.from('study_group_members').insert({
      group_id: group.id,
      user_id: user.id,
    });

    if (error) {
      if (error.code === '23505') Alert.alert('Already Joined', "You're already in this group.");
      else Alert.alert('Error', error.message);
      return;
    }

    setInviteCode('');
    fetchGroups();
  };

  const createGroup = async () => {
    if (!newGroupName.trim() || !user) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase
      .from('study_groups')
      .insert({ name: newGroupName.trim(), invite_code: code, created_by: user.id })
      .select()
      .single();

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    await supabase.from('study_group_members').insert({
      group_id: data.id,
      user_id: user.id,
    });

    setNewGroupName('');
    setShowCreate(false);
    fetchGroups();
    Alert.alert('Group Created', `Share this invite code: ${code}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Study Groups</Text>
        <Text style={styles.subtitle}>Study with your TWU classmates</Text>

        {/* Join */}
        <Card style={styles.joinCard}>
          <Text style={styles.cardTitle}>Join a Group</Text>
          <View style={styles.joinRow}>
            <Input
              placeholder="Enter invite code"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
              containerStyle={{ flex: 1 }}
            />
            <Button title="Join" onPress={joinGroup} disabled={!inviteCode.trim()} style={{ marginLeft: 8 }} />
          </View>
        </Card>

        {/* Create */}
        {showCreate ? (
          <Card style={styles.createCard}>
            <Text style={styles.cardTitle}>Create a Group</Text>
            <Input
              placeholder="Group name (e.g., Pharm Study Crew)"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <View style={styles.createButtons}>
              <Button title="Cancel" variant="ghost" onPress={() => setShowCreate(false)} />
              <Button title="Create" onPress={createGroup} disabled={!newGroupName.trim()} />
            </View>
          </Card>
        ) : (
          <Button
            title="Create New Group"
            variant="outline"
            onPress={() => setShowCreate(true)}
            fullWidth
            style={{ marginTop: 12 }}
          />
        )}

        {/* Groups List */}
        <Text style={styles.sectionTitle}>Your Groups</Text>
        {groups.length === 0 ? (
          <Text style={styles.emptyText}>No groups yet. Join or create one!</Text>
        ) : (
          groups.map(group => (
            <Card key={group.id} style={styles.groupCard} padding={14}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupCode}>Code: {group.invite_code}</Text>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 4, marginBottom: 20 },
  joinCard: { marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  joinRow: { flexDirection: 'row', alignItems: 'flex-end' },
  createCard: { marginTop: 12 },
  createButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 24, marginBottom: 12 },
  emptyText: { fontSize: 14, color: colors.textTertiary, fontStyle: 'italic' },
  groupCard: { marginBottom: 8 },
  groupName: { fontSize: 16, fontWeight: '600', color: colors.text },
  groupCode: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
