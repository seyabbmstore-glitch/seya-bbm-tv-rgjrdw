
import React from 'react';
import { View, Text } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

interface SpeedIndicatorProps {
  uploadSpeed: number;
  downloadSpeed: number;
  showLabels?: boolean;
}

export default function SpeedIndicator({ 
  uploadSpeed, 
  downloadSpeed, 
  showLabels = true 
}: SpeedIndicatorProps) {
  const formatSpeed = (speed: number) => {
    if (speed < 1) {
      return `${(speed * 1000).toFixed(0)} KB/s`;
    }
    return `${speed.toFixed(1)} MB/s`;
  };

  return (
    <View style={commonStyles.rowCenter}>
      <View style={[commonStyles.speedIndicator, { marginRight: 8 }]}>
        <View style={commonStyles.rowCenter}>
          <Ionicons name="arrow-up" size={14} color={colors.secondary} />
          <View style={{ marginLeft: 4 }}>
            {showLabels && (
              <Text style={commonStyles.speedText}>Upload</Text>
            )}
            <Text style={commonStyles.speedValue}>
              {formatSpeed(uploadSpeed)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={commonStyles.speedIndicator}>
        <View style={commonStyles.rowCenter}>
          <Ionicons name="arrow-down" size={14} color={colors.primary} />
          <View style={{ marginLeft: 4 }}>
            {showLabels && (
              <Text style={commonStyles.speedText}>Download</Text>
            )}
            <Text style={commonStyles.speedValue}>
              {formatSpeed(downloadSpeed)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
