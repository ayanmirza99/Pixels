import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Categories from "@/components/Categories";
import { API_CALL } from "../../api/index";
import ImageGrid from "@/components/ImageGrid";
import { debounce } from "lodash";
import FiltersModal from "@/components/FiltersModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const HomeScreen = () => {
  let params: any = { page: 1 };
  const [input, setInput] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const inputRef = useRef<TextInput>(null);
  const modalRef = useRef<BottomSheetModal>(null);
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const handleChangeCategory = (category: string | null) => {
    setActiveCategory(category);
    clearSearch();
    setImages([]);
    params = { ...params, category: category && category };
    fetchImages(params);
  };

  const fetchImages = async (params: any, append = false) => {
    try {
      let resp = await API_CALL(params);
      if (append) {
        setImages([...images, ...resp.hits]);
      } else {
        setImages(resp.hits);
      }
    } catch (error) {
      console.log("Something Went wrong: ", error);
    }
  };

  useEffect(() => {
    fetchImages(params);
  }, []);

  const handleSearch = (text: string) => {
    setInput(text);
    if (text && text.length > 2) {
      setImages([]);
      setActiveCategory(null);
      fetchImages({ ...params, q: text });
    }
    if (text === "") {
      inputRef.current?.clear();
      setActiveCategory(null);
      setImages([]);
      fetchImages(params);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);

  const clearSearch = () => {
    setInput("");
    inputRef.current?.clear();
  };

  const openFiltersModal = () => {
    modalRef?.current?.present();
  };
  const closeFiltersModal = () => {
    modalRef?.current?.close();
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.color.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ gap: 15 }}>
        <View style={styles.searchBar}>
          <View>
            <Feather name="search" size={22} color={theme.color.neutral(0.4)} />
          </View>
          <TextInput
            placeholder="Search for Images..."
            style={styles.searchField}
            ref={inputRef}
            onChangeText={handleTextDebounce}
          />
          {input && (
            <Pressable
              onPress={() => handleTextDebounce("")}
              style={styles.clearIcon}
            >
              <Ionicons
                name="close"
                size={22}
                color={theme.color.neutral(0.4)}
              />
            </Pressable>
          )}
        </View>
        <View>
          <Categories
            activeCategory={activeCategory}
            handleChange={handleChangeCategory}
          />
        </View>
        <View>{images.length > 0 && <ImageGrid data={images} />}</View>
      </ScrollView>
      <FiltersModal ref={modalRef} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    color: theme.color.neutral(0.9),
    fontWeight: 600,
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.color.grayBg,
    padding: 4,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  searchField: {
    flex: 1,
    marginLeft: wp(4),
  },
  clearIcon: {
    padding: 2,
    backgroundColor: theme.color.white,
    borderRadius: theme.radius.lg,
  },
});
