
import { useState, useEffect } from 'react';
import * as Network from 'expo-network';
import { NetworkSpeed } from '../types';

export const useNetworkSpeed = () => {
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>({
    uploadSpeed: 0,
    downloadSpeed: 0,
    lastUpdated: new Date(),
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  const measureSpeed = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      
      if (!networkState.isConnected) {
        setNetworkSpeed({
          uploadSpeed: 0,
          downloadSpeed: 0,
          lastUpdated: new Date(),
        });
        return;
      }

      // Simulate speed measurement (in a real app, you'd measure actual transfer speeds)
      const simulatedDownloadSpeed = Math.random() * 50 + 10; // 10-60 Mbps
      const simulatedUploadSpeed = Math.random() * 20 + 5;    // 5-25 Mbps

      setNetworkSpeed({
        uploadSpeed: simulatedUploadSpeed,
        downloadSpeed: simulatedDownloadSpeed,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.log('Error measuring network speed:', error);
    }
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring) {
      measureSpeed(); // Initial measurement
      interval = setInterval(measureSpeed, 3000); // Update every 3 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMonitoring]);

  return {
    networkSpeed,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    measureSpeed,
  };
};
