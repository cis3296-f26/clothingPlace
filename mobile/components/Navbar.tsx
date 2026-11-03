import { ComponentRef, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type IconProps = {
  color: string;
  size?: number;
};

// Simple line icons for the tabs
function HomeIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11l9-7.5 9 7.5M5 9.5V20h5v-6h4v6h5V9.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SearchIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={6.5} stroke={color} strokeWidth={1.75} />
      <Path
        d="M16 16l4.5 4.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ProfileIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.75} />
      <Path
        d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </Svg>
  );
}

type TabName = 'Home' | 'Discover' | 'Profile';

const TABS: { name: TabName; Icon: (props: IconProps) => React.JSX.Element }[] =
  [
    { name: 'Home', Icon: HomeIcon },
    { name: 'Discover', Icon: SearchIcon },
    { name: 'Profile', Icon: ProfileIcon },
  ];

const ACTIVE_COLOR = '#111111';
const INACTIVE_COLOR = '#9a9a9a';
const ICON_SIZE = 20;
const TAB_WIDTH = 76;
const PILL_PADDING = 4;
const MAX_OFFSET = TAB_WIDTH * (TABS.length - 1);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Where the grey highlight sits, and where the pill is on screen
  const highlightX = useRef(new Animated.Value(0)).current;
  const pillRef = useRef<ComponentRef<typeof View>>(null);
  const pillLeft = useRef(0);
  const currentIndex = useRef(0);

  // Move the highlight to a tab and make it the active one
  const goToTab = (index: number) => {
    currentIndex.current = index;
    setActiveIndex(index);
    Animated.spring(highlightX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  // Turn a finger position into the highlight position, clamped to the pill
  const offsetForTouch = (pageX: number) =>
    clamp(pageX - pillLeft.current - PILL_PADDING - TAB_WIDTH / 2, 0, MAX_OFFSET);

  // Dragging a finger across the pill slides the highlight with it
  const panResponder = useRef(
    PanResponder.create({
      // Only take over from the tab buttons once it's clearly a sideways drag
      onMoveShouldSetPanResponderCapture: (_, g) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => highlightX.stopAnimation(),
      onPanResponderMove: (_, g) => {
        const offset = offsetForTouch(g.moveX);
        highlightX.setValue(offset);

        // Update the active tab as the highlight passes over it
        const nearest = Math.round(offset / TAB_WIDTH);
        if (nearest !== currentIndex.current) {
          currentIndex.current = nearest;
          setActiveIndex(nearest);
        }
      },
      onPanResponderRelease: (_, g) =>
        goToTab(Math.round(offsetForTouch(g.moveX) / TAB_WIDTH)),
      onPanResponderTerminate: () => goToTab(currentIndex.current),
    }),
  ).current;

  return (
    <View
      ref={pillRef}
      style={styles.navbar}
      onLayout={() =>
        pillRef.current?.measureInWindow((x) => {
          pillLeft.current = x;
        })
      }
      accessibilityRole="tablist"
      {...panResponder.panHandlers}
    >
      <Animated.View
        style={[styles.highlight, { transform: [{ translateX: highlightX }] }]}
      />

      {TABS.map(({ name, Icon }, index) => {
        const active = activeIndex === index;
        const color = active ? ACTIVE_COLOR : INACTIVE_COLOR;

        return (
          <Pressable
            key={name}
            style={({ pressed }) => [
              styles.navButton,
              pressed && styles.navButtonPressed,
            ]}
            onPress={() => goToTab(index)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={name}
          >
            <Icon color={color} size={ICON_SIZE} />
            <Text
              style={[styles.navText, { color }, active && styles.activeText]}
            >
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Small floating pill
  navbar: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: PILL_PADDING,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  // The grey bubble behind the active tab
  highlight: {
    position: 'absolute',
    top: PILL_PADDING,
    bottom: PILL_PADDING,
    left: PILL_PADDING,
    width: TAB_WIDTH,
    borderRadius: 22,
    backgroundColor: '#f2f2f2',
  },
  navButton: {
    width: TAB_WIDTH,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 22,
  },
  navButtonPressed: {
    opacity: 0.6,
  },
  navText: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  activeText: {
    fontWeight: '700',
  },
});
