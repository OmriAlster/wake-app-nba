import React from 'react';
import { View, StyleSheet } from 'react-native';

const LiveIcon = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  // Toggle visibility every 500ms
  useInterval(() => {
    setIsVisible((prev) => !prev);
  }, 500);

  return (
    <View style={styles.container}>
      {isVisible && <View style={styles.circle} />}
    </View>
  );
};

import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'green',
  },
});

export default LiveIcon;
