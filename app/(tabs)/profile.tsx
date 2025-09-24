
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
import { useAuth } from '../../hooks/useAuth';
import { useNetworkSpeed } from '../../hooks/useNetworkSpeed';
import SpeedIndicator from '../../components/SpeedIndicator';
import SimpleBottomSheet from '../../components/BottomSheet';

export default function ProfileScreen() {
  const { user, isAuthenticated, logout, verifyEmail, login, register } = useAuth();
  const { networkSpeed } = useNetworkSpeed();
  const [showVerification, setShowVerification] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

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
    Alert.alert('Add Channel', 'Channel addition feature will be implemented here.');
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }

    const result = await verifyEmail(verificationCode);
    if (result.success) {
      Alert.alert('Success', 'Email verified successfully!');
      setShowVerification(false);
      setVerificationCode('');
    } else {
      Alert.alert('Error', result.error || 'Verification failed');
    }
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!isLoginMode && !name.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    try {
      let result;
      if (isLoginMode) {
        result = await login(email, password);
      } else {
        result = await register(email, name, password);
      }

      if (result.success) {
        Alert.alert(
          'Success', 
          result.message || (isLoginMode ? 'Logged in successfully!' : 'Registration successful!')
        );
        setShowAuth(false);
        setEmail('');
        setPassword('');
        setName('');
      } else {
        Alert.alert('Error', result.error || 'Authentication failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={commonStyles.centerContent}>
        <Ionicons name="person-circle" size={80} color={colors.textSecondary} />
        <Text style={[commonStyles.title, { textAlign: 'center', marginTop: 16 }]}>
          Not Logged In
        </Text>
        <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8, marginBottom: 32 }]}>
          Please log in to access your profile and features.
        </Text>
        <TouchableOpacity 
          style={[buttonStyles.primary, { width: '80%' }]}
          onPress={() => setShowAuth(true)}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            Login / Register
          </Text>
        </TouchableOpacity>

        {/* Auth Bottom Sheet */}
        <SimpleBottomSheet
          isVisible={showAuth}
          onClose={() => setShowAuth(false)}
        >
          <View style={{ padding: 20 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
              {isLoginMode ? 'Login' : 'Register'}
            </Text>
            
            <TextInput
              style={commonStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {!isLoginMode && (
              <TextInput
                style={commonStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
              />
            )}
            
            <TextInput
              style={commonStyles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            
            <TouchableOpacity
              style={[buttonStyles.primary, { marginBottom: 16 }]}
              onPress={handleAuth}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                {isLoginMode ? 'Login' : 'Register'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsLoginMode(!isLoginMode)}
            >
              <Text style={{ color: colors.primary, fontSize: 14, textAlign: 'center' }}>
                {isLoginMode ? "Don't have an account? Register" : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </SimpleBottomSheet>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[commonStyles.card, { alignItems: 'center', marginBottom: 24 }]}>
          <View style={{
            backgroundColor: colors.primary,
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{ color: 'white', fontSize: 32, fontWeight: '700' }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          
          <Text style={[commonStyles.subtitle, { textAlign: 'center' }]}>
            {user?.name}
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 16 }]}>
            {user?.email}
          </Text>

          {!user?.isEmailVerified && (
            <TouchableOpacity
              style={[buttonStyles.outline, { paddingHorizontal: 16, paddingVertical: 8 }]}
              onPress={() => setShowVerification(true)}
            >
              <Ionicons name="mail" size={16} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '600' }}>
                Verify Email
              </Text>
            </TouchableOpacity>
          )}

          {user?.isEmailVerified && (
            <View style={[commonStyles.rowCenter, { backgroundColor: colors.success, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }]}>
              <Ionicons name="checkmark-circle" size={16} color="white" style={{ marginRight: 4 }} />
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                Email Verified
              </Text>
            </View>
          )}
        </View>

        {/* Network Speed */}
        <View style={[commonStyles.card, { marginBottom: 24 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Network Speed</Text>
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

        {/* Settings */}
        <View style={commonStyles.section}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Settings</Text>
          
          <TouchableOpacity style={[commonStyles.card, { marginBottom: 12 }]}>
            <View style={commonStyles.row}>
              <View style={commonStyles.rowCenter}>
                <Ionicons name="notifications" size={20} color={colors.text} style={{ marginRight: 12 }} />
                <Text style={commonStyles.text}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[commonStyles.card, { marginBottom: 12 }]}>
            <View style={commonStyles.row}>
              <View style={commonStyles.rowCenter}>
                <Ionicons name="shield-checkmark" size={20} color={colors.text} style={{ marginRight: 12 }} />
                <Text style={commonStyles.text}>Privacy & Security</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[commonStyles.card, { marginBottom: 12 }]}>
            <View style={commonStyles.row}>
              <View style={commonStyles.rowCenter}>
                <Ionicons name="help-circle" size={20} color={colors.text} style={{ marginRight: 12 }} />
                <Text style={commonStyles.text}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[buttonStyles.danger, { marginTop: 24, marginBottom: 40 }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Email Verification Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showVerification}
        onClose={() => setShowVerification(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Verify Email
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
            Enter the verification code sent to {user?.email}
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 16, fontSize: 12 }]}>
            For demo purposes, use code: 123456
          </Text>
          
          <TextInput
            style={commonStyles.input}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="Enter verification code"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
          />
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[buttonStyles.outline, { flex: 1 }]}
              onPress={() => setShowVerification(false)}
            >
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.primary, { flex: 1 }]}
              onPress={handleVerifyEmail}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Verify
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
