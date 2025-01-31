'use client';

import Link from "next/link";
import { useProducts } from "../hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductsGrid } from "./products/components/ProductsGrid";

export default function Home() {
  const { useFeaturedProducts } = useProducts();
  const { data: featuredProducts, isLoading, error } = useFeaturedProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-400 text-white">
        <CardContent className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to PC Parts Store</h1>
          <p className="text-xl from-gray-600 to-purple-400 mb-6">
              Build your dream PC with premium components</p>
          <Button asChild size="lg" className="bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 hover:shadow-lg hover:scale-105 hover:transition-transform hover:duration-300 hover:ease-in-out hover:text-gray-200">
            <Link href="/products">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <ProductsGrid 
          products={featuredProducts} 
          showFilters={false}
          columns={3}
        />
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 black">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Power Supply', 'Case', 'Cooling'].map((category) => (
            <Card key={category} className="hover:shadow-lg hover:scale-105 hover:transition-transform hover:duration-300 hover:ease-in-out
            hover:text-gray-200 hover:bg-gradient-to-br from-purple-600 to-blue-500 hover:cursor-pointer">
              <CardContent className="p-4 text-center">
                <Link href={`/products?category=${category.toLowerCase()}`} className="block">
                  {category}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
