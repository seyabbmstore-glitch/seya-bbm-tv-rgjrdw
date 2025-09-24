
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { Channel } from '../../types';
import SimpleBottomSheet from '../../components/BottomSheet';

export default function ChannelsScreen() {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'Tech News Live',
      url: 'https://example.com/tech-news',
      isLive: true,
      viewers: 1250,
      category: 'Technology',
      addedAt: new Date(),
    },
    {
      id: '2',
      name: 'Music Stream 24/7',
      url: 'https://example.com/music-stream',
      isLive: true,
      viewers: 850,
      category: 'Music',
      addedAt: new Date(),
    },
    {
      id: '3',
      name: 'Gaming Channel',
      url: 'https://example.com/gaming',
      isLive: false,
      viewers: 0,
      category: 'Gaming',
      addedAt: new Date(),
    },
  ]);

  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannelUrl, setNewChannelUrl] = useState('');
  const [newChannelName, setNewChannelName] = useState('');

  const handleAddChannel = () => {
    if (!newChannelUrl.trim() || !newChannelName.trim()) {
      Alert.alert('Error', 'Please enter both channel name and URL.');
      return;
    }

    const newChannel: Channel = {
      id: Date.now().toString(),
      name: newChannelName.trim(),
      url: newChannelUrl.trim(),
      isLive: Math.random() > 0.5,
      viewers: Math.floor(Math.random() * 2000),
      category: 'General',
      addedAt: new Date(),
    };

    setChannels(prev => [newChannel, ...prev]);
    setNewChannelUrl('');
    setNewChannelName('');
    setShowAddChannel(false);
    Alert.alert('Success', 'Channel added successfully!');
  };

  const handleRemoveChannel = (channelId: string) => {
    Alert.alert(
      'Remove Channel',
      'Are you sure you want to remove this channel?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setChannels(prev => prev.filter(channel => channel.id !== channelId));
          },
        },
      ]
    );
  };

  const handlePlayChannel = (channel: Channel) => {
    if (channel.isLive) {
      Alert.alert('Playing', `Now playing: ${channel.name}`);
    } else {
      Alert.alert('Offline', 'This channel is currently offline.');
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <View>
            <Text style={commonStyles.title}>Channels</Text>
            <Text style={commonStyles.textSecondary}>
              {channels.length} channels added
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddChannel(true)}
            style={[buttonStyles.primary, { paddingHorizontal: 16, paddingVertical: 8 }]}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Channels List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {channels.map((channel) => (
            <View key={channel.id} style={[commonStyles.card, { marginBottom: 16 }]}>
              <View style={[commonStyles.row, { marginBottom: 12 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                    {channel.name}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    {channel.category}
                  </Text>
                </View>
                <View style={commonStyles.rowCenter}>
                  <View style={{
                    backgroundColor: channel.isLive ? colors.danger : colors.textSecondary,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    marginRight: 8,
                  }}>
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                      {channel.isLive ? 'LIVE' : 'OFFLINE'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveChannel(channel.id)}
                    style={{ padding: 4 }}
                  >
                    <Ionicons name="trash" size={16} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[commonStyles.row, { alignItems: 'flex-end' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
                    {channel.url}
                  </Text>
                  {channel.isLive && (
                    <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                      {channel.viewers} viewers
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    buttonStyles.primary,
                    {
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      opacity: channel.isLive ? 1 : 0.5,
                    }
                  ]}
                  onPress={() => handlePlayChannel(channel)}
                >
                  <Ionicons name="play" size={16} color="white" style={{ marginRight: 4 }} />
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                    Play
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {channels.length === 0 && (
            <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
              <Ionicons name="tv" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.subtitle, { textAlign: 'center', marginTop: 16 }]}>
                No Channels Added
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                Add your first channel using the + button above.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Add Channel Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showAddChannel}
        onClose={() => setShowAddChannel(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Add New Channel
          </Text>
          
          <TextInput
            style={commonStyles.input}
            value={newChannelName}
            onChangeText={setNewChannelName}
            placeholder="Channel Name"
            placeholderTextColor={colors.textSecondary}
          />
          
          <TextInput
            style={commonStyles.input}
            value={newChannelUrl}
            onChangeText={setNewChannelUrl}
            placeholder="Channel URL (e.g., https://example.com/stream)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="url"
            autoCapitalize="none"
          />
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[buttonStyles.outline, { flex: 1 }]}
              onPress={() => setShowAddChannel(false)}
            >
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.primary, { flex: 1 }]}
              onPress={handleAddChannel}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Add Channel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
