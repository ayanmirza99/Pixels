import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { capitalize, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";

export const SectionView = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{capitalize(title)}</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFilterRow = ({
  data,
  filters,
  setFilters,
  filterName,
}: {
  data: string[];
  filterName: string;
  filters: { [key: string]: string } | null;
  setFilters: (value: { [key: string]: string }) => void;
}) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data?.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          let bgColor = isActive ? theme.color.neutral(0.75) : "white";
          let color = isActive ? theme.color.white : theme.color.neutral(0.8);
          return (
            <Pressable
              onPress={() => onSelect(item)}
              style={[styles.outlinedBtn, { backgroundColor: bgColor }]}
              key={index}
            >
              <Text style={[{ color: color }]}>{capitalize(item)}</Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilterRow = ({
  data,
  filters,
  setFilters,
  filterName,
}: {
  data: string[];
  filterName: string;
  filters: { [key: string]: string } | null;
  setFilters: (value: { [key: string]: string }) => void;
}) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data?.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          let borderColor = isActive ? theme.color.neutral(0.75) : "white";
          return (
            <Pressable onPress={() => onSelect(item)} key={index}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]}></View>
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: 500,
    color: theme.color.neutral(0.8),
  },
  flexRowWrap: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outlinedBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.color.grayBg,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  color: {
    height: 30,
    width: 46,
    borderRadius: theme.radius.sm - 3,
    borderCurve: "continuous",
  },
  colorWrapper: {
    padding: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    borderCurve: "continuous",
  },
});
