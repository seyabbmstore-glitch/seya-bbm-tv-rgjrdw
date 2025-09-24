
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
} from 'react-native';
import { colors } from '../styles/commonStyles';

interface SimpleBottomSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onClose?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Snap positions for the bottom sheet
const SNAP_POINTS = {
  HALF: SCREEN_HEIGHT * 0.5,
  FULL: SCREEN_HEIGHT * 0.8,
  CLOSED: SCREEN_HEIGHT,
};

const SimpleBottomSheet: React.FC<SimpleBottomSheetProps> = ({
  children,
  isVisible = false,
  onClose
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [currentSnapPoint, setCurrentSnapPoint] = useState(SNAP_POINTS.HALF);

  useEffect(() => {
    if (isVisible) {
      setCurrentSnapPoint(SNAP_POINTS.HALF);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT - SNAP_POINTS.HALF,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setCurrentSnapPoint(SNAP_POINTS.CLOSED);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, translateY, backdropOpacity]);

  const handleBackdropPress = () => {
    onClose?.();
  };

  const snapToPoint = (point: number) => {
    setCurrentSnapPoint(point);
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT - point,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Create pan responder for gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        // Start gesture
      },
      onPanResponderMove: (evt, gestureState) => {
        const currentBasePosition = SCREEN_HEIGHT - currentSnapPoint;
        const intendedPosition = currentBasePosition + gestureState.dy;
        
        const minPosition = SCREEN_HEIGHT - SNAP_POINTS.FULL;
        const maxPosition = SCREEN_HEIGHT;
        
        const clampedPosition = Math.max(minPosition, Math.min(maxPosition, intendedPosition));
        translateY.setValue(clampedPosition);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const currentBasePosition = SCREEN_HEIGHT - currentSnapPoint;
        const intendedPosition = currentBasePosition + gestureState.dy;
        
        // Determine target snap point based on velocity and position
        let targetSnapPoint = SNAP_POINTS.HALF;
        
        if (gestureState.vy > 1) {
          // Fast downward swipe - close
          onClose?.();
          return;
        } else if (gestureState.vy < -1) {
          // Fast upward swipe - full
          targetSnapPoint = SNAP_POINTS.FULL;
        } else {
          // Slow movement - snap to nearest
          const currentPosition = SCREEN_HEIGHT - intendedPosition;
          if (currentPosition < SNAP_POINTS.HALF * 0.7) {
            onClose?.();
            return;
          } else if (currentPosition > SNAP_POINTS.HALF * 1.3) {
            targetSnapPoint = SNAP_POINTS.FULL;
          } else {
            targetSnapPoint = SNAP_POINTS.HALF;
          }
        }
        
        snapToPoint(targetSnapPoint);
      },
    })
  ).current;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropOpacity }
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />

          <View style={styles.contentContainer}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

SimpleBottomSheet.displayName = 'SimpleBottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  bottomSheet: {
    height: SNAP_POINTS.FULL,
    backgroundColor: colors.background || '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.grey || '#cccccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});

export default SimpleBottomSheet;
