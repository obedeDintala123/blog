"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/api/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type LoginData = z.infer<typeof LoginSchema>;

export default function SignInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    mode: "onChange",
    resolver: zodResolver(LoginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation<any, AxiosError, LoginData>({
    mutationKey: ["login"],
    mutationFn: async (data) => {
      const response = await api.post("auth/login", data);
      return response.data;
    },

    onSuccess: (data) => {
      const { token } = data;
      Cookies.set("token", token, { expires: 7 });
      toast.success("Successful login");
      router.push("/");
    },

    onError: (error) => {
      if (error.response) {
        // const data = error.response.data as { message: string };
        toast.error("Error signing in");
      } else {
        console.error("Error: ", error);
      }
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-12">
          <Image width={100} height={100} src={"/blog-logo.svg"} alt="logo" />
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full h-10 px-4 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full h-10 px-4 bg-gray-50 border-gray-200 text-gray-900 rounded-xl placeholder:text-gray-400 pr-10 "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-left">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-700 hover:text-gray-900 underline transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-colors"
          >
            {loginMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center text-sm text-gray-700">
          &apos; have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-gray-900 hover:underline transition-colors underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
