"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const sidebarNavItems = [
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: "palette",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: "bell",
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: "lock-closed",
  },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session) {
    redirect("/auth/login");
  }

  // Redirect to appearance settings by default
  redirect("/settings/appearance");

  return (
    <div className="space-y-6 pb-16 block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{/* Content will be rendered here */}</div>
      </div>
    </div>
  );
}
