"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useCart, { useThemeStore } from "@/store/store";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import Image from "next/image";
import { motion } from "framer-motion";

import Delivery from "@/public/assets/delivery.gif";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function Checkout() {
  const router = useRouter();
  const totalCartItem = useCart((state: any) => state.cart);
  const paymentIntent = useCart((state: any) => state.paymentIntent);
  const setPaymentIntent = useCart((state: any) => state.setPaymentIntent);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [stripeTheme, setStripeTheme] = useState<string>("stripe");
  const themeStore: any = useThemeStore();

  useEffect(() => {
    if (themeStore.mode === "light") {
      setStripeTheme("stripe");
    } else {
      setStripeTheme("night");
    }

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: totalCartItem,
        payment_intent_id: paymentIntent,
      }),
    })
      .then((res) => {
        if (res.status === 403) {
          return router.push("/sign-in");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.paymentIntent.client_secret);
        setPaymentIntent(data.paymentIntent.id);
      });
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: stripeTheme,
      labels: "floating",
    },
  };

  return (
    <div>
      {!clientSecret && (
        <div className="flex items-center justify-center flex-col gap-3 mt-24">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            className="text-xl font-semibold"
          >
            Prepping your order
          </motion.h1>
          <Image
            src={Delivery}
            alt="delivery"
            className="rounded-lg"
            priority={true}
          />
        </div>
      )}
      {clientSecret && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </motion.div>
      )}
    </div>
  );
}
