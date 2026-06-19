import { useNavigate } from "react-router-dom";
import ProfileSettings from "../../components/profile/ProfileSettings";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

function ProfileSettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div
      className={`h-screen w-full flex flex-col overflow-auto ${
        isDark ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <ProfileSettings
        isDark={isDark}
        onBackClick={() => navigate("/")}
        onLogout={logout}
      />
    </div>
  );
}

export default ProfileSettingsPage;
