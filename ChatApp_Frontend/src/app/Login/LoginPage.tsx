import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "../../components/auth/LoginForm";
import { login } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import socket from "../../socket/socket";
import { useTheme } from "@/contexts/ThemeContext";

function LoginPage() {
  const { setEmail, setToken, setUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <LoginForm
      onLogin={async (email, password) => {
        const response = await login({ email, password });
        console.log("Login response :", response);

        setEmail(email);
        setToken(response.data.token);
        setUser(response.data.user);

        // ✅ Set token and connect socket
        socket.auth = { token: response?.data?.token };
        console.log("Socket Token", socket.auth);

        socket.connect();

        // ✅ Emit user online event
        socket.emit("userOnline", { userId: response.data.user.id });

        navigate("/");
      }}
      isDark={isDark}
      onSwitchToSignUp={() => navigate("/signup")}
      onForgotPassword={() => navigate("/forgot-password")}
    />
  );
}

export default LoginPage;
