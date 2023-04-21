"use client";

import React from "react";
import Image from "next/image";
import formatPrice from "@/utils/FormatPrice";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import useCart from "@/store/store";

import Button from "@/app/components/Button/Button";

export default function Product() {
  const { status } = useSession();
  const product = useCart((state: any) => state.product);
  const addProduct = useCart((state: any) => state.addProduct);

  const handleAddToCart = () => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to buy this product!");
    } else {
      addProduct({
        id: product.id,
        image: product.image,
        name: product.name,
        unit_amount: product.unit_amount,
      });
    }
  };

  return (
    <div className="mx-4 md:mx-20 xl:mx-44 mb-7">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-24">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          className="w-full rounded-lg"
          priority={true}
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
          <p className="text-base font-regular">{product.description}</p>
          <p className="text-base font-regular">{product.About}</p>
          <div className="flex gap-2 mb-8 text-lg">
            <div className="font-semibold">Price:</div>
            <div className="font-semibold text-primary">
              {product.unit_amount && formatPrice(product.unit_amount)}
            </div>
          </div>
          <Button variant="basic" width={140} onClick={handleAddToCart}>
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
