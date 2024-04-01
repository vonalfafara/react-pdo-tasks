import axios from "axios";

function useApi() {
  return axios.create({
    baseURL: import.meta.env.VITE_API,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

export default useApi;
