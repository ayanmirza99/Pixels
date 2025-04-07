import React, { forwardRef, useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { ColorFilterRow, CommonFilterRow, SectionView } from "./FilterView";
import { filtersData } from "@/constants/data";

const CustomBackDrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  }, [animatedIndex]);
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];
  return (
    <Animated.View style={containerStyle}>
      <BlurView
        tint="dark"
        intensity={2}
        style={StyleSheet.absoluteFill}
        experimentalBlurMethod={
          Platform.OS === "android" ? "dimezisBlurView" : "none"
        }
      />
    </Animated.View>
  );
};

const FiltersModal = forwardRef(
  ({ filters, setFilters, onClose, onApply, onReset, ...props }, ref) => {
    const snapPoints = useMemo(() => ["75%"], []);
    const sections = {
      order: (props) => <CommonFilterRow {...props} />,
      orientation: (props) => <CommonFilterRow {...props} />,
      type: (props) => <CommonFilterRow {...props} />,
      colors: (props) => <ColorFilterRow {...props} />,
    };
    return (
      <BottomSheetModal
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={CustomBackDrop}
        ref={ref}
        {...props}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.content}>
            <Text style={styles.filterText}>Fiters</Text>
            {Object.keys(sections).map((name, index) => {
              let sectionView = sections[name];
              return (
                <Animated.View
                  entering={FadeInDown.delay(index * 100 + 100)
                    .springify()
                    .damping(10)}
                  key={index}
                >
                  <SectionView
                    title={name}
                    content={sectionView({
                      data: filtersData[name],
                      filters,
                      filterName: name,
                      setFilters,
                      onClose,
                      onApply,
                      onReset,
                    })}
                  />
                </Animated.View>
              );
            })}
            <Animated.View
              entering={FadeInDown.delay(500)
                .springify()
                .damping(10)}
              style={styles.btns}
            >
              <Pressable onPress={onReset} style={styles.resetBtn}>
                <Text
                  style={[styles.btnText, { color: theme.color.neutral(0.8) }]}
                >
                  Reset
                </Text>
              </Pressable>
              <Pressable style={styles.applyBtn}>
                <Text
                  onPress={onApply}
                  style={[styles.btnText, { color: theme.color.white }]}
                >
                  Apply
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0, 0.5)",
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 0,
    gap: 15,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: 600,
    color: theme.color.neutral(0.8),
    marginBottom: 5,
  },
  btns: {
    gap: 10,
    flexDirection: "row",
    marginTop: -30,
  },
  applyBtn: {
    alignItems: "center",
    flex: 1,
    padding: 6,
    backgroundColor: theme.color.neutral(0.8),
    borderRadius: theme.radius.xs,
    borderCurve: "continuous",
  },
  resetBtn: {
    alignItems: "center",
    flex: 1,
    padding: 6,
    backgroundColor: theme.color.neutral(0.08),
    borderRadius: theme.radius.xs,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.color.grayBg,
  },
  btnText: {
    fontSize: wp(4.5),
  },
});

export default FiltersModal;
