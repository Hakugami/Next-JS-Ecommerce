import { NextResponse } from 'next/server';
import { Product, ProductCategory } from '@/types/product';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'AMD Ryzen 9 5900X',
    price: 499.99,
    description: '12 cores, 24 threads, up to 4.8 GHz max boost',
    category: 'CPU',
    stock: 10,
    image: 'https://placehold.co/600x400/222222/FFFFFF?text=AMD+Ryzen+9+5900X',
    specifications: {
      cores: '12',
      threads: '24',
      baseSpeed: '3.7 GHz',
      boostSpeed: '4.8 GHz',
      cache: '64MB',
      tdp: '105W'
    },
    brand: 'AMD',
    model: 'Ryzen 9 5900X',
    discountPercentage: 0
  },
  {
    id: '2',
    name: 'NVIDIA GeForce RTX 4080',
    price: 1199.99,
    description: 'High-performance gaming graphics card with ray tracing',
    category: 'GPU',
    stock: 5,
    image: 'https://placehold.co/600x400/076900/FFFFFF?text=RTX+4080',
    specifications: {
      memory: '16GB GDDR6X',
      coreClock: '2.21 GHz',
      rtCores: '76',
      tensorCores: '304',
      hdmi: '1x HDMI 2.1',
      displayPort: '3x DisplayPort 1.4a'
    },
    brand: 'NVIDIA',
    model: 'RTX 4080',
    discountPercentage: 0
  },
  {
    id: '3',
    name: 'Samsung 970 EVO Plus 1TB',
    price: 99.99,
    description: 'NVMe M.2 SSD with exceptional performance',
    category: 'Storage',
    stock: 15,
    image: 'https://placehold.co/600x400/000069/FFFFFF?text=Samsung+SSD',
    specifications: {
      capacity: '1TB',
      interface: 'PCIe Gen 3.0 x4',
      readSpeed: '3,500 MB/s',
      writeSpeed: '3,300 MB/s',
      form: 'M.2 2280',
      endurance: '600 TBW'
    },
    brand: 'Samsung',
    model: '970 EVO Plus',
    discountPercentage: 0
  },
  {
    id: '4',
    name: 'ASUS ROG STRIX B550-F',
    price: 179.99,
    description: 'AMD AM4 gaming motherboard with PCIe 4.0',
    category: 'Motherboard',
    stock: 8,
    image: 'https://placehold.co/600x400/690000/FFFFFF?text=ASUS+ROG+STRIX',
    specifications: {
      socket: 'AM4',
      chipset: 'B550',
      memorySlots: '4',
      maxMemory: '128GB',
      pciSlots: '2x PCIe 4.0',
      formFactor: 'ATX'
    },
    brand: 'ASUS',
    model: 'ROG STRIX B550-F',
    discountPercentage: 0
  }
];

// GET handler for products
export async function GET(request: Request) {
  // Get URL and search params
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const category = searchParams.get('category') as ProductCategory | null;
  const minPrice = Number(searchParams.get('minPrice')) || undefined;
  const maxPrice = Number(searchParams.get('maxPrice')) || undefined;
  const inStock = searchParams.get('inStock') === 'true' ? true : 
                 searchParams.get('inStock') === 'false' ? false : undefined;

  // Filter products
  let filteredProducts = [...mockProducts];

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
  }

  if (inStock !== undefined) {
    filteredProducts = filteredProducts.filter(p => inStock ? p.stock > 0 : p.stock === 0);
  }

  // Calculate pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedProducts = filteredProducts.slice(start, end);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return paginated response
  return NextResponse.json({
    data: paginatedProducts,
    total: filteredProducts.length,
    page,
    pageSize: limit,
    totalPages: Math.ceil(filteredProducts.length / limit)
  });
} 