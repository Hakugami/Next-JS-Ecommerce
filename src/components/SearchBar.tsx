"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/StarRating";
import { DialogTitle } from "@/components/ui/dialog";

// Mock data - replace with API call
const mockProducts = [
  {
    id: "1",
    name: "AMD Ryzen 9 5950X",
    category: "Processors",
    price: 799.99,
    rating: 4.8,
  },
  {
    id: "2",
    name: "NVIDIA RTX 4090",
    category: "Graphics Cards",
    price: 1599.99,
    rating: 4.9,
  },
  // Add more products...
];

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
}

export function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Replace with actual API call
        const searchResults = mockProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            product.category
              .toLowerCase()
              .includes(debouncedQuery.toLowerCase())
        );
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    handleSearch().then(r => r);
  }, [debouncedQuery]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (product: Product) => {
    setOpen(false);
    router.push(`/products/${product.id}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-10 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-96"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search products...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-8 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty className="py-6 text-center text-sm">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Products">
              {results.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product)}
                  className="px-4 py-2"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                      <span className="font-medium">{product.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        in {product.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <StarRating rating={product.rating} />
                      <span className="font-semibold text-sm">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
