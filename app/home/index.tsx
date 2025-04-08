import {
  ActivityIndicator,
  NativeSyntheticEvent,
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
import { capitalize, hp, wp } from "@/helpers/common";
import Categories from "@/components/Categories";
import { API_CALL } from "../../api/index";
import ImageGrid from "@/components/ImageGrid";
import { debounce } from "lodash";
import FiltersModal from "@/components/FiltersModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { NativeScrollEvent } from "react-native";

const HomeScreen = () => {
  let params: any = { page: 1 };
  const [input, setInput] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ [key: string]: string } | null>(
    null
  );
  const inputRef = useRef<TextInput>(null);
  const modalRef = useRef<BottomSheetModal>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const handleChangeCategory = (category: string | null) => {
    setActiveCategory(category);
    clearSearch();
    setImages([]);
    params = { ...params, category: category && category, ...filters };
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
      params = { ...params, q: text, ...filters };
      fetchImages(params);
    }
    if (text === "") {
      inputRef.current?.clear();
      setActiveCategory(null);
      setImages([]);
      fetchImages({ page: 1, ...filters });
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

  const applyFilters = () => {
    if (filters) {
      setImages([]);
      params = { ...params, ...filters };
      if (activeCategory) params.category = activeCategory;
      if (input) params.q = input;
      fetchImages(params);
      closeFiltersModal();
    }
  };
  const resetFilters = () => {
    if (filters) {
      setFilters(null);
      setImages([]);
      if (activeCategory) params.category = activeCategory;
      if (input) params.q = input;
      fetchImages(params);
      closeFiltersModal();
    }
  };

  const removeFilter = (filter: string) => {
    if (!filters) return;
    const updatedFilters = Object.fromEntries(
      Object.entries(filters).filter(([key]) => key !== filter)
    );
    setFilters(updatedFilters);
    setImages([]);
    params = { ...updatedFilters, ...params };
    if (activeCategory) params.category = activeCategory;
    if (input) params.q = input;
    fetchImages(params);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;
    if (scrollOffset >= bottomPosition - 1) {
      if (!isEnd) {
        setIsEnd(true);
        params = { ...filters, page: params.page + 1 };
        if (activeCategory) params.category = activeCategory;
        if (input) params.q = input;
        fetchImages(params, true);
      }
    } else if (isEnd) {
      setIsEnd(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pixora</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.color.neutral(0.7)}
          />
        </Pressable>
      </View>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={10}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
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
        {filters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.appliedFilters}
          >
            {Object.keys(filters).map((fil, index) => (
              <View key={index} style={styles.filter}>
                {fil === "colors" ? (
                  <View
                    style={[
                      styles.colorFilter,
                      { backgroundColor: filters[fil] },
                    ]}
                  ></View>
                ) : (
                  <Text style={styles.filterTitle}>
                    {capitalize(filters[fil])}
                  </Text>
                )}
                <Pressable onPress={() => removeFilter(fil)}>
                  <Ionicons
                    name="close"
                    size={20}
                    color={theme.color.neutral(0.7)}
                  />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
        <View>{images.length > 0 && <ImageGrid data={images} />}</View>
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      </ScrollView>
      <FiltersModal
        ref={modalRef}
        {...({
          filters,
          setFilters,
          onClose: closeFiltersModal,
          onApply: applyFilters,
          onReset: resetFilters,
        } as any)}
      />
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
  appliedFilters: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filter: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.color.grayBg,
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
  filterTitle: {
    fontSize: hp(1.8),
    fontWeight: 600,
  },
  colorFilter: {
    height: 24,
    width: 46,
    borderRadius: theme.radius.sm - 3,
    borderCurve: "continuous",
  },
});
