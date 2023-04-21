import React, { ReactNode } from "react";
import { useThemeStore } from "@/store/store";

import styles from "./AuthLayout.module.scss";

interface IProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: IProps) {
  const themeStore: any = useThemeStore();

  return (
    <div
      className={`md:py-0 py-14 ${
        themeStore.mode === "light" ? "bg-white" : "bg-[#2a303c]"
      }`}
    >
      <div className="flex md:h-screen">
        <div className="m-auto bg-base-300 xl:w-3/5 lg:w-5/6 md:w-3/4 w-4/5 lg:h-3/4 h-4/5 flex lg:flex-row flex-col rounded-xl overflow-hidden">
          <div className="md:flex-1 flex-auto relative overflow-hidden md:h-full h-48">
            <div
              className={`${styles.context} px-10 text-[20px] md:text-[30px] xl:text-[40px]`}
            >
              <h1 className="font-semibold">
                It's a place for us to looking for
              </h1>
            </div>
            <div className={styles.area}>
              <ul className={styles.circles}>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div>
          <div className="flex-1 bg-base-300 lg:py-0 py-10">
            <div className="text-center h-full flex flex-col justify-center">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
