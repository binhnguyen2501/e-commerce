"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Stripe from "stripe";
import { useThemeStore } from "@/store/store";

import Loading from "./components/Loading";
import Product from "./components/Product/Product";

import Error from "../public/assets/404.png";

const getProducts = async () => {
  const stripe = new Stripe(
    process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string,
    {
      apiVersion: "2022-11-15",
    }
  );
  const res = await stripe.products.list();

  const productsWithPrice = await Promise.all(
    res.data.map(async (item) => {
      const prices = await stripe.prices.list({
        product: item.id,
      });
      const About = item.metadata.About || "";

      return {
        id: prices.data[0].product,
        name: item.name,
        unit_amount: prices.data[0].unit_amount,
        image: item.images[0],
        description: item.description,
        metadata: { About },
      };
    })
  );

  return productsWithPrice;
};

export default function Home() {
  const themeStore: any = useThemeStore();
  const { data, error, isLoading } = useQuery<any[]>({
    queryFn: getProducts,
    queryKey: ["products"],
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src={Error} alt="404" priority={true} />
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className={`pb-7 ${
        themeStore.mode === "light" ? "bg-white" : "bg-[#2a303c]"
      }`}
    >
      <div className="mx-4 md:mx-20 xl:mx-44 grid grid-cols-fluid gap-12">
        {(data || []).map((item: any) => (
          <Product {...item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
