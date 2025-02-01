"use client";

import { SidebarNav } from "./components/sidebar-nav";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const sidebarNavItems = [
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: "Palette",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: "Bell",
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: "Shield",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-0.5 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
