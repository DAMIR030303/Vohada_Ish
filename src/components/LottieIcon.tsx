/**
 * Lottie Animated Icons komponenti
 */

import LottieView from 'lottie-react-native';
import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export type LottieIconType =
  | 'loading'
  | 'success'
  | 'error'
  | 'heart'
  | 'bookmark'
  | 'search'
  | 'notification'
  | 'refresh'
  | 'empty'
  | 'checkmark'
  | 'warning'
  | 'location'
  | 'send'
  | 'download';

interface LottieIconProps {
  type: LottieIconType;
  size?: number;
  style?: ViewStyle;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  onAnimationFinish?: () => void;
  trigger?: boolean; // Trigger animation on change
}

// Lottie animation sources (using free animations from LottieFiles)
const animationSources = {
  loading: 'https://assets9.lottiefiles.com/packages/lf20_szlepvdj.json',
  success: 'https://assets9.lottiefiles.com/packages/lf20_lk80fpsm.json',
  error: 'https://assets9.lottiefiles.com/packages/lf20_khzniaya.json',
  heart: 'https://assets9.lottiefiles.com/packages/lf20_kxsd2ytq.json',
  bookmark: 'https://assets9.lottiefiles.com/packages/lf20_tno6cg2w.json',
  search: 'https://assets9.lottiefiles.com/packages/lf20_wp8h3qvq.json',
  notification: 'https://assets9.lottiefiles.com/packages/lf20_x62chJ.json',
  refresh: 'https://assets9.lottiefiles.com/packages/lf20_yq8gg8mi.json',
  empty: 'https://assets9.lottiefiles.com/packages/lf20_wd1udlcz.json',
  checkmark: 'https://assets9.lottiefiles.com/packages/lf20_jbrw3hcz.json',
  warning: 'https://assets9.lottiefiles.com/packages/lf20_alert.json',
  location: 'https://assets9.lottiefiles.com/packages/lf20_zrqthn6o.json',
  send: 'https://assets9.lottiefiles.com/packages/lf20_8wREpI.json',
  download: 'https://assets9.lottiefiles.com/packages/lf20_khfy8a6f.json',
};

export const LottieIcon: React.FC<LottieIconProps> = ({
  type,
  size = 50,
  style,
  autoPlay = true,
  loop = true,
  speed = 1,
  onAnimationFinish,
  trigger,
}) => {
  const animationRef = useRef<LottieView>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (trigger && animationRef.current && isLoaded) {
      animationRef.current.play();
    }
  }, [trigger, isLoaded]);

  const handleAnimationFinish = () => {
    onAnimationFinish?.();
  };

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      <LottieView
        ref={animationRef}
        source={{ uri: animationSources[type] }}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        style={styles.animation}
        onAnimationFinish={handleAnimationFinish}
        onAnimationLoaded={() => setIsLoaded(true)}
        resizeMode="contain"
      />
    </View>
  );
};

// Predefined animated icons with common configurations
export const AnimatedIcons = {
  Loading: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="loading" loop={true} {...props} />
  ),

  Success: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="success" loop={false} autoPlay={false} {...props} />
  ),

  Error: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="error" loop={false} autoPlay={false} {...props} />
  ),

  Heart: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="heart" loop={false} autoPlay={false} {...props} />
  ),

  Bookmark: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="bookmark" loop={false} autoPlay={false} {...props} />
  ),

  Search: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="search" loop={true} {...props} />
  ),

  Notification: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="notification" loop={false} autoPlay={false} {...props} />
  ),

  Refresh: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="refresh" loop={false} autoPlay={false} {...props} />
  ),

  Empty: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="empty" loop={true} size={120} {...props} />
  ),

  Checkmark: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="checkmark" loop={false} autoPlay={false} {...props} />
  ),

  Warning: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="warning" loop={false} autoPlay={false} {...props} />
  ),

  Location: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="location" loop={true} {...props} />
  ),

  Send: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="send" loop={false} autoPlay={false} {...props} />
  ),

  Download: (props: Omit<LottieIconProps, 'type'>) => (
    <LottieIcon type="download" loop={false} autoPlay={false} {...props} />
  ),
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});
