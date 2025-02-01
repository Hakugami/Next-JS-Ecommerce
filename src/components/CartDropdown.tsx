"use client";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { useCart } from "@/providers/CartProvider";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export function CartDropdown() {
  const { items, getItemCount, getTotal, updateQuantity, removeItem } =
    useCart();
  const itemCount = getItemCount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center"
        >
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-[90vw] max-w-80"
      >
        <div className="p-4">
          <h3 className="font-semibold mb-4">Shopping Cart</h3>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Your cart is empty
            </p>
          ) : (
            <>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-medium leading-none">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-auto"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <Button asChild className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
