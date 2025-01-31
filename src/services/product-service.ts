import { Product, ProductFilters, PaginatedResponse, ProductCategory } from '@/types/product';
import { get, post, put, del } from './api-client';

const PRODUCTS_ENDPOINT = '/products';

export const ProductService = {
  // Get all available categories
  getCategories: async (): Promise<ProductCategory[]> => {
    return ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Power Supply', 'Case', 'Cooling'];
  },

  // Get paginated products with filters
  getProducts: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    return get<PaginatedResponse<Product>>(PRODUCTS_ENDPOINT, {
      page,
      limit: pageSize,
      ...filters,
    });
  },

  // Get a single product by ID
  getProduct: async (id: string): Promise<Product> => {
    return get<Product>(`${PRODUCTS_ENDPOINT}/${id}`);
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<Product[]> => {
    return get<Product[]>(`${PRODUCTS_ENDPOINT}/featured`);
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    return get<Product[]>(PRODUCTS_ENDPOINT, { category });
  },

  // Create a new product (admin only in real app)
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    return post<Product>(PRODUCTS_ENDPOINT, product);
  },

  // Update a product (admin only in real app)
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    return put<Product>(`${PRODUCTS_ENDPOINT}/${id}`, product);
  },

  // Delete a product (admin only in real app)
  deleteProduct: async (id: string): Promise<void> => {
    return del(`${PRODUCTS_ENDPOINT}/${id}`);
  },
}; 