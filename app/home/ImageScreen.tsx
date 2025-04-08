import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { hp, showErrorToast, showSuccessToast, wp } from "@/helpers/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { theme } from "@/constants/theme";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Entypo, Ionicons, Octicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

const ImageScreen = () => {
  const router = useRouter();
  const img = useLocalSearchParams();
  const [status, setStatus] = useState<string>("loading");
  const url = img?.webformatURL as string;
  const fileName = url.split("/").pop();
  const imageURL = img?.webformatURL;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(
        String(imageURL),
        filePath
      );
      setStatus("");
      return uri;
    } catch (error: any) {
      console.log(error);
      Alert.alert("Image", error.message);
      return null;
    }
  };

  const onLoad = () => {
    setStatus("");
  };

  const getSize = () => {
    const aspectRatio = Number(img?.imageWidth) / Number(img?.imageHeight);
    const maxDeviceWidth = wp(92);
    let calculatedHeight = maxDeviceWidth / aspectRatio;
    let calculatedWidth = maxDeviceWidth;

    if (aspectRatio < 1) {
      // Portrait image
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return {
      height: calculatedHeight,
      width: calculatedWidth,
    };
  };

  const handleDownloadImage = async () => {
    setStatus("downloading");
    const uri = await downloadFile();
    if (uri) {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        try {
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync("Download", asset, false);
          showSuccessToast("Image saved to gallery!");
        } catch (error: any) {
          setStatus("");
          showErrorToast(error.message);
        }
      } else {
        Alert.alert(
          "Permission Required",
          "Media library permission is required to save images."
        );
      }
    }
  };

  const handleShareImage = async () => {
    setStatus("sharing");
    let uri = await downloadFile();
    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };

  return (
    <BlurView
      experimentalBlurMethod={
        Platform.OS === "android" ? "dimezisBlurView" : "none"
      }
      tint="dark"
      intensity={50}
      style={styles.container}
    >
      <View style={[getSize()]}>
        <View style={styles.loading}>
          {status === "loading" && (
            <ActivityIndicator size="large" color={"white"} />
          )}
        </View>
        <Image
          source={img?.webformatURL}
          transition={100}
          style={[styles.image, getSize()]}
          onLoad={onLoad}
        />
      </View>
      <View style={styles.Btns}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable onPress={() => router.back()} style={styles.button}>
            <Ionicons name="close" size={28} color={theme.color.white} />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          <Pressable onPress={handleDownloadImage} style={styles.button}>
            {status === "downloading" ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Octicons name="download" size={28} color={theme.color.white} />
            )}
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          <Pressable onPress={handleShareImage} style={styles.button}>
            {status === "sharing" ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Entypo name="share" size={28} color={theme.color.white} />
            )}
          </Pressable>
        </Animated.View>
      </View>
      <Toast />
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
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: "rgba(255,255, 255, 0.5)",
    borderColor: "rgba(255,255, 255, 0.5)",
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  Btns: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(4),
    gap: 44,
  },
  button: {
    height: hp(6),
    width: hp(6),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});
