"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import classNames from "classnames";
import { AiFillShopping } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import useCart from "@/store/store";

import Button from "../components/Button";
import Cart from "../components/Cart/Cart";

import User from "../../public/assets/user.svg";
import DarkLight from "../components/DarkLight/DarkLight";

export default function UserInfo() {
  const router = useRouter();
  const path = usePathname();
  const { data: session, status } = useSession();

  const totalCartItem = useCart((state: any) => state.cart);
  const isOpenCartList = useCart((state: any) => state.isOpen);
  const toggleCartList = useCart((state: any) => state.toggleCartList);

  if (status === "unauthenticated") {
    if (path === "/sign-in" || path === "/sign-up") {
      return <React.Fragment></React.Fragment>;
    } else {
      return (
        <div className="flex items-center gap-4">
          <DarkLight />
          <Link href={"/sign-in"}>
            <Button width={60}>Sign In</Button>
          </Link>
        </div>
      );
    }
  }

  return (
    <>
      <div className="flex items-center gap-6">
        <DarkLight />

        <div
          className="flex items-center relative cursor-pointer text-3xl"
          onClick={() => {
            toggleCartList();
          }}
        >
          <AiFillShopping />
          <AnimatePresence>
            {totalCartItem.length > 0 && (
              <motion.div
                key={totalCartItem.length}
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                className="bg-primary text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center"
              >
                {totalCartItem.length}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="dropdown dropdown-end cursor-pointer">
          <Image
            src={session?.user?.image || User}
            alt={session?.user?.name || ""}
            width={session?.user?.image ? 50 : 40}
            height={session?.user?.image ? 50 : 40}
            className={classNames("rounded-full", {
              ["border-2 border-[#e60112] bg-base-200"]: !session?.user?.image,
            })}
            tabIndex={0}
            priority={true}
          />
          <ul
            tabIndex={0}
            className="dropdown-content menu px-3 py-2 flex flex-col gap-2 shadow bg-base-200 rounded-box w-32 mt-2"
          >
            <div
              onClick={() => {
                router.push("/dashboard");
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }}
              className="hover:bg-base-200 px-3 py-2 rounded-md font-regular"
            >
              Orders
            </div>
            <div
              onClick={() => {
                signOut();
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }}
              className="hover:bg-base-200 px-3 py-2 rounded-md text-red-500 font-medium"
            >
              Sign out
            </div>
          </ul>
        </div>
      </div>
      <AnimatePresence>{isOpenCartList && <Cart />}</AnimatePresence>
    </>
  );
}
