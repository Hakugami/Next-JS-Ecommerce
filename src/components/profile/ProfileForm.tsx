"use client";

import {useState, useCallback, useMemo} from "react";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import axios, {AxiosError} from "axios";
import {useUploadThing} from "@/utils/uploadthing";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/Icons";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ImageUpload} from "@/components/ui/image-upload";
import {useSession} from "next-auth/react";
import {Card, CardContent} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {useToast} from "@/hooks/use-toast";

const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, {message: "Name must be at least 2 characters."})
        .max(50, {message: "Name cannot be longer than 50 characters."}),
    email: z
        .string()
        .email({message: "Please enter a valid email address."})
        .min(5, {message: "Email must be at least 5 characters."})
        .max(100, {message: "Email cannot be longer than 100 characters."}),
    image: z.string().nullable().optional(),
    address: z
        .string()
        .min(5, {message: "Address must be at least 5 characters."})
        .max(100, {message: "Address cannot be longer than 100 characters."})
        .optional()
        .nullable(),
    city: z
        .string()
        .min(2, {message: "City must be at least 2 characters."})
        .max(50, {message: "City cannot be longer than 50 characters."})
        .optional()
        .nullable(),
    zipCode: z
        .string()
        .regex(/^[0-9]{5}(-[0-9]{4})?$/, {message: "Please enter a valid ZIP code."})
        .optional()
        .nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
    user:
        | {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        address?: string | null;
        city?: string | null;
        zipCode?: string | null;
    }
        | undefined;
}

export function ProfileForm({user}: ProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const {startUpload} = useUploadThing("profileImage");
    const {data: session, update} = useSession();
    const {toast} = useToast();

    const defaultValues = useMemo(() => ({
        name: user?.name || "",
        email: user?.email || "",
        image: user?.image ?? null, // Use null coalescing
        address: user?.address || "",
        city: user?.city || "",
        zipCode: user?.zipCode || "",
    }), [user]);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
    });

    const handleImageUpload = useCallback(async (imageData: string) => {
        setIsImageUploading(true);
        try {
            const file = await fetch(imageData)
                .then((res) => res.blob())
                .then(
                    (blob) =>
                        new File([blob], "profile.png", {type: "image/png"})
                );

            const uploadResult = await startUpload([file]);
            if (!uploadResult?.[0]?.url) {
                throw new Error("Failed to upload image");
            }
            return uploadResult[0].url;
        } catch (error) {
            toast({
                title: "Error uploading image",
                description: "Please try again or skip image upload.",
                variant: "destructive",
            });
            return null;
        } finally {
            setIsImageUploading(false);
        }
    }, [startUpload, toast]);

    const onSubmit = useCallback(async (data: ProfileFormValues) => {
        try {
            setIsLoading(true);
            let imageUrl = data.image;

            if (data.image && data.image.startsWith("data:image")) {
                const uploadedUrl = await handleImageUpload(data.image);
                if (!uploadedUrl) return;
                imageUrl = uploadedUrl;
            }

            imageUrl = imageUrl || null;

            const response = await axios.patch("/api/user/profile", {
                name: data.name,
                email: data.email,
                image: imageUrl,
                address: data.address || null,
                city: data.city || null,
                zipCode: data.zipCode || null,
            });

            const responseData = {
                ...response.data,
                image: response.data.image || null,
            };

            form.reset(responseData);

            if (!response.data) {
                throw new Error("Failed to update profile");
            }

            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: data.name,
                    email: data.email,
                    image: imageUrl,
                    address: data.address || null,
                    city: data.city || null,
                    zipCode: data.zipCode || null,
                },
            });

            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
            });

            router.push("/")
        } catch (error) {
            console.error("Profile update error:", error);

            if (error instanceof AxiosError) {
                toast({
                    title: "Error updating profile",
                    description: error.response?.data || "Please check your input and try again.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [handleImageUpload, router, session, update, form, toast]);

    const handleCancel = useCallback(() => {
        router.back();
    }, [router]);

    const isSubmitDisabled = isLoading || isImageUploading || !form.formState.isDirty;
    const imageValue = form.watch("image");
    const nameValue = form.watch("name");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        src={imageValue || undefined}
                                        alt={nameValue || "Profile"}
                                    />
                                    <AvatarFallback className="text-lg">
                                        {nameValue?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({field}) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <ImageUpload
                                                    value={!field.value || field.value === "" ? null : field.value}
                                                    disabled={isLoading}
                                                    onChange={(value) => field.onChange(value)}
                                                    onRemove={() => field.onChange(null)}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-center">
                                                {isImageUploading
                                                    ? "Uploading image..."
                                                    : "Click to upload or drag and drop your profile picture"}
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator className="my-6"/>

                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Display Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your name"
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="max-w-md"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display name.
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="max-w-md"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Your email address will not be publicly displayed.
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator className="my-6"/>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Address Information</h3>

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Street Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your street address"
                                                    {...field}
                                                    value={field.value || ""}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your city"
                                                        {...field}
                                                        value={field.value || ""}
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="zipCode"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>ZIP Code</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your ZIP code"
                                                        {...field}
                                                        value={field.value || ""}
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Alert className="mt-6">
                                <Icons.eye className="h-4 w-4"/>
                                <AlertTitle>Just so you know</AlertTitle>
                                <AlertDescription>
                                    Your profile information will be used across the platform to
                                    personalize your experience.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isLoading}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitDisabled}
                    >
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                        )}
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
