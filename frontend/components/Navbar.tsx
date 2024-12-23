"use client";

import * as React from "react";
import Link from "next/link";

import { removeCookieWithKey, getCookieWithKey } from "../app/utils/cookie";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";

export function NavBar() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>();
  const token = getCookieWithKey("token");

  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const user = getCookieWithKey("user");
        if (user) {
          const userData: Object = JSON.parse(user);
          console.log("userData", userData);
          setUser(userData);
        }
        if (!token) return;
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, []);
  const signout = () => {
    removeCookieWithKey("token");
    removeCookieWithKey("user");
    router.push("/login");
  };

  return (
    <div
      className="relative flex left-[40%] m-[22px] px-[22px]"
      onClick={() => {
        console.log("users", user);
      }}
    >
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/contract" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Contracts
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {user?.roles?.find((item: any) =>
            item.name.toLowerCase().includes("user")
          ) && (
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>
              <Link href="/uploadFile" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Upload File
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem>
            <Button onClick={signout}>
                  Log out
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
