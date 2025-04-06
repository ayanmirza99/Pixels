import axios from "axios";

const API_KEY = "49645985-be74511a7cde81a889180cb16";

const API_URL = `https://pixabay.com/api/?key=${API_KEY}`;

const formatURL = (params) => {
  let url = API_URL + "&per_page=25&safesearch=false&editors_choice=false";
  if (!params) {
    return url;
  } else {
    let paramKeys = Object.keys(params);
    paramKeys.map((key) => {
      let value = key === "q" ? encodeURIComponent(params[key]) : params[key];
      url += `&${key}=${value}`;
    });
    return url;
  }
};

export const API_CALL = async (params) => {
  try {
    const resp = await axios.get(formatURL(params));
    return resp.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
