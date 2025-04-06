import { StyleSheet, Text, View } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import React from "react";
import ImageCard from "./ImageCard";
import { wp } from "@/helpers/common";

const ImageGrid = ({ data }: { data: any[] }) => {
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={data}
        numColumns={2}
        contentContainerStyle={styles.listContainerStyle}
        renderItem={({ item, index }) => <ImageCard img={item} index={index} />}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
    marginBottom: wp(14),
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  },
});
