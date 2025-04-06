import { Dimensions } from "react-native";

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
