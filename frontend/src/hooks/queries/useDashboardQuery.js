import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useDashboardQuery = (datasetId) => {
  return useQuery({
    queryKey: ["dashboard", datasetId],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/analytics/${datasetId}/dashboard`);
        return res?.data.data;
      } catch {
        return null;
      }
    },
    enabled: !!datasetId,
  });
};

export default useDashboardQuery;
