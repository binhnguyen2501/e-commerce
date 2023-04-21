"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import Button from "../Button/Button";

import Dance from "@/public/assets/dance.gif";
import useCart from "@/store/store";

export default function OrderConfirmed() {
  const setCheckout = useCart((state: any) => state.setCheckout);
  const toggleCartList = useCart((state: any) => state.toggleCartList);
  const setPaymentIntent = useCart((state: any) => state.setPaymentIntent);
  const clearCartList = useCart((state: any) => state.clearCartList);

  useEffect(() => {
    setPaymentIntent("");
    clearCartList();
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center my-12"
    >
      <div className="p-12 rounded-md text-center flex flex-col items-center">
        <h1 className="text-xl font-medium">Your order has been placed</h1>
        <h2 className="my-4 text-sm">Check your email for the receipt.</h2>
        <Image
          src={Dance}
          alt="success"
          className="py-8 rounded-lg"
          priority={true}
        />
        <Link href={"/dashboard"}>
          <Button
            variant="basic"
            className="flex-1"
            onClick={() => {
              setTimeout(() => {
                setCheckout("cart");
              }, 1000);
              toggleCartList();
            }}
          >
            Check your order
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
