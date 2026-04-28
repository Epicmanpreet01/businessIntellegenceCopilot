import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useUploadDatasetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/datasets/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res?.data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("active_session", "true");
      if (data?.id) {
        localStorage.setItem("active_dataset_id", data.id);
      }
      queryClient.invalidateQueries({ queryKey: ["datasets"] });
    },
  });
};

export default useUploadDatasetMutation;
