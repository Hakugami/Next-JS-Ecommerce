"use client";

import { ProfileForm } from "@/components/profile/ProfileForm";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile information and preferences.
        </p>
      </div>
      <Separator />
      <ProfileForm 
        user={{
          id: session?.user?.id || "",
          name: session?.user?.name || null,
          email: session?.user?.email || null,
          image: session?.user?.image || null,
          address: session?.user?.address || null,
          city: session?.user?.city || null,
          zipCode: session?.user?.zipCode || null,
        }} 
      />
    </div>
  );
}
