import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema } from "../../schema/AuthSchema";
import { z } from "zod";
import { toast } from "sonner";

interface VerifyOtpFormProps {
  onVerify: (otp: string) => void;
  onResend: () => void;
  isDark: boolean;
  onBack: () => void;
}

const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({
  onVerify,
  onResend,
  isDark,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  type VerifyOtpInputs = { otp: string };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<VerifyOtpInputs>({
    defaultValues: { otp: "" },
  });

  const onFormSubmit = async (data: VerifyOtpInputs) => {
    setIsLoading(true);
    const otpArr = data.otp.split("");
    try {
      verifyOtpSchema.parse({ otp: otpArr });
      await onVerify(data.otp);
      toast.success("OTP verified successfully");
    } catch (error: any) {
      toast.error(error.response.data.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await onResend();
      toast.success("OTP resend successful");
      setIsResending(false);
    } catch (error: any) {
      toast.error(error.response.data.message || "OTP resend failed");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      } px-4`}
    >
      <div
        className={`max-w-md w-full space-y-8 ${
          isDark ? "bg-gray-800" : "bg-white"
        } p-8 rounded-2xl shadow-2xl`}
      >
        <div className="text-center">
          <h2
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Verify OTP
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Enter the OTP sent to your email
          </p>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              OTP
            </label>
            <input
              type="text"
              maxLength={6}
              {...register("otp")}
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="Enter OTP"
            />
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">
                {errors.otp.message as string}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading || isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </form>
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className={`text-sm ${
              isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors`}
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className={`text-sm ${
              isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            } transition-colors`}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
