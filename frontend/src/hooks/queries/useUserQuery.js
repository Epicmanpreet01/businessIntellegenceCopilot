import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (
          typeof res.data === "string" &&
          res.data.includes("<!doctype html>")
        ) {
          return null;
        }
        return res?.data.data;
      } catch {
        return null;
      }
    },
    retry: false,
  });
};

export default useUserQuery;
