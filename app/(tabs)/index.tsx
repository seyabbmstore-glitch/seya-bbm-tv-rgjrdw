
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { useNetworkSpeed } from '../../hooks/useNetworkSpeed';
import { useAuth } from '../../hooks/useAuth';
import SpeedIndicator from '../../components/SpeedIndicator';
import ChatBot from '../../components/ChatBot';
import SimpleBottomSheet from '../../components/BottomSheet';

export default function HomeScreen() {
  const [showChatBot, setShowChatBot] = useState(false);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const { networkSpeed, isMonitoring, startMonitoring, stopMonitoring } = useNetworkSpeed();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, []);

  const handleUpload = () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to upload files.');
      return;
    }
    Alert.alert('Upload', 'Upload feature will be implemented here.');
  };

  const handleDownload = () => {
    Alert.alert('Download', 'Download feature will be implemented here.');
  };

  const handleAddChannel = () => {
    setShowAddChannel(true);
  };

  if (showChatBot) {
    return <ChatBot onClose={() => setShowChatBot(false)} />;
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <View>
            <Text style={commonStyles.title}>Seya BBM TV</Text>
            <Text style={commonStyles.textSecondary}>
              {isAuthenticated ? `Welcome back, ${user?.name}` : 'Live Streaming Platform'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowChatBot(true)}
            style={{
              backgroundColor: colors.primary,
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Network Speed */}
        <View style={[commonStyles.card, { marginBottom: 24 }]}>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <Text style={commonStyles.subtitle}>Network Speed</Text>
            <View style={{
              backgroundColor: isMonitoring ? colors.success : colors.textSecondary,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                {isMonitoring ? 'LIVE' : 'OFFLINE'}
              </Text>
            </View>
          </View>
          <SpeedIndicator
            uploadSpeed={networkSpeed.uploadSpeed}
            downloadSpeed={networkSpeed.downloadSpeed}
          />
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.section}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Quick Actions</Text>
          
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <TouchableOpacity
              style={[buttonStyles.primary, { flex: 1, marginRight: 8 }]}
              onPress={handleUpload}
            >
              <Ionicons name="cloud-upload" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Upload
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.secondary, { flex: 1, marginLeft: 8 }]}
              onPress={handleDownload}
            >
              <Ionicons name="cloud-download" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Download
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[buttonStyles.outline, { width: '100%' }]}
            onPress={handleAddChannel}
          >
            <Ionicons name="add-circle" size={20} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>
              Add Channel
            </Text>
          </TouchableOpacity>
        </View>

        {/* Live Channels Preview */}
        <View style={commonStyles.section}>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <Text style={commonStyles.subtitle}>Live Now</Text>
            <TouchableOpacity>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '600' }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((item) => (
              <View
                key={item}
                style={[
                  commonStyles.card,
                  {
                    width: 200,
                    marginRight: 16,
                    marginBottom: 0,
                  }
                ]}
              >
                <View style={{
                  backgroundColor: colors.backgroundAlt,
                  height: 100,
                  borderRadius: 12,
                  marginBottom: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="play-circle" size={40} color={colors.primary} />
                </View>
                <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                  Channel {item}
                </Text>
                <View style={commonStyles.rowCenter}>
                  <View style={{
                    backgroundColor: colors.danger,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginRight: 8,
                  }}>
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                      LIVE
                    </Text>
                  </View>
                  <Text style={commonStyles.textSecondary}>
                    {Math.floor(Math.random() * 1000) + 100} viewers
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Email Verification Notice */}
        {isAuthenticated && !user?.isEmailVerified && (
          <View style={[
            commonStyles.card,
            {
              backgroundColor: colors.warning,
              borderColor: colors.warning,
              marginTop: 24,
            }
          ]}>
            <View style={commonStyles.rowCenter}>
              <Ionicons name="warning" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', flex: 1 }}>
                Please verify your email address to access all features.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Channel Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showAddChannel}
        onClose={() => setShowAddChannel(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Add Channel
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
            Enter a web link to add a new streaming channel.
          </Text>
          {/* Add channel form will be implemented here */}
          <TouchableOpacity
            style={[buttonStyles.primary, { marginTop: 16 }]}
            onPress={() => setShowAddChannel(false)}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Add Channel
            </Text>
          </TouchableOpacity>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
