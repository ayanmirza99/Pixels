import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { hp, wp } from "../helpers/common";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "../constants/theme";
import React from "react";

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={require("../assets/images/image (1).png")}
        resizeMode="cover"
        style={styles.bgImg}
      />
      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.5)",
            "white",
            "white",
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />
        <View style={styles.contentContainer}>
          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={styles.title}
          >
            Pixels
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(500).springify()}
            style={styles.tagline}
          >
            Every Pixel Tells A Story
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Pressable style={styles.Btn}>
              <Text style={styles.btnText}>Explore</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImg: {
    height: hp(100),
    width: wp(98),
    left: "1%",
    position: "absolute",
  },
  gradient: {
    width: wp(100),
    height: hp(66),
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 14,
    marginBottom: hp(16),
  },
  title: {
    fontSize: hp(7),
    color: theme.color.neutral(0.9),
    fontWeight: 700,
  },
  tagline: {
    fontSize: hp(2),
    letterSpacing: 1,
    fontWeight: 500,
  },
  Btn: {
    backgroundColor: theme.color.neutral(0.9),
    padding: 16,
    paddingHorizontal: 90,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  btnText: {
    fontSize: hp(2),
    color: theme.color.white,
    fontWeight: 600,
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
