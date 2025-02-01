"use client";

import React, {createContext, useContext, useState, useEffect} from "react";
import {Product} from "@/types/product";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product) => void;
    addItemWithQuantity: (product: Product, quantity: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "pc-parts-cart";

export function CartProvider({children}: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error("Failed to parse saved cart:", error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (product: Product) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.product.id === product.id
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.product.id === product.id
                        ? {...item, quantity: item.quantity + 1}
                        : item
                );
            }

            return [...currentItems, {product, quantity: 1}];
        });
    };

    const addItemWithQuantity = (product: Product , quantity : number) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.product.id === product.id
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.product.id === product.id
                        ? {...item, quantity: item.quantity + quantity}
                        : item
                );
            }

            return [...currentItems, {product, quantity: quantity}];
        });
    };

    const removeItem = (productId: string) => {
        setItems((currentItems) =>
            currentItems.filter((item) => item.product.id !== productId)
        );
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(productId);
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.product.id === productId ? {...item, quantity} : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getItemCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotal = () => {
        return items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    };

    // Don't render children until initial cart is loaded
    if (!isLoaded) {
        return null;
    }

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                addItemWithQuantity,
                removeItem,
                updateQuantity,
                clearCart,
                getItemCount,
                getTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
