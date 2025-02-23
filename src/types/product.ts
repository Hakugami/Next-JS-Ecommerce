export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  stock: number;
  image: string;
  specifications: Record<string, string>;
  brand: string;
  model: string;
  // Add missing fields
  discountPercentage: number;
  rating?: number;
  reviews?: Array<{
    id: number;
    user: {
      name: string;
      image: string;
    };
    rating: number;
    date: string;
    comment: string;
  }>;
  images?: string[];
}

export type ProductCategory =
  | "CPU"
  | "GPU"
  | "Motherboard"
  | "RAM"
  | "Storage"
  | "Power Supply"
  | "Case"
  | "Cooling";

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
