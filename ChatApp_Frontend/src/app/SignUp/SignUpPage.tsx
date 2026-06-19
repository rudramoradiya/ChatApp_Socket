import { useAuth } from '../../contexts/AuthContext';
import SignUpForm from '../../components/auth/SignUpForm';
import { register } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

function SignUpPage() {
  const { setEmail } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <SignUpForm
      onSignup={async (email, password, name, phone) => {
        const result = await register({ email, password, username: name, phone });
        if (result?.devOtp) {
          toast.success(`DEV OTP: ${result.devOtp}`);
        }
        setEmail(email);
        navigate('/verify-otp', { state: { otpPurpose: 'signup' } });
      }}
      isDark={isDark}
      onSwitchToLogin={() => navigate('/login')}
    />
  );
}

export default SignUpPage; 