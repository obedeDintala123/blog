"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useMe } from "@/lib/requests";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  FilePlus,
  FileText,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import Cookies from "js-cookie";

export const Header = () => {
  const { data: user } = useMe();
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.reload();
  };

  if (isMobile) {
    return (
      <header className="flex items-center justify-between w-full px-4 py-4 md:px-8 md:py-8 lg:px-12 ">
        <Link href={""}>
          <Image src={"/blog-logo.svg"} width={75} height={75} alt="logo" />
        </Link>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="px-3 py-5 border border-[#d9d9d9] rounded-full flex items-center gap-2"
                variant="ghost"
              >
                <div className="flex justify-center items-center w-6 h-6 bg-black rounded-full text-white font-bold">
                  {user?.name.charAt(0)}
                </div>

                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                {/* Profile */}
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>

                {/* Posts → New Post */}

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <FileText className="w-4 h-4 mr-2" />
                    Posts
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => router.push("/posts")}>
                      <FileText className="w-4 h-4 mr-2" />
                      My Posts
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/post/create")}
                    >
                      <FilePlus className="w-4 h-4 mr-2" />
                      New Post
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Settings */}
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>

                {/* Logout */}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleLogout()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => router.push("/auth/signin")}
            className="bg-transparent border border-[#d9d9d9] px-8 py-5 rounded-full text-black font-bold"
          >
            Sign In
          </Button>
        )}
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between w-full px-4 py-4 md:px-8 md:py-8 lg:px-12 ">
      <Link href={""}>
        <Image src={"/blog-logo.svg"} width={100} height={100} alt="logo" />
      </Link>

      <nav className="flex items-center gap-8 border border-[#d9d9d9] py-2 px-8 rounded-full">
        <Link href={"/"}>Home</Link>
        <Link href={"#"}>Explore</Link>
        <Link href={"#"}>Tranding</Link>
      </nav>

      {user ? (
        <div className="flex items-center gap-6">
          <Link className="" href="/post/create">
            New Post{" "}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="px-4 py-5 border border-[#d9d9d9] rounded-full flex items-center gap-2"
                variant="ghost"
              >
                <div className="flex justify-center items-center w-6 h-6 bg-black rounded-full text-white font-bold">
                  {user?.name.charAt(0)}
                </div>
                <span>{user?.name.split(" ")[0]}</span>

                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                {/* Profile */}
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>

                {/* Posts → New Post */}
                <DropdownMenuItem onClick={() => router.push("/posts")}>
                  <FilePlus className="w-4 h-4 mr-2" />
                  My Posts
                </DropdownMenuItem>
                {/* Settings */}
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>

                {/* Logout */}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleLogout()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button
          onClick={() => router.push("/auth/signin")}
          className="bg-transparent border border-[#d9d9d9] px-8 py-5 rounded-full text-black font-bold"
        >
          Sign In
        </Button>
      )}
    </header>
  );
};
