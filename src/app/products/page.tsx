import { Suspense } from 'react';
import { ProductsGrid } from './components/ProductsGrid';
import { ProductsLoading } from './components/ProductsLoading';

interface Props {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  // Await searchParams at the top level
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <Suspense fallback={<ProductsLoading />}>
        <ProductsGrid searchParams={params} />
      </Suspense>
    </div>
  );
}