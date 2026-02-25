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
import { RegisterSchema } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/api/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

type RegisterData = z.infer<typeof RegisterSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    mode: "onChange",
    resolver: zodResolver(RegisterSchema),
  });

  const registerMutate = useMutation<any, AxiosError, RegisterData>({
    mutationKey: ["register"],
    mutationFn: async (data) => {
      await api.post("/auth/register", data);
    },

    onSuccess: () => {
      toast.success("User created successfully!");
      router.push("/auth/signin");
    },

    onError: (error) => {
      if (error.response) {
        const data = error.response.data as { message: string };
        toast.error(data.message);
      } else {
        console.error("Error: ", error);
      }
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: RegisterData) => {
    registerMutate.mutate(data);
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
              Name
            </label>
            <Input
              {...register("name")}
              type="text"
              placeholder="Enter your name"
              className="w-full h-10 px-4 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
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

          {/* Sign In Button */}
          <Button
            disabled={registerMutate.isPending}
            type="submit"
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-colors"
          >
            {registerMutate.isPending ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center text-sm text-gray-700">
          Already have an account? {""}
          <Link
            href="/auth/signin"
            className="font-medium text-gray-900 hover:underline transition-colors underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
