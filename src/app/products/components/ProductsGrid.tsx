"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { Product, ProductCategory } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { ProductsLoading } from "./ProductsLoading";
import { useCart } from "@/providers/CartProvider";
import { ShoppingCart, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

interface ParsedParams {
  id?: string;
  category?: string;
  page: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface ProductsGridProps {
  searchParams?: SearchParams;
  products?: Product[];
  showFilters?: boolean;
  columns?: number;
}

function parseSearchParams(params: SearchParams): ParsedParams {
  const id = params.id;
  const category = params.category;
  const page = params.page;
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const inStock = params.inStock;

  return {
    id: typeof id === "string" ? id : undefined,
    category: typeof category === "string" ? category : undefined,
    page: typeof page === "string" ? parseInt(page, 10) : 1,
    minPrice: typeof minPrice === "string" ? parseFloat(minPrice) : undefined,
    maxPrice: typeof maxPrice === "string" ? parseFloat(maxPrice) : undefined,
    inStock: typeof inStock === "string" ? inStock === "true" : undefined,
  };
}

export function ProductsGrid({
  searchParams,
  products: initialProducts,
  showFilters = true,
  columns = 3,
}: ProductsGridProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Only parse search params and set up filters if searchParams is provided
  const parsedParams = searchParams
    ? parseSearchParams(searchParams)
    : { page: 1 };

  const [filters, setFilters] = useState<{
    id: string | undefined;
    category: ProductCategory | undefined;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    inStock: boolean | undefined;
  }>({
    id: parsedParams.id,
    category: parsedParams.category as ProductCategory | undefined,
    minPrice: parsedParams.minPrice,
    maxPrice: parsedParams.maxPrice,
    inStock: parsedParams.inStock,
  });

  const [page, setPage] = useState(parsedParams.page);

  // Update filters when URL params change
  useEffect(() => {
    if (!searchParams) return;
    const newParams = parseSearchParams(searchParams);
    if (
      newParams.id !== filters.id ||
      newParams.category !== filters.category ||
      newParams.minPrice !== filters.minPrice ||
      newParams.maxPrice !== filters.maxPrice ||
      newParams.inStock !== filters.inStock ||
      newParams.page !== page
    ) {
      setFilters({
        id: newParams.id,
        category: newParams.category as ProductCategory | undefined,
        minPrice: newParams.minPrice,
        maxPrice: newParams.maxPrice,
        inStock: newParams.inStock,
      });
      setPage(newParams.page);
    }
  }, [
    searchParams,
    filters.id,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.inStock,
    page,
  ]);

  // Update URL when filters or page changes
  useEffect(() => {
    if (!searchParams) return;

    const params = new URLSearchParams();
    let hasChanges = false;
    const currentParams = parseSearchParams(searchParams);

    // Category filter
    if (filters.category !== currentParams.category) {
      if (filters.category) {
        params.set("category", filters.category);
        hasChanges = true;
      } else if (currentParams.category) {
        hasChanges = true; // Category was removed
      }
    }

    // Min Price filter
    if (filters.minPrice !== currentParams.minPrice) {
      if (filters.minPrice) {
        params.set("minPrice", filters.minPrice.toString());
        hasChanges = true;
      } else if (currentParams.minPrice) {
        hasChanges = true; // Min price was removed
      }
    }

    // Max Price filter
    if (filters.maxPrice !== currentParams.maxPrice) {
      if (filters.maxPrice) {
        params.set("maxPrice", filters.maxPrice.toString());
        hasChanges = true;
      } else if (currentParams.maxPrice) {
        hasChanges = true; // Max price was removed
      }
    }

    // In Stock filter
    if (filters.inStock !== currentParams.inStock) {
      if (filters.inStock !== undefined) {
        params.set("inStock", filters.inStock.toString());
        hasChanges = true;
      } else if (currentParams.inStock !== undefined) {
        hasChanges = true; // In stock filter was removed
      }
    }

    // Page number
    if (page !== currentParams.page) {
      if (page > 1) {
        params.set("page", page.toString());
        hasChanges = true;
      } else if (currentParams.page) {
        hasChanges = true; // Page was reset to 1
      }
    }

    if (hasChanges) {
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
    }
  }, [filters, page, pathname, router]);

  const {
    products: fetchedProducts,
    isLoading,
    error,
  } = useProducts(
    searchParams ? page : 1,
    9,
    searchParams ? filters : undefined
  );

  const { addItem } = useCart();
  const { toast } = useToast();

  const [addingToCart, setAddingToCart] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleAddToCart = async (product: Product) => {
    setAddingToCart((prev) => ({ ...prev, [product.id]: true }));

    try {
      addItem(product);
      setAddedToCart((prev) => ({ ...prev, [product.id]: true }));

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });

      // Reset the success state after 2 seconds
      setTimeout(() => {
        setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const displayProducts = initialProducts || fetchedProducts?.data;

  if (isLoading && !initialProducts) {
    return <ProductsLoading />;
  }

  if (error && !initialProducts) {
    return (
      <div className="text-center text-red-600">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      {showFilters && searchParams && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">Category</label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) => {
                    setFilters({
                      ...filters,
                      category:
                        value === "all"
                          ? undefined
                          : (value as ProductCategory),
                    });
                    setPage(1); // Reset page when filter changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {[
                      "CPU",
                      "GPU",
                      "Motherboard",
                      "RAM",
                      "Storage",
                      "Power Supply",
                      "Case",
                      "Cooling",
                    ].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filters */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">Minimum Price</label>
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice || ""}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      minPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    });
                    setPage(1); // Reset page when filter changes
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">Maximum Price</label>
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice || ""}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      maxPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    });
                    setPage(1); // Reset page when filter changes
                  }}
                />
              </div>

              {/* Stock Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600">Stock Status</label>
                <Select
                  value={
                    filters.inStock !== undefined
                      ? filters.inStock.toString()
                      : "all"
                  }
                  onValueChange={(value) => {
                    setFilters({
                      ...filters,
                      inStock: value === "all" ? undefined : value === "true",
                    });
                    setPage(1); // Reset page when filter changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock Status</SelectItem>
                    <SelectItem value="true">In Stock</SelectItem>
                    <SelectItem value="false">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}
      >
        {displayProducts?.map((product: Product) => (
          <Card key={product.id} className="group relative">
            <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-110"
                sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart[product.id]}
                  className={cn(
                    "bg-white text-black transition-all duration-200",
                    addedToCart[product.id]
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "hover:bg-white/90",
                    addingToCart[product.id] && "opacity-70"
                  )}
                >
                  {addingToCart[product.id] ? (
                    <span className="animate-pulse">Adding...</span>
                  ) : addedToCart[product.id] ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <p className="text-sm text-gray-500">{product.category}</p>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-blue-600">
                {formatPrice(product.price)}
              </p>
              <p
                className={`text-sm ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/products/${product.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {searchParams && fetchedProducts && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="px-4 py-2">
            Page {page} of {fetchedProducts.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === fetchedProducts.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
