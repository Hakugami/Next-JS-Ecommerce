"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Star, StarHalf, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/providers/CartProvider";
import { Product } from "@/types/product";

// Mock data - replace with API call
const product: Product = {
  brand: "AMD",
  category: "CPU",
  image: "",
  model: "RYZEN",
  id: "1",
  name: "AMD Ryzen 9 5950X",
  description: "16-core, 32-Thread Unlocked Desktop Processor",
  price: 799.99,
  discountPercentage: 15,
  stock: 10,
  rating: 4.8,
  reviews: [
    {
      id: 1,
      user: {
        name: "John Doe",
        image: "/avatars/john.jpg",
      },
      rating: 5,
      date: "2024-01-15",
      comment: "Amazing processor, handles everything I throw at it!",
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        image: "/avatars/jane.jpg",
      },
      rating: 4,
      date: "2024-01-10",
      comment: "Great performance but runs a bit hot under load.",
    },
  ],
  specifications: {
    "Processor Count": "16",
    "Thread Count": "32",
    "Base Clock": "3.4 GHz",
    "Max Boost Clock": "4.9 GHz",
    "Total L3 Cache": "64 MB",
    TDP: "105W",
  },
  images: [
    "/images/products/cpu-main.jpg",
    "/images/products/cpu-angle.jpg",
    "/images/products/cpu-box.jpg",
  ],
};

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">({rating})</span>
    </div>
  );
}

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const { toast } = useToast();
  const { addItem, addItemWithQuantity } = useCart();

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  const handleAddToCart = async () => {
    try {
      addItemWithQuantity(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={(product.images ?? [])[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(product.images ?? []).map((image, index) => (
              <Button
                key={index}
                onClick={() => setSelectedImage(index)}
                title={`View image ${index + 1} of ${product.name}`}
                className={`relative aspect-square overflow-hidden rounded-md border ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2">
              <StarRating rating={product.rating ?? 0} />
            </div>
          </div>

          <div className="space-y-2">
            {product.discountPercentage > 0 && (
              <Badge className="bg-red-500">
                {product.discountPercentage}% OFF
              </Badge>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {formatPrice(discountedPrice)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>

            <p className="text-sm text-muted-foreground">
              {product.stock} units in stock
            </p>
          </div>

          <Separator />

          <Tabs defaultValue="specs">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="specs" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key}>
                          <dt className="text-sm font-medium text-muted-foreground">
                            {key}
                          </dt>
                          <dd className="text-sm font-semibold">{value}</dd>
                        </div>
                      )
                    )}
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>
                    {(product.reviews ?? []).length} reviews for this product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(product.reviews ?? []).map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src={review.user.image} />
                          <AvatarFallback>
                            {review.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{review.user.name}</p>
                          <div className="flex items-center">
                            <StarRating rating={review.rating} />
                            <span className="ml-2 text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                      <Separator />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
