"use client";

import Image from "next/image";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import formatPrice from "@/utils/FormatPrice";
import { AnimatePresence, motion } from "framer-motion";
import useCart from "@/store/store";

import Button from "../Button/Button";

import EmptyCart from "../../../public/assets/empty-cart.png";
import Checkout from "../Checkout/Checkout";
import OrderConfirmed from "../OrderConfirmed/OrderConfirmed";

export default function Cart() {
  const cartListProduct = useCart((state: any) => state.cart);
  const toggleCartList = useCart((state: any) => state.toggleCartList);
  const addProduct = useCart((state: any) => state.addProduct);
  const removeProduct = useCart((state: any) => state.removeProduct);
  const totalAllProductPrice = cartListProduct.reduce((acc: any, item: any) => {
    return acc + item.unit_amount * item.quantity;
  }, 0);
  const onCheckout = useCart((state: any) => state.onCheckout);
  const setCheckout = useCart((state: any) => state.setCheckout);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        toggleCartList();
      }}
      className="fixed w-full h-screen left-0 top-0 bg-black/25 z-50"
    >
      <motion.div
        layout
        onClick={(e) => e.stopPropagation()}
        className="bg-base-200 absolute right-0 top-0 lg:w-2/5 w-full h-screen py-8 px-6 overflow-y-auto flex flex-col gap-4"
      >
        {onCheckout === "cart" && (
          <div
            className="text-sm font-medium cursor-pointer w-max"
            onClick={() => {
              toggleCartList();
            }}
          >
            Back to Store
          </div>
        )}

        {onCheckout === "checkout" && (
          <div
            className="text-sm font-medium cursor-pointer w-max"
            onClick={() => {
              setCheckout("cart");
            }}
          >
            Check your cart
          </div>
        )}

        {onCheckout === "cart" && (
          <div className="flex flex-col gap-2">
            {(cartListProduct || []).map((item: any) => {
              return (
                <motion.div layout key={item.id} className="flex py-4 gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="rounded-md h-26"
                    priority={true}
                  />
                  <div className="flex flex-col gap-1">
                    <div className="font-bold mb-1">{item.name}</div>
                    <div className="text-sm">
                      <span className="font-semibold">Price:</span>{" "}
                      <span className="text-primary font-medium">
                        {formatPrice(item.unit_amount)}
                      </span>
                    </div>
                    <div className="text-sm flex items-center gap-2">
                      <span className="font-semibold">Quantity:</span>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() => {
                          removeProduct({
                            id: item.id,
                            image: item.image,
                            name: item.name,
                            unit_amount: item.unit_amount,
                            quantity: item.quantity,
                          });
                        }}
                      >
                        <IoRemoveCircle />
                      </button>
                      <button
                        onClick={() => {
                          addProduct({
                            id: item.id,
                            image: item.image,
                            name: item.name,
                            unit_amount: item.unit_amount,
                            quantity: item.quantity,
                          });
                        }}
                      >
                        <IoAddCircle />
                      </button>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Total price:</span>{" "}
                      <span className="text-primary font-medium">
                        {formatPrice(item.quantity * item.unit_amount)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {cartListProduct.length > 0 && onCheckout === "cart" ? (
          <motion.div layout>
            <div className="border-t flex justify-between items-center pt-1 mb-2">
              <div className="font-bold">Total: </div>
              <div className="text-xl text-primary font-bold">
                {formatPrice(totalAllProductPrice)}
              </div>
            </div>

            <Button
              variant="basic"
              onClick={() => {
                setCheckout("checkout");
              }}
            >
              Checkout
            </Button>
          </motion.div>
        ) : null}

        {onCheckout === "checkout" && <Checkout />}
        {onCheckout === "success" && <OrderConfirmed />}

        <AnimatePresence>
          {!cartListProduct.length && onCheckout === "cart" && (
            <motion.div
              animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
              initial={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              exit={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75"
            >
              <div>Uhh ohh... it's empty :(</div>
              <Image
                src={EmptyCart}
                alt="Empty"
                width={200}
                height={200}
                priority={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
