import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useMessagesQuery = (datasetId) => {
  return useQuery({
    queryKey: ["messages", datasetId],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/chats/${datasetId}`);
        return res?.data.data;
      } catch {
        return null;
      }
    },
  });
};

export default useMessagesQuery;
