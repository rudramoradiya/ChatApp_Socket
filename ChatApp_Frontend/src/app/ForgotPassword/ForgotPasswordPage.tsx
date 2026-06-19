import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { forgotPassword } from '../../api/authApi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

function ForgotPasswordPage() {
  const { setEmail } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <ForgotPasswordForm
      onSubmit={async (email) => {
        const result = await forgotPassword({ email });
        if (result?.devOtp) {
          toast.success(`DEV OTP: ${result.devOtp}`);
        }
        setEmail(email);
        navigate('/verify-otp', { state: { otpPurpose: 'reset' } });
      }}
      isDark={isDark}
      onBack={() => navigate('/login')}
    />
  );
}

export default ForgotPasswordPage; 