import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";

// Layout
import MainLayout from "./components/layout/MainLayout.jsx";
import LoadingSpinner from "./components/layout/LoadingSpinner.jsx";

// Hooks
import useUserQuery from "./hooks/queries/useUserQuery.js";

// Pages
import HomePage from "./pages/Home/HomePage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import ReportsPage from "./pages/Reports/ReportsPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";

export default function App() {
  const { data: user, isLoading } = useUserQuery();

  const toastConfig = {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    newestOnTop: false,
    closeOnClick: false,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "dark",
    transition: Slide,
  };

  if (isLoading) {
    return (
      <>
        <LoadingSpinner fullScreen={true} size="large" />
        <ToastContainer {...toastConfig} />
      </>
    );
  }

  return (
    <>
      {user ? (
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard/:datasetId" element={<DashboardPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
      <ToastContainer {...toastConfig} />
    </>
  );
}
