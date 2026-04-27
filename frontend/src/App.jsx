import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";

// Layout & Auth
import MainLayout from "./components/layout/MainLayout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// Pages
import HomePage from "./pages/Home/HomePage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import ReportsPage from "./pages/Reports/ReportsPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";

export default function App() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/chat" element={<div>Chat Page placeholder</div>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </>
  );
}
