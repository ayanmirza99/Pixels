import { Dimensions } from "react-native";
import Toast from "react-native-toast-message";

const { height: deviceHeight, width: deviceWidth } = Dimensions.get("window");

export const wp = (percentage) => {
  return (percentage * deviceWidth) / 100;
};
export const hp = (percentage) => {
  return (percentage * deviceHeight) / 100;
};

export const getImageHeight = (height, width) => {
  if (height > width) {
    return 300;
  } else if (width > height) {
    return 250;
  } else {
    return 200;
  }
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const showSuccessToast = (message) => {
  Toast.show({
    type: "success",
    text1: message,
  });
};
export const showErrorToast = (message) => {
  Toast.show({
    type: "error",
    text1: message,
  });
};
