import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getImageHeight, wp } from "../helpers/common";
import { theme } from "@/constants/theme";

const ImageCard = ({ img, index }: { img: any; index: number }) => {
  return (
    <Pressable
      style={[
        styles.imageWrapper,
        { marginLeft: index % 2 !== 0 ? wp(1.5) : 0 },
      ]}
    >
      <Image
        style={[
          styles.image,
          {
            height: getImageHeight(img.imageHeight, img.imageWidth),
          },
        ]}
        source={img?.webformatURL}
        transition={100}
      />
    </Pressable>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  imageWrapper: {
    backgroundColor: theme.color.grayBg,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    overflow: "hidden",
    marginBottom: wp(2),
  },
  image: {
    height: 300,
    width: "100%",
  },
});
