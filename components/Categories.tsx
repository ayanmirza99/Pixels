import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { categoriesList } from "../constants/data";
import { wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Animated, { FadeInRight } from "react-native-reanimated";

const Categories = ({
  activeCategory,
  handleChange,
}: {
  activeCategory: string | null;
  handleChange: (arg: string | null) => void;
}) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.list}
      showsHorizontalScrollIndicator={false}
      data={categoriesList}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          title={item}
          isActive={activeCategory === item}
          handleChange={handleChange}
          index={index}
        />
      )}
    />
  );
};

const CategoryItem = ({
  title,
  isActive,
  handleChange,
  index,
}: {
  title: string;
  isActive: boolean;
  handleChange: (arg: string | null) => void;
  index: number;
}) => {
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 140)
        .duration(800)
        .springify()
        .damping(14)}
    >
      <Pressable
        onPress={() => handleChange(isActive ? null : title)}
        style={[
          styles.category,
          {
            backgroundColor: isActive
              ? theme.color.grayBg
              : theme.color.neutral(0.001),
          },
        ]}
      >
        <Text style={[styles.categoryTitle]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 8,
    paddingHorizontal: wp(4),
  },
  category: {
    padding: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.color.grayBg,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  categoryTitle: {
    fontSize: wp(3.4),
    fontWeight: 500,
  },
});

export default Categories;
