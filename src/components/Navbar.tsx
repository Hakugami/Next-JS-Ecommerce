"use client";

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {motion} from "framer-motion";
import {Menu, X} from "lucide-react";
import {Button} from "./ui/button";
import {Sheet, SheetContent, SheetTrigger} from "./ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {useCategories} from "@/hooks/useCategories";
import {CartDropdown} from "./CartDropdown";
import {ThemeToggle} from "./ThemeToggle";
import {useSession, signOut} from "next-auth/react";
import {SearchBar} from "./SearchBar";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const {categories, isLoading} = useCategories();
    const {data: session} = useSession();

    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <motion.div
                        initial={{scale: 0.5, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{duration: 0.3}}
                    >
            <span
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              PC Parts
            </span>
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <div className="flex-1">
                        <SearchBar/>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">Categories</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {!isLoading &&
                                categories?.map((category) => (
                                    <DropdownMenuItem
                                        key={category}
                                        asChild
                                        className="hover:bg-accent rounded-md cursor-pointer"
                                    >
                                        <Link
                                            href={`/products?category=${encodeURIComponent(
                                                category
                                            )}`}
                                        >
                                            {category}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link
                        href="/products"
                        className={`text-sm font-medium transition-colors hover:text-primary ${
                            pathname === "/products"
                                ? "text-primary"
                                : "text-muted-foreground"
                        }`}
                    >
                        All Products
                    </Link>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle/>
                        <CartDropdown/>

                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user?.image ?? ""}/>
                                            <AvatarFallback>
                                                {session.user?.name?.[0] ?? "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders">Orders</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button asChild variant="default">
                                <Link href="/auth/login">Sign in</Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">Menu</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-6 w-6"/>
                                    </Button>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Link
                                        href="/products"
                                        className="px-4 py-2 text-sm hover:bg-accent rounded-md"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        All Products
                                    </Link>
                                    {!isLoading &&
                                        categories?.map((category) => (
                                            <Link
                                                key={category}
                                                href={`/products?category=${encodeURIComponent(
                                                    category
                                                )}`}
                                                className="px-4 py-2 text-sm hover:bg-accent rounded-md"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {category}
                                            </Link>
                                        ))}
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex flex-col space-y-2">
                                        {session ? (
                                            <>
                                                <Link
                                                    href="/profile"
                                                    className="px-4 py-2 text-sm hover:bg-accent rounded-md"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    Profile
                                                </Link>
                                                <Link
                                                    href="/orders"
                                                    className="px-4 py-2 text-sm hover:bg-accent rounded-md"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    Orders
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    className="px-4 py-2 text-sm hover:bg-accent rounded-md"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    Settings
                                                </Link>
                                                <button
                                                    className="px-4 py-2 text-sm text-left hover:bg-accent rounded-md"
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        signOut();
                                                    }}
                                                >
                                                    Log out
                                                </button>
                                            </>
                                        ) : (
                                            <Link
                                                href="/login"
                                                className="px-4 py-2 text-sm hover:bg-accent rounded-md"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Sign in
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 px-4">
                                    <ThemeToggle/>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
