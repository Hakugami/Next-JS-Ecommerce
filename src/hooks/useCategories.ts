import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/product-service';
import { ProductCategory } from '@/types/product';

export function useCategories() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<ProductCategory[]>({
    queryKey: ['categories'],
    queryFn: ProductService.getCategories,
  });

  return {
    categories,
    isLoading,
    error,
  };
} 