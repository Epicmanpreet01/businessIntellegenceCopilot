import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useMessageMutation = (datasetId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message) => {
      if (!datasetId) {
        throw new Error("Dataset ID is required");
      }

      const res = await axios.post(`/api/chats/${datasetId}`, message);
      return res?.data?.data;
    },

    onSuccess: (assistantMessage, userMessageContent) => {
      queryClient.setQueryData(["messages", datasetId], (oldData) => {
        const userMessage = {
          id: `temp-user-${Date.now()}`,
          role: "user",
          content: userMessageContent,
          created_at: new Date().toISOString(),
        };

        if (!oldData) {
          return {
            dataset_id: datasetId,
            messages: [userMessage, assistantMessage],
          };
        }

        return {
          ...oldData,
          messages: [...oldData.messages, userMessage, assistantMessage],
        };
      });
    },

    onError: (error) => {
      console.error(error?.response?.data || error.message);
    },
  });
};

export default useMessageMutation;
