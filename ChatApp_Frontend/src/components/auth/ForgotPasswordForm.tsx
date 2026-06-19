import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../schema/AuthSchema";
import { z } from "zod";
import { toast } from 'sonner';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  isDark: boolean;
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit, isDark, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);

  type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onFormSubmit = async (data: ForgotPasswordInputs) => {
    setIsLoading(true);
    try {
      await onSubmit(data.email);
      toast.success('Reset OTP sent successfully');
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Reset OTP failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'} px-4`}>
      <div className={`max-w-md w-full space-y-8 ${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-2xl`}>
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Forgot Password</h2>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
            <input
              type="email"
              // value={email}
              // onChange={e => setEmail(e.target.value)}
              {...register("email")}
              required
              className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading || isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordForm; 