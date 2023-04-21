"use client";

import { ReactNode, useState, useEffect } from "react";
import Loading from "@/app/components/Loading/Loading";
import { useThemeStore } from "@/store/store";

export default function HydrateProvider({ children }: { children: ReactNode }) {
  const [isHydrate, setIsHydrate] = useState<boolean>(false);

  const themeStore: any = useThemeStore();

  useEffect(() => {
    setIsHydrate(true);
  }, []);

  return (
    <>
      {isHydrate ? (
        <body data-theme={themeStore.mode}>{children}</body>
      ) : (
        <body>
          <Loading />
        </body>
      )}
    </>
  );
}
