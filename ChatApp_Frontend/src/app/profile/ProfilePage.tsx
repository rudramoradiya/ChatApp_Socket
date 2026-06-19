import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserById } from "../../api/userApi";
import { getGroupById } from "../../api/groupChatApi";
import { AuthUser } from "../../types/auth";
import { Group } from "../../types/chat";
import UserProfile from "../../components/profile/UserProfile";
import GroupProfile from "../../components/profile/GroupProfile";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const ProfilePage: React.FC = () => {
  const { profileId, type } = useParams<{
    profileId: string;
    type: "user" | "group";
  }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<AuthUser | Group | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "member" | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId || !type) {
        setError("Invalid profile parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (type === "user") {
          const userData = await getUserById(profileId);

          setProfileData(userData);
        } else if (type === "group") {
          const { group, userRole: role } = await getGroupById(profileId);
          setProfileData(group);
          setUserRole(role);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, type]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <p className={`text-lg text-red-500`}>{error}</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Profile not found
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center p-4 border-b ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <Button onClick={handleBack} variant="ghost" size="sm" className="mr-3">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1
          className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {type === "user" ? "User Profile" : "Group Profile"}
        </h1>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto">
        {type === "user" ? (
          <UserProfile
            user={profileData as AuthUser}
            currentUser={currentUser}
            isDark={isDark}
          />
        ) : (
          <GroupProfile
            group={profileData as Group}
            currentUser={currentUser}
            userRole={userRole}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
