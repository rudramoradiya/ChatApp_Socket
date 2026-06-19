import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, { message: "Email cannot be empty" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
      {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }
    ),
});

// Register schema
export const registerSchema = z
  .object({
    username: z
      .string({ message: "Username is required" })
      .min(3, { message: "Username should have at least 3 characters" })
      .max(50, { message: "Username should have at most 50 characters" }),
    email: z
      .string({ message: "Email is required" })
      .min(1, { message: "Email cannot be empty" })
      .email({ message: "Please enter a valid email address" }),
    phone: z
      .string({ message: "Phone number is required" })
      .min(10, { message: "Phone number must be 10 digits" })
      .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
    password: z
      .string({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
        {
          message:
            "Password must include uppercase, lowercase, number, and special character",
        }
      ),
  })

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, { message: "Email cannot be empty" })
    .email({ message: "Please enter a valid email address" }),
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        {
          message:
            "Password must be at least 6 characters and include uppercase, lowercase, number, and special character",
        }
      ),
    confirmPassword: z.string({ message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Verify OTP schema
export const verifyOtpSchema = z.object({
  otp: z
    .array(z.string()
      .length(1, { message: "OTP must be 6 digits" })
      .regex(/^\d$/, { message: "OTP must be 6 digits" })
    )
    .length(6, { message: "OTP must be 6 digits" }),
}); 