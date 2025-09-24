
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useGeminiChat } from '../hooks/useGeminiChat';

interface ChatBotProps {
  onClose: () => void;
}

export default function ChatBot({ onClose }: ChatBotProps) {
  const [inputText, setInputText] = useState('');
  const { messages, isLoading, sendMessage } = useGeminiChat();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      await sendMessage(inputText.trim());
      setInputText('');
      
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[commonStyles.row, { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
          <View style={commonStyles.rowCenter}>
            <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
            <Text style={[commonStyles.subtitle, { marginLeft: 8, marginBottom: 0 }]}>
              Seya Assistant
            </Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={[commonStyles.card, { alignItems: 'center' }]}>
              <Ionicons name="chatbubble-ellipses" size={48} color={colors.primary} />
              <Text style={[commonStyles.subtitle, { textAlign: 'center', marginTop: 16 }]}>
                Welcome to Seya Assistant!
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                Ask me anything about streaming, channels, uploads, or downloads.
              </Text>
            </View>
          )}

          {messages.map((message) => (
            <View key={message.id} style={{ marginBottom: 16 }}>
              {/* User message */}
              <View style={{
                backgroundColor: colors.primary,
                padding: 12,
                borderRadius: 16,
                alignSelf: 'flex-end',
                maxWidth: '80%',
                marginBottom: 8,
              }}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  {message.message}
                </Text>
              </View>

              {/* Bot response */}
              {message.response && (
                <View style={{
                  backgroundColor: colors.backgroundAlt,
                  padding: 12,
                  borderRadius: 16,
                  alignSelf: 'flex-start',
                  maxWidth: '80%',
                }}>
                  <Text style={{ color: colors.text, fontSize: 16 }}>
                    {message.response}
                  </Text>
                </View>
              )}

              {/* Loading indicator */}
              {!message.response && isLoading && (
                <View style={{
                  backgroundColor: colors.backgroundAlt,
                  padding: 12,
                  borderRadius: 16,
                  alignSelf: 'flex-start',
                  maxWidth: '80%',
                }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                    Typing...
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={{
          flexDirection: 'row',
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          alignItems: 'flex-end',
        }}>
          <TextInput
            style={[
              commonStyles.input,
              {
                flex: 1,
                marginBottom: 0,
                marginRight: 12,
                maxHeight: 100,
              }
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[
              buttonStyles.primary,
              {
                paddingHorizontal: 16,
                paddingVertical: 12,
                opacity: inputText.trim() ? 1 : 0.5,
              }
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
