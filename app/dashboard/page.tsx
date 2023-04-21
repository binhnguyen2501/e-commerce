"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import dayjs from "dayjs";
import { useThemeStore } from "@/store/store";

import Loading from "../components/Loading";
import Error from "@/public/assets/404.png";
import formatPrice from "@/utils/FormatPrice";

const getOrders = async () => {
  const orders = axios.get("/api/orders").then((res) => res.data);
  return orders;
};

export default function Dashboard() {
  const themeStore: any = useThemeStore();
  const { data: session, status } = useSession();
  const { data, error, isLoading } = useQuery<any>({
    queryFn: getOrders,
    queryKey: ["orders"],
  });

  if (status === "unauthenticated") {
    redirect("/sign-in");
  }

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
      <div className="mx-4 md:mx-20 xl:mx-44">
        <div className="flex flex-col gap-1">
          <div className="text-xl font-bold">
            Welcome back {session?.user?.name}!
          </div>
          <div className="text-lg font-semibold">
            {data.length ? "Here your orders" : "No orders placed"}
          </div>
        </div>

        <div className="flex flex-col gap-10 mt-6">
          {data.map((item: any) => (
            <div key={item.id} className="rounded-lg p-8 bg-base-200">
              <div className="flex justify-between items-center md:flex-row flex-col gap-3 pb-6">
                <div className="text-lg font-medium flex-1">
                  Order reference: {item.id}
                </div>
                <div className="flex-1 w-full flex flex-col gap-2">
                  <div className="text-lg font-medium md:text-right text-left">
                    {dayjs(item.createdAt).format("DD/MM/YYYY - HH:mm")}
                  </div>
                  <div className="text-lg flex md:justify-end justify-start items-center gap-1">
                    <span className="font-medium">Status</span>
                    <span
                      className={`${
                        item.status === "complete"
                          ? "bg-primary"
                          : "bg-orange-500"
                      } text-white py-1 rounded-md px-2 mx-2 text-sm uppercase`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 border-y border-gray-200 py-6">
                {item.product.map((prod: any) => (
                  <div className="flex gap-6" key={prod.id}>
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      width={86}
                      height={86}
                      className="rounded-lg"
                      priority={true}
                    />
                    <div className="flex flex-col gap-2">
                      <div className="text-xl font-bold">{prod.name}</div>
                      <div className="flex flex-col">
                        <div>
                          Price:{" "}
                          <span className="font-semibold">
                            {formatPrice(prod.unit_amount)}
                          </span>
                        </div>
                        <div>
                          Quantity:{" "}
                          <span className="text-primary font-semibold">
                            {prod.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="font-medium text-xl pt-6 flex items-center justify-end gap-2">
                Total{" "}
                <span className="font-bold text-2xl text-primary">
                  {formatPrice(item.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
