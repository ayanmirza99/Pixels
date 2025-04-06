import React, { forwardRef, useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";

const CustomBackDrop = ({ animatedIndex, style }) => {
  const containerStyle = [StyleSheet.absoluteFill, style, styles.overlay];
  return (
    <View style={containerStyle}>
      <BlurView
        tint="dark"
        intensity={2}
        style={StyleSheet.absoluteFill}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : 'none'}
      />
    </View>
  );
};

const FiltersModal = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ["75%"], []);

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
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0, 0.5)",
  },
});

export default FiltersModal;
