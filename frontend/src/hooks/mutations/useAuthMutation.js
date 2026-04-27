import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      return res?.data.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login Successful");
      navigate("/");
    },

    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useSignUpMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, password, confirmPassword }) => {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        confirm_password: confirmPassword,
      });

      return res?.data.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
      toast.success("Registration successful");
    },

    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/auth/logout");
      return res?.data.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/login");
      toast.success("Logged out successfully");
    },

    onError: (error) => {
      console.error(error);
      toast.error("Logout failed");
    },
  });
};
