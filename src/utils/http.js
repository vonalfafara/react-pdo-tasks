import axios from "axios";

function useApi() {
  return axios.create({
    baseURL: import.meta.env.VITE_API,
  });
}

export default useApi;
