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

export const useDatasetQuery = (datasetId) => {
  return useQuery({
    queryKey: ["dataset", datasetId],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/datasets/${datasetId}`);
        return res?.data.data;
      } catch {
        return null;
      }
    },
  });
};
