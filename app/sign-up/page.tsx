"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter, redirect } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";

import Eye from "../../public/assets/eye.svg";
import EyeSlash from "../../public/assets/eye-slash.svg";

import styles from "../components/AuthLayout/AuthLayout.module.scss";

interface IFormData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function SignUp() {
  const router = useRouter();
  const { status } = useSession();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<IFormData>();

  if (status === "authenticated") {
    redirect("/");
  }

  const password = useRef<any>({});
  password.current = watch("password", "");

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: IFormData) =>
      await axios.post("/api/auth/register", data),
    onError(error: any) {
      toast.error(`${error.response.data.message}`);
    },
    onSuccess(res) {
      toast.success(`${res.data.message}`);
      router.push("/sign-in");
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const dataForm = {
      name: data.name,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
    };
    mutate(dataForm);
  });

  return (
    <AuthLayout>
      <div className="md:w-3/4 w-5/6 mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className={styles.title}>Sign Up</div>
          <div className={styles.sub_title}>
            Register your account and buy everything you want at our e-commerce
            market
          </div>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className={styles.form_item_vertical}>
              <input
                {...register("name", {
                  required: "You must specify username",
                })}
                type="text"
                className={classNames(styles.form_input, {
                  [styles.form_input_error]: errors.name,
                })}
                placeholder="Username"
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-xs text-left">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className={styles.form_item_vertical}>
              <input
                {...register("email", {
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  required: "You must specify email",
                })}
                type="email"
                name="email"
                className={classNames(styles.form_input, {
                  [styles.form_input_error]: errors.email,
                })}
                placeholder="Email"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs text-left">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className={styles.form_item_vertical}>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "You must specify password",
                  })}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={classNames(styles.form_input, {
                    [styles.form_input_error]: errors.password,
                  })}
                  placeholder="Password"
                />
                <div
                  className="absolute top-3 right-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Image
                    src={showPassword ? Eye : EyeSlash}
                    alt="eye"
                    priority={true}
                  />
                </div>
              </div>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs text-left">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className={styles.form_item_vertical}>
              <input
                {...register("confirm_password", {
                  required: "You must specify confirm password",
                  validate: (value) =>
                    value === password.current ||
                    "Password and confirmed password are different",
                })}
                type={showPassword ? "text" : "password"}
                name="confirm_password"
                className={classNames(styles.form_input, {
                  [styles.form_input_error]: errors.confirm_password,
                })}
                placeholder="Confirm password"
              />
            </div>
            {errors.confirm_password && (
              <span className="text-red-500 text-xs text-left">
                {errors.confirm_password.message}
              </span>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign Up"}
          </Button>
        </form>
        <div className={styles.navigate_auth_text}>
          have an account?{" "}
          <Link href={"/sign-in"}>
            <div className={styles.highlight}>Sign In</div>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
