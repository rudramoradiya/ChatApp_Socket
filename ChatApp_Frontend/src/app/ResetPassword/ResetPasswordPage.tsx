import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import { resetPassword } from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

function ResetPasswordPage() {
  const { email } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <ResetPasswordForm
      onSubmit={async (password, confirmPassword) => {
        if (!email) return;
        await resetPassword({ email, newPassword: password, confirmPassword });
        navigate('/login');
      }}
      isDark={isDark}
      onBack={() => navigate('/login')}
    />
  );
}

export default ResetPasswordPage; 