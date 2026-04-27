import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDatasetsQuery = () => {
  return useQuery({
    queryKey: ["datasets"],
    queryFn: async () => {
      const res = await axios.get("/api/datasets/");
      return res?.data.data;
    },
  });
};
