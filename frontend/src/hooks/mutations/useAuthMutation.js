import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login Successful");
    },

    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useSignUpMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, password, confirmPassword }) => {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Registration successful");
    },

    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });
};
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/auth/logout");
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Logged out successfully");
    },

    onError: (error) => {
      console.error(error);
      toast.error("Logout failed");
    },
  });
};
