import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDatasetsQuery = () => {
  return useQuery({
    queryKey: ["datasets"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/datasets/");
        return res?.data.data;
      } catch {
        return null;
      }
    },
  });
};
