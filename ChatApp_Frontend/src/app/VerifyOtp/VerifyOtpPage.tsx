import VerifyOtpForm from "../../components/auth/VerifyOtpForm";
import { verifyOTP, resendOTP } from "../../api/authApi";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../../socket/socket";
import { useTheme } from "@/contexts/ThemeContext";

function VerifyOtpPage() {
  const { email, setEmail, setToken, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const otpPurpose = location.state?.otpPurpose || null;
  const { isDark } = useTheme();


  return (
    <VerifyOtpForm
      onVerify={async (otp) => {
        if (!email) return;
        const response = await verifyOTP({ email, otp });
        if (otpPurpose === "signup") {
          setEmail(email);
          setToken(response.data.token);
          setUser(response.data.user)

          // ✅ Set token and connect socket
          socket.auth = { token: response?.data?.token };
          socket.connect();

          // ✅ Emit user online event
          socket.emit("user-online", { userId: response.data.user._id });
          
          navigate("/");
        } else if (otpPurpose === "reset") {
          navigate("/reset-password");
        }
      }}
      onResend={async () => {
        if (!email) return;
        await resendOTP({ email });
      }}
      isDark={isDark}
      onBack={() =>
        navigate(otpPurpose === "signup" ? "/signup" : "/forgot-password")
      }
    />
  );
}

export default VerifyOtpPage;
