import { Button, Platform, StyleSheet } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { wp } from "@/helpers/common";
import { useLocalSearchParams, useRouter } from "expo-router";

const ImageScreen = () => {
  const router = useRouter();
  const img = useLocalSearchParams();
  console.log(img);
  
  return (
    <BlurView
      experimentalBlurMethod={
        Platform.OS === "android" ? "dimezisBlurView" : "none"
      }
      tint="dark"
      intensity={30}
      style={styles.container}
    >
      <Button title="Back" onPress={() => router.back()} />
    </BlurView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
