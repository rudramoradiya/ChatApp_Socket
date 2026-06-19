import { useTheme } from "@/contexts/ThemeContext";

const WelcomePage = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex-1 flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="text-center">
        <div
          className={`w-24 h-24 rounded-full ${
            isDark ? "bg-gray-800" : "bg-white"
          }
           flex items-center justify-center mb-4 mx-auto shadow-lg`}
        >
          <svg
            className={`w-12 h-12 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3
          className={`text-xl font-semibold mb-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome to ChatApp
        </h3>
        <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Select a chat to start messaging
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
