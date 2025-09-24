
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
import { UploadProgress, DownloadProgress } from '../../types';
import ProgressRing from '../../components/ProgressRing';
import SpeedIndicator from '../../components/SpeedIndicator';
import { useNetworkSpeed } from '../../hooks/useNetworkSpeed';

export default function TransfersScreen() {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [downloads, setDownloads] = useState<DownloadProgress[]>([]);
  const [activeTab, setActiveTab] = useState<'uploads' | 'downloads'>('uploads');
  const { networkSpeed, startMonitoring, stopMonitoring } = useNetworkSpeed();

  // Simulate some transfers
  useEffect(() => {
    startMonitoring();
    
    const sampleUploads: UploadProgress[] = [
      {
        id: '1',
        fileName: 'stream_recording_1.mp4',
        progress: 75,
        speed: 2.5,
        status: 'uploading',
      },
      {
        id: '2',
        fileName: 'channel_intro.mov',
        progress: 100,
        speed: 0,
        status: 'completed',
      },
      {
        id: '3',
        fileName: 'live_stream_backup.mp4',
        progress: 45,
        speed: 1.8,
        status: 'uploading',
      },
    ];

    const sampleDownloads: DownloadProgress[] = [
      {
        id: '1',
        fileName: 'tech_news_episode_5.mp4',
        progress: 90,
        speed: 5.2,
        status: 'downloading',
      },
      {
        id: '2',
        fileName: 'music_mix_2024.mp3',
        progress: 100,
        speed: 0,
        status: 'completed',
      },
      {
        id: '3',
        fileName: 'gaming_highlights.mp4',
        progress: 30,
        speed: 0,
        status: 'paused',
      },
    ];

    setUploads(sampleUploads);
    setDownloads(sampleDownloads);

    return () => stopMonitoring();
  }, []);

  const handleStartUpload = () => {
    Alert.alert('Upload', 'File picker will be implemented here.');
  };

  const handleStartDownload = () => {
    Alert.alert('Download', 'URL input dialog will be implemented here.');
  };

  const handlePauseResume = (id: string, type: 'upload' | 'download') => {
    if (type === 'upload') {
      setUploads(prev => prev.map(upload => 
        upload.id === id 
          ? { ...upload, status: upload.status === 'paused' ? 'uploading' : 'paused' }
          : upload
      ));
    } else {
      setDownloads(prev => prev.map(download => 
        download.id === id 
          ? { ...download, status: download.status === 'paused' ? 'downloading' : 'paused' }
          : download
      ));
    }
  };

  const handleCancel = (id: string, type: 'upload' | 'download') => {
    Alert.alert(
      'Cancel Transfer',
      'Are you sure you want to cancel this transfer?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            if (type === 'upload') {
              setUploads(prev => prev.filter(upload => upload.id !== id));
            } else {
              setDownloads(prev => prev.filter(download => download.id !== id));
            }
          },
        },
      ]
    );
  };

  const formatSpeed = (speed: number) => {
    if (speed === 0) return '0 MB/s';
    return `${speed.toFixed(1)} MB/s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'downloading':
        return colors.primary;
      case 'completed':
        return colors.success;
      case 'failed':
        return colors.danger;
      case 'paused':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const renderTransferItem = (item: UploadProgress | DownloadProgress, type: 'upload' | 'download') => (
    <View key={item.id} style={[commonStyles.card, { marginBottom: 16 }]}>
      <View style={[commonStyles.row, { marginBottom: 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
            {item.fileName}
          </Text>
          <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)} • {formatSpeed(item.speed)}
          </Text>
        </View>
        <ProgressRing
          progress={item.progress}
          size={50}
          color={getStatusColor(item.status)}
        />
      </View>

      <View style={commonStyles.row}>
        <View style={{ flex: 1 }}>
          <View style={{
            backgroundColor: colors.backgroundAlt,
            height: 6,
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <View style={{
              backgroundColor: getStatusColor(item.status),
              height: '100%',
              width: `${item.progress}%`,
              borderRadius: 3,
            }} />
          </View>
        </View>
        
        <View style={[commonStyles.rowCenter, { marginLeft: 16 }]}>
          {item.status !== 'completed' && item.status !== 'failed' && (
            <TouchableOpacity
              onPress={() => handlePauseResume(item.id, type)}
              style={{ marginRight: 12 }}
            >
              <Ionicons
                name={item.status === 'paused' ? 'play' : 'pause'}
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
          
          {item.status !== 'completed' && (
            <TouchableOpacity onPress={() => handleCancel(item.id, type)}>
              <Ionicons name="close" size={20} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <View>
            <Text style={commonStyles.title}>Transfers</Text>
            <Text style={commonStyles.textSecondary}>
              Manage your uploads and downloads
            </Text>
          </View>
          <SpeedIndicator
            uploadSpeed={networkSpeed.uploadSpeed}
            downloadSpeed={networkSpeed.downloadSpeed}
            showLabels={false}
          />
        </View>

        {/* Tab Selector */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: colors.backgroundAlt,
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
        }}>
          <TouchableOpacity
            style={[
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              },
              activeTab === 'uploads' && { backgroundColor: colors.background }
            ]}
            onPress={() => setActiveTab('uploads')}
          >
            <Text style={[
              { fontSize: 16, fontWeight: '600' },
              { color: activeTab === 'uploads' ? colors.text : colors.textSecondary }
            ]}>
              Uploads ({uploads.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              {
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              },
              activeTab === 'downloads' && { backgroundColor: colors.background }
            ]}
            onPress={() => setActiveTab('downloads')}
          >
            <Text style={[
              { fontSize: 16, fontWeight: '600' },
              { color: activeTab === 'downloads' ? colors.text : colors.textSecondary }
            ]}>
              Downloads ({downloads.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', marginBottom: 24, gap: 12 }}>
          <TouchableOpacity
            style={[buttonStyles.primary, { flex: 1 }]}
            onPress={handleStartUpload}
          >
            <Ionicons name="cloud-upload" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Start Upload
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[buttonStyles.secondary, { flex: 1 }]}
            onPress={handleStartDownload}
          >
            <Ionicons name="cloud-download" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Start Download
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transfers List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === 'uploads' ? (
            uploads.length > 0 ? (
              uploads.map(upload => renderTransferItem(upload, 'upload'))
            ) : (
              <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
                <Ionicons name="cloud-upload" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.subtitle, { textAlign: 'center', marginTop: 16 }]}>
                  No Uploads
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                  Start uploading files to see them here.
                </Text>
              </View>
            )
          ) : (
            downloads.length > 0 ? (
              downloads.map(download => renderTransferItem(download, 'download'))
            ) : (
              <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 40 }]}>
                <Ionicons name="cloud-download" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.subtitle, { textAlign: 'center', marginTop: 16 }]}>
                  No Downloads
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                  Start downloading files to see them here.
                </Text>
              </View>
            )
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
