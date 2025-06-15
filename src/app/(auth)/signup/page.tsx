"use client";

import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Input, Button, Link } from "@nextui-org/react";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, signUpSchemaType } from "@/lib/validation/signUpSchema";

import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<signUpSchemaType> = async (data) => {
    console.log("Submitting signup form with data:", data); // 🔍 Debug log

    try {
      const res = await axios.post("/api/auth/signup", data);
      toast.success(res.data.message || "Account created!");
      reset();
      router.push("/");
    } catch (error: any) {
      console.error("Signup failed:", error); // 🔍 Debug log
      const msg =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);
    }
  };

  return (
    <main className="flex items-center justify-center h-[calc(100vh_-_75px)]">
      <div className="sm:w-2/5 w-11/12">
        <h1 className="text-3xl font-semibold mb-4">Create an account</h1>

        <p className="mb-10">
          Already have an account?{" "}
          <Link as={NextLink} href="/signin" underline="always">
            Sign in
          </Link>
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)} // ✅ simplified submit handler
          className="flex flex-col gap-4"
        >
          <Input
            label="Name"
            {...register("name")}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />
          <Input
            label="Username"
            {...register("username")}
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register("email")}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register("password")}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            className="w-full mt-4"
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
        </form>
      </div>
    </main>
  );
}
