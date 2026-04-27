import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useUploadDatasetMutation = () => {
  return useMutation({
    mutationFn: async ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/datasets/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res?.data.data;
    },
    onSuccess: () => {
      localStorage.setItem("active_session", "true");
    },
  });
};

export default useUploadDatasetMutation;
