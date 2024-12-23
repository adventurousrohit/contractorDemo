"use client";

import * as React from "react";
import Link from "next/link";
import { removeCookieWithKey, getCookieWithKey } from "../app/utils/cookie";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname()
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    try {
      const token = getCookieWithKey("token");
      if (typeof window !== "undefined") {
        const user = getCookieWithKey("user");
        if (user) {
          const userData: Object = JSON.parse(user);
          console.log("userData", userData);
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    
  }, [pathname]);

  const signout = () => {
    removeCookieWithKey("token");
    removeCookieWithKey("user");
    setUser(null); 
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="relative flex left-[40%] m-[22px] px-[22px]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/contract" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Contracts
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {user?.roles?.some((obj: any) => obj.name?.toLowerCase() === 'user') && (
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
