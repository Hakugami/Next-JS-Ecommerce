import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {ProductService} from '@/services/product-service';
import {Product, ProductFilters, PaginatedResponse} from '@/types/product';

export const useProducts = (
    page: number = 1,
    pageSize: number = 10,
    filters?: ProductFilters
) => {
    const queryClient = useQueryClient();

    // Get products with pagination and filters
    const {
        data: products,
        isLoading,
        error,
    } = useQuery<PaginatedResponse<Product>>({
        queryKey: ['products', page, pageSize, filters],
        queryFn: () => ProductService.getProducts(page, pageSize, filters),
    });

    // Get a single product
    const useProduct = (id: string) => {
        return useQuery({
            queryKey: ['product', id],
            queryFn: () => ProductService.getProduct(id),
        });
    };

    // Get featured products
    const useFeaturedProducts = () => {
        return useQuery({
            queryKey: ['featuredProducts'],
            queryFn: ProductService.getFeaturedProducts,
        });
    };

    // Create product mutation
    const createProduct = useMutation({
        mutationFn: (newProduct: Omit<Product, 'id'>) =>
            ProductService.createProduct(newProduct),
        onSuccess: () => {
            // Invalidate products cache to trigger refetch
            queryClient.invalidateQueries({queryKey: ['products']}).then(r => r);
        },
    });

    // Update product mutation
    const updateProduct = useMutation({
        mutationFn: ({id, product}: { id: string; product: Partial<Product> }) =>
            ProductService.updateProduct(id, product),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']}).then(r => r);
        },
    });

    // Delete product mutation
    const deleteProduct = useMutation({
        mutationFn: (id: string) => ProductService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['products']}).then(r => r);
        },
    });

    return {
        products,
        isLoading,
        error,
        useProduct,
        useFeaturedProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}; 