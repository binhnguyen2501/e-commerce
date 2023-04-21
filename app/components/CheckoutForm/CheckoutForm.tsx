"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import formatPrice from "@/utils/FormatPrice";

import Button from "../Button/Button";
import useCart from "@/store/store";

export default function CheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe: any = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setCheckout = useCart((state: any) => state.setCheckout);
  const cart = useCart((state: any) => state.cart);
  const totalAllProductPrice = cart.reduce((acc: any, item: any) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        redirect: "if_required",
      })
      .then((result: any) => {
        if (!result.error) {
          setCheckout("success");
        }
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <PaymentElement
        id="payment-element"
        options={{
          layout: "tabs",
        }}
      />
      <div className="my-4 flex items-center gap-2">
        <span className="font-bold">Total:</span>
        <span className="text-xl text-primary font-bold">
          {formatPrice(totalAllProductPrice)}
        </span>
      </div>
      <Button
        type="submit"
        variant="basic"
        disabled={isLoading || !stripe || !elements}
        isLoading={isLoading}
      >
        Pay now
      </Button>
    </form>
  );
}
