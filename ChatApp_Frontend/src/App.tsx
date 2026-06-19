import { Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./app/chat/Chat";
import ProfileSettingsPage from "./app/profile/ProfileSettingsPage";
import ProfilePage from "./app/profile/ProfilePage";
import LoginPage from "./app/Login/LoginPage";
import SignUpPage from "./app/SignUp/SignUpPage";
import ForgotPasswordPage from "./app/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./app/ResetPassword/ResetPasswordPage";
import VerifyOtpPage from "./app/VerifyOtp/VerifyOtpPage";
import WelcomePage from "./app/Home/WelcomePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LayoutShell } from "./components/layout/LayoutShell";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors position="bottom-right" />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        {/* Private routes with sidebar layout */}
        <Route
          element={
            <ProtectedRoute>
              <LayoutShell />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<WelcomePage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/profile" element={<ProfileSettingsPage />} />
          <Route path="/profile/:type/:profileId" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
