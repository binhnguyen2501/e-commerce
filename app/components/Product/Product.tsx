"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import formatPrice from "@/utils/FormatPrice";
import { ProductType } from "@/app/types/Product";
import useCart from "@/store/store";

const Product = ({
  id,
  name,
  unit_amount,
  image,
  metadata,
  description,
}: ProductType) => {
  const { About } = metadata;
  const router = useRouter();
  const selectedProduct = useCart((state: any) => state.selectedProduct);

  return (
    <div
      onClick={() => {
        router.push(`/product/${id}`);
        selectedProduct({
          id,
          image,
          name,
          description,
          About,
          unit_amount,
        });
      }}
      className="cursor-pointer"
    >
      <Image
        src={image}
        alt={name}
        width={800}
        height={800}
        className="w-full h-96 object-cover rounded-lg"
        priority={true}
      />
      <div className="font-medium py-2">
        <h1>{name}</h1>
        <h2 className="text-sm font-bold text-primary">
          {unit_amount !== null ? formatPrice(unit_amount) : "N/A"}
        </h2>
      </div>
    </div>
  );
};

export default Product;
