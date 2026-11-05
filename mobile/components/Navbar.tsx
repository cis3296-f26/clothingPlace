
import { ComponentRef, useEffect, useRef } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export type TabName = 'Home' | 'Discover' | 'Wishlist' | 'Profile';

type IconProps = {
  color: string;
  size?: number;
};

type NavbarProps = {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
};

// Home icon
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

// Discover icon
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

// Wishlist icon
function WishlistIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.8 8.6c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Profile icon
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

const TABS: {
  name: TabName;
  Icon: (props: IconProps) => React.JSX.Element;
}[] = [
  { name: 'Home', Icon: HomeIcon },
  { name: 'Discover', Icon: SearchIcon },
  { name: 'Wishlist', Icon: WishlistIcon },
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

export default function Navbar({
  activeTab,
  onTabChange,
}: NavbarProps) {
  const activeIndex = TABS.findIndex((tab) => tab.name === activeTab);
  const highlightX = useRef(new Animated.Value(activeIndex * TAB_WIDTH)).current;

  const pillRef = useRef<ComponentRef<typeof View>>(null);
  const pillLeft = useRef(0);
  const currentIndex = useRef(activeIndex);
  const onTabChangeRef = useRef(onTabChange);

  onTabChangeRef.current = onTabChange;

  // Keep the animated highlight synchronized with the selected screen.
  useEffect(() => {
    const index = Math.max(
      0,
      TABS.findIndex((tab) => tab.name === activeTab),
    );

    currentIndex.current = index;

    Animated.spring(highlightX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [activeTab, highlightX]);

  const goToTab = (index: number) => {
    const safeIndex = Math.round(clamp(index, 0, TABS.length - 1));

    currentIndex.current = safeIndex;
    onTabChangeRef.current(TABS[safeIndex].name);

    Animated.spring(highlightX, {
      toValue: safeIndex * TAB_WIDTH,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const offsetForTouch = (pageX: number) =>
    clamp(
      pageX - pillLeft.current - PILL_PADDING - TAB_WIDTH / 2,
      0,
      MAX_OFFSET,
    );

  // Preserve the original swipeable navigation animation.
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        Math.abs(gesture.dx) > 8 &&
        Math.abs(gesture.dx) > Math.abs(gesture.dy),

      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: () => {
        highlightX.stopAnimation();
      },

      onPanResponderMove: (_, gesture) => {
        const offset = offsetForTouch(gesture.moveX);
        highlightX.setValue(offset);

        const nearest = Math.round(offset / TAB_WIDTH);

        if (nearest !== currentIndex.current) {
          currentIndex.current = nearest;
          onTabChangeRef.current(TABS[nearest].name);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        goToTab(
          Math.round(offsetForTouch(gesture.moveX) / TAB_WIDTH),
        );
      },

      onPanResponderTerminate: () => {
        goToTab(currentIndex.current);
      },
    }),
  ).current;

  return (
    <View
      ref={pillRef}
      style={styles.navbar}
      onLayout={() => {
        pillRef.current?.measureInWindow((x) => {
          pillLeft.current = x;
        });
      }}
      accessibilityRole="tablist"
      {...panResponder.panHandlers}
    >
      <Animated.View
        style={[
          styles.highlight,
          { transform: [{ translateX: highlightX }] },
        ]}
      />

      {TABS.map(({ name, Icon }, index) => {
        const active = activeTab === name;
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
              style={[
                styles.navText,
                { color },
                active && styles.activeText,
              ]}
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
