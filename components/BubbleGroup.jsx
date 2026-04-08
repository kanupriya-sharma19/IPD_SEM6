import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function BubbleGroup() {
  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.bubble, styles.bubble1]} />
      <Animated.View style={[styles.bubble, styles.bubble2]} />
      <Animated.View style={[styles.bubble, styles.bubble3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    padding: 0,
  },
  bubble: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#rgba(109,93,232,0.85)',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  bubble1: {
    top: -74,
    left: 114,
  },
  bubble2: {
    top: -44,
    left: -4,
  },
  bubble3: {
    top: 14,
    left: -67,
  },
});
