import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../schema/AuthSchema";
import { z } from "zod";
import { toast } from 'sonner';

interface ResetPasswordFormProps {
  onSubmit: (password: string, confirmPassword: string) => void;
  isDark: boolean;
  onBack: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit, isDark, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onFormSubmit = async (data: ResetPasswordInputs) => {
    setIsLoading(true);
    try {
      await onSubmit(data.password, data.confirmPassword);
      toast.success('Password reset successful');
    } catch (error: any) {
      toast.error(error.response.data.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'} px-4`}>
      <div className={`max-w-md w-full space-y-8 ${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-2xl`}>
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Reset Password</h2>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Enter your new password below</p>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                // value={password}
                // onChange={e => setPassword(e.target.value)}
                {...register("password")}
                required
                className={`w-full px-4 py-3 pr-12 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              // value={confirmPassword}
              // onChange={e => setConfirmPassword(e.target.value)}
              {...register("confirmPassword")}
              required
              className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading || isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onBack}
            className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm; 