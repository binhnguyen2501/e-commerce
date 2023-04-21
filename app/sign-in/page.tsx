"use client";

import React, { useState } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";

import Google from "../../public/assets/google.svg";
import Github from "../../public/assets/github.svg";
import Facebook from "../../public/assets/facebook.svg";
import Eye from "../../public/assets/eye.svg";
import EyeSlash from "../../public/assets/eye-slash.svg";

import styles from "../components/AuthLayout/AuthLayout.module.scss";

interface IFormData {
  email: string;
  password: string;
}

export default function Auth() {
  const { status } = useSession();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IFormData>();

  if (status === "authenticated") {
    redirect("/");
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: IFormData) =>
      await signIn("credentials", {
        redirect: false,
        ...data,
      }).then((res) => {
        if (res?.ok) {
          toast.success("Successfully signed in!");
        } else {
          toast.error(
            `${
              res?.error ===
              "Cannot read properties of null (reading 'password')"
                ? "No user found with email. Please sign up!"
                : res?.error
            }`
          );
        }
      }),
  });

  const onSubmit = handleSubmit((data) => {
    const dataForm = {
      email: data.email,
      password: data.password,
    };
    mutate(dataForm);
  });

  return (
    <AuthLayout>
      <div className="md:w-3/4 w-5/6 mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className={styles.title}>Sign In</div>
          <div className={styles.sub_title}>
            Join our e-commerce market where you can find everything you want
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className={styles.form_item_vertical}>
                <input
                  {...register("email", {
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    required: "You must specify a email",
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
                      required: "You must specify a password",
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          </form>
          <Button
            variant="secondary-no-outlined"
            onClick={() => signIn("google")}
            suffix={
              <Image
                src={Google}
                alt="Google"
                width={40}
                height={40}
                priority={true}
              />
            }
          >
            Sign In with Google
          </Button>
        </div>
        <div className={styles.navigate_auth_text}>
          don't have account yet,{" "}
          <Link href={"/sign-up"}>
            <div className={styles.highlight}>Sign Up</div>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
